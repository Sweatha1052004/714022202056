import { Log } from './logger';

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidShortCode(shortCode: string): boolean {
  if (!shortCode) return true; // Optional field
  
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(shortCode) && shortCode.length >= 1 && shortCode.length <= 50;
}

export function isValidValidity(validity: number | undefined): boolean {
  if (validity === undefined) return true; // Optional field
  
  return Number.isInteger(validity) && validity >= 1;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateUrlInput(
  url: string,
  shortCode?: string,
  validity?: number
): ValidationResult {
  const errors: string[] = [];

  if (!url.trim()) {
    errors.push('URL is required');
  } else if (!isValidUrl(url)) {
    errors.push('Please enter a valid URL');
  }

  if (shortCode && !isValidShortCode(shortCode)) {
    errors.push('Short code must be alphanumeric');
  }

  if (validity !== undefined && !isValidValidity(validity)) {
    errors.push('Validity must be a positive integer');
  }

  const isValid = errors.length === 0;
  
  if (!isValid) {
    Log('frontend', 'warn', 'component', `Validation failed: ${errors.join(', ')}`);
  }

  return { isValid, errors };
}
