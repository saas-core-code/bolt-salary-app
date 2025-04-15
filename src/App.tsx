import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import { Calculator } from '@/components/Calculator';

function App() {
  const user = useAuth((state) => state.user);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          ✨ ライバー専用｜報酬計算ツール
        </h1>
        {user ? <Calculator /> : <LoginForm />}
      </div>
    </div>
  );
}

export default App;