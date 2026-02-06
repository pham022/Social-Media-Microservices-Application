import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../types/post';
import { postApi, profileApi } from '../../util/postApi';
import { useAuth } from '../../hooks/useAuth';
import { useFollow } from '../../hooks/useFollow';
import PostComponent from './Post';
import CreatePost from './CreatePost';
import styles from './MyWallPage.module.css';

interface MyWallPageProps {
  userId: number;
  onViewUserWall: (userId: number) => void;
}

export default function MyWallPage({ userId, onViewUserWall }: MyWallPageProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  const meUserId = user?.id || user?.profileId;
  const authToken = localStorage.getItem('authToken') || '';
  const isOwnWall = (user?.id === userId) || (user?.profileId === userId);
  
  // Use the centralized follow hook
  const { isFollowing, counts, loading: followLoading, follow, unfollow, reload, refreshCounts } = useFollow(
    userId,
    authToken,
    meUserId // Always pass meUserId for proper count calculation
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [postsData, profileData] = await Promise.all([
        postApi.getUserPosts(userId),
        profileApi.getProfile(userId).catch(() => null)
      ]);

      setPosts(postsData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading wall page:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload follow state when userId or user changes
  useEffect(() => {
    if (userId && authToken) {
      if (!isOwnWall && meUserId) {
        // For other users' walls, load follow status and counts
        reload();
      } else if (isOwnWall) {
        // For own wall, just refresh counts (no follow status needed)
        refreshCounts();
      }
    }
  }, [userId, authToken, meUserId, isOwnWall, reload, refreshCounts]);

  const handleUpdatePost = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className={styles.wallPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.wallPage}>
      <div className={styles.profileSection}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {profile?.imgurl || profile?.profilePic ? (
                <img
                  src={profile.imgurl || profile.profilePic}
                  alt={profile.username}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {profile?.username ? profile.username[0].toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.username}>{profile?.username || `User ${userId}`}</h2>
              {profile?.firstName && profile?.lastName && (
                <p className={styles.fullName}>{profile.firstName} {profile.lastName}</p>
              )}
              {profile?.bio && (
                <p className={styles.bio}>{profile.bio}</p>
              )}
              <div className={styles.stats}>
                <span 
                  className={styles.stat}
                  onClick={() => navigate(`/wall/${userId}/followers`)}
                  style={{ cursor: 'pointer' }}
                  title="View followers"
                >
                  <strong>{counts.followers}</strong> Followers
                </span>
                <span 
                  className={styles.stat}
                  onClick={() => navigate(`/wall/${userId}/following`)}
                  style={{ cursor: 'pointer' }}
                  title="View following"
                >
                  <strong>{counts.following}</strong> Following
                </span>
                <span className={styles.stat}>
                  <strong>{posts.length}</strong> Posts
                </span>
              </div>
            </div>
            {!isOwnWall && isFollowing !== null && (
              isFollowing ? (
                <button 
                  className={`${styles.followButton} ${styles.following} ${followLoading ? styles.processing : ''}`}
                  onClick={async () => {
                    try {
                      await unfollow();
                    } catch (error: any) {
                      alert(error?.message || 'Failed to unfollow user. Please try again.');
                    }
                  }}
                  disabled={followLoading}
                  title="Click to unfollow"
                >
                  {followLoading ? '...' : 'Unfollow'}
                </button>
              ) : (
                <button 
                  className={`${styles.followButton} ${followLoading ? styles.processing : ''}`}
                  onClick={async () => {
                    try {
                      await follow();
                    } catch (error: any) {
                      alert(error?.message || 'Failed to follow user. Please try again.');
                    }
                  }}
                  disabled={followLoading}
                  title="Click to follow"
                >
                  {followLoading ? '...' : 'Follow'}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className={styles.postsSection}>
        {isOwnWall && (
          <div className={styles.createPostWrapper}>
            <CreatePost onPostCreated={handleUpdatePost} />
          </div>
        )}
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateText}>No posts yet</div>
          </div>
        ) : (
          <div className={styles.postsList}>
            {posts.map((post) => (
              <PostComponent
                key={post.id}
                post={post as any}
                onViewUserWall={onViewUserWall}
                onUpdatePost={handleUpdatePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
