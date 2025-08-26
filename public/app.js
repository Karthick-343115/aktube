class YouTubeClone {
    constructor() {
        this.videos = [
            {
                id: 1,
                title: "Welcome to AKTube - Getting Started",
                thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                duration: "3:45",
                views: "1.2K views",
                uploader: "AKTube Official",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            },
            {
                id: 2,
                title: "JavaScript Tutorial for Beginners",
                thumbnail: "https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
                duration: "12:30",
                views: "5.4K views",
                uploader: "CodeMaster",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            },
            {
                id: 3,
                title: "React Components Guide",
                thumbnail: "https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg",
                duration: "8:15",
                views: "3.1K views",
                uploader: "ReactPro",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            },
            {
                id: 4,
                title: "Web Development in 2024",
                thumbnail: "https://img.youtube.com/vi/UB1O30fR-EE/maxresdefault.jpg",
                duration: "15:22",
                views: "8.7K views",
                uploader: "WebDev101",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
            },
            {
                id: 5,
                title: "Node.js Backend Development",
                thumbnail: "https://img.youtube.com/vi/TlB_eWDSMt4/maxresdefault.jpg",
                duration: "22:10",
                views: "12K views",
                uploader: "BackendMaster",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
            },
            {
                id: 6,
                title: "CSS Grid Layout Tutorial",
                thumbnail: "https://img.youtube.com/vi/jV8B24rSN5o/maxresdefault.jpg",
                duration: "18:45",
                views: "6.8K views",
                uploader: "CSSExpert",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
            }
        ];

        this.currentVideo = null;
        this.currentView = 'home';
        this.init();
    }

    init() {
        this.renderVideos();
        this.bindEvents();
    }

    renderVideos() {
        const grid = document.getElementById('videosGrid');
        grid.innerHTML = '';
        
        this.videos.forEach(video => {
            const card = this.createVideoCard(video);
            grid.appendChild(card);
        });
    }

    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-details">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-uploader">${video.uploader}</p>
                <div class="video-meta">
                    <span class="video-views">${video.views}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => this.playVideo(video));
        return card;
    }

    playVideo(video) {
        this.currentVideo = video;
        this.showPlayerView();
        this.loadVideoInPlayer(video);
        this.renderRecommendedVideos();
    }

    loadVideoInPlayer(video) {
        const player = document.getElementById('videoPlayer');
        const title = document.getElementById('videoTitle');
        const views = document.getElementById('videoViews');
        const uploader = document.getElementById('videoUploader');

        player.src = video.videoUrl;
        title.textContent = video.title;
        views.textContent = video.views;
        uploader.textContent = video.uploader;

        player.load();
        player.play().catch(e => console.log('Auto-play prevented'));
    }

    renderRecommendedVideos() {
        const container = document.getElementById('recommendedVideos');
        container.innerHTML = '';

        const recommended = this.videos.filter(v => v.id !== this.currentVideo.id);

        recommended.forEach(video => {
            const card = document.createElement('div');
            card.className = 'recommended-video-card';
            card.innerHTML = `
                <div class="recommended-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <span class="recommended-duration">${video.duration}</span>
                </div>
                <div class="recommended-details">
                    <h4 class="recommended-title">${video.title}</h4>
                    <p class="recommended-uploader">${video.uploader}</p>
                    <p class="recommended-views">${video.views}</p>
                </div>
            `;
            
            card.addEventListener('click', () => this.playVideo(video));
            container.appendChild(card);
        });
    }

    showHomeView() {
        document.getElementById('homeView').style.display = 'block';
        document.getElementById('playerView').style.display = 'none';
        this.currentView = 'home';
    }

    showPlayerView() {
        document.getElementById('homeView').style.display = 'none';
        document.getElementById('playerView').style.display = 'block';
        this.currentView = 'player';
    }

    bindEvents() {
        // Home button
        document.getElementById('homeBtn').addEventListener('click', () => {
            this.showHomeView();
        });

        // Upload button
        document.getElementById('uploadBtn').addEventListener('click', () => {
            alert('Upload feature coming soon! This will allow you to upload your own videos.');
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.renderVideos();
            return;
        }

        const filtered = this.videos.filter(video =>
            video.title.toLowerCase().includes(query.toLowerCase()) ||
            video.uploader.toLowerCase().includes(query.toLowerCase())
        );

        const grid = document.getElementById('videosGrid');
        grid.innerHTML = '';

        if (filtered.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1;">No videos found</p>';
            return;
        }

        filtered.forEach(video => {
            const card = this.createVideoCard(video);
            grid.appendChild(card);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new YouTubeClone();
});
