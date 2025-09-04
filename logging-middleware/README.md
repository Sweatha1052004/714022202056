# QuickLink Logging Middleware

A reusable logging middleware for the QuickLink URL shortener application.

## Usage

```typescript
import { Log, setAuthToken } from './index';

// Set authentication token first
setAuthToken('your-bearer-token');

// Log messages
await Log('frontend', 'info', 'component', 'User clicked shorten button');
await Log('frontend', 'error', 'page', 'Invalid URL format entered');
await Log('frontend', 'warn', 'utils', 'LocalStorage quota exceeded');
