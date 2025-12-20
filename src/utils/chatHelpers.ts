/**
 * Retry utility with exponential backoff
 * Useful for handling transient network failures
 */

interface RetryOptions {
    maxRetries?: number;
    baseDelay?: number;
    onRetry?: (attempt: number, error: any) => void;
}

/**
 * Executes a function with retry logic and exponential backoff
 * @param fn Function to execute
 * @param options Retry configuration
 * @returns Promise with function result
 */
export async function fetchWithRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxRetries = 3,
        baseDelay = 1000,
        onRetry
    } = options;

    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Don't retry on last attempt
            if (attempt === maxRetries - 1) {
                throw error;
            }

            // Call retry callback if provided
            if (onRetry) {
                onRetry(attempt + 1, error);
            }

            // Exponential backoff: delay = baseDelay * 2^attempt
            const delay = baseDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

/**
 * Input validation for chat messages
 */
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export function validateMessage(text: string): ValidationResult {
    const trimmed = text.trim();

    if (trimmed.length < 1) {
        return {
            isValid: false,
            error: 'Message cannot be empty'
        };
    }

    if (trimmed.length > 5000) {
        return {
            isValid: false,
            error: 'Message too long. Maximum 5000 characters'
        };
    }

    return { isValid: true };
}

/**
 * Sanitize text content to prevent XSS
 * Basic sanitization - removes HTML tags and dangerous characters
 */
export function sanitizeMessage(text: string): string {
    return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
}

/**
 * Check if user is online
 */
export function isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
}
