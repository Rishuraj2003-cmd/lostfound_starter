import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const SOCKET_URL = API_URL.replace("/api", "");

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
  }
  // Always emit joinUser when called, just to ensure backend knows who we are
  socket.emit("joinUser", userId);
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
