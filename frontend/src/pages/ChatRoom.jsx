import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { io } from "socket.io-client";

export default function ChatRoom() {
  const { id } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name") || "U";

  // ✅ SOCKET URL (FINAL FIX)
  const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

  // 🔥 SOCKET + FETCH
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.emit("joinUser", userId);
    socketRef.current.emit("joinChat", id);

    // ✅ ONLINE USERS
    socketRef.current.on("onlineUsers", setOnlineUsers);

    // ✅ RECEIVE MESSAGE
    socketRef.current.off("receiveMessage");
    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    // ✅ TYPING
    socketRef.current.on("typing", setTypingUser);
    socketRef.current.on("stopTyping", () => setTypingUser(""));

    // ✅ SEEN
    socketRef.current.on("messageSeen", ({ messageIds }) => {
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

    return () => socketRef.current.disconnect();
  }, [id]);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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

      socketRef.current.emit("stopTyping", {
        conversationId: id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 TYPING
  const handleTyping = (e) => {
    setText(e.target.value);

    if (!socketRef.current) return;

    socketRef.current.emit("typing", {
      conversationId: id,
      userName,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", {
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

  const isOnline = onlineUsers.includes(userId);

  return (
    <div className="h-screen flex flex-col bg-gray-100 max-w-md mx-auto w-full">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white sticky top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
          {getInitial("Chat")}
        </div>
        <div>
          <p className="font-semibold text-gray-800">Chat</p>
          <p className="text-xs text-green-500">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">

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

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t bg-white flex gap-2">
        <input
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 px-4 py-2 rounded-full text-sm focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-5 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}