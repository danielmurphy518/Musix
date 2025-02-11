// services/clearData.js

const Review = require('../models/Review');
const User = require('../models/User');


// Function to delete all reviews
const clearReviews = async () => {
  try {
    await Review.deleteMany({});
    return { success: true, message: 'All reviews have been cleared' };
  } catch (err) {
    console.error('Error clearing reviews:', err);
    throw new Error('Error clearing reviews');
  }
};

// Function to delete all users except the admin
const clearUsers = async () => {
  try {
    await User.deleteMany({ email: { $ne: 'admin@test.com' } });
    return { success: true, message: 'All users except admin@test.com have been deleted' };
  } catch (err) {
    console.error('Error deleting users:', err);
    throw new Error('Error deleting users');
  }
};

// A combined function to clear both reviews and users
const clearAllData = async () => {
  try {
    const reviewsResult = await clearReviews();
    const usersResult = await clearUsers();
    return { success: true, message: 'All reviews and users (except admin@test.com) have been cleared' };
  } catch (err) {
    console.error('Error clearing all data:', err);
    throw new Error('Error clearing all data');
  }
};

module.exports = {
  clearReviews,
  clearUsers,
  clearAllData
};
