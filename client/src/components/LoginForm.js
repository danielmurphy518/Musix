import React, { useState, useContext } from 'react';
import { ClipLoader } from 'react-spinners'; // Spinner import
import { UserContext } from '../UserContext';
import { loginUser, registerUser } from '../api';

const LoginForm = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      let data;
      if (isLogin) {
        data = await loginUser({ email, password });
      } else {
        data = await registerUser({ username, email, password, name });
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        login(data.user);
        closeModal();
        window.location.reload();
      } else if (!isLogin && data.success) {
        setSuccessMessage('Thanks for signing up. Please check your email for steps to verify your account.');
        setIsLogin(true);
        setEmail('');
        setUsername('');
        setName('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      <h2 style={headingStyles}>{isLogin ? 'Login' : 'Sign Up'}</h2>

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

      {/* Submit Button */}
      <button type="submit" style={buttonStyles} disabled={loading}>
        {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
      </button>

      {/* Spinner */}
      {loading && (
        <div style={{ marginTop: '10px' }}>
          <ClipLoader color="#007BFF" size={35} />
        </div>
      )}

      {/* Toggle between Login and Sign Up */}
      <p style={toggleTextStyles}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span
          style={toggleLinkStyles}
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setSuccessMessage('');
          }}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </span>
      </p>
    </form>
  );
};

// Styles
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
