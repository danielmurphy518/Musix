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

export const fetchFeaturedTrack = async () => {
  try {
    console.log("this called?")
    const response = await fetch(`${API_URL}/track/featured`);
    if (!response.ok) {
      throw new Error('Track not found');
    }
    const data = await response.json();
    console.log(data)
    return data;
  } catch (err) {
    console.error('Error fetching track by ID:', err);
    return null;
  }
};

export const fetchReviewsByTrackId = async (trackId, page = 1) => {
    try {
      const response = await fetch(`${API_URL}/reviews/track/${trackId}?page=${page}`);
      if (!response.ok) {
        throw new Error('Reviews not found');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching reviews by track ID:', err);
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
  const token = localStorage.getItem('token'); // Get the token from localStorage
  
  if (!token) {
    console.error('No token found, please login again.');
    return null; // Return null if there's no token
  }

  try {
    const response = await fetch(`${API_URL}/user/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send token in the Authorization header
      },
    });
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch user information');
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error('Error fetching user information:', err);
    return null; // Return null in case of error
  }
};

export const submitReview = async (trackId, content, rating, user) => {
  console.log(user)
  const userId = user._id; // Assuming you store userId in localStorage
  const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
  
  console.log(userId)
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

export const fetchAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/network/users-reviewed-same-tracks`); // <-- your route here
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
};
export const fetchImpliedInterests = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/network/user-links/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user links and interests');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching user links and interests:', err);
    return null;
  }
};