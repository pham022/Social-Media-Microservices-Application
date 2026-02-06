import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentPage, setCommentPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [totalCommentCount, setTotalCommentCount] = useState(0);
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [deleting, setDeleting] = useState(false);
  
  const isOwnPost = (user?.id === post.userId) || (user?.profileId === post.userId);

  const COMMENTS_PER_PAGE = 10;

  const loadProfile = useCallback(async () => {
    try {
      const profile = await profileApi.getProfile(post.userId);
      setUsername(profile.username || `User ${post.userId}`);
      setAvatar(profile.imgurl || profile.profilePic || '');
    } catch (error) {
      setUsername(`User ${post.userId}`);
    }
  }, [post.userId]);

  const loadReactions = useCallback(async () => {
    try {
      const reactionList = await reactionApi.getReactionsByPost(post.id);
      setReactions(reactionList);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  }, [post.id]);

  const loadComments = useCallback(async (reset: boolean = false) => {
    setLoading(true);
    
    try {
      const allComments = await commentApi.getCommentsByPost(post.id);
      setTotalCommentCount(allComments.length);
      
      if (reset) {
        const firstPage = allComments.slice(0, COMMENTS_PER_PAGE);
        setComments(firstPage);
        setCommentPage(1);
        setHasMoreComments(allComments.length > COMMENTS_PER_PAGE);
      } else {
        setComments(prev => {
          // Deduplicate comments by ID to prevent duplicates
          const existingIds = new Set(prev.map(c => c.id));
          const currentPage = Math.floor(prev.length / COMMENTS_PER_PAGE);
          const startIndex = currentPage * COMMENTS_PER_PAGE;
          const endIndex = startIndex + COMMENTS_PER_PAGE;
          const newComments = allComments
            .slice(startIndex, endIndex)
            .filter((c: Comment) => !existingIds.has(c.id)); // Filter out duplicates
          
          if (newComments.length === 0) {
            setHasMoreComments(false);
            return prev;
          }
          
          setCommentPage(currentPage + 1);
          setHasMoreComments(endIndex < allComments.length);
          return [...prev, ...newComments];
        });
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  }, [post.id]);

  useEffect(() => {
    loadReactions();
    loadProfile();
  }, [post.id, post.userId, loadReactions, loadProfile]);

  // Load comments separately to avoid dependency issues
  useEffect(() => {
    // Only load comments once when post.id changes
    setComments([]);
    setCommentPage(0);
    setHasMoreComments(true);
    setTotalCommentCount(0);
    loadComments(true);
  }, [post.id]); // Only depend on post.id

  const handleReaction = async (reactionType: 'LIKE' | 'DISLIKE') => {
    const userId = user?.id || user?.profileId;
    if (!userId) {
      alert('Please log in to react to posts');
      return;
    }

    try {
      // Find existing reaction by matching userId
      const existingReaction = reactions.find(r => {
        const reactionUserId = r.userId;
        return reactionUserId === userId || reactionUserId === user?.id || reactionUserId === user?.profileId;
      });
      
      if (existingReaction) {
        if (existingReaction.reaction === reactionType) {
          // Remove reaction (user clicked the same reaction again)
          await reactionApi.deleteReaction(existingReaction.id);
        } else {
          // Update reaction (user changed from LIKE to DISLIKE or vice versa)
          await reactionApi.createReaction(userId, post.id, reactionType);
        }
      } else {
        // Create new reaction
        await reactionApi.createReaction(userId, post.id, reactionType);
      }
      
      // Reload reactions to get updated state
      await loadReactions();
      if (onUpdatePost) onUpdatePost();
    } catch (error: any) {
      console.error('Error handling reaction:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error ||
                          error?.message || 
                          'Failed to react to post. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.stopPropagation();
    const userId = user?.id || user?.profileId;
    if (!userId || !commentText.trim()) {
      alert('Please log in to comment');
      return;
    }

    if (!commentText.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      console.log('Creating comment with:', { userId, postId: post.id, content: commentText });
      await commentApi.createComment(userId, post.id, commentText.trim());
      setCommentText('');
      
      // Reset and reload comments to show the new one
      setComments([]);
      setCommentPage(0);
      setHasMoreComments(true);
      await loadComments(true);
      
      if (onUpdatePost) onUpdatePost();
    } catch (error: any) {
      console.error('Error creating comment:', error);
      console.error('Error details:', error?.response?.data);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error ||
                          error?.response?.statusText || 
                          error?.message || 
                          'Failed to post comment. Please try again.';
      alert(`Error: ${errorMessage}`);
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

  const handleDeletePost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isOwnPost) {
      alert('You can only delete your own posts');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    const userId = user?.id || user?.profileId;
    if (!userId) return;

    setDeleting(true);
    try {
      await postApi.deletePost(post.id, userId);
      if (onUpdatePost) {
        onUpdatePost();
      }
    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert(error?.response?.data?.message || 'Failed to delete post. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleViewPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/post/${post.id}`);
  };

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return 'Just now';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      
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
    } catch (error) {
      return 'Just now';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Calculate user reaction status - must be before JSX
  const userId = user?.id || user?.profileId;
  const likes = reactions.filter(r => r.reaction === 'LIKE').length;
  const dislikes = reactions.filter(r => r.reaction === 'DISLIKE').length;
  const userReaction = userId 
    ? reactions.find(r => {
        const reactionUserId = r.userId;
        return reactionUserId === userId || reactionUserId === user?.id || reactionUserId === user?.profileId;
      })?.reaction
    : undefined;

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
        {isOwnPost && (
          <button
            className={styles.deleteButton}
            onClick={handleDeletePost}
            disabled={deleting}
            title="Delete post"
          >
            {deleting ? '...' : '🗑️'}
          </button>
        )}
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
        <div 
          className={styles.commentCount} 
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          💬 {totalCommentCount > 0 ? totalCommentCount : 'Comment'}
        </div>
        <button
          className={styles.viewPostButton}
          onClick={handleViewPost}
          title="View post details"
        >
          View Post
        </button>
      </div>

      {expanded && (
        <div className={styles.commentsSection} onClick={(e) => e.stopPropagation()}>
          <div className={styles.commentsHeader}>Comments</div>
          
          {user && (
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
          )}

          <div className={styles.commentsList}>
            {loading && comments.length === 0 ? (
              <div className={styles.loading}>Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className={styles.emptyComments}>No comments yet. Be the first to comment!</div>
            ) : (
              <>
                {/* Deduplicate comments by ID before rendering */}
                {Array.from(new Map(comments.map(c => [c.id, c])).values()).map((comment) => (
                  <CommentItem key={comment.id} comment={comment} onViewUserWall={onViewUserWall} />
                ))}
                {hasMoreComments && (
                  <div className={styles.loadMoreComments} onClick={() => loadComments()}>
                    {loading ? 'Loading...' : 'Load more comments'}
                  </div>
                )}
              </>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [comment.userId, comment.id]);

  const loadProfile = async () => {
    if (!comment.userId) {
      setUsername('Unknown User');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const profile = await profileApi.getProfile(comment.userId);
      setUsername(profile.username || `User ${comment.userId}`);
      setAvatar(profile.imgurl || profile.profilePic || '');
    } catch (error) {
      console.error('Error loading comment author profile:', error);
      setUsername(`User ${comment.userId}`);
      setAvatar('');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className={styles.comment}>
        <div className={styles.commentAvatar}>
          <div className={styles.avatarPlaceholder}>...</div>
        </div>
        <div className={styles.commentContent}>
          <div className={styles.commentText}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.comment}>
      <div
        className={styles.commentAvatar}
        onClick={() => comment.userId && onViewUserWall(comment.userId)}
      >
        {avatar ? (
          <img src={avatar} alt={username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {getInitials(username)}
          </div>
        )}
      </div>
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <span
            className={styles.commentUsername}
            onClick={() => comment.userId && onViewUserWall(comment.userId)}
            style={{ cursor: 'pointer' }}
          >
            {username}
          </span>
          <span className={styles.commentTime}>{formatTime(comment.time)}</span>
        </div>
        <div className={styles.commentText}>{comment.content || ''}</div>
      </div>
    </div>
  );
}
