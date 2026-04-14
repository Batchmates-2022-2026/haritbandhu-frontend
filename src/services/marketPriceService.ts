import apiClient from "./apiClient";
import type { MarketPriceData } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Market Price Service
// GET /market-price/:crop?state=<state>
// ─────────────────────────────────────────────────────────────────────────────

export const marketPriceService = {
  /**
   * GET /market-price/:crop
   * Optionally filter by state query param.
   * @example marketPriceService.getPrice("mustard", "Punjab")
   */
  getPrice: async (
    crop: string,
    state?: string
  ): Promise<MarketPriceData | MarketPriceData[]> => {
    const params: Record<string, string> = {};
    if (state) params.state = state;

    const response = await apiClient.get<MarketPriceData | MarketPriceData[]>(
      `/market-price/${encodeURIComponent(crop)}`,
      { params }
    );
    return response.data;
  },
};
