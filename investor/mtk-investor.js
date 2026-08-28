class MtkInvestor {
  constructor(root, config) {
    this.root = root;
    this.config = config;
    this.onMessage = this.onMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  init() {
    if (!this.root || !this.config) {
      return;
    }

    this.render();
    this.bindEvents();
    this.subscribe();
  }

  render() {
    this.renderBrand();
    this.renderNavigation();
    this.renderHero();
    this.renderOverview();
    this.renderMetrics();
    this.renderPrinciples();
    this.renderStrategy();
    this.renderHighlights();
    this.renderUpdates();
    this.renderClosing();
    this.renderFooter();
    this.applyAccessibilityLabels();
  }

  renderBrand() {
    const region = this.getRegion("brand");
    const { brand } = this.config;

    region.innerHTML = `
      <button
        class="mtk-investor__brand"
        type="button"
        data-event="${this.config.events.publish.nav}"
        data-action="brand-home"
        data-target="overview"
      >
        <span class="mtk-investor__brand-mark" aria-hidden="true">${this.escapeHtml(brand.name.slice(0, 1))}</span>
        <span class="mtk-investor__brand-copy">
          <span class="mtk-investor__brand-name">${this.escapeHtml(brand.name)}</span>
          <span class="mtk-investor__brand-eyebrow">${this.escapeHtml(brand.eyebrow)}</span>
        </span>
      </button>
    `;
  }

  renderNavigation() {
    const region = this.getRegion("navigation");
    region.innerHTML = this.config.navigation.map((item) => `
      <button
        class="mtk-investor__nav-button"
        type="button"
        data-event="${this.config.events.publish.nav}"
        data-action="navigate"
        data-target="${this.escapeAttribute(item.target)}"
      >
        ${this.escapeHtml(item.label)}
      </button>
    `).join("");
  }

  renderHero() {
    const region = this.getRegion("hero");
    const { hero, metrics } = this.config;
    const leadMetric = metrics[0];

    region.innerHTML = `
      <div class="container">
        <div class="mtk-investor__hero-inner row align-items-center g-5">
          <div class="col-12 col-lg-8">
            <p class="mtk-investor__eyebrow">${this.escapeHtml(hero.kicker)}</p>
            <h1 class="mtk-investor__hero-title">${this.escapeHtml(hero.title)}</h1>
            <p class="mtk-investor__hero-summary">${this.escapeHtml(hero.summary)}</p>
            <div class="mtk-investor__actions">
              ${this.renderActionButton(hero.primaryAction, "primary")}
              ${this.renderActionButton(hero.secondaryAction, "secondary")}
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <aside class="mtk-investor__hero-panel" aria-label="${this.escapeAttribute(leadMetric.label)}">
              <p class="mtk-investor__hero-panel-label">${this.escapeHtml(leadMetric.label)}</p>
              <p class="mtk-investor__hero-panel-value">${this.escapeHtml(leadMetric.value)}</p>
              <p class="mtk-investor__hero-panel-copy">${this.escapeHtml(leadMetric.detail)}</p>
            </aside>
          </div>
        </div>
      </div>
    `;
  }

  renderOverview() {
    const region = this.getRegion("overview");
    const { overview } = this.config;

    region.innerHTML = `
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-9">
            <p class="mtk-investor__eyebrow">${this.escapeHtml(overview.eyebrow)}</p>
            <h2 class="mtk-investor__section-title">${this.escapeHtml(overview.title)}</h2>
            <p class="mtk-investor__section-copy">${this.escapeHtml(overview.body)}</p>
          </div>
        </div>
      </div>
    `;
  }

  renderMetrics() {
    const region = this.getRegion("metrics");

    region.innerHTML = `
      <div class="container">
        <div class="row g-4 mtk-investor__metric-grid">
          ${this.config.metrics.map((metric) => `
            <div class="col-12 col-sm-6 col-xl-3">
              <button
                class="mtk-investor__metric"
                type="button"
                data-event="${this.escapeAttribute(metric.event)}"
                data-action="${this.escapeAttribute(metric.action)}"
                aria-label="${this.escapeAttribute(`${metric.label}: ${metric.value}`)}"
              >
                <span class="mtk-investor__metric-icon" aria-hidden="true">
                  <span class="mtk-investor__material-icon">${this.escapeHtml(metric.icon)}</span>
                </span>
                <span class="mtk-investor__metric-value">${this.escapeHtml(metric.value)}</span>
                <span class="mtk-investor__metric-label">${this.escapeHtml(metric.label)}</span>
                <span class="mtk-investor__metric-detail">${this.escapeHtml(metric.detail)}</span>
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderPrinciples() {
    const region = this.getRegion("principles");
    const { principles } = this.config;

    region.innerHTML = `
      <div class="container">
        <div class="row g-0 mtk-investor__principles-grid">
          ${principles.items.map((item) => `
            <article class="col-12 col-md-6 col-xl-3 mtk-investor__principle">
              <span class="mtk-investor__principle-icon" aria-hidden="true">
                <span class="mtk-investor__material-icon">${this.escapeHtml(item.icon)}</span>
              </span>
              <div class="mtk-investor__principle-content">
                <h2 class="mtk-investor__principle-title">${this.escapeHtml(item.title)}</h2>
                <p class="mtk-investor__principle-copy">${this.escapeHtml(item.text)}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderStrategy() {
    const region = this.getRegion("strategy");
    const { strategy } = this.config;

    region.innerHTML = `
      <div class="container">
        <p class="mtk-investor__eyebrow">${this.escapeHtml(strategy.eyebrow)}</p>
        <h2 class="mtk-investor__section-title">${this.escapeHtml(strategy.title)}</h2>
        <div class="row g-4 mtk-investor__strategy-grid">
          ${strategy.items.map((item) => `
            <article class="col-12 col-md-6 col-xl-3">
              <div class="mtk-investor__strategy-item">
                <span class="mtk-investor__strategy-number">${this.escapeHtml(item.number)}</span>
                <span class="mtk-investor__strategy-icon" aria-hidden="true">
                  <span class="mtk-investor__material-icon">${this.escapeHtml(item.icon)}</span>
                </span>
                <h3 class="mtk-investor__strategy-title">${this.escapeHtml(item.title)}</h3>
                <p class="mtk-investor__strategy-copy">${this.escapeHtml(item.text)}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderHighlights() {
    const region = this.getRegion("highlights");
    const { highlights } = this.config;

    region.innerHTML = `
      <div class="container">
        <div class="row align-items-start g-5">
          <div class="col-12 col-lg-7">
            <p class="mtk-investor__eyebrow">${this.escapeHtml(highlights.eyebrow)}</p>
            <h2 class="mtk-investor__section-title">${this.escapeHtml(highlights.title)}</h2>
            <p class="mtk-investor__section-copy">${this.escapeHtml(highlights.body)}</p>
          </div>
          <div class="col-12 col-lg-5">
            <ul class="mtk-investor__highlight-list">
              ${highlights.points.map((point) => `
                <li class="mtk-investor__highlight-item">
                  <span class="mtk-investor__material-icon" aria-hidden="true">${this.escapeHtml(point.icon)}</span>
                  <span>${this.escapeHtml(point.text)}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  renderUpdates() {
    const region = this.getRegion("updates");
    const { updates } = this.config;

    region.innerHTML = `
      <div class="container">
        <p class="mtk-investor__eyebrow">${this.escapeHtml(updates.eyebrow)}</p>
        <h2 class="mtk-investor__section-title">${this.escapeHtml(updates.title)}</h2>
        <div class="row g-4 mtk-investor__updates-grid">
          ${updates.items.map((item) => `
            <article class="col-12 col-md-6 col-xl-4">
              <button
                class="mtk-investor__update-card"
                type="button"
                data-event="${this.escapeAttribute(item.event)}"
                data-action="${this.escapeAttribute(item.action)}"
              >
                <span class="mtk-investor__update-top">
                  <span class="mtk-investor__update-date">${this.escapeHtml(item.date)}</span>
                  <span class="mtk-investor__material-icon" aria-hidden="true">${this.escapeHtml(item.icon)}</span>
                </span>
                <span class="mtk-investor__update-title">${this.escapeHtml(item.title)}</span>
                <span class="mtk-investor__update-copy">${this.escapeHtml(item.description)}</span>
                <span class="mtk-investor__update-arrow" aria-hidden="true">
                  <span class="mtk-investor__material-icon">arrow_forward</span>
                </span>
              </button>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderClosing() {
    const region = this.getRegion("closing");
    const { closing } = this.config;

    region.innerHTML = `
      <div class="container">
        <div class="row align-items-end g-4">
          <div class="col-12 col-lg-8">
            <p class="mtk-investor__eyebrow">${this.escapeHtml(closing.eyebrow)}</p>
            <h2 class="mtk-investor__section-title">${this.escapeHtml(closing.title)}</h2>
            <p class="mtk-investor__section-copy">${this.escapeHtml(closing.body)}</p>
          </div>
          <div class="col-12 col-lg-4 d-lg-flex justify-content-lg-end">
            ${this.renderActionButton(closing.action, "primary")}
          </div>
        </div>
      </div>
    `;
  }

  renderFooter() {
    const region = this.getRegion("footer");

    region.innerHTML = `
      <div class="container">
        <div class="mtk-investor__footer-inner">
          <div class="mtk-investor__footer-logo-space" aria-hidden="true"></div>
          <nav class="mtk-investor__footer-nav" aria-label="Investor footer navigation">
            ${this.config.navigation.map((item) => `
              <button
                class="mtk-investor__footer-nav-button"
                type="button"
                data-event="${this.config.events.publish.nav}"
                data-action="navigate"
                data-target="${this.escapeAttribute(item.target)}"
              >
                ${this.escapeHtml(item.label)}
              </button>
            `).join("")}
          </nav>
        </div>
      </div>
    `;
  }

  renderActionButton(action, variant) {
    const target = action.target ? ` data-target="${this.escapeAttribute(action.target)}"` : "";

    return `
      <button
        class="mtk-investor__button mtk-investor__button--${this.escapeAttribute(variant)}"
        type="button"
        data-event="${this.escapeAttribute(action.event)}"
        data-action="${this.escapeAttribute(action.action)}"${target}
      >
        <span>${this.escapeHtml(action.label)}</span>
        <span class="mtk-investor__material-icon" aria-hidden="true">${this.escapeHtml(action.icon)}</span>
      </button>
    `;
  }

  applyAccessibilityLabels() {
    const { accessibility } = this.config;
    this.getRegion("navigation").setAttribute("aria-label", accessibility.navigationLabel);
    this.getRegion("hero").setAttribute("aria-label", accessibility.heroLabel);
    this.getRegion("overview").setAttribute("aria-label", accessibility.overviewLabel);
    this.getRegion("metrics").setAttribute("aria-label", accessibility.metricsLabel);
    this.getRegion("principles").setAttribute("aria-label", accessibility.principlesLabel);
    this.getRegion("strategy").setAttribute("aria-label", accessibility.strategyLabel);
    this.getRegion("updates").setAttribute("aria-label", accessibility.updatesLabel);
    this.getRegion("closing").setAttribute("aria-label", accessibility.closingLabel);
  }

  bindEvents() {
    this.root.addEventListener("click", this.handleClick);
  }

  handleClick(event) {
    const trigger = event.target.closest("[data-event]");

    if (!trigger || !this.root.contains(trigger)) {
      return;
    }

    const eventName = trigger.dataset.event;
    const detail = {
      component: "mtk-investor",
      action: trigger.dataset.action || "",
      target: trigger.dataset.target || "",
      label: trigger.textContent.trim()
    };

    if (detail.target) {
      this.scrollToSection(detail.target);
    }

    this.publish(eventName, detail);
  }

  publish(eventName, detail) {
    if (!eventName) {
      return;
    }

    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log(`[mtk-investor] publishing ${eventName}`, detail);
    } else {
      console.log(`[mtk-investor] publishing ${eventName}`, detail);
    }

    if (window.wc && typeof window.wc.publish === "function") {
      window.wc.publish(eventName, detail);
    }
  }

  subscribe() {
    if (!window.wc || typeof window.wc.subscribe !== "function") {
      return;
    }

    this.config.events.subscribe.forEach((eventName) => {
      window.wc.subscribe(eventName, this.onMessage);
    });
  }

  onMessage(message, data) {
    const status = this.getRegion("status");
    status.textContent = `${message || "mtk-investor event"} received.`;

    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log("[mtk-investor] message received", message, data);
    }
  }

  scrollToSection(target) {
    const section = this.root.querySelector(`[data-section="${CSS.escape(target)}"]`);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  getRegion(name) {
    return this.root.querySelector(`[data-region="${name}"]`);
  }

  escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  escapeAttribute(value) {
    return this.escapeHtml(value);
  }
}

(function initializeMtkInvestor() {
  const selector = "mtk-investor.mtk-investor";
  let observer = null;
  let retryTimer = null;

  const log = (...args) => {
    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log(...args);
    } else {
      console.log(...args);
    }
  };

  const findRoot = () => document.querySelector(selector);

  const start = () => {
    const root = findRoot();
    const config = window.MTK_INVESTOR_CONFIG;

    if (!root || !config) {
      return false;
    }

    if (root.dataset.initialized === "true") {
      return true;
    }

    root.dataset.initialized = "true";
    const investor = new MtkInvestor(root, config);
    investor.init();
    root.mtkInvestor = investor;
    log("[mtk-investor] initialized");
    return true;
  };

  const stopWatching = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (retryTimer) {
      window.clearInterval(retryTimer);
      retryTimer = null;
    }
  };

  const tryStart = () => {
    if (start()) {
      stopWatching();
      return true;
    }
    return false;
  };


  document.addEventListener("include:loaded", tryStart);
  document.addEventListener("mtk-investor:config-ready", tryStart);

  observer = new MutationObserver(tryStart);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  retryTimer = window.setInterval(tryStart, 100);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      tryStart();
    }, { once: true });
  } else {
    tryStart();
  }
})();
