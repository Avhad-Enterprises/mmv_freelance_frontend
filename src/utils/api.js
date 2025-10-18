import axios from "axios";

const BASE_URL = "https://api.makemyvid.io/api/v1/";
//  const BASE_URL = "https://api.makemyvid.io/api/v1/";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("API Request - Token from localStorage:", token);
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API Request - Authorization header set:", config.headers.Authorization);
    } else {
      console.warn("API Request - No valid token found, request will be sent without auth");
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
      localStorage.removeItem("token");
      
      // Don't redirect for login endpoint failures (wrong credentials)
      if (error.config?.url?.includes('/auth/login')) {
        // Let the login form handle the error display
        return Promise.reject(error);
      }
      
      // For other endpoints, redirect to home page instead of /login
      if (typeof window !== 'undefined') {
        // Only redirect if not already on home page
        if (window.location.pathname !== '/') {
          window.location.href = '/';
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
