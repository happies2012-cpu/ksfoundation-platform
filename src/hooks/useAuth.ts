import { useEffect } from 'react';
import { useAuthStore, User } from '../store';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuth = (): AuthContextType => {
  const {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
    updateProfile,
    setLoading,
  } = useAuthStore();

  // Auto-refresh token before expiry
  useEffect(() => {
    if (token && refreshToken) {
      const refreshInterval = setInterval(() => {
        refreshAuth();
      }, 15 * 60 * 1000); // Refresh every 15 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [token, refreshToken, refreshAuth]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token && refreshToken && !user) {
        try {
          await refreshAuth();
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
    };

    checkAuth();
  }, [token, refreshToken, user, refreshAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAuth,
    updateProfile,
  };
};

