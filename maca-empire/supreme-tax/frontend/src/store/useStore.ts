import { create } from 'zustand';

interface AuthState {
  user: any | null;
  token: string | null;
  setUser: (user: any) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('supreme_token'),
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) localStorage.setItem('supreme_token', token);
    else localStorage.removeItem('supreme_token');
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('supreme_token');
    set({ user: null, token: null });
  },
}));

interface ChatState {
  activeAgent: string;
  setActiveAgent: (id: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeAgent: 'A0',
  setActiveAgent: (id) => set({ activeAgent: id }),
}));
