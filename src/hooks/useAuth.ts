import { useState, useEffect } from 'react';
import { authService } from '@/services/auth';
import { User, LoginCredentials, RegisterData } from '@/types/api';

// Auth hooks
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        
        if (token) {
          const response = await authService.getCurrentUser();
          
          if (response.status === 'success' && response.data) {
            // Extract user from response.data.user (backend returns { data: { user } })
            const userData = (response.data as any).user || response.data;
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            authService.clearAuthData();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Setup token refresh
    authService.setupTokenRefresh();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.status === 'success' && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      if (response.status === 'success' && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator' || user?.role === 'admin',
  };
};

// Login hook
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      if (response.status === 'error') {
        setError(response.message || 'Login failed');
      }
      return response;
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};

// Register hook
export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      if (response.status === 'error') {
        setError(response.message || 'Registration failed');
      }
      return response;
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};

// Password reset hook
export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const requestReset = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await authService.requestPasswordReset(email);
      if (response.status === 'success') {
        setSuccess(true);
      } else {
        setError(response.message || 'Request failed');
      }
      return response;
    } catch (error: any) {
      setError(error.message || 'Request failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await authService.resetPassword(token, newPassword);
      if (response.status === 'success') {
        setSuccess(true);
      } else {
        setError(response.message || 'Reset failed');
      }
      return response;
    } catch (error: any) {
      setError(error.message || 'Reset failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { requestReset, resetPassword, isLoading, error, success };
};
