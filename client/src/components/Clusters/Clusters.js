import React, { useEffect, useState } from "react";
import { fetchSegments } from "../../api";
import { Link } from "react-router-dom";
import "./Clusters.css";

const Clusters = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSegments = async () => {
      try {
        const data = await fetchSegments(0, 25);
        setSegments(data.segments || data.items || []);
      } catch (err) {
        console.error("Error fetching segments:", err);
        setError("Failed to load clusters.");
      } finally {
        setLoading(false);
      }
    };
    loadSegments();
  }, []);

  if (loading) return <div className="clusters-loading">Loading clusters...</div>;
  if (error) return <div className="clusters-error">{error}</div>;

  return (
    <div className="clusters-wrapper">

      <div className="clusters-list">
        {segments.map((segment) => (
          <Link
            to={`/cluster/${segment._id}`}
            key={segment._id}
            className="cluster-link"
          >
            <div className="cluster-card">
              <h3 className="cluster-name">{segment.name || "Untitled Cluster"}</h3>
              {segment.description && (
                <p className="cluster-desc">{segment.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Clusters;
