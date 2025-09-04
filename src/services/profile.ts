import api from '../lib/api';

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
  thumbnail: string;
  type: 'free' | 'paid' | 'unlock';
  price?: number;
  shortDescription: string;
  downloads: number;
  rating: number;
  ratingCount: number;
  game: string;
  category: string;
  author: {
    name: string;
  };
  publishedAt: string;
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
      // For now, return empty array since purchased mods functionality isn't fully implemented
      // In the future, this would call a /user/purchased endpoint
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
    type: 'free' | 'purchased' | 'unlock';
    downloadCount: number;
  }>> {
    const profile = await this.getProfile();
    return profile.downloadHistory.map(item => ({
      _id: item.modId,
      name: item.modName,
      downloadedAt: item.downloadedAt,
      type: item.type,
      downloadCount: item.downloadCount
    }));
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
    
    return {
      totalMods: (profile.purchasedMods?.length || 0) + (profile.unlockedMods?.length || 0),
      totalDownloads: profile.downloadHistory?.length || 0,
      totalSpent: profile.totalSpent || 0,
      favoritesCount: profile.favoriteMods?.length || 0,
      joinDate: profile.joinedAt,
      lastActive: profile.lastActive
    };
  }
};

export default profileAPI;
