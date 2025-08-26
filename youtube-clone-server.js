const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only video files
    const allowedMimes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
});

// In-memory storage for video metadata (in production, use a database)
let videos = [
  {
    id: 1,
    title: "Sample Tech Video",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "3:45",
    views: 1200,
    uploader: "TechChannel",
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 2,
    title: "JavaScript Tutorial",
    thumbnail: "https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
    duration: "12:30",
    views: 5400,
    uploader: "CodeMaster",
    uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: 3,
    title: "React Components Guide",
    thumbnail: "https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg",
    duration: "8:15",
    views: 3100,
    uploader: "ReactPro",
    uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: 4,
    title: "Web Development Basics",
    thumbnail: "https://img.youtube.com/vi/UB1O30fR-EE/maxresdefault.jpg",
    duration: "15:22",
    views: 8700,
    uploader: "WebDev101",
    uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
];

// Routes

// Get all videos
app.get("/api/videos", (req, res) => {
  const { search } = req.query;
  let filteredVideos = videos;

  if (search) {
    filteredVideos = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.uploader.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filteredVideos);
});

// Get single video by ID
app.get("/api/videos/:id", (req, res) => {
  const videoId = parseInt(req.params.id);
  const video = videos.find((v) => v.id === videoId);

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  // Increment view count
  video.views += 1;

  res.json(video);
});

// Upload video
app.post("/api/upload", upload.single("video"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Create new video entry
    const newVideo = {
      id: videos.length + 1,
      title: title,
      description: description || "",
      thumbnail:
        "https://via.placeholder.com/320x180/000000/FFFFFF/?text=" +
        encodeURIComponent(title),
      duration: "0:00", // In production, calculate from actual video
      views: 0,
      uploader: "User", // In production, get from authenticated user
      uploadDate: new Date().toISOString(),
      videoUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
    };

    videos.push(newVideo);

    res.json({
      message: "Video uploaded successfully!",
      video: newVideo,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

// Stream video with range support
app.get("/api/stream/:filename", (req, res) => {
  const filename = req.params.filename;
  const videoPath = path.join(__dirname, "uploads", filename);

  // Check if file exists
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: "Video not found" });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // Handle range requests for video streaming
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    // Send entire file
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// Delete video
app.delete("/api/videos/:id", (req, res) => {
  const videoId = parseInt(req.params.id);
  const videoIndex = videos.findIndex((v) => v.id === videoId);

  if (videoIndex === -1) {
    return res.status(404).json({ error: "Video not found" });
  }

  const video = videos[videoIndex];

  // Delete file if it's a user upload
  if (video.filename) {
    const filePath = path.join(__dirname, "uploads", video.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // Remove from videos array
  videos.splice(videoIndex, 1);

  res.json({ message: "Video deleted successfully" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 100MB." });
    }
  }

  console.error("Error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`YouTube Clone server running on port ${port}`);
  console.log(`Visit http://localhost:${port} to view the application`);
  console.log(`API endpoints available at http://localhost:${port}/api`);
});

module.exports = app;
