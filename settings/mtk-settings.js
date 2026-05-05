class MtkSettings {
  constructor(root, config) {
    this.root = root;
    this.config = config || {};
    this.activeTabId = this.config.component?.defaultTab || this.config.tabs?.[0]?.id || "";
    this.formData = {};
    this.onMessage = this.onMessage.bind(this);
    this.init();
  }

  init() {
    this.root.innerHTML = this.template();
    this.cache();
    this.bindEvents();
    this.subscribe();
    this.publish(this.config.events?.ready || "mtk-settings:ready", {
      component: this.config.component?.name || "mtk-settings"
    });
  }

  cache() {
    this.tabButtons = Array.from(this.root.querySelectorAll(".mtk-settings__tab"));
    this.panels = Array.from(this.root.querySelectorAll(".mtk-settings__tabpanel"));
    this.fields = Array.from(this.root.querySelectorAll("[data-mtk-settings-field]"));
    this.actionButtons = Array.from(this.root.querySelectorAll("[data-mtk-settings-action]"));
  }

  bindEvents() {
    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () => this.setActiveTab(button.dataset.tabId));
      button.addEventListener("keydown", (event) => this.handleTabKeydown(event));
    });

    this.fields.forEach((field) => {
      field.addEventListener("change", (event) => this.handleFieldChange(event));
      field.addEventListener("input", (event) => this.handleFieldChange(event));
    });

    this.actionButtons.forEach((button) => {
      button.addEventListener("click", () => this.handleAction(button));
    });
  }

  subscribe() {
    if (window.wc && typeof window.wc.subscribe === "function") {
      window.wc.subscribe(this.config.subscribeTopic || "4-mtk-settings", this.onMessage);
    }
  }

  onMessage(message) {
    const payload = message || {};
    const action = payload.action || payload.type || "";

    if (action === "set-tab" && payload.tabId) {
      this.setActiveTab(payload.tabId);
    }

    if (action === "set-data" && payload.data) {
      this.setData(payload.data);
    }

    if (action === "reset") {
      this.reset();
    }
  }

  setActiveTab(tabId) {
    if (!tabId || tabId === this.activeTabId) {
      return;
    }

    this.activeTabId = tabId;

    this.tabButtons.forEach((button) => {
      const isActive = button.dataset.tabId === tabId;
      button.setAttribute("aria-selected", String(isActive));
      button.tabIndex = isActive ? 0 : -1;
    });

    this.panels.forEach((panel) => {
      const isActive = panel.dataset.panelId === tabId;
      panel.hidden = !isActive;
    });

    this.publish(this.config.events?.tabChanged || "mtk-settings:tab-changed", { tabId });
  }

  handleTabKeydown(event) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) {
      return;
    }

    event.preventDefault();

    const currentIndex = this.tabButtons.indexOf(event.currentTarget);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % this.tabButtons.length;
    }

    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + this.tabButtons.length) % this.tabButtons.length;
    }

    if (event.key === "Home") {
      nextIndex = 0;
    }

    if (event.key === "End") {
      nextIndex = this.tabButtons.length - 1;
    }

    const nextButton = this.tabButtons[nextIndex];
    nextButton.focus();
    this.setActiveTab(nextButton.dataset.tabId);
  }

  handleFieldChange(event) {
    const field = event.currentTarget;
    const fieldId = field.dataset.mtkSettingsField;
    const value = field.type === "checkbox" ? field.checked : field.value;

    this.formData[fieldId] = value;

    this.publish(this.config.events?.fieldChanged || "mtk-settings:field-changed", {
      fieldId,
      value,
      tabId: this.activeTabId
    });
  }

  handleAction(button) {
    const actionId = button.dataset.mtkSettingsAction;
    const tabId = button.dataset.tabId;
    const tab = this.getTabById(tabId);
    const action = tab?.actions?.find((item) => item.id === actionId);
    const eventName = action?.event || `mtk-settings:${actionId}`;

    this.publish(eventName, {
      actionId,
      tabId,
      data: this.getTabData(tabId)
    });
  }

  setData(data) {
    Object.entries(data).forEach(([key, value]) => {
      const field = this.root.querySelector(`[data-mtk-settings-field="${key}"]`);
      if (!field) {
        return;
      }

      if (field.type === "checkbox") {
        field.checked = Boolean(value);
      } else {
        field.value = value;
      }

      this.formData[key] = value;
    });
  }

  reset() {
    this.formData = {};
    this.fields.forEach((field) => {
      if (field.type === "checkbox") {
        field.checked = false;
      } else if (!field.readOnly) {
        field.value = "";
      }
    });
  }

  getTabData(tabId) {
    const tab = this.getTabById(tabId);
    const data = {};

    tab?.fields?.forEach((field) => {
      const element = this.root.querySelector(`[data-mtk-settings-field="${field.id}"]`);
      if (!element) {
        return;
      }

      data[field.id] = element.type === "checkbox" ? element.checked : element.value;
    });

    return data;
  }

  getTabById(tabId) {
    return this.config.tabs?.find((tab) => tab.id === tabId);
  }

  publish(eventName, payload) {
    const message = {
      source: this.config.component?.name || "mtk-settings",
      event: eventName,
      payload: payload || {}
    };

    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log("mtk-settings publish", message);
    } else {
      console.log("mtk-settings publish", message);
    }

    if (window.wc && typeof window.wc.publish === "function") {
      window.wc.publish(eventName, message);
    }
  }

  template() {
    const tabs = this.config.tabs || [];
    const title = this.escape(this.config.component?.title || "Profile & Settings");

    return `
      <section class="mtk-settings__shell" aria-labelledby="mtk-settings-title">
        <div class="container">
          <header class="row">
            <div class="col-12">
              <h1 class="mtk-settings__title" id="mtk-settings-title">${title}</h1>
            </div>
          </header>

          <div class="mtk-settings__panel">
            <div class="row">
              <div class="col-12">
                <div class="mtk-settings__tabs" role="tablist" aria-label="${title}">
                  ${tabs.map((tab, index) => this.tabTemplate(tab, index)).join("")}
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                ${tabs.map((tab) => this.panelTemplate(tab)).join("")}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  tabTemplate(tab, index) {
    const isActive = tab.id === this.activeTabId;
    const tabId = `mtk-settings-tab-${this.escapeAttribute(tab.id)}`;
    const panelId = `mtk-settings-panel-${this.escapeAttribute(tab.id)}`;

    return `
      <button
        class="mtk-settings__tab"
        id="${tabId}"
        type="button"
        role="tab"
        aria-selected="${isActive}"
        aria-controls="${panelId}"
        tabindex="${isActive ? "0" : "-1"}"
        data-tab-id="${this.escapeAttribute(tab.id)}"
      >
        <span class="mtk-settings__icon" aria-hidden="true">${this.escape(tab.icon || "settings")}</span>
        <span>${this.escape(tab.label)}</span>
      </button>
    `;
  }

  panelTemplate(tab) {
    const isActive = tab.id === this.activeTabId;
    const tabId = `mtk-settings-tab-${this.escapeAttribute(tab.id)}`;
    const panelId = `mtk-settings-panel-${this.escapeAttribute(tab.id)}`;

    return `
      <section
        class="mtk-settings__tabpanel"
        id="${panelId}"
        role="tabpanel"
        aria-labelledby="${tabId}"
        data-panel-id="${this.escapeAttribute(tab.id)}"
        ${isActive ? "" : "hidden"}
      >
        <article class="mtk-settings__card">
          <header class="mtk-settings__card-header">
            <h2 class="mtk-settings__heading">${this.escape(tab.heading || tab.label)}</h2>
          </header>

          <div class="mtk-settings__content">
            <form class="mtk-settings__form" novalidate>
              ${this.fieldsTemplate(tab)}
              ${this.actionsTemplate(tab)}
            </form>
          </div>
        </article>
      </section>
    `;
  }

  fieldsTemplate(tab) {
    return (tab.fields || []).map((field) => this.fieldTemplate(field)).join("");
  }

  fieldTemplate(field) {
    const value = this.getFieldValue(field);
    const label = this.escape(field.label);
    const fieldId = this.escapeAttribute(field.id);

    if (field.type === "checkbox") {
      return `
        <div class="mtk-settings__checkbox-row">
          <input
            class="mtk-settings__checkbox"
            type="checkbox"
            id="mtk-settings-field-${fieldId}"
            data-mtk-settings-field="${fieldId}"
          />
          <label class="mtk-settings__checkbox-label" for="mtk-settings-field-${fieldId}">${label}</label>
        </div>
      `;
    }

    if (field.type === "textarea") {
      return `
        <div class="mtk-settings__form-group">
          <label class="mtk-settings__label" for="mtk-settings-field-${fieldId}">${label}</label>
          <textarea
            class="mtk-settings__textarea"
            id="mtk-settings-field-${fieldId}"
            data-mtk-settings-field="${fieldId}"
            placeholder="${this.escapeAttribute(field.placeholder || "")}"
          >${this.escape(value)}</textarea>
        </div>
      `;
    }

    return `
      <div class="mtk-settings__form-group">
        <label class="mtk-settings__label" for="mtk-settings-field-${fieldId}">${label}</label>
        <input
          class="mtk-settings__input"
          id="mtk-settings-field-${fieldId}"
          type="${this.escapeAttribute(field.type || "text")}"
          data-mtk-settings-field="${fieldId}"
          value="${this.escapeAttribute(value)}"
          placeholder="${this.escapeAttribute(field.placeholder || "")}"
          ${field.readonly ? "readonly" : ""}
        />
      </div>
    `;
  }

  actionsTemplate(tab) {
    const actions = tab.actions || [];

    if (!actions.length) {
      return "";
    }

    return `
      <div class="mtk-settings__actions">
        ${actions.map((action) => `
          <button
            class="mtk-settings__btn"
            type="button"
            data-tab-id="${this.escapeAttribute(tab.id)}"
            data-mtk-settings-action="${this.escapeAttribute(action.id)}"
          >
            <span class="mtk-settings__icon" aria-hidden="true">${this.escape(action.icon || "save")}</span>
            <span>${this.escape(action.label)}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  getFieldValue(field) {
    if (field.valueKey && this.config.user && Object.prototype.hasOwnProperty.call(this.config.user, field.valueKey)) {
      return this.config.user[field.valueKey];
    }

    return field.value || "";
  }

  escape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  escapeAttribute(value) {
    return this.escape(value);
  }

  static waitForElement(selector, callback) {
    const existing = document.querySelector(selector);

    if (existing) {
      callback(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);

      if (element) {
        observer.disconnect();
        callback(element);
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  static boot() {
    MtkSettings.waitForElement("mtk-settings.mtk-settings", (root) => {
      if (root.dataset.mtkSettingsInitialized === "true") {
        return;
      }

      root.dataset.mtkSettingsInitialized = "true";
      new MtkSettings(root, window.mtkSettingsConfig || {});
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => MtkSettings.boot());
} else {
  MtkSettings.boot();
}
