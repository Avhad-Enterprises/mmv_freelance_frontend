import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
//  const BASE_URL = "https://api.makemyvid.io/";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // List of public endpoints that don't require authentication
    const publicEndpoints = [
      'api/v1/projects-tasks/listings',
      'api/v1/categories',
      'api/v1/skills'
    ];
    
    // Check if this is a request to a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    const token = localStorage.getItem("token");
    console.log("API Request - Token from localStorage:", token);
    
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
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication failed - clearing token");
      
      // Don't redirect for login endpoint failures (wrong credentials)
      if (error.config?.url?.includes('/auth/login')) {
        // Let the login form handle the error display
        return Promise.reject(error);
      }
      
      // List of public endpoints that don't require authentication
      const publicEndpoints = [
        'api/v1/projects-tasks/listings',
        'api/v1/categories',
        'api/v1/skills'
      ];
      
      // Check if the failed request was to a public endpoint
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        error.config?.url?.includes(endpoint)
      );
      
      // Only clear token and redirect if this is NOT a public endpoint
      if (!isPublicEndpoint) {
        localStorage.removeItem("token");
        
        // For protected endpoints, redirect to home page
        if (typeof window !== 'undefined') {
          // Only redirect if not already on home page
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }
      } else {
        // For public endpoints, just log the error and continue
        console.warn("Public endpoint returned 401, this might be a backend configuration issue");
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
