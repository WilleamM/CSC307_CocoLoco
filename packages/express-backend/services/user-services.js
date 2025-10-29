import './db-connection.js';
import User from '../schema/user.js';

function getAllUsers() {
  return User.find().lean();
}

function findUserById(id) {
  return User.findById(id).lean();
}

function addUser(new_user) {
  return User.create(new_user);
}

function deleteUserById(id) {
  return User.findByIdAndDelete(id);
}

function updateUser(id, updates){ //this will update the User data if needed 
  return userModel.findByIdAndUpdate(id, updates, {new: true});
}

export default {
  addUser,
  getAllUsers,
  findUserById,
  deleteUserById,
  updateUser,
};
