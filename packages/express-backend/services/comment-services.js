import './db-connection.js';
import Comment from '../schema/comment.js';
import Post from '../schema/post.js';

function createComment({ postId, authorId, authorHandle, content }) {
  return Comment.create({
    postId,
    authorId,
    authorHandle,
    content,
  });
}

function addCommentToPost(postId, commentId) {
  return Post.findByIdAndUpdate(
    postId,
    { $addToSet: { comments: commentId } },
    { new: true }
  ).lean();
}

function getCommentsByPostId(postId) { // sorts by newest
  return Comment.find({ postId }).sort({ createdAt: 1 }).lean();
}

function getCommentById(commentId) {
  return Comment.findById(commentId).lean();
}

function deleteCommentById(commentId) {
  return Comment.findByIdAndDelete(commentId);
}

// deletes all comments from a single post, for when you need to delete a post
function deleteManyByPostId(postId) {
  return Comment.deleteMany({ postId });
}

export default {
  createComment,
  addCommentToPost,
  getCommentsByPostId,
  getCommentById,
  deleteCommentById,
  deleteManyByPostId,
};
