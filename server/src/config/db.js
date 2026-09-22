import mongoose from 'mongoose';
import env from './env.js';

async function connectDb() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  console.log('MongoDB connected');
}

export default connectDb;
