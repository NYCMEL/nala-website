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
    this.bindLabels();
    this.subscribe();
  }

  bindText() {
    const fields = this.element.querySelectorAll("[data-text]");

    fields.forEach((field) => {
      const key = field.getAttribute("data-text");

      if (
        this.config.text &&
        Object.prototype.hasOwnProperty.call(this.config.text, key)
      ) {
        field.textContent = this.config.text[key];
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
