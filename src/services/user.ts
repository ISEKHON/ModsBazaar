import { 
  apiGet, 
  apiPut, 
  apiDelete, 
  ApiResponse 
} from '@/lib/api';
import { 
  User, 
  UserSettings, 
  PaginatedResponse,
  Notification 
} from '@/types/api';

class UserService {
  // Get user profile
  async getProfile(): Promise<ApiResponse<User>> {
    return await apiGet<User>('/user/profile');
  }

  // Update user profile
  async updateProfile(profileData: Partial<User['profile']>): Promise<ApiResponse<User>> {
    return await apiPut<User>('/user/profile', profileData);
  }

  // Update user preferences
  async updatePreferences(preferences: Partial<User['preferences']>): Promise<ApiResponse<User>> {
    return await apiPut<User>('/user/preferences', preferences);
  }

  // Update user settings
  async updateSettings(settings: Partial<UserSettings>): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>('/user/settings', settings);
  }

  // Get user settings
  async getSettings(): Promise<ApiResponse<UserSettings>> {
    return await apiGet<UserSettings>('/user/settings');
  }

  // Upload avatar
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return await apiPut<{ avatarUrl: string }>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Delete avatar
  async deleteAvatar(): Promise<ApiResponse<{ message: string }>> {
    return await apiDelete<{ message: string }>('/user/avatar');
  }

  // Get user's favorite mods
  async getFavorites(page: number = 1, limit: number = 12): Promise<ApiResponse<PaginatedResponse<any>>> {
    return await apiGet<PaginatedResponse<any>>(`/user/favorites?page=${page}&limit=${limit}`);
  }

  // Get user's download history
  async getDownloadHistory(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<any>>> {
    return await apiGet<PaginatedResponse<any>>(`/user/downloads?page=${page}&limit=${limit}`);
  }

  // Get user's reviews
  async getReviews(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<any>>> {
    return await apiGet<PaginatedResponse<any>>(`/user/reviews?page=${page}&limit=${limit}`);
  }

  // Get user statistics
  async getStats(): Promise<ApiResponse<User['stats']>> {
    return await apiGet<User['stats']>('/user/stats');
  }

  // Get user's notifications
  async getNotifications(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    return await apiGet<PaginatedResponse<Notification>>(`/user/notifications?page=${page}&limit=${limit}`);
  }

  // Mark notification as read
  async markNotificationRead(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>(`/user/notifications/${notificationId}/read`);
  }

  // Mark all notifications as read
  async markAllNotificationsRead(): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>('/user/notifications/mark-all-read');
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiDelete<{ message: string }>(`/user/notifications/${notificationId}`);
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<ApiResponse<{ message: string }>> {
    return await apiDelete<{ message: string }>('/user/notifications');
  }

  // Get unread notification count
  async getUnreadNotificationCount(): Promise<ApiResponse<{ count: number }>> {
    return await apiGet<{ count: number }>('/user/notifications/unread-count');
  }

  // Subscribe to newsletter
  async subscribeNewsletter(email?: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>('/user/newsletter/subscribe', { email });
  }

  // Unsubscribe from newsletter
  async unsubscribeNewsletter(): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>('/user/newsletter/unsubscribe');
  }

  // Delete user account
  async deleteAccount(password: string): Promise<ApiResponse<{ message: string }>> {
    return await apiDelete<{ message: string }>('/user/account', {
      data: { password }
    });
  }

  // Request data export
  async requestDataExport(): Promise<ApiResponse<{ message: string }>> {
    return await apiGet<{ message: string }>('/user/export-data');
  }

  // Get account activity log
  async getActivityLog(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<any>>> {
    return await apiGet<PaginatedResponse<any>>(`/user/activity?page=${page}&limit=${limit}`);
  }

  // Update email
  async updateEmail(newEmail: string, password: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>('/user/email', {
      email: newEmail,
      password
    });
  }

  // Verify new email
  async verifyEmailChange(token: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>('/user/email/verify', { token });
  }

  // Enable two-factor authentication
  async enableTwoFactor(): Promise<ApiResponse<{ qrCode: string; backupCodes: string[] }>> {
    return await apiPut<{ qrCode: string; backupCodes: string[] }>('/user/2fa/enable');
  }

  // Verify and confirm two-factor authentication
  async confirmTwoFactor(code: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>('/user/2fa/confirm', { code });
  }

  // Disable two-factor authentication
  async disableTwoFactor(password: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>('/user/2fa/disable', { password });
  }

  // Generate new backup codes
  async generateBackupCodes(): Promise<ApiResponse<{ backupCodes: string[] }>> {
    return await apiPut<{ backupCodes: string[] }>('/user/2fa/backup-codes');
  }

  // Get user's API keys
  async getApiKeys(): Promise<ApiResponse<any[]>> {
    return await apiGet<any[]>('/user/api-keys');
  }

  // Create new API key
  async createApiKey(name: string, permissions: string[]): Promise<ApiResponse<{ apiKey: string }>> {
    return await apiPut<{ apiKey: string }>('/user/api-keys', {
      name,
      permissions
    });
  }

  // Revoke API key
  async revokeApiKey(keyId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiDelete<{ message: string }>(`/user/api-keys/${keyId}`);
  }

  // Get user's connected accounts (Discord, Steam, etc.)
  async getConnectedAccounts(): Promise<ApiResponse<any[]>> {
    return await apiGet<any[]>('/user/connected-accounts');
  }

  // Connect external account
  async connectAccount(provider: string): Promise<ApiResponse<{ authUrl: string }>> {
    return await apiGet<{ authUrl: string }>(`/user/connect/${provider}`);
  }

  // Disconnect external account
  async disconnectAccount(provider: string): Promise<ApiResponse<{ message: string }>> {
    return await apiDelete<{ message: string }>(`/user/connect/${provider}`);
  }

  // Get user by ID (public profile)
  async getUserById(userId: string): Promise<ApiResponse<Partial<User>>> {
    return await apiGet<Partial<User>>(`/user/${userId}`);
  }

  // Get user by username (public profile)
  async getUserByUsername(username: string): Promise<ApiResponse<Partial<User>>> {
    return await apiGet<Partial<User>>(`/user/username/${username}`);
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
