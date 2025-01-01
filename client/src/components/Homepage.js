import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Homepage.css";
import { fetchRecentTracks, fetchUserInformation } from '../api';
import { UserContext } from '../UserContext';

const Homepage = () => {
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
    };

    fetchRecents();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="homepage-container">
        {user && (
          <div className="welcome-box">
            Welcome, {user.name}
          </div>
        )}
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
