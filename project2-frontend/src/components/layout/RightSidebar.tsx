import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { profileApi } from '../../util/postApi';
import { Profile } from '../../types/profile';
import styles from './RightSidebar.module.css';
import SearchBar from '../search/SearchBar';

export default function RightSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user?.id || user?.profileId) {
      loadCurrentUserProfile();
    }
  }, [user?.id, user?.profileId]);

  const loadCurrentUserProfile = async () => {
    const userId = user?.id || user?.profileId;
    if (!userId) return;
    try {
      const profile = await profileApi.getProfile(userId);
      setCurrentUserProfile(profile);
    } catch (error) {
      console.error('Error loading current user profile:', error);
    }
  };

  const handleSelectUser = (selectedUser: Profile) => {
    const userId = selectedUser.id || selectedUser.profileId;
    if (userId) {
      navigate(`/wall/${userId}`);
    }
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
        <h2 className={styles.sidebarTitle}>Search ppl you wanna follow</h2>
      </div>
      <div className={styles.searchSection}>
        <SearchBar onSelectUser={handleSelectUser} />
      </div>
    </div>
  );
}
