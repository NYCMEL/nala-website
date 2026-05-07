/*
 * mtk-biab.js
 * Full BIAB component.
 * Reload-safe.
 * Invoice opens as a full-page wc-include view.
 * It loads invoice CSS/config/JS so mtk-invoice does not stay stuck on "Loading invoice..."
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
      if (window.i18n && typeof window.i18n.applyConfig === "function") {
        window.i18n.applyConfig(this.config);
      }
      this.sections = Array.isArray(this.config.sections) ? this.config.sections : [];
      this.labels = this.config.labels || {};
      this.events = this.config.events || { publish: {}, subscribe: [] };
      this.activeId = this.sections[0] ? this.sections[0].id : "";
      this.invoiceStatus = "Open";
      this.selectedTemplate = null;
      this.generatedCardTemplates = null;
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
        version: this.config.version || "1.0.16"
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
          overflow: auto;
          padding: 28px 0;
        }

        .mtk-biab__invoice-page-body-inner {
          min-height: calc(100vh - 178px);
          background: #ffffff;
          overflow: visible;
        }

        .mtk-biab__invoice-page-body-inner wc-include,
        .mtk-biab__invoice-page-body-inner .mtk-invoice {
          display: block;
          width: 100%;
        }

        .mtk-biab__invoice-page-body-inner .mtk-invoice__shell {
          display: contents !important;
        }

        .mtk-biab__invoice-page-body-inner .mtk-invoice__card {
          width: 100% !important;
          max-width: none !important;
          margin: 0 auto 40px !important;
        }

        .mtk-biab__invoice-page-body-inner input::placeholder,
        .mtk-biab__invoice-page-body-inner textarea::placeholder {
          font-style: italic !important;
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
                      <button class="mtk-biab__invoice-action-btn" type="button" data-action="email-invoice" data-invoice-id="${this._escape(invoice.id)}" aria-label="Email ${this._escape(invoice.id)}">
                        <span class="material-icons" aria-hidden="true">email</span>
                      </button>
                    </td>
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
          ${this._escape(this._text(status))}
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
        if (action === "select-card-template") this._selectCardTemplate(target.getAttribute("data-template-id"));
        if (action === "order-card-selection") this._orderSelectedCard();
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
      this._loadInvoiceAssets();

      const page = document.createElement("section");
      page.className = "mtk-biab__invoice-page";
      page.setAttribute("role", "dialog");
      page.setAttribute("aria-modal", "true");
      page.setAttribute("aria-labelledby", "mtk-biab-invoice-page-title");

      page.innerHTML = `
        <header class="mtk-biab__invoice-page-header">
          <div class="mtk-biab__invoice-page-header-inner">
            <div>
              <p class="mtk-biab__invoice-page-kicker">${this._escape(this._text("Current selection"))}</p>
              <h2 class="mtk-biab__invoice-page-title" id="mtk-biab-invoice-page-title">${this._escape(this._text("New Invoice"))}</h2>
            </div>

            <button class="mtk-biab__invoice-page-close" type="button" data-action="close-invoice-page" aria-label="Close invoice">
              ×
            </button>
          </div>
        </header>

        <div class="mtk-biab__invoice-page-body">
          <div class="mtk-biab__invoice-page-body-inner">
            <wc-include href="invoice/mtk-invoice.html"></wc-include>
          </div>
        </div>
      `;

      this.root.appendChild(page);
      document.body.classList.add("mtk-biab-invoice-page-open");

      this._cleanInvoiceInclude(page);

      const closeButton = page.querySelector(".mtk-biab__invoice-page-close");
      if (closeButton) closeButton.focus();

      this._publish("mtk-biab:new-invoice", {
        sectionId: this.activeId,
        section,
        target: "invoice/mtk-invoice.html"
      });
    }

    _loadInvoiceAssets() {
      this._loadStylesheetOnce("mtk-invoice-css", "invoice/mtk-invoice.css");
      this._loadScriptOnce("mtk-invoice-config-js", "invoice/mtk-invoice.config.js");
      this._loadScriptOnce("mtk-invoice-js", "invoice/mtk-invoice.js");
    }

    _loadStylesheetOnce(id, href) {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }

    _loadScriptOnce(id, src) {
      if (document.getElementById(id)) return;
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      document.body.appendChild(script);
    }

    _cleanInvoiceInclude(page) {
      const clean = () => {
        const shell = page.querySelector(".mtk-invoice__shell");
        if (shell) shell.style.display = "contents";

        const card = page.querySelector(".mtk-invoice__card");
        if (card) {
          card.style.width = "100%";
          card.style.maxWidth = "none";
          card.style.margin = "0 auto 40px";
        }

        const placeholders = Array.from(page.querySelectorAll("input[placeholder], textarea[placeholder]"));
        placeholders.forEach((field) => {
          field.setAttribute("placeholder", field.getAttribute("placeholder").replace(/^Example:\\s*/i, ""));
        });
      };

      clean();

      const observer = new MutationObserver(clean);
      observer.observe(page, { childList: true, subtree: true });
      page.__mtkInvoiceCleanObserver = observer;

      page.addEventListener("include:loaded", () => {
        clean();
        if (window.MtkInvoice && typeof window.MtkInvoice.initWhenReady === "function") {
          window.MtkInvoice.initWhenReady();
        }
      });
    }

    _closeInvoicePage() {
      const existing = this.root.querySelector(".mtk-biab__invoice-page");
      if (!existing) return;

      if (existing.__mtkInvoiceCleanObserver) {
        existing.__mtkInvoiceCleanObserver.disconnect();
      }

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
      const templates = this._getCardTemplates(section);
      const defaultTemplate = templates.find((template) => template.isDefault) || templates[0] || null;

      if (!this.selectedTemplate && defaultTemplate) {
        this.selectedTemplate = defaultTemplate;
      }

      this._closeSetup();

      this._showSetupView(section, `
        <div class="mtk-biab__setup-card">
          <h3 class="mtk-biab__template-heading">${this._escape(this._text("Please select a card"))}</h3>
          <div class="mtk-biab__template-grid" role="list" aria-label="Business card templates">
            ${templates.map((template) => this._renderCardTemplateButton(template)).join("")}
          </div>

          <div class="mtk-biab__template-actions">
            <button class="mtk-biab__submit-btn" type="button" data-action="order-card-selection">
              ${this._escape(this._text("Order my Selection"))}
            </button>
          </div>

          <p class="mtk-biab__template-text">${this._escape(section.generatorIntro || "Six options are generated from curated design rules so each card stays readable and balanced.")}</p>
        </div>
      `);

      this._publish(this.events.publish.setupOpen || "mtk-biab:setup-open", {
        sectionId: this.activeId,
        section,
        mode: "card-template-picker",
        selectedTemplate: this.selectedTemplate
      });
    }

    _renderCardTemplateButton(template) {
      const selectedId = this.selectedTemplate ? this.selectedTemplate.id : "";
      const isSelected = template.id === selectedId;

      return `
        <button
          class="mtk-biab__template-btn${isSelected ? " is-selected" : ""}"
          type="button"
          data-action="select-card-template"
          data-template-id="${this._escape(template.id)}"
          aria-label="Select ${this._escape(template.label)}"
          aria-pressed="${isSelected ? "true" : "false"}"
        >
          <span class="mtk-biab__template-image-wrap">
            <img src="${this._escape(template.image)}" alt="${this._escape(template.label)}">
            <span class="mtk-biab__template-check" aria-hidden="true">✓</span>
          </span>
          <span class="mtk-biab__template-label">${this._escape(template.label)}</span>
        </button>
      `;
    }

    _selectCardTemplate(templateId) {
      const section = this._getActiveSection();
      const templates = this._getCardTemplates(section);
      const template = templates.find((item) => item.id === templateId);

      if (!template) return;

      this.selectedTemplate = template;
      this._openBusinessCardTemplatePicker(section);

      this._publish("mtk-biab:business-card-selected", {
        sectionId: this.activeId,
        template
      });
    }

    _orderSelectedCard() {
      const section = this._getActiveSection();
      const templates = this._getCardTemplates(section);
      const defaultTemplate = templates.find((template) => template.isDefault) || templates[0] || null;
      const template = this.selectedTemplate || defaultTemplate;

      if (!template) return;

      this._openCardEditor(template.id);

      this._publish("mtk-biab:business-card-order-selection", {
        sectionId: this.activeId,
        template
      });
    }

    _openCardEditor(templateId) {
      const section = this._getActiveSection();
      const templates = this._getCardTemplates(section);
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

    _getCardTemplates(section) {
      if (Array.isArray(section.cardTemplates) && section.cardTemplates.length) {
        return section.cardTemplates;
      }

      if (this.generatedCardTemplates) {
        return this.generatedCardTemplates;
      }

      const palettes = [
        { bg: "#0f172a", fg: "#f8fafc", accent: "#38bdf8", muted: "#cbd5e1" },
        { bg: "#ffffff", fg: "#111827", accent: "#b45309", muted: "#475569" },
        { bg: "#12372a", fg: "#f7fee7", accent: "#facc15", muted: "#d9f99d" },
        { bg: "#1f2937", fg: "#f9fafb", accent: "#f97316", muted: "#d1d5db" },
        { bg: "#f8fafc", fg: "#0f172a", accent: "#0f766e", muted: "#475569" },
        { bg: "#27272a", fg: "#fafafa", accent: "#eab308", muted: "#d4d4d8" },
        { bg: "#0b3b4a", fg: "#f0fdfa", accent: "#f59e0b", muted: "#ccfbf1" },
        { bg: "#faf7f2", fg: "#1f2937", accent: "#991b1b", muted: "#57534e" }
      ];

      const fonts = [
        { heading: "Arial", body: "Arial" },
        { heading: "Georgia", body: "Arial" },
        { heading: "Trebuchet MS", body: "Verdana" },
        { heading: "Impact", body: "Arial" },
        { heading: "Verdana", body: "Tahoma" },
        { heading: "Courier New", body: "Arial" }
      ];

      const icons = ["key", "shield", "lock", "bolt", "home", "star"];
      const layouts = ["left-mark", "top-band", "split", "corner-badge", "centered", "vertical-accent"];
      const sizes = [
        { name: "Standard", width: 3.5, height: 2.0 },
        { name: "MOO", width: 3.46, height: 2.32 },
        { name: "Square", width: 2.71, height: 2.71 },
        { name: "Mini", width: 2.9, height: 1.26 }
      ];
      const businessName = this._businessCardFieldValue(section, "businessName") || "NALA Lock & Key";
      const contactName = this._businessCardFieldValue(section, "contactName") || "Your Name";
      const phone = this._businessCardFieldValue(section, "phone") || "(555) 123-4567";
      const email = this._businessCardFieldValue(section, "email") || "hello@example.com";
      const website = this._businessCardFieldValue(section, "website") || "example.com";
      const area = this._businessCardFieldValue(section, "serviceArea") || "24/7 Locksmith Service";
      const isSpanish = window.i18n && typeof window.i18n.getLang === "function" && window.i18n.getLang() === "es";
      const labelBase = isSpanish ? "Tarjeta" : "Business Card";
      const sizeLabels = isSpanish
        ? { Standard: "Estándar", MOO: "MOO", Square: "Cuadrada", Mini: "Mini" }
        : {};

      this.generatedCardTemplates = Array.from({ length: 6 }).map((_, index) => {
        const palette = palettes[(index * 3 + businessName.length) % palettes.length];
        const font = fonts[(index + contactName.length) % fonts.length];
        const icon = icons[(index * 2 + phone.length) % icons.length];
        const layout = layouts[index % layouts.length];
        const size = sizes[(index + website.length) % sizes.length];
        const design = { palette, font, icon, layout, size, businessName, contactName, phone, email, website, area };

        return {
          id: "generated-card-" + (index + 1),
          label: labelBase + " " + (index + 1) + " - " + (sizeLabels[size.name] || size.name),
          image: this._businessCardDataUri(design),
          design,
          isDefault: index === 0
        };
      });

      return this.generatedCardTemplates;
    }

    _businessCardFieldValue(section, fieldId) {
      const fields = Array.isArray(section.cardFields) ? section.cardFields : [];
      const field = fields.find((item) => item.id === fieldId);
      return field && field.value ? String(field.value).trim() : "";
    }

    _businessCardDataUri(design) {
      const p = design.palette;
      const safe = (value) => this._escape(value);
      const icon = this._iconSvg(design.icon, p.accent);
      const baseText = `
        <text x="44" y="178" fill="${p.fg}" font-family="${design.font.heading}" font-size="30" font-weight="800">${safe(design.businessName)}</text>
        <text x="44" y="213" fill="${p.muted}" font-family="${design.font.body}" font-size="15">${safe(design.area)}</text>
        <text x="44" y="276" fill="${p.fg}" font-family="${design.font.body}" font-size="18" font-weight="700">${safe(design.contactName)}</text>
        <text x="44" y="304" fill="${p.muted}" font-family="${design.font.body}" font-size="14">${safe(design.phone)}  |  ${safe(design.email)}</text>
        <text x="44" y="329" fill="${p.muted}" font-family="${design.font.body}" font-size="14">${safe(design.website)}</text>
      `;
      const variants = {
        "left-mark": `<rect width="560" height="350" fill="${p.bg}"/><rect width="150" height="350" fill="${p.accent}" opacity=".16"/><g transform="translate(48 46) scale(1.2)">${icon}</g>${baseText}`,
        "top-band": `<rect width="560" height="350" fill="${p.bg}"/><rect width="560" height="92" fill="${p.accent}"/><g transform="translate(42 26)">${this._iconSvg(design.icon, p.bg)}</g><g transform="translate(0 18)">${baseText}</g>`,
        "split": `<rect width="560" height="350" fill="${p.bg}"/><rect x="342" width="218" height="350" fill="${p.accent}"/><g transform="translate(390 92) scale(1.7)">${this._iconSvg(design.icon, p.bg)}</g>${baseText}`,
        "corner-badge": `<rect width="560" height="350" fill="${p.bg}"/><circle cx="464" cy="82" r="58" fill="${p.accent}"/><g transform="translate(434 52)">${this._iconSvg(design.icon, p.bg)}</g>${baseText}`,
        "centered": `<rect width="560" height="350" fill="${p.bg}"/><g transform="translate(254 42)">${icon}</g><text x="280" y="158" text-anchor="middle" fill="${p.fg}" font-family="${design.font.heading}" font-size="31" font-weight="800">${safe(design.businessName)}</text><text x="280" y="190" text-anchor="middle" fill="${p.muted}" font-family="${design.font.body}" font-size="15">${safe(design.area)}</text><text x="280" y="262" text-anchor="middle" fill="${p.fg}" font-family="${design.font.body}" font-size="18" font-weight="700">${safe(design.contactName)}</text><text x="280" y="291" text-anchor="middle" fill="${p.muted}" font-family="${design.font.body}" font-size="14">${safe(design.phone)}  |  ${safe(design.email)}</text><text x="280" y="318" text-anchor="middle" fill="${p.muted}" font-family="${design.font.body}" font-size="14">${safe(design.website)}</text>`,
        "vertical-accent": `<rect width="560" height="350" fill="${p.bg}"/><rect x="512" width="48" height="350" fill="${p.accent}"/><g transform="translate(44 48)">${icon}</g>${baseText}`
      };
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="350" viewBox="0 0 560 350">${variants[design.layout] || variants["left-mark"]}</svg>`;
      return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
    }

    _iconSvg(name, color) {
      const attrs = `fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
      const icons = {
        key: `<g ${attrs}><circle cx="22" cy="22" r="15"/><path d="M34 34 L68 68 M52 52 L52 68 M62 62 L76 62"/></g>`,
        shield: `<g ${attrs}><path d="M40 6 L74 20 V43 C74 63 60 78 40 86 C20 78 6 63 6 43 V20 Z"/><path d="M25 44 L36 55 L58 32"/></g>`,
        lock: `<g ${attrs}><rect x="12" y="38" width="64" height="44" rx="8"/><path d="M24 38 V26 C24 14 32 7 44 7 C56 7 64 14 64 26 V38"/></g>`,
        bolt: `<g ${attrs}><path d="M49 5 L18 50 H42 L34 86 L72 36 H48 Z"/></g>`,
        home: `<g ${attrs}><path d="M8 42 L44 12 L80 42"/><path d="M18 40 V80 H70 V40"/><path d="M36 80 V56 H52 V80"/></g>`,
        star: `<g ${attrs}><path d="M44 7 L55 32 L82 34 L61 52 L68 79 L44 65 L20 79 L27 52 L6 34 L33 32 Z"/></g>`
      };
      return icons[name] || icons.key;
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

    _text(value) {
      return window.i18n && typeof window.i18n.translateLiteral === "function"
        ? window.i18n.translateLiteral(value)
        : value;
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
