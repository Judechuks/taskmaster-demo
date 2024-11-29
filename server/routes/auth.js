const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model

const router = express.Router();
const saltRounds = 10; // Number of salt rounds for bcrypt

// Registration endpoint for creating new users
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body; // Destructuring data from request body

  try {
    // checking if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds); // Hashing the password
      const newUser = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      }); // Creating a new user instance

      await newUser.save(); // Save user to database
      res.status(201).json({ message: "User registered successfully" }); // Respond with success message
      // const savedUser = await newUser.save(); // Save user to database
      // res.status(201).json(savedUser); // Respond with user's details
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

// Login Route for authenticating users
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Destructure email and password from request body

  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    // Compare provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate a JWT token with user ID as payload and send it back to client
    const token = jwt.sign(
      {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    }); // Sending token back to client for authentication
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error logging in." });
  }
});

module.exports = router; // Exporting authentication routes for use in server.js
