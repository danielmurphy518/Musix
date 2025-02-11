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
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and sign-up
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const { login } = useContext(UserContext); // Access the login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset the error before each submission attempt
    setSuccessMessage(''); // Reset the success message

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      let data;
      if (isLogin) {
        // Login logic
        data = await loginUser({ email, password });
      } else {
        // Sign-up logic
        data = await registerUser({ username, email, password, name });
      }
      console.log(data)
      if (data.token) {
        localStorage.setItem('token', data.token); // Save token to localStorage
        login(data.user); // Update context with the logged-in user's info
        closeModal(); // Close the modal
        window.location.reload(); // Reload the page to reflect changes
      } else if (!isLogin && data.success) {
        console.log("going here?????")
        // If registration is successful but no token is returned
        setSuccessMessage('Thanks for signing up. Please check your email for steps to verify your account.');
        setIsLogin(true); // Switch back to the login form
        // Clear form fields
        setEmail('');
        setUsername('');
        setName('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Something went wrong. Please try again.'); // Set error message
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      <h2 style={headingStyles}>{isLogin ? 'Login' : 'Sign Up'}</h2>

      {/* Name Field (only for Sign Up) */}
      {!isLogin && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          style={inputStyles}
        />
      )}

      {/* Username Field (only for Sign Up) */}
      {!isLogin && (
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={inputStyles}
        />
      )}

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

      {/* Confirm Password Field (only for Sign Up) */}
      {!isLogin && (
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          style={inputStyles}
        />
      )}

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

      {/* Conditionally display success message with inline styling */}
      {successMessage && (
        <h3 style={{ 
          color: 'green', 
          fontSize: '14px', 
          textAlign: 'center', 
          marginBottom: '16px' 
        }}>
          {successMessage}
        </h3>
      )}

      <button type="submit" style={buttonStyles}>
        {isLogin ? 'Login' : 'Sign Up'}
      </button>

      {/* Toggle between Login and Sign Up */}
      <p style={toggleTextStyles}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span
          style={toggleLinkStyles}
          onClick={() => {
            setIsLogin(!isLogin); // Toggle between login and sign-up
            setError(''); // Clear any existing errors
            setSuccessMessage(''); // Clear any success messages
          }}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </span>
      </p>
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

const toggleTextStyles = {
  color: '#F0F0F0',
  fontSize: '14px',
  textAlign: 'center',
  marginTop: '10px',
};

const toggleLinkStyles = {
  color: '#007BFF',
  cursor: 'pointer',
  textDecoration: 'underline',
};

export default LoginForm;