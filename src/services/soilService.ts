import apiClient from "./apiClient";
import type { SoilAnalyzeRequest, SoilAnalyzeResponse } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Soil Service
// POST /soil/analyze
// ─────────────────────────────────────────────────────────────────────────────

export const soilService = {
  /**
   * POST /soil/analyze
   * Analyze soil composition and get crop recommendations.
   * @param data - NPK values, pH, organic matter %
   */
  analyzeSoil: async (
    data: SoilAnalyzeRequest
  ): Promise<SoilAnalyzeResponse> => {
    const response = await apiClient.post<SoilAnalyzeResponse>(
      "/soil/analyze",
      data
    );
    return response.data;
  },
};
