export interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  time: string;
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
