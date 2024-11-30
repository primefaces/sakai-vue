import axios from 'axios';
import router from '@/router';

const api = axios.create({
  // paladin  !important every static baseURL must be switched to a file to be imported from
 // for now this is acceptable , in future we will make all the path inside a new file for easier management
  baseURL: 'http://localhost:8080/api',  
  withCredentials: true, // Allow cookies to be sent with requests
});

let accessToken = null;

// Request interceptor to add access token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
      console.log('Response received:', response);
      return response; // Pass successful responses
    },
    async (error) => {
      console.error('Request failed:', error);
  
      // Check for 401 errors and avoid infinite retry loops
      if (error.response?.status === 401 && !error.config._retry) {
        console.warn('401 Unauthorized error detected. Attempting to refresh token...');
        error.config._retry = true; // Mark the request as already retried
  
        try {
          // Call the refresh endpoint
          const { data } = await axios.post(
            'http://localhost:8080/api/auth/refresh',
            {},
            { withCredentials: true }
          );
          accessToken = data.accessToken;
          console.log('REFRESH TOKEN SUCCESS:', accessToken);
  
          // Update the original request with the new token
          error.config.headers['Authorization'] = `Bearer ${accessToken}`;
          console.log('Retrying original request with new access token...');
  
          // Retry the original request
          return api.request(error.config);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError.response || refreshError.message);
          router.push('/login'); // Redirect to login on failure
        }
      }
  
      // If the error is not a 401 or refresh fails, reject the promise
      return Promise.reject(error);
    }
  );
  



export default api;
