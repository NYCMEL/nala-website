class MtkCard {
  constructor() {
    this.config = window.mtkCardConfig || {};
    this.waitForElement();
  }

  waitForElement() {
    const timer = window.setInterval(() => {
      this.element = document.querySelector(".mtk-card");

      if (this.element) {
        window.clearInterval(timer);
        this.initialize();
      }
    }, 100);
  }

  initialize() {
    this.bindText();
    this.bindImage();
    this.bindKeyArt();
    this.bindDownloadLabel();
    this.registerEvents();
    this.subscribe();
  }

  bindText() {
    const fields = this.element.querySelectorAll("[data-mtk-field]");

    fields.forEach((field) => {
      const key = field.getAttribute("data-mtk-field");

      if (
        this.config.text &&
        Object.prototype.hasOwnProperty.call(this.config.text, key)
      ) {
        field.textContent = this.config.text[key];
      }
    });
  }

  bindImage() {
    const image = this.element.querySelector("[data-mtk-card-image]");

    if (image && this.config.image && this.config.image.src) {
      image.setAttribute("src", this.config.image.src);
      image.setAttribute("alt", this.config.image.alt || "");
    }
  }

  bindKeyArt() {
    const image = this.element.querySelector("[data-mtk-key-image]");
    const keyArt = this.config.keyArt || {};
    const fallbackSrc = this.config.image && this.config.image.src ? this.config.image.src : "";

    if (image) {
      image.setAttribute("src", keyArt.src || fallbackSrc);
      image.setAttribute("alt", keyArt.alt || "");
    }
  }

  bindDownloadLabel() {
    const label = this.element.querySelector("[data-mtk-download-label]");

    if (label && this.config.download && this.config.download.buttonLabel) {
      label.textContent = this.config.download.buttonLabel;
    }
  }

  registerEvents() {
    const clickable = this.element.querySelectorAll("[data-mtk-field]");
    const downloadButton = this.element.querySelector("[data-mtk-download-card]");

    clickable.forEach((item) => {
      item.addEventListener("click", () => {
        const payload = {
          event: "mtk-card-click",
          field: item.getAttribute("data-mtk-field")
        };

        this.publish("mtk-card-click", payload);
      });

      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          item.click();
        }
      });
    });

    if (downloadButton) {
      downloadButton.addEventListener("click", () => {
        this.downloadCard();
      });
    }
  }

  publish(topic, payload) {
    if (window.wc && wc.log) {
      wc.log(payload);
    }

    if (window.wc && wc.publish) {
      wc.publish(topic, payload);
    }
  }

  subscribe() {
    if (window.wc && wc.subscribe) {
      wc.subscribe("4-mtk-card", this.onMessage.bind(this));
    }
  }

  onMessage(message) {
    if (window.wc && wc.log) {
      wc.log(message);
    }

    if (message && message.text && typeof message.text === "object") {
      this.config.text = Object.assign({}, this.config.text || {}, message.text);
      this.bindText();
    }
  }

  downloadCard() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const width = 600;
    const height = 360;

    canvas.width = width;
    canvas.height = height;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    this.drawKeyArt(context, () => {
      this.drawCardText(context);
      this.saveCanvas(canvas);
    });
  }

  drawKeyArt(context, callback) {
    const keyArt = this.config.keyArt || {};
    const src = keyArt.src || (this.config.image && this.config.image.src ? this.config.image.src : "");

    if (!src) {
      this.drawFallbackKey(context);
      callback();
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      try {
        context.drawImage(
          image,
          keyArt.cropX || 52,
          keyArt.cropY || 48,
          keyArt.cropWidth || 225,
          keyArt.cropHeight || 112,
          keyArt.cropX || 52,
          keyArt.cropY || 48,
          keyArt.cropWidth || 225,
          keyArt.cropHeight || 112
        );
      } catch (error) {
        this.drawFallbackKey(context);
      }

      callback();
    };

    image.onerror = () => {
      this.drawFallbackKey(context);
      callback();
    };

    image.src = src;
  }

  drawFallbackKey(context) {
    const color = this.config.download && this.config.download.keyFallbackColor ? this.config.download.keyFallbackColor : "#000000";

    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.ellipse(111, 106, 42, 48, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#ffffff";
    context.beginPath();
    context.ellipse(107, 108, 16, 19, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = color;
    context.beginPath();
    context.moveTo(136, 93);
    context.lineTo(269, 93);
    context.lineTo(269, 105);
    context.lineTo(260, 114);
    context.lineTo(253, 131);
    context.lineTo(242, 131);
    context.lineTo(236, 116);
    context.lineTo(228, 116);
    context.lineTo(221, 131);
    context.lineTo(209, 131);
    context.lineTo(203, 116);
    context.lineTo(136, 116);
    context.closePath();
    context.fill();

    context.fillStyle = "#ffffff";
    context.fillRect(151, 101, 104, 4);
    context.restore();
  }

  drawCardText(context) {
    const text = this.config.text || {};

    context.save();
    context.fillStyle = "#000000";
    context.textBaseline = "top";

    this.drawText(context, text.logoText, 137, 68, "900 24px Arial", "left");
    this.drawText(context, text.personName, 528, 53, "400 27px Arial", "right");
    this.drawText(context, text.personTitle, 515, 88, "italic 400 18px Arial", "right");
    this.drawText(context, text.companyName, 194, 158, "900 30px Arial", "left");
    this.drawText(context, text.addressLine1, 52, 267, "400 18px Arial", "left");
    this.drawText(context, text.addressLine2, 52, 290, "400 18px Arial", "left");
    this.drawText(context, `${text.phonePrefix || ""} ${text.phone || ""}`.trim(), 560, 267, "400 18px Arial", "right");
    this.drawText(context, text.email, 560, 290, "400 18px Arial", "right");

    context.restore();
  }

  drawText(context, value, x, y, font, align) {
    if (!value) {
      return;
    }

    context.font = font;
    context.textAlign = align;
    context.fillText(value, x, y);
  }

  saveCanvas(canvas) {
    try {
      const link = document.createElement("a");
      link.download = this.config.download && this.config.download.fileName ? this.config.download.fileName : "mtk-card.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      this.publish("mtk-card-download", {
        event: "mtk-card-download",
        fileName: link.download
      });
    } catch (error) {
      this.publish("mtk-card-download-error", {
        event: "mtk-card-download-error",
        message: error.message
      });
    }
  }
}

new MtkCard();
