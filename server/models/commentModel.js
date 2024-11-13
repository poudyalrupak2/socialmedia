import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });
const CommentModel = mongoose.model("Comment", commentSchema);
export default CommentModel;
