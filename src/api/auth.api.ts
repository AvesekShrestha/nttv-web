import { api, refreshClient } from "../lib/axios";
import type { RegisterCredentials, LoginCredentials, AuthResponse } from "../types/auth.type";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      "/auth/login",
      credentials,
    );

    return data;
  },

  async register(
    credentials: RegisterCredentials,
  ): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      "/auth/register",
      credentials,
    );

    return data;
  },

  async refresh(): Promise<AuthResponse> {
    const { data } = await refreshClient.post<AuthResponse>(
      "/auth/refresh",
    );

    return data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
