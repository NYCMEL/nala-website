class MtkCard {
  constructor() {
    this.config = window.mtkCardConfig || {};
    this.waitForElement();
  }

  waitForElement() {
    const timer = setInterval(() => {
      this.element = document.querySelector(".mtk-card");

      if (this.element) {
        clearInterval(timer);
        this.initialize();
      }
    }, 100);
  }

  initialize() {
    this.bindFields();
    this.bindLabels();
    this.registerEvents();
    this.subscribe();
  }

  bindFields() {
    const fields = this.element.querySelectorAll("[data-field]");

    fields.forEach((field) => {
      const key = field.getAttribute("data-field");

      if (this.config[key]) {
        field.textContent = this.config[key];
      }
    });
  }

  bindLabels() {
    const labels = this.element.querySelectorAll("[data-label]");

    labels.forEach((label) => {
      const key = label.getAttribute("data-label");

      if (
        this.config.labels &&
        this.config.labels[key]
      ) {
        label.textContent = this.config.labels[key];
      }
    });
  }

  registerEvents() {
    const clickable = this.element.querySelectorAll("[data-field]");

    clickable.forEach((item) => {
      item.setAttribute("tabindex", "0");

      item.addEventListener("click", () => {
        const payload = {
          event: "mtk-card-click",
          field: item.getAttribute("data-field")
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
