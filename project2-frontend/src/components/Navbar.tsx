import { Link, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const navigate = useNavigate();
  
  const {logout, user} = useAuth();

  const logoutHandler = () => {
    logout();
    navigate('/login');
  }

  return (
    <nav className = {styles.navBar}>
      {user ? (
        <>
          <Link className = {styles.navItem} to = "/feed">Feed</Link>
          <Link className = {styles.navItem} to = {user?.id ? `/profile/${user.id}/view` : user?.profileId ? `/profile/${user.profileId}/view` : "/profile"}>Profile</Link>
          <button onClick = {logoutHandler} className = {styles.navItem}>Logout</button>
          <div className={styles.rightSection}>
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
