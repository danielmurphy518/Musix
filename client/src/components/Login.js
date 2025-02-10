import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext'; // Import the context
import { loginUser, registerUser } from '../api'; // Import the loginUser and registerUser functions from api.js

const LoginForm = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // State for handling errors
  const { login } = useContext(UserContext); // Access the login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset the error before each submission attempt

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Call the registerUser function from api.js
      const data = await registerUser({ username, email, password, name });
      
      if (data.token) {
        localStorage.setItem('token', data.token); // Save token to localStorage
        login(data.user); // Update context with the logged-in user's info
        closeModal(); // Close the modal
        window.location.reload(); // Reload the page to reflect changes
      } else {
        setError(data.message || 'Registration failed. Please try again.'); // Set error message
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      <h2 style={headingStyles}>Register</h2>

      {/* Name Field */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
        style={inputStyles}
      />

      {/* Username Field */}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        style={inputStyles}
      />

      {/* Email Field */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        style={inputStyles}
      />

      {/* Password Field */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        style={inputStyles}
      />

      {/* Confirm Password Field */}
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        required
        style={inputStyles}
      />

      {/* Conditionally display error message with inline styling */}
      {error && (
        <h3 style={{ 
          color: 'red', 
          fontSize: '14px', 
          textAlign: 'center', 
          marginBottom: '16px' 
        }}>
          {error}
        </h3>
      )}

      <button type="submit" style={buttonStyles}>Register</button>
    </form>
  );
};

// Styles (unchanged)
const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  padding: '20px',
};

const headingStyles = {
  color: '#F0F0F0',
  marginBottom: '16px',
  textAlign: 'center',
};

const inputStyles = {
  width: '100%',
  maxWidth: '300px',
  padding: '10px',
  marginBottom: '16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyles = {
  padding: '10px 20px',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default LoginForm;