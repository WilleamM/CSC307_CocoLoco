import './db-connection.js';
import Post from '../schema/post.js';

function getPostsNoSearchTerms(author = undefined, date = undefined) {
  const query = {};
  if (author) {
    query.author = String(author).toLowerCase();
  }
  if (date) {
    query.publishedAt = new Date(date);
  }
  return Post.find(query).lean();
}

function getPosts(author = undefined, date = undefined, search_terms = []) {
  // Function Notes: Author and Date are bundled here to prevent code reusage during search of author, date, and terms.

  let promise;

  if (typeof search_terms === 'string') {
    search_terms = [search_terms];
  }

  // $regex : Query operator for a single term
  // 'i' : Makes the query non-case-sensitive
  const searchTermConditions = search_terms.map((term) => ({
    body: { $regex: term, $options: 'i' },
  }));

  // $and : Query operator for many conditions (inclusive, aka. all must be fulfilled)
  // $or : Not used ; Query operator for many conditions (non-inclusive)
  let queryConditions = { $and: searchTermConditions };

  // Adds author to the query conditions
  if (author != undefined) {
    queryConditions.author = author;
  }
  // Adds date to the query conditions
  if (date != undefined) {
    queryConditions.publishedAt = date;
  }

  promise = Post.find(queryConditions);
  return promise;
}

export default {
  getPosts,
  getPostsNoSearchTerms,
};
