import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }

    if (!prevChats?.length) return;

    const content = reply.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

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
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
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

        {prevChats.length > 0 && (
          <div className="gptDiv">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={markdownComponents}
            >
              {latestReply ?? prevChats[prevChats.length - 1].content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
