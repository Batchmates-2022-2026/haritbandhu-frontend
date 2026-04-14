import apiClient from "./apiClient";
import type { Crop } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Crop Service
// GET /crop/filter?season=<season>&search=<keyword>
// ─────────────────────────────────────────────────────────────────────────────

export type CropSeason = "Kharif" | "Rabi" | "Zaid" | string;

export const cropService = {
  /**
   * GET /crop/filter
   * Filter crops by season and optional search keyword.
   * @param season - e.g. "Kharif", "Rabi", "Zaid"
   * @param search - optional crop name keyword e.g. "rice"
   */
  getCrops: async (season?: CropSeason, search?: string): Promise<Crop[]> => {
    const params: Record<string, string> = {};
    if (season) params.season = season;
    if (search) params.search = search;

    const response = await apiClient.get<Crop[]>("/crop/filter", { params });
    return response.data;
  },
};
