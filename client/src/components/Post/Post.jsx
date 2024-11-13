import React, { useState, useEffect } from "react";
import "./Post.css";
import CommentIcon from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost, getCommentsByPostId, addComment } from "../../api/PostsRequests"; // Import API functions
import { useSelector } from "react-redux";

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);
  const [comments, setComments] = useState([]); // Initialize as empty array to store fetched comments
  const [newComment, setNewComment] = useState(""); // New comment text
  const [showAllComments, setShowAllComments] = useState(false); // Toggle to show more comments

  // Fetch existing comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getCommentsByPostId(data._id);
        setComments(response.data); // Set fetched comments to state
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [data._id]);

  // Handle like/unlike
  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  // Handle comment input change
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return; // Don't submit empty comments

    const commentData = {
      postId: data._id,
      userId: user._id,
      text: newComment,
    };

    try {
      await addComment(commentData);
      setComments([...comments, { userId: user._id, text: newComment }]); // Update comments list with the new comment
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Toggle to show more comments
  const toggleShowAllComments = () => {
    setShowAllComments((prev) => !prev);
  };

  return (
    <div className="Post">
      <div className="detail">
        <span>
          <b>{data.name} </b>
        </span>
        <span>{data.desc}</span>
      </div>
      <img
        src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""}
        alt=""
      />

      <div className="postReact">
        <img
          src={liked ? Heart : NotLike}
          alt="Like Icon"
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />
        <img src={CommentIcon} alt="Comment Icon" />
        <img src={Share} alt="Share Icon" />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>

      {/* Comments Section */}
      <div className="commentsSection">
        <div className="existingComments">
          {(showAllComments ? comments : comments.slice(0, 3)).map((comment, index) => (
            <div key={index} className="comment">
              <b>{comment.userId._id === user._id ? "You" : comment.userId.username}:</b> {comment.text}
            </div>
          ))}
          {comments.length > 3 && (
            <button className="showMoreComments" onClick={toggleShowAllComments}>
              {showAllComments ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        <form onSubmit={handleCommentSubmit} className="commentForm">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={handleCommentChange}
            className="commentInput"
          />
          <button type="submit" className="commentButton">Post</button>
        </form>
      </div>
    </div>
  );
};

export default Post;
