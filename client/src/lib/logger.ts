import { LogEntry } from '../types';

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

let authToken: string | null = localStorage.getItem('quicklink_auth_token');

export function setAuthToken(token: string): void {
  authToken = token;
  localStorage.setItem('quicklink_auth_token', token);
}

export async function Log(
  stack: LogEntry['stack'],
  level: LogEntry['level'],
  packageName: LogEntry['package'],
  message: string
): Promise<boolean> {
  // Validate parameters
  const validStacks = ['frontend', 'backend'];
  const validLevels = ['info', 'warn', 'error', 'fatal'];
  const validPackages = [
    // Frontend packages
    'component', 'hook', 'page', 'state', 'style',
    // Backend packages  
    'cache', 'controller', 'cron job', 'db', 'domain', 'handler', 'repository', 'route', 'service',
    // Shared packages
    'auth', 'config', 'middleware', 'utils'
  ];

  if (!validStacks.includes(stack)) {
    console.error(`Invalid stack: ${stack}`);
    return false;
  }

  if (!validLevels.includes(level)) {
    console.error(`Invalid level: ${level}`);
    return false;
  }

  if (!validPackages.includes(packageName)) {
    console.error(`Invalid package: ${packageName}`);
    return false;
  }

  if (!authToken) {
    console.error('No auth token available for logging');
    return false;
  }

  const logEntry: LogEntry = {
    stack,
    level,
    package: packageName,
    message
  };

  try {
    const response = await fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(logEntry)
    });

    if (!response.ok) {
      console.error(`Logging failed: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send log:', error);
    return false;
  }
}
