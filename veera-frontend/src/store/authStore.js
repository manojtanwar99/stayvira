// store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      // State
      isAuthenticated: false,
      user: null,
      token: null,

      // Actions
      login: (userData, token) => 
        set({ 
          isAuthenticated: true, 
          user: userData, 
          token: token 
        }),

      logout: () => 
        set({ 
          isAuthenticated: false, 
          user: null, 
          token: null 
        }),

      setUser: (userData) => 
        set({ user: userData }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);