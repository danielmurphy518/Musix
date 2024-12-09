import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserspage } from '../api';
import './Userpage.css'; // Adjusted filename for consistency

const UserPage = () => {
  const { userId } = useParams(); // Get userId from URL params
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchUserAndReviews = async () => {
      try {
        const data = await fetchUserspage(userId);

        if (data) {
          setUser(data.user); // Set user details
          setReviews(data.reviews); // Set user reviews
        }
      } catch (error) {
        console.error('Error fetching user or reviews:', error);
      }
    };

    fetchUserAndReviews();
  }, [userId]);

  // Function to display stars based on the rating
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating); // Full stars
    const hasHalfStar = rating % 1 >= 0.5; // Half star
    const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0); // Empty stars

    return Array.from({ length: totalStars }, (_, index) => {
      if (index < filledStars) return <span key={index} className="filled">★</span>;
      if (index === filledStars && hasHalfStar) return <span key={index} className="half-filled">½</span>;
      return <span key={index} className="empty">☆</span>;
    });
  };

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
                {renderStars(review.rating)}
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
