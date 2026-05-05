/* mtk-settings.js */
class MTKSettings {
  constructor(root, config = window.mtkSettingsConfig) {
    this.root = root;
    this.config = config || { tabs: [] };
    this.activeTabId = this.config.tabs?.[0]?.id || "privacy";
    this.formState = {};

    this.tabsEl = this.root.querySelector(".mtk-settings__tabs");
    this.panelEl = this.root.querySelector(".mtk-settings__panel");

    this.onMessage = this.onMessage.bind(this);

    this.init();
  }

  init() {
    this.cacheInitialValues();
    this.renderTabs();
    this.renderPanel();

    if (window.wc && typeof window.wc.subscribe === "function") {
      window.wc.subscribe("4-mtk-settings", this.onMessage);
    }
  }

  cacheInitialValues() {
    (this.config.tabs || []).forEach((tab) => {
      if (!Array.isArray(tab.fields)) {
        return;
      }

      this.formState[tab.id] = {};

      tab.fields.forEach((field) => {
        this.formState[tab.id][field.id] = field.value || "";
      });
    });
  }

  onMessage(message = {}) {
    if (!message || typeof message !== "object") {
      return;
    }

    if (message.type === "select-tab" && message.tabId) {
      this.setActiveTab(message.tabId);
    }

    if (message.type === "set-values" && message.tabId && message.values) {
      this.formState[message.tabId] = {
        ...(this.formState[message.tabId] || {}),
        ...message.values
      };

      if (this.activeTabId === message.tabId) {
        this.renderPanel();
      }
    }
  }

  renderTabs() {
    this.tabsEl.innerHTML = "";

    (this.config.tabs || []).forEach((tab) => {
      const button = document.createElement("button");
      button.className = "mtk-settings__tab";
      button.type = "button";
      button.id = `mtk-settings-tab-${tab.id}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(tab.id === this.activeTabId));
      button.setAttribute("aria-controls", `mtk-settings-panel-${tab.id}`);
      button.textContent = tab.label;

      button.addEventListener("click", () => this.setActiveTab(tab.id));

      this.tabsEl.appendChild(button);
    });
  }

  setActiveTab(tabId) {
    const tabExists = (this.config.tabs || []).some((tab) => tab.id === tabId);

    if (!tabExists) {
      return;
    }

    this.activeTabId = tabId;
    this.renderTabs();
    this.renderPanel();
    this.publish("mtk-settings:tab-changed", { tabId });
  }

  renderPanel() {
    const tab = (this.config.tabs || []).find((item) => item.id === this.activeTabId);

    if (!tab) {
      this.panelEl.innerHTML = "";
      return;
    }

    this.panelEl.id = `mtk-settings-panel-${tab.id}`;
    this.panelEl.setAttribute("role", "tabpanel");
    this.panelEl.setAttribute("aria-labelledby", `mtk-settings-tab-${tab.id}`);

    const header = `
      <div class="mtk-settings__panel-header">
        <p class="mtk-settings__eyebrow">${this.escapeHTML(tab.eyebrow || "")}</p>
        <h3 class="mtk-settings__panel-title">${this.escapeHTML(tab.title || tab.label)}</h3>
        <p class="mtk-settings__panel-description">${this.escapeHTML(tab.description || "")}</p>
      </div>
    `;

    if (Array.isArray(tab.fields) && tab.fields.length) {
      this.panelEl.innerHTML = header + this.renderForm(tab);
      this.bindForm(tab);
      return;
    }

    this.panelEl.innerHTML = `
      ${header}
      <div class="mtk-settings__empty">
        This section is ready for fields, cards, or controls.
      </div>
    `;
  }

  renderForm(tab) {
    const state = this.formState[tab.id] || {};

    const fields = tab.fields.map((field) => {
      const value = state[field.id] || "";
      const required = field.required ? "required" : "";

      return `
        <div class="mtk-settings__field">
          <input
            class="mtk-settings__input"
            id="mtk-settings-${tab.id}-${field.id}"
            name="${this.escapeHTML(field.id)}"
            type="${this.escapeHTML(field.type || "text")}"
            value="${this.escapeHTML(value)}"
            autocomplete="${this.escapeHTML(field.autocomplete || "off")}"
            placeholder=" "
            ${required}
          />
          <label class="mtk-settings__label" for="mtk-settings-${tab.id}-${field.id}">
            ${this.escapeHTML(field.label)}
          </label>
        </div>
      `;
    }).join("");

    const actions = (tab.actions || []).map((action) => {
      const variant = action.variant === "primary" ? "primary" : "secondary";

      return `
        <button
          class="mtk-settings__button mtk-settings__button--${variant}"
          type="button"
          data-action-id="${this.escapeHTML(action.id)}"
          data-event="${this.escapeHTML(action.event)}"
        >
          ${this.escapeHTML(action.label)}
        </button>
      `;
    }).join("");

    return `
      <form class="mtk-settings__form" novalidate>
        <div class="mtk-settings__grid">
          <p class="mtk-settings__hint">
            These fields are for internal communications only and are not displayed publicly.
          </p>
          ${fields}
        </div>
        <div class="mtk-settings__actions">
          ${actions}
        </div>
      </form>
    `;
  }

  bindForm(tab) {
    const form = this.panelEl.querySelector(".mtk-settings__form");

    if (!form) {
      return;
    }

    form.querySelectorAll(".mtk-settings__input").forEach((input) => {
      input.addEventListener("input", () => {
        this.formState[tab.id] = {
          ...(this.formState[tab.id] || {}),
          [input.name]: input.value
        };
      });
    });

    form.querySelectorAll("[data-action-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const eventName = button.getAttribute("data-event");
        const actionId = button.getAttribute("data-action-id");

        if (actionId === "saveUpdate" && !form.checkValidity()) {
          form.reportValidity();
          return;
        }

        this.publish(eventName, {
          tabId: tab.id,
          actionId,
          values: { ...(this.formState[tab.id] || {}) }
        });
      });
    });
  }

  publish(eventName, payload = {}) {
    const message = {
      component: "mtk-settings",
      event: eventName,
      payload
    };

    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log("mtk-settings publish", message);
    }

    if (window.wc && typeof window.wc.publish === "function") {
      window.wc.publish(eventName, message);
      return;
    }

    this.root.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        detail: message
      })
    );
  }

  escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

(function initMTKSettings() {
  const start = () => {
    const root = document.querySelector("mtk-settings.mtk-settings");

    if (!root) {
      window.requestAnimationFrame(start);
      return;
    }

    if (root.dataset.mtkSettingsReady === "true") {
      return;
    }

    root.dataset.mtkSettingsReady = "true";
    new MTKSettings(root);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
    return;
  }

  start();
})();
