export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  validityMinutes: number;
  createdAt: Date;
  expiresAt: Date | null;
  isActive: boolean;
  clickCount: number;
}

export interface UrlInput {
  originalUrl: string;
  validityMinutes?: number;
  shortCode?: string;
}

export interface BulkShortenResponse {
  results: ShortenedUrl[];
  errors: Array<{
    index: number;
    error: string;
    details?: any;
  }>;
}

export interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

export interface LogEntry {
  stack: 'frontend' | 'backend';
  level: 'info' | 'warn' | 'error' | 'fatal';
  package: string;
  message: string;
}
