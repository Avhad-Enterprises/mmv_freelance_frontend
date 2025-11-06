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
}

// TEMPORARILY DISABLED: Google Maps API geocoding due to quota limits
// Uncomment when quota is restored
/*
export async function geocodeAddress(address: string): Promise<ServerActionResponse> {

    // Check if the API key is configured on the server
    if (!API_KEY) {
        console.error("[Server Action] Google Maps API key is not configured.");
        return { error: "Server configuration error: Geocoding service is unavailable." };
    }

    // 2. Sanitize and validate input
    const sanitizedAddress = address?.trim();
    if (!sanitizedAddress) {
        return { error: "Address input cannot be empty." };
    }

    console.log(`[Server Action] Attempting to geocode address: '${sanitizedAddress}'`);

    // Construct the URL with query parameters
    const url = new URL(GEOCODE_API_URL);
    url.searchParams.append('address', sanitizedAddress);
    url.searchParams.append('key', API_KEY);

    try {
        // 3. Make the API request using fetch
        const response = await fetch(url.toString(), {
            method: 'GET',
            // It's often beneficial to set cache: 'no-store' for external API calls
            cache: 'no-store'
        });

        // 4. Handle HTTP errors (e.g., 400, 403, 500)
        if (!response.ok) {
            const statusText = response.statusText || 'Unknown HTTP Error';
            console.error(`HTTP Error ${response.status}: ${statusText}`);
            return { error: `Geocoding service returned an HTTP error (${response.status} - ${statusText}).` };
        }

        // 5. Parse the JSON response
        const data: any = await response.json();

        // 6. Check the Google API status code from the response body
        if (data.status === 'OK' && data.results && data.results.length > 0) {
            const result = data.results[0];
            const location = result.geometry.location;

            const coordinates: GeocodingResult = {
                lat: location.lat,
                lng: location.lng,
                // Use the formatted address returned by the API, or the input if missing
                formatted_address: result.formatted_address || sanitizedAddress,
            };

            console.log("[Server Action] Successfully retrieved coordinates.");
            return { data: coordinates };

        } else if (data.status === 'ZERO_RESULTS') {
            // Address could not be geocoded
            console.warn(`[Server Action] ZERO_RESULTS for address: '${sanitizedAddress}'`);
            return { error: `Address not found: '${sanitizedAddress}'. Please refine your search.` };

        } else {
            // Handle other API-specific errors (e.g., INVALID_REQUEST, OVER_QUERY_LIMIT)
            const errorMessage = data.error_message || `API Error (${data.status}): Unknown geocoding issue.`;
            console.error(`[Server Action] API Error (${data.status}): ${errorMessage}`);
            return { error: errorMessage };
        }

    } catch (e) {
        // Handle network errors, JSON parsing errors, etc.
        const errorMessage = e instanceof Error ? e.message : "An unexpected network error occurred.";
        console.error(`[Server Action] Catch Error: ${errorMessage}`, e);
        return { error: `An internal server error occurred: ${errorMessage}` };
    }
}
*/

// TEMPORARY FALLBACK: Return null coordinates when geocoding is disabled
export async function geocodeAddress(address: string): Promise<ServerActionResponse> {
    console.log(`[Server Action] Geocoding temporarily disabled for address: '${address}'`);
    return {
        data: {
            lat: 0,
            lng: 0,
            formatted_address: address // Keep the original address
        }
    };
}