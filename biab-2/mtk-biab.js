class MtkBiab {
  constructor(root, config) {
    this.root = root;
    this.config = config || {};
    this.sections = Array.isArray(this.config.sections) ? this.config.sections : [];
    this.labels = this.config.labels || {};
    this.events = this.config.events || { publish: {}, subscribe: [] };
    this.activeId = this.sections[0] ? this.sections[0].id : "";
    this.selectedTemplate = null;
    this.invoiceSort = { key: "date", direction: "desc" };
    this.invoiceStatus = "Open";
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
      version: this.config.version || "1.0.6"
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
    const customContent = this._renderSectionContent(safeSection);

    return `
      <article class="mtk-biab__panel" aria-live="polite">
        <p class="mtk-biab__eyebrow">${this._escape(safeSection.eyebrow || "")}</p>
        <h2 class="mtk-biab__panel-title">${this._escape(safeSection.title || safeSection.label || "")}</h2>
        <p class="mtk-biab__description">${this._escape(safeSection.description || "")}</p>
        ${safeSection.body ? `<p class="mtk-biab__body">${this._escape(safeSection.body)}</p>` : ""}
        ${included}
        ${customContent}

        ${this._shouldShowStartSetup(safeSection) ? `<button class="mtk-biab__start-btn` : `<span style="display:none"`} type="button" data-action="open-setup">
          <span class="material-icons" aria-hidden="true">rocket_launch</span>
          <span>${this._escape(this.labels.startSetup || "Start setup")}</span>
        </button>
      </article>
    `;
  }


  _renderSectionContent(section) {
    if (section.viewType === "invoices") {
      return this._renderInvoices(section);
    }

    return "";
  }

  _renderInvoices(section) {
    const invoices = this._getSortedInvoices(section);
    const columns = [
      { key: "id", label: "Invoice #" },
      { key: "date", label: "Date" },
      { key: "client", label: "Client" },
      { key: "service", label: "Service" },
      { key: "amount", label: "Amount" }
    ];

    return `
      <section class="mtk-biab__invoice-section" aria-label="${this._escape(section.invoiceHeading || "All Invoices")}">
        <div class="mtk-biab__invoice-head">
          <div class="mtk-biab__invoice-title-row">
            <h3>${this._escape(section.invoiceHeading || "All Invoices")}</h3>

            <label class="mtk-biab__status-filter">
              <span>Status</span>
              <select data-action="filter-invoices" aria-label="Filter invoices by status">
                ${this._renderStatusOptions(section)}
              </select>
            </label>
          </div>

          <button class="mtk-biab__new-invoice-btn" type="button" data-action="new-invoice">
            <span class="material-icons" aria-hidden="true">add</span>
            <span>${this._escape(section.newInvoiceLabel || "New Invoice")}</span>
          </button>
        </div>

        <div class="mtk-biab__table-wrap">
          <table class="mtk-biab__invoice-table">
            <thead>
              <tr>
                ${columns.map((column) => `
                  <th scope="col">
                    <button type="button" data-action="sort-invoices" data-sort-key="${this._escape(column.key)}">
                      <span>${this._escape(column.label)}</span>
                      <span class="material-icons" aria-hidden="true">${this._getSortIcon(column.key)}</span>
                    </button>
                  </th>
                `).join("")}
                <th scope="col">Status</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              ${invoices.map((invoice) => `
                <tr>
                  <td>${this._escape(invoice.id)}</td>
                  <td>${this._escape(invoice.date)}</td>
                  <td>${this._escape(invoice.client)}</td>
                  <td>${this._escape(invoice.service)}</td>
                  <td>${this._formatCurrency(invoice.amount)}</td>
                  <td><span class="mtk-biab__invoice-status">${this._escape(invoice.status)}</span></td>
                  <td>
                    <button class="mtk-biab__invoice-action-btn" type="button" data-action="delete-invoice" data-invoice-id="${this._escape(invoice.id)}">
                      <span class="material-icons">delete</span>
                    </button>
                  </td>
                  <td>
                    <button class="mtk-biab__invoice-action-btn" type="button" data-action="update-invoice" data-invoice-id="${this._escape(invoice.id)}">
                      <span class="material-icons">edit</span>
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }


  _renderStatusOptions(section) {
    const baseStatuses = ["Open", "Paid", "Draft"];
    const invoiceStatuses = Array.isArray(section.invoices)
      ? section.invoices.map((invoice) => invoice.status).filter(Boolean)
      : [];

    const statuses = Array.from(new Set(baseStatuses.concat(invoiceStatuses)));

    return statuses.map((status) => `
      <option value="${this._escape(status)}"${this.invoiceStatus === status ? " selected" : ""}>
        ${this._escape(status)}
      </option>
    `).join("");
  }

  _getSortedInvoices(section) {
    const invoices = Array.isArray(section.invoices)
      ? section.invoices.filter((invoice) => invoice.status === this.invoiceStatus)
      : [];
    const key = this.invoiceSort.key;
    const direction = this.invoiceSort.direction === "asc" ? 1 : -1;

    invoices.sort((a, b) => {
      const av = a[key];
      const bv = b[key];

      if (key === "amount") {
        return ((Number(av) || 0) - (Number(bv) || 0)) * direction;
      }

      return String(av || "").localeCompare(String(bv || "")) * direction;
    });

    return invoices;
  }

  _sortInvoices(key) {
    if (!key) return;

    if (this.invoiceSort.key === key) {
      this.invoiceSort.direction = this.invoiceSort.direction === "asc" ? "desc" : "asc";
    } else {
      this.invoiceSort.key = key;
      this.invoiceSort.direction = "asc";
    }

    this._render();

    this._publish("mtk-biab:invoice-sort", {
      sectionId: this.activeId,
      sort: this.invoiceSort
    });
  }

  _getSortIcon(key) {
    if (this.invoiceSort.key !== key) {
      return "unfold_more";
    }

    return this.invoiceSort.direction === "asc" ? "expand_less" : "expand_more";
  }

  _formatCurrency(value) {
    const number = Number(value) || 0;
    return "$" + number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }


  _shouldShowStartSetup(section) {
    if (!section || !section.id) return true;
    if (section.id === "introduction") return false;
    if (section.id === "invoices") return false;
    return true;
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

      if (action === "sort-invoices") {
        this._sortInvoices(target.getAttribute("data-sort-key"));
      }

      if (action === "new-invoice") {
        this._publish("mtk-biab:new-invoice", {
          sectionId: this.activeId
        });
      }

      if (action === "delete-invoice") {
        this._publish("mtk-biab:delete-invoice", {
          sectionId: this.activeId,
          invoiceId: target.getAttribute("data-invoice-id")
        });
      }

      if (action === "update-invoice") {
        this._publish("mtk-biab:update-invoice", {
          sectionId: this.activeId,
          invoiceId: target.getAttribute("data-invoice-id")
        });
      }

      if (action === "filter-invoices") {
        return;
      }

      if (action === "select-card-template") {
        this._openCardEditor(target.getAttribute("data-template-id"));
      }

      if (action === "back-to-templates") {
        this._openBusinessCardTemplatePicker(this._getActiveSection());
      }

      if (action === "submit-card-editor") {
        this._submitCardEditor();
      }

      if (action === "close-setup") {
        this._closeSetup();
      }
    });

    this.root.addEventListener("change", (event) => {
      const target = event.target.closest("[data-action='filter-invoices']");
      if (!target || !this.root.contains(target)) return;

      this.invoiceStatus = target.value || "Open";
      this._render();

      this._publish("mtk-biab:invoice-status-filter", {
        sectionId: this.activeId,
        status: this.invoiceStatus
      });
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

    if (section.setupType === "businessCard") {
      this._openBusinessCardTemplatePicker(section);
      return;
    }

    if (section.setupType === "websiteBuilder") {
      this._openWebsiteBuilder(section);
      return;
    }

    this._openGenericSetup(section);
  }


  _openWebsiteBuilder(section) {
    this._closeSetup();

    this._appendSetupOverlay(section, `
      <div class="mtk-biab__client-wrap">
        <iframe
          class="mtk-biab__client-frame"
          src="${this._escape(section.clientUrl || "client/index.html")}"
          title="${this._escape(section.title || "Website Builder")}"
          loading="lazy"
        ></iframe>
      </div>
    `);

    this._publish(this.events.publish.setupOpen || "mtk-biab:setup-open", {
      sectionId: this.activeId,
      section,
      mode: "website-builder",
      clientUrl: section.clientUrl || "client/index.html"
    });
  }

  _openGenericSetup(section) {
    const lorem = Array.isArray(this.config.setupLorem) ? this.config.setupLorem : [];
    this._closeSetup();

    this._appendSetupOverlay(section, `
      <div class="mtk-biab__setup-card">
        ${lorem.map((paragraph) => `<p>${this._escape(paragraph)}</p>`).join("")}
      </div>
    `);

    this._publish(this.events.publish.setupOpen || "mtk-biab:setup-open", {
      sectionId: this.activeId,
      section
    });
  }

  _openBusinessCardTemplatePicker(section) {
    const templates = Array.isArray(section.cardTemplates) ? section.cardTemplates : [];
    this._closeSetup();

    this._appendSetupOverlay(section, `
      <div class="mtk-biab__setup-card">
        <h3 class="mtk-biab__template-heading">Please select a card</h3>
        <div class="mtk-biab__template-grid" role="list" aria-label="Business card templates">
          ${templates.map((template) => `
            <button
              class="mtk-biab__template-btn"
              type="button"
              data-action="select-card-template"
              data-template-id="${this._escape(template.id)}"
              aria-label="Select ${this._escape(template.label)}"
            >
              <img src="${this._escape(template.image)}" alt="${this._escape(template.label)}">
              <span class="mtk-biab__template-label">${this._escape(template.label)}</span>
            </button>
          `).join("")}
        </div>
        <p class="mtk-biab__template-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    `);

    this._publish(this.events.publish.setupOpen || "mtk-biab:setup-open", {
      sectionId: this.activeId,
      section,
      mode: "card-template-picker"
    });
  }

  _openCardEditor(templateId) {
    const section = this._getActiveSection();
    const templates = Array.isArray(section.cardTemplates) ? section.cardTemplates : [];
    const fields = Array.isArray(section.cardFields) ? section.cardFields : [];
    const template = templates.find((item) => item.id === templateId) || templates[0];

    if (!template) return;

    this.selectedTemplate = template;

    this._closeSetup();

    this._appendSetupOverlay(section, `
      <div class="mtk-biab__setup-card">
        <div class="mtk-biab__editor">
          <div class="mtk-biab__editor-preview">
            <img src="${this._escape(template.image)}" alt="${this._escape(template.label)}">
          </div>

          <form class="mtk-biab__editor-form" data-card-editor-form>
            
            ${fields.map((field) => `
              <div class="mtk-biab__field">
                <label for="mtk-biab-field-${this._escape(field.id)}">${this._escape(field.label)}</label>
                <input
                  id="mtk-biab-field-${this._escape(field.id)}"
                  name="${this._escape(field.id)}"
                  type="${this._escape(field.type || "text")}"
                  value="${this._escape(field.value || "")}"
                >
              </div>
            `).join("")}

            <div class="mtk-biab__editor-actions"><div class="mtk-biab__editor-actions"><button class="mtk-biab__back-btn" type="button" data-action="back-to-templates"><span class="material-icons">chevron_left</span> Back</button><button class="mtk-biab__submit-btn" type="button" data-action="submit-card-editor">
              Submit
            </button></div>

            <p class="mtk-biab__status data-card-editor-status aria-live="polite"></p>
          </form>
        </div>
        <p class="mtk-biab__template-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    `);

    this._publish(this.events.publish.setupOpen || "mtk-biab:setup-open", {
      sectionId: this.activeId,
      section,
      mode: "card-editor",
      template
    });
  }

  _submitCardEditor() {
    const form = this.root.querySelector("[data-card-editor-form]");
    const status = this.root.querySelector("[data-card-editor-status]");

    if (!form) return;

    const data = {};
    Array.from(form.elements).forEach((field) => {
      if (field.name) data[field.name] = field.value;
    });

    if (status) {
      status.textContent = "Submitted.";
    }

    this._publish("mtk-biab:business-card-submit", {
      sectionId: this.activeId,
      template: this.selectedTemplate,
      values: data
    });
  }

  _appendSetupOverlay(section, bodyHTML) {
    const overlay = document.createElement("section");
    overlay.className = "mtk-biab__setup";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "mtk-biab-setup-title");

    overlay.innerHTML = `
      <header class="mtk-biab__setup-header">
        <div class="mtk-biab__setup-header-inner">
          <div>
            <p class="mtk-biab__setup-kicker">${this._escape(this.labels.currentSelection || "Current selection")}</p>
            <h2 class="mtk-biab__setup-title" id="mtk-biab-setup-title">${this._escape(section.title || section.label || "")}</h2>
          </div>

          <button class="mtk-biab__setup-close" type="button" data-action="close-setup" aria-label="${this._escape(this.labels.closeSetup || "Close setup")}">
            ×
          </button>
        </div>
      </header>

      <div class="mtk-biab__setup-body">
        ${bodyHTML}
      </div>
    `;

    this.root.appendChild(overlay);

    const closeButton = overlay.querySelector(".mtk-biab__setup-close");
    if (closeButton) closeButton.focus();
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
