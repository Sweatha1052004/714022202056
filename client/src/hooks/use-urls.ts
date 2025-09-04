import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShortenedUrl, UrlInput, BulkShortenResponse } from '../types';
import { getStoredUrls, addStoredUrls, removeStoredUrl, clearStoredUrls } from '../lib/storage';
import { apiRequest } from '../lib/queryClient';
import { Log } from '../lib/logger';

export function useUrls() {
  const [localUrls, setLocalUrls] = useState<ShortenedUrl[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = getStoredUrls();
    setLocalUrls(stored);
    Log('frontend', 'info', 'hook', `Loaded ${stored.length} URLs from localStorage`);
  }, []);

  const { data: serverUrls = [], refetch } = useQuery({
    queryKey: ['/api/urls'],
    enabled: false, // Only fetch when explicitly requested
  });

  const shortenMutation = useMutation({
    mutationFn: async (urls: UrlInput[]) => {
      Log('frontend', 'info', 'utils', `Shortening ${urls.length} URLs`);
      const response = await apiRequest('POST', '/api/shorten-bulk', { urls });
      return response.json() as Promise<BulkShortenResponse>;
    },
    onSuccess: (data) => {
      if (data.results.length > 0) {
        addStoredUrls(data.results);
        setLocalUrls(prev => [...data.results, ...prev]);
        Log('frontend', 'info', 'utils', `Successfully shortened ${data.results.length} URLs`);
      }
      if (data.errors.length > 0) {
        Log('frontend', 'warn', 'utils', `${data.errors.length} URLs failed validation`);
      }
    },
    onError: (error) => {
      Log('frontend', 'error', 'utils', `Failed to shorten URLs: ${error}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/url/${id}`);
      return id;
    },
    onSuccess: (id) => {
      removeStoredUrl(id);
      setLocalUrls(prev => prev.filter(url => url.id !== id));
      Log('frontend', 'info', 'utils', `Deleted URL with id: ${id}`);
    },
    onError: (error) => {
      Log('frontend', 'error', 'utils', `Failed to delete URL: ${error}`);
    }
  });

  const clearAll = () => {
    clearStoredUrls();
    setLocalUrls([]);
    Log('frontend', 'info', 'utils', 'Cleared all local URLs');
  };

  const getActiveUrls = () => {
    const now = new Date();
    return localUrls.filter(url => 
      url.isActive && (!url.expiresAt || now < url.expiresAt)
    );
  };

  const getTotalClicks = () => {
    return localUrls.reduce((total, url) => total + url.clickCount, 0);
  };

  return {
    urls: localUrls,
    isLoading: shortenMutation.isPending || deleteMutation.isPending,
    shortenUrls: shortenMutation.mutate,
    deleteUrl: deleteMutation.mutate,
    clearAll,
    getActiveUrls,
    getTotalClicks,
    error: shortenMutation.error || deleteMutation.error
  };
}
