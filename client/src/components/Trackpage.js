import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTrackById, fetchReviewsByTrackId } from '../api';
import './Trackpage.css';

const TrackPage = () => {
  const { trackId } = useParams(); // Get trackId from URL params
  const [track, setTrack] = useState(null);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const fetchTrackAndReviews = async () => {
      try {
        const [trackData, reviewData] = await Promise.all([
          fetchTrackById(trackId),
          fetchReviewsByTrackId(trackId),
        ]);

        if (trackData) setTrack(trackData);
        if (reviewData) setReviews(reviewData);
        console.log(reviewData);
      } catch (error) {
        console.error('Error fetching track or reviews:', error);
      }
    };

    fetchTrackAndReviews();
  }, [trackId]);

  // Function to display stars based on the rating
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating); // Get the integer part (full stars)
    const hasHalfStar = rating % 1 >= 0.5; // Check if there should be a half star
    const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

    // Create an array of stars for rendering
    return Array.from({ length: filledStars + (hasHalfStar ? 1 : 0) + emptyStars }, (_, index) => {
      if (index < filledStars) {
        return <span key={index} className="filled">★</span>; // Full star
      }
      if (index === filledStars && hasHalfStar) {
        return <span key={index} className="half-filled">½</span>; // Half star
      }
      return <span key={index} className="empty">☆</span>; // Empty star
    });
  };

  if (!track) {
    return <div>Loading...</div>;
  }

  return (
    <div className="track-page">
      <h1>{track.track_name}</h1>
      <h3>{track.artist}</h3>
      <p>{track.description}</p>
      {track.image ? (
        <img src={track.image} alt={`${track.artist} - ${track.name}`} className="track-image" />
      ) : (
        <div>No image available</div>
      )}

      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review">
              <p>
                <strong>
                  <a href={`/user/${review.user._id}`} className="user-link">
                    {review.user.name}
                  </a>
                </strong>
                : {review.content}
              </p>
              <div className="review-rating">
                {renderStars(review.rating)} {/* Render stars based on the rating */}
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

export default TrackPage;
