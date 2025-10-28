import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // allows program to read .env file
mongoose.set('debug', true);

mongoose
  .connect(process.env.MONGO_URI, { dbName: 'csc307_LocoBookDB' })
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

export default mongoose;
