import { AuthResponse } from '../types';
import { Log } from './logger';

const AUTH_API_URL = 'http://20.244.56.144/evaluation-service/auth';
const REGISTER_API_URL = 'http://20.244.56.144/evaluation-service/register';

export interface AuthCredentials {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

export async function authenticate(credentials: AuthCredentials): Promise<string | null> {
  try {
    await Log('frontend', 'info', 'auth', 'Attempting authentication with test server');
    
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      await Log('frontend', 'error', 'auth', `Authentication failed: ${response.status}`);
      return null;
    }

    const authData: AuthResponse = await response.json();
    await Log('frontend', 'info', 'auth', 'Authentication successful');
    
    return authData.access_token;
  } catch (error) {
    await Log('frontend', 'error', 'auth', `Authentication error: ${error}`);
    return null;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('quicklink_auth_token');
}

export function storeToken(token: string): void {
  localStorage.setItem('quicklink_auth_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('quicklink_auth_token');
}
