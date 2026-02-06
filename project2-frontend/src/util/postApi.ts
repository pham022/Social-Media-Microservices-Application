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
