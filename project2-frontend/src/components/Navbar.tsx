import { Link, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
<<<<<<< HEAD
=======
import { AuthContext } from '../util/types'
>>>>>>> 37f76713933f2d99cc9de867b071f1e76270d34e
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const navigate = useNavigate();
  
  const {logout, user} = useAuth();

  const logoutHandler = () => {
    logout();
    navigate('/');
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
