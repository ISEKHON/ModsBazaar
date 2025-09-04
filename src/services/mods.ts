import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDelete, 
  ApiResponse 
} from '@/lib/api';
import { 
  Mod, 
  PaginatedResponse, 
  SearchFilters, 
  SearchResponse, 
  ReviewData, 
  Review,
  DownloadRequest,
  DownloadResponse
} from '@/types/api';

class ModsService {
  // Get all mods with pagination and filters
  async getMods(filters: SearchFilters = {}): Promise<ApiResponse<PaginatedResponse<Mod>>> {
    const params = new URLSearchParams();
    
    // Add filters as query parameters
    if (filters.category) params.append('category', filters.category);
    if (filters.game) params.append('game', filters.game);
    if (filters.type) params.append('type', filters.type);
    if (filters.minRating) params.append('minRating', filters.minRating.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => params.append('tags', tag));
    }

    const queryString = params.toString();
    const url = queryString ? `/mods?${queryString}` : '/mods';
    
    return await apiGet<PaginatedResponse<Mod>>(url);
  }

  // Search mods
  async searchMods(query: string, filters: SearchFilters = {}): Promise<ApiResponse<SearchResponse>> {
    const params = new URLSearchParams();
    
    // Add search filters
    if (filters.category) params.append('category', filters.category);
    if (filters.game) params.append('game', filters.game);
    if (filters.type) params.append('type', filters.type);
    if (filters.minRating) params.append('minRating', filters.minRating.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/mods/search/${encodeURIComponent(query)}?${queryString}` : `/mods/search/${encodeURIComponent(query)}`;
    
    return await apiGet<SearchResponse>(url);
  }

  // Get single mod by slug
  async getMod(slug: string): Promise<ApiResponse<Mod>> {
    return await apiGet<Mod>(`/mods/${slug}`);
  }

  // Get featured mods
  async getFeaturedMods(limit: number = 6): Promise<ApiResponse<Mod[]>> {
    return await apiGet<Mod[]>(`/mods/featured?limit=${limit}`);
  }

  // Get popular mods
  async getPopularMods(limit: number = 10): Promise<ApiResponse<Mod[]>> {
    return await apiGet<Mod[]>(`/mods/popular?limit=${limit}`);
  }

  // Get recent mods
  async getRecentMods(limit: number = 10): Promise<ApiResponse<Mod[]>> {
    return await apiGet<Mod[]>(`/mods/recent?limit=${limit}`);
  }

  // Get mods by category
  async getModsByCategory(category: string, filters: SearchFilters = {}): Promise<ApiResponse<PaginatedResponse<Mod>>> {
    const params = new URLSearchParams();
    
    if (filters.game) params.append('game', filters.game);
    if (filters.type) params.append('type', filters.type);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/mods/category/${category}?${queryString}` : `/mods/category/${category}`;
    
    return await apiGet<PaginatedResponse<Mod>>(url);
  }

  // Get all available categories
  async getCategories(): Promise<ApiResponse<string[]>> {
    return await apiGet<string[]>('/mods/categories');
  }

  // Get all available tags
  async getTags(): Promise<ApiResponse<string[]>> {
    return await apiGet<string[]>('/mods/tags');
  }

  // Download mod
  async downloadMod(request: DownloadRequest): Promise<ApiResponse<DownloadResponse>> {
    return await apiPost<DownloadResponse>('/mods/download', request);
  }

  // Add mod to favorites
  async addToFavorites(modId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/mods/${modId}/favorite`);
  }

  // Remove mod from favorites
  async removeFromFavorites(modId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiDelete<{ message: string }>(`/mods/${modId}/favorite`);
  }

  // Get user's favorite mods
  async getFavorites(): Promise<ApiResponse<Mod[]>> {
    return await apiGet<Mod[]>('/mods/favorites');
  }

  // Rate and review mod
  async addReview(modId: string, reviewData: ReviewData): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/mods/${modId}/review`, reviewData);
  }

  // Update review
  async updateReview(modId: string, reviewData: ReviewData): Promise<ApiResponse<{ message: string }>> {
    return await apiPut<{ message: string }>(`/mods/${modId}/review`, reviewData);
  }

  // Delete review
  async deleteReview(modId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiDelete<{ message: string }>(`/mods/${modId}/review`);
  }

  // Get mod reviews
  async getReviews(modId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Review>>> {
    return await apiGet<PaginatedResponse<Review>>(`/mods/${modId}/reviews?page=${page}&limit=${limit}`);
  }

  // Report mod
  async reportMod(modId: string, reason: string, description?: string): Promise<ApiResponse<{ message: string }>> {
    return await apiPost<{ message: string }>(`/mods/${modId}/report`, {
      reason,
      description,
    });
  }

  // Get download history
  async getDownloadHistory(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<any>>> {
    return await apiGet<PaginatedResponse<any>>(`/mods/downloads/history?page=${page}&limit=${limit}`);
  }

  // Check if user can download mod
  async checkDownloadAccess(modId: string): Promise<ApiResponse<{ canDownload: boolean; reason?: string }>> {
    return await apiGet<{ canDownload: boolean; reason?: string }>(`/mods/${modId}/download/check`);
  }

  // Get mod statistics
  async getModStats(modId: string): Promise<ApiResponse<any>> {
    return await apiGet<any>(`/mods/${modId}/stats`);
  }

  // Get similar mods
  async getSimilarMods(modId: string, limit: number = 6): Promise<ApiResponse<Mod[]>> {
    return await apiGet<Mod[]>(`/mods/${modId}/similar?limit=${limit}`);
  }

  // Get mods by author
  async getModsByAuthor(authorId: string, page: number = 1, limit: number = 12): Promise<ApiResponse<PaginatedResponse<Mod>>> {
    return await apiGet<PaginatedResponse<Mod>>(`/mods/author/${authorId}?page=${page}&limit=${limit}`);
  }

  // Search suggestions (autocomplete)
  async getSearchSuggestions(query: string): Promise<ApiResponse<string[]>> {
    return await apiGet<string[]>(`/mods/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  // Advanced search with multiple criteria
  async advancedSearch(criteria: {
    query?: string;
    categories?: string[];
    tags?: string[];
    games?: string[];
    types?: string[];
    priceRange?: { min?: number; max?: number };
    ratingRange?: { min?: number; max?: number };
    dateRange?: { from?: string; to?: string };
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<SearchResponse>> {
    return await apiPost<SearchResponse>('/mods/search/advanced', criteria);
  }
}

// Export singleton instance
export const modsService = new ModsService();
export default modsService;
