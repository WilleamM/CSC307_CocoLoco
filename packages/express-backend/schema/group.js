import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema(
  {
    groupName: {
      // @Cal Poly Kite-Flying Club
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      min_length: 3,
      max_length: 30,
    },

    visibility: {
      type: String,
      enum: ['public', 'invite-only', 'private'],
      default: 'public',
      index: true,
    },

    password: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      min_length: 3,
      max_length: 30,
    },

    // Group info
    description: { type: String, default: '', max_length: 500 },
    iconUrl: { type: String, default: '' }, // TODO: add url handling

    // Lists
    userIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },
    ],

    ownerIds: [
      // Who can change the name, visibility, and delete the group.
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },
    ],
  },
  { collection: 'groups', timestamps: true }
);

GroupSchema.index({ groupName: 'text', description: 'text' });
GroupSchema.index({ description: 'text' });

const Group = mongoose.model('Group', GroupSchema);
export default Group;
