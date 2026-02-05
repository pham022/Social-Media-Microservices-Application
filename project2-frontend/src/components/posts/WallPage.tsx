import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MyWallPage from './MyWallPage';
import styles from './WallPage.module.css';

export default function WallPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const handleViewUserWall = (userId: number) => {
    navigate(`/wall/${userId}`);
  };

  if (!userId || userId === 'undefined') {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <h2>Invalid User ID</h2>
          <p>Unable to load user wall. Please try again or return to the feed.</p>
          <button onClick={() => navigate('/feed')} className={styles.backButton}>
            Go to Feed
          </button>
        </div>
      </div>
    );
  }

  const userIdNum = parseInt(userId, 10);
  if (isNaN(userIdNum)) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <h2>Invalid User ID</h2>
          <p>The user ID format is invalid. Please try again or return to the feed.</p>
          <button onClick={() => navigate('/feed')} className={styles.backButton}>
            Go to Feed
          </button>
        </div>
      </div>
    );
  }

  return <MyWallPage userId={userIdNum} onViewUserWall={handleViewUserWall} />;
}
