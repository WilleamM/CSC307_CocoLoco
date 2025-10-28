import mongoose from './db-connection.js';
import User from '../schema/user.js';


function getAllUsers(){
  return User.find().lean();
}

function findUserById(id) {
  return User.findById(id).lean();
}

function addUser(new_user) {
  /*
  const userToAdd = new User(user);
  const promise = userToAdd.save();
  return promise;
  */
  // same as above just faster
  return User.create(new_user);
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
