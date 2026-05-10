/* mtk-settings.js */
(function (window, document) {
  "use strict";

  function escapeHTML(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getConfig() {
    var config = window.mtkSettingsConfig || { title: "Profile & Settings", eyebrow: "Account Management", tabs: [] };
    if (window.i18n && typeof window.i18n.applyConfig === "function") {
      window.i18n.applyConfig(config);
    }
    return config;
  }

  function getTabs(config) {
    return config && Array.isArray(config.tabs) ? config.tabs : [];
  }

  function readStoredSettings() {
    try {
      return JSON.parse(window.localStorage.getItem("nala_profile_settings") || "{}") || {};
    } catch (err) {
      return {};
    }
  }

  function getSessionUser() {
    return (window.wc && wc.session && wc.session.user) ? wc.session.user : {};
  }

  function iconMarkup(iconName) {
    if (!iconName) {
      return "";
    }

    if (iconName === "save") {
      return '' +
        '<span class="mtk-settings__button-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" focusable="false">' +
            '<path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4ZM12 19a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM6 5h9v5H6V5Z"></path>' +
          '</svg>' +
        '</span>';
    }

    return '<span class="mtk-settings__tab-icon" aria-hidden="true">' + escapeHTML(iconName) + '</span>';
  }

  function MTKSettings(root, config) {
    this.root = root;
    this.config = config || getConfig();
    this.tabs = getTabs(this.config);
    this.activeTabId = this.tabs.length ? this.tabs[0].id : "";
    this.formState = {};
    this.tabsEl = root.querySelector(".mtk-settings__tabs");
    this.panelEl = root.querySelector(".mtk-settings__panel");
    this.titleEl = root.querySelector("[data-title]");
    this.eyebrowEl = root.querySelector("[data-eyebrow]");
    this.onMessage = this.onMessage.bind(this);
    this.init();
  }

  MTKSettings.prototype.init = function () {
    if (!this.tabsEl || !this.panelEl) {
      return;
    }

    if (this.titleEl) {
      this.titleEl.textContent = this.config.title || "Profile & Settings";
    }

    if (this.eyebrowEl) {
      this.eyebrowEl.textContent = this.config.eyebrow || "Account Management";
    }

    this.cacheInitialValues();

    if (!this.tabs.length) {
      this.panelEl.innerHTML = '<div class="mtk-settings__empty">Settings configuration is missing.</div>';
      return;
    }

    this.renderTabs();
    this.renderPanel();

    if (window.wc && typeof window.wc.subscribe === "function") {
      window.wc.subscribe("4-mtk-settings", this.onMessage);
    }
  };

  MTKSettings.prototype.cacheInitialValues = function () {
    var self = this;
    var stored = readStoredSettings();
    var user = getSessionUser();

    this.tabs.forEach(function (tab) {
      self.formState[tab.id] = {};

      if (!Array.isArray(tab.fields)) {
        return;
      }

      tab.fields.forEach(function (field) {
        var storedValue = stored[tab.id] ? stored[tab.id][field.id] : undefined;
        var userValue = self.sessionValue(tab.id, field.id, user);

        if (field.type === "checkboxGroup") {
          self.formState[tab.id][field.id] = Array.isArray(storedValue) ? storedValue : [];
          return;
        }

        self.formState[tab.id][field.id] = storedValue !== undefined ? storedValue : (userValue !== undefined ? userValue : (field.value || ""));
      });
    });
  };

  MTKSettings.prototype.sessionValue = function (tabId, fieldId, user) {
    user = user || {};
    if (tabId === "privacy") {
      if (fieldId === "fullName") return user.name || user.full_name || "";
      if (fieldId === "emailAddress") return user.email || "";
      if (fieldId === "contactPhoneNumber") return user.phone || user.phone_number || "";
      if (fieldId === "password") return "********";
    }
    if (tabId === "business" && fieldId === "businessWebsite") {
      var uid = String(
        (window.wc && wc.session && wc.session.nalaUID) ||
        user.nalaUID ||
        user.id ||
        user.user_id ||
        user.email ||
        ""
      ).replace(/[^a-zA-Z0-9_-]/g, "");
      if (uid) {
        return window.location.origin + "/repo_deploy/client/index.html?nalaUID=" + encodeURIComponent(uid);
      }
    }
    return undefined;
  };

  MTKSettings.prototype.onMessage = function (message) {
    if (!message || typeof message !== "object") {
      return;
    }

    if (message.type === "select-tab" && message.tabId) {
      this.setActiveTab(message.tabId);
    }
  };

  MTKSettings.prototype.findTab = function (tabId) {
    var found = null;

    this.tabs.forEach(function (tab) {
      if (tab.id === tabId) {
        found = tab;
      }
    });

    return found;
  };

  MTKSettings.prototype.renderTabs = function () {
    var self = this;
    this.tabsEl.innerHTML = "";

    this.tabs.forEach(function (tab) {
      var button = document.createElement("button");
      button.className = "mtk-settings__tab";
      button.type = "button";
      button.id = "mtk-settings-tab-" + tab.id;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(tab.id === self.activeTabId));
      button.setAttribute("aria-controls", "mtk-settings-panel-" + tab.id);
      button.innerHTML =
        '<span class="mtk-settings__tab-icon" aria-hidden="true">' + escapeHTML(tab.icon || "settings") + '</span>' +
        '<span class="mtk-settings__tab-label">' + escapeHTML(tab.label || "") + '</span>';

      button.addEventListener("click", function () {
        self.setActiveTab(tab.id);
      });

      self.tabsEl.appendChild(button);
    });
  };

  MTKSettings.prototype.setActiveTab = function (tabId) {
    if (!this.findTab(tabId)) {
      return;
    }

    this.activeTabId = tabId;
    this.renderTabs();
    this.renderPanel();
    this.publish("mtk-settings:tab-changed", { tabId: tabId });
  };

  MTKSettings.prototype.renderPanel = function () {
    var tab = this.findTab(this.activeTabId);

    if (!tab) {
      this.panelEl.innerHTML = '<div class="mtk-settings__empty">No tab selected.</div>';
      return;
    }

    this.panelEl.classList.remove("mtk-settings__panel--animate");
    this.panelEl.offsetWidth;
    this.panelEl.classList.add("mtk-settings__panel--animate");

    this.panelEl.id = "mtk-settings-panel-" + tab.id;
    this.panelEl.setAttribute("role", "tabpanel");
    this.panelEl.setAttribute("aria-labelledby", "mtk-settings-tab-" + tab.id);

    var header =
      '<div class="mtk-settings__panel-header">' +
        '<p class="mtk-settings__eyebrow">' + escapeHTML(tab.eyebrow || "") + '</p>' +
        '<h3 class="mtk-settings__panel-title">' + escapeHTML(tab.title || tab.label || "") + '</h3>' +
        '<p class="mtk-settings__panel-description">' + escapeHTML(tab.description || "") + '</p>' +
      '</div>';

    if (Array.isArray(tab.fields) && tab.fields.length) {
      this.panelEl.innerHTML = header + this.renderForm(tab);
      this.bindForm(tab);
      return;
    }

    this.panelEl.innerHTML = header + '<div class="mtk-settings__empty">This section is ready for fields, cards, or controls.</div>';
  };

  MTKSettings.prototype.renderForm = function (tab) {
    var self = this;
    var fields = tab.fields.map(function (field) {
      return self.renderField(tab, field);
    }).join("");

    var actions = (tab.actions || []).map(function (action) {
      var variant = action.variant === "primary" ? "primary" : "secondary";
      return '' +
        '<button class="mtk-settings__button mtk-settings__button--' + variant + '" type="button" data-action-id="' + escapeHTML(action.id) + '" data-event="' + escapeHTML(action.event) + '">' +
          iconMarkup(action.icon) +
          '<span class="mtk-settings__button-label">' + escapeHTML(action.label || "Save") + '</span>' +
        '</button>';
    }).join("");

    var requiredNote = tab.fields && tab.fields.some(function (field) { return field.required; })
      ? '<p class="mtk-settings__required-note">Fields marked with an asterisk (*) are required.</p>'
      : '';

    return '' +
      '<form class="mtk-settings__form" novalidate>' +
        requiredNote +
        '<div class="mtk-settings__grid">' + fields + '</div>' +
        '<div class="mtk-settings__actions">' + actions + '</div>' +
      '</form>';
  };

  MTKSettings.prototype.renderField = function (tab, field) {
    if (field.type === "textarea") {
      return this.renderTextarea(tab, field);
    }

    if (field.type === "checkboxGroup") {
      return this.renderCheckboxGroup(tab, field);
    }

    return this.renderInput(tab, field);
  };

  MTKSettings.prototype.renderInput = function (tab, field) {
    var value = this.formState[tab.id] ? this.formState[tab.id][field.id] || "" : "";
    var required = field.required ? " required" : "";
    var requiredMark = field.required ? " *" : "";
    var fullWidthClass = field.fullWidth ? " mtk-settings__field--full" : "";

    var isPassword = (field.type || "") === "password";
    var inputType = isPassword ? "password" : (field.type || "text");
    var input = '<input class="mtk-settings__input" id="mtk-settings-' + escapeHTML(tab.id) + '-' + escapeHTML(field.id) + '" name="' + escapeHTML(field.id) + '" type="' + escapeHTML(inputType) + '" value="' + escapeHTML(value) + '" placeholder="' + escapeHTML(field.placeholder || "") + '"' + required + '>';
    if (isPassword) {
      input = '<div class="mtk-settings__password-wrap">' +
        input +
        '<button class="mtk-settings__password-toggle" type="button" data-password-toggle aria-label="Show password">' +
          '<span class="material-icons" aria-hidden="true">visibility</span>' +
        '</button>' +
      '</div>';
    }

    return '' +
      '<div class="mtk-settings__field' + fullWidthClass + '">' +
        '<label class="mtk-settings__field-label" for="mtk-settings-' + escapeHTML(tab.id) + '-' + escapeHTML(field.id) + '">' + escapeHTML(field.label) + requiredMark + '</label>' +
        input +
      '</div>';
  };

  MTKSettings.prototype.renderTextarea = function (tab, field) {
    var value = this.formState[tab.id] ? this.formState[tab.id][field.id] || "" : "";
    var required = field.required ? " required" : "";
    var requiredMark = field.required ? " *" : "";
    var rows = field.rows || 4;
    var fullWidthClass = field.fullWidth ? " mtk-settings__field--full" : "";

    return '' +
      '<div class="mtk-settings__field' + fullWidthClass + '">' +
        '<label class="mtk-settings__field-label" for="mtk-settings-' + escapeHTML(tab.id) + '-' + escapeHTML(field.id) + '">' + escapeHTML(field.label) + requiredMark + '</label>' +
        '<textarea class="mtk-settings__textarea" id="mtk-settings-' + escapeHTML(tab.id) + '-' + escapeHTML(field.id) + '" name="' + escapeHTML(field.id) + '" rows="' + escapeHTML(rows) + '" placeholder="' + escapeHTML(field.placeholder || "") + '"' + required + '>' + escapeHTML(value) + '</textarea>' +
      '</div>';
  };

  MTKSettings.prototype.renderCheckboxGroup = function (tab, field) {
    var requiredMark = field.required ? " *" : "";
    var fullWidthClass = field.fullWidth ? " mtk-settings__field--full" : "";
    var selected = this.formState[tab.id] && Array.isArray(this.formState[tab.id][field.id]) ? this.formState[tab.id][field.id] : [];

    var options = (field.options || []).map(function (option) {
      var checked = selected.indexOf(option.value) > -1 ? " checked" : "";
      return '' +
        '<label class="mtk-settings__check">' +
          '<input class="mtk-settings__checkbox" type="checkbox" name="' + escapeHTML(field.id) + '" value="' + escapeHTML(option.value) + '"' + checked + '>' +
          '<span class="mtk-settings__check-label">' + escapeHTML(option.label) + '</span>' +
        '</label>';
    }).join("");

    return '' +
      '<fieldset class="mtk-settings__checkbox-card' + fullWidthClass + '" data-checkbox-group="' + escapeHTML(field.id) + '">' +
        '<legend class="mtk-settings__checkbox-title">' + escapeHTML(field.label) + requiredMark + '</legend>' +
        '<div class="mtk-settings__checkbox-grid">' + options + '</div>' +
      '</fieldset>';
  };

  MTKSettings.prototype.bindForm = function (tab) {
    var self = this;
    var form = this.panelEl.querySelector(".mtk-settings__form");

    if (!form) {
      return;
    }

    Array.prototype.forEach.call(form.querySelectorAll(".mtk-settings__input, .mtk-settings__textarea"), function (input) {
      input.addEventListener("input", function () {
        self.formState[tab.id][input.name] = input.value;
      });
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-checkbox-group]"), function (group) {
      var fieldId = group.getAttribute("data-checkbox-group");

      Array.prototype.forEach.call(group.querySelectorAll(".mtk-settings__checkbox"), function (checkbox) {
        checkbox.addEventListener("change", function () {
          self.formState[tab.id][fieldId] = Array.prototype.map.call(
            group.querySelectorAll(".mtk-settings__checkbox:checked"),
            function (item) {
              return item.value;
            }
          );
        });
      });
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-action-id]"), function (button) {
      button.addEventListener("click", function () {
        var eventName = button.getAttribute("data-event");
        var actionId = button.getAttribute("data-action-id");

        if (actionId !== "changePassword" && !self.validateTab(tab, form)) {
          return;
        }

        self.publish(eventName, {
          tabId: tab.id,
          actionId: actionId,
          values: self.formState[tab.id]
        });
      });
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-password-toggle]"), function (button) {
      button.addEventListener("click", function () {
        var wrap = button.closest(".mtk-settings__password-wrap");
        var input = wrap ? wrap.querySelector("input") : null;
        if (!input) return;
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        button.setAttribute("aria-label", show ? "Hide password" : "Show password");
        button.querySelector(".material-icons").textContent = show ? "visibility_off" : "visibility";
      });
    });
  };

  MTKSettings.prototype.validateTab = function (tab, form) {
    var fields = tab.fields || [];

    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }

    for (var i = 0; i < fields.length; i += 1) {
      if (fields[i].type === "checkboxGroup" && fields[i].required) {
        var values = this.formState[tab.id][fields[i].id] || [];
        if (!values.length) {
          var firstCheckbox = form.querySelector('[data-checkbox-group="' + fields[i].id + '"] .mtk-settings__checkbox');
          if (firstCheckbox) {
            firstCheckbox.focus();
          }
          return false;
        }
      }
    }

    return true;
  };

  MTKSettings.prototype.publish = function (eventName, payload) {
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

    this.root.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: message }));
  };

  window.MTKSettings = MTKSettings;

  function initMTKSettings() {
    var root = document.querySelector("mtk-settings.mtk-settings");

    if (!root) {
      window.setTimeout(initMTKSettings, 30);
      return;
    }

    if (root.getAttribute("data-mtk-settings-ready") === "true") {
      return;
    }

    root.setAttribute("data-mtk-settings-ready", "true");
    root.mtkSettings = new window.MTKSettings(root, getConfig());
  }

  initMTKSettings();
})(window, document);
