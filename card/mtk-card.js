
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
    this.bindText();
    this.bindImage();
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
      image.src = this.config.image.src;
      image.alt = this.config.image.alt || "";
    }
  }
}

new MtkCard();
