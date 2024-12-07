// src/axiosInstance.js
import axios from 'axios';

// Set up the axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',  // Your API base URL
});

export default axiosInstance;
