import React, { useState } from "react";

const PasswordPrompt = ({ onAccessGranted }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const correctPassword = process.env.REACT_APP_ADMIN_PASSWORD;
        if (password === correctPassword) {
            localStorage.setItem("accessGranted", "true"); // Persist access state
            onAccessGranted();
        } else {
            setError("Incorrect password, please try again.");
        }
    };

    return (
        <div className="password-prompt">
            PLEASE ENTER THE PASSWORD TO AUTHENTICATE WITH SERVER
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default PasswordPrompt;
