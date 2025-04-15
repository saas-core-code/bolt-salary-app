import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Stars, Sparkles } from 'lucide-react';
import { useMemo } from 'react';

const MESSAGES = [
  {
    message: [
      'さん',
      '今日も一日お疲れさま🌸',
      'あなたの頑張りが、きっと誰かの心を癒しています✨',
      'これからも、無理せず、あなたのペースで応援しています📣'
    ],
    icon: Heart,
    gradient: 'from-pink-400 to-rose-400',
  },
  {
    message: [
      'さん',
      '今日も一日お疲れさま🌸',
      'あなたの笑顔が、視聴者さんの元気の源です🌈',
      '次回からも、あなたらしく輝いていてください⭐️'
    ],
    icon: Stars,
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    message: [
      'さん',
      '今日も一日お疲れさま🌸',
      'あなたの存在が、多くの人の希望になっています💫',
      'ゆっくり休んで、また次回も素敵な時間を過ごしましょう✨'
    ],
    icon: Sparkles,
    gradient: 'from-indigo-400 to-purple-400',
  },
];

export function PerformanceMetrics() {
  const user = useAuth((state) => state.user);
  
  const randomMessage = useMemo(() => {
    const index = Math.floor(Math.random() * MESSAGES.length);
    return MESSAGES[index];
  }, []);

  const Icon = randomMessage.icon;

  return (
    <Card className="mt-8 overflow-hidden glass-card">
      <CardContent className="p-8">
        <div className="relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-2xl" />

          <div className="relative">
            {/* Icon header */}
            <div className="flex justify-center mb-8">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${randomMessage.gradient} shadow-lg shadow-pink-200/50`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col items-center gap-4">
              <div className="space-y-2 text-center">
                <p className="text-lg font-medium text-gray-700">
                  {user}{randomMessage.message[0]}
                </p>
                <p className="text-lg font-medium text-gray-700">
                  {randomMessage.message[1]}
                </p>
              </div>
              {randomMessage.message.slice(2).map((line, index) => (
                <div
                  key={index}
                  className="text-base text-gray-600 text-center px-6 py-3"
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}