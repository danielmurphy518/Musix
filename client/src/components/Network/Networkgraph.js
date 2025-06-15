import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone/esm/vis-network";
import "vis-network/styles/vis-network.css";
import { fetchAllUsers } from '../../api';  // Make sure this imports correctly

const UserNetworkPage = () => {
  const containerRef = useRef(null);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
async function loadUsers() {
  try {
    const data = await fetchAllUsers(); // This returns { nodes: [...], edges: [...] }
    
    if (!data || !data.nodes) {
      console.error("Invalid users data:", data);
      return;
    }

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
        smooth: { type: "continuous" },
      },
      physics: { stabilization: false },
      interaction: { hover: true, tooltipDelay: 100 },
    };

    if (network) {
      network.setData(data);
      network.redraw();
    } else {
      const net = new Network(containerRef.current, data, options);
      setNetwork(net);
    }
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

    loadUsers();
  }, []); // Run once on mount

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
