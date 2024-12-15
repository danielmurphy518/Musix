import React, { useEffect, useState } from "react";
import "./Homepage.css";
import { fetchRecentTracks, fetchUserInformation} from '../api';


const Homepage = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchRecents = async () => {
      try {
        const [trackData, userData] = await Promise.all([
          fetchRecentTracks(),
          fetchUserInformation()
        ]);
        console.log(userData)
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
