import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "../store/auth.store";
import { fetchCurrentUser } from "../api/user.api";
import type { AuthResponse } from "../types/auth.type";

const BASE_URL =
  import.meta.env.BASE_API_URL ?? "http://localhost:8080/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ApiErrorResponse {
  code?: string;
  message?: string;
}

api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as
      | RetryableRequestConfig
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isExpiredToken =
      error.response?.status === 401 &&
      error.response?.data?.code === "EXPIRED_ACCESS_TOKEN";

    if (!isExpiredToken || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const { data } = await refreshClient.post<AuthResponse>("/auth/refresh");
          const newAccessToken = data.access_token;

          useAuthStore.setState({ accessToken: newAccessToken });

          const user = await fetchCurrentUser()

          useAuthStore.setState({
            user,
            accessToken: newAccessToken,
            isAuthenticated: true,
          });

          return newAccessToken;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }

      return Promise.reject(refreshError);
    }
  },
);
