import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("image", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "https://civicsense-backend-wdeb.onrender.com/predict",
      form,
      { headers: form.getHeaders() }
    );

    fs.unlinkSync(req.file.path); // delete temp image

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "AI prediction failed" });
  }
});

export default router;
