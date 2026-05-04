class MtkBiab {
  constructor(root, config) {
    this.root = root;
    this.config = config || {};
    this.sections = Array.isArray(this.config.sections) ? this.config.sections : [];
    this.labels = this.config.labels || {};
    this.events = this.config.events || { publish: {}, subscribe: [] };
    this.activeId = this.sections[0] ? this.sections[0].id : "";
    this.invoiceStatus = "Open";
    this.selectedTemplate = null;
    this.reviewSort = "desc";
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
      version: this.config.version || "1.0.7"
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
        </header>

        <div class="mtk-biab__tabs">
          <div class="mtk-biab__tab-list" role="tablist" aria-label="Business in a Box sections">
            ${this.sections.map((section) => this._renderTabButton(section)).join("")}
          </div>
          <div class="mtk-biab__tab-panel">
            ${this._renderPanel(active)}
          </div>
        </div>
      </section>
    `;
  }

  _renderTabButton(section) {
    const isActive = section.id === this.activeId;

    return `
      <button
        class="mtk-biab__tab-btn${isActive ? " is-active" : ""}"
        type="button"
        role="tab"
        aria-selected="${isActive ? "true" : "false"}"
        data-action="select-section"
        data-section-id="${this._escape(section.id)}"
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

        ${safeSection.hideStartSetup ? "" : `
          <button class="mtk-biab__start-btn" type="button" data-action="open-setup">
            <span class="material-icons" aria-hidden="true">rocket_launch</span>
            <span>${this._escape(this.labels.startSetup || "Start setup")}</span>
          </button>
        `}
      </article>
    `;
  }

  _renderIncluded(section) {
    if (!section.includedHeading || !Array.isArray(section.includedItems)) return "";

    return `
      <section class="mtk-biab__included" aria-label="Included by default">
        <h3 class="mtk-biab__included-heading">${section.includedHeading}</h3>
        <ol class="mtk-biab__included-list">
          ${section.includedItems.map((item) => `<li>${this._escape(item)}</li>`).join("")}
        </ol>
      </section>
    `;
  }

  _renderSectionContent(section) {
    if (section.viewType === "invoices") {
      return this._renderInvoices(section);
    }

    if (section.viewType === "reviews") {
      return this._renderReviews(section);
    }

    return "";
  }


  _renderReviews(section) {
    let reviews = Array.isArray(section.reviews) ? section.reviews.slice() : [];
    reviews.sort((a,b)=>{
      return this.reviewSort === "asc" ? a.rating - b.rating : b.rating - a.rating;
    });

    return `
      <section class="mtk-biab__reviews-section" aria-label="${this._escape(section.reviewsHeading || "Reviews")}">
        <div class="mtk-biab__reviews-head">
          <h3>${this._escape(section.reviewsHeading || "Reviews")}</h3>
        </div>

        <div class="mtk-biab__reviews-table-wrap">
          <table class="mtk-biab__reviews-table">
            <thead>
              <tr>
                <th scope="col"><button type="button" data-action="sort-reviews">Stars</button></th>
                <th scope="col">Date</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              ${reviews.map((review) => `
                <tr>
                  <td>
                    <span class="mtk-biab__review-stars" aria-label="${this._escape(review.rating)} out of 5 stars">
                      ${this._renderStars(review.rating)}
                    </span>
                  </td>
                  <td>${this._escape(review.date)}</td>
                  <td>
                    <span class="mtk-biab__review-notes" title="${this._escape(review.notes)}">
                      ${this._escape(review.notes)}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  _renderStars(rating) {
    const value = Math.max(0, Math.min(5, Number(rating) || 0));
    let output = "";

    for (let index = 1; index <= 5; index += 1) {
      output += `<span class="material-icons" aria-hidden="true">${index <= value ? "star" : "star_border"}</span>`;
    }

    return output;
  }

  _renderInvoices(section) {
    const invoices = this._getFilteredInvoices(section);

    return `
      <section class="mtk-biab__invoice-section" aria-label="Invoices">
        <div class="mtk-biab__invoice-head">
          <div class="mtk-biab__invoice-title-row">
            <h3>Status</h3>
            <label class="mtk-biab__status-filter">
              <select data-action="filter-invoices" aria-label="Filter invoices by status">
                ${this._renderStatusOptions()}
              </select>
            </label>
          </div>

          <button class="mtk-biab__new-invoice-btn" type="button" data-action="new-invoice">
            <span class="material-icons" aria-hidden="true">add</span>
            <span>${this._escape(section.newInvoiceLabel || "New Invoice")}</span>
          </button>
        </div>

        <p class="mtk-biab__invoice-message" data-invoice-message aria-live="polite"></p>

        <div class="mtk-biab__table-wrap">
          <table class="mtk-biab__invoice-table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col">Invoice #</th>
                <th scope="col">Date</th>
                <th scope="col">Client</th>
                <th scope="col">Service</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              ${invoices.map((invoice) => `
                <tr>
                  <td>
                    <button class="mtk-biab__invoice-action-btn" type="button" data-action="delete-invoice" data-invoice-id="${this._escape(invoice.id)}" aria-label="Delete ${this._escape(invoice.id)}">
                      <span class="material-icons" aria-hidden="true">delete</span>
                    </button>
                  </td>
                  <td>
                    <button class="mtk-biab__invoice-action-btn" type="button" data-action="update-invoice" data-invoice-id="${this._escape(invoice.id)}" aria-label="Update ${this._escape(invoice.id)}">
                      <span class="material-icons" aria-hidden="true">edit</span>
                    </button>
                  </td>
                  <td>${this._escape(invoice.id)}</td>
                  <td>${this._escape(invoice.date)}</td>
                  <td>${this._escape(invoice.client)}</td>
                  <td>${this._escape(invoice.service)}</td>
                  <td>${this._formatCurrency(invoice.amount)}</td>
                  <td><span class="mtk-biab__invoice-status">${this._escape(invoice.status)}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  _getFilteredInvoices(section) {
    return Array.isArray(section.invoices)
      ? section.invoices.filter((invoice) => invoice.status === this.invoiceStatus)
      : [];
  }

  _renderStatusOptions() {
    return ["Open", "Paid", "Draft"].map((status) => `
      <option value="${this._escape(status)}"${this.invoiceStatus === status ? " selected" : ""}>
        ${this._escape(status)}
      </option>
    `).join("");
  }

  _bind() {
    this.root.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target || !this.root.contains(target)) return;

      const action = target.getAttribute("data-action");

      if (action === "select-section") {
        this._selectSection(target.getAttribute("data-section-id"));
      }

      if (action === "open-setup") {
        this._openSetup();
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

      if (action === "new-invoice") {
        this._publish("mtk-biab:new-invoice", { sectionId: this.activeId });
      }

      if (action === "delete-invoice") {
        const invoiceId = target.getAttribute("data-invoice-id");
        this._showInvoiceMessage("Delete clicked: " + invoiceId);
        this._publish("mtk-biab:delete-invoice", {
          sectionId: this.activeId,
          invoiceId: invoiceId
        });
      }

      if (action === "sort-reviews") {
        this.reviewSort = this.reviewSort === "asc" ? "desc" : "asc";
        this._render();
      }

      if (action === "update-invoice") {
        const invoiceId = target.getAttribute("data-invoice-id");
        this._showInvoiceMessage("Update clicked: " + invoiceId);
        this._publish("mtk-biab:update-invoice", {
          sectionId: this.activeId,
          invoiceId: invoiceId
        });
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


  _showInvoiceMessage(message) {
    const target = this.root.querySelector("[data-invoice-message]");
    if (!target) return;

    target.textContent = message;
  }

  _selectSection(sectionId) {
    if (!this.sections.some((section) => section.id === sectionId)) return;

    this.activeId = sectionId;
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
      mode: "website-builder"
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

            <div class="mtk-biab__editor-actions">
              <button class="mtk-biab__back-btn" type="button" data-action="back-to-templates">
                <span class="material-icons" aria-hidden="true">chevron_left</span>
                <span>Back</span>
              </button>
              <button class="mtk-biab__submit-btn" type="button" data-action="submit-card-editor">Submit</button>
            </div>

            <p class="mtk-biab__status" data-card-editor-status aria-live="polite"></p>
          </form>
        </div>
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

  _formatCurrency(value) {
    const number = Number(value) || 0;
    return "$" + number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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

    if (start()) return;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    }

    const observer = new MutationObserver(() => {
      if (start()) observer.disconnect();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
}

MtkBiab.initWhenReady();
