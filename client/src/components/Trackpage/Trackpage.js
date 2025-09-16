import React, { useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import { fetchTrackById, fetchReviewsByTrackId, submitReview } from '../../api';
import ReviewModal from '../ReviewModal';
import Rating from '@mui/material/Rating';
import './Trackpage.css';
import { UserContext } from '../../UserContext';

const TrackPage = () => {
  const { trackId } = useParams();
  const [track, setTrack] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchTrackAndReviews = async () => {
      try {
        const [trackData, reviewData] = await Promise.all([
          fetchTrackById(trackId),
          fetchReviewsByTrackId(trackId),
        ]);
        if (trackData) setTrack(trackData);
        console.log(reviewData)
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
      const response = await submitReview(trackId, reviewContent, rating, user);
      if (response) {
        setReviews((prevReviews) => [
          ...prevReviews,
          { content: reviewContent, rating, user: { name: user.name } },
        ]);
        // Update the track's rating stats after submitting a new review
        setTrack(prevTrack => ({
          ...prevTrack,
          average_rating: ((prevTrack.average_rating * prevTrack.review_count) + rating) / (prevTrack.review_count + 1),
          review_count: prevTrack.review_count + 1
        }));
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

  const openReviewModal = () => setIsReviewModalOpen(true);
  const closeReviewModal = () => setIsReviewModalOpen(false);

  if (!track) {
    return <div>Loading...</div>;
  }

  return (
    <div className="track-page">
      <h1>{track.track_name}</h1>
      <h3>{track.artist}</h3>
      <p>{track.description}</p>
      
      {/* Track Rating Summary Section */}
      <div className="track-rating-summary">
        <div className="average-rating">
          <Rating 
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#FFD700',
              },
              '& .MuiRating-iconEmpty': {
                color: '#B0B0B0',
              },
              '& .MuiRating-iconHover': {
                color: '#FFD700',
              }
            }}
            value={track.average_rating || 0} 
            readOnly 
            precision={0.1} 
          />
          <span>{track.average_rating ? track.average_rating.toFixed(1) : 0} ({track.review_count || 0} reviews)</span>
        </div>
      </div>

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
                <Rating       
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#FFD700',
                    },
                    '& .MuiRating-iconEmpty': {
                      color: '#B0B0B0',
                    },
                    '& .MuiRating-iconHover': {
                      color: '#FFD700',
                    }
                  }}
                  value={review.rating} 
                  readOnly 
                  precision={0.5} 
                />
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

      <ReviewModal
        isOpen={isReviewModalOpen}
        closeModal={closeReviewModal}
        rating={rating}
        setRating={setRating}
        reviewContent={reviewContent}
        setReviewContent={setReviewContent}
        handleReviewSubmit={handleReviewSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default TrackPage;