const Task = require("../models/taskModel");

exports.createTask = async (req, res) => {
  const { title } = req.body;

  const task = await Task.create({
    title,
    user: req.user._id // 🔥 from JWT middleware
  });

  res.status(201).json({
    status: "success",
    data: {
      task
    }
  });
};

exports.getMyTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks
    }
  });
};
