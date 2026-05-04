class MtkBiab {
  constructor(root, config) {
    this.root = root;
    this.config = config || {};
    this.sections = Array.isArray(this.config.sections) ? this.config.sections : [];
    this.labels = this.config.labels || {};
    this.events = this.config.events || { publish: {}, subscribe: [] };
    this.activeId = this.sections[0] ? this.sections[0].id : "";
    this.isPublishing = false;
    this.onMessage = this.onMessage.bind(this);
    this._init();
  }

  _init() {
    this._subscribe();
    this._render();
    this._bind();
    this._publish(this.events.publish.ready || "mtk-biab:ready", {
      component: this.config.component || "mtk-biab",
      version: this.config.version || "1.0.5"
    });
  }

  _subscribe() {
    const list = Array.isArray(this.events.subscribe) ? this.events.subscribe : [];

    list.forEach((eventName) => {
      if (window.wc && typeof window.wc.subscribe === "function") {
        window.wc.subscribe(eventName, this.onMessage);
      }
    });
  }

  onMessage(eventName, data) {
    if (this.isPublishing) return;

    if (data && data.sectionId) {
      this._selectSection(data.sectionId);
    }

    if (eventName === "4-mtk-biab:setup-open") {
      this._openSetup();
    }

    if (eventName === "4-mtk-biab:setup-close") {
      this._closeSetup();
    }
  }

  _publish(eventName, data) {
    this.isPublishing = true;

    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log(eventName, data);
    } else {
      console.log(eventName, data);
    }

    if (window.wc && typeof window.wc.publish === "function") {
      window.wc.publish(eventName, data);
    }

    this.isPublishing = false;
  }

  _render() {
    const active = this._getActiveSection();

    this.root.innerHTML = `
      <section class="mtk-biab__page" aria-labelledby="mtk-biab-title">
        <header class="mtk-biab__hero">
          <h1 class="mtk-biab__title" id="mtk-biab-title">${this._escape(this.labels.pageTitle || "Business in a Box")}</h1>
          <p class="mtk-biab__subtitle">${this._escape(this.labels.pageSubtitle || "")}</p>

          <button class="mtk-biab__mobile-toggle" type="button" aria-expanded="false" data-action="toggle-menu">
            <span class="material-icons" aria-hidden="true">menu</span>
            <span>${this._escape(this.labels.menu || "Menu")}</span>
          </button>
        </header>

        <div class="mtk-biab__layout">
          <aside class="mtk-biab__sidebar" aria-label="Business in a Box navigation">
            <nav class="mtk-biab__nav">
              ${this.sections.map((section) => this._renderNavButton(section)).join("")}
            </nav>
          </aside>

          <main class="mtk-biab__main">
            ${this._renderPanel(active)}
          </main>
        </div>
      </section>
    `;
  }

  _renderNavButton(section) {
    const isActive = section.id === this.activeId;

    return `
      <button
        class="mtk-biab__nav-btn${isActive ? " is-active" : ""}"
        type="button"
        data-action="select-section"
        data-section-id="${this._escape(section.id)}"
        aria-current="${isActive ? "page" : "false"}"
      >
        <span class="material-icons" aria-hidden="true">${this._escape(section.icon || "radio_button_unchecked")}</span>
        <span>${this._escape(section.label || "")}</span>
      </button>
    `;
  }

  _renderPanel(section) {
    const safeSection = section || {};
    const included = this._renderIncluded(safeSection);

    return `
      <article class="mtk-biab__panel" aria-live="polite">
        <p class="mtk-biab__eyebrow">${this._escape(safeSection.eyebrow || "")}</p>
        <h2 class="mtk-biab__panel-title">${this._escape(safeSection.title || safeSection.label || "")}</h2>
        <p class="mtk-biab__description">${this._escape(safeSection.description || "")}</p>
        ${safeSection.body ? `<p class="mtk-biab__body">${this._escape(safeSection.body)}</p>` : ""}
        ${included}

        <button class="mtk-biab__start-btn" type="button" data-action="open-setup">
          <span class="material-icons" aria-hidden="true">rocket_launch</span>
          <span>${this._escape(this.labels.startSetup || "Start setup")}</span>
        </button>
      </article>
    `;
  }

  _renderIncluded(section) {
    if (!section.includedHeading || !Array.isArray(section.includedItems)) {
      return "";
    }

    return `
      <section class="mtk-biab__included" aria-label="Included by default">
        <h3 class="mtk-biab__included-heading">${section.includedHeading}</h3>
        <ol class="mtk-biab__included-list">
          ${section.includedItems.map((item) => `<li>${this._escape(item)}</li>`).join("")}
        </ol>
      </section>
    `;
  }

  _bind() {
    this.root.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target || !this.root.contains(target)) return;

      const action = target.getAttribute("data-action");

      if (action === "toggle-menu") {
        this._toggleMenu(target);
      }

      if (action === "select-section") {
        this._selectSection(target.getAttribute("data-section-id"));
      }

      if (action === "open-setup") {
        this._openSetup();
      }

      if (action === "close-setup") {
        this._closeSetup();
      }
    });

    this.root.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this._closeSetup();
      }
    });
  }

  _toggleMenu(button) {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    this.root.classList.toggle("is-menu-open", !expanded);
  }

  _selectSection(sectionId) {
    if (!this.sections.some((section) => section.id === sectionId)) return;

    this.activeId = sectionId;
    this.root.classList.remove("is-menu-open");
    this._render();

    this._publish(this.events.publish.select || "mtk-biab:select", {
      sectionId: this.activeId,
      section: this._getActiveSection()
    });
  }

  _openSetup() {
    const section = this._getActiveSection();
    const lorem = Array.isArray(this.config.setupLorem) ? this.config.setupLorem : [];

    this._closeSetup();

    const overlay = document.createElement("section");
    overlay.className = "mtk-biab__setup";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "mtk-biab-setup-title");

    overlay.innerHTML = `
      <header class="mtk-biab__setup-header">
        <div>
          <p class="mtk-biab__setup-kicker">${this._escape(this.labels.currentSelection || "Current selection")}</p>
          <h2 class="mtk-biab__setup-title" id="mtk-biab-setup-title">${this._escape(section.title || section.label || "")}</h2>
        </div>

        <button class="mtk-biab__setup-close" type="button" data-action="close-setup" aria-label="${this._escape(this.labels.closeSetup || "Close setup")}">
          ×
        </button>
      </header>

      <div class="mtk-biab__setup-body">
        <div class="mtk-biab__setup-card">
          ${lorem.map((paragraph) => `<p>${this._escape(paragraph)}</p>`).join("")}
        </div>
      </div>
    `;

    this.root.appendChild(overlay);

    const closeButton = overlay.querySelector(".mtk-biab__setup-close");
    if (closeButton) closeButton.focus();

    this._publish(this.events.publish.setupOpen || "mtk-biab:setup-open", {
      sectionId: this.activeId,
      section
    });
  }

  _closeSetup() {
    const existing = this.root.querySelector(".mtk-biab__setup");
    if (!existing) return;

    existing.remove();

    this._publish(this.events.publish.setupClose || "mtk-biab:setup-close", {
      sectionId: this.activeId
    });
  }

  _getActiveSection() {
    return this.sections.find((section) => section.id === this.activeId) || this.sections[0] || {};
  }

  _escape(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  static initWhenReady() {
    const start = () => {
      const root = document.querySelector("mtk-biab.mtk-biab");

      if (!root || root.dataset.mtkBiabReady === "true") {
        return false;
      }

      root.dataset.mtkBiabReady = "true";
      new MtkBiab(root, window.MTK_BIAB_CONFIG || {});
      return true;
    };

    if (start()) {
      return;
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    }

    const observer = new MutationObserver(() => {
      if (start()) {
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
}

MtkBiab.initWhenReady();
