import React from 'react';
import { Rating } from '@mui/material';
import Modal from './Modal/Modal';
import './forms.css'; // Import shared form styles

const ReviewModal = ({
  isOpen,
  closeModal,
  rating,
  setRating,
  reviewContent,
  setReviewContent,
  handleReviewSubmit,
  isSubmitting,
}) => {
  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <form onSubmit={handleReviewSubmit} className="form-container">
        <h2 className="form-heading">
          Add a Review
        </h2>
            <Rating
      name="review-rating"
      value={rating}
      onChange={(event, newValue) => setRating(newValue)}
      precision={0.5}
      sx={{
        '& .MuiRating-iconFilled': {
          color: 'var(--accent-color)',
        },
        '& .MuiRating-iconEmpty': {
          color: 'var(--ui-color)',
        },
        '& .MuiRating-iconHover': {
          color: 'var(--accent-hover-color)',
        }
      }}
    />
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="Write your review here..."
          required
          className="form-textarea"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="form-button"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </Modal>
  );
};

export default ReviewModal;
