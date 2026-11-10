import { create } from "zustand";

import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth.type";

import { authService } from "../api/auth.api";
import { fetchCurrentUser } from "@/api/user.api";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  initialized: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;

  initialize: () => Promise<void>;

  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

let initializationPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,

  isAuthenticated: false,
  isLoading: false,
  initialized: false,

  login: async (credentials) => {
    set({ isLoading: true });

    try {
      const response = await authService.login(credentials);

      set({
        user: response.user,
        accessToken: response.access_token,
        isAuthenticated: true,
        initialized: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (credentials) => {
    set({ isLoading: true });

    try {
      await authService.register(credentials);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        initialized: true,
      });
    }
  },

  initialize: async () => {
    if (get().initialized) return;

    if (initializationPromise) {
      return initializationPromise;
    }

    initializationPromise = (async () => {
      set({ isLoading: true });

      try {
        const response = await authService.refresh();

        set({
          accessToken: response.access_token,
        });

        const user = await fetchCurrentUser()

        set({
          user,
          isAuthenticated: true,
        });
      } catch (error) {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });

        throw error;
      } finally {
        set({
          isLoading: false,
          initialized: true,
        });
      }
    })();

    try {
      await initializationPromise;
    } finally {
      initializationPromise = null;
    }
  },

  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));
