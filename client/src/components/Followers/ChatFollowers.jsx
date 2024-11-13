import React, { useState } from "react";
import { useEffect } from "react";

const ChatFollowers = ({ data, online }) => {
  const [userData, setUserData] = useState(data);

  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
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
          <div className="name" style={{ fontSize: "0.8rem" }}>
            <span>{userData?.firstname} {userData?.lastname}</span>
            <span style={{ color: online ? "#51e200" : null }}>
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default ChatFollowers;
