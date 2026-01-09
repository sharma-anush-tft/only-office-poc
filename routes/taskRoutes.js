const express = require("express");
const taskController = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All task routes are protected
router.use(protect);

router.post("/", taskController.createTask);
router.get("/", taskController.getMyTasks);

module.exports = router;
