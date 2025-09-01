import "./Chat.css";
import React, { useContext } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { prevChats, newChat } = useContext(MyContext);

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
    <>
      {newChat && <h1 className="start-text">Start a New Chat!</h1>}
      <div className="chats">
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
      </div>
    </>
  );
}

export default Chat;
