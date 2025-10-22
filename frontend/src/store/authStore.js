/**
 * Authentication state management using Zustand
 */
import { create } from 'zustand';
import { authAPI } from '../services/api';

// Demo mode for development when backend is not available
const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true' || !process.env.REACT_APP_API_URL;
const DEMO_CREDENTIALS = {
  email: 'demo@switchragent.com',
  password: 'demo123',
};

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    // Demo mode authentication
    if (DEMO_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        const mockToken = 'demo-token-' + Date.now();
        const mockUser = {
          id: 'demo-user-id',
          email: DEMO_CREDENTIALS.email,
          full_name: 'Demo User',
          created_at: new Date().toISOString(),
        };

        localStorage.setItem('access_token', mockToken);

        set({
          token: mockToken,
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });

        return true;
      } else {
        set({
          error: 'Invalid email or password. Use demo@switchragent.com / demo123',
          isLoading: false,
        });
        return false;
      }
    }

    // Real backend authentication
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('access_token', data.access_token);

      // Fetch user data
      const user = await authAPI.getCurrentUser();

      set({
        token: data.access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Login failed. Backend server not available.',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });

    // Demo mode registration
    if (DEMO_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockToken = 'demo-token-' + Date.now();
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email: userData.email,
        full_name: userData.full_name,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem('access_token', mockToken);

      set({
        token: mockToken,
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    }

    // Real backend registration
    try {
      await authAPI.register(userData);
      // After registration, log in automatically
      return await useAuthStore.getState().login(userData.email, userData.password);
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Registration failed. Backend server not available.',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  fetchUser: async () => {
    if (!useAuthStore.getState().token) return;

    // Demo mode - skip fetching user
    if (DEMO_MODE) {
      const token = localStorage.getItem('access_token');
      if (token && token.startsWith('demo-token')) {
        set({
          user: {
            id: 'demo-user-id',
            email: DEMO_CREDENTIALS.email,
            full_name: 'Demo User',
            created_at: new Date().toISOString(),
          },
        });
      }
      return;
    }

    try {
      const user = await authAPI.getCurrentUser();
      set({ user });
    } catch (error) {
      // If fetching user fails, token might be invalid
      useAuthStore.getState().logout();
    }
  },
}));

export default useAuthStore;
