import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone/esm/vis-network";
import "vis-network/styles/vis-network.css";
import { fetchAllUsers } from '../../api';  // Ensure this works
const UserNetworkPage = () => {
  const containerRef = useRef(null);
  const [network, setNetwork] = useState(null);
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchAllUsers(); // Should return { nodes: [...], edges: [...] }
        console.log("Fetched network data:", data);
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
          // 👇 Handle click: open user page in new tab
          net.on("click", function (params) {
            if (params.nodes.length > 0) {
              const nodeId = params.nodes[0]; // Node ID (user _id)
              const userNode = data.nodes.find((n) => n.id === nodeId);
              if (userNode && userNode.id) {
                window.open(`/user/${userNode.id}`, "_blank");
              }
            }
          });
        }
      } catch (error) {
        console.error("Error loading users:", error);
      }
    }
    loadUsers();
  }, []); // Load once on mount
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