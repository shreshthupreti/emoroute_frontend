import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
        }),
      });

      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.error("Failed to fetch reply:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
      setPrompt("");
      setReply(null); // Prevent duplicate additions
    }
  }, [reply]);

  return (
    <div className="chat-window">
      <div className="chat-navbar">
        <span onClick={() => setIsDropdownOpen(!isDropdownOpen)} role="button" aria-label="User menu">
          EmoRoute <i className="fa-solid fa-chevron-down"></i>
        </span>

        {isDropdownOpen && (
          <div className="chat-dropdown">
            <div className="dropdown-item">
              <i className="fa-solid fa-gear"></i> Settings
            </div>
            <div className="dropdown-item">
              <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
            </div>
            <div className="dropdown-item">
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
            </div>
          </div>
        )}
      </div>

      <Chat />

      {loading && (
        <div className="loader-wrapper">
          <ScaleLoader color="#fff" />
        </div>
      )}

      <div className="chat-input">
        <div className="input-box">
          <input
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? getReply() : null}
            aria-label="Chat input"
          />
          <div className="submit-btn" onClick={getReply} role="button" aria-label="Send message">
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="input-info">
          EmoRoutes may make mistakes. Double-check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
