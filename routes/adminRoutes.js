import express from "express";
import Issue from "../models/Issue.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// ✅ Get all issues (Admin only)
router.get("/issues", protect, adminOnly, async (req, res) => {
  try {
    const issues = await Issue.find().populate("user", "email");
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch issues" });
  }
});

// ✅ Update issue status (Admin only)
router.put("/issues/:id", protect, adminOnly, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    issue.status = req.body.status;
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

export default router;   // ✅ THIS LINE WAS MISSING

