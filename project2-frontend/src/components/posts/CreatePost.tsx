import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { postApi } from '../../util/postApi';
import styles from './CreatePost.module.css';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !content.trim()) return;

    setLoading(true);
    try {
      await postApi.createPost(content, imageUrl || null, user.id);
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

  return (
    <div className={styles.createPost}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          className={styles.textarea}
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          maxLength={2000}
        />
        <input
          type="url"
          className={styles.imageInput}
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <div className={styles.actions}>
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
      </form>
    </div>
  );
}
