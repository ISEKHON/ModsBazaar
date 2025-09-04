import api from '../lib/api';
import { apiGet } from '../lib/api';
import { authService } from './auth';

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  gamerTag: string;
  favoriteGame: string;
  joinedAt: string;
  lastActive: string;
  lastPasswordChange?: string;
  purchasedMods: any[];
  unlockedMods: any[];
  favoriteMods: any[];
  downloadHistory: Array<{
    modId: string;
    modName: string;
    downloadedAt: string;
    type: 'free' | 'purchased' | 'unlock';
    downloadCount: number;
  }>;
  totalDownloads: number;
  totalSpent: number;
  preferences: {
    theme: string;
    notifications: {
      email: boolean;
      newMods: boolean;
      updates: boolean;
    };
    privacy: {
      showProfile: boolean;
      showDownloads: boolean;
    };
  };
  stats?: {
    downloadsCount: number;
    uploadsCount: number;
  };
}

export interface ModDetails {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail: string;
  type: 'free' | 'paid' | 'unlock';
  price?: number;
  shortDescription?: string;
  downloads: number;
  rating: number;
  ratingCount?: number;
  totalReviews?: number;
  game: string;
  category: string;
  author?: {
    name: string;
  };
  publishedAt?: string;
  createdAt?: string;
}

export const profileAPI = {
  // Get current user profile with populated data
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },

  // Update user profile
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.patch('/auth/me', updates);
    return response.data.data.user;
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.patch('/auth/change-password', {
      currentPassword,
      newPassword
    });
  },

  // Get user's purchased mods with details
  async getPurchasedMods(): Promise<ModDetails[]> {
    try {
      const response = await api.get('/user/purchases');
      if (response.data.status === 'success') {
        const purchases = response.data.data.purchases || [];
        // Transform and validate the data to ensure required fields exist
        return purchases.map((mod: any): ModDetails => ({
          _id: mod._id,
          name: mod.name || 'Unknown Mod',
          description: mod.description || 'No description available',
          thumbnail: mod.thumbnail || '/default-thumbnail.jpg',
          type: mod.type || 'free',
          game: mod.game || 'Unknown',
          category: mod.category || 'Other',
          price: mod.price || 0,
          slug: mod.slug || '',
          downloads: mod.downloads || 0,
          rating: mod.reviews?.averageRating || 0,
          totalReviews: mod.reviews?.totalReviews || 0,
          createdAt: mod.createdAt || new Date().toISOString()
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch purchased mods:', error);
      return []; // Return empty array instead of throwing
    }
  },

  // Get user's favorite mods with details
  async getFavoriteMods(): Promise<ModDetails[]> {
    try {
      const response = await api.get('/user/favorites');
      if (response.data.status === 'success') {
        const favorites = response.data.data.favorites || [];
        // Transform and validate the data to ensure required fields exist
        return favorites.map((mod: any): ModDetails => ({
          _id: mod._id || '',
          name: mod.name || 'Unknown Mod',
          slug: mod.slug || '',
          thumbnail: mod.thumbnail || '',
          type: mod.type || 'free',
          price: mod.price || 0,
          shortDescription: mod.description || '',
          downloads: mod.downloads || 0,
          rating: mod.reviews?.averageRating || 0,
          ratingCount: mod.reviews?.totalReviews || 0,
          game: mod.game || 'FS22',
          category: mod.category || 'Other',
          author: {
            name: mod.author?.name || mod.author?.username || 'Unknown Author'
          },
          publishedAt: mod.createdAt || new Date().toISOString()
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch favorite mods:', error);
      return []; // Return empty array instead of throwing
    }
  },

  // Get enhanced download history with mod details
  async getDownloadHistory(): Promise<Array<{
    _id: string;
    name: string;
    thumbnail?: string;
    downloadedAt: string;
    type: 'free' | 'paid' | 'unlock';
    downloadCount?: number;
    game?: string;
    category?: string;
    slug?: string;
  }>> {
    try {
      // Check if user is authenticated first
      const token = authService.getToken();
      if (!token) {
        return [];
      }

      const response = await apiGet<any>('/user/downloads?limit=50');
      
      // Handle response structure
      let items = [];
      if (response.status === 'success' && response.data?.downloads) {
        items = response.data.downloads;
      }

      return items.map((item: any) => ({
        _id: item.modId,
        name: item.name,
        thumbnail: item.thumbnail,
        downloadedAt: item.downloadedAt,
        type: item.type,
        downloadCount: 1,
        game: item.game,
        category: item.category,
        slug: item.slug
      }));
    } catch (error) {
      console.error('Error fetching download history:', error);
      return [];
    }
  },

  // Get user statistics
  async getUserStats(): Promise<{
    totalMods: number;
    totalDownloads: number;
    totalSpent: number;
    favoritesCount: number;
    joinDate: string;
    lastActive: string;
  }> {
    const profile = await this.getProfile();
    const downloadHistory = await this.getDownloadHistory();
    
    return {
      totalMods: (profile.purchasedMods?.length || 0) + (profile.unlockedMods?.length || 0),
      totalDownloads: downloadHistory.length,
      totalSpent: profile.totalSpent || 0,
      favoritesCount: profile.favoriteMods?.length || 0,
      joinDate: profile.joinedAt,
      lastActive: profile.lastActive
    };
  },

  // Get user's uploaded mods statistics
  async getUserModStats(): Promise<{
    totalDownloads: number;
    averageRating: number;
    totalMods: number;
  }> {
    try {
      if (!authService.getToken()) {
        return { totalDownloads: 0, averageRating: 0, totalMods: 0 };
      }

      const response = await apiGet<any>('/user/mods/stats');
      if (response.status === 'success' && response.data) {
        return {
          totalDownloads: response.data.totalDownloads || 0,
          averageRating: response.data.averageRating || 0,
          totalMods: response.data.totalMods || 0
        };
      }
      return { totalDownloads: 0, averageRating: 0, totalMods: 0 };
    } catch (error) {
      console.error('Error fetching user mod stats:', error);
      return { totalDownloads: 0, averageRating: 0, totalMods: 0 };
    }
  },

  // Delete a mod (admin or owner only)
  async deleteMod(modId: string): Promise<void> {
    try {
      const response = await api.delete(`/mods/${modId}`);
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to delete mod');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete mod');
    }
  },

  // Unpublish a mod (admin or owner only)
  async unpublishMod(modId: string): Promise<void> {
    try {
      const response = await api.patch(`/mods/${modId}/unpublish`);
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to unpublish mod');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unpublish mod');
    }
  },

  // Republish a mod (admin or owner only)
  async republishMod(modId: string): Promise<void> {
    try {
      const response = await api.patch(`/mods/${modId}/republish`);
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to republish mod');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to republish mod');
    }
  },

  // Edit/Update a mod (admin or owner only)
  async editMod(modId: string, updates: any): Promise<void> {
    try {
      const response = await api.patch(`/mods/${modId}`, updates);
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to update mod');
      }
      return response.data.data.mod;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update mod');
    }
  }
};

export default profileAPI;
