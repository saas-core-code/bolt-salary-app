import { create } from 'zustand';
import { MOCK_USERS } from '@/lib/constants';

interface AuthState {
  user: string | null;
  login: (id: string, password: string) => boolean;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (id: string, password: string) => {
    if (MOCK_USERS[id as keyof typeof MOCK_USERS] === password) {
      set({ user: id });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null }),
}));