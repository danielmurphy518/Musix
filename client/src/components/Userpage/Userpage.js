import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserspage, fetchImpliedInterests } from '../../api';
import Rating from '@mui/material/Rating';
import './Userpage.css';

const UserPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [impliedInterests, setImpliedInterests] = useState([]);
  const [impliedDisinterest, setImpliedDisinterest] = useState([]);

  useEffect(() => {
    const fetchUserAndReviews = async () => {
      try {
        const data = await fetchUserspage(userId);
        if (data) {
          setUser(data.user);
          setReviews(data.reviews);

          // If no explicit interests, try to fetch implied ones
          if (!data.user.interests || data.user.interests.length === 0) {
            const implied = await fetchImpliedInterests(userId);
            if (implied) {
              setImpliedInterests(implied.top_positive_interests);
              setImpliedDisinterest(implied.top_negative_interests);
            }
          }
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
      {/* Header Banner */}
      <div
        className="banner"
        style={{
          backgroundImage: `url('https://i.scdn.co/image/ab67616d0000b2734a922c82d905e7ffffd1d045')`,
        }}
      >
        <div className="profile-section">
          <div className="profile-image">
            <img
              src="https://i.guim.co.uk/img/media/327aa3f0c3b8e40ab03b4ae80319064e401c6fbc/377_133_3542_2834/master/3542.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=34d32522f47e4a67286f9894fc81c863"
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <h3>@{user.username}</h3>
          </div>
        </div>

        <div className="total-reviews-box">
          <h3>Total Reviews</h3>
          <p>{reviews.length}</p>
        </div>
      </div>

      {/* Bio & Interests Section */}
      <div className="user-bio-box">
        {/* Interests */}
        {user.interests && user.interests.length > 0 ? (
          <div className="user-interests-box">
            <h3>Interests</h3>
            <ul>
              {user.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>
          </div>
        ) : impliedInterests.length > 0 ? (
          <div className="user-interests-box">
            <h3>Implied Interests</h3>
            <ul>
              {impliedInterests.map((interest, index) => (
                <li key={index} className="inferred-interest">
                  {interest.interest}
                </li>
              ))}
            </ul>

            <h3>Implied Disinterests</h3>
                        <ul>
              {impliedDisinterest.map((interest, index) => (
                <li key={index} className="inferred-interest">
                  {interest.interest}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Bio */}
        <h3>Bio</h3>
        <p>{user.bio ? user.bio : 'No bio provided.'}</p>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review">
              <p>
                <strong>Track:</strong> {review.track.track_name} by{' '}
                {review.track.artist}
              </p>
              <p>
                <strong>Review:</strong> {review.content}
              </p>
              <div className="review-rating">
                <Rating
                  sx={{
                    '& .MuiRating-iconFilled': { color: '#FFD700' },
                    '& .MuiRating-iconEmpty': { color: '#B0B0B0' },
                    '& .MuiRating-iconHover': { color: '#FFD700' },
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
