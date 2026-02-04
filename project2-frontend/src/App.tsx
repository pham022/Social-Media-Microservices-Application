import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
<<<<<<< HEAD
import Login from './components/auth/Login';
import Navbar from './components/Navbar';
import AuthProvider from './components/auth/AuthProvider';
import Register from './components/auth/Register';
import UserProfile from './components/profile/UserProfile';
=======
import Login from './components/Login';
import Navbar from './components/Navbar';
import AuthProvider from './components/AuthProvider';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
>>>>>>> 37f76713933f2d99cc9de867b071f1e76270d34e
 
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
 
 
