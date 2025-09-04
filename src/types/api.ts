// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: {
      discord?: string;
      youtube?: string;
      twitch?: string;
      twitter?: string;
    };
  };
  preferences: {
    emailNotifications: boolean;
    newsletter: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  stats: {
    downloadsCount: number;
    uploadsCount: number;
    reviewsCount: number;
  };
  favoriteMods: string[];
  downloadHistory: Array<{
    modId: string;
    downloadedAt: Date;
  }>;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mod types
export interface Mod {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  type: 'free' | 'paid' | 'unlock';
  price?: number;
  unlockCode?: string;
  version: string;
  game: 'FS22' | 'FS25' | 'Both';
  category: string;
  tags: string[];
  thumbnail: string;
  screenshots: string[];
  videoUrl?: string;
  files: Array<{
    name: string;
    size: string;
    downloadUrl: string;
    uploadedAt: Date;
  }>;
  author: {
    name: string;
    id: string;
  };
  downloads: number;
  rating: {
    average: number;
    count: number;
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  reviews: Array<{
    userId: string;
    username: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  compatibility: {
    requirements: string[];
    dependencies: string[];
    conflicts: string[];
  };
  isActive: boolean;
  isFeatured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  analytics: {
    views: number;
    downloads: number;
    userId?: string;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Search and Filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  game?: 'FS22' | 'FS25' | 'Both';
  type?: 'free' | 'paid' | 'unlock';
  tags?: string[];
  minRating?: number;
  sortBy?: 'newest' | 'oldest' | 'downloads' | 'rating' | 'name';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchResponse {
  mods: Mod[];
  query?: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Review types
export interface ReviewData {
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
}

export interface Review {
  _id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics types
export interface AnalyticsData {
  totalMods: number;
  totalUsers: number;
  totalDownloads: number;
  recentActivity: Array<{
    type: 'download' | 'registration' | 'review';
    count: number;
    date: string;
  }>;
  popularMods: Array<{
    id: string;
    name: string;
    downloads: number;
  }>;
  categoryStats: Array<{
    category: string;
    count: number;
  }>;
}

// Admin types
export interface AdminStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  mods: {
    total: number;
    published: number;
    pending: number;
  };
  downloads: {
    total: number;
    thisMonth: number;
    today: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    avgPerUser: number;
  };
}

// Upload types
export interface UploadData {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  tags: string[];
  game: 'FS22' | 'FS25' | 'Both';
  type: 'free' | 'paid' | 'unlock';
  price?: number;
  unlockCode?: string;
  version: string;
  requirements: string[];
  dependencies: string[];
  conflicts: string[];
}

// API Response wrapper types
export interface ApiSuccessResponse<T = any> {
  status: 'success';
  message?: string;
  data: T;
  cached?: boolean;
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Notification types
export interface Notification {
  _id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: Date;
}

// Settings types
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    newsletter: boolean;
  };
  privacy: {
    showEmail: boolean;
    showDownloads: boolean;
    showFavorites: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
}

// Download types
export interface DownloadRequest {
  modId: string;
  unlockCode?: string;
}

export interface DownloadResponse {
  downloadUrl: string;
  expiresAt: Date;
  fileName: string;
  fileSize: string;
}

// Error types
export interface FormErrors {
  [key: string]: string | string[];
}

export interface ValidationError {
  field: string;
  message: string;
}
