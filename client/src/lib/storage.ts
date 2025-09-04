import { ShortenedUrl } from '../types';
import { Log } from './logger';

const STORAGE_KEY = 'quicklink_urls';

export function getStoredUrls(): ShortenedUrl[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const urls = JSON.parse(stored);
    // Convert date strings back to Date objects
    return urls.map((url: any) => ({
      ...url,
      createdAt: new Date(url.createdAt),
      expiresAt: url.expiresAt ? new Date(url.expiresAt) : null
    }));
  } catch (error) {
    Log('frontend', 'error', 'utils', `Failed to load URLs from localStorage: ${error}`);
    return [];
  }
}

export function storeUrls(urls: ShortenedUrl[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    Log('frontend', 'info', 'utils', `Stored ${urls.length} URLs to localStorage`);
  } catch (error) {
    Log('frontend', 'error', 'utils', `Failed to store URLs to localStorage: ${error}`);
  }
}

export function addStoredUrl(url: ShortenedUrl): void {
  const urls = getStoredUrls();
  urls.unshift(url); // Add to beginning
  storeUrls(urls);
}

export function addStoredUrls(newUrls: ShortenedUrl[]): void {
  const urls = getStoredUrls();
  urls.unshift(...newUrls); // Add to beginning
  storeUrls(urls);
}

export function removeStoredUrl(id: string): void {
  const urls = getStoredUrls();
  const filtered = urls.filter(url => url.id !== id);
  storeUrls(filtered);
}

export function clearStoredUrls(): void {
  localStorage.removeItem(STORAGE_KEY);
  Log('frontend', 'info', 'utils', 'Cleared all stored URLs');
}

export function getUrlByShortCode(shortCode: string): ShortenedUrl | undefined {
  const urls = getStoredUrls();
  return urls.find(url => url.shortCode === shortCode);
}
