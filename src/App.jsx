// App.jsx
import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  };

  return (
    <div className="root">
      <SignedOut>
        <div className="auth-container">
          <div className="auth-overlay">
            <div className="auth-content">
              <h1 className="title">EmoRoute</h1>
              <p className="subtitle">
                Emotion-Based Travel. <br /> Experience journeys like never before.
              </p>
              <SignInButton mode="modal">
                <button className="enter-btn">Enter the Experience</button>
              </SignInButton>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <MyContext.Provider value={providerValues}>
          <div className="dashboard">
            <header className="dashboard-header">
              <div className="logo">EmoRoute</div>
              <UserButton afterSignOutUrl="/" />
            </header>

            <main className="dashboard-main">
              <Sidebar />
              <ChatWindow />
            </main>
          </div>
        </MyContext.Provider>
      </SignedIn>
    </div>
  );
}

export default App;
