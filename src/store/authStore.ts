import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'developer' | 'editor' | 'viewer';
  avatar?: string;
  createdAt: string;
  lastLogin: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@aistudio.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'developer@aistudio.com',
    name: 'Developer User',
    role: 'developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=developer',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'editor@aistudio.com',
    name: 'Editor User',
    role: 'editor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'viewer@aistudio.com',
    name: 'Viewer User',
    role: 'viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer',
    createdAt: '2024-02-15T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
];

const generateToken = () => {
  return btoa(Math.random().toString(36).substr(2, 9) + Date.now().toString());
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => u.email === email);
        
        if (!user) {
          set({ isLoading: false });
          throw new Error('Invalid credentials');
        }

        // In real app, verify password here
        if (password !== 'password123') {
          set({ isLoading: false });
          throw new Error('Invalid credentials');
        }

        const token = generateToken();
        const refreshToken = generateToken();

        const updatedUser = {
          ...user,
          lastLogin: new Date().toISOString(),
        };

        set({
          user: updatedUser,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return;
        }

        // Simulate token refresh
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newToken = generateToken();
        set({ token: newToken });
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...data },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

