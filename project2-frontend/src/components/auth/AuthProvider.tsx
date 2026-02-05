import React, { useState } from 'react'
import { AuthContext, AuthContextValue, Profile } from '../../types/profile';
import axios from 'axios';
import API_URLS from '../../util/url';
import { useNavigate } from 'react-router-dom';

// Set up this provider
// Everything rendered inside of this provider will have access to the context
// So, we have to pass children as parameters so we can pass them along to the AuthContext below
export default function AuthProvider({ children } : {children: React.ReactNode }) {
  // keep track of the logged in user:
  const [user, setUser] = useState<Profile | null>(null);

  const navigate = useNavigate();

  // login function, calls our API:
  const login = async (username: string, password: string) => {    
    try {
      let user = {username: username, password: password};
      let response = await axios.post(`${API_URLS.auth}/auth/login`, user);
      const authResponse = response.data;
      
      // Extract user data from AuthResponse
      // AuthResponse has: userId, token, username, email, message, profile
      // profile has: pid, username, firstName, lastName, bio, verification, imgurl
      const userData: Profile = {
        id: authResponse.profile?.pid || authResponse.userId,
        profileId: authResponse.profile?.pid,
        username: authResponse.username || authResponse.profile?.username,
        email: authResponse.email,
        password: '', // Don't store password
        firstName: authResponse.profile?.firstName,
        lastName: authResponse.profile?.lastName,
        bio: authResponse.profile?.bio,
        imgurl: authResponse.profile?.imgurl,
        verification: authResponse.profile?.verification
      };
      
      // Ensure both id and profileId are set
      if (userData.profileId && !userData.id) {
        userData.id = userData.profileId;
      }
      if (userData.id && !userData.profileId) {
        userData.profileId = userData.id;
      }
      
      // Store token in localStorage
      if (authResponse.token) {
        localStorage.setItem('authToken', authResponse.token);
      }
      
      console.log('Login response processed:', userData);
      setUser(userData);
      navigate('/feed');
    } catch (error:any) {
      console.error('Login error:', error)
      // keep the message vague for security:
      alert("Username or password is incorrect");
    }
  }

    const register = async (email: string, username: string, password: string) => {    
    try {
      console.log("Registering user:", username);
      let user = {email: email, username: username, password: password};
      let response = await axios.post(`${API_URLS.auth}/auth/register`, user);
      const authResponse = response.data;
      
      // Extract user data from AuthResponse (same structure as login)
      const userData: Profile = {
        id: authResponse.profile?.pid || authResponse.userId,
        profileId: authResponse.profile?.pid,
        username: authResponse.username || authResponse.profile?.username,
        email: authResponse.email,
        password: '', // Don't store password
        firstName: authResponse.profile?.firstName,
        lastName: authResponse.profile?.lastName,
        bio: authResponse.profile?.bio,
        imgurl: authResponse.profile?.imgurl,
        verification: authResponse.profile?.verification
      };
      
      // Ensure both id and profileId are set
      if (userData.profileId && !userData.id) {
        userData.id = userData.profileId;
      }
      if (userData.id && !userData.profileId) {
        userData.profileId = userData.id;
      }
      
      // Store token in localStorage
      if (authResponse.token) {
        localStorage.setItem('authToken', authResponse.token);
      }
      
      console.log("Registration successful:", userData);
      setUser(userData);
      navigate('/profile');
    } catch (error:any) {
      console.error(error)
      // keep the message vague for security:
      alert("Username is taken, please choose another");
    }
  }

  // when we logout, set the user to null:
  const logout = () => {
    setUser(null);
    navigate('/login');
  }

  const value: AuthContextValue = {
    user,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value = {value}>
      {children}
    </AuthContext.Provider>
  )
}
