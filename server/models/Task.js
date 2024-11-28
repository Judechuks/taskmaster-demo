const mongoose = require("mongoose");

// Defines the Task schema with required fields and validation rules
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
  status: { type: String, enum: ["pending", "done"], default: "pending" }, // Task status
});

// Export Task model based on the schema defined above
module.exports = mongoose.model("Task", taskSchema);
