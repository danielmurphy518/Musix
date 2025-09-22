import React, { useState, useContext } from 'react';
import { ClipLoader } from 'react-spinners'; // Spinner import
import { UserContext } from '../UserContext';
import { loginUser, registerUser } from '../api';

import './forms.css'; // Import the new form styles
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
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-heading">{isLogin ? 'Login' : 'Sign Up'}</h2>

      {!isLogin && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="form-input"
        />
      )}

      {!isLogin && (
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="form-input"
        />
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="form-input"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="form-input"
      />

      {!isLogin && (
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          className="form-input"
        />
      )}

      {error && (
        <h3 className="form-message form-error">
          {error}
        </h3>
      )}

      {successMessage && (
        <h3 className="form-message form-success">
          {successMessage}
        </h3>
      )}

      {/* Submit Button */}
      <button type="submit" className="form-button" disabled={loading}>
        {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
      </button>

      {/* Spinner */}
      {loading && (
        <div style={{ marginTop: '10px' }}>
          <ClipLoader color="var(--accent-color)" size={35} />
        </div>
      )}

      {/* Toggle between Login and Sign Up */}
      <p className="form-toggle-text">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span
          className="form-toggle-link"
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

export default LoginForm;
