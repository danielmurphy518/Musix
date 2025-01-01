import React from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ isOpen, closeModal, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#1A1A1A', // Dark background
          color: '#f1f1f1', // Light text color
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
          maxWidth: '600px',
        },
      }}
    >
      <DialogContent
        sx={{
          paddingTop: '16px',
          paddingBottom: '16px',
        }}
      >
        <IconButton
          edge="end"
          color="inherit"
          onClick={closeModal}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#fff',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
