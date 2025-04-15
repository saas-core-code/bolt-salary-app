import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRewards } from '@/hooks/useRewards';
import { formatCurrency, formatDate } from '@/lib/utils';
import { History, TrendingUp, Trophy, ListFilter, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function RewardHistory() {
  const lastTenRecords = useRewards((state) => state.getLastNRecords(10));
  const records = useRewards((state) => state.records);
  const deleteRecord = useRewards((state) => state.deleteRecord);

  const averageReward = lastTenRecords.length > 0
    ? lastTenRecords.reduce((sum, record) => sum + record.afterTax, 0) / lastTenRecords.length
    : 0;

  const highestReward = records.length > 0
    ? Math.max(...records.map(record => record.afterTax))
    : 0;

  return (
    <Card className="mt-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 shadow-lg shadow-pink-200/30">
              <History className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-medium">
                  過去の報酬履歴
                </span>
              </CardTitle>
              <p className="text-sm text-gray-500">
                あなたの頑張りの記録
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-xl border border-pink-100/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-pink-400" />
                <p className="text-sm text-gray-600">直近10回の平均</p>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {formatCurrency(averageReward)}
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-xl border border-pink-100/20">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-pink-400" />
                <p className="text-sm text-gray-600">過去最高</p>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {formatCurrency(highestReward)}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
              <ListFilter className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-medium text-gray-600">
                最近お報酬一覧(10回分)
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-pink-100/20">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">日時</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">$収益</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">レート</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">税引後</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {lastTenRecords.map((record, index) => (
                  <tr key={record.id} className="border-b border-pink-50/20 last:border-b-0">
                    <td className="py-3 px-2 text-sm text-gray-600">{formatDate(record.date)}</td>
                    <td className="py-3 px-2 text-sm text-right font-medium text-gray-700">${record.usdAmount.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm text-right text-gray-600">{record.exchangeRate.toFixed(1)}</td>
                    <td className="py-3 px-2 text-sm text-right font-medium text-gray-700">{formatCurrency(record.afterTax)}</td>
                    <td className="py-2 px-2">
                      {index === 0 && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full h-8 bg-pink-50 hover:bg-pink-100 text-pink-500 hover:text-pink-600 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2 text-sm">削除</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>この記録を削除してもよろしいですか？</AlertDialogTitle>
                              <AlertDialogDescription>
                                削除した記録は復元できません。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">
                                キャンセル
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteRecord(record.id)}
                                className="bg-pink-500 hover:bg-pink-600"
                              >
                                削除する
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}