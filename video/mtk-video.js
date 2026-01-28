(function () {
  const NS = "MTKVideo";

  window[NS] = {
    init() {
      const host = document.querySelector("mtk-video");
      if (!host || !window.app || !window.app.video) return;

      this.host = host;
      this.videoEl = host.querySelector(".mtk-video-player");

      this.loadVideo(window.app.video.url);
      this.subscribe();
    },

    subscribe() {
      wc.subscribe("mtk-video:init", () => {});
      wc.subscribe("mtk-video:play", () => {});
      wc.subscribe("mtk-video:pause", () => {});
      wc.subscribe("mtk-video:ended", () => {});
    },

    loadVideo(url) {
      this.videoEl.src = url;

      // Add event listeners
      this.videoEl.addEventListener("play", () => {
        wc.log("mtk-video:play", { url });
        wc.publish("mtk-video:play", { url });
      });

      this.videoEl.addEventListener("pause", () => {
        wc.log("mtk-video:pause", { url });
        wc.publish("mtk-video:pause", { url });
      });

      this.videoEl.addEventListener("ended", () => {
        wc.log("mtk-video:ended", { url });
        wc.publish("mtk-video:ended", { url });
      });
    }
  };

  // Wait for mtk-video element
  const wait = setInterval(() => {
    const el = document.querySelector("mtk-video");
    if (el) {
      clearInterval(wait);
      window[NS].init();
      wc.log("mtk-video:init", {});
      wc.publish("mtk-video:init", {});
    }
  }, 50);
})();
