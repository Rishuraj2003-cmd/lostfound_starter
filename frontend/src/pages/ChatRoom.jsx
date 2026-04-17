import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { io } from "socket.io-client";
import { Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChatRoom({ chatId, otherUser, socket, onlineUsers }) {
  const id = chatId; // use prop instead of param

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name") || "U";

  // 🔥 SOCKET + FETCH
  useEffect(() => {
    if (!socket) return;

    socket.emit("joinChat", id);

    // ✅ RECEIVE MESSAGE
    socket.off("receiveMessage");
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    // ✅ TYPING
    socket.off("typing");
    socket.on("typing", setTypingUser);
    
    socket.off("stopTyping");
    socket.on("stopTyping", () => setTypingUser(""));

    // ✅ SEEN
    socket.off("messageSeen");
    socket.on("messageSeen", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((m) =>
          messageIds.includes(m._id?.toString())
            ? { ...m, seen: true }
            : m
        )
      );
    });

    // ✅ FETCH MESSAGES
    api.get(`/chat/messages/${id}`).then((res) => {
      setMessages(res.data);
      api.put(`/chat/seen/${id}`);
    });

    // We don't disconnect the socket here because it belongs to the parent
    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageSeen");
    };
  }, [id, socket]);

  // 🔥 AUTO SCROLL (Fixed to avoid whole page scrolling)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 🔥 SEND MESSAGE
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await api.post("/chat/message", {
        conversationId: id,
        text,
      });

      setText("");

      if (socket) {
        socket.emit("stopTyping", {
          conversationId: id,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 TYPING
  const handleTyping = (e) => {
    setText(e.target.value);

    if (!socket) return;

    socket.emit("typing", {
      conversationId: id,
      userName,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        conversationId: id,
      });
    }, 1000);
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getInitial = (name) =>
    name?.charAt(0).toUpperCase() || "U";

  // Fix: Check if the OTHER user is online, not the current user!
  const isOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full w-full relative">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm shrink-0">
        <Link to="/chat" className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition">
          <ArrowLeft size={20} />
        </Link>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
          {getInitial(otherUser?.name || "Chat")}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="font-bold text-gray-900 leading-tight truncate">{otherUser?.name || "Chat"}</p>
          <p className="text-xs font-medium text-green-500 flex items-center gap-1">
            {isOnline ? (
              <><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online</>
            ) : (
              <span className="text-gray-400">Offline</span>
            )}
          </p>
        </div>
      </div>

      {/* CHAT */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3 scroll-smooth">

        {messages.map((m) => {
          const isMe =
            String(m.sender?._id || m.sender) === String(userId);

          return (
            <div
              key={m._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >

              {!isMe && (
                <div className="flex items-end gap-2 max-w-[85%]">
                  <div className="w-9 h-9 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">
                    {getInitial(m.senderName)}
                  </div>

                  <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm max-w-[75%]">
                    <p className="text-sm whitespace-pre-wrap text-gray-800">
                      {m.text}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      {formatTime(m.createdAt)}
                    </span>
                  </div>
                </div>
              )}

              {isMe && (
                <div className="flex items-end gap-2 max-w-[85%]">
                  <div className="bg-indigo-600 text-white px-3 py-2 rounded-2xl rounded-br-sm shadow-sm max-w-[75%]">
                    <p className="text-sm whitespace-pre-wrap">
                      {m.text}
                    </p>

                    <div className="text-[10px] flex justify-end gap-1 text-indigo-200">
                      {formatTime(m.createdAt)}

                      {m.sender === userId &&
                        (m.seen ? (
                          <span className="text-blue-400">✔✔</span>
                        ) : (
                          <span>✔</span>
                        ))}
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">
                    {getInitial(userName)}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {typingUser && (
          <p className="text-xs text-gray-400 ml-2">
            {typingUser} typing...
          </p>
        )}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t bg-white flex gap-2 items-end sticky bottom-0 shrink-0">
        <textarea
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none max-h-32 min-h-[44px]"
          rows="1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center h-11 w-11 shadow-sm"
        >
          <Send size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
}