import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { REWARD_RATE, TAX_RATE } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateRewards(usd: number, rate: number) {
  const beforeTax = usd * rate * REWARD_RATE;
  const tax = beforeTax * TAX_RATE;
  const afterTax = beforeTax - tax;
  
  return {
    beforeTax: Math.ceil(beforeTax),
    tax: Math.ceil(tax),
    afterTax: Math.ceil(afterTax)
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).format(new Date(date))
    .replace('月', '/')
    .replace('日', '');
}