/*
 * mtk-biab.js
 * Full BIAB component.
 * Reload-safe.
 * New Invoice opens existing repo_deploy/invoice page in a full-page iframe.
 */
(function () {
  "use strict";

  if (window.MtkBiab && typeof window.MtkBiab.initWhenReady === "function") {
    window.MtkBiab.initWhenReady();
    return;
  }

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
      this.isPublishing = false;
      this.onMessage = this.onMessage.bind(this);
      this._init();
    }

    _init() {
      this._ensureInvoicePageStyles();
      this._subscribe();
      this._render();
      this._bind();
      this._publish(this.events.publish.ready || "mtk-biab:ready", {
        component: this.config.component || "mtk-biab",
        version: this.config.version || "1.0.14"
      });
    }

    _ensureInvoicePageStyles() {
      if (document.getElementById("mtk-biab-invoice-page-styles")) return;

      const style = document.createElement("style");
      style.id = "mtk-biab-invoice-page-styles";
      style.textContent = `
        .mtk-biab__invoice-page {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: grid;
          grid-template-rows: auto 1fr;
          background: #f8fafc;
          color: #0f172a;
        }

        .mtk-biab__invoice-page-header {
          background: #ffffff;
          border-bottom: 1px solid rgba(15, 23, 42, 0.14);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        }

        .mtk-biab__invoice-page-header-inner,
        .mtk-biab__invoice-page-body-inner {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
        }

        .mtk-biab__invoice-page-header-inner {
          min-height: 92px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 20px 0;
        }

        .mtk-biab__invoice-page-kicker {
          margin: 0 0 4px;
          color: #a98211;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .mtk-biab__invoice-page-title {
          margin: 0;
          color: #0f172a;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900;
          line-height: 1.08;
        }

        .mtk-biab__invoice-page-close {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #a98211;
          border-radius: 50%;
          background: #ffffff;
          color: #0f172a;
          font-size: 30px;
          font-weight: 900;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
        }

        .mtk-biab__invoice-page-close:hover,
        .mtk-biab__invoice-page-close:focus-visible {
          background: #a98211;
          color: #ffffff;
          outline: 3px solid rgba(169, 130, 17, 0.28);
          outline-offset: 3px;
        }

        .mtk-biab__invoice-page-body {
          min-height: 0;
          overflow: hidden;
          padding: 28px 0;
        }

        .mtk-biab__invoice-page-body-inner {
          height: 100%;
          min-height: 0;
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.10);
          overflow: hidden;
        }

        .mtk-biab__invoice-page-frame {
          display: block;
          width: 100%;
          height: 100%;
          min-height: calc(100vh - 178px);
          border: 0;
          background: #ffffff;
        }

        body.mtk-biab-invoice-page-open {
          overflow: hidden;
        }

        @media (max-width: 720px) {
          .mtk-biab__invoice-page-header-inner,
          .mtk-biab__invoice-page-body-inner {
            width: min(100% - 28px, 1180px);
          }

          .mtk-biab__invoice-page-header-inner {
            align-items: flex-start;
            min-height: 78px;
          }

          .mtk-biab__invoice-page-close {
            width: 42px;
            height: 42px;
            flex-basis: 42px;
            font-size: 26px;
          }

          .mtk-biab__invoice-page-body {
            padding: 14px 0;
          }
        }
      `;
      document.head.appendChild(style);
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
            <div class="mtk-biab__tab-panel" role="tabpanel">
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
          <h3 class="mtk-biab__included-heading">${this._escape(section.includedHeading)}</h3>
          <ol class="mtk-biab__included-list">
            ${section.includedItems.map((item) => `<li>${this._escape(item)}</li>`).join("")}
          </ol>
        </section>
      `;
    }

    _renderSectionContent(section) {
      if (section.viewType === "invoices") return this._renderInvoices(section);
      if (section.viewType === "reviews") return this._renderReviews(section);
      return "";
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

    _renderReviews(section) {
      const reviews = Array.isArray(section.reviews) ? section.reviews : [];

      return `
        <section class="mtk-biab__reviews-section" aria-label="${this._escape(section.reviewsHeading || "Reviews")}">
          <div class="mtk-biab__reviews-head">
            <h3>${this._escape(section.reviewsHeading || "Reviews")}</h3>
          </div>

          <div class="mtk-biab__reviews-table-wrap">
            <table class="mtk-biab__reviews-table">
              <thead>
                <tr>
                  <th scope="col">Stars</th>
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

        if (action === "select-section") this._selectSection(target.getAttribute("data-section-id"));
        if (action === "open-setup") this._openSetup();
        if (action === "new-invoice") this._openNewInvoice();
        if (action === "select-card-template") this._openCardEditor(target.getAttribute("data-template-id"));
        if (action === "back-to-templates") this._openBusinessCardTemplatePicker(this._getActiveSection());
        if (action === "submit-card-editor") this._submitCardEditor();

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

        if (action === "close-setup") this._closeSetup();
        if (action === "close-invoice-page") this._closeInvoicePage();
      });

      this.root.addEventListener("change", (event) => {
        const filter = event.target.closest("[data-action='filter-invoices']");
        if (filter && this.root.contains(filter)) {
          this.invoiceStatus = filter.value || "Open";
          this._render();
          this._publish("mtk-biab:invoice-status-filter", {
            sectionId: this.activeId,
            status: this.invoiceStatus
          });
        }
      });

      this.root.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          this._closeInvoicePage();
          this._closeSetup();
        }
      });
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

    _openNewInvoice() {
      const section = this._getActiveSection();

      this._closeSetup();
      this._closeInvoicePage();

      const page = document.createElement("section");
      page.className = "mtk-biab__invoice-page";
      page.setAttribute("role", "dialog");
      page.setAttribute("aria-modal", "true");
      page.setAttribute("aria-labelledby", "mtk-biab-invoice-page-title");

      page.innerHTML = `
        <header class="mtk-biab__invoice-page-header">
          <div class="mtk-biab__invoice-page-header-inner">
            <div>
              <p class="mtk-biab__invoice-page-kicker">Current selection</p>
              <h2 class="mtk-biab__invoice-page-title" id="mtk-biab-invoice-page-title">New Invoice</h2>
            </div>

            <button class="mtk-biab__invoice-page-close" type="button" data-action="close-invoice-page" aria-label="Close invoice">
              ×
            </button>
          </div>
        </header>

        <div class="mtk-biab__invoice-page-body">
          <div class="mtk-biab__invoice-page-body-inner">
            <iframe
              class="mtk-biab__invoice-page-frame"
              src="invoice/"
              title="New Invoice"
            ></iframe>
          </div>
        </div>
      `;

      this.root.appendChild(page);
      document.body.classList.add("mtk-biab-invoice-page-open");

      const iframe = page.querySelector(".mtk-biab__invoice-page-frame");
      if (iframe) {
        iframe.addEventListener("load", () => this._cleanInvoiceFrame(iframe));
      }

      const closeButton = page.querySelector(".mtk-biab__invoice-page-close");
      if (closeButton) closeButton.focus();

      this._publish("mtk-biab:new-invoice", {
        sectionId: this.activeId,
        section,
        target: "invoice/"
      });
    }

    _cleanInvoiceFrame(iframe) {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc) return;

        const style = doc.createElement("style");
        style.textContent = `
          .mtk-invoice__shell {
            display: contents !important;
          }

          .mtk-invoice__card {
            width: min(1180px, calc(100% - 48px)) !important;
            max-width: 1180px !important;
            margin: 0 auto 40px !important;
          }

          input::placeholder,
          textarea::placeholder {
            font-style: italic !important;
          }
        `;
        doc.head.appendChild(style);

        const placeholders = Array.from(doc.querySelectorAll("input[placeholder], textarea[placeholder]"));
        placeholders.forEach((field) => {
          field.setAttribute("placeholder", field.getAttribute("placeholder").replace(/^Example:\s*/i, ""));
          field.style.fontStyle = "normal";
        });
      } catch (error) {
        console.warn("Unable to style invoice frame", error);
      }
    }

    _closeInvoicePage() {
      const existing = this.root.querySelector(".mtk-biab__invoice-page");
      if (!existing) return;

      existing.remove();
      document.body.classList.remove("mtk-biab-invoice-page-open");
    }

    _openWebsiteBuilder(section) {
      this._closeSetup();

      this._showSetupView(section, `
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
      this._closeSetup();

      this._showSetupView(section, `
        <div class="mtk-biab__setup-card">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p>Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue.</p>
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

      this._showSetupView(section, `
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

      this._showSetupView(section, `
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

      if (status) status.textContent = "Submitted.";

      this._publish("mtk-biab:business-card-submit", {
        sectionId: this.activeId,
        template: this.selectedTemplate,
        values: data
      });
    }

    _showSetupView(section, bodyHTML) {
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
        const roots = Array.from(document.querySelectorAll("mtk-biab.mtk-biab"));
        let initialized = false;

        roots.forEach((root) => {
          if (!root || root.dataset.mtkBiabReady === "true") return;

          root.dataset.mtkBiabReady = "true";
          root.__mtkBiabInstance = new MtkBiab(root, window.MTK_BIAB_CONFIG || {});
          initialized = true;
        });

        return initialized;
      };

      start();

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
      }

      if (!window.__mtkBiabObserver) {
        window.__mtkBiabObserver = new MutationObserver(start);
        window.__mtkBiabObserver.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      }
    }
  }

  window.MtkBiab = MtkBiab;
  window.MtkBiab.initWhenReady();
})();
