import { Link, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import { useAuth } from '../hooks/useAuth'
import Notifications from './notifications/Notifications'

export default function Navbar() {
  const navigate = useNavigate();
  
  const {logout, user} = useAuth();

  const logoutHandler = () => {
    logout();
    navigate('/login');
  }

  const handleMyWallClick = (e: React.MouseEvent) => {
    if (!user?.id) {
      e.preventDefault();
      navigate('/profile');
    }
  };

  return (
    <nav className = {styles.navBar}>
      {user ? (
        <>
          <Link className = {styles.navItem} to = "/feed">Feed</Link>
          {user.id ? (
            <Link className = {styles.navItem} to = {`/wall/${user.id}`}>My Wall</Link>
          ) : (
            <Link className = {styles.navItem} to = "/profile" onClick={handleMyWallClick}>My Wall</Link>
          )}
          <Link className = {styles.navItem} to = "/profile">Profile</Link>
          <button onClick = {logoutHandler} className = {styles.navItem}>Logout</button>
          <div className={styles.rightSection}>
            <Notifications />
            <span className={styles.welcomeText}>Welcome, {user.username || 'User'}!</span>
          </div>
        </>
      ) : (
        <>
          <Link className = {styles.navItem} to = "/login">Login</Link>
          <Link className = {styles.navItem} to = "/register">Register</Link>
          <span className={styles.welcomeText}>Welcome, Guest!</span>
        </>
      )}
    </nav>
  )
}
