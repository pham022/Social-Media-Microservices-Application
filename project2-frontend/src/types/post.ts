export interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostComment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  createdAt: string;
}

export interface CommentRequest {
  userId: number;
  postId: number;
  content: string;
}

export interface Reaction {
  id: number;
  userId: number;
  postId: number;
  reaction: 'LIKE' | 'DISLIKE';
}

export interface PostWithDetails extends Post {
  likes: number;
  dislikes: number;
  comments: number;
  userReaction?: 'LIKE' | 'DISLIKE' | null;
  username?: string;
  avatar?: string;
}

export interface FollowCounts {
  followers: number;
  following: number;
}
