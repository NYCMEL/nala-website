class MTKVideo {
  /**
   * @param {string} selector - CSS selector for the <mtk-video> element
   */
  constructor(selector = "mtk-video") {
    this.host = document.querySelector(selector);
    if (!this.host) {
      console.warn("MTKVideo: element not found yet");
      return;
    }

    // Build internal HTML
    this.host.innerHTML = `
      <div class="mtk-video-container">
        <video class="mtk-video-player" tabindex="0" controls controlsList="nodownload"></video>
        <div class="mtk-video-label"></div>
      </div>
    `;

    this.videoEl = this.host.querySelector(".mtk-video-player");
    this.labelEl = this.host.querySelector(".mtk-video-label");

    // Prevent right-click on video
    this.videoEl.addEventListener("contextmenu", (e) => e.preventDefault());

    this.subscribe();

    // Initial event
    wc.log("mtk-video:init", {});
    wc.publish("mtk-video:init", {});
  }

  subscribe() {
    wc.subscribe("mtk-video:init", () => {});
    wc.subscribe("mtk-video:play", () => {});
    wc.subscribe("mtk-video:pause", () => {});
    wc.subscribe("mtk-video:ended", () => {});
  }

  /**
   * Load a video dynamically
   * @param {string} url - video URL
   * @param {string} label - label to display at bottom
   */
  load(url, label = "") {
    if (!this.videoEl) return;

    this.videoEl.src = url;
    this.labelEl.textContent = label;

    // Remove old listeners
    this.videoEl.onplay = null;
    this.videoEl.onpause = null;
    this.videoEl.onended = null;

    // Add event listeners
    this.videoEl.addEventListener("play", () => {
      wc.log("mtk-video:play", { url, label });
      wc.publish("mtk-video:play", { url, label });
    });

    this.videoEl.addEventListener("pause", () => {
      wc.log("mtk-video:pause", { url, label });
      wc.publish("mtk-video:pause", { url, label });
    });

    this.videoEl.addEventListener("ended", () => {
      wc.log("mtk-video:ended", { url, label });
      wc.publish("mtk-video:ended", { url, label });
    });
  }
}

// Wait for DOMContentLoaded and element existence
function initMTKVideo() {
  const el = document.querySelector("mtk-video");
  if (el) {
    window.MTKVideoInstance = new MTKVideo();
  } else {
    // Retry until element is found
    const observer = new MutationObserver(() => {
      const elRetry = document.querySelector("mtk-video");
      if (elRetry) {
        observer.disconnect();
        window.MTKVideoInstance = new MTKVideo();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMTKVideo);
} else {
  initMTKVideo();
}
