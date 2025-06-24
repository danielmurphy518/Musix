import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserspage } from '../../api';
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
            <img src="https://i.guim.co.uk/img/media/327aa3f0c3b8e40ab03b4ae80319064e401c6fbc/377_133_3542_2834/master/3542.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=34d32522f47e4a67286f9894fc81c863" alt="Profile" />
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

<p className="user-bio">
  {user.bio ? user.bio : "No bio provided."}
</p>

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