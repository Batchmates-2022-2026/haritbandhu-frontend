import apiClient from "./apiClient";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Auth Service
// POST /auth/login
// POST /auth/signup
// ─────────────────────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Login with email + password.
   * Saves the JWT token to localStorage under "hb_jwt".
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    const { token } = response.data;
    if (token) {
      localStorage.setItem("hb_jwt", token);
    }
    return response.data;
  },

  /**
   * Register a new user.
   */
  signup: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/signup", data);
    const { token } = response.data;
    if (token) {
      localStorage.setItem("hb_jwt", token);
    }
    return response.data;
  },

  /**
   * Logout — removes the JWT from localStorage.
   */
  logout: (): void => {
    localStorage.removeItem("hb_jwt");
  },

  /**
   * Returns whether the user is currently logged in.
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("hb_jwt");
  },

  /**
   * Returns the raw JWT string.
   */
  getToken: (): string | null => {
    return localStorage.getItem("hb_jwt");
  },
};
