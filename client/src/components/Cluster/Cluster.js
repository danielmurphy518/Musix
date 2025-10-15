import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchSegmentById } from "../../api";
import "./Cluster.css";

const ClusterPage = () => {
  const { clusterId } = useParams(); // assumes route like /cluster/:clusterId
  const [cluster, setCluster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCluster = async () => {
      try {
        const data = await fetchSegmentById(clusterId);
        setCluster(data);
      } catch (error) {
        console.error("Error fetching cluster:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCluster();
  }, [clusterId]);

  if (loading) return <div className="cluster-loading">Loading cluster...</div>;
  if (!cluster) return <div className="cluster-error">Cluster not found.</div>;

  return (
    <div className="cluster-page">
      <h1 className="cluster-title">{cluster.name || "Untitled Cluster"}</h1>
      {cluster.description && (
        <p className="cluster-description">{cluster.description}</p>
      )}
      {cluster.image && (
        <img
          src={cluster.image}
          alt={cluster.name}
          className="cluster-image"
        />
      )}
    </div>
  );
};

export default ClusterPage;
