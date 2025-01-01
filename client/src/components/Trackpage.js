import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTrackById, fetchReviewsByTrackId, submitReview } from '../api';
import Modal from './Modal';
import Rating from '@mui/material/Rating'; // Import Material-UI Rating
import './Trackpage.css';

const TrackPage = () => {
  const { trackId } = useParams();
  const [track, setTrack] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTrackAndReviews = async () => {
      try {
        const [trackData, reviewData] = await Promise.all([
          fetchTrackById(trackId),
          fetchReviewsByTrackId(trackId),
        ]);
        if (trackData) setTrack(trackData);
        if (reviewData) setReviews(reviewData);
      } catch (error) {
        console.error('Error fetching track or reviews:', error);
      }
    };

    fetchTrackAndReviews();
  }, [trackId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewContent || rating === 0) {
      alert('Please write a review and select a rating!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitReview(trackId, reviewContent, rating);
      if (response) {
        setReviews((prevReviews) => [
          ...prevReviews,
          { content: reviewContent, rating, user: { name: 'Current User' } },
        ]);
        setReviewContent('');
        setRating(0);
        setIsReviewModalOpen(false);
      } else {
        alert('Failed to submit review. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
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
          reviews.map((review, index) => (
            <div key={index} className="review">
              <p>
                <strong>{review.user.name}</strong>: {review.content}
              </p>
              <div className="review-rating">
                <Rating value={review.rating} readOnly precision={0.5} />
              </div>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}

        <button onClick={openReviewModal} className="add-review-button">
          Add Review
        </button>
      </div>

      {/* Review Modal */}
      <Modal isOpen={isReviewModalOpen} closeModal={closeReviewModal}>
        <form onSubmit={handleReviewSubmit} className="review-form">
          <h2>Add a Review</h2>
          <Rating
            name="review-rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            precision={0.5}
          />
          <textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="Write your review here"
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default TrackPage;
