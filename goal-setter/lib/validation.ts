/**
 * Input validation and sanitization utilities
 * Prevents XSS, injection attacks, and malformed data
 */

/**
 * Sanitize string input to prevent XSS
 * Removes HTML tags and dangerous characters
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return '';

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script> tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove <iframe> tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove inline event handlers (onclick, onload, etc.)
    .substring(0, 5000); // Limit length to prevent DOS
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): { valid: boolean; sanitized: string; error?: string } {
  if (!email) {
    return { valid: false, sanitized: '', error: 'Email is required' };
  }

  const sanitized = email.trim().toLowerCase();

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    return { valid: false, sanitized: '', error: 'Invalid email format' };
  }

  if (sanitized.length > 255) {
    return { valid: false, sanitized: '', error: 'Email too long (max 255 characters)' };
  }

  return { valid: true, sanitized };
}

/**
 * Validate name
 */
export function validateName(name: string): { valid: boolean; sanitized: string; error?: string } {
  if (!name) {
    return { valid: false, sanitized: '', error: 'Name is required' };
  }

  const sanitized = sanitizeString(name);

  if (sanitized.length < 1) {
    return { valid: false, sanitized: '', error: 'Name cannot be empty' };
  }

  if (sanitized.length > 255) {
    return { valid: false, sanitized: '', error: 'Name too long (max 255 characters)' };
  }

  return { valid: true, sanitized };
}

/**
 * Validate and sanitize text field (goals, habits, etc.)
 */
export function validateTextField(text: string | null | undefined, fieldName: string = 'Field'): {
  valid: boolean;
  sanitized: string;
  error?: string
} {
  if (!text) {
    return { valid: true, sanitized: '' }; // Optional field
  }

  const sanitized = sanitizeString(text);

  if (sanitized.length > 5000) {
    return { valid: false, sanitized: '', error: `${fieldName} too long (max 5000 characters)` };
  }

  return { valid: true, sanitized };
}

/**
 * Validate array of strings (habits, goals)
 */
export function validateStringArray(arr: unknown, maxLength: number = 100): {
  valid: boolean;
  sanitized: string[];
  error?: string
} {
  if (!Array.isArray(arr)) {
    return { valid: false, sanitized: [], error: 'Expected an array' };
  }

  if (arr.length > maxLength) {
    return { valid: false, sanitized: [], error: `Too many items (max ${maxLength})` };
  }

  const sanitized = arr
    .filter(item => typeof item === 'string')
    .map(item => sanitizeString(item))
    .filter(item => item.length > 0);

  return { valid: true, sanitized };
}

/**
 * Validate mode
 */
export function validateMode(mode: unknown): mode is 'quick' | 'deep' {
  return mode === 'quick' || mode === 'deep';
}

/**
 * Validate deep mode category data
 */
export function validateDeepModeCategory(data: unknown): {
  valid: boolean;
  sanitized: { goal: string; why: string } | null;
  error?: string
} {
  if (!data || typeof data !== 'object') {
    return { valid: true, sanitized: null }; // Optional
  }

  const obj = data as Record<string, unknown>;

  const goal = validateTextField(obj.goal as string, 'Goal');
  const why = validateTextField(obj.why as string, 'Why');

  if (!goal.valid) {
    return { valid: false, sanitized: null, error: goal.error };
  }

  if (!why.valid) {
    return { valid: false, sanitized: null, error: why.error };
  }

  return {
    valid: true,
    sanitized: {
      goal: goal.sanitized,
      why: why.sanitized,
    },
  };
}
