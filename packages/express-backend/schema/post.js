import mongoose from 'mongoose';
// brew services start mongodb-community
// brew services stop mongodb-community

const PostSchema = new mongoose.Schema(
  {
    // post creator
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    author: {
      // author username
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    // Post Content
    title: { type: String, trim: true, maxlength: 140 },
    body: { type: String, required: true, trim: true, maxlength: 5000 },
    //media: { type: [MediaSchema], default: [] },

    // visibility
    visibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'friends',
      index: true,
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: [] },
    ],

    publishedAt: { type: Date, default: Date.now, index: true },
  },
  { collection: 'posts', timestamps: true }
);
// allows for text search for title/content
PostSchema.index({ title: 'text', content: 'text' });

// feed filters to easily change posts visibility
PostSchema.index({ visibility: 1, status: 1, publishedAt: -1 });

const Post = mongoose.model('Post', PostSchema);
export default Post;
