// src/components/LoginForm.js
import React, { useState } from 'react';

const LoginForm = ({ setUser, closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Check if the response is okay (status 200)
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json(); // Parse the JSON response
      console.log('Parsed Data:', data);
  
      // Assuming server sends { message, token }
      if (data.token) {
        console.log(data.token)
        localStorage.setItem('token', data.token); // Store token in localStorage
        setUser(data.user);  // Ensure user data is included in response
        closeModal(); // Close modal after successful login
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
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
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
