import apiClient from "./apiClient";
import type { WeatherData } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Weather Service
// GET /weather/:city
// ─────────────────────────────────────────────────────────────────────────────

export const weatherService = {
  /**
   * GET /weather/:city
   * Fetch weather data for a given city.
   * @example weatherService.getWeather("kanpur")
   */
  getWeather: async (city: string): Promise<WeatherData> => {
    const response = await apiClient.get<WeatherData>(
      `/weather/${encodeURIComponent(city)}`
    );
    return response.data;
  },
};
