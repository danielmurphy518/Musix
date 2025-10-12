import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone/esm/vis-network";
import "vis-network/styles/vis-network.css";
import { useNavigate } from "react-router-dom";
import { fetchAllUsers } from "../../api";

const UserNetworkPage = () => {
  const containerRef = useRef(null);
  const [network, setNetwork] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let handler; // for cleanup later

    async function loadUsers() {
      try {
        const data = await fetchAllUsers(); // { nodes: [...], edges: [...] }
        if (!data || !data.nodes) {
          console.error("Invalid users data:", data);
          return;
        }

        const options = {
          nodes: { shape: "dot", size: 16, color: "#3f51b5", font: { color: "#fff", size: 14 }, borderWidth: 2 },
          edges: { color: "#ccc", width: 2, smooth: { type: "continuous" } },
          physics: { stabilization: false },
          interaction: { hover: true, tooltipDelay: 100 },
        };

        if (network) {
          network.setData(data);
          network.redraw();
        } else {
          const net = new Network(containerRef.current, data, options);
          setNetwork(net);

          // navigate WITH history (Back goes back to /network)
          handler = (params) => {
            const nodeId = String(params.nodes?.[0] ?? "");
            if (!nodeId) return;
            navigate(`/user/${nodeId}`); // pushes history entry
          };
          net.on("selectNode", handler);
        }
      } catch (err) {
        console.error("Error loading users:", err);
      }
    }

    loadUsers();

    // cleanup the event handler if we added it
    return () => {
      if (network && handler) {
        network.off("selectNode", handler);
      }
    };
  }, [network, navigate]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>User Network</h2>
      <div
        ref={containerRef}
        style={{ height: "600px", border: "1px solid #ddd", borderRadius: "8px", marginTop: "1rem" }}
      />
    </div>
  );
};

export default UserNetworkPage;
