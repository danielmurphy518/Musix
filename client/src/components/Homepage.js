import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Homepage.css";
import { fetchRecentTracks } from '../api'; // Assume this function fetches tracks
import { UserContext } from '../UserContext';

const Homepage = ({ openLoginModal }) => { // Add openLoginModal as a prop
  const [tracks, setTracks] = useState([]);
  const { user, login, logout } = useContext(UserContext);

  useEffect(() => {
    const fetchRecents = async () => {
      try {
        const [trackData, userData] = await Promise.all([
          fetchRecentTracks(),
        ]);
        if (trackData) setTracks(trackData);
      } catch (error) {
        console.error('Error fetching track or reviews:', error);
      }
    }

    fetchRecents();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="homepage-container">
        <div className="welcome-section">
          <div className="background-overlay">
            <div className="welcome-text">
              <h1>Music App</h1>
              <p>Discover and explore your favorite tracks, all in one place. TODO: think of a better name for this</p>
            </div>
            <div className="image-label">
              <p>Featured Track: Your Daily Mix</p>
            </div>
          </div>
        </div>
        {/* {user && (
          <div className="welcome-box">
            Welcome, {user.name}
          </div>
        )} */}
        <button onClick={openLoginModal} className="sign-up-button">Sign Up</button>
        <div className="grid-container">
          {tracks.map((track, index) => (
            <div key={track._id || index} className="grid-box">
              {/* Use Link instead of href */}
              <Link to={`/track/${track._id}`}>
                {track.image ? (
                  <img
                    src={track.image}
                    alt={`${track.artist} - ${track.track_name}`}
                    className="track-image"
                  />
                ) : (
                  <div className="placeholder">No Image</div>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
