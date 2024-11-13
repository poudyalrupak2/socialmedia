import CommentModel from "../models/commentModel.js"; // Use `import` instead of `require`

// Create a new comment
export const createComment = async (req, res) => {
    try {
      // Create a new comment without manually setting _id to avoid duplicates
      const {userId, postId, text } = req.body;

      const comment = (new CommentModel({
        userId,
        postId,
        text,
      }));
      const savedComment = await comment.save();
      res.status(201).json(savedComment);
    } catch (error) {
      console.error(error);
  
      // Check for MongoDB duplicate key error
      if (error.code === 11000) {
        res.status(400).json({ error: "Duplicate comment ID detected" });
      } else {
        res.status(500).json({ error: "Failed to create comment" });
      }
    }
  };

// Get all comments for a post
export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await CommentModel.find({ postId }).populate("userId", "username") // Populate specific fields from the User model
    .exec();; // Populate user details
    console.log(comments);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
