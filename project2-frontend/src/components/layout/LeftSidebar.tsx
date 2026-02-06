import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './LeftSidebar.module.css';

export default function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      label: 'My Profile',
      path: '/profile',
      icon: '👤'
    },
    {
      label: 'News Feed',
      path: '/feed',
      icon: '📰'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={styles.leftSidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Menu</h2>
      </div>
      <nav className={styles.menu}>
        {menuItems.map((item) => {
          let isActive = false;
          if (item.path.includes('/profile')) {
            isActive = location.pathname.includes('/profile');
          } else if (item.path === '/feed') {
            isActive = location.pathname === '/feed';
          }
          
          return (
            <button
              key={item.path}
              className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
