import axios from 'axios';
import { Profile } from '../types/profile';

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
export const commentApi = {
  createComment: async (userId: number, postId: number, content: string) => {
    const requestBody = {
      userId: userId,
      postId: postId,
      content: content.trim()
    };
    
    console.log('Sending comment request:', requestBody);
    console.log('To URL:', `${COMREACT_SERVICE_URL}/comments`);
    
    const response = await axios.post(
      `${COMREACT_SERVICE_URL}/comments`, 
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },

  getCommentsByPost: async (postId: number) => {
    const response = await axios.get(`${COMREACT_SERVICE_URL}/comments/posts/${postId}`);
    // Map backend comment format to frontend format
    return response.data.map((comment: any) => ({
      id: comment.id,
      userId: comment.userId,
      postId: comment.postId,
      content: comment.content,
      time: comment.time || comment.createdAt || new Date().toISOString()
    }));
  },

  deleteComment: async (commentId: number) => {
    await axios.delete(`${COMREACT_SERVICE_URL}/comments/${commentId}`);
  }
};

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

// Follow API - matches backend FollowController structure
// Uses X-User-Id header and query parameters
// Base path: /api/follows
export const followApi = {
  // Follow a user
  // POST /api/follows?followingId={followingId}
  // Header: X-User-Id: {followerId}
  followUser: async (followingId: number, followerId: number) => {
    console.log('followUser called:', { followingId, followerId, url: `${FOLLOW_SERVICE_URL}/api/follows` });
    try {
      const response = await axios.post(
        `${FOLLOW_SERVICE_URL}/api/follows`,
        null,
        {
          params: { followingId },
          headers: { 'X-User-Id': followerId.toString() }
        }
      );
      console.log('followUser success:', response.status, response.data);
      return response.data;
    } catch (error: any) {
      console.error('followUser error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  // Unfollow a user
  // DELETE /api/follows?followingId={followingId}
  // Header: X-User-Id: {followerId}
  unfollowUser: async (followingId: number, followerId: number) => {
    console.log('unfollowUser called:', { followingId, followerId, url: `${FOLLOW_SERVICE_URL}/api/follows` });
    try {
      // Use URL directly for DELETE requests to avoid axios issues with query params
      const url = `${FOLLOW_SERVICE_URL}/api/follows?followingId=${followingId}`;
      const response = await axios.delete(url, {
        headers: { 'X-User-Id': followerId.toString() }
      });
      console.log('unfollowUser success:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('unfollowUser error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  // Get list of user IDs that a user is following
  // GET /api/follows/following?userId={userId}
  getFollowing: async (userId: number) => {
    const response = await axios.get(`${FOLLOW_SERVICE_URL}/api/follows/following`, {
      params: { userId }
    });
    return response.data;
  },

  // Get list of user IDs that follow a user
  // GET /api/follows/followers?userId={userId}
  getFollowers: async (userId: number) => {
    const response = await axios.get(`${FOLLOW_SERVICE_URL}/api/follows/followers`, {
      params: { userId }
    });
    return response.data;
  },

  // Get follower/following counts for a user
  // GET /api/follows/stats?userId={userId}
  // Returns: { userId, followingCount, followersCount }
  getStats: async (userId: number) => {
    const response = await axios.get(`${FOLLOW_SERVICE_URL}/api/follows/stats`, {
      params: { userId }
    });
    return response.data;
  },

  // Check if followerId is following followingId
  // GET /api/follows/check?followingId={followingId}
  // Header: X-User-Id: {followerId}
  checkFollow: async (followingId: number, followerId: number) => {
    try {
      const response = await axios.get(`${FOLLOW_SERVICE_URL}/api/follows/check`, {
        params: { followingId },
        headers: { 'X-User-Id': followerId.toString() }
      });
      return response.data;
    } catch (error: any) {
      console.error('checkFollow error:', error.response?.data || error.message);
      return false;
    }
  },

  // Legacy methods for backward compatibility
  follow: async (targetUserId: number, authToken: string, followerId?: number) => {
    let currentUserId = followerId;
    if (!currentUserId) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        currentUserId = user.id || user.profileId;
      }
    }
    if (!currentUserId) {
      throw new Error('User ID not found');
    }
    return followApi.followUser(targetUserId, currentUserId);
  },

  unfollow: async (targetUserId: number, authToken: string, followerId?: number) => {
    let currentUserId = followerId;
    if (!currentUserId) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        currentUserId = user.id || user.profileId;
      }
    }
    if (!currentUserId) {
      throw new Error('User ID not found');
    }
    return followApi.unfollowUser(targetUserId, currentUserId);
  },

  getFollowingIds: async (userId: number) => {
    return followApi.getFollowing(userId);
  },

  isFollowing: async (targetUserId: number, authToken: string, followerId?: number) => {
    let currentUserId = followerId;
    if (!currentUserId) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        currentUserId = user.id || user.profileId;
      }
    }
    if (!currentUserId) {
      return false;
    }
    return followApi.checkFollow(targetUserId, currentUserId);
  },

  getCounts: async (userId: number) => {
    const stats = await followApi.getStats(userId);
    // Map backend response to expected format
    return {
      followers: stats.followersCount || 0,
      following: stats.followingCount || 0
    };
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
  },

  searchProfiles: async (query: string): Promise<Profile[]> => {
    // Remove spaces from query as backend expects no spaces
    const cleanQuery = query.trim().replace(/\s+/g, '');
    const response = await axios.get(`${PROFILE_SERVICE_URL}/profiles/search/${cleanQuery}`);
    // Map backend pid to frontend id and profileId
    return response.data.map((profile: any): Profile => ({
      ...profile,
      id: profile.pid,
      profileId: profile.pid
    }));
  }
};
