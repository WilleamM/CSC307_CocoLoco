import mongoose from 'mongoose';
// brew services start mongodb-community
// brew services stop mongodb-community

const UserSchema = new mongoose.Schema(
  {
    //indentity
    userName: {
      // @willeam
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      min_length: 3,
      max_length: 30,
      // TODO: Add userName parsing (only contain . _ -)dwadwwd
    },

    password: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      min_length: 3,
      max_length: 20
    },

    displayName: {
      // Willeam Mendez
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    
    // added a posts, followers, following for now
    posts: { //might be an array in the future if they have more posts
      type: Number,
      default: 0
    },

    followers: {
      type: Number,
      default: 0,
    },

    following: {
      type: Number,
      default: 0,
    },

    // Profile info
    bio: { type: String, default: '', max_length: 500 },
    avatarUrl: { type: String, default: 'cry.png' }, // TODO: add url handling

    // Lists
    friendIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    ],
    groupIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Group', index: true },
    ],

    //TODO: post visibility? (Not mandatory)
    defaultPostVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'friends',
    },
  },
  { collection: 'users', timestamps: true }
);

UserSchema.index({ displayName: 'text' }); // allows for non exact searches in future search bar
UserSchema.index({ userName: 'text' }); // ^^

UserSchema.index({ createdAt: -1 }); // show newest users fast

const User = mongoose.model('User', UserSchema);
export default User;
