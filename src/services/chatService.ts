import apiClient from "./apiClient";
import type { ChatRequest, ChatResponse } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Chat Service — Gemini AI Assistant
// POST /chat { message: string }
// ─────────────────────────────────────────────────────────────────────────────

export const chatService = {
  /**
   * POST /chat
   * Send a message to the Gemini AI assistant.
   * @param message - The user's message string
   */
  sendMessage: async (message: string): Promise<string> => {
    const payload: ChatRequest = { message };
    const response = await apiClient.post<ChatResponse>("/chat", payload);

    // Backend may return reply in different fields — normalise here
    const data = response.data;
    return data.reply ?? data.message ?? data.response ?? JSON.stringify(data);
  },
};
