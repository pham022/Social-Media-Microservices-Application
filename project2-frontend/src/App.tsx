import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Navbar from './components/Navbar';
import AuthProvider from './components/auth/AuthProvider';
import Register from './components/auth/Register';
import UserProfile from './components/profile/UserProfile';
import ProfileViewPage from './components/profile/ProfileViewPage';
import ProfilePostsPage from './components/profile/ProfilePostsPage';
import NewsFeedPage from './components/posts/NewsFeedPage';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SinglePostPage from './components/posts/SinglePostPage';
import FollowersFollowingPage from './components/profile/FollowersFollowingPage';
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
              Join the conversation. Share your thoughts. Connect with friends. Dont be a <span className="twatHighlight">Twat</span>.
            </p>
          </header>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/feed" element={<ProtectedRoute><NewsFeedPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/profile/:userId/view" element={<ProtectedRoute><ProfileViewPage /></ProtectedRoute>} />
              <Route path="/profile/:userId/posts" element={<ProtectedRoute><ProfilePostsPage /></ProtectedRoute>} />
              <Route path="/profile/:userId/followers" element={<ProtectedRoute><FollowersFollowingPage type="followers" /></ProtectedRoute>} />
              <Route path="/profile/:userId/following" element={<ProtectedRoute><FollowersFollowingPage type="following" /></ProtectedRoute>} />
              <Route path="/post/:postId" element={<ProtectedRoute><SinglePostPage /></ProtectedRoute>} />
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
 

