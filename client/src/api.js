// src/api.js
const API_URL = 'http://localhost:5000'; // Make sure this matches your backend URL

// Register user
export const registerUser = async (userData) => {
  console.log(userData)
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  return data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  return data;
};

export const fetchRecentTracks = async () => {
    try {
      const response = await fetch('http://localhost:5000/tracks/recent');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching recent tracks:', err);
      return [];
    }
  };


export const fetchTrackById = async (trackId) => {
    try {
      const response = await fetch(`http://localhost:5000/track/${trackId}`);
      console.log(response)
      if (!response.ok) {
        throw new Error('Track not found');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching track by ID:', err);
      return null;
    }
  };

  export const fetchReviewsByTrackId= async (trackId) => {
    try {
      const response = await fetch(`http://localhost:5000/reviews/track/${trackId}`);
      console.log(response)
      if (!response.ok) {
        throw new Error('Track not found');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching track by ID:', err);
      return null;
    }
  };

  export const fetchUserspage = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}`);
      console.log(response)
      if (!response.ok) {
        throw new Error('Track not found');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching track by ID:', err);
      return null;
    }
  };

  export const fetchUserInformation = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user/`);
      console.log(response)

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching track by ID:', err);
      return null;
    }
  };
  

  export const submitReview = async (trackId, content, rating, user) => {
    const userId = user.id; // Assuming you store userId in localStorage
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    console.log(user)
    if (!userId || !token) {
      throw new Error('User is not authenticated');
    }
  
    const response = await fetch('http://localhost:5000/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, trackId, content, rating }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit review');
    }
  
    return response.json(); // Return the saved review data
  };
  