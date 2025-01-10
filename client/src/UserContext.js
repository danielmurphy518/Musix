import React, { createContext, useState, useEffect } from 'react';
import { fetchUserInformation } from './api'; // Ensure you have a function to fetch user info

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store user info here
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state to handle potential errors

  // Function to fetch user information from API using the token
  const fetchUserData = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
      setLoading(false);
      return; // If no token, skip fetching user info
    }

    try {
      const data = await fetchUserInformation();
      if (data) {
        console.log(data)
        setUser(data);  // Set the user data into state
      } else {
        setUser(null);  // If no user data, set user to null
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      setError('Error fetching user info'); // Set error state in case of failure
      setUser(null);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on page load
  }, []);  // Empty dependency array ensures it runs only once on mount

  // Login function: Called after successful login to store user data
  const login = (userInfo) => {
    //localStorage.setItem('token', userInfo.token);  // Store the token in localStorage
    setUser(userInfo);  // Set the user data in context
  };

  // Logout function: Called when logging out to clear user data
  const logout = () => {
    localStorage.removeItem('token');  // Remove token from localStorage
    setUser(null);  // Set user to null
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
