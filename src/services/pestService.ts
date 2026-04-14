import apiClient from "./apiClient";
import type {
  PestDetectResponse,
  PestTreatmentRequest,
  PestTreatmentResponse,
} from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Pest Service
// POST /pest/detect  — multipart/form-data with "image" file field
// POST /pest/treatment — JSON { pest: string }
// ─────────────────────────────────────────────────────────────────────────────

export const pestService = {
  /**
   * POST /pest/detect
   * Upload an image file to detect pest/disease.
   * @param imageFile - The File object from an <input type="file">
   */
  detectPest: async (imageFile: File): Promise<PestDetectResponse> => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await apiClient.post<PestDetectResponse>(
      "/pest/detect",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * POST /pest/treatment
   * Get treatment recommendations for a detected pest.
   * @param data - { pest: "name of the pest/disease" }
   */
  getTreatment: async (
    data: PestTreatmentRequest
  ): Promise<PestTreatmentResponse> => {
    const response = await apiClient.post<PestTreatmentResponse>(
      "/pest/treatment",
      data
    );
    return response.data;
  },
};
