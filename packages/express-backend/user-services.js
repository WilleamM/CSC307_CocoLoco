import mongoose from "mongoose";
import userModel from "./user.js";

import dotenv from 'dotenv';
dotenv.config(); // allows program to read .env file


mongoose.set("debug", true);

// uses the URI from the .env file
mongoose
  .connect(process.env.MONGO_URI, { dbName: 'csc307' })
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((error) => console.log("Error connection to MongoDB Atlas: ",error));


function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  } else if (name && job){ // first addition
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

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function deleteUserById(id){
  return userModel.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUserById,
};