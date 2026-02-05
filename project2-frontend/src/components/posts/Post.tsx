import React, { useState, useEffect } from 'react';
import { PostWithDetails, Comment, Reaction } from '../../types/post';
import { postApi, commentApi, reactionApi, profileApi } from '../../util/postApi';
import { useAuth } from '../../hooks/useAuth';
import styles from './Post.module.css';

interface PostProps {
  post: PostWithDetails;
  onViewUserWall: (userId: number) => void;
  onUpdatePost?: () => void;
}

export default function Post({ post, onViewUserWall, onUpdatePost }: PostProps) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentPage, setCommentPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');

  const COMMENTS_PER_PAGE = 10;

  useEffect(() => {
    loadReactions();
    loadProfile();
  }, [post.id, post.userId]);

  useEffect(() => {
    if (expanded) {
      loadComments();
    }
  }, [expanded, post.id]);

  const loadProfile = async () => {
    try {
      const profile = await profileApi.getProfile(post.userId);
      setUsername(profile.username || `User ${post.userId}`);
      setAvatar(profile.imgurl || profile.profilePic || '');
    } catch (error) {
      setUsername(`User ${post.userId}`);
    }
  };

  const loadReactions = async () => {
    try {
      const reactionList = await reactionApi.getReactionsByPost(post.id);
      setReactions(reactionList);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const loadComments = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const allComments = await commentApi.getCommentsByPost(post.id);
      const startIndex = commentPage * COMMENTS_PER_PAGE;
      const endIndex = startIndex + COMMENTS_PER_PAGE;
      const newComments = allComments.slice(startIndex, endIndex);
      
      if (newComments.length === 0) {
        setHasMoreComments(false);
      } else {
        setComments(prev => [...prev, ...newComments]);
        setCommentPage(prev => prev + 1);
        if (endIndex >= allComments.length) {
          setHasMoreComments(false);
        }
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (reactionType: 'LIKE' | 'DISLIKE') => {
    if (!user?.profileId) return;

    try {
      const existingReaction = reactions.find(r => r.userId === user.profileId);
      
      if (existingReaction) {
        if (existingReaction.reaction === reactionType) {
          // Remove reaction
          await reactionApi.deleteReaction(existingReaction.id);
        } else {
          // Update reaction
          await reactionApi.createReaction(user.profileId, post.id, reactionType);
        }
      } else {
        // Create new reaction
        await reactionApi.createReaction(user.profileId, post.id, reactionType);
      }
      
      await loadReactions();
      if (onUpdatePost) onUpdatePost();
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.stopPropagation();
    if (!user?.profileId || !commentText.trim()) return;

    try {
      await commentApi.createComment(user.profileId, post.id, commentText);
      setCommentText('');
      setComments([]);
      setCommentPage(0);
      setHasMoreComments(true);
      await loadComments();
      if (onUpdatePost) onUpdatePost();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handlePostClick = (e: React.MouseEvent) => {
    // Don't expand if clicking on username or buttons
    if ((e.target as HTMLElement).closest('.postUsername, .reactionButton, .commentCount')) {
      return;
    }
    setExpanded(!expanded);
  };

  const handleUsernameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewUserWall(post.userId);
  };

  const likes = reactions.filter(r => r.reaction === 'LIKE').length;
  const dislikes = reactions.filter(r => r.reaction === 'DISLIKE').length;
  const userReaction = reactions.find(r => r.userId === user?.profileId)?.reaction;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={styles.post} onClick={handlePostClick}>
      <div className={styles.postHeader}>
        <div
          className={styles.postAvatar}
          onClick={(e) => {
            e.stopPropagation();
            handleUsernameClick(e);
          }}
        >
          {avatar ? (
            <img src={avatar} alt={username} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          ) : (
            getInitials(username)
          )}
        </div>
        <div>
          <div
            className={styles.postUsername}
            onClick={handleUsernameClick}
          >
            {username}
          </div>
        </div>
        <div className={styles.postTime}>{formatTime(post.createdAt)}</div>
      </div>

      <div className={styles.postContent}>{post.content}</div>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" className={styles.postImage} />
      )}

      <div className={styles.postActions}>
        <div className={styles.reactions}>
          <button
            className={`${styles.reactionButton} ${userReaction === 'LIKE' ? `${styles.active} ${styles.like}` : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleReaction('LIKE');
            }}
          >
            👍 {likes}
          </button>
          <button
            className={`${styles.reactionButton} ${userReaction === 'DISLIKE' ? `${styles.active} ${styles.dislike}` : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleReaction('DISLIKE');
            }}
          >
            👎 {dislikes}
          </button>
        </div>
        <div className={styles.commentCount} onClick={(e) => e.stopPropagation()}>
          💬 {comments.length > 0 ? comments.length : 'Comment'}
        </div>
      </div>

      {expanded && (
        <div className={styles.commentsSection} onClick={(e) => e.stopPropagation()}>
          <div className={styles.commentsHeader}>Comments</div>
          
          <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
            <input
              type="text"
              className={styles.commentInput}
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className={styles.commentSubmit}>
              Post
            </button>
          </form>

          <div className={styles.commentsList}>
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} onViewUserWall={onViewUserWall} />
            ))}
            {hasMoreComments && (
              <div className={styles.loadMoreComments} onClick={loadComments}>
                {loading ? 'Loading...' : 'Load more comments'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CommentItem({ comment, onViewUserWall }: { comment: Comment; onViewUserWall: (userId: number) => void }) {
  const { user } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    loadProfile();
    loadReactions();
  }, [comment.userId]);

  const loadProfile = async () => {
    try {
      const profile = await profileApi.getProfile(comment.userId);
      setUsername(profile.username || `User ${comment.userId}`);
      setAvatar(profile.imgurl || profile.profilePic || '');
    } catch (error) {
      setUsername(`User ${comment.userId}`);
    }
  };

  const loadReactions = async () => {
    // Note: Assuming reactions can be on comments too, but API might need adjustment
    // For now, we'll skip comment reactions
  };

  const handleReaction = async (reactionType: 'LIKE' | 'DISLIKE') => {
    // Comment reactions would go here if implemented
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={styles.comment}>
      <div
        className={styles.commentAvatar}
        onClick={() => onViewUserWall(comment.userId)}
      >
        {avatar ? (
          <img src={avatar} alt={username} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        ) : (
          getInitials(username)
        )}
      </div>
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <span
            className={styles.commentUsername}
            onClick={() => onViewUserWall(comment.userId)}
            style={{ cursor: 'pointer' }}
          >
            {username}
          </span>
          <span className={styles.commentTime}>{formatTime(comment.time)}</span>
        </div>
        <div className={styles.commentText}>{comment.content}</div>
      </div>
    </div>
  );
}
