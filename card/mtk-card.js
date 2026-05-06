class MtkCard {
  constructor(element, config) {
    this.element = element;
    this.config = config || window.mtkCardConfig || {};
    this.card = this.config.card || {};
    this.actions = this.config.actions || {};
    this.subscribeTopic = this.config.subscribeTopic || "4-mtk-card";
    this.onMessage = this.onMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.init();
  }

  init() {
    this.renderData();
    this.bindEvents();
    this.subscribe();
    this.publish(this.actions.ready || "mtk-card:ready", {
      component: this.config.component || "mtk-card"
    });
  }

  renderData() {
    const binders = this.element.querySelectorAll("[data-bind]");

    binders.forEach((binder) => {
      const key = binder.getAttribute("data-bind");
      binder.textContent = this.card[key] || "";
    });

    const surface = this.element.querySelector(".mtk-card__surface");
    if (surface && this.config.ariaLabel) {
      surface.setAttribute("aria-label", this.config.ariaLabel);
    }
  }

  bindEvents() {
    this.element.addEventListener("click", this.handleClick);
    this.element.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      const field = event.target.closest(".mtk-card__field");
      if (!field) {
        return;
      }

      event.preventDefault();
      field.click();
    });
  }

  subscribe() {
    if (window.wc && typeof window.wc.subscribe === "function") {
      window.wc.subscribe(this.subscribeTopic, this.onMessage);
    }
  }

  onMessage(message) {
    const payload = message || {};

    if (payload.type === "refresh" || payload.action === "refresh") {
      this.renderData();
    }

    if (payload.type === "update" || payload.action === "update") {
      this.card = Object.assign({}, this.card, payload.card || payload.data || {});
      this.renderData();
    }
  }

  handleClick(event) {
    const field = event.target.closest(".mtk-card__field");

    if (!field || !this.element.contains(field)) {
      this.publish(this.actions.cardClick || "mtk-card:card-clicked", {
        component: this.config.component || "mtk-card"
      });
      return;
    }

    const fieldName = field.getAttribute("data-field") || "unknown";

    this.publish(this.actions.fieldClick || "mtk-card:field-clicked", {
      component: this.config.component || "mtk-card",
      field: fieldName,
      value: this.card[fieldName] || ""
    });
  }

  publish(topic, payload) {
    const detail = payload || {};

    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log("mtk-card publish", { topic, payload: detail });
    } else if (window.console && typeof window.console.log === "function") {
      window.console.log("mtk-card publish", { topic, payload: detail });
    }

    if (window.wc && typeof window.wc.publish === "function") {
      window.wc.publish(topic, detail);
    }
  }

  static waitForElement(selector, callback) {
    const existingElement = document.querySelector(selector);

    if (existingElement) {
      callback(existingElement);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);

      if (!element) {
        return;
      }

      observer.disconnect();
      callback(element);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  static boot() {
    MtkCard.waitForElement("mtk-card.mtk-card", (element) => {
      if (element.dataset.mtkCardReady === "true") {
        return;
      }

      element.dataset.mtkCardReady = "true";
      new MtkCard(element, window.mtkCardConfig);
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", MtkCard.boot);
} else {
  MtkCard.boot();
}
