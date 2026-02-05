import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Navbar from './components/Navbar';
import AuthProvider from './components/auth/AuthProvider';
import Register from './components/auth/Register';
import UserProfile from './components/profile/UserProfile';
import NewsFeedPage from './components/posts/NewsFeedPage';
import WallPage from './components/posts/WallPage';
import MainLayout from './components/layout/MainLayout';
import { useAuth } from './hooks/useAuth';
 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <header className="appHeader">
            <h1 className="appTitle">Twatter</h1>
            <p className="appSubtitle">
              Join the conversation. Share your thoughts. Connect with friends. Dont be a Twat.
            </p>
          </header>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/feed" element={<NewsFeedPage />} />
              <Route path="/wall/:userId" element={<WallPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

// Redirect home to feed
function HomeRedirect() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/feed" replace />;
  }
  return <Navigate to="/login" replace />;
}
 
export default App;
 
 
