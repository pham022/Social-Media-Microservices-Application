import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewsFeed from './NewsFeed';

export default function NewsFeedPage() {
  const navigate = useNavigate();

  const handleViewUserWall = (userId: number) => {
    navigate(`/wall/${userId}`);
  };

  return <NewsFeed onViewUserWall={handleViewUserWall} />;
}
