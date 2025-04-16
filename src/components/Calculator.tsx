import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRewards } from '@/hooks/useRewards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateRewards, formatCurrency } from '@/lib/utils';
import { EXCHANGE_RATE_API } from '@/lib/constants';
import { RewardHistory } from './RewardHistory';
import { RewardCharts } from './RewardCharts';
import { RewardCalendar } from './RewardCalendar';
import { RewardSimulator } from './RewardSimulator';
import { PerformanceMetrics } from './PerformanceMetrics';
import type { ExchangeRateResponse } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, DollarSign, TrendingUp, Receipt, PartyPopper } from 'lucide-react';

export function Calculator() {
  const [usd, setUsd] = useState('');
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // 保存中状態を追加
  const [showHistory, setShowHistory] = useState(false);
  const [, setLastSavedAmount] = useState<number | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const user = useAuth((state) => state.user);
  const addRecord = useRewards((state) => state.addRecord);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(EXCHANGE_RATE_API);
        const data: ExchangeRateResponse = await response.json();
        setRate(data.rates.JPY);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        toast({
          title: 'エラー',
          description: '為替レートの取得に失敗しました。',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchRate();
  }, [toast]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    document.querySelectorAll('.scroll-fade').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [showHistory]);

  // Calculate rewards based on current input
  const currentAmount = Number(usd) || 0;
  const { beforeTax, tax, afterTax } = calculateRewards(currentAmount, rate);

  const handleSave = async () => {
    if (!user || !usd || Number(usd) <= 0) {
      toast({
        title: 'エラー',
        description: '有効なドル収益を入力してください。',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true); // 保存処理開始
      
      // Firebase Functionsにデータを送信
      const response = await fetch("https://savereward-ubluu5vozq-uc.a.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: user,
          dollarIncome: Number(usd)
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'スプレッドシートへの保存に失敗しました');
      }

      // ローカルステート更新（元の処理を維持）
      const newRecord = {
        userId: user,
        usdAmount: Number(usd),
        exchangeRate: rate,
        beforeTax,
        tax,
        afterTax,
      };

      addRecord(newRecord);
      setLastSavedAmount(afterTax);

      toast({
        title: 'おつかれさまでした 💐',
        description: '今日も記録、ありがとう ✨',
      });

      setUsd('');
      setShowHistory(true);
    } catch (error) {
      console.error('保存エラー:', error);
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : '保存中にエラーが発生しました。',
        variant: 'destructive',
      });
    } finally {
      setSaving(false); // 保存処理完了
    }
  };

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setUsd(value);
      setLastSavedAmount(null); // Reset lastSavedAmount when input changes
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Use afterTax directly since we want to show real-time calculations
  const displayAmount = afterTax;

  return (
    <div className="space-y-8">
      <Card 
        className={`
          max-w-2xl mx-auto glass-card transition-all duration-700
          ${isInputFocused ? 'shadow-xl shadow-pink-200/30' : ''}
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              今日の報酬を記録する
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="relative">
            <div className="absolute -top-3 left-4 px-2 bg-white/80 backdrop-blur-sm rounded-full">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-pink-200" />
                今日のドル収益
              </label>
            </div>
            <Input
              type="text"
              value={usd}
              onChange={handleUsdChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="例：200"
              className="h-16 text-2xl px-6 rounded-2xl bg-white/80 border-pink-200/50 focus:border-pink-300/50 transition-all duration-300 placeholder:text-gray-200"
            />
          </div>

          <div className="grid gap-4 p-6 bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-2xl backdrop-blur-sm border border-pink-100/20">
            <div className="flex items-center gap-3 text-gray-400">
              <TrendingUp className="w-5 h-5 text-pink-300" />
              <span className="text-sm">ドル円レート</span>
              <span className="ml-auto font-medium">{rate.toFixed(1)} 円</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-400">
              <DollarSign className="w-5 h-5 text-pink-300" />
              <span className="text-sm">税引前報酬</span>
              <span className="ml-auto font-medium">{formatCurrency(beforeTax)}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-400">
              <Receipt className="w-5 h-5 text-pink-300" />
              <span className="text-sm">源泉徴収額</span>
              <span className="ml-auto font-medium text-red-300">-{formatCurrency(tax)}</span>
            </div>
            
            <div className="mt-2 p-6 bg-white/60 rounded-xl border border-pink-100/30 shadow-lg shadow-pink-100/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <PartyPopper className="w-6 h-6 text-pink-400" />
                <h3 className="text-base font-medium text-gray-400">本日のお給料</h3>
              </div>
              <p className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {formatCurrency(displayAmount)}
              </p>
            </div>
          </div>

          <Button
            className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleSave}
            disabled={!usd || Number(usd) <= 0 || saving}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                保存中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                保存する
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {showHistory && (
        <div className="space-y-8">
          <div className="scroll-fade from-bottom">
            <PerformanceMetrics />
          </div>
          <div className="scroll-fade from-left">
            <RewardHistory />
          </div>
          <div className="scroll-fade from-right">
            <RewardCharts />
          </div>
          <div className="scroll-fade from-left">
            <RewardCalendar />
          </div>
          <div className="scroll-fade from-right">
            <RewardSimulator />
          </div>
        </div>
      )}
    </div>
  );
}