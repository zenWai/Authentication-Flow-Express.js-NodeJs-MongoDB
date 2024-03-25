// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const yup = require('yup');
const User = require('./models/user.model');
const authMiddleware = require('./authMiddleware');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.log(`This request[${key}] is sanitized`, req);
    },
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log("Successfully connected to MongoDB!");
});

const registrationSchema = yup
  .object()
  .shape({
    firstName: yup.string().trim().required(),
    lastName: yup.string().trim().required(),
    age: yup
      .number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? undefined : value
      )
      .required()
      .positive()
      .integer()
      .max(120),
    gender: yup
      .string()
      .oneOf(['male', 'female', 'other'])
      .required(),
    email: yup
      .string()
      .trim()
      .email()
      .required()
      .matches(/^[\S]+$/)
      .transform(value => value.toLowerCase()),
    username: yup
      .string()
      .trim()
      .required()
      .min(4)
      .matches(/^[\S]+$/)
      .transform(value => value.toLowerCase()),
    password: yup
      .string()
      .required()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.+-])[^\s]+$/,
      ),
  }).required();

const loginSchema = yup.object().shape({
  username: yup.string().trim().min(4).required().matches(/^[\S]+$/).transform(value => value.toLowerCase()),
  password: yup.string().required().matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.+-])[^\s]+$/,
  ),
});

// User registration route
app.post('/register', async (req, res) => {
  try {
    // Validate the request body
    const validatedData = await registrationSchema.validate(req.body, {
      abortEarly: false,
    });

    // Check if the email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email: validatedData.email }, { username: validatedData.username }],
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create a new user
    const newUser = new User({
      ...validatedData,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });

  }
});

// User authentication (login) route
app.post('/login', async (req, res) => {
  try {
    const validatedData = await loginSchema.validate(req.body, {
      abortEarly: false,
    });
    const { username, password } = validatedData;
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate a JSON Web Token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/validate-token', authMiddleware(), (req, res) => {
  // If the token is valid, authMiddleware will allow reaching this point
  res.json({ valid: true, user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});