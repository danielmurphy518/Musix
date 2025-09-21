import React, { useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import { fetchTrackById, fetchReviewsByTrackId, submitReview, fetchUserReviewByTrackId, deleteReview } from '../../api';
import ReviewModal from '../ReviewModal';
import Rating from '@mui/material/Rating';
import './Trackpage.css';
import { UserContext } from '../../UserContext';

const TrackPage = () => {
  const { trackId } = useParams();
  const [track, setTrack] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchTrackAndReviews = async () => {
      try {
        // Fetch user's review only if a user is logged in
        const userReviewPromise = user ? fetchUserReviewByTrackId(trackId) : Promise.resolve(null);

        const [trackData, reviewData, userReviewData] = await Promise.all([
          fetchTrackById(trackId),
          fetchReviewsByTrackId(trackId),
          userReviewPromise,
        ]);

        if (trackData) setTrack(trackData);
        if (userReviewData) setUserReview(userReviewData);

        if (reviewData && reviewData.reviews) {
          // If the user has a review, filter it out from the main list
          // to avoid displaying it twice.
          const otherReviews = userReviewData
            ? reviewData.reviews.filter(review => review._id !== userReviewData._id)
            : reviewData.reviews;
          setReviews(otherReviews);
        }
      } catch (error) {
        console.error('Error fetching track or reviews:', error);
      }
    };

    fetchTrackAndReviews();
  }, [trackId, user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewContent || rating === 0) {
      alert('Please write a review and select a rating!');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview = await submitReview(trackId, reviewContent, rating, user);
      if (newReview) {
        // Set the user's review state, manually adding user name for immediate display
        setUserReview({ ...newReview, user: { name: user.name } });
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

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      const result = await deleteReview(reviewId);
      if (result && result.review) {
        const deletedRating = result.review.rating;

        // Update track stats by removing the deleted review's contribution
        setTrack(prevTrack => {
          const newReviewCount = prevTrack.review_count - 1;
          const newAverageRating = newReviewCount > 0
            ? ((prevTrack.average_rating * prevTrack.review_count) - deletedRating) / newReviewCount
            : 0;
          
          return {
            ...prevTrack,
            average_rating: newAverageRating,
            review_count: newReviewCount,
          };
        });
        setUserReview(null); // Clear the user's review from state
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
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
        {/* Display the current user's review separately if it exists */}
        {userReview && (
          <div className="review user-review">
            <h3>Your Review</h3>
            <p>
              <strong>{userReview.user?.name || user?.name}</strong>: {userReview.content}
            </p>
            <div className="review-rating">
              <Rating 
                value={userReview.rating} 
                readOnly 
                precision={0.5} 
              />
            </div>
            <div>
              <button onClick={() => handleDeleteReview(userReview._id)} className="delete-review-button">Delete</button>
            </div>
          </div>
        )}

        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={review._id || index} className="review">
              <p>
                <strong>{review.user?.name || 'Anonymous'}</strong>: {review.content}
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
          // Only show "no other reviews" if there's no user review either
          !userReview && <p>No reviews available. Be the first to write one!</p>
        )}

        {/* Show 'Add Review' button only if the user is logged in and hasn't reviewed yet */}
        {user && !userReview && (
          <button onClick={openReviewModal} className="add-review-button">
            Add Review
          </button>
        )}
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