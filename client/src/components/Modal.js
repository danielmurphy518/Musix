import React from 'react';
import './Modal.css'; // Assuming you have a separate CSS file for the modal

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null; // Don't render anything if the modal is not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        {children} {/* Render the passed content */}
      </div>
    </div>
  );
};

export default Modal;
