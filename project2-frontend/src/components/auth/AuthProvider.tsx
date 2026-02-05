import React, { useEffect, useState } from 'react'
import { AuthContext, AuthContextValue, Profile } from '../../types/profile';
import axios from 'axios';
import API_URLS from '../../util/url';
import { useNavigate } from 'react-router-dom';

// Set up this provider
// Everything rendered inside of this provider will have access to the context
// So, we have to pass children as parameters so we can pass them along to the AuthContext below
export default function AuthProvider({ children } : {children: React.ReactNode }) {
  // keep track of the logged in user:
  const [user, setUser] = useState<Profile | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sync user state with localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const navigate = useNavigate();

  // login function, calls our API:
  const login = async (username: string, password: string) => {    
    try {
      let user = {username: username, password: password};
      let response = await axios.post(`${API_URLS.auth}/auth/login`, user);
      setUser(response.data);
      navigate('/profile');
    } catch (error:any) {
      console.error(error)
      // keep the message vague for security:
      alert("Username or password is incorrect");
    }
  }

    const register = async (email: string, username: string, password: string) => {    
    try {
      console.log("Registering user:", username);
      let user = {email: email, username: username, password: password};
      let response = await axios.post(`${API_URLS.auth}/auth/register`, user);
      console.log("Registration successful:", response.data);
      setUser(response.data);
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
