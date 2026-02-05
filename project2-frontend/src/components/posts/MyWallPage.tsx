import React, { useState, useEffect } from 'react';
import { Post } from '../../types/post';
import { postApi, followApi, profileApi } from '../../util/postApi';
import { useAuth } from '../../hooks/useAuth';
import PostComponent from './Post';
import CreatePost from './CreatePost';
import styles from './MyWallPage.module.css';

interface MyWallPageProps {
  userId: number;
  onViewUserWall: (userId: number) => void;
}

export default function MyWallPage({ userId, onViewUserWall }: MyWallPageProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const isOwnWall = user?.id === userId;

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsData, counts, profileData] = await Promise.all([
        postApi.getUserPosts(userId),
        followApi.getCounts(userId),
        profileApi.getProfile(userId).catch(() => null)
      ]);

      setPosts(postsData);
      setFollowerCount(counts.followers);
      setFollowingCount(counts.following);
      setProfile(profileData);

      if (!isOwnWall && user?.id) {
        const token = localStorage.getItem('authToken') || '';
        const following = await followApi.isFollowing(userId, token);
        setIsFollowing(following);
      }
    } catch (error) {
      console.error('Error loading wall page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user?.id) return;
    
    try {
      const token = localStorage.getItem('authToken') || '';
      if (isFollowing) {
        await followApi.unfollow(userId, token);
      } else {
        await followApi.follow(userId, token);
      }
      setIsFollowing(!isFollowing);
      const counts = await followApi.getCounts(userId);
      setFollowerCount(counts.followers);
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

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
      <div className={styles.header}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>
            {profile?.imgurl || profile?.profilePic ? (
              <img
                src={profile.imgurl || profile.profilePic}
                alt={profile.username}
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {profile?.username ? profile.username[0].toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.username}>{profile?.username || `User ${userId}`}</h2>
            <div className={styles.stats}>
              <span className={styles.stat}>
                <strong>{followerCount}</strong> Followers
              </span>
              <span className={styles.stat}>
                <strong>{followingCount}</strong> Following
              </span>
              <span className={styles.stat}>
                <strong>{posts.length}</strong> Posts
              </span>
            </div>
          </div>
        </div>
        {!isOwnWall && (
          <button className={styles.followButton} onClick={handleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <div className={styles.postsSection}>
        <h3 className={styles.postsTitle}>Posts</h3>
        {isOwnWall && <CreatePost onPostCreated={handleUpdatePost} />}
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
