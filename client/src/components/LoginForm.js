import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext'; // Import the context
import { loginUser } from '../api'; // Import the loginUser function from api.js

const LoginForm = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(UserContext); // Access the login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password }); // Use the loginUser function from api.js

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        login(data.user); // Update context with the logged-in user's info
        closeModal();
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      <h2 style={headingStyles}>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        style={inputStyles}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        style={inputStyles}
      />
      <button type="submit" style={buttonStyles}>Login</button>
    </form>
  );
};

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  padding: '20px',
};

const headingStyles = {
  color: '#333',
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
