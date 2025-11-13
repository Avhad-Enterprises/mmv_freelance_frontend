"use server";

// 1. IMPORTANT: Load API Key from environment variables for security.
// Do NOT hardcode the API key in your code.
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GEOCODE_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

/**
 * Defines the structure for the geolocation data returned on success.
 */
interface GeocodingResult {
    lat: number;
    lng: number;
    formatted_address: string;
}

/**
 * Defines the standardized response structure for the Server Action, 
 * returning either data on success or an error message on failure.
 */
interface ServerActionResponse {
    data?: GeocodingResult;
    error?: string;
    usedFallback?: boolean; // Flag to indicate if fallback was used
}

/**
 * Returns fallback coordinates when geocoding fails or is unavailable.
 * This ensures the application continues to work even if the API is down or quota is exceeded.
 */
function getFallbackCoordinates(address: string): ServerActionResponse {
    console.warn(`[Server Action] Using fallback coordinates for address: '${address}'`);
    return {
        data: {
            lat: 0,
            lng: 0,
            formatted_address: address // Keep the original address
        },
        usedFallback: true
    };
}

/**
 * Attempts to geocode an address using Google Maps API.
 * If the API fails for any reason (quota exceeded, network error, etc.),
 * it gracefully falls back to default coordinates without showing errors to the user.
 */
export async function geocodeAddress(address: string): Promise<ServerActionResponse> {

    // Sanitize and validate input
    const sanitizedAddress = address?.trim();
    if (!sanitizedAddress) {
        console.warn("[Server Action] Empty address provided, using fallback.");
        return getFallbackCoordinates(sanitizedAddress || "Unknown");
    }

    // Check if the API key is configured on the server
    if (!API_KEY) {
        console.warn("[Server Action] Google Maps API key is not configured. Using fallback coordinates.");
        return getFallbackCoordinates(sanitizedAddress);
    }

    console.log(`[Server Action] Attempting to geocode address: '${sanitizedAddress}'`);

    // Construct the URL with query parameters
    const url = new URL(GEOCODE_API_URL);
    url.searchParams.append('address', sanitizedAddress);
    url.searchParams.append('key', API_KEY);

    try {
        // Make the API request using fetch with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(url.toString(), {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Handle HTTP errors (e.g., 400, 403, 500)
        if (!response.ok) {
            const statusText = response.statusText || 'Unknown HTTP Error';
            console.warn(`[Server Action] HTTP Error ${response.status}: ${statusText}. Using fallback.`);
            return getFallbackCoordinates(sanitizedAddress);
        }

        // Parse the JSON response
        const data: any = await response.json();

        // Check the Google API status code from the response body
        if (data.status === 'OK' && data.results && data.results.length > 0) {
            const result = data.results[0];
            const location = result.geometry.location;

            const coordinates: GeocodingResult = {
                lat: location.lat,
                lng: location.lng,
                formatted_address: result.formatted_address || sanitizedAddress,
            };

            console.log("[Server Action] Successfully retrieved coordinates.");
            return { data: coordinates, usedFallback: false };

        } else if (data.status === 'ZERO_RESULTS') {
            console.warn(`[Server Action] ZERO_RESULTS for address: '${sanitizedAddress}'. Using fallback.`);
            return getFallbackCoordinates(sanitizedAddress);

        } else if (data.status === 'OVER_QUERY_LIMIT') {
            console.warn(`[Server Action] Quota exceeded for geocoding API. Using fallback.`);
            return getFallbackCoordinates(sanitizedAddress);

        } else {
            // Handle other API-specific errors (e.g., INVALID_REQUEST, REQUEST_DENIED)
            const errorMessage = data.error_message || `API Error (${data.status})`;
            console.warn(`[Server Action] ${errorMessage}. Using fallback.`);
            return getFallbackCoordinates(sanitizedAddress);
        }

    } catch (e) {
        // Handle network errors, timeout, JSON parsing errors, etc.
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        console.warn(`[Server Action] Geocoding failed: ${errorMessage}. Using fallback.`);
        return getFallbackCoordinates(sanitizedAddress);
    }
}