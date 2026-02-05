import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { followApi, profileApi } from '../../util/postApi';
import { Profile } from '../../types/profile';
import styles from './RightSidebar.module.css';

export default function RightSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadCurrentUserProfile();
      loadFollowing();
    }
  }, [user?.id]);

  const loadCurrentUserProfile = async () => {
    if (!user?.id) return;
    try {
      const profile = await profileApi.getProfile(user.id);
      setCurrentUserProfile(profile);
    } catch (error) {
      console.error('Error loading current user profile:', error);
    }
  };

  const loadFollowing = async () => {
    if (!user?.id) return;

    try {
      const token = localStorage.getItem('authToken') || '';
      const followingIds = await followApi.getFollowing(token);
      
      // Fetch profile details for each following user
      const profiles = await Promise.all(
        followingIds.map(async (id: number) => {
          try {
            return await profileApi.getProfile(id);
          } catch (error) {
            return null;
          }
        })
      );

      setFollowing(profiles.filter((p): p is Profile => p !== null));
    } catch (error) {
      console.error('Error loading following:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId: number) => {
    navigate(`/wall/${userId}`);
  };

  const getInitials = (username: string) => {
    return username ? username[0].toUpperCase() : 'U';
  };

  return (
    <div className={styles.rightSidebar}>
      {currentUserProfile && (
        <div className={styles.currentUserSection}>
          <div className={styles.currentUserCard}>
            <div className={styles.currentUserAvatar}>
              {currentUserProfile.imgurl ? (
                <img
                  src={currentUserProfile.imgurl}
                  alt={currentUserProfile.username}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {getInitials(currentUserProfile.username)}
                </div>
              )}
            </div>
            <div className={styles.currentUserInfo}>
              <div className={styles.currentUserName}>{currentUserProfile.username}</div>
              {currentUserProfile.firstName && currentUserProfile.lastName && (
                <div className={styles.currentUserLocation}>
                  {currentUserProfile.firstName} {currentUserProfile.lastName}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>My Contacts</h2>
      </div>
      <div className={styles.followingList}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : following.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You're not following anyone yet.</p>
            <p>Start following users to see them here!</p>
          </div>
        ) : (
          following.map((profile) => (
            <div
              key={profile.id}
              className={styles.followingItem}
              onClick={() => profile.id && handleUserClick(profile.id)}
            >
              <div className={styles.followingAvatar}>
                {profile.imgurl ? (
                  <img
                    src={profile.imgurl}
                    alt={profile.username}
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {getInitials(profile.username)}
                  </div>
                )}
              </div>
              <div className={styles.followingInfo}>
                <div className={styles.followingUsername}>{profile.username}</div>
                {profile.firstName && profile.lastName && (
                  <div className={styles.followingName}>
                    {profile.firstName} {profile.lastName}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
