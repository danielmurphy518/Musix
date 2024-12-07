import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTrackById } from '../api'; // Import the new API function
import './Trackpage.css';

const TrackPage = () => {
  const { trackId } = useParams(); // Get trackId from URL params
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const getTrack = async () => {
      const trackData = await fetchTrackById(trackId);
      console.log(trackData)
      if (trackData) {
        setTrack(trackData);
      }
    };
    getTrack();
  }, [trackId]);

  if (!track) {
    return <div>Loading...</div>;
  }

  return (
    <div className="track-page">
      <h1>{track.track_name}</h1>
      <h3>{track.artist}</h3>
      <p>{track.description}</p>
      {track.image ? (
        <img src={track.image} alt={`${track.artist} - ${track.name}`} className="track-image" />
      ) : (
        <div>No image available</div>
      )}
      {/* Add more track details as needed */}
    </div>
  );
};

export default TrackPage;
