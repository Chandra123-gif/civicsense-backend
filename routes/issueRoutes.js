import express from "express";
import { createIssue, myIssues } from "../controllers/issueController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createIssue);
router.get("/my", authMiddleware, myIssues);

export default router;


