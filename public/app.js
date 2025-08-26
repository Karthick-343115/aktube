// YouTube Clone Application
class YouTubeClone {
  constructor() {
    this.videos = [
      {
        id: 1,
        title: "Sample Tech Video",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "3:45",
        views: "1.2K views",
        uploader: "TechChannel",
        uploadDate: "2 days ago",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        id: 2,
        title: "JavaScript Tutorial",
        thumbnail: "https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
        duration: "12:30",
        views: "5.4K views",
        uploader: "CodeMaster",
        uploadDate: "1 week ago",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      },
      {
        id: 3,
        title: "React Components Guide",
        thumbnail: "https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg",
        duration: "8:15",
        views: "3.1K views",
        uploader: "ReactPro",
        uploadDate: "3 days ago",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
      {
        id: 4,
        title: "Web Development Basics",
        thumbnail: "https://img.youtube.com/vi/UB1O30fR-EE/maxresdefault.jpg",
        duration: "15:22",
        views: "8.7K views",
        uploader: "WebDev101",
        uploadDate: "5 days ago",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      },
    ];

    this.currentVideo = null;
    this.filteredVideos = [...this.videos];
    this.isPlayerView = false;

    this.init();
  }

  init() {
    this.loadUploadedVideos();
    this.bindEvents();
    this.renderVideoGrid();
    this.setupKeyboardShortcuts();
  }

  loadUploadedVideos() {
    // Note: Local storage is disabled per strict instructions
    // This would normally load from localStorage
    // const uploaded = localStorage.getItem('uploadedVideos');
    // if (uploaded) {
    //     const parsedVideos = JSON.parse(uploaded);
    //     this.videos = [...this.videos, ...parsedVideos];
    // }
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    searchInput.addEventListener("input", (e) =>
      this.handleSearch(e.target.value)
    );
    searchBtn.addEventListener("click", () =>
      this.handleSearch(searchInput.value)
    );

    // Upload button
    document
      .getElementById("uploadBtn")
      .addEventListener("click", () => this.openUploadModal());

    // Modal events
    document
      .getElementById("modalClose")
      .addEventListener("click", () => this.closeUploadModal());
    document
      .getElementById("cancelUpload")
      .addEventListener("click", () => this.closeUploadModal());
    document
      .getElementById("uploadForm")
      .addEventListener("submit", (e) => this.handleUpload(e));

    // File input and drag/drop
    const fileInput = document.getElementById("fileInput");
    const uploadArea = document.getElementById("uploadArea");

    fileInput.addEventListener("change", (e) =>
      this.handleFileSelect(e.target.files[0])
    );

    uploadArea.addEventListener("dragover", (e) => this.handleDragOver(e));
    uploadArea.addEventListener("dragleave", (e) => this.handleDragLeave(e));
    uploadArea.addEventListener("drop", (e) => this.handleDrop(e));

    // Back button
    document
      .getElementById("backBtn")
      .addEventListener("click", () => this.showGridView());

    // Video player events
    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.addEventListener("loadedmetadata", () =>
      this.updateVideoStats()
    );
    videoPlayer.addEventListener("play", () => this.incrementViewCount());

    // Modal backdrop click
    document.getElementById("uploadModal").addEventListener("click", (e) => {
      if (e.target.id === "uploadModal") {
        this.closeUploadModal();
      }
    });

    // Action buttons (like/dislike)
    document.querySelectorAll(".action-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleActionButton(e));
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (this.isPlayerView) {
        const videoPlayer = document.getElementById("videoPlayer");

        switch (e.code) {
          case "Space":
            e.preventDefault();
            if (videoPlayer.paused) {
              videoPlayer.play();
            } else {
              videoPlayer.pause();
            }
            break;
          case "ArrowLeft":
            e.preventDefault();
            videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - 10);
            break;
          case "ArrowRight":
            e.preventDefault();
            videoPlayer.currentTime = Math.min(
              videoPlayer.duration,
              videoPlayer.currentTime + 10
            );
            break;
          case "KeyM":
            e.preventDefault();
            videoPlayer.muted = !videoPlayer.muted;
            break;
          case "KeyF":
            e.preventDefault();
            if (videoPlayer.requestFullscreen) {
              videoPlayer.requestFullscreen();
            }
            break;
        }
      }

      // Global shortcuts
      if (e.code === "Escape") {
        if (
          !document.getElementById("uploadModal").classList.contains("hidden")
        ) {
          this.closeUploadModal();
        } else if (this.isPlayerView) {
          this.showGridView();
        }
      }
    });
  }

  handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();

    if (searchTerm === "") {
      this.filteredVideos = [...this.videos];
    } else {
      this.filteredVideos = this.videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm) ||
          video.uploader.toLowerCase().includes(searchTerm)
      );
    }

    this.renderVideoGrid();
  }

  renderVideoGrid() {
    const videoGrid = document.getElementById("videoGrid");
    const noResults = document.getElementById("noResults");

    if (this.filteredVideos.length === 0) {
      videoGrid.innerHTML = "";
      noResults.classList.remove("hidden");
    } else {
      noResults.classList.add("hidden");
      videoGrid.innerHTML = this.filteredVideos
        .map((video) => this.createVideoCard(video))
        .join("");

      // Add click events to video cards
      videoGrid.querySelectorAll(".video-card").forEach((card, index) => {
        card.addEventListener("click", () =>
          this.playVideo(this.filteredVideos[index])
        );
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.playVideo(this.filteredVideos[index]);
          }
        });
        card.setAttribute("tabindex", "0");
      });
    }
  }

  createVideoCard(video) {
    return `
            <div class="video-card" data-video-id="${video.id}">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNDAgOTBMMTgwIDcwVjExMEwxNDAgOTBaIiBmaWxsPSIjQ0NDIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='">
                    <span class="video-duration">${video.duration}</span>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <div class="video-meta">
                        <div class="video-uploader">${video.uploader}</div>
                        <div class="video-stats">
                            <span class="views">${video.views}</span>
                            <span class="upload-date">${video.uploadDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  playVideo(video) {
    this.currentVideo = video;
    this.showPlayerView();

    // Update video information
    document.getElementById("videoTitle").textContent = video.title;
    document.getElementById("videoViews").textContent = video.views;
    document.getElementById("videoDate").textContent = video.uploadDate;
    document.getElementById("channelName").textContent = video.uploader;

    // Load video
    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.src = video.videoUrl;
    videoPlayer.load();

    // Show loading spinner
    this.showLoading();

    videoPlayer.addEventListener(
      "canplay",
      () => {
        this.hideLoading();
      },
      { once: true }
    );

    videoPlayer.addEventListener(
      "error",
      () => {
        this.hideLoading();
        this.showError("Error loading video. Please try again.");
      },
      { once: true }
    );
  }

  showPlayerView() {
    document.getElementById("gridView").classList.add("hidden");
    document.getElementById("playerView").classList.remove("hidden");
    this.isPlayerView = true;
    window.scrollTo(0, 0);
  }

  showGridView() {
    document.getElementById("playerView").classList.add("hidden");
    document.getElementById("gridView").classList.remove("hidden");
    this.isPlayerView = false;

    // Pause video if playing
    const videoPlayer = document.getElementById("videoPlayer");
    if (!videoPlayer.paused) {
      videoPlayer.pause();
    }

    window.scrollTo(0, 0);
  }

  updateVideoStats() {
    const videoPlayer = document.getElementById("videoPlayer");
    if (videoPlayer.duration) {
      const duration = this.formatDuration(videoPlayer.duration);
      // Update duration if needed
    }
  }

  incrementViewCount() {
    if (this.currentVideo) {
      // In a real app, this would update the backend
      // For demo purposes, we'll just increment locally
      const viewsText = this.currentVideo.views;
      const viewsNumber = parseFloat(viewsText.replace(/[^\d.]/g, ""));
      const unit = viewsText.includes("K")
        ? "K"
        : viewsText.includes("M")
        ? "M"
        : "";

      let newViews = viewsNumber + 0.1;
      if (newViews >= 1000 && unit === "") {
        newViews = newViews / 1000;
        this.currentVideo.views = `${newViews.toFixed(1)}K views`;
      } else {
        this.currentVideo.views = `${newViews.toFixed(1)}${unit} views`;
      }

      document.getElementById("videoViews").textContent =
        this.currentVideo.views;
    }
  }

  openUploadModal() {
    document.getElementById("uploadModal").classList.remove("hidden");
    document.getElementById("videoTitleInput").focus();
  }

  closeUploadModal() {
    document.getElementById("uploadModal").classList.add("hidden");
    this.resetUploadForm();
  }

  resetUploadForm() {
    document.getElementById("uploadForm").reset();
    document.getElementById("uploadProgress").classList.add("hidden");
    document.getElementById("progressFill").style.width = "0%";
    document.getElementById("progressText").textContent = "Uploading... 0%";
    document.getElementById("submitUpload").disabled = false;
  }

  handleFileSelect(file) {
    if (file && file.type.startsWith("video/")) {
      document.getElementById("videoTitleInput").value = file.name.replace(
        /\.[^/.]+$/,
        ""
      );
    }
  }

  handleDragOver(e) {
    e.preventDefault();
    document.getElementById("uploadArea").classList.add("drag-over");
  }

  handleDragLeave(e) {
    e.preventDefault();
    document.getElementById("uploadArea").classList.remove("drag-over");
  }

  handleDrop(e) {
    e.preventDefault();
    document.getElementById("uploadArea").classList.remove("drag-over");

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      document.getElementById("fileInput").files = files;
      this.handleFileSelect(files[0]);
    }
  }

  async handleUpload(e) {
    e.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const titleInput = document.getElementById("videoTitleInput");
    const descInput = document.getElementById("videoDescInput");

    if (!fileInput.files[0]) {
      alert("Please select a video file");
      return;
    }

    if (!titleInput.value.trim()) {
      alert("Please enter a video title");
      return;
    }

    // Show progress
    document.getElementById("uploadProgress").classList.remove("hidden");
    document.getElementById("submitUpload").disabled = true;

    // Simulate upload progress
    await this.simulateUpload();

    // Create new video object
    const newVideo = {
      id: Date.now(),
      title: titleInput.value.trim(),
      thumbnail:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMjFCOENEIi8+CjxwYXRoIGQ9Ik0xNDAgOTBMMTgwIDcwVjExMEwxNDAgOTBaIiBmaWxsPSIjRkZGIi8+Cjwvc3ZnPg==",
      duration: "0:00",
      views: "0 views",
      uploader: "You",
      uploadDate: "just now",
      videoUrl: URL.createObjectURL(fileInput.files[0]),
    };

    // Add to videos array
    this.videos.unshift(newVideo);
    this.filteredVideos = [...this.videos];

    // Note: Local storage is disabled per strict instructions
    // this.saveUploadedVideos();

    // Show success message
    alert("Video uploaded successfully!");

    // Close modal and refresh grid
    this.closeUploadModal();
    this.renderVideoGrid();
  }

  async simulateUpload() {
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      progressFill.style.width = `${i}%`;
      progressText.textContent = `Uploading... ${i}%`;
    }
  }

  saveUploadedVideos() {
    // Note: Local storage is disabled per strict instructions
    // const uploadedVideos = this.videos.filter(video => video.uploader === 'You');
    // localStorage.setItem('uploadedVideos', JSON.stringify(uploadedVideos));
  }

  handleActionButton(e) {
    const button = e.currentTarget;
    const isLike = button.classList.contains("like-btn");

    // Simple toggle effect
    if (button.classList.contains("active")) {
      button.classList.remove("active");
      button.style.color = "";
    } else {
      // Remove active from other buttons of same type
      document.querySelectorAll(".action-btn").forEach((btn) => {
        if (
          btn !== button &&
          ((isLike && btn.classList.contains("like-btn")) ||
            (!isLike && btn.classList.contains("dislike-btn")))
        ) {
          btn.classList.remove("active");
          btn.style.color = "";
        }
      });

      button.classList.add("active");
      button.style.color = "var(--color-primary)";
    }
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  showLoading() {
    document.getElementById("loadingSpinner").classList.remove("hidden");
  }

  hideLoading() {
    document.getElementById("loadingSpinner").classList.add("hidden");
  }

  showError(message) {
    alert(message); // In a real app, this would be a proper error UI
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new YouTubeClone();
});

// Service Worker registration (optional, for PWA features)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {
    // Service worker registration failed, but app still works
  });
}
