"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// ===============================================
// ChatWidget - যেকোনো page এ add করা যাবে
// Usage: <ChatWidget />  (layout.js এ add করো)
// ===============================================

let socket = null;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("form"); // form | chat
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, adminTyping]);

  // Restore session from localStorage
  useEffect(() => {
    const savedSessionId = localStorage.getItem("chat_session_id");
    const savedName = localStorage.getItem("chat_name");
    if (savedSessionId && savedName) {
      setSessionId(savedSessionId);
      setFormData((prev) => ({ ...prev, name: savedName }));
      setStep("chat");
      loadMessages(savedSessionId);
    }
  }, []);

  const loadMessages = async (sid) => {
    try {
      const res = await fetch(`${API}chat/${sid}`);
      const data = await res.json();
      setMessages(data.messages || []);
      if (data.status === "closed") setStep("closed");
    } catch {}
  };

  const connectSocket = (sid) => {
    if (socket) socket.disconnect();

    socket = io(API, { withCredentials: true });

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_room", sid);
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("receive_message", ({ message }) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("admin_is_typing", () => {
      setAdminTyping(true);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setAdminTyping(false), 2000);
    });

    socket.on("chat_closed", () => {
      setStep("closed");
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[0-9+\-\s]{7,15}$/.test(formData.phone)) errs.phone = "Invalid phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const startChat = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API}/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      const sid = data.session._id;

      setSessionId(sid);
      localStorage.setItem("chat_session_id", sid);
      localStorage.setItem("chat_name", formData.name);

      // Send welcome event to admin
      socket?.emit("new_session", data.session);
      connectSocket(sid);

      setMessages([
        {
          sender: "admin",
          text: `Hi ${formData.name}! 👋 Welcome! How can we help you today?`,
          timestamp: new Date(),
        },
      ]);

      setStep("chat");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!inputMsg.trim() || !sessionId) return;

    socket?.emit("send_message", {
      sessionId,
      text: inputMsg.trim(),
      sender: "customer",
    });

    setInputMsg("");
  };

  const handleTyping = (e) => {
    setInputMsg(e.target.value);
    socket?.emit("customer_typing", sessionId);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endChat = () => {
    socket?.emit("close_chat", sessionId);
    localStorage.removeItem("chat_session_id");
    localStorage.removeItem("chat_name");
    setStep("form");
    setSessionId(null);
    setMessages([]);
    setFormData({ name: "", phone: "" });
    setIsOpen(false);
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const unreadCount = 0; // Can track locally if needed

  return (
    <>
      {/* ===== Chat Window ===== */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Live Support</p>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-300" : "bg-gray-300"}`}></span>
                  <p className="text-emerald-100 text-xs">
                    {isConnected ? "Online" : "Connecting..."}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ===== FORM STEP ===== */}
          {step === "form" && (
            <div className="flex-1 flex flex-col justify-center p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-gray-800 font-bold text-lg">Start a Conversation</h3>
                <p className="text-gray-500 text-sm mt-1">We typically reply in a few minutes</p>
              </div>

              <form onSubmit={startChat} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${
                      errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${
                      errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    "Start Chat →"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ===== CHAT STEP ===== */}
          {step === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "admin" && (
                      <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 self-end">
                        S
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
                        msg.sender === "customer"
                          ? "bg-emerald-500 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-0.5 ${msg.sender === "customer" ? "text-emerald-100" : "text-gray-400"}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {adminTyping && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">S</div>
                    <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm">
                      <div className="flex gap-1 items-center h-4">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t border-gray-100 p-2 flex items-end gap-2">
                <textarea
                  value={inputMsg}
                  onChange={handleTyping}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 resize-none text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  style={{ maxHeight: "80px" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMsg.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 text-white p-2 rounded-xl transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>

              {/* End chat */}
              <div className="bg-white px-3 pb-2 flex justify-center">
                <button onClick={endChat} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
                  End conversation
                </button>
              </div>
            </>
          )}

          {/* ===== CLOSED STEP ===== */}
          {step === "closed" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-700 font-semibold">Chat Ended</h3>
              <p className="text-gray-500 text-sm mt-1 mb-4">Thank you for reaching out!</p>
              <button
                onClick={() => {
                  localStorage.removeItem("chat_session_id");
                  localStorage.removeItem("chat_name");
                  setStep("form");
                  setMessages([]);
                  setFormData({ name: "", phone: "" });
                }}
                className="bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                Start New Chat
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== Floating Button ===== */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        )}

        {/* Pulse animation when chat is open */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full">
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
          </span>
        )}
      </button>
    </>
  );
}