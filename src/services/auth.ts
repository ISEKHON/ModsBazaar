import { apiPost, apiGet, ApiResponse } from '@/lib/api';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User 
} from '@/types/api';

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiPost<AuthResponse>('/auth/login', credentials);
      
      // Store auth data in localStorage
      if (response.status === 'success' && response.data) {
        this.setAuthData(response.data.token, response.data.user);
      }
      
      return response;
    } catch (error: any) {
      // Handle rate limiting and other errors
      if (error.response?.status === 429) {
        return {
          status: 'error',
          message: error.response.data?.message || 'Too many login attempts',
          code: error.response.data?.code || 'TOO_MANY_ATTEMPTS'
        } as ApiResponse<AuthResponse>;
      }
      
      // Re-throw other errors to be handled by the calling code
      throw error;
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiPost<AuthResponse>('/auth/register', userData);
    
    // Store auth data in localStorage
    if (response.status === 'success' && response.data) {
      this.setAuthData(response.data.token, response.data.user);
    }
    
    return response;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiPost('/auth/logout');
    } catch (error) {
      // Continue with logout even if server call fails
      console.warn('Logout endpoint failed, continuing with local logout');
    } finally {
      // Clear local auth data
      this.clearAuthData();
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await apiGet<User>('/auth/me');
  }

  // Refresh auth token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiPost<{ token: string }>('/auth/refresh');
    
    if (response.status === 'success' && response.data) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>('/auth/forgot-password', { email });
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>('/auth/reset-password', {
      token,
      password: newPassword,
    });
  }

  // Verify email with token
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>('/auth/verify-email', { token });
  }

  // Resend verification email
  async resendVerification(): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>('/auth/resend-verification');
  }

  // Change password (authenticated user)
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Local storage management
  setAuthData(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  isModerator(): boolean {
    const user = this.getUser();
    return user?.role === 'moderator' || user?.role === 'admin';
  }

  // Auto-refresh token before expiry
  setupTokenRefresh(): void {
    if (typeof window === 'undefined') return;

    const token = this.getToken();
    if (!token) return;

    try {
      // Decode JWT to get expiry (simple base64 decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;
      
      // Refresh token 5 minutes before expiry
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);
      
      if (refreshTime > 0) {
        setTimeout(async () => {
          try {
            await this.refreshToken();
            // Setup next refresh
            this.setupTokenRefresh();
          } catch (error) {
            console.error('Token refresh failed:', error);
            this.logout();
          }
        }, refreshTime);
      } else {
        // Token already expired or expires soon
        this.logout();
      }
    } catch (error) {
      console.error('Error setting up token refresh:', error);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
