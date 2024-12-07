import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Router components
import Login from './components/Login';
import Homepage from './components/Homepage';
import TrackPage from './components/Trackpage'; // Import the TrackPage component
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserInfo(token);
    }
  }, []);

  const getUserInfo = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    getUserInfo(token);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser(null); // Reset the user state
  };

  return (
    <Router>
      <div>
        <header className="app-header">
          <h1 className="app-title">Daniel's App</h1>
          <div className="header-buttons">
            {user ? (
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="login-button" onClick={() => console.log("Redirect to login")}>
                Login/Sign Up
              </button>
            )}

          </div>
        </header>
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/tracks" element={<Homepage />} /> {/* Home page or a tracks list page */}
            <Route path="/track/:trackId" element={<TrackPage />} /> {/* Specific track page */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
