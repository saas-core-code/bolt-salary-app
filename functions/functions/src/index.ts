import { Request, Response } from 'express';

const functions = require('firebase-functions');
const { google } = require('googleapis');
const cors = require('cors');

const corsHandler = cors({ origin: true });

const REWARD_RATE = 0.6;
const TAX_RATE = 0.1021;
const EXCHANGE_RATE_API = 'https://open.er-api.com/v6/latest/USD';



exports.saveReward = functions.https.onRequest((req: Request, res: Response) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, dollarIncome } = req.body;

    if (!username || !dollarIncome) {
      return res.status(400).json({ message: 'usernameとdollarIncomeは必須です' });
    }

    try {
      // レート取得
      const rateRes = await fetch(EXCHANGE_RATE_API);
      const rateData = await rateRes.json();
      const rate = rateData?.rates?.JPY || 143.2;

      // 報酬計算
      const preTax = dollarIncome * rate * REWARD_RATE;
      const tax = preTax * TAX_RATE;
      const afterTax = preTax - tax;

      // 日付整形
      const now = new Date();
      const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

      // Google Sheets認証
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });
      const spreadsheetId = '1e7ZRyDjgXuXPFwJYLktwprbD2O-o_hsLb29Lj8e0HLg'; // ←副隊長のスプレッドID

      // 書き込み
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'シート1!A:G',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            formattedDate,
            username,
            dollarIncome,
            rate,
            Math.floor(preTax),
            Math.floor(tax),
            Math.floor(afterTax)
          ]]
        }
      });

      return res.status(200).json({ success: true, message: '保存完了！' });
    } catch (error) {
      console.error('保存エラー:', error);
      return res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  });
});