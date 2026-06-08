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

  function hasBusinessInABox() {
    var user = getSessionUser();
    return Number(user.has_business_in_a_box || 0) === 1;
  }

  function getBiabSections() {
    var config = window.MTK_BIAB_CONFIG || {};
    return Array.isArray(config.sections) ? config.sections : [];
  }

  function orderedBiabSections() {
    var order = ["client-url", "logo", "business-card", "website-builder", "google-seo", "invoices", "customer-reviews"];
    return getBiabSections().slice().sort(function (a, b) {
      var aIndex = order.indexOf(a && a.id);
      var bIndex = order.indexOf(b && b.id);
      if (aIndex === -1) aIndex = order.length + 1;
      if (bIndex === -1) bIndex = order.length + 1;
      return aIndex - bIndex;
    });
  }

  function buildTabs(config) {
    var tabs = getTabs(config).slice();
    if (!hasBusinessInABox()) {
      return tabs.filter(function (tab) {
        return tab && tab.id === "privacy";
      });
    }

    orderedBiabSections().forEach(function (section) {
      if (!section || section.id === "introduction") {
        return;
      }
      tabs.push({
        id: "biab-" + section.id,
        label: section.label || section.title || "BIAB",
        icon: section.icon || "work",
        title: section.title || section.label || "Business in a Box",
        description: section.description || "",
        nextStep: section.nextStep || section.body || "",
        type: "biab",
        biabSectionId: section.id
      });
    });

    return tabs;
  }

  function translate(key, fallback) {
    if (window.wc && typeof window.wc.t === "function") {
      return window.wc.t(key, fallback);
    }

    if (window.i18n && typeof window.i18n.t === "function") {
      var value = window.i18n.t(key);
      if (value && value !== key) {
        return value;
      }
    }

    return fallback || key;
  }

  function readStoredSettings() {
    try {
      return JSON.parse(window.localStorage.getItem("nala_profile_settings") || "{}") || {};
    } catch (err) {
      return {};
    }
  }

  function normalizeCustomServices(value) {
    if (Array.isArray(value)) {
      return value.map(function (item) {
        if (typeof item === "string") {
          return { label: item, checked: true };
        }
        return {
          label: item && item.label ? String(item.label) : "",
          checked: item && item.checked === false ? false : true
        };
      }).filter(function (item) {
        return item.label || item.checked;
      });
    }

    return String(value || "")
      .split(/\r?\n/)
      .map(function (item) { return item.trim(); })
      .filter(Boolean)
      .map(function (item) {
        return { label: item, checked: true };
      });
  }

  function isPasswordMask(value) {
    return /^[*•]+$/.test(String(value || ""));
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
    this.tabs = buildTabs(this.config);
    this.activeTabId = this.initialTabId();
    this.formState = {};
    this.tabsEl = root.querySelector(".mtk-settings__tabs");
    this.panelEl = root.querySelector(".mtk-settings__panel");
    this.titleEl = root.querySelector("[data-title]");
    this.eyebrowEl = root.querySelector("[data-eyebrow]");
    this.onMessage = this.onMessage.bind(this);
    this.onLanguageChange = this.onLanguageChange.bind(this);
    this.onBiabSettingsRequest = this.onBiabSettingsRequest.bind(this);
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

    document.addEventListener("i18n:changed", this.onLanguageChange);
    document.addEventListener("mtk-settings:select-tab", this.onBiabSettingsRequest);
  };

  MTKSettings.prototype.onBiabSettingsRequest = function (event) {
    var detail = event && event.detail ? event.detail : {};
    if (detail.tabId) {
      this.setActiveTab(detail.tabId);
      return;
    }
    if (detail.direction) {
      this.goAdjacentStep(detail.direction);
    }
  };

  MTKSettings.prototype.onLanguageChange = function () {
    if (window.i18n && typeof window.i18n.applyConfig === "function") {
      window.i18n.applyConfig(this.config);
    }
    this.tabs = buildTabs(this.config);
    if (!this.findTab(this.activeTabId)) {
      this.activeTabId = this.initialTabId();
    }
    if (this.titleEl) {
      this.titleEl.textContent = this.config.title || "Profile & Settings";
    }
    if (this.eyebrowEl) {
      this.eyebrowEl.textContent = this.config.eyebrow || "Account Management";
    }
    this.renderTabs();
    this.renderPanel();
  };

  MTKSettings.prototype.cacheInitialValues = function () {
    var self = this;
    var stored = readStoredSettings();
    var user = getSessionUser();

    getTabs(this.config).forEach(function (tab) {
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

        if (field.type === "customServiceList") {
          self.formState[tab.id][field.id] = normalizeCustomServices(storedValue);
          return;
        }

        if (field.type === "password") {
          var passwordValue = storedValue !== undefined ? storedValue : (userValue !== undefined ? userValue : (field.value || ""));
          self.formState[tab.id][field.id] = isPasswordMask(passwordValue) ? "" : passwordValue;
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
      if (fieldId === "password") return user.password || user.raw_password || user.plainPassword || "";
    }
    return undefined;
  };

  MTKSettings.prototype.initialTabId = function () {
    var requested = window.__nalaSettingsTargetTab || "";
    var hash = String(window.location.hash || "").replace(/^#\/?/, "");
    if (!requested && hash.indexOf("settings:") === 0) {
      requested = hash.slice("settings:".length);
    }
    if (!requested && hash === "biab") {
      requested = this.firstIncompleteBiabTabId();
    }
    return this.findTab(requested) ? requested : (this.tabs.length ? this.tabs[0].id : "");
  };

  MTKSettings.prototype.firstIncompleteBiabTabId = function () {
    var stored = readStoredSettings();
    var uid = this.businessPageId();
    var business = stored.business || {};
    var services = stored.services || {};
    var hasBusiness = !!(String(business.customerFacingBusinessName || business.legalBusinessName || "").trim() && String(business.businessPhone || "").trim() && String(business.businessEmail || "").trim());
    var hasServices = !!(String(services.serviceArea || "").trim() && ((Array.isArray(services.launchServices) && services.launchServices.length) || normalizeCustomServices(services.customServices).some(function (row) { return row.checked !== false && String(row.label || "").trim(); })));
    var hasUrl = !!String(business.businessWebsite || business.website || "").trim();
    var hasLogo = false;
    var hasCard = false;
    try {
      hasLogo = !!JSON.parse(window.localStorage.getItem("nala_biab_logo_" + uid) || "null");
      hasCard = !!JSON.parse(window.localStorage.getItem("nala_biab_ordered_card_" + uid) || "null");
    } catch (err) {}

    if (!hasBusiness) return "business";
    if (!hasServices) return "services";
    if (!hasUrl) return "biab-client-url";
    if (!hasLogo) return "biab-logo";
    if (!hasCard) return "biab-business-card";
    return "biab-website-builder";
  };

  MTKSettings.prototype.businessPageId = function () {
    var user = getSessionUser();
    return String(
      (window.wc && wc.session && wc.session.nalaUID) ||
      user.nalaUID ||
      user.id ||
      user.user_id ||
      user.email ||
      "demo"
    ).replace(/[^a-zA-Z0-9_-]/g, "");
  };

  MTKSettings.prototype.guidedSetupStorageKey = function () {
    return "nala_biab_setup_complete_" + this.businessPageId();
  };

  MTKSettings.prototype.isGuidedSetupActive = function () {
    try {
      return hasBusinessInABox() && window.localStorage.getItem(this.guidedSetupStorageKey()) !== "1";
    } catch (err) {
      return hasBusinessInABox();
    }
  };

  MTKSettings.prototype.completeGuidedSetup = function () {
    try {
      window.localStorage.setItem(this.guidedSetupStorageKey(), "1");
    } catch (err) {}

    if (window.MTKMsgs && typeof window.MTKMsgs.show === "function") {
      window.MTKMsgs.show({
        type: "success",
        icon: "check_circle",
        message: "Business in a Box setup is complete. You can keep using the tabs any time.",
        closable: true,
        timer: 6
      });
    }

    this.renderTabs();
    this.renderPanel();
  };

  MTKSettings.prototype.shouldShowStepNav = function () {
    return this.isGuidedSetupActive() && this.tabs.length > 1;
  };

  MTKSettings.prototype.clientUrlPayload = function () {
    var user = getSessionUser();
    var business = this.formState.business || {};
    var services = this.formState.services || {};
    var privacy = this.formState.privacy || {};

    return {
      uid: String(
        (window.wc && wc.session && wc.session.nalaUID) ||
        user.nalaUID ||
        user.id ||
        user.user_id ||
        user.email ||
        ""
      ).replace(/[^a-zA-Z0-9_-]/g, ""),
      businessName: business.customerFacingBusinessName || business.legalBusinessName || "",
      legalName: business.legalBusinessName || "",
      ownerName: business.ownerOrResponsiblePartyName || privacy.fullName || user.name || "",
      serviceArea: services.serviceArea || "",
      email: business.businessEmail || privacy.emailAddress || user.email || "",
      phone: business.businessPhone || privacy.contactPhoneNumber || user.phone || ""
    };
  };

  MTKSettings.prototype.clientUrlOptions = function (count) {
    if (!window.nalaClientUrl || typeof window.nalaClientUrl.options !== "function") {
      return [];
    }
    return window.nalaClientUrl.options(this.clientUrlPayload(), count || 12);
  };

  MTKSettings.prototype.syncBusinessWebsiteOptions = function (form) {
    form = form || this.panelEl.querySelector(".mtk-settings__form");
    if (!form || this.activeTabId !== "business") return;

    var input = form.querySelector('[name="businessWebsite"]');
    var options = this.clientUrlOptions(12);
    if (!input || !options.length) return;

    input.placeholder = options[0].url;
  };

  MTKSettings.prototype.onMessage = function (message) {
    if (!message || typeof message !== "object") {
      return;
    }

    if (message.type === "select-tab" && message.tabId) {
      this.setActiveTab(message.tabId);
    }

    if (message.type === "select-biab-step" && message.sectionId) {
      this.setActiveTab("biab-" + message.sectionId);
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
        (tab.nextStep ? '<p class="mtk-settings__next-step"><span class="material-icons" aria-hidden="true">arrow_forward</span><span>' + escapeHTML(tab.nextStep) + '</span></p>' : '') +
      '</div>';

    if (Array.isArray(tab.fields) && tab.fields.length) {
      this.panelEl.innerHTML = header + this.renderForm(tab) + (this.shouldShowStepNav(tab) ? this.renderStepNav(tab) : "");
      this.bindForm(tab);
      if (this.shouldShowStepNav(tab)) this.bindStepNav();
      return;
    }

    if (tab.type === "biab") {
      this.panelEl.innerHTML = header + this.renderBiabTab(tab) + (this.shouldShowStepNav(tab) ? this.renderStepNav(tab) : "");
      if (window.MtkBiab && typeof window.MtkBiab.initWhenReady === "function") {
        window.MtkBiab.initWhenReady();
      }
      if (this.shouldShowStepNav(tab)) this.bindStepNav();
      return;
    }

    this.panelEl.innerHTML = header + '<div class="mtk-settings__empty">This section is ready for fields, cards, or controls.</div>' + (this.shouldShowStepNav(tab) ? this.renderStepNav(tab) : "");
    if (this.shouldShowStepNav(tab)) this.bindStepNav();
  };

  MTKSettings.prototype.renderBiabTab = function (tab) {
    return '' +
      '<div class="mtk-settings__biab-tab">' +
        '<mtk-biab class="mtk-biab mtk-biab--settings" data-embedded="settings" data-embedded-section="' + escapeHTML(tab.biabSectionId || "") + '"></mtk-biab>' +
      '</div>';
  };

  MTKSettings.prototype.renderStepNav = function (tab) {
    var index = this.tabs.findIndex(function (item) { return item.id === tab.id; });
    var previous = index > 0 ? this.tabs[index - 1] : null;
    var next = index > -1 && index < this.tabs.length - 1 ? this.tabs[index + 1] : null;

    return '' +
      '<nav class="mtk-settings__step-nav" aria-label="Setup step navigation">' +
        '<button class="mtk-settings__step-arrow" type="button" data-settings-step-direction="previous"' + (previous ? "" : " disabled") + '>' +
          '<span class="material-icons" aria-hidden="true">chevron_left</span>' +
          '<span>' + escapeHTML(previous ? "Previous: " + (previous.label || previous.title || "Step") : "Previous") + '</span>' +
        '</button>' +
        '<button class="mtk-settings__step-arrow mtk-settings__step-arrow--next" type="button" data-settings-step-direction="next">' +
          '<span>' + escapeHTML(next ? "Next: " + (next.label || next.title || "Step") : "Finish setup") + '</span>' +
          '<span class="material-icons" aria-hidden="true">chevron_right</span>' +
        '</button>' +
      '</nav>';
  };

  MTKSettings.prototype.renderForm = function (tab) {
    var self = this;
    var fields = tab.fields.map(function (field) {
      return self.renderField(tab, field);
    }).join("");

    var actionSource = this.shouldShowStepNav(tab)
      ? (tab.actions || []).filter(function (action) { return action.variant !== "primary"; })
      : (tab.actions || []);

    var actions = actionSource.map(function (action) {
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

    if (field.type === "customServiceList") {
      return this.renderCustomServiceList(tab, field);
    }

    return this.renderInput(tab, field);
  };

  MTKSettings.prototype.renderInput = function (tab, field) {
    var value = this.formState[tab.id] ? this.formState[tab.id][field.id] || "" : "";
    var fullWidthClass = field.fullWidth ? " mtk-settings__field--full" : "";

    var isPassword = (field.type || "") === "password";
    var required = field.required && !isPassword ? " required" : "";
    var requiredMark = field.required ? " *" : "";
    var inputType = isPassword ? "password" : (field.type || "text");
    var passwordPlaceholder = isPassword && !value ? ' data-password-empty="true"' : "";
    var input = '<input class="mtk-settings__input" id="mtk-settings-' + escapeHTML(tab.id) + '-' + escapeHTML(field.id) + '" name="' + escapeHTML(field.id) + '" type="' + escapeHTML(inputType) + '" value="' + escapeHTML(value) + '" placeholder="' + escapeHTML(field.placeholder || "") + '"' + required + passwordPlaceholder + '>';
    if (isPassword) {
      input = '<div class="mtk-settings__password-wrap">' +
        input +
        '<button class="mtk-settings__password-toggle" type="button" data-password-toggle aria-label="Show password">' +
          '<span class="material-icons" aria-hidden="true">visibility</span>' +
        '</button>' +
      '</div>';
    }

    return '' +
      '<div class="mtk-settings__field' + fullWidthClass + (isPassword ? " mtk-settings__field--password" : "") + '">' +
        '<label class="mtk-settings__field-label" for="mtk-settings-' + escapeHTML(tab.id) + '-' + escapeHTML(field.id) + '">' + escapeHTML(field.label) + requiredMark + '</label>' +
        input +
        (field.helpText ? '<p class="mtk-settings__field-help">' + escapeHTML(field.helpText) + '</p>' : '') +
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
        (field.helpText ? '<p class="mtk-settings__field-help">' + escapeHTML(field.helpText) + '</p>' : '') +
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
        (field.helpText ? '<p class="mtk-settings__field-help mtk-settings__field-help--card">' + escapeHTML(field.helpText) + '</p>' : '') +
        '<div class="mtk-settings__checkbox-grid">' + options + '</div>' +
      '</fieldset>';
  };

  MTKSettings.prototype.renderCustomServiceList = function (tab, field) {
    var fullWidthClass = field.fullWidth ? " mtk-settings__field--full" : "";
    var rows = normalizeCustomServices(this.formState[tab.id] ? this.formState[tab.id][field.id] : []);
    this.formState[tab.id][field.id] = rows;
    var hasCheckedRows = rows.some(function (row) { return row.checked !== false; });

    var rowMarkup = rows.map(function (row, index) {
      return '' +
        '<label class="mtk-settings__custom-service-row" data-custom-service-row="' + escapeHTML(index) + '">' +
          '<input class="mtk-settings__checkbox mtk-settings__custom-service-checkbox" type="checkbox"' + (row.checked ? " checked" : "") + '>' +
          '<input class="mtk-settings__input mtk-settings__custom-service-input" type="text" value="' + escapeHTML(row.label || "") + '" placeholder="' + escapeHTML(field.placeholder || "Service name") + '">' +
        '</label>';
    }).join("");

    return '' +
      '<div class="mtk-settings__field' + fullWidthClass + '" data-custom-service-list="' + escapeHTML(field.id) + '">' +
        '<div class="mtk-settings__custom-service-head">' +
          '<label class="mtk-settings__field-label">' + escapeHTML(field.label || "Add custom services") + '</label>' +
          '<div class="mtk-settings__custom-service-actions">' +
            '<button class="mtk-settings__add-service" type="button" data-custom-service-add="' + escapeHTML(field.id) + '">' +
              '<span class="material-icons" aria-hidden="true">add</span>' +
              '<span>' + escapeHTML(field.buttonLabel || "Add service") + '</span>' +
            '</button>' +
            '<button class="mtk-settings__remove-service" type="button" data-custom-service-remove="' + escapeHTML(field.id) + '"' + (hasCheckedRows ? "" : " disabled") + '>' +
              '<span class="material-icons" aria-hidden="true">delete</span>' +
              '<span>' + escapeHTML(field.removeButtonLabel || "Remove service") + '</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
        (field.helpText ? '<p class="mtk-settings__field-help">' + escapeHTML(field.helpText) + '</p>' : '') +
        '<div class="mtk-settings__custom-service-list">' + rowMarkup + '</div>' +
      '</div>';
  };

  MTKSettings.prototype.bindForm = function (tab) {
    var self = this;
    var form = this.panelEl.querySelector(".mtk-settings__form");

    if (!form) {
      return;
    }

    Array.prototype.forEach.call(form.querySelectorAll(".mtk-settings__input, .mtk-settings__textarea"), function (input) {
      input.addEventListener("input", function () {
        if (input.type === "tel" && window.nalaPhone && typeof window.nalaPhone.format === "function") {
          input.value = window.nalaPhone.format(input.value);
        }
        self.formState[tab.id][input.name] = input.value;
        if (tab.id === "business" && input.name !== "businessWebsite") {
          self.syncBusinessWebsiteOptions(form);
        }
      });
    });

    if (tab.id === "business") {
      this.syncBusinessWebsiteOptions(form);
    }

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
          values: self.formState[tab.id],
          guidedAutoAdvance: actionId !== "changePassword",
          nextTabLabel: self.nextTabLabel(tab.id)
        });

        if (actionId !== "changePassword") {
          self.announceSavedAndAdvance(tab.id);
        }
      });
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-custom-service-list]"), function (list) {
      var fieldId = list.getAttribute("data-custom-service-list");
      var sync = function () {
        self.updateCustomServiceState(tab.id, fieldId, list);
        self.updateCustomServiceRemoveButton(form, fieldId);
      };

      Array.prototype.forEach.call(list.querySelectorAll(".mtk-settings__custom-service-checkbox"), function (checkbox) {
        checkbox.addEventListener("change", sync);
      });

      Array.prototype.forEach.call(list.querySelectorAll(".mtk-settings__custom-service-input"), function (input) {
        input.addEventListener("input", sync);
      });
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-custom-service-add]"), function (button) {
      button.addEventListener("click", function () {
        var fieldId = button.getAttribute("data-custom-service-add");
        self.addCustomServiceRow(tab.id, fieldId);
      });
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-custom-service-remove]"), function (button) {
      button.addEventListener("click", function () {
        var fieldId = button.getAttribute("data-custom-service-remove");
        self.removeCheckedCustomServiceRows(tab.id, fieldId);
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

  MTKSettings.prototype.updateCustomServiceState = function (tabId, fieldId, list) {
    var rows = Array.prototype.map.call(list.querySelectorAll("[data-custom-service-row]"), function (row) {
      var checkbox = row.querySelector(".mtk-settings__custom-service-checkbox");
      var input = row.querySelector(".mtk-settings__custom-service-input");
      return {
        label: input ? input.value : "",
        checked: checkbox ? checkbox.checked : true
      };
    }).filter(function (row) {
      return row.label.trim() || row.checked;
    });

    this.formState[tabId][fieldId] = rows;
  };

  MTKSettings.prototype.updateCustomServiceRemoveButton = function (form, fieldId) {
    var button = form ? form.querySelector('[data-custom-service-remove="' + fieldId + '"]') : null;
    if (!button) return;
    var rows = normalizeCustomServices(this.formState[this.activeTabId] ? this.formState[this.activeTabId][fieldId] : []);
    button.disabled = !rows.some(function (row) {
      return row.checked !== false;
    });
  };

  MTKSettings.prototype.removeCheckedCustomServiceRows = function (tabId, fieldId) {
    var currentList = this.panelEl.querySelector('[data-custom-service-list="' + fieldId + '"]');
    if (currentList) {
      this.updateCustomServiceState(tabId, fieldId, currentList);
    }

    var rows = normalizeCustomServices(this.formState[tabId] ? this.formState[tabId][fieldId] : []);
    var remainingRows = rows.filter(function (row) {
      return row.checked === false;
    });

    if (remainingRows.length === rows.length) {
      return;
    }

    this.formState[tabId][fieldId] = remainingRows;
    this.renderPanel();
  };

  MTKSettings.prototype.addCustomServiceRow = function (tabId, fieldId) {
    var currentList = this.panelEl.querySelector('[data-custom-service-list="' + fieldId + '"]');
    var currentRows = currentList ? currentList.querySelectorAll("[data-custom-service-row]") : [];
    for (var rowIndex = 0; rowIndex < currentRows.length; rowIndex += 1) {
      var currentInput = currentRows[rowIndex].querySelector(".mtk-settings__custom-service-input");
      if (currentInput && !currentInput.value.trim()) {
        currentInput.focus();
        return;
      }
    }

    if (currentList) {
      this.updateCustomServiceState(tabId, fieldId, currentList);
    }

    var rows = normalizeCustomServices(this.formState[tabId] ? this.formState[tabId][fieldId] : []);
    var blankIndex = -1;

    rows.forEach(function (row, index) {
      if (!String(row.label || "").trim()) {
        blankIndex = index;
      }
    });

    if (blankIndex > -1) {
      this.focusCustomServiceRow(fieldId, blankIndex);
      return;
    }

    rows.push({ label: "", checked: true });
    this.formState[tabId][fieldId] = rows;
    this.renderPanel();
    this.focusCustomServiceRow(fieldId, rows.length - 1);
  };

  MTKSettings.prototype.bindStepNav = function () {
    var self = this;
    Array.prototype.forEach.call(this.panelEl.querySelectorAll("[data-settings-step-direction]"), function (button) {
      button.addEventListener("click", function () {
        self.goAdjacentStep(button.getAttribute("data-settings-step-direction"));
      });
    });
  };

  MTKSettings.prototype.nextTabLabel = function (tabId) {
    var index = this.tabs.findIndex(function (tab) { return tab.id === tabId; });
    var next = index > -1 ? this.tabs[index + 1] : null;
    return next ? (next.label || next.title || "next step") : "";
  };

  MTKSettings.prototype.goAdjacentStep = function (direction) {
    var index = this.tabs.findIndex(function (tab) { return tab.id === this.activeTabId; }, this);
    if (index < 0) return;

    if (direction === "next" && this.isGuidedSetupActive()) {
      var current = this.tabs[index];
      var form = this.panelEl.querySelector(".mtk-settings__form");
      if (form && !this.saveCurrentStep(current, form)) {
        return;
      }
    }

    var nextIndex = direction === "previous" ? index - 1 : index + 1;
    var next = this.tabs[nextIndex];
    if (!next) {
      if (direction === "next" && this.isGuidedSetupActive()) {
        this.completeGuidedSetup();
      }
      return;
    }
    this.setActiveTab(next.id);
  };

  MTKSettings.prototype.saveCurrentStep = function (tab, form) {
    if (!tab || !Array.isArray(tab.actions)) return true;
    var action = null;
    tab.actions.forEach(function (item) {
      if (!action && item && item.variant === "primary" && item.event) {
        action = item;
      }
    });

    if (!action) return true;
    if (!this.validateTab(tab, form)) return false;

    this.publish(action.event, {
      tabId: tab.id,
      actionId: action.id,
      values: this.formState[tab.id],
      guidedAutoAdvance: true,
      nextTabLabel: this.nextTabLabel(tab.id)
    });

    return true;
  };

  MTKSettings.prototype.announceSavedAndAdvance = function (tabId) {
    var nextLabel = this.nextTabLabel(tabId);
    var message = nextLabel
      ? "Step saved. Moving to " + nextLabel + " setup..."
      : "Step saved. Setup is complete.";

    if (window.MTKMsgs && typeof window.MTKMsgs.show === "function") {
      window.MTKMsgs.show({
        type: "success",
        icon: "check_circle",
        message: message,
        closable: true,
        timer: 4
      });
    }

    if (!nextLabel) return;
    window.clearTimeout(this.autoAdvanceTimer);
    this.autoAdvanceTimer = window.setTimeout(function () {
      if (this.activeTabId === tabId) {
        this.goAdjacentStep("next");
      }
    }.bind(this), 2200);
  };

  MTKSettings.prototype.focusCustomServiceRow = function (fieldId, index) {
    var self = this;
    window.setTimeout(function () {
      var list = self.panelEl.querySelector('[data-custom-service-list="' + fieldId + '"]');
      var rows = list ? list.querySelectorAll("[data-custom-service-row]") : [];
      var row = rows[index];
      var input = row ? row.querySelector(".mtk-settings__custom-service-input") : null;
      if (input) {
        input.focus();
      }
    }, 0);
  };

  MTKSettings.prototype.showValidationMessage = function (message) {
    if (window.MTKMsgs && typeof window.MTKMsgs.show === "function") {
      window.MTKMsgs.show({
        type: "warning",
        icon: "warning",
        message: message,
        closable: true,
        timer: 7
      });
    }
  };

  MTKSettings.prototype.hasCheckedCustomServices = function (tabId) {
    var rows = normalizeCustomServices(this.formState[tabId] ? this.formState[tabId].customServices : []);
    return rows.some(function (row) {
      return row.checked !== false && String(row.label || "").trim();
    });
  };

  MTKSettings.prototype.validateTab = function (tab, form) {
    var fields = tab.fields || [];

    if (!form.checkValidity()) {
      this.showValidationMessage(translate("settings.error.requiredFields", "Please complete all required fields before saving."));
      form.reportValidity();
      return false;
    }

    for (var i = 0; i < fields.length; i += 1) {
      if (fields[i].type === "checkboxGroup" && fields[i].required) {
        var values = this.formState[tab.id][fields[i].id] || [];
        var customServicesSatisfyRequirement = fields[i].id === "launchServices" && this.hasCheckedCustomServices(tab.id);
        if (!values.length && !customServicesSatisfyRequirement) {
          var firstCheckbox = form.querySelector('[data-checkbox-group="' + fields[i].id + '"] .mtk-settings__checkbox');
          this.showValidationMessage(
            fields[i].id === "launchServices"
              ? translate("settings.error.servicesRequired", "Select at least one service offered, or add and check a custom service.")
              : translate("settings.error.requiredFields", "Please complete all required fields before saving.")
          );
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
