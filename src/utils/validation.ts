/**
 * URL Validation Utilities
 * 
 * Provides comprehensive URL validation functions for forms throughout the application.
 * Supports flexible validation options and user-friendly error messages.
 */

export interface URLValidationOptions {
    /** Allow empty strings (default: true) */
    allowEmpty?: boolean;
    /** Require HTTPS protocol (default: false) */
    requireHTTPS?: boolean;
    /** Auto-prepend https:// if missing protocol (default: true) */
    autoPrepend?: boolean;
    /** Require specific domain (e.g., 'youtube.com') */
    requireDomain?: string;
}

export interface ValidationResult {
    isValid: boolean;
    error?: string;
    normalizedURL?: string;
}

/**
 * Validates if a string is a valid URL
 * @param url - The URL string to validate
 * @param options - Validation options
 * @returns ValidationResult with isValid status, error message, and normalized URL
 */
export function validateURL(url: string, options: URLValidationOptions = {}): ValidationResult {
    const {
        allowEmpty = true,
        requireHTTPS = false,
        autoPrepend = true,
        requireDomain
    } = options;

    // Handle empty strings
    const trimmedURL = url?.trim() || '';
    if (!trimmedURL) {
        if (allowEmpty) {
            return { isValid: true, normalizedURL: '' };
        }
        return { isValid: false, error: 'URL is required' };
    }

    let urlToValidate = trimmedURL;

    // Auto-prepend https:// if no protocol specified
    if (autoPrepend && !/^https?:\/\//i.test(urlToValidate)) {
        urlToValidate = `https://${urlToValidate}`;
    }

    // Validate URL format using URL constructor
    try {
        const urlObject = new URL(urlToValidate);

        // Check HTTPS requirement
        if (requireHTTPS && urlObject.protocol !== 'https:') {
            return {
                isValid: false,
                error: 'URL must use HTTPS protocol'
            };
        }

        // Check domain requirement
        if (requireDomain) {
            const hostname = urlObject.hostname.toLowerCase();
            const requiredDomain = requireDomain.toLowerCase();

            if (!hostname.includes(requiredDomain)) {
                return {
                    isValid: false,
                    error: `URL must be from ${requireDomain}`
                };
            }
        }

        // Additional validation using regex for better format checking
        const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)$/;

        if (!urlRegex.test(urlToValidate)) {
            return {
                isValid: false,
                error: 'Please enter a valid URL (e.g., https://example.com)'
            };
        }

        return {
            isValid: true,
            normalizedURL: urlToValidate
        };
    } catch (error) {
        return {
            isValid: false,
            error: 'Please enter a valid URL (e.g., https://example.com)'
        };
    }
}

/**
 * Checks if a URL is a valid YouTube link with enhanced security validation
 * @param url - The URL to check
 * @returns boolean indicating if URL is a YouTube link
 */
export function isYouTubeURL(url: string): boolean {
    if (!url) return false;

    const trimmedURL = url.trim();
    
    // Enhanced regex for more precise YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/[\w\-?&=%./]*$/i;
    
    if (!youtubeRegex.test(trimmedURL)) {
        return false;
    }

    try {
        // Additional validation using URL constructor for security
        let urlToCheck = trimmedURL;
        if (!/^https?:\/\//i.test(urlToCheck)) {
            urlToCheck = `https://${urlToCheck}`;
        }

        const urlObject = new URL(urlToCheck);
        const hostname = urlObject.hostname.toLowerCase();
        
        // Only allow specific YouTube domains for security
        const allowedDomains = [
            'youtube.com',
            'www.youtube.com',
            'm.youtube.com',
            'youtu.be'
        ];
        
        return allowedDomains.includes(hostname);
    } catch {
        return false;
    }
}

/**
 * Validates if a string is a valid YouTube URL with enhanced security checks
 * @param url - The URL string to validate
 * @param allowEmpty - Whether to allow empty strings (default: true)
 * @returns ValidationResult with isValid status and error message
 */
export function validateYouTubeURL(url: string, allowEmpty: boolean = true): ValidationResult {
    const trimmedURL = url?.trim() || '';

    if (!trimmedURL) {
        if (allowEmpty) {
            return { isValid: true, normalizedURL: '' };
        }
        return { isValid: false, error: 'YouTube URL is required' };
    }

    // Check if URL is a YouTube URL
    if (!isYouTubeURL(trimmedURL)) {
        return {
            isValid: false,
            error: 'Only YouTube links are allowed. Please enter a valid YouTube URL (e.g., https://youtube.com/watch?v=... or https://youtu.be/...)'
        };
    }

    // Normalize the URL
    let normalizedURL = trimmedURL;
    if (!/^https?:\/\//i.test(normalizedURL)) {
        normalizedURL = `https://${normalizedURL}`;
    }

    return {
        isValid: true,
        normalizedURL: normalizedURL
    };
}

/**
 * Validates an array of portfolio links to ensure they're all YouTube URLs
 * @param urls - Array of URL strings
 * @param requireAtLeastOne - Whether at least one valid YouTube link is required
 * @returns Object with overall validity, errors per URL, and normalized URLs
 */
export function validatePortfolioLinks(
    urls: string[],
    requireAtLeastOne: boolean = true
): {
    isValid: boolean;
    errors: (string | undefined)[];
    normalizedURLs: (string | undefined)[];
    hasValidYouTubeLink: boolean;
} {
    const results = urls.map(url => validateYouTubeURL(url, true));
    const validYouTubeLinks = results.filter(r => r.isValid && r.normalizedURL);
    
    const hasValidYouTubeLink = validYouTubeLinks.length > 0;
    
    let overallValid = results.every(r => r.isValid);
    
    // If we require at least one YouTube link and none are found, mark as invalid
    if (requireAtLeastOne && !hasValidYouTubeLink) {
        overallValid = false;
    }

    return {
        isValid: overallValid,
        errors: results.map(r => r.error),
        normalizedURLs: results.map(r => r.normalizedURL),
        hasValidYouTubeLink: hasValidYouTubeLink
    };
}

/**
 * Validates an array of URLs
 * @param urls - Array of URL strings
 * @param options - Validation options
 * @returns Object with overall validity, errors per URL, and normalized URLs
 */
export function validateURLArray(
    urls: string[],
    options: URLValidationOptions = {}
): {
    isValid: boolean;
    errors: (string | undefined)[];
    normalizedURLs: (string | undefined)[];
} {
    const results = urls.map(url => validateURL(url, options));

    return {
        isValid: results.every(r => r.isValid),
        errors: results.map(r => r.error),
        normalizedURLs: results.map(r => r.normalizedURL)
    };
}

/**
 * Simple check if string is a valid URL format
 * @param url - The URL to check
 * @returns boolean
 */
export function isValidURL(url: string): boolean {
    return validateURL(url, { allowEmpty: false }).isValid;
}
