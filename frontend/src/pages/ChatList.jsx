// 📁 pages/ChatList.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await api.get("/chat");
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  const openChat = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">💬 My Chats</h1>

      {chats.length === 0 ? (
        <p className="text-gray-500">No conversations yet</p>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => {
            const otherUser = chat.members.find(
              (m) => m._id !== localStorage.getItem("userId")
            );

            return (
              <div
                key={chat._id}
                onClick={() => openChat(chat._id)}
                className="p-4 bg-white rounded-xl shadow cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="font-semibold text-lg">
                  {otherUser?.name || "User"}
                </p>

                <p className="text-sm text-gray-500">
                  {otherUser?.email}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}