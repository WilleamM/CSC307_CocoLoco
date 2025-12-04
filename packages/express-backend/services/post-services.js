import './db-connection.js';
import Post from '../schema/post.js';

function dayRange(dateString) {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return undefined;

  const start = new Date(parsed);
  start.setHours(0, 0, 0, 0);
  const end = new Date(parsed);
  end.setHours(23, 59, 59, 999);

  return { $gte: start, $lte: end };
}

function buildBaseQuery(author, date, authorId) {
  const query = {};

  if (author) {
    query.author = String(author).toLowerCase();
  }

  if (authorId) {
    query.authorId = authorId;
  }

  if (date) {
    query.publishedAt = dayRange(date) ?? date;
  }

  return query;
}

function getPostsNoSearchTerms(author = undefined, date = undefined, authorId) {
  const query = buildBaseQuery(author, date, authorId);
  return Post.find(query).sort({ publishedAt: -1 }).lean();
}

function getPosts(
  author = undefined,
  date = undefined,
  search_terms = [],
  authorId
) {
  const queryConditions = buildBaseQuery(author, date, authorId);

  if (typeof search_terms === 'string') {
    search_terms = [search_terms];
  }

  const searchTermConditions = (Array.isArray(search_terms) ? search_terms : [])
    .filter((term) => term && String(term).trim().length > 0)
    .map((term) => ({
      body: { $regex: term, $options: 'i' },
    }));

  if (searchTermConditions.length > 0) {
    queryConditions.$and = searchTermConditions;
  }

  return Post.find(queryConditions).sort({ publishedAt: -1 }).lean();
}

function createPost({
  authorId,
  author,
  title = '',
  body,
  visibility = 'friends',
}) {
  return Post.create({ authorId, author, title, body, visibility });
}

// addPost mirrors createPost so routes can call either name
function addPost(postData) {
  return Post.create(postData);
}

function deletePostById(postId) {
  return Post.findByIdAndDelete(postId);
}

function pullCommentFromPost(postId, commentId) {
  return Post.findByIdAndUpdate(
    postId,
    { $pull: { comments: commentId } },
    { new: true }
  ).lean();
}

function findPostById(id) {
  return Post.findById(id).lean();
}

function getPostByFriendIds(authorIds = []) {
  if (!authorIds || authorIds.length === 0) {
    return Promise.resolve([]);
  }

  return Post.find({
    authorId: { $in: authorIds },
  })
    .sort({ publishedAt: -1 })
    .lean();
}

function findPostByIdForUpdate(id) {
  return Post.findById(id); // Returns Mongoose document (not lean) for updates
}

export default {
  getPosts,
  getPostsNoSearchTerms,
  createPost,
  deletePostById,
  pullCommentFromPost,
  findPostById,
  findPostByIdForUpdate,
  addPost,
  getPostByFriendIds,
};
