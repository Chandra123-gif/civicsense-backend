const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from backend/.env explicitly
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database connection
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set. Check backend/.env');
} else {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));

// Ensure uploads folder exists and serve it statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Cleanup helper: remove files older than `maxAgeDays` from uploads
function cleanupUploads(maxAgeDays = 30) {
  try {
    const files = fs.readdirSync(uploadsDir);
    const now = Date.now();
    const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      try {
        const stat = fs.statSync(filePath);
        if ((now - stat.mtimeMs) > maxAge) {
          fs.unlinkSync(filePath);
          console.log('Deleted old upload:', filePath);
        }
      } catch (e) {
        console.error('Error checking upload file:', filePath, e.message);
      }
    });
  } catch (err) {
    console.error('Failed to cleanup uploads:', err.message);
  }
}

// Run cleanup on startup and schedule daily
cleanupUploads(30);
setInterval(() => cleanupUploads(30), 24 * 60 * 60 * 1000);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
