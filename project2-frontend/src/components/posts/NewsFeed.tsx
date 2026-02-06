import React, { useState, useEffect } from 'react';
import { Post } from '../../types/post';
import { postApi, reactionApi, commentApi, profileApi, followApi } from '../../util/postApi';
import { useAuth } from '../../hooks/useAuth';
import PostComponent from './Post';
import CreatePost from './CreatePost';
import styles from './NewsFeed.module.css';

const POSTS_PER_PAGE = 10;

export default function NewsFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [followingIds, setFollowingIds] = useState<number[]>([]);

  useEffect(() => {
    loadFollowing();
  }, []);

  useEffect(() => {
    if (followingIds.length > 0 || page === 0) {
      loadPosts();
    }
  }, [followingIds, page]);

  const loadFollowing = async () => {
    const userId = user?.id || user?.profileId;
    if (!userId) return;
    
    try {
      const ids = await followApi.getFollowing(userId);
      setFollowingIds(ids);
    } catch (error) {
      console.error('Error loading following:', error);
      setFollowingIds([]);
    }
  };

  const loadPosts = async () => {
    if (loading || !user?.id) return;

    setLoading(true);
    try {
      let newPosts: Post[] = [];
      
      if (followingIds.length === 0) {
        // If not following anyone, show empty state or all posts
        // For now, we'll show an empty state message
        setHasMore(false);
        setLoading(false);
        return;
      }

      const feedPosts = await postApi.getFeed(followingIds);
      
      // Implement pagination
      const startIndex = page * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      newPosts = feedPosts.slice(startIndex, endIndex);

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
        if (endIndex >= feedPosts.length) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadPosts();
    }
  };

  const handleUpdatePost = () => {
    // Refresh posts when a post is updated
    setPosts([]);
    setPage(0);
    setHasMore(true);
    loadPosts();
  };

  if (followingIds.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateTitle}>No Posts to Show</div>
        <div className={styles.emptyStateText}>
          You're not following anyone yet. Start following users to see their posts in your feed!
        </div>
      </div>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateTitle}>No Posts Yet</div>
        <div className={styles.emptyStateText}>
          The users you follow haven't posted anything yet.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.newsFeed}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search something here..."
          className={styles.searchInput}
        />
      </div>
      <div className={styles.createPostSection}>
        <CreatePost onPostCreated={handleUpdatePost} />
      </div>
      <div className={styles.postsList}>
        {posts.map((post) => (
          <PostComponent
            key={post.id}
            post={post as any}
            onUpdatePost={handleUpdatePost}
          />
        ))}
      </div>
      {hasMore && (
        <div className={styles.loadMore}>
          <button onClick={handleLoadMore} disabled={loading} className={styles.loadMoreButton}>
            {loading ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}
    </div>
  );
}
