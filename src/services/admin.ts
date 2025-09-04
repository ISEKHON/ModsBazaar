import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDelete, 
  ApiResponse 
} from '@/lib/api';
import { 
  AdminStats, 
  User, 
  Mod, 
  PaginatedResponse,
  AnalyticsData 
} from '@/types/api';

class AdminService {
  // Dashboard & Analytics
  async getDashboardStats(): Promise<ApiResponse<AdminStats>> {
    return await apiGet<AdminStats>('/admin/dashboard/stats');
  }

  async getAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ApiResponse<AnalyticsData>> {
    return await apiGet<AnalyticsData>(`/admin/analytics?period=${period}`);
  }

  async getUserGrowth(days: number = 30): Promise<ApiResponse<any>> {
    return await apiGet<any>(`/admin/analytics/users/growth?days=${days}`);
  }

  async getRevenueAnalytics(days: number = 30): Promise<ApiResponse<any>> {
    return await apiGet<any>(`/admin/analytics/revenue?days=${days}`);
  }

  async getModAnalytics(days: number = 30): Promise<ApiResponse<any>> {
    return await apiGet<any>(`/admin/analytics/mods?days=${days}`);
  }

  // User Management
  async getUsers(page: number = 1, limit: number = 20, filters?: {
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
  }): Promise<ApiResponse<PaginatedResponse<User>>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    return await apiGet<PaginatedResponse<User>>(`/admin/users?${params.toString()}`);
  }

  async getUser(userId: string): Promise<ApiResponse<User>> {
    return await apiGet<User>(`/admin/users/${userId}`);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return await apiPut<User>(`/admin/users/${userId}`, userData);
  }

  async banUser(userId: string, reason: string, duration?: number): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/users/${userId}/ban`, {
      reason,
      duration
    });
  }

  async unbanUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/users/${userId}/unban`);
  }

  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiDelete<{ message: string }>(`/admin/users/${userId}`);
  }

  async promoteUser(userId: string, role: 'moderator' | 'admin'): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>(`/admin/users/${userId}/role`, { role });
  }

  async verifyUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/users/${userId}/verify`);
  }

  // Mod Management
  async getMods(page: number = 1, limit: number = 20, filters?: {
    search?: string;
    status?: string;
    category?: string;
    type?: string;
    sortBy?: string;
  }): Promise<ApiResponse<PaginatedResponse<Mod>>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    return await apiGet<PaginatedResponse<Mod>>(`/admin/mods?${params.toString()}`);
  }

  async getMod(modId: string): Promise<ApiResponse<Mod>> {
    return await apiGet<Mod>(`/admin/mods/${modId}`);
  }

  async updateMod(modId: string, modData: Partial<Mod>): Promise<ApiResponse<Mod>> {
    return await apiPut<Mod>(`/admin/mods/${modId}`, modData);
  }

  async approveMod(modId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/mods/${modId}/approve`);
  }

  async rejectMod(modId: string, reason: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/mods/${modId}/reject`, { reason });
  }

  async deleteMod(modId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiDelete<{ message: string }>(`/admin/mods/${modId}`);
  }

  async featureMod(modId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/mods/${modId}/feature`);
  }

  async unfeatureMod(modId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/mods/${modId}/unfeature`);
  }

  async markModPopular(modId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/mods/${modId}/popular`);
  }

  async unmarkModPopular(modId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/mods/${modId}/unpopular`);
  }

  // Content Moderation
  async getReports(page: number = 1, limit: number = 20, filters?: {
    type?: string;
    status?: string;
    sortBy?: string;
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    return await apiGet<PaginatedResponse<any>>(`/admin/reports?${params.toString()}`);
  }

  async getReport(reportId: string): Promise<ApiResponse<any>> {
    return await apiGet<any>(`/admin/reports/${reportId}`);
  }

  async resolveReport(reportId: string, action: string, notes?: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/reports/${reportId}/resolve`, {
      action,
      notes
    });
  }

  async dismissReport(reportId: string, notes?: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/reports/${reportId}/dismiss`, { notes });
  }

  // Reviews Management
  async getReviews(page: number = 1, limit: number = 20, filters?: {
    modId?: string;
    userId?: string;
    rating?: number;
    sortBy?: string;
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters?.modId) params.append('modId', filters.modId);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.rating) params.append('rating', filters.rating.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    return await apiGet<PaginatedResponse<any>>(`/admin/reviews?${params.toString()}`);
  }

  async deleteReview(reviewId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiDelete<{ message: string }>(`/admin/reviews/${reviewId}`);
  }

  async flagReview(reviewId: string, reason: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/admin/reviews/${reviewId}/flag`, { reason });
  }

  // System Management
  async getSystemSettings(): Promise<ApiResponse<any>> {
    return await apiGet<any>('/admin/settings');
  }

  async updateSystemSettings(settings: any): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>('/admin/settings', settings);
  }

  async getSystemStats(): Promise<ApiResponse<any>> {
    return await apiGet<any>('/admin/system/stats');
  }

  async getSystemLogs(page: number = 1, limit: number = 50, level?: string): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (level) params.append('level', level);

    return await apiGet<PaginatedResponse<any>>(`/admin/system/logs?${params.toString()}`);
  }

  // Cache Management
  async clearCache(type?: string): Promise<ApiResponse<{ message: string }>> {
    const params = type ? `?type=${type}` : '';
    return await apiPost<{ message: string }>(`/admin/cache/clear${params}`);
  }

  async getCacheStats(): Promise<ApiResponse<any>> {
    return await apiGet<any>('/admin/cache/stats');
  }

  // Maintenance Mode
  async enableMaintenance(message?: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>('/admin/maintenance/enable', { message });
  }

  async disableMaintenance(): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>('/admin/maintenance/disable');
  }

  async getMaintenanceStatus(): Promise<ApiResponse<{ enabled: boolean; message?: string }>> {
    return await apiGet<{ enabled: boolean; message?: string }>('/admin/maintenance/status');
  }

  // Bulk Operations
  async bulkUserAction(userIds: string[], action: string, data?: any): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>('/admin/users/bulk', {
      userIds,
      action,
      data
    });
  }

  async bulkModAction(modIds: string[], action: string, data?: any): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>('/admin/mods/bulk', {
      modIds,
      action,
      data
    });
  }

  // Export Data
  async exportUsers(format: 'csv' | 'json' = 'csv'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return await apiGet<{ downloadUrl: string }>(`/admin/export/users?format=${format}`);
  }

  async exportMods(format: 'csv' | 'json' = 'csv'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return await apiGet<{ downloadUrl: string }>(`/admin/export/mods?format=${format}`);
  }

  async exportAnalytics(period: string, format: 'csv' | 'json' = 'csv'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return await apiGet<{ downloadUrl: string }>(`/admin/export/analytics?period=${period}&format=${format}`);
  }
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;
