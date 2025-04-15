import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useRewards } from '@/hooks/useRewards';

export function RewardCalendar() {
  // setDateは使われていないので削除
  // const [, setDate] = useState<Date | undefined>(new Date());
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const records = useRewards((state) => state.getRecordsByMonth(year, month));
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  const weeks = [];
  let days = [];
  
  // Fill in empty days at the start
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  
  // Fill in the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    // dateが使われていないので、変数宣言自体を削除するか、
    // または必要な計算だけを行い、変数に代入しない
    // const date = new Date(year, month, day);
    
    const hasRecord = records.some(record => {
      const recordDate = new Date(record.date);
      return recordDate.getDate() === day;
    });
    
    days.push({ day, hasRecord });
    
    if (days.length === 7) {
      weeks.push(days);
      days = [];
    }
  }
  
  // Fill in empty days at the end
  while (days.length < 7 && days.length > 0) {
    days.push(null);
  }
  if (days.length > 0) {
    weeks.push(days);
  }

  return (
    <Card className="mt-8 glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="w-4 h-4 text-pink-400" />
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            今月の活動カレンダー
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
            <div key={day} className="text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          {weeks.map((week, weekIndex) => (
            week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`
                  py-2 rounded-lg text-sm
                  ${!day ? 'text-gray-300' : 'border border-pink-100/30'}
                  ${day?.hasRecord ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200/30' : ''}
                `}
              >
                {day?.day}
                {day?.hasRecord && (
                  <div className="mt-1 flex justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></span>
                  </div>
                )}
              </div>
            ))
          ))}
        </div>
      </CardContent>
    </Card>
  );
}