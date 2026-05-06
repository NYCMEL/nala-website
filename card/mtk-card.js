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
    this.bindFields();
    this.bindLabels();
    this.bindImage();
    this.registerEvents();
    this.subscribe();
  }

  bindFields() {
    const fields = this.element.querySelectorAll("[data-field]");

    fields.forEach((field) => {
      const key = field.getAttribute("data-field");

      if (
        this.config.card &&
        Object.prototype.hasOwnProperty.call(this.config.card, key)
      ) {
        field.textContent = this.config.card[key];
      }
    });
  }

  bindLabels() {
    const labels = this.element.querySelectorAll("[data-label]");

    labels.forEach((label) => {
      const key = label.getAttribute("data-label");

      if (
        this.config.labels &&
        Object.prototype.hasOwnProperty.call(this.config.labels, key)
      ) {
        label.textContent = this.config.labels[key];
      }
    });
  }

  bindImage() {
    const image = this.element.querySelector("[data-card-image]");

    if (image && this.config.image && this.config.image.src) {
      image.setAttribute("src", this.config.image.src);

      if (this.config.image.alt) {
        image.setAttribute("alt", this.config.image.alt);
      }
    }
  }

  registerEvents() {
    const clickable = this.element.querySelectorAll("[data-field], [data-label]");

    clickable.forEach((item) => {
      if (!item.hasAttribute("tabindex")) {
        item.setAttribute("tabindex", "0");
      }

      item.addEventListener("click", () => {
        const payload = {
          event: "mtk-card-click",
          field: item.getAttribute("data-field") || item.getAttribute("data-label")
        };

        if (window.wc && wc.log) {
          wc.log(payload);
        }

        if (window.wc && wc.publish) {
          wc.publish("mtk-card-click", payload);
        }
      });
    });
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
