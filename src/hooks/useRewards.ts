import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RewardRecord } from '@/types';

interface RewardsState {
  records: RewardRecord[];
  addRecord: (record: Omit<RewardRecord, 'id' | 'date'>) => void;
  deleteRecord: (id: string) => void;
  getLastNRecords: (n: number) => RewardRecord[];
  getMonthlyTotals: (months: number) => { month: string; total: number }[];
  getRecordsByMonth: (year: number, month: number) => RewardRecord[];
}

export const useRewards = create<RewardsState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => {
        const newRecord: RewardRecord = {
          ...record,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
        };
        set((state) => ({
          records: [newRecord, ...state.records],
        }));
      },
      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        }));
      },
      getLastNRecords: (n) => {
        return get().records
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, n);
      },
      getMonthlyTotals: (months) => {
        const now = new Date();
        const result = [];
        
        for (let i = 0; i < months; i++) {
          const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStr = targetDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
          
          const total = get().records
            .filter(record => {
              const recordDate = new Date(record.date);
              return recordDate.getMonth() === targetDate.getMonth() &&
                     recordDate.getFullYear() === targetDate.getFullYear();
            })
            .reduce((sum, record) => sum + record.afterTax, 0);
          
          result.push({ month: monthStr, total });
        }
        
        return result;
      },
      getRecordsByMonth: (year, month) => {
        return get().records
          .filter(record => {
            const date = new Date(record.date);
            return date.getFullYear() === year && date.getMonth() === month;
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
    }),
    {
      name: 'rewards-storage',
      skipHydration: false,
    }
  )
);