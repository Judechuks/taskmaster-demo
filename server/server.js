const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config/db"); // Import database connection

const authRoutes = require("./routes/auth"); // Import authentication routes
const taskRoutes = require("./routes/taskRoutes"); // Import task routes

const app = express();

// CORS configuration
const corsOptions = {
  origin: "https://taskmaster-demo.vercel.app", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); // Parse JSON request bodies

// Middleware to check for JWT in Authorization header (example)
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get token from header

  if (!token) return res.sendStatus(401); // No token, unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token invalid, forbidden
    req.user = user; // Attach user info to request object
    next(); // Proceed to next middleware or route handler
  });
}

// Protect task routes with JWT authentication middleware
app.use("/api/tasks", authenticateToken, taskRoutes);

// Define authentication routes for registration and login
app.use("/api/auth", authRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message }); // Respond with error details
});

// Starting the server on specified port (default is 3000)
/* const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log server start message
}); */

// Export the app for Vercel to use
module.exports = app;
