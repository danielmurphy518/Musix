import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone/esm/vis-network";
import "vis-network/styles/vis-network.css"; // optional, for default styling

const UserNetworkPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const nodes = [
      { id: 1, label: "Alice" },
      { id: 2, label: "Bob" },
      { id: 3, label: "Carol" },
      { id: 4, label: "Dave" },
      { id: 5, label: "Eve" },
    ];

    const edges = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
    ];

    const data = { nodes, edges };

    const options = {
      nodes: {
        shape: "dot",
        size: 16,
        color: "#3f51b5",
        font: { color: "#fff", size: 14 },
        borderWidth: 2,
      },
      edges: {
        color: "#ccc",
        width: 2,
        smooth: {
          type: "continuous",
        },
      },
      physics: {
        stabilization: false,
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
      },
    };

    new Network(containerRef.current, data, options);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>User Network</h2>
      <div
        ref={containerRef}
        style={{
          height: "600px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginTop: "1rem",
        }}
      />
    </div>
  );
};

export default UserNetworkPage;