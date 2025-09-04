import { useState, useEffect, useCallback } from 'react';
import { modsService } from '@/services/mods';
import { Mod, SearchFilters, PaginatedResponse, SearchResponse } from '@/types/api';

// Get all mods hook
export const useMods = (filters: SearchFilters = {}) => {
  const [data, setData] = useState<PaginatedResponse<Mod> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMods = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await modsService.getMods(filters);
      if (response.status === 'success' && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to fetch mods');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch mods');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMods();
  }, [fetchMods]);

  return { data, isLoading, error, refetch: fetchMods };
};

// Get single mod hook
export const useMod = (slug: string) => {
  const [mod, setMod] = useState<Mod | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMod = useCallback(async () => {
    if (!slug) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await modsService.getMod(slug);
      if (response.status === 'success' && response.data) {
        setMod(response.data);
      } else {
        setError(response.message || 'Failed to fetch mod');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch mod');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchMod();
  }, [fetchMod]);

  return { mod, isLoading, error, refetch: fetchMod };
};

// Search mods hook
export const useSearchMods = () => {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, filters: SearchFilters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await modsService.searchMods(query, filters);
      if (response.status === 'success' && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Search failed');
      }
    } catch (error: any) {
      setError(error.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, search };
};

// Featured mods hook
export const useFeaturedMods = (limit: number = 6) => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedMods = async () => {
      try {
        const response = await modsService.getFeaturedMods(limit);
        if (response.status === 'success' && response.data) {
          setMods(response.data);
        } else {
          setError(response.message || 'Failed to fetch featured mods');
        }
      } catch (error: any) {
        setError(error.message || 'Failed to fetch featured mods');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedMods();
  }, [limit]);

  return { mods, isLoading, error };
};

// Popular mods hook
export const usePopularMods = (limit: number = 10) => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularMods = async () => {
      try {
        const response = await modsService.getPopularMods(limit);
        if (response.status === 'success' && response.data) {
          setMods(response.data);
        } else {
          setError(response.message || 'Failed to fetch popular mods');
        }
      } catch (error: any) {
        setError(error.message || 'Failed to fetch popular mods');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMods();
  }, [limit]);

  return { mods, isLoading, error };
};

// Recent mods hook
export const useRecentMods = (limit: number = 10) => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentMods = async () => {
      try {
        const response = await modsService.getRecentMods(limit);
        if (response.status === 'success' && response.data) {
          setMods(response.data);
        } else {
          setError(response.message || 'Failed to fetch recent mods');
        }
      } catch (error: any) {
        setError(error.message || 'Failed to fetch recent mods');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentMods();
  }, [limit]);

  return { mods, isLoading, error };
};

// Categories hook
export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await modsService.getCategories();
        if (response.status === 'success' && response.data) {
          setCategories(response.data);
        } else {
          setError(response.message || 'Failed to fetch categories');
        }
      } catch (error: any) {
        setError(error.message || 'Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};

// Download mod hook
export const useDownloadMod = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async (modId: string, unlockCode?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await modsService.downloadMod({ modId, unlockCode });
      if (response.status === 'success' && response.data) {
        // Create download link
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = response.data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return response.data;
      } else {
        setError(response.message || 'Download failed');
        throw new Error(response.message || 'Download failed');
      }
    } catch (error: any) {
      setError(error.message || 'Download failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { download, isLoading, error };
};

// Favorites hook
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Mod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await modsService.getFavorites();
      if (response.status === 'success' && response.data) {
        setFavorites(response.data);
      } else {
        setError(response.message || 'Failed to fetch favorites');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch favorites');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToFavorites = useCallback(async (modId: string) => {
    try {
      const response = await modsService.addToFavorites(modId);
      if (response.status === 'success') {
        await fetchFavorites(); // Refresh favorites list
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  }, [fetchFavorites]);

  const removeFromFavorites = useCallback(async (modId: string) => {
    try {
      const response = await modsService.removeFromFavorites(modId);
      if (response.status === 'success') {
        await fetchFavorites(); // Refresh favorites list
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  }, [fetchFavorites]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return { favorites, isLoading, error, addToFavorites, removeFromFavorites, refetch: fetchFavorites };
};
