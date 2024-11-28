const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config/db"); // Import database connection
const apiUrl = "https://pro-taskmaster.vercel.app";

const authRoutes = require("./routes/auth"); // Import authentication routes
const taskRoutes = require("./routes/taskRoutes"); // Import task routes

const app = express();

// CORS configuration
const corsOptions = {
  origin: "*", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.options("", cors(corsOptions));
app.use(cors(corsOptions)); // Enable CORS with specified options
app.use(bodyParser.json()); // Parse JSON request bodies

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
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Export the app for Vercel to use
module.exports = app;

// Starting the server on specified port (default is 3000)
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`); // Log server start message
// });
