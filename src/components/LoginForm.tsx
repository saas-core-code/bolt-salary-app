import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Lock } from 'lucide-react';

export function LoginForm() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuth((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(id, password)) {
      setError('');
    } else {
      setError('IDまたはパスワードが正しくありません。');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="text-center">
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-pink-50/80 to-purple-50/80 rounded-2xl backdrop-blur-sm border border-pink-100/20 shadow-sm">
          <p className="text-base bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-medium">
            本日もお疲れ様でございました
          </p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="w-4 h-4 text-pink-400" />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              ログイン
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute -top-3 left-4 px-2 bg-white/80 backdrop-blur-sm rounded-full">
                  <label className="text-sm font-medium text-gray-400">
                    ID（源氏名）
                  </label>
                </div>
                <Input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="h-12 px-4 rounded-xl bg-white/80 border-pink-200/50 focus:border-pink-300/50"
                />
              </div>

              <div className="relative">
                <div className="absolute -top-3 left-4 px-2 bg-white/80 backdrop-blur-sm rounded-full">
                  <label className="text-sm font-medium text-gray-400">
                    パスワード
                  </label>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 px-4 rounded-xl bg-white/80 border-pink-200/50 focus:border-pink-300/50"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50/50 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Heart className="w-4 h-4 mr-2" />
              ログイン
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}