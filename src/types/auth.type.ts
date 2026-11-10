export type UserRole =
  | "admin"
  | "supervisor"
  | "agent"
  | "staff"
  | "customer";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
  level: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}
