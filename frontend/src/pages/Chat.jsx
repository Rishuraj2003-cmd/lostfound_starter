import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { api } from "../api/client";

// Get the base URL (remove /api from the end for socket connection)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const SOCKET_URL = API_URL.replace("/api", "");

export default function Chat({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  
  // Use a ref to store the socket instance so it doesn't reconnect on every keystroke
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    const socket = socketRef.current;

    socket.emit("joinChat", conversationId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    api.get(`/chat/messages/${conversationId}`).then((res) => {
      setMessages(res.data);
    });

    return () => socket.disconnect();
  }, [conversationId]);

  async function sendMessage() {
    if (!text.trim()) return;

    const msg = {
      conversationId,
      text,
    };

    const res = await api.post("/chat/message", msg);

    if (socketRef.current) {
      socketRef.current.emit("sendMessage", res.data);
    }
    setMessages((prev) => [...prev, res.data]);
    setText("");
  }

  return (
    <div className="p-4">
      <div className="h-96 overflow-auto border mb-2 p-2">
        {messages.map((m) => (
          <div key={m._id} className="mb-2">
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border flex-1 p-2"
        />
        <button onClick={sendMessage} className="bg-indigo-600 text-white px-4">
          Send
        </button>
      </div>
    </div>
  );
}