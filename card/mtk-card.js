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
    this.registerEvents();
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

  bindImage() {
    const image = this.element.querySelector("[data-card-image]");

    if (
      image &&
      this.config.image &&
      this.config.image.src
    ) {
      image.setAttribute("src", this.config.image.src);

      if (this.config.image.alt) {
        image.setAttribute("alt", this.config.image.alt);
      }
    }
  }

  registerEvents() {
    const clickable = this.element.querySelectorAll("[data-text]");

    clickable.forEach((item) => {
      item.setAttribute("tabindex", "0");

      item.addEventListener("click", () => {
        const payload = {
          event: "mtk-card-click",
          field: item.getAttribute("data-text")
        };

        if (window.wc && wc.log) {
          wc.log(payload);
        }

        if (window.wc && wc.publish) {
          wc.publish("mtk-card-click", payload);
        }
      });

      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          item.click();
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
