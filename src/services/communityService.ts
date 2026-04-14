import apiClient from "./apiClient";
import type {
  CommunityPost,
  CreatePostRequest,
  CommunityComment,
  CreateCommentRequest,
} from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Community Service
// GET    /community/posts?filter=all
// POST   /community/post
// POST   /community/like/:postId
// POST   /community/comment
// GET    /community/comments/:postId
// ─────────────────────────────────────────────────────────────────────────────

export const communityService = {
  /**
   * GET /community/posts?filter=all
   * Fetch all community posts. Pass a filter value or leave undefined for all.
   */
  getPosts: async (filter: string = "all"): Promise<CommunityPost[]> => {
    const response = await apiClient.get<CommunityPost[]>("/community/posts", {
      params: { filter },
    });
    return response.data;
  },

  /**
   * POST /community/post
   * Create a new community post.
   */
  createPost: async (data: CreatePostRequest): Promise<CommunityPost> => {
    const response = await apiClient.post<CommunityPost>(
      "/community/post",
      data
    );
    return response.data;
  },

  /**
   * POST /community/like/:postId
   * Toggle like on a post.
   */
  likePost: async (postId: string): Promise<unknown> => {
    const response = await apiClient.post(
      `/community/like/${encodeURIComponent(postId)}`
    );
    return response.data;
  },

  /**
   * POST /community/comment
   * Add a comment to a post.
   */
  addComment: async (data: CreateCommentRequest): Promise<CommunityComment> => {
    const response = await apiClient.post<CommunityComment>(
      "/community/comment",
      data
    );
    return response.data;
  },

  /**
   * GET /community/comments/:postId
   * Fetch all comments for a post.
   */
  getComments: async (postId: string): Promise<CommunityComment[]> => {
    const response = await apiClient.get<CommunityComment[]>(
      `/community/comments/${encodeURIComponent(postId)}`
    );
    return response.data;
  },
};
