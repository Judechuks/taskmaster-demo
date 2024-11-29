const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config/db"); // Import database connection
const frontendUrl = "https://taskmaster-demo.vercel.app";

const authRoutes = require("./routes/auth"); // Import authentication routes
const taskRoutes = require("./routes/taskRoutes"); // Import task routes

const app = express();

// CORS configuration
const corsOptions = {
  origin: `${frontendUrl}`, // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions)); // Enable CORS with specified options
app.use(bodyParser.json()); // Parse JSON request bodies

// Middleware to check for JWT in Authorization header
const jwt = require("jsonwebtoken");

// Middleware for JWT authentication
app.use(async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: `Unauthorized ${token}` });

  try {
    const decoded = jwt.verify(
      token,
      "V32PJUakuHKtVfxl2wFazDD+ItEddSwUzHnSzhWeins="
    );
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Defines info for the root
app.get("/", (req, res) => {
  res.json({ info: "TaskMaster API" });
});
// Defines authentication routes for registration and login
app.use("/api/auth", authRoutes);
// Defines task routes for CRUD operations on tasks
app.use("/api/tasks", taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({ error: err.message });
});

// Export the app for Vercel to use
module.exports = app;

// Starting the server on specified port (default is 3000)
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`); // Log server start message
// });
