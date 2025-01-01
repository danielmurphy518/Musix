import React from 'react';
import { Rating } from '@mui/material';
import Modal from './Modal';
import './ReviewModal.css';

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
      <form onSubmit={handleReviewSubmit} className="review-modal-form">
        <h2 className="review-modal-title">Add a Review</h2>
        <Rating
          name="review-rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          precision={0.5}
          sx={{ marginBottom: '16px' }}
        />
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="Write your review here..."
          className="review-modal-textarea"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="review-modal-submit-button"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </Modal>
  );
};

export default ReviewModal;
