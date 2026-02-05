import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Navbar from './components/Navbar';
import AuthProvider from './components/auth/AuthProvider';
import Register from './components/auth/Register';
import UserProfile from './components/profile/UserProfile';
 
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
          <Routes>
            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />
            <Route path="/profile" Component={UserProfile} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
 
export default App;
 
 
