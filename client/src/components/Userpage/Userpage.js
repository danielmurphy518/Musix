import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserspage, fetchImpliedInterests } from '../../api';
import './Userpage.css';

const UserPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndReviews = async () => {
      try {
        const data = await fetchUserspage(userId);
        if (data) setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUserAndReviews();
  }, [userId]);

  if (!user) {
    return <div>Loading user details...</div>;
  }

  return (
    <div className="user-page">
      {/* Banner Section */}
      <div className="user-banner">
        <h1 className="user-name">{user.name}</h1>
        <h2 className="user-handle">@{user.username}</h2>
      </div>

      {/* Bio Card */}
      <div className="bio-card">
        <h3>Bio</h3>
        <p>{user.bio ? user.bio : 'No bio provided.'}</p>
      </div>
    </div>
  );
};

export default UserPage;
