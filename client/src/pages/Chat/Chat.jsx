import React, { useRef, useState, useEffect } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import NavIcons from "../../components/NavIcons/NavIcons";
import "./Chat.css";
import { userChats, createChat, getFollowingUsers, getFollowersUsers } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import FollowersCard from "../../components/FollowersCard/FollowersCard";
import ChatFollowers from "../../components/Followers/ChatFollowers";

const Chat = () => {
  const socket = useRef();
  const { user } = useSelector((state) => state.authReducer.authData);

  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [followers, setFollowers] = useState([]); 

  // Fetch chats
  useEffect(() => {
    if (!user?._id) return; 
    const getChatsData = async () => {
      try {
        const { data } = await userChats(user._id);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChatsData();
  }, [user?._id]);

  // Fetch followings and followers
  useEffect(() => {
    if (!user?._id) return; 
    const fetchFollowingAndFollowers = async () => {
      try {
       // const followingData = await getFollowingUsers(user._id);
        const followersData = await getFollowersUsers(user._id);
        console.log(followersData);
     //   setFollowings(Array.isArray(followingData.data) ? followingData.data : []);
        setFollowers(Array.isArray(followersData.data) ? followersData.data : []);
      } catch (error) {
        console.error("Error fetching followings/followers data:", error);
        setFollowers([]);
      }
    };
    fetchFollowingAndFollowers();
  }, [user?._id]);

  // Connect to Socket.io
  useEffect(() => {
    if (!user?._id) return;

    socket.current = io("ws://localhost:8800");

    // Emit user join event
    socket.current.emit("new-user-add", user._id);

    // Receive updated online users
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  // Send message to socket server when `sendMessage` changes
  useEffect(() => {
    if (sendMessage) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    if (socket.current) {
      socket.current.on("receive-message", (data) => {
        setReceivedMessage(data);
      });
    }

    // Clean up to avoid duplicate listeners
    return () => {
      socket.current.off("receive-message");
    };
  }, [currentChat]);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    return onlineUsers.some((onlineUser) => onlineUser.userId === chatMember);
  };

  const checkOnlineFStatus = (follower) => {
    return onlineUsers.some((onlineUser) => onlineUser.userId === follower._id);
  };

  // Start or continue a chat
  const startNewChat = async (receiverId) => {
    const existingChat = chats.find((chat) => chat.members.includes(receiverId));
    
    if (!existingChat) {
      try {
        const response = await createChat({ senderId: user._id, receiverId });
        setChats([...chats, response.data]);
        setCurrentChat(response.data);
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    } else {
      setCurrentChat(existingChat);
    }
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setCurrentChat(chat)}
              >
                <Conversation
                  data={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>

          <h3>Your Followers</h3>
          <div className="User-list">
            {followers.map((follower) => (
              <div key={follower._id} className="User-item" onClick={() => startNewChat(follower._id)}>
                <ChatFollowers
                  data={follower}
                  online={checkOnlineFStatus(follower)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons />
        </div>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
