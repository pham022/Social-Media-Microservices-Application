import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { postApi, profileApi } from '../../util/postApi';
import styles from './CreatePost.module.css';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string>('');

  useEffect(() => {
    const userId = user?.id || user?.profileId;
    if (userId) {
      loadProfile();
    }
  }, [user?.id, user?.profileId]);

  const loadProfile = async () => {
    const userId = user?.id || user?.profileId;
    if (!userId) return;
    try {
      const profile = await profileApi.getProfile(userId);
      setAvatar(profile.imgurl || profile.profilePic || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('CreatePost - Current user object:', user);
    
    if (!user) {
      alert('Please log in to create a post.');
      return;
    }

    const userId = user.id || user.profileId;
    console.log('CreatePost - Extracted userId:', userId, 'from user.id:', user.id, 'user.profileId:', user.profileId);
    
    if (!userId) {
      console.error('User ID not found. Full user object:', JSON.stringify(user, null, 2));
      alert('User ID not found. Please log in again.');
      return;
    }

    if (!content.trim()) {
      alert('Please enter some content for your post.');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating post with:', { content, imageUrl, userId });
      await postApi.createPost(content, imageUrl || null, userId);
      setContent('');
      setImageUrl('');
      onPostCreated();
    } catch (error: any) {
      console.error('Error creating post:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create post. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (username: string) => {
    return username ? username[0].toUpperCase() : 'U';
  };

  return (
    <div className={styles.createPost}>
      <div className={styles.createPostHeader}>
        <h3 className={styles.whatsHappening}>What's happening?</h3>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formContent}>
          <div className={styles.userAvatar}>
            {avatar ? (
              <img src={avatar} alt={user?.username} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {getInitials(user?.username || 'U')}
              </div>
            )}
          </div>
          <div className={styles.inputSection}>
            <textarea
              className={styles.textarea}
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              maxLength={2000}
            />
            <input
              type="url"
              className={styles.imageInput}
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.actionButtons}>
            <button type="button" className={styles.actionBtn} title="Live video">
              📹 Live video
            </button>
            <button type="button" className={styles.actionBtn} title="Photos">
              📷 Photos
            </button>
            <button type="button" className={styles.actionBtn} title="Feeling">
              😊 Feeling
            </button>
          </div>
          <div className={styles.submitSection}>
            <div className={styles.charCount}>
              {content.length}/2000
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!content.trim() || loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
