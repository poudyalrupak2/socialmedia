import React, { useEffect, useState, useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { io } from "socket.io-client";

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();
  const socket = useRef();
  const imageRef = useRef();
 
  // Initialize Socket.IO connection only once
  useEffect(() => {
    socket.current = io("http://localhost:8800");

    // Listen for incoming messages
    const messageListener = (message) => {
      console.log("Message received on client:", message);
      if (message.chatId === chat?._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.current.on("receive-message", messageListener);

    // Clean up socket on component unmount
    return () => {
      socket.current.off("receive-message", messageListener);
      socket.current.disconnect();
    };
  }, [chat]);

  // Join the chat room when the chat changes
  useEffect(() => {
    if (chat && socket.current) {
      socket.current.emit("join-room", chat._id);
      console.log(`Joined room for chat ID: ${chat._id}`);
    }
  }, [chat]);

  // Fetch user data for chat header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    if (chat) getUserData();
  }, [chat, currentUser]);

  // Fetch initial messages for the chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    if (chat) fetchMessages();
  }, [chat]);

  // Scroll to the last message when messages update
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle input change
  const handleChange = (newMessage) => setNewMessage(newMessage);

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    const receiverId = chat.members.find((id) => id !== currentUser);

    // Send message to server via Socket.IO
    if (socket.current) {
      socket.current.emit("send-message", { ...message, receiverId });
      console.log("Message sent to server:", message);
    }

    // Add message to database and update UI
    try {
      const { data } = await addMessage(message);
      setMessages((prevMessages) => [...prevMessages, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message to database", error);
    }
  };

  // Update messages when a new message is received from parent
  useEffect(() => {
    console.log(chat);
    if (receivedMessage && receivedMessage.chatId === chat._id&&receivedMessage.receiverId!=userData._id) {
      console.log("user id is",userData._id);

      console.log("Message received from parent:", receivedMessage);
     setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  }, [receivedMessage, chat]);

  return (
    <div className="ChatBox-container">
      {chat ? (
        <>
          {/* Chat Header */}
          <div className="chat-header">
            <div className="follower">
              <div>
                <img
                  src={
                    userData?.profilePicture
                      ? `${process.env.REACT_APP_PUBLIC_FOLDER}${userData.profilePicture}`
                      : `${process.env.REACT_APP_PUBLIC_FOLDER}defaultProfile.png`
                  }
                  alt="Profile"
                  className="followerImage"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="name" style={{ fontSize: "0.9rem" }}>
                  <span>{userData?.firstname} {userData?.lastname}</span>
                </div>
              </div>
            </div>
            <hr style={{ width: "95%", border: "0.1px solid #ececec", marginTop: "20px" }} />
          </div>

          {/* Chat Body */}
          <div className="chat-body">
            {messages.map((message) => (
              <div
                key={message._id}
                ref={scroll}
                className={message.senderId === currentUser ? "message own" : "message"}
              >
                <span>{message.text}</span>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
          </div>

          {/* Chat Sender */}
          <div className="chat-sender">
            <div onClick={() => imageRef.current.click()}>+</div>
            <InputEmoji value={newMessage} onChange={handleChange} />
            <div className="send-button button" onClick={handleSend}>Send</div>
            <input type="file" style={{ display: "none" }} ref={imageRef} />
          </div>
        </>
      ) : (
        <span className="chatbox-empty-message">
          Tap on a chat to start conversation...
        </span>
      )}
    </div>
  );
};

export default ChatBox;
