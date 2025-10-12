import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Homepage from "./components/Homepage/Homepage";
import TrackPage from "./components/Trackpage/Trackpage";
import UserPage from "./components/Userpage/Userpage";
import PasswordPrompt from "./components/PasswordPrompt";
import LoginForm from "./components/LoginForm";
import VerifyPage from "./components/Verifypage/Verifypage";
import Modal from "./components/Modal/Modal";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import UserNetworkPage from "./components/Network/Networkgraph";
import "./App.css";
import { UserProvider } from "./UserContext";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const AppContent = () => {
    const [accessGranted, setAccessGranted] = useState(
        localStorage.getItem("accessGranted") === "true"
    );
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [serverOnline, setServerOnline] = useState(true);
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
    // Check backend connection
    useEffect(() => {
        const checkBackend = async () => {
            try {
                const res = await fetch(API_URL+'/ping');
                if (!res.ok) throw new Error("Bad response");
                setServerOnline(true);
            } catch (err) {
                console.error("Backend not reachable:", err.message);
                setServerOnline(false);
            }
        };
        checkBackend();
    }, []);
    if (!accessGranted) {
        return <PasswordPrompt onAccessGranted={() => setAccessGranted(true)} />;
    }
    return (
        <div>
            {!serverOnline && (
                <div style={{ backgroundColor: "red", color: "white", padding: "1rem", textAlign: "center" }}>
                    🚫 Can't connect to server. Some features may not work.
                </div>
            )}
            <ResponsiveAppBar
                handleLogout={handleLogout}
                openLoginModal={openLoginModal}
            />
            <div className="content-wrapper">
                <Routes>
                    <Route path="/" element={<Homepage openLoginModal={openLoginModal} />} />
                    <Route path="/track/:trackId" element={<TrackPage />} />
                    <Route path="/user/:userId" element={<UserPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/verify/:token" element={<VerifyPage />} />
                    <Route path="/network" element={<UserNetworkPage />} />
                </Routes>
            </div>
            <Modal isOpen={isLoginModalOpen} closeModal={closeLoginModal}>
                <LoginForm closeModal={closeLoginModal} />
            </Modal>
        </div>
    );
};
const App = () => (
    <UserProvider>
        <Router>
            <AppContent />
        </Router>
    </UserProvider>
);
export default App;