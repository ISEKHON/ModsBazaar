import api from '@/lib/api';

export interface ModSubmission {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  type: 'free' | 'paid' | 'unlock';
  price?: number;
  unlockCode?: string;
  version: string;
  game: 'FS22' | 'FS25' | 'Both';
  category: string;
  tags?: string[];
  thumbnail: string;
  screenshots?: string[];
  videoUrl?: string;
  downloadUrl: string;
  fileSize?: string;
  requirements?: string[];
  dependencies?: string[];
  conflicts?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'published';
  submittedBy: {
    _id: string;
    username: string;
    email: string;
    gamerTag?: string;
  };
  reviewedBy?: {
    _id: string;
    username: string;
  };
  publishedModId?: {
    _id: string;
    slug: string;
    name: string;
  };
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  updatedAt: string;
}

export interface SubmissionFormData {
  name: string;
  description: string;
  shortDescription: string;
  type: 'free' | 'paid' | 'unlock';
  price?: number;
  unlockCode?: string;
  version: string;
  game: 'FS22' | 'FS25' | 'Both';
  category: string;
  tags?: string[];
  thumbnail: string;
  screenshots?: string[];
  videoUrl?: string;
  downloadUrl: string;
  fileSize?: string;
  requirements?: string[];
  dependencies?: string[];
  conflicts?: string[];
}

export interface PaginatedSubmissions {
  submissions: ModSubmission[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class SubmissionService {
  // Submit a new mod
  async submitMod(data: SubmissionFormData): Promise<{ submission: ModSubmission }> {
    const response = await api.post('/submissions', data);
    return response.data.data;
  }

  // Get user's submissions
  async getMySubmissions(): Promise<{ submissions: ModSubmission[] }> {
    const response = await api.get('/submissions/my-submissions');
    return response.data.data;
  }

  // Get a specific submission
  async getSubmission(id: string): Promise<{ submission: ModSubmission }> {
    const response = await api.get(`/submissions/${id}`);
    return response.data.data;
  }

  // Update a submission (only if pending and owner)
  async updateSubmission(id: string, data: Partial<SubmissionFormData>): Promise<{ submission: ModSubmission }> {
    const response = await api.patch(`/submissions/${id}`, data);
    return response.data.data;
  }

  // Delete a submission (only if pending and owner)
  async deleteSubmission(id: string): Promise<void> {
    await api.delete(`/submissions/${id}`);
  }

  // Admin: Get pending submissions
  async getPendingSubmissions(page = 1, limit = 20): Promise<PaginatedSubmissions> {
    const response = await api.get('/submissions/admin/pending', {
      params: { page, limit }
    });
    return response.data.data;
  }

  // Admin: Review a submission
  async reviewSubmission(
    id: string, 
    action: 'approve' | 'reject', 
    reviewNotes?: string, 
    rejectionReason?: string
  ): Promise<{ submission: ModSubmission; publishedMod?: { _id: string; slug: string } }> {
    const response = await api.patch(`/submissions/admin/${id}/review`, {
      action,
      reviewNotes,
      rejectionReason
    });
    return response.data.data;
  }

  // Admin: Get all submissions with filters
  async getAllSubmissions(
    filters: {
      status?: 'pending' | 'approved' | 'rejected' | 'published';
      submittedBy?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<PaginatedSubmissions> {
    const response = await api.get('/submissions/admin/all', {
      params: filters
    });
    return response.data.data;
  }

  // Helper: Format submission status for display
  getStatusDisplay(status: string): { text: string; color: string; bgColor: string } {
    switch (status) {
      case 'pending':
        return {
          text: 'Pending Review',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/10'
        };
      case 'approved':
        return {
          text: 'Approved',
          color: 'text-green-400',
          bgColor: 'bg-green-400/10'
        };
      case 'rejected':
        return {
          text: 'Rejected',
          color: 'text-red-400',
          bgColor: 'bg-red-400/10'
        };
      case 'published':
        return {
          text: 'Published',
          color: 'text-blue-400',
          bgColor: 'bg-blue-400/10'
        };
      default:
        return {
          text: 'Unknown',
          color: 'text-gray-400',
          bgColor: 'bg-gray-400/10'
        };
    }
  }

  // Helper: Format type for display
  getTypeDisplay(type: string): { text: string; color: string; icon: string } {
    switch (type) {
      case 'free':
        return {
          text: 'Free',
          color: 'text-green-400',
          icon: '🆓'
        };
      case 'paid':
        return {
          text: 'Paid',
          color: 'text-orange-400',
          icon: '💰'
        };
      case 'unlock':
        return {
          text: 'Unlock Code',
          color: 'text-purple-400',
          icon: '🔐'
        };
      default:
        return {
          text: 'Unknown',
          color: 'text-gray-400',
          icon: '❓'
        };
    }
  }

  // Helper: Calculate time since submission
  getTimeSince(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

export const submissionService = new SubmissionService();
