import express from "express";
import { createIssue, myIssues } from "../controllers/issueController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import upload from "../middleware/UploadMiddleware.js";

const router = express.Router();

router.post("/", AuthMiddleware, upload.single("image"), createIssue);
router.get("/my", AuthMiddleware, myIssues);

export default router;
