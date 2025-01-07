const API_URL = 'http://localhost:4000'; // Make sure this matches your backend URL

// Register user
export const registerUser = async (userData) => {
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
      const response = await fetch(`${API_URL}/tracks/recent`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching recent tracks:', err);
      return [];
    }
};

export const fetchTrackById = async (trackId) => {
    try {
      const response = await fetch(`${API_URL}/track/${trackId}`);
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

export const fetchReviewsByTrackId = async (trackId) => {
    try {
      const response = await fetch(`${API_URL}/reviews/track/${trackId}`);
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
      const response = await fetch(`${API_URL}/user/${userId}`);
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
      const response = await fetch(`${API_URL}/user/`);

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
  if (!userId || !token) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch(`${API_URL}/reviews`, {
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
