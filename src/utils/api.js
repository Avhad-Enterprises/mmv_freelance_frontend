import axios from "axios";
import TokenRefreshService from "./tokenRefresh";
import { authCookies } from "./cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
//  const BASE_URL = "https://api.makemyvid.io/";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const tokenRefreshService = TokenRefreshService.getInstance();

apiClient.interceptors.request.use(
  (config) => {
    // List of public endpoints that don't require authentication
    const publicEndpoints = [
      'api/v1/projects-tasks/listings',
      'api/v1/categories',
      'api/v1/skills',
      'api/v1/contact/submit'
    ];
    
    // Check if this is a request to a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
        const token = authCookies.getToken();
    console.log("API Request - Token from cookies:", token);
    
    // Only add Authorization header if:
    // 1. Token exists and is valid
    // 2. OR if this is NOT a public endpoint (even if token is invalid, let backend handle it)
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API Request - Authorization header set:", config.headers.Authorization);
    } else if (!isPublicEndpoint) {
      console.warn("API Request - No valid token found for protected endpoint");
    } else {
      console.log("API Request - Public endpoint, no auth required");
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors by clearing tokens and redirecting
    if (error.response?.status === 401) {
      console.error("Authentication failed - clearing tokens and redirecting");

      const tokenRefreshService = TokenRefreshService.getInstance();
      tokenRefreshService.clearTokens();

      // List of public endpoints that don't require authentication
      const publicEndpoints = [
        'api/v1/projects-tasks/listings',
        'api/v1/categories',
        'api/v1/skills',
        'api/v1/contact/submit',
        '/auth/login',
        '/auth/register'
      ];

      // Check if the failed request was to a public endpoint
      const isPublicEndpoint = publicEndpoints.some(endpoint =>
        originalRequest.url?.includes(endpoint)
      );

      // Only redirect if this is NOT a public endpoint or login/register
      if (!isPublicEndpoint) {
        if (typeof window !== 'undefined') {
          // Only redirect if not already on home page
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export async function makePostRequest(endpoint, bodyData) {
  return await apiClient.post(endpoint, bodyData);
}

export async function makeGetRequest(endpoint) {
  return await apiClient.get(endpoint);
}

export async function makePutRequest(endpoint, bodyData) {
  return await apiClient.put(endpoint, bodyData);
}

export async function makePatchRequest(endpoint, bodyData) {
  return await apiClient.patch(endpoint, bodyData);
}

export async function makeDeleteRequest(endpoint, data = {}) {
  return await apiClient.delete(endpoint, { data });
}


export default apiClient;
