import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserspage } from '../api';
import Rating from '@mui/material/Rating'; // Import the Rating component
import './Userpage.css';

const UserPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchUserAndReviews = async () => {
      try {
        const data = await fetchUserspage(userId);

        if (data) {
          setUser(data.user); 
          setReviews(data.reviews); 
        }
      } catch (error) {
        console.error('Error fetching user or reviews:', error);
      }
    };

    fetchUserAndReviews();
  }, [userId]);

  if (!user) {
    return <div>Loading user details...</div>;
  }

  return (
    <div className="user-page">
      {/* Banner Section with Sample Image */}
      <div className="banner" style={{ backgroundImage: `url('https://i.scdn.co/image/ab67616d0000b2734a922c82d905e7ffffd1d045')` }}>
        <div className="profile-section">
          {/* Profile Image Placeholder */}
          <div className="profile-image">
            <img src="https://t3.ftcdn.net/jpg/02/36/99/22/360_F_236992283_sNOxCVQeFLd5pdqaKGh8DRGMZy7P4XKm.jpg" alt="Profile" />
          </div>
          {/* Username and @ Handle */}
          <div className="profile-info">
            <h1>{user.name}</h1>
            <h3>@{user.username}</h3>
          </div>
        </div>

        {/* Total Reviews Box */}
        <div className="total-reviews-box">
          <h3>Total Reviews</h3>
          <p>{reviews.length}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review">
              <p>
                <strong>Track:</strong> {review.track.track_name} by {review.track.artist}
              </p>
              <p>
                <strong>Review:</strong> {review.content}
              </p>
              <div className="review-rating">
                {/* Using Material UI Rating Component */}
                <Rating 
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#FFD700', // Color for filled stars
                    },
                    '& .MuiRating-iconEmpty': {
                      color: '#B0B0B0', // Lighter color for empty stars (edges)
                    },
                    '& .MuiRating-iconHover': {
                      color: '#FFD700', // Hover effect color
                    }
                  }}
                  name="read-only" 
                  value={review.rating} 
                  readOnly 
                  precision={0.5} 
                  size="large"
                />
              </div>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;