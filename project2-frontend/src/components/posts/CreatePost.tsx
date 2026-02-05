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
    if (user?.profileId) {
      loadProfile();
    }
  }, [user?.profileId]);

  const loadProfile = async () => {
    if (!user?.profileId) return;
    try {
      const profile = await profileApi.getProfile(user.profileId);
      setAvatar(profile.imgurl || profile.profilePic || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.profileId || !content.trim()) return;

    setLoading(true);
    try {
      await postApi.createPost(content, imageUrl || null, user.profileId);
      setContent('');
      setImageUrl('');
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
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
