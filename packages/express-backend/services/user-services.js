import mongoose from './db-connection.js';
import User from '../schema/user.js';


function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = User.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  } else if (name && job) {
    // first addition
    promise = User.find({ name, job });
  }
  return promise;
}

function findUserById(id) {
  return User.findById(id);
}

function addUser(user) {
  const userToAdd = new User(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return User.find({ name: name });
}

function deleteUserById(id) {
  return User.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  deleteUserById,
};
