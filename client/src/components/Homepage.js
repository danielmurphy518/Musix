import React, { useEffect, useState } from "react";
import "./Homepage.css";

const Homepage = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch("https://2cdd-2403-4800-25ad-7c01-41e4-11c0-d683-3c2b.ngrok-free.app/tracks/recent", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", // Add this custom header
          },
        });
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchTracks();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="homepage-container">
        <div className="grid-container">
          {tracks.map((track, index) => (
            <div key={track._id || index} className="grid-box">
              <a href={`/track/${track._id}`}>
                {track.image ? (
                  <img
                    src={track.image}
                    alt={`${track.artist} - ${track.track_name}`}
                    className="track-image"
                  />
                ) : (
                  <div className="placeholder">No Image</div>
                )}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
