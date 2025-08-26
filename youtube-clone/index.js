const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Sample video data
let videos = [
    {
        id: 1,
        title: "Welcome to AKTube!",
        thumbnail: "https://via.placeholder.com/480x270/ff6b6b/ffffff?text=Welcome+Video",
        uploader: "AKTube",
        views: 1000,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
        id: 2,
        title: "Sample Tech Video",
        thumbnail: "https://via.placeholder.com/480x270/4ecdc4/ffffff?text=Tech+Video",
        uploader: "TechChannel",
        views: 2500,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    }
];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/videos', (req, res) => {
    res.json(videos);
});

app.get('/api/videos/:id', (req, res) => {
    const video = videos.find(v => v.id === parseInt(req.params.id));
    if (video) {
        res.json(video);
    } else {
        res.status(404).json({ error: 'Video not found' });
    }
});

app.listen(port, () => {
    console.log(`🚀 AKTube server running on port ${port}`);
    console.log(`📺 Features: Video streaming, responsive design, API endpoints`);
});
