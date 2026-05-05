/* mtk-settings.js */
(function mtkSettingsModule(window, document) {
  "use strict";

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getTabs(config) {
    if (!config || !Array.isArray(config.tabs)) {
      return [];
    }

    return config.tabs;
  }

  function MTKSettings(root, config) {
    this.root = root;
    this.config = config || window.mtkSettingsConfig || { tabs: [] };
    this.tabs = getTabs(this.config);
    this.activeTabId = this.tabs.length ? this.tabs[0].id : "privacy";
    this.formState = {};

    this.tabsEl = this.root.querySelector(".mtk-settings__tabs");
    this.panelEl = this.root.querySelector(".mtk-settings__panel");

    this.onMessage = this.onMessage.bind(this);

    this.init();
  }

  MTKSettings.prototype.init = function init() {
    if (!this.tabsEl || !this.panelEl) {
      return;
    }

    if (!this.tabs.length) {
      this.panelEl.innerHTML = '<div class="mtk-settings__empty">Settings configuration is missing.</div>';
      return;
    }

    this.cacheInitialValues();
    this.setHeaderText();
    this.renderTabs();
    this.renderPanel();

    if (window.wc && typeof window.wc.subscribe === "function") {
      window.wc.subscribe("4-mtk-settings", this.onMessage);
    }
  };

  MTKSettings.prototype.setHeaderText = function setHeaderText() {
    var titleEl = this.root.querySelector("[data-title]");
    var eyebrowEl = this.root.querySelector("[data-eyebrow]");

    if (titleEl) {
      titleEl.textContent = this.config.title || "Profile & Settings";
    }

    if (eyebrowEl) {
      eyebrowEl.textContent = this.config.eyebrow || "Account Management";
    }
  };

  MTKSettings.prototype.cacheInitialValues = function cacheInitialValues() {
    var self = this;

    this.tabs.forEach(function eachTab(tab) {
      self.formState[tab.id] = {};

      if (!Array.isArray(tab.fields)) {
        return;
      }

      tab.fields.forEach(function eachField(field) {
        if (field.type === "checkboxGroup") {
          self.formState[tab.id][field.id] = (field.options || [])
            .filter(function onlyChecked(option) {
              return option.checked;
            })
            .map(function toValue(option) {
              return option.value;
            });
          return;
        }

        self.formState[tab.id][field.id] = field.value || "";
      });
    });
  };

  MTKSettings.prototype.onMessage = function onMessage(message) {
    message = message || {};

    if (message.type === "select-tab" && message.tabId) {
      this.setActiveTab(message.tabId);
    }

    if (message.type === "set-values" && message.tabId && message.values) {
      this.formState[message.tabId] = Object.assign({}, this.formState[message.tabId] || {}, message.values);

      if (this.activeTabId === message.tabId) {
        this.renderPanel();
      }
    }
  };

  MTKSettings.prototype.renderTabs = function renderTabs() {
    var self = this;

    this.tabsEl.innerHTML = "";

    this.tabs.forEach(function eachTab(tab) {
      var button = document.createElement("button");
      button.className = "mtk-settings__tab";
      button.type = "button";
      button.id = "mtk-settings-tab-" + tab.id;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(tab.id === self.activeTabId));
      button.setAttribute("aria-controls", "mtk-settings-panel-" + tab.id);
      button.innerHTML =
        '<span class="mtk-settings__tab-icon" aria-hidden="true">' + escapeHTML(tab.icon || "settings") + "</span>" +
        '<span class="mtk-settings__tab-label">' + escapeHTML(tab.label) + "</span>";

      button.addEventListener("click", function onClick() {
        self.setActiveTab(tab.id);
      });

      self.tabsEl.appendChild(button);
    });
  };

  MTKSettings.prototype.setActiveTab = function setActiveTab(tabId) {
    var tabExists = this.tabs.some(function findTab(tab) {
      return tab.id === tabId;
    });

    if (!tabExists) {
      return;
    }

    this.activeTabId = tabId;
    this.renderTabs();
    this.renderPanel();
    this.publish("mtk-settings:tab-changed", { tabId: tabId });
  };

  MTKSettings.prototype.renderPanel = function renderPanel() {
    var tab = null;

    for (var i = 0; i < this.tabs.length; i += 1) {
      if (this.tabs[i].id === this.activeTabId) {
        tab = this.tabs[i];
        break;
      }
    }

    if (!tab) {
      this.panelEl.innerHTML = '<div class="mtk-settings__empty">Unable to find selected tab.</div>';
      return;
    }

    this.panelEl.classList.remove("mtk-settings__panel--animate");
    void this.panelEl.offsetWidth;
    this.panelEl.classList.add("mtk-settings__panel--animate");

    this.panelEl.id = "mtk-settings-panel-" + tab.id;
    this.panelEl.setAttribute("role", "tabpanel");
    this.panelEl.setAttribute("aria-labelledby", "mtk-settings-tab-" + tab.id);

    var header =
      '<div class="mtk-settings__panel-header">' +
        '<p class="mtk-settings__eyebrow">' + escapeHTML(tab.eyebrow || "") + "</p>" +
        '<h3 class="mtk-settings__panel-title">' + escapeHTML(tab.title || tab.label) + "</h3>" +
        '<p class="mtk-settings__panel-description">' + escapeHTML(tab.description || "") + "</p>" +
      "</div>";

    if (Array.isArray(tab.fields) && tab.fields.length) {
      this.panelEl.innerHTML = header + this.renderForm(tab);
      this.bindForm(tab);
      return;
    }

    this.panelEl.innerHTML = header + '<div class="mtk-settings__empty">This section is ready for fields, cards, or controls.</div>';
  };

  MTKSettings.prototype.renderForm = function renderForm(tab) {
    var self = this;
    var fields = tab.fields.map(function eachField(field) {
      return self.renderField(tab, field);
    }).join("");

    var actions = (tab.actions || []).map(function eachAction(action) {
      var variant = action.variant === "primary" ? "primary" : "secondary";

      return '' +
        '<button class="mtk-settings__button mtk-settings__button--' + variant + '" type="button" ' +
          'data-action-id="' + escapeHTML(action.id) + '" ' +
          'data-event="' + escapeHTML(action.event) + '">' +
          escapeHTML(action.label) +
        "</button>";
    }).join("");

    return '' +
      '<form class="mtk-settings__form" novalidate>' +
        '<div class="mtk-settings__grid">' + fields + "</div>" +
        '<div class="mtk-settings__actions">' + actions + "</div>" +
      "</form>";
  };

  MTKSettings.prototype.renderField = function renderField(tab, field) {
    if (field.type === "textarea") {
      return this.renderTextarea(tab, field);
    }

    if (field.type === "checkboxGroup") {
      return this.renderCheckboxGroup(tab, field);
    }

    return this.renderInput(tab, field);
  };

  MTKSettings.prototype.renderInput = function renderInput(tab, field) {
    var state = this.formState[tab.id] || {};
    var value = state[field.id] || "";
    var required = field.required ? "required" : "";
    var requiredMark = field.required ? " *" : "";
    var placeholder = field.placeholder || " ";
    var fullWidthClass = field.fullWidth ? " mtk-settings__field--full" : "";

    return '' +
      '<div class="mtk-settings__field' + fullWidthClass + '">' +
        '<label class="mtk-settings__field-label" for="mtk-settings-' + tab.id + "-" + field.id + '">' +
          escapeHTML(field.label) + requiredMark +
        "</label>" +
        '<input class="mtk-settings__input" ' +
          'id="mtk-settings-' + tab.id + "-" + field.id + '" ' +
          'name="' + escapeHTML(field.id) + '" ' +
          'type="' + escapeHTML(field.type || "text") + '" ' +
          'value="' + escapeHTML(value) + '" ' +
          'autocomplete="' + escapeHTML(field.autocomplete || "off") + '" ' +
          'placeholder="' + escapeHTML(placeholder) + '" ' +
          required +
        " />" +
      "</div>";
  };

  MTKSettings.prototype.renderTextarea = function renderTextarea(tab, field) {
    var state = this.formState[tab.id] || {};
    var value = state[field.id] || "";
    var required = field.required ? "required" : "";
    var requiredMark = field.required ? " *" : "";
    var rows = field.rows || 4;
    var fullWidthClass = field.fullWidth ? " mtk-settings__field--full" : "";

    return '' +
      '<div class="mtk-settings__field' + fullWidthClass + '">' +
        '<label class="mtk-settings__field-label" for="mtk-settings-' + tab.id + "-" + field.id + '">' +
          escapeHTML(field.label) + requiredMark +
        "</label>" +
        '<textarea class="mtk-settings__textarea" ' +
          'id="mtk-settings-' + tab.id + "-" + field.id + '" ' +
          'name="' + escapeHTML(field.id) + '" ' +
          'rows="' + escapeHTML(rows) + '" ' +
          'placeholder="' + escapeHTML(field.placeholder || "") + '" ' +
          required +
        ">" + escapeHTML(value) + "</textarea>" +
      "</div>";
  };

  MTKSettings.prototype.renderCheckboxGroup = function renderCheckboxGroup(tab, field) {
    var state = this.formState[tab.id] || {};
    var selectedValues = Array.isArray(state[field.id]) ? state[field.id] : [];
    var requiredMark = field.required ? " *" : "";
    var fullWidthClass = field.fullWidth ? " mtk-settings__field--full" : "";

    var options = (field.options || []).map(function eachOption(option) {
      var checked = selectedValues.indexOf(option.value) > -1 ? "checked" : "";

      return '' +
        '<label class="mtk-settings__check">' +
          '<input class="mtk-settings__checkbox" type="checkbox" ' +
            'name="' + escapeHTML(field.id) + '" ' +
            'value="' + escapeHTML(option.value) + '" ' +
            checked +
          " />" +
          '<span class="mtk-settings__check-label">' + escapeHTML(option.label) + "</span>" +
        "</label>";
    }).join("");

    return '' +
      '<fieldset class="mtk-settings__checkbox-card' + fullWidthClass + '" data-checkbox-group="' + escapeHTML(field.id) + '">' +
        '<legend class="mtk-settings__checkbox-title">' + escapeHTML(field.label) + requiredMark + "</legend>" +
        '<div class="mtk-settings__checkbox-grid">' + options + "</div>" +
      "</fieldset>";
  };

  MTKSettings.prototype.bindForm = function bindForm(tab) {
    var self = this;
    var form = this.panelEl.querySelector(".mtk-settings__form");

    if (!form) {
      return;
    }

    Array.prototype.forEach.call(form.querySelectorAll(".mtk-settings__input, .mtk-settings__textarea"), function eachInput(input) {
      input.addEventListener("input", function onInput() {
        self.formState[tab.id] = Object.assign({}, self.formState[tab.id] || {});
        self.formState[tab.id][input.name] = input.value;
      });
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-checkbox-group]"), function eachGroup(group) {
      var fieldId = group.getAttribute("data-checkbox-group");

      Array.prototype.forEach.call(group.querySelectorAll(".mtk-settings__checkbox"), function eachCheckbox(checkbox) {
        checkbox.addEventListener("change", function onChange() {
          self.formState[tab.id] = Object.assign({}, self.formState[tab.id] || {});
          self.formState[tab.id][fieldId] = Array.prototype.map.call(
            group.querySelectorAll(".mtk-settings__checkbox:checked"),
            function toValue(item) {
              return item.value;
            }
          );
        });
      });
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-action-id]"), function eachButton(button) {
      button.addEventListener("click", function onClick() {
        var eventName = button.getAttribute("data-event");
        var actionId = button.getAttribute("data-action-id");

        if (!self.validateTab(tab, form)) {
          return;
        }

        self.publish(eventName, {
          tabId: tab.id,
          actionId: actionId,
          values: Object.assign({}, self.formState[tab.id] || {})
        });
      });
    });
  };

  MTKSettings.prototype.validateTab = function validateTab(tab, form) {
    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }

    var fields = tab.fields || [];

    for (var i = 0; i < fields.length; i += 1) {
      var field = fields[i];

      if (field.type === "checkboxGroup" && field.required) {
        var values = this.formState[tab.id] && this.formState[tab.id][field.id] ? this.formState[tab.id][field.id] : [];

        if (!values.length) {
          var firstCheckbox = form.querySelector('[data-checkbox-group="' + field.id + '"] .mtk-settings__checkbox');

          if (firstCheckbox) {
            firstCheckbox.focus();
          }

          this.publish("mtk-settings:validation-error", {
            tabId: tab.id,
            fieldId: field.id,
            message: field.label + " is required."
          });

          return false;
        }
      }
    }

    return true;
  };

  MTKSettings.prototype.publish = function publish(eventName, payload) {
    var message = {
      component: "mtk-settings",
      event: eventName,
      payload: payload || {}
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
  };

  window.MTKSettings = MTKSettings;

  function initMTKSettings() {
    var root = document.querySelector("mtk-settings.mtk-settings");

    if (!root) {
      window.requestAnimationFrame(initMTKSettings);
      return;
    }

    if (!window.mtkSettingsConfig) {
      window.setTimeout(initMTKSettings, 25);
      return;
    }

    if (root.dataset.mtkSettingsReady === "true") {
      return;
    }

    root.dataset.mtkSettingsReady = "true";
    root.mtkSettings = new window.MTKSettings(root, window.mtkSettingsConfig);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMTKSettings, { once: true });
  } else {
    initMTKSettings();
  }
})(window, document);
