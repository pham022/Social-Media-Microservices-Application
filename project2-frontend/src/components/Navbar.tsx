import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../hooks/useAuth";
import SearchBar from "../components/follow/SearchUsers";
import { Profile } from "../types/profile";


export default function Navbar() {
 const navigate = useNavigate();
 const { logout, user } = useAuth();


 const logoutHandler = () => {
   logout();
   navigate("/login");
 };


 const handleUserSelect = (profile: Profile) => {
   navigate(`/profile/${profile.id}`);
 };


 return (
   <nav className={styles.navBar}>
     {/* LEFT: navigation */}
     <div className={styles.left}>
       {user ? (
         <>
           <Link className={styles.navItem} to="/feed">
             Feed
           </Link>


           {user.id && (
             <Link className={styles.navItem} to={`/wall/${user.id}`}>
               My Wall
             </Link>
           )}


           <Link className={styles.navItem} to="/profile">
             Profile
           </Link>
         </>
       ) : (
         <>
           <Link className={styles.navItem} to="/login">
             Login
           </Link>
           <Link className={styles.navItem} to="/register">
             Register
           </Link>
         </>
       )}
     </div>


    
     {user && (
       <div className={styles.search}>
         <SearchBar onSelectUser={handleUserSelect} />
       </div>
     )}


    
     <div className={styles.right}>
       {user ? (
         <>
           <span className={styles.welcomeText}>
             Welcome, {user.username || "User"}!
           </span>
           <button onClick={logoutHandler} className={styles.navItem}>
             Logout
           </button>
         </>
       ) : (
         <span className={styles.welcomeText}>Welcome, Guest!</span>
       )}
     </div>
   </nav>
 );
}
