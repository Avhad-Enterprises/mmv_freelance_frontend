/**
 * OAuth Utilities
 * 
 * Helper functions for OAuth authentication flow
 */

// OAuth Provider Types
export type OAuthProvider = 'google' | 'facebook' | 'apple';

// Provider configuration
interface OAuthProviderConfig {
    name: OAuthProvider;
    displayName: string;
    enabled: boolean;
}

/**
 * Get the API base URL
 */
const getApiBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

/**
 * Get the frontend base URL (for callback)
 */
const getFrontendBaseUrl = (): string => {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    return 'http://localhost:3000';
};

/**
 * Initiate OAuth login flow
 * Redirects the user to the backend OAuth endpoint which then redirects to the provider
 * 
 * @param provider - The OAuth provider ('google', 'facebook', 'apple')
 * @param customRedirect - Optional custom redirect URL after authentication
 */
export const initiateOAuthLogin = (
    provider: OAuthProvider,
    customRedirect?: string
): void => {
    const apiUrl = getApiBaseUrl();
    const frontendUrl = getFrontendBaseUrl();

    // Default callback URL
    const callbackUrl = customRedirect || `${frontendUrl}/auth/callback`;
    const encodedRedirect = encodeURIComponent(callbackUrl);

    // Redirect to backend OAuth endpoint
    window.location.href = `${apiUrl}/api/v1/oauth/${provider}?redirect=${encodedRedirect}`;
};

/**
 * Get available OAuth providers from the API
 * 
 * @returns Promise with list of available providers
 */
export const getAvailableProviders = async (): Promise<OAuthProviderConfig[]> => {
    const apiUrl = getApiBaseUrl();

    try {
        const response = await fetch(`${apiUrl}/api/v1/oauth/providers`);
        const data = await response.json();

        if (data.success) {
            return data.data.providers;
        }
    } catch (error) {
        console.warn('Failed to fetch OAuth providers from API, using mock:', error);
        // Fallback to mock data
        try {
            const mockResponse = await fetch('/mock/oauth-providers.json');
            const mockData = await mockResponse.json();
            if (mockData.success) {
                return mockData.data.providers;
            }
        } catch (mockError) {
            console.error('Failed to fetch mock OAuth providers:', mockError);
        }
    }

    return [];
};

/**
 * Check if a specific OAuth provider is enabled
 * 
 * @param provider - The OAuth provider to check
 * @returns Promise<boolean>
 */
export const isProviderEnabled = async (provider: OAuthProvider): Promise<boolean> => {
    try {
        const providers = await getAvailableProviders();
        const providerConfig = providers.find(p => p.name === provider);
        return providerConfig?.enabled ?? false;
    } catch {
        return false;
    }
};

/**
 * Get linked OAuth providers for the current user
 * Requires authentication
 * 
 * @param token - JWT auth token
 * @returns Promise with list of linked provider names
 */
export const getLinkedProviders = async (token: string): Promise<string[]> => {
    try {
        const apiUrl = getApiBaseUrl();
        const response = await fetch(`${apiUrl}/api/v1/oauth/linked`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.success) {
            return data.data.providers;
        }

        return [];
    } catch (error) {
        console.error('Failed to fetch linked providers:', error);
        return [];
    }
};

/**
 * Unlink an OAuth provider from the current user's account
 * Requires authentication
 * 
 * @param token - JWT auth token
 * @param provider - Provider to unlink
 * @returns Promise with success status and message
 */
export const unlinkProvider = async (
    token: string,
    provider: OAuthProvider
): Promise<{ success: boolean; message: string }> => {
    try {
        const apiUrl = getApiBaseUrl();
        const response = await fetch(`${apiUrl}/api/v1/oauth/unlink/${provider}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        return {
            success: data.success,
            message: data.message || (data.success ? 'Account unlinked successfully' : 'Failed to unlink account'),
        };
    } catch (error) {
        console.error('Failed to unlink provider:', error);
        return {
            success: false,
            message: 'Network error. Please try again.',
        };
    }
};

/**
 * Link a new OAuth provider to the current user's account
 * Redirects to OAuth flow
 * 
 * @param provider - Provider to link
 */
export const linkProvider = (provider: OAuthProvider): void => {
    // Same as login - backend will handle the linking when user is already authenticated
    initiateOAuthLogin(provider);
};

/**
 * Parse OAuth callback URL parameters
 * 
 * @param searchParams - URLSearchParams from the callback URL
 * @returns Parsed callback data
 */
export const parseOAuthCallback = (searchParams: URLSearchParams): {
    token: string | null;
    isNewUser: boolean;
    provider: string | null;
    userId: string | null;
    error: string | null;
    message: string | null;
} => {
    return {
        token: searchParams.get('token'),
        isNewUser: searchParams.get('isNewUser') === 'true',
        provider: searchParams.get('provider'),
        userId: searchParams.get('userId'),
        error: searchParams.get('error'),
        message: searchParams.get('message'),
    };
};

/**
 * Provider display information
 */
export const providerInfo: Record<OAuthProvider, {
    displayName: string;
    color: string;
    bgColor: string;
}> = {
    google: {
        displayName: 'Google',
        color: '#DB4437',
        bgColor: '#fff',
    },
    facebook: {
        displayName: 'Facebook',
        color: '#1877F2',
        bgColor: '#fff',
    },
    apple: {
        displayName: 'Apple',
        color: '#000000',
        bgColor: '#fff',
    },
};

export default {
    initiateOAuthLogin,
    getAvailableProviders,
    isProviderEnabled,
    getLinkedProviders,
    unlinkProvider,
    linkProvider,
    parseOAuthCallback,
    providerInfo,
};
