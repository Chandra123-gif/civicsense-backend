import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import Issue from "../models/issue.js";


export const createIssue = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { description } = req.body;
    const imagePath = req.file.path;

    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    const aiResponse = await axios.post(
      "https://civicsense-backend-wdeb.onrender.com/predict",
      formData,
      { headers: formData.getHeaders() }
    );

export const myIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


