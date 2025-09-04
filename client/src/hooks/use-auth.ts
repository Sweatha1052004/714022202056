import { useState, useEffect } from 'react';
import { authenticate, getStoredToken, storeToken, clearToken } from '../lib/auth';
import { setAuthToken } from '../lib/logger';
import { Log } from '../lib/logger';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      Log('frontend', 'info', 'auth', 'Restored authentication from localStorage');
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const token = await authenticate(credentials);
      if (token) {
        storeToken(token);
        setAuthToken(token);
        setIsAuthenticated(true);
        await Log('frontend', 'info', 'auth', 'User authentication successful');
        return true;
      }
      await Log('frontend', 'error', 'auth', 'User authentication failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
    Log('frontend', 'info', 'auth', 'User logged out');
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}
