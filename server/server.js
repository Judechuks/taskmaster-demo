const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config/db"); // Import database connection
const apiUrl = "https://taskmaster-demo.vercel.app";

const authRoutes = require("./routes/auth"); // Import authentication routes
const taskRoutes = require("./routes/taskRoutes"); // Import task routes

const app = express();

// CORS configuration
const corsOptions = {
  origin: `"${apiUrl}"`, // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions)); // Enable CORS with specified options
app.use(bodyParser.json()); // Parse JSON request bodies

// Middleware to check for JWT in Authorization header
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get token from header

  if (!token) return res.sendStatus(401); // No token, unauthorized

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Token invalid, forbidden
    req.user = user; // Attach user info to request object
    next(); // Proceed to next middleware or route handler
  });
}

// Defines info for the root
app.get("/", (req, res) => {
  res.json({ info: "TaskMaster API" });
});
// Defines authentication routes for registration and login
app.use("/api/auth", authRoutes);
/* // Defines task routes for CRUD operations on tasks
app.use("/api/tasks", taskRoutes); */
// Protect task routes with JWT authentication middleware
app.use("/api/tasks", authenticateToken, taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({ error: "Something went wrong!" });
});

// Export the app for Vercel to use
module.exports = app;

// Starting the server on specified port (default is 3000)
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`); // Log server start message
// });
