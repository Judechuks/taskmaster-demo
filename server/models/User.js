const mongoose = require("mongoose"); // Import Mongoose

// Define User schema with required fields and validation rules
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Export User model based on the schema defined above
module.exports = mongoose.model("User", userSchema);
