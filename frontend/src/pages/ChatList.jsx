// 📁 pages/ChatList.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { MessageSquare, ChevronRight, User } from "lucide-react";

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

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
          <MessageSquare size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">My Chats</h1>
      </div>

      {chats.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700">No conversations yet</h3>
          <p className="text-gray-500 mt-2">When you contact someone about a report, your chats will appear here.</p>
        </div>
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
                className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-indigo-100 transition flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  {otherUser?.name ? <span className="font-bold text-lg">{otherUser.name.charAt(0).toUpperCase()}</span> : <User size={20} />}
                </div>
                
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg">
                    {otherUser?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {otherUser?.email}
                  </p>
                </div>

                <div className="text-gray-300">
                  <ChevronRight size={24} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}