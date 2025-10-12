import React from "react";
import "./Homepage.css";

const Homepage = ({ openLoginModal }) => {
  return (
    <div className="homepage-wrapper">
      <div className="homepage-card">
        <h1 className="homepage-title">Clusters</h1>
        <p className="homepage-subtitle">
          Discover and explore your favorite tracks — all in one place.
        </p>
        <button onClick={openLoginModal} className="homepage-button">
          Sign Up / Log In
        </button>
      </div>
    </div>
  );
};

export default Homepage;
