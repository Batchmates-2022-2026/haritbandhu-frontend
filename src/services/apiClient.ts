import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// ─── Base URL ─────────────────────────────────────────────────────────────────
export const BASE_URL = import.meta.env.VITE_API_BASE_URL ;
if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

// ─── Axios Instance ───────────────────────────────────────────────────────────
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 70000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor — attach JWT ────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("hb_jwt");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — handle 401 ───────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hb_jwt");
      window.location.href = "/login";
    }
    if(status === 403){
      console.error("Forbidden - invalid token or access denied");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
