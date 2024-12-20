import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Homepage from "./components/Homepage";
import TrackPage from "./components/Trackpage";
import UserPage from "./components/Userpage";
import PasswordPrompt from "./components/PasswordPrompt";
import AuthProvider from "./hooks/AuthProvider";
import "./App.css";

const App = () => {
    const [user, setUser] = useState(null);
    const [accessGranted, setAccessGranted] = useState(
        localStorage.getItem("accessGranted") === "true"
    );


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getUserInfo(token);
        }
    }, []);

    const getUserInfo = async (token) => {
        try {
            const response = await fetch("http://localhost:5000/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            //console.log(response)
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleLogin = (token) => {
        localStorage.setItem("token", token);
        getUserInfo(token);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    if (!accessGranted) {
        return <PasswordPrompt onAccessGranted={() => setAccessGranted(true)} />;
    }

    return (
        <AuthProvider>
        <Router>
            <div>
                <header className="app-header">
                    <h1 className="app-title">TODO: think of a good name for this</h1>
                    <div className="header-buttons">
                        {user ? (
                            <button className="logout-button" onClick={handleLogout}>
                                Logout
                            </button>
                        ) : (
                            <button
                                className="login-button"
                                onClick={() => console.log("Redirect to login")}
                            >
                                Login/Sign Up
                            </button>
                        )}
                    </div>
                </header>
                <div className="content-wrapper">
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/tracks" element={<Homepage />} />
                        <Route path="/track/:trackId" element={<TrackPage />} />
                        <Route path="/user/:userId" element={<UserPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </div>
            </div>
        </Router>
        </AuthProvider>
    );
};

export default App;
