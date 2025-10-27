import mongoose from 'mongoose';
import userModel from './user.js';

import dotenv from 'dotenv';
dotenv.config(); // allows program to read .env file

mongoose.set('debug', true);

// uses the URI from the .env file
mongoose
  .connect(process.env.MONGO_URI, { dbName: 'csc307' })
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((error) => console.log('Error connection to MongoDB Atlas: ', error));

function getPosts(author = undefined, date = undefined, search_terms = []) {
  // Function Notes: Author and Date are bundled here to prevent code reusage during search of author, date, and terms.

  let promise;

  // $regex : Query operator for a single term
  // 'i' : Makes the query non-case-sensitive
  const searchTermConditions = search_terms.map((term) => ({
    description: { $regex: term, $options: 'i' },
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
    queryConditions.date = date;
  }

  promise = postModel.find(queryConditions);
  return promise;
}

function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  } else if (name && job) {
    // first addition
    promise = userModel.find({ name, job });
  }
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function deleteUserById(id) {
  return userModel.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  getPosts,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUserById,
};
