
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Serve the professional frontend from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Temporary in-memory task storage
let tasks = [];
let nextId = 1;

// GET: Fetch all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// GET: Fetch a task by ID
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

// POST: Create a new task
app.post("/tasks", (req, res) => {
  const { title, description, completed, priority, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: "Task title is required",
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description || "",
    completed: completed ?? false,
    priority: priority || "medium",
    dueDate: dueDate || "",
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// PUT: Update an existing task
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { title, description, completed, priority, dueDate } = req.body;

  tasks[index] = {
    ...tasks[index],
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description }),
    ...(completed !== undefined && { completed }),
    ...(priority !== undefined && { priority }),
    ...(dueDate !== undefined && { dueDate }),
  };

  if (!tasks[index].title) {
    return res.status(400).json({
      message: "Task title cannot be empty",
    });
  }

  res.json(tasks[index]);
});

// DELETE: Delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const deletedTask = tasks.splice(index, 1)[0];

  res.json({
    message: "Task deleted successfully",
    task: deletedTask,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`TaskFlow server running at http://localhost:${PORT}`);
});
