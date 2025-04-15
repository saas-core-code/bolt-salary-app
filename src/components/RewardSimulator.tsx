import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRewards } from '@/hooks/useRewards';
import { formatCurrency } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Sparkles, Plus, Minus } from 'lucide-react';

export function RewardSimulator() {
  const [sessions, setSessions] = useState(3);
  const [selectedMonth, setSelectedMonth] = useState<'this' | 'next'>('this');
  const records = useRewards((state) => state.records);
  
  const thisMonth = new Date();
  const monthlyRecords = useRewards((state) => 
    state.getRecordsByMonth(thisMonth.getFullYear(), thisMonth.getMonth())
  );
  
  const currentTotal = monthlyRecords.reduce((sum, record) => sum + record.afterTax, 0);
  const averageReward = records.length > 0
    ? records.reduce((sum, record) => sum + record.afterTax, 0) / records.length
    : 0;

  const nextMonth = new Date(thisMonth);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthName = nextMonth.toLocaleDateString('ja-JP', { month: 'long' });
  
  const projectedTotal = selectedMonth === 'this'
    ? currentTotal + (averageReward * sessions)
    : averageReward * sessions;

  // セッション数を増やす
  const incrementSessions = () => {
    setSessions(prev => Math.min(prev + 1, 31));
  };

  // セッション数を減らす
  const decrementSessions = () => {
    setSessions(prev => Math.max(prev - 1, 0));
  };

  // 入力値の変更を処理
  const handleSessionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 空文字の場合は変更しない
    if (value === '') {
      return;
    }
    
    // 数値に変換
    const numValue = parseInt(value, 10);
    
    // 不正な値でない場合のみステートを更新
    if (!isNaN(numValue)) {
      // 0から31の範囲に制限
      const boundedValue = Math.min(Math.max(0, numValue), 31);
      setSessions(boundedValue);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 shadow-lg shadow-pink-200/30">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-medium">
                  収入シミュレーター
                </span>
                <Sparkles className="w-4 h-4 text-pink-400" />
              </CardTitle>
              <p className="text-sm text-gray-500">
                あなたの頑張りを、数字で見える化
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              シミュレーション対象
            </label>
            <Select
              value={selectedMonth}
              onValueChange={(value: 'this' | 'next') => setSelectedMonth(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="月を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this">今月</SelectItem>
                <SelectItem value="next">{nextMonthName}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              {selectedMonth === 'this' ? 'あと何回配信すると？' : '何回配信する予定？'}
            </label>
            <div className="flex items-center gap-2 max-w-[200px]">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={decrementSessions}
                disabled={sessions <= 0}
                className="h-9 w-9 rounded-md"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                max={31}
                value={sessions}
                onChange={handleSessionsChange}
                className="text-center"
              />
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={incrementSessions}
                disabled={sessions >= 31}
                className="h-9 w-9 rounded-md"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-xl space-y-2">
          {selectedMonth === 'this' && (
            <>
              <p className="text-sm text-muted-foreground">今月の合計</p>
              <p className="text-base">{formatCurrency(currentTotal)}</p>
              
              <div className="my-3 border-t border-border/50"></div>
              
              <p className="text-sm text-muted-foreground">予測収入</p>
              <p className="text-base">{formatCurrency(averageReward * sessions)}</p>
              <p className="text-xs text-muted-foreground">
                平均 {formatCurrency(averageReward)}/回 × {sessions} 回
              </p>
              
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">今月末の予測合計</p>
                <p className="text-xl font-medium">{formatCurrency(projectedTotal)}</p>
              </div>
            </>
          )}
          
          {selectedMonth === 'next' && (
            <>
              <p className="text-sm text-muted-foreground">予測収入</p>
              <p className="text-base">{formatCurrency(averageReward * sessions)}</p>
              <p className="text-xs text-muted-foreground">
                平均 {formatCurrency(averageReward)}/回 × {sessions} 回
              </p>
              
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">{nextMonthName}の予測合計</p>
                <p className="text-xl font-medium">{formatCurrency(projectedTotal)}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}