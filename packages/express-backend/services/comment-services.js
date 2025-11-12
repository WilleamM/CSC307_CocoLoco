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

export default {
  createComment,
  addCommentToPost,
};