const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config/db"); // Import database connection

const authRoutes = require("./routes/auth"); // Import authentication routes
const taskRoutes = require("./routes/taskRoutes"); // Import task routes

const app = express();

app.use(
  cors({
    origin: "https://taskmaster-demo.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(bodyParser.json()); // Parse JSON request bodies

// Define authentication routes for registration and login
app.use("/api/auth", authRoutes);
app.use("/api/auth", taskRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message }); // Respond with error details
});

// Export the app for Vercel to use
module.exports = app;
