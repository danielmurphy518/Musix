import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Homepage.css";
import { fetchRecentTracks, fetchFeaturedTrack } from "../../api"; // Assume these functions fetch tracks
import { UserContext } from "../../UserContext";

const Homepage = ({ openLoginModal }) => {
  const [tracks, setTracks] = useState([]);
  const [featuredTrack, setFeaturedTrack] = useState(null); // Add state for the featured track
  const { user, login, logout } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentTracks, featured] = await Promise.all([
          fetchRecentTracks(),
          fetchFeaturedTrack(), // Fetch the featured track
        ]);

        if (recentTracks) setTracks(recentTracks);
        if (featured) setFeaturedTrack(featured); // Store the featured track data
      } catch (error) {
        console.error("Error fetching track or reviews:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="homepage-container">
        <div
          className="welcome-section"
          style={{
            backgroundImage: featuredTrack
              ? `url(${featuredTrack.image})`
              : "url('https://i.scdn.co/image/ab67616d0000b27315ebbedaacef61af244262a8')", // Default background
          }}
        >
          <div className="background-overlay">
            <div className="welcome-text">
              <h1>Music App</h1>
              <p>
                Discover and explore your favorite tracks, all in one place. TODO: think
                of a better name for this
              </p>
            </div>
            {featuredTrack && (
              <div className="image-label">
                <p>
                  Featured Track: {featuredTrack.artist} - {featuredTrack.track_name}
                </p>
              </div>
            )}
          </div>
        </div>
        <button onClick={openLoginModal} className="sign-up-button">Sign Up</button>
        <div className="grid-container">
          {tracks.map((track, index) => (
            <div key={track._id || index} className="grid-box">
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
