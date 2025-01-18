import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Homepage from "./components/Homepage";
import TrackPage from "./components/Trackpage";
import UserPage from "./components/Userpage";
import PasswordPrompt from "./components/PasswordPrompt";
import LoginForm from "./components/LoginForm";
import Modal from "./components/Modal";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import "./App.css";
import { UserProvider } from "./UserContext";


const App = () => {
    // const [user, setUser] = useState(null);
    const [accessGranted, setAccessGranted] = useState(
        localStorage.getItem("accessGranted") === "true"
    );
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         getUserInfo(token);
    //     }
    // }, []);

    // const getUserInfo = async (token) => {
    //     try {
    //         const response = await fetch("http://localhost:5000/user", {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         const data = await response.json();
    //         setUser(data);
    //     } catch (error) {
    //         console.error("Error fetching user data:", error);
    //     }
    // };

    const handleLogin = (token) => {
        localStorage.setItem("token", token);
        setIsLoginModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    if (!accessGranted) {
        return <PasswordPrompt onAccessGranted={() => setAccessGranted(true)} />;
    }

    return (
        <UserProvider>
            <Router>
                <div>
                    {/* Pass user and openLoginModal to ResponsiveAppBar */}
                    <ResponsiveAppBar
                        
                        handleLogout={handleLogout}
                        openLoginModal={openLoginModal}
                    />
                    <div className="content-wrapper">
                        <Routes>
                            <Route path="/" element={<Homepage openLoginModal={openLoginModal} />} />
                            <Route path="/" element={<Homepage openLoginModal={openLoginModal} />} />
                            <Route path="/track/:trackId" element={<TrackPage />} />
                            <Route path="/user/:userId" element={<UserPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                        </Routes>
                    </div>
                    {/* Login Modal */}
                    <Modal isOpen={isLoginModalOpen} closeModal={closeLoginModal}>
                        <LoginForm closeModal={closeLoginModal} />
                    </Modal>
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;
