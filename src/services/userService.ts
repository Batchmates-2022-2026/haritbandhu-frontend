import apiClient from "./apiClient";
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  LocationRequest,
  FcmTokenRequest,
  WeatherPreferencesRequest,
  OtpRequest,
} from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// User Service
// All routes require JWT (added by apiClient interceptor)
// ─────────────────────────────────────────────────────────────────────────────

export const userService = {
  /**
   * GET /user/me — fetch the logged-in user's profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>("/user/me");
    return response.data;
  },

  /**
   * POST /user/profile — update username, phone, city
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<unknown> => {
    const response = await apiClient.post("/user/profile", data);
    return response.data;
  },

  /**
   * POST /user/change-password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<unknown> => {
    const response = await apiClient.post("/user/change-password", data);
    return response.data;
  },

  /**
   * POST /user/location — update user city
   */
  updateLocation: async (data: LocationRequest): Promise<unknown> => {
    const response = await apiClient.post("/user/location", data);
    return response.data;
  },

  /**
   * POST /user/save-fcm-token — save Firebase Cloud Messaging token
   */
  saveFcmToken: async (data: FcmTokenRequest): Promise<unknown> => {
    const response = await apiClient.post("/user/save-fcm-token", data);
    return response.data;
  },

  /**
   * POST /user/weather-preferences — set alert preferences
   */
  updateWeatherPreferences: async (
    data: WeatherPreferencesRequest
  ): Promise<unknown> => {
    const response = await apiClient.post("/user/weather-preferences", data);
    return response.data;
  },

  /**
   * POST /user/send-email-otp — request OTP to email
   */
  sendEmailOtp: async (): Promise<unknown> => {
    const response = await apiClient.post("/user/send-email-otp", {});
    return response.data;
  },

  /**
   * POST /user/verify-email-otp — verify the OTP
   */
  verifyEmailOtp: async (data: OtpRequest): Promise<unknown> => {
    const response = await apiClient.post("/user/verify-email-otp", data);
    return response.data;
  },

  /**
   * POST /user/disable-alerts — disable all weather alerts
   */
  disableAlerts: async (): Promise<unknown> => {
    const response = await apiClient.post("/user/disable-alerts", {});
    return response.data;
  },
};
