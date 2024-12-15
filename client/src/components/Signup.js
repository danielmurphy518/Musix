// src/components/Login.js
import {registerUser} from '../api';
import React, { useState } from 'react';

const Signup = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email, password, username, name)
        let userData = {
            email : email,
            password : password,
            username : username,
            name: name,
        }

        const data = await registerUser(userData);

        if (data) {
            // Store token in localStorage
            //localStorage.setItem('token', data.token);
            console.log(data)
            //setUser(data); // Set user data (if you have it)
        } else {
            console.error('Sign Up Failed!', data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />

            <input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name"
                required
            />

            <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a username"
                required
            />
            <button type="submit">Sign Up!</button>
        </form>
    );
};

export default Signup; // Default export
