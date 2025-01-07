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
      <h1>{user.name}</h1>
      <h3>@{user.username}</h3>

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
