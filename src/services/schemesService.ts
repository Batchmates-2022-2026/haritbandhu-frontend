import apiClient from "./apiClient";
import type { Scheme } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Government Schemes Service
// GET /schemes?category=<category>
// ─────────────────────────────────────────────────────────────────────────────

export const schemesService = {
  /**
   * GET /schemes?category=<category>
   * Fetch government schemes filtered by category.
   * Common categories: "FARMER", "agriculture", "livestock"
   * @example schemesService.getSchemes("FARMER")
   */
  getSchemes: async (category?: string): Promise<Scheme[]> => {
    const params: Record<string, string> = {};
    if (category) params.category = category;

    const response = await apiClient.get<Scheme[]>("/schemes", { params });
    return response.data;
  },
};
