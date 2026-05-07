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
    this.bindDownloadButton();
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

    if (
      image &&
      this.config.image &&
      this.config.image.src
    ) {
      image.setAttribute("src", this.config.image.src);
      image.setAttribute("alt", this.config.image.alt || "");
    }
  }

  bindDownloadButton() {
    const label = this.element.querySelector("[data-mtk-download-label]");

    if (
      label &&
      this.config.download &&
      this.config.download.buttonText
    ) {
      label.textContent = this.config.download.buttonText;
    }
  }

  registerEvents() {
    const clickable = this.element.querySelectorAll("[data-mtk-field]");
    const downloadButton = this.element.querySelector("[data-mtk-download-button]");

    clickable.forEach((item) => {
      item.addEventListener("click", () => {
        const payload = {
          event: "mtk-card-click",
          field: item.getAttribute("data-mtk-field")
        };

        this.logAndPublish("mtk-card-click", payload);
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
        this.downloadCard(downloadButton);
      });
    }
  }

  async downloadCard(button) {
    const card = this.element.querySelector("[data-mtk-download-card]");

    if (!card) {
      return;
    }

    const startPayload = {
      event: "mtk-card-download-start",
      fileName: this.getDownloadFileName()
    };

    this.logAndPublish("mtk-card-download-start", startPayload);

    try {
      button.disabled = true;

      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const dataUrl = this.createCardImage(card);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = this.getDownloadFileName();
      document.body.appendChild(link);
      link.click();
      link.remove();

      const completePayload = {
        event: "mtk-card-download-complete",
        fileName: this.getDownloadFileName()
      };

      this.logAndPublish("mtk-card-download-complete", completePayload);
    } catch (error) {
      const errorPayload = {
        event: "mtk-card-download-error",
        message: error && error.message ? error.message : "Unable to download card image"
      };

      this.logAndPublish("mtk-card-download-error", errorPayload);
    } finally {
      button.disabled = false;
    }
  }

  createCardImage(card) {
    const width = 600;
    const height = 360;
    const scale = Math.max(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const data = this.getCurrentCardText(card);

    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    context.setTransform(scale, 0, 0, scale, 0, 0);
    this.drawCardBackground(context, width, height);
    this.drawKeyLogo(context);
    this.drawCardText(context, data);

    return canvas.toDataURL("image/png");
  }

  getCurrentCardText(card) {
    const getText = (key) => {
      const field = card.querySelector("[data-mtk-field='" + key + "']");
      return field ? field.textContent.trim() : "";
    };

    return {
      logoText: getText("logoText"),
      personName: getText("personName"),
      personTitle: getText("personTitle"),
      companyName: getText("companyName"),
      addressLine1: getText("addressLine1"),
      addressLine2: getText("addressLine2"),
      phonePrefix: getText("phonePrefix"),
      phone: getText("phone"),
      email: getText("email")
    };
  }

  drawCardBackground(context, width, height) {
    context.save();
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.restore();
  }

  drawKeyLogo(context) {
    context.save();
    context.fillStyle = "#000000";
    context.beginPath();
    context.ellipse(111, 106, 42, 48, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#ffffff";
    context.beginPath();
    context.ellipse(108.5, 106.5, 15.5, 18.5, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#000000";
    context.beginPath();
    context.moveTo(136, 93);
    context.lineTo(269, 93);
    context.lineTo(269, 104.7);
    context.lineTo(259.7, 111.2);
    context.lineTo(250.4, 119);
    context.lineTo(238.4, 119);
    context.lineTo(231.8, 112.8);
    context.lineTo(222.45, 112.8);
    context.lineTo(215.8, 119);
    context.lineTo(202.5, 119);
    context.lineTo(197.2, 112.8);
    context.lineTo(136, 112.8);
    context.closePath();
    context.fill();

    context.fillStyle = "#ffffff";
    context.fillRect(148, 101, 112, 4);
    context.restore();
  }

  drawCardText(context, data) {
    context.save();
    context.fillStyle = "#000000";
    context.textBaseline = "top";

    this.drawText(context, data.logoText, 137, 68, "900 24px Arial", "left");
    this.drawText(context, data.personName, 528, 53, "400 27px Arial", "right");
    this.drawText(context, data.personTitle, 515, 88, "italic 400 18px Arial", "right");
    this.drawText(context, data.companyName, 194, 158, "900 30px Arial", "left");
    this.drawText(context, data.addressLine1, 52, 267, "400 18px Arial", "left");
    this.drawText(context, data.addressLine2, 52, 290, "400 18px Arial", "left");
    this.drawText(context, this.getPhoneText(data), 560, 267, "400 18px Arial", "right");
    this.drawText(context, data.email, 560, 290, "400 18px Arial", "right");

    context.restore();
  }

  drawText(context, text, x, y, font, align) {
    if (!text) {
      return;
    }

    context.font = font;
    context.textAlign = align;
    context.fillText(text, x, y);
  }

  getPhoneText(data) {
    return [data.phonePrefix, data.phone]
      .filter((value) => value && value.length)
      .join(" ");
  }

  getDownloadFileName() {
    if (
      this.config.download &&
      this.config.download.fileName
    ) {
      return this.config.download.fileName;
    }

    return "mtk-card.png";
  }

  logAndPublish(topic, payload) {
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
  }
}

new MtkCard();
