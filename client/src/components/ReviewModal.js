import React from 'react';
import { Rating } from '@mui/material';
import Modal from './Modal/Modal';

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
      <form
        onSubmit={handleReviewSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          padding: '20px',
          width: '100%',
          maxWidth: '500px', // Restrict width of the modal content
        }}
      >
        <h2
          style={{
            color: '#F0F0F0',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          Add a Review
        </h2>
            <Rating
      name="review-rating"
      value={rating}
      onChange={(event, newValue) => setRating(newValue)}
      precision={0.5}
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
    />
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="Write your review here..."
          required
          style={{
            width: '100%',
            height: '120px', // Fixed height for textarea
            maxHeight: '200px', // Prevents it from growing too large
            padding: '10px',
            marginBottom: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'vertical', // Allow resizing vertically
            overflowY: 'auto', // Scroll if content exceeds height
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </Modal>
  );
};

export default ReviewModal;
