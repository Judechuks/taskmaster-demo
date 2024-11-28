const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

// Connecting to MongoDB using Mongoose with connection string from .env file
mongoose
  .connect(process.env.MONGOOSE_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose; // Export mongoose instance for use in models and controllers
