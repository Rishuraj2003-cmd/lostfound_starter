import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { MessageSquare, User, Trash2 } from "lucide-react";
import { socket } from "../socket";
import ChatRoom from "./ChatRoom";

export default function Chat({ globalOnlineUsers = [] }) {
  const { id } = useParams(); // The currently selected chat ID
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchChats();

    // If socket is already connected, emit joinUser to ensure server knows we are here
    // This handles the case where Chat component mounts but missed the initial connection
    if (socket.connected && currentUserId) {
      socket.emit("joinUser", currentUserId);
    }
  }, [currentUserId]);

  const fetchChats = async () => {
    try {
      const res = await api.get("/chat");
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;
    try {
      await api.delete(`/chat/${chatId}`);
      setChats(prev => prev.filter(c => c._id !== chatId));
      if (id === chatId) navigate("/chat");
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL conversations? This cannot be undone.")) return;
    try {
      await api.delete("/chat");
      setChats([]);
      navigate("/chat");
    } catch (err) {
      console.error("Error deleting all chats:", err);
    }
  };

  // Find the currently active chat to pass the other user's info down
  const activeChat = chats.find(c => c._id === id);
  let otherUser = null;
  if (activeChat) {
    otherUser = activeChat.members.find(m => m._id !== currentUserId);
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden max-w-7xl mx-auto border-x border-gray-200">
      
      {/* LEFT SIDE: CHAT LIST */}
      <div className={`
        ${id ? "hidden md:flex" : "flex"} 
        w-full md:w-80 lg:w-96 flex-col border-r border-gray-200 bg-gray-50/50
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
              <MessageSquare size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          </div>

          {chats.length > 0 && (
            <button 
              onClick={handleDeleteAll}
              title="Delete All Chats"
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chats.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No conversations yet
            </div>
          ) : (
            chats.map((chat) => {
              const chatUser = chat.members.find(m => m._id !== currentUserId);
              const isActive = chat._id === id;
              const isOnline = chatUser && globalOnlineUsers.includes(chatUser._id);

              return (
                <div
                  key={chat._id}
                  onClick={() => navigate(`/chat/${chat._id}`)}
                  className={`
                    group p-3 rounded-xl cursor-pointer flex items-center gap-3 transition relative
                    ${isActive ? "bg-indigo-600 text-white shadow-md" : "bg-white hover:bg-gray-100 border border-gray-100"}
                  `}
                >
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                      ${isActive ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"}
                    `}>
                      {chatUser?.name ? chatUser.name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                    {/* ONLINE DOT */}
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <p className={`font-bold truncate ${isActive ? "text-white" : "text-gray-900"}`}>
                      {chatUser?.name || "Unknown"}
                    </p>
                    <p className={`text-xs truncate ${isActive ? "text-indigo-100" : "text-gray-500"}`}>
                      {chatUser?.email || "No email"}
                    </p>
                  </div>

                  <button 
                    onClick={(e) => handleDeleteChat(e, chat._id)}
                    className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition
                      ${isActive ? "hover:bg-white/20 text-white" : "hover:bg-red-50 text-red-500"}
                    `}
                    title="Delete Chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT SIDE: CHAT ROOM */}
      <div className={`
        ${!id ? "hidden md:flex" : "flex"} 
        flex-1 flex-col bg-white relative
      `}>
        {id && socket ? (
          <ChatRoom chatId={id} otherUser={otherUser} socket={socket} onlineUsers={globalOnlineUsers} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Your Messages</h3>
            <p className="text-gray-500 mt-2">Select a conversation from the sidebar to start chatting.</p>
          </div>
        )}
      </div>

    </div>
  );
}