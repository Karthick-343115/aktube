class YouTubeClone {
    constructor() {
        this.videos = [
            {
                id: 1,
                title: "Welcome to AKTube!",
                thumbnail: "https://via.placeholder.com/480x270/ff6b6b/ffffff?text=Welcome+Video",
                uploader: "AKTube",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
        ];
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
            const card = document.createElement('div');
            card.className = 'video-card';
            card.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="video-details">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-uploader">${video.uploader}</p>
                </div>
            `;
            
            card.addEventListener('click', () => this.playVideo(video));
            grid.appendChild(card);
        });
    }

    playVideo(video) {
        document.getElementById('homeView').style.display = 'none';
        document.getElementById('playerView').style.display = 'block';
        
        const player = document.getElementById('videoPlayer');
        const title = document.getElementById('videoTitle');
        
        player.src = video.videoUrl;
        title.textContent = video.title;
        
        player.play();
    }

    bindEvents() {
        // Add event listeners for search, upload, etc.
        document.getElementById('uploadBtn').addEventListener('click', () => {
            alert('Upload feature coming soon!');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new YouTubeClone();
});
