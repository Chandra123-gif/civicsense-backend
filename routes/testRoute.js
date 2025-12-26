import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "CivicSense AI Backend Working! 🚀" });
});

export default router;
