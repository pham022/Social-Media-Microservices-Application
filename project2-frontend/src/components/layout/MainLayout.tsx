import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();

  // Only show layout for authenticated users on main pages
  const showLayout = user && (
    location.pathname === '/feed' ||
    location.pathname.startsWith('/wall/') ||
    location.pathname === '/profile'
  );

  if (!showLayout) {
    return <>{children}</>;
  }

  return (
    <div className={styles.mainLayout}>
      <LeftSidebar />
      <div className={styles.mainContent}>
        {children}
      </div>
      <RightSidebar />
    </div>
  );
}
