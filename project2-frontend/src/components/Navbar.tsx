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
      {user ? <button onClick = {logoutHandler} className = {styles.navItem}>Logout</button>: 
      <Link className = {styles.navItem} to = "/login">Login</Link>}
      <Link className = {styles.navItem} to = "/register">Register</Link>
      {user ? <span>Welcome, {user.username}!</span> : <span>Welcome, Guest!</span>}
    </nav>
  )
}
