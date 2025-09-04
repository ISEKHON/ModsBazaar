import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// API Base Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookie-based auth
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookie
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add API key if available
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🟢 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    const { response, request, message } = error;

    // Network error
    if (!response && !request) {
      console.error('❌ Network Error:', message);
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Request timeout
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request Timeout');
      toast.error('Request timeout. Please try again.');
      return Promise.reject(error);
    }

    // Server responded with error status
    if (response) {
      const { status, data } = response;

      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`🔴 API Error: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status,
          data,
        });
      }

      switch (status) {
        case 400:
          toast.error(data?.message || 'Bad request');
          break;
        case 401:
          // Unauthorized - clear auth and redirect
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            // Redirect to login page
            window.location.href = '/auth/login';
          }
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('Access forbidden');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 429:
          // Rate limiting with better messaging
          const retryAfter = response.headers['retry-after'] || response.headers['x-ratelimit-reset'];
          const retryData = data?.retryAfter || data?.resetTime;
          
          let rateLimitMessage = 'Too many requests. Please wait and try again.';
          
          if (retryAfter) {
            const seconds = parseInt(retryAfter);
            if (seconds > 60) {
              const minutes = Math.ceil(seconds / 60);
              rateLimitMessage = `Too many requests. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
            } else {
              rateLimitMessage = `Too many requests. Please wait ${seconds} second${seconds > 1 ? 's' : ''} before trying again.`;
            }
          } else if (retryData) {
            rateLimitMessage = `Too many requests. ${retryData}`;
          }
          
          toast.error(rateLimitMessage, {
            duration: 6000, // Show longer for rate limit messages
          });
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        case 503:
          toast.error('Service temporarily unavailable');
          break;
        default:
          toast.error(data?.message || 'Something went wrong');
      }
    }

    return Promise.reject(error);
  }
);

// API Response wrapper type
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  cached?: boolean;
}

// API Error type
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Generic API call wrapper
export const apiCall = async <T = any>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error: any) {
    // Re-throw with consistent error format
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Unknown error',
      errors: error.response?.data?.errors,
    } as ApiError;
  }
};

// Convenience methods
export const apiGet = <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
  apiCall({ method: 'GET', url, ...config });

export const apiPost = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
  apiCall({ method: 'POST', url, data, ...config });

export const apiPut = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
  apiCall({ method: 'PUT', url, data, ...config });

export const apiPatch = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
  apiCall({ method: 'PATCH', url, data, ...config });

export const apiDelete = <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
  apiCall({ method: 'DELETE', url, ...config });

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, {
      timeout: 5000,
    });
    return response.status === 200;
  } catch (error) {
    console.error('❌ API Health Check Failed:', error);
    return false;
  }
};

export default api;
