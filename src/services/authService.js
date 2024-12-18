const API_URL = 'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api';

class AuthService {
  // Helper method to handle API responses consistently
  static async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    return data;
  }

  // Store authentication token in localStorage
  static setToken(token) {
    if (token) {
      localStorage.setItem('jwt_token', token);
    }
  }

  // Retrieve token from localStorage
  static getToken() {
    return localStorage.getItem('jwt_token');
  }

  // Remove token and user data during logout
  static clearAuth() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  }

  // Generate authorization headers for API requests
  static getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Register a new user
  static async register({ firstname, lastname, email, password }) {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password
        })
      });

      const data = await this.handleResponse(response);
      this.setToken(data.token);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login an existing user
  static async login({ email, password }) {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await this.handleResponse(response);
      this.setToken(data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Fetch current user's profile data
  static async getCurrentUser() {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!this.getToken();
  }

  // Logout user
  static logout() {
    this.clearAuth();
  }
}

export default AuthService;