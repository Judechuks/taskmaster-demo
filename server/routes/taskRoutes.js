// For Implementing routes for creating, reading, updating, and deleting tasks.
const express = require("express");
const Task = require("../models/Task"); // Import the Task model

const router = express.Router();

// Middleware to check for JWT in Authorization header
const authMiddleware = require("../middleware/authMiddleware");
router.use(authMiddleware);

// Create a new task (POST /tasks)
router.post("/", async (req, res) => {
  const { title, description, deadline, priority, userId } = req.body;

  try {
    // Create a new task instance with provided data
    const newTask = new Task({
      title,
      description,
      deadline,
      priority,
      userId,
    });

    // Save the task to the database and respond with success message
    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully!", task: newTask });
  } catch (error) {
    res.status(500).json({ error: "Error creating task." });
  }
});

// Get all tasks (GET /tasks)
router.get("/", async (req, res) => {
  const { page = 1, limit = 10, priority, status } = req.query; // Include both status and priority parameter

  try {
    const query = {};
    if (status) {
      query.status = status; // Filter by status if provided 'pending' or 'done'
    }

    if (priority) {
      query.priority = priority; // Filter by priority if provided 'low' 'medium' or 'high'
    }

    const totalTasks = await Task.countDocuments(query); // Get total number of tasks matching the query
    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalUncompleted = await Task.countDocuments({ status: "pending" });
    const totalCompleted = await Task.countDocuments({ status: "done" });

    res.status(200).json({
      tasks,
      totalTasks, // Include total tasks count in response
      totalUncompleted,
      totalCompleted,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks." });
  }
});

// Search tasks by title or description
router.get("/search", async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;

  try {
    let tasks;
    const taskQuery = {}; // Initialize an empty query object
    if (query) {
      taskQuery.$or = [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive search in title
        { description: { $regex: query, $options: "i" } }, // Case-insensitive search in description
      ];
    }
    // Fetch tasks based on the query and apply pagination
    tasks = await Task.find(taskQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalTasks = await Task.countDocuments(taskQuery); // Count total tasks matching the query
    res.status(200).json({ tasks, totalTasks }); // Return tasks and total count
  } catch (error) {
    console.error("Error searching tasks:", error);
    res.status(500).json({ error: "Error searching tasks." });
  }
});

// mark task as completed
router.put("/:id/complete", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status: "done" },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found." });
    }
    res
      .status(200)
      .json({ message: "Task marked as done!", task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: "Error updating task status." });
  }
});

// unmark completed task as uncompleted
router.put("/:id/pending", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status: "pending" },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found." });
    }
    res
      .status(200)
      .json({ message: "Task marked as pending!", task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: "Error updating task status." });
  }
});

// Update a task by ID (PUT /tasks/:id)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, priority } = req.body;

  try {
    // Find the task by ID and update it with provided data
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, deadline, priority },
      { new: true }
    ); // Return the updated task

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully!", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Error updating task." });
  }
});

// Delete a task by ID (DELETE /tasks/:id)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the task by ID and delete it from the database
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Error deleting task." });
  }
});

module.exports = router; // Export the router to use in index.js
