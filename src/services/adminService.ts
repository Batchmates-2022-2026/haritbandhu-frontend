import apiClient from "./apiClient";
import type { AdminUser, AdminStats, AdminActivity } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Admin Service  (requires ADMIN role JWT)
// GET    /admin/users
// GET    /admin/activity
// GET    /admin/stats
// DELETE /admin/user/:id
// ─────────────────────────────────────────────────────────────────────────────

export const adminService = {
  /**
   * GET /admin/users
   * Returns list of all registered users.
   */
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await apiClient.get<AdminUser[]>("/admin/users");
    return response.data;
  },

  /**
   * GET /admin/activity
   * Returns recent platform activity logs.
   */
  getActivity: async (): Promise<AdminActivity[]> => {
    const response = await apiClient.get<AdminActivity[]>("/admin/activity");
    return response.data;
  },

  /**
   * GET /admin/stats
   * Returns aggregate platform statistics.
   */
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get<AdminStats>("/admin/stats");
    return response.data;
  },

  /**
   * DELETE /admin/user/:id
   * Remove a user by their ID.
   */
  deleteUser: async (userId: number | string): Promise<unknown> => {
    const response = await apiClient.delete(`/admin/user/${userId}`);
    return response.data;
  },
};
