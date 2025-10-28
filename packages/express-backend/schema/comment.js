import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    authorHandle: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { collection: 'comments', timestamps: true }
);

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
