import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5001");

const Footer = () => {
  const [totalVisitors, setTotalVisitors] = useState(0);

  // Fetch initial visitor count
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/visitor`)
      .then(res => res.json())
      .then(data => setTotalVisitors(data.count))
      .catch(console.error);
  }, []);

  // Listen for socket updates
  useEffect(() => {
    socket.on("visitorCount", count => setTotalVisitors(count));
    return () => socket.off("visitorCount");
  }, []);

  return (
    <footer style={footerStyle}>
      Total Visitors: {totalVisitors}
    </footer>
  );
};

const footerStyle = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  textAlign: "center",
  padding: "10px",
  backgroundColor: "#f2f2f2",
  borderTop: "1px solid #ccc",
  fontWeight: "bold",
};

export default Footer;
