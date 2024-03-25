// cleanupDbTestUser.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../../src/models/user.model.js';
dotenv.config();

async function cleanupDbTestUser(email) {
  console.log('cleanupDatabase STARTED');
  let messages = [];
  if (!email) {
    console.log('no email provided', email);
    return [];
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    messages.push('Connected to MongoDB');

    const result = await User.deleteOne({ email });
    console.log(`Deleted ${result.deletedCount} user with email ${email}`);
    messages.push(`Deleted ${result.deletedCount} user with email ${email}`);
  } catch (error) {
    messages.push(`Error cleaning up database: ${error.message}`);
    console.error('Error cleaning up database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    messages.push('Disconnected from MongoDB');
  }

  return messages;
}

export default cleanupDbTestUser;
