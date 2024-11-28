import api from './api';

const authService = {
  async login(email, password) {
    try {
      // Send login request to the backend
      const { data } = await api.post('/auth/login', {
        email: email, // Pass email
        password: password, // Pass password
      });

      // Return the JWT (assuming the backend returns a "jwt" field)
      return data.jwt;
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      throw error; // Propagate the error
    }
  },
};

export default authService;
