export interface User {
  id: string;
  name: string;
}

export interface RewardRecord {
  id: string;
  date: string;
  userId: string;
  usdAmount: number;
  exchangeRate: number;
  beforeTax: number;
  tax: number;
  afterTax: number;
}

export interface ExchangeRateResponse {
  rates: {
    JPY: number;
  };
}