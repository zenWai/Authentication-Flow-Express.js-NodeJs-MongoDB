// registerDbTestUser.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../../src/models/user.model.js';
dotenv.config();

async function registerDbTestUser(randomUser) {
  console.log('registerDbTestUser STARTED');
  let messages = [];

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    messages.push('Connected to MongoDB');

    // Check if a user with the same email or username already exists
    const existingUserEmail = await User.findOne({ email: randomUser.EMAIL_FIXED });
    const existingUserUsername = await User.findOne({
      username: randomUser.USERNAME_FIXED,
    });

    if (existingUserEmail || existingUserUsername) {
      const errorMessage = `User with email ${existingUserEmail ? existingUserEmail.email : ''} or username ${existingUserUsername ? existingUserUsername.username : ''} already exists.`;
      console.log(errorMessage);
      messages.push(errorMessage);
      return messages;
    }
    const newUser = new User({
      firstName: randomUser.firstName,
      lastName: randomUser.lastName,
      age: randomUser.age,
      gender: randomUser.gender,
      email: randomUser.EMAIL_FIXED,
      username: randomUser.USERNAME_FIXED,
      password: randomUser.password,
    });
    const result = await newUser.save();

    console.log(`Created user with email ${result.email}`);
    messages.push(`Created user with email ${result.email}`);
  } catch (error) {
    messages.push(`Error registering user: ${error.message}`);
    console.error('Error registering user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    messages.push('Disconnected from MongoDB');
  }

  return messages;
}

export default registerDbTestUser;
