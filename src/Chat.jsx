import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { prevChats, setPrevChats, newChat, setNewChat } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to generate a threadId or get existing one
  // For simplicity, using a fixed threadId here
  const threadId = "default-thread";

  // Function to send message to backend
  const sendMessage = async (message) => {
    setIsLoading(true);

    // Add user message to chat locally
    setPrevChats((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    
    try {
      const response = await fetch("https://emoroute-backend.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ threadId, message })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Add assistant reply to chat locally
      setPrevChats((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setLatestReply(data.reply);
    } catch (error) {
      console.error("Error sending message:", error);
      setPrevChats((prev) => [...prev, { role: "assistant", content: "Oops! Something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  const markdownComponents = {
    p: ({ children }) => <p className="gptMessage">{children}</p>,
    code({ node, inline, className, children, ...props }) {
      return (
        <code className={`code-block ${className || ""}`} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div>
      {newChat && <h1 className="start-text">Start a New Chat!</h1>}

      <div className="chats" style={{ minHeight: "300px", marginBottom: "1rem" }}>
        {prevChats?.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={markdownComponents}
              >
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="gptDiv">
            <p className="gptMessage">Assistant is typing...</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          style={{ width: "80%", padding: "0.5rem" }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
