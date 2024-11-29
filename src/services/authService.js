import api from './api';
import { reactive } from 'vue';

export const authState = reactive({
  isLoggedIn: false,
  authChecked: false,
});

export const authService = {
  async login(email, password) {
    try {
      const { data } = await api.post('/auth/login', {
        email,
        password,
      });
      authState.isLoggedIn = true;
      authState.authChecked = true;
      return data.jwt;
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      throw error;
    }
  },

  async isAuthenticated() {
    try {
      const response = await api.get('/auth/validate', { withCredentials: true });
      authState.isLoggedIn = response.status === 200;
      authState.authChecked = true;
      return authState.isLoggedIn;
    } catch (error) {
      console.error('Error during authentication check:', error);
      authState.isLoggedIn = false;
      authState.authChecked = true;
      return false;
    }
  },
};

// Provide a default export for authService
export default authService;
