import axios from 'axios';
import { CommentRequest, PostComment } from '../types/post';

const POST_SERVICE_URL = 'http://localhost:8083';
const COMREACT_SERVICE_URL = 'http://localhost:8084';
const FOLLOW_SERVICE_URL = 'http://localhost:8085';
const PROFILE_SERVICE_URL = 'http://localhost:8082';

// Post API
export const postApi = {
  createPost: async (content: string, imageUrl: string | null, userId: number) => {
    const response = await axios.post(
      `${POST_SERVICE_URL}/api/posts`,
      { content, imageUrl },
      { headers: { 'X-User-Id': userId.toString() } }
    );
    return response.data;
  },

  getPost: async (postId: number) => {
    const response = await axios.get(`${POST_SERVICE_URL}/api/posts/${postId}`);
    return response.data;
  },

  getUserPosts: async (userId: number) => {
    const response = await axios.get(`${POST_SERVICE_URL}/api/posts/user/${userId}`);
    return response.data;
  },

  getFeed: async (userIds: number[]) => {
    const params = new URLSearchParams();
    userIds.forEach(id => params.append('userIds', id.toString()));
    const response = await axios.get(`${POST_SERVICE_URL}/api/posts/feed?${params.toString()}`);
    return response.data;
  },

  deletePost: async (postId: number, userId: number) => {
    await axios.delete(`${POST_SERVICE_URL}/api/posts/${postId}`, {
      headers: { 'X-User-Id': userId.toString() }
    });
  }
};

// Comment API
// export const commentApi = {
//   createComment: async (userId: number, postId: number, content: string) => {
//     const response = await axios.post(`${COMREACT_SERVICE_URL}/comments`, {
//       userId,
//       postId,
//       content
//     });
//     return response.data;
//   },

//   getCommentsByPost: async (postId: number) => {
//     const response = await axios.get(`${COMREACT_SERVICE_URL}/comments/posts/${postId}`);
//     return response.data;
//   },

//   deleteComment: async (commentId: number) => {
//     await axios.delete(`${COMREACT_SERVICE_URL}/comments/${commentId}`);
//   }
// };

// Reaction API
export const reactionApi = {
  createReaction: async (userId: number, postId: number, reaction: 'LIKE' | 'DISLIKE') => {
    const response = await axios.post(`${COMREACT_SERVICE_URL}/reactions`, {
      userId,
      postId,
      reaction
    });
    return response.data;
  },

  getReactionsByPost: async (postId: number) => {
    const response = await axios.get(`${COMREACT_SERVICE_URL}/reactions/posts/${postId}`);
    return response.data;
  },

  deleteReaction: async (reactionId: number) => {
    await axios.delete(`${COMREACT_SERVICE_URL}/reactions/${reactionId}`);
  }
};

// Follow API
export const followApi = {
  follow: async (targetUserId: number, authToken: string) => {
    const token = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    await axios.post(
      `${FOLLOW_SERVICE_URL}/follows/${targetUserId}`,
      {},
      { headers: { Authorization: token } }
    );
  },

  unfollow: async (targetUserId: number, authToken: string) => {
    const token = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    await axios.delete(`${FOLLOW_SERVICE_URL}/follows/${targetUserId}`, {
      headers: { Authorization: token }
    });
  },

  getFollowing: async (authToken: string) => {
    const token = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    const response = await axios.get(`${FOLLOW_SERVICE_URL}/follows/me/following`, {
      headers: { Authorization: token }
    });
    return response.data;
  },

  getFollowers: async (userId: number) => {
    const response = await axios.get(`${FOLLOW_SERVICE_URL}/follows/${userId}/followers`);
    return response.data;
  },

  getFollowingIds: async (userId: number) => {
    const response = await axios.get(`${FOLLOW_SERVICE_URL}/follows/${userId}/following`);
    return response.data;
  },

  isFollowing: async (targetUserId: number, authToken: string) => {
    const token = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    const response = await axios.get(
      `${FOLLOW_SERVICE_URL}/follows/me/is-following/${targetUserId}`,
      { headers: { Authorization: token } }
    );
    return response.data.isFollowing;
  },

  getCounts: async (userId: number) => {
    const response = await axios.get(`${FOLLOW_SERVICE_URL}/follows/${userId}/counts`);
    return response.data;
  }
};

// Profile API
export const profileApi = {
  getProfile: async (userId: number) => {
    const response = await axios.get(`${PROFILE_SERVICE_URL}/profiles/${userId}`);
    return response.data;
  },

  getProfiles: async (userIds: number[]) => {
    const profiles = await Promise.all(
      userIds.map(id => profileApi.getProfile(id).catch(() => null))
    );
    return profiles.filter(p => p !== null);
  }
};

export const commentApi = {
  // Get all comments for a specific post
  async getCommentsByPost(postId: number): Promise<PostComment[]> {
    try {
      const response = await fetch(`${COMREACT_SERVICE_URL}/api/comments/posts/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async createComment(userId: number, postId: number, content: string): Promise<PostComment> {
    try {
      const commentRequest : CommentRequest = {
        userId,
        postId,
        content,
      };

      const response = await fetch(`${COMREACT_SERVICE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentRequest),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create comment: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  async getCommentById(commentId: number): Promise<PostComment> {
    try {
      const response = await fetch(`${COMREACT_SERVICE_URL}/api/comments/${commentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comment: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching comment:', error);
      throw error;
    }
  },

  async deleteComment(commentId: number): Promise<void> {
    try {
      const response = await fetch(`${COMREACT_SERVICE_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
};
