// ─────────────────────────────────────────────────────────────────────────────
// HaritBandhu — Shared Types
// Derived from haritmitra_postman_collection.json
// ─────────────────────────────────────────────────────────────────────────────

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  preferredLanguage: string;
}

export interface AuthResponse {
  token: string;
  user?: UserProfile;
}

// ── User ─────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id?: number | string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  city?: string;
  role?: string;
  preferredLanguage?: string;
}

export interface UpdateProfileRequest {
  username: string;
  phone: string;
  city: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface LocationRequest {
  city: string;
}

export interface FcmTokenRequest {
  fcmToken: string;
}

export interface WeatherPreferencesRequest {
  rainAlert: boolean;
  stormAlert: boolean;
  heatAlert: boolean;
  monsoonAlert: boolean;
  city: string;
}

export interface OtpRequest {
  otp?: string;
}

// ── Weather ───────────────────────────────────────────────────────────────────
export interface WeatherData {
  city?: string;
  temperature?: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  description?: string;
  icon?: string;
  alerts?: WeatherAlert[];
  [key: string]: unknown;
}

export interface WeatherAlert {
  type: string;
  message: string;
  severity?: string;
}

// ── Market Price ──────────────────────────────────────────────────────────────
export interface MarketPriceData {
  crop?: string;
  state?: string;
  market?: string;
  minPrice?: number;
  maxPrice?: number;
  modalPrice?: number;
  date?: string;
  [key: string]: unknown;
}

// ── Schemes ───────────────────────────────────────────────────────────────────
export interface Scheme {
  id?: string | number;
  name?: string;
  title?: string;
  category?: string;
  description?: string;
  benefits?: string;
  eligibility?: string;
  applicationLink?: string;
  [key: string]: unknown;
}

// ── Pest ─────────────────────────────────────────────────────────────────────
export interface PestDetectResponse {
  pest?: string;
  confidence?: number;
  disease?: string;
  description?: string;
  [key: string]: unknown;
}

export interface PestTreatmentRequest {
  pest: string;
}

export interface PestTreatmentResponse {
  treatment?: string;
  pesticide?: string;
  organic?: string;
  prevention?: string;
  [key: string]: unknown;
}

// ── Chat ──────────────────────────────────────────────────────────────────────
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply?: string;
  message?: string;
  response?: string;
  [key: string]: unknown;
}

// ── Community ─────────────────────────────────────────────────────────────────
export interface CommunityPost {
  id?: string;
  author_name?: string;
  authorName?: string;
  title?: string;
  content?: string;
  likes?: number;
  comments?: number;
  createdAt?: string;
  [key: string]: unknown;
}

export interface CreatePostRequest {
  author_name: string;
  title: string;
  content?: string;
}

export interface CommunityComment {
  id?: string;
  postId?: string;
  authorName: string;
  content: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface CreateCommentRequest {
  postId: string;
  authorName: string;
  content: string;
}

// ── Crop ─────────────────────────────────────────────────────────────────────
export interface Crop {
  id?: string | number;
  name?: string;
  season?: string;
  description?: string;
  waterRequirement?: string;
  soilType?: string;
  [key: string]: unknown;
}

// ── Soil ─────────────────────────────────────────────────────────────────────
export interface SoilAnalyzeRequest {
  nitrogen: number;
  phosporous: number;
  potassium: number;
  ph: number;
  organic: number;
}

export interface SoilAnalyzeResponse {
  recommendation?: string;
  suitable_crops?: string[];
  deficiencies?: string[];
  amendments?: string[];
  [key: string]: unknown;
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export interface AdminUser {
  id?: number | string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface AdminStats {
  totalUsers?: number;
  activeUsers?: number;
  totalPosts?: number;
  [key: string]: unknown;
}

export interface AdminActivity {
  [key: string]: unknown;
}
