export interface LogEntry {
  stack: 'frontend' | 'backend';
  level: 'info' | 'warn' | 'error' | 'fatal';
  package: string;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

let authToken: string | null = null;

export function setAuthToken(token: string): void {
  authToken = token;
}

export async function Log(
  stack: LogEntry['stack'],
  level: LogEntry['level'],
  packageName: LogEntry['package'],
  message: string
): Promise<LogResponse | null> {
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
    console.error(`Invalid stack: ${stack}. Must be one of: ${validStacks.join(', ')}`);
    return null;
  }

  if (!validLevels.includes(level)) {
    console.error(`Invalid level: ${level}. Must be one of: ${validLevels.join(', ')}`);
    return null;
  }

  if (!validPackages.includes(packageName)) {
    console.error(`Invalid package: ${packageName}. Must be one of: ${validPackages.join(', ')}`);
    return null;
  }

  if (!authToken) {
    console.error('No auth token set. Call setAuthToken() first.');
    return null;
  }

  const logEntry: LogEntry = {
    stack,
    level,
    package: packageName,
    message
  };

  try {
    const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(logEntry)
    });

    if (!response.ok) {
      console.error(`Logging failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const result: LogResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to send log:', error);
    return null;
  }
}
