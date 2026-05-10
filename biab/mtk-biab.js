/*
 * mtk-biab.js
 * Full BIAB component.
 * Reload-safe.
 * Invoice opens as a full-page wc-include view.
 * It loads invoice CSS/config/JS so mtk-invoice does not stay stuck on "Loading invoice..."
 */
(function () {
  "use strict";

  const BIAB_SCRIPT_BASE = document.currentScript && document.currentScript.src
    ? new URL(".", document.currentScript.src).href
    : "";

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
      this.invoiceStatus = "All";
      this.invoiceSort = { key: "date", direction: "desc" };
      this.invoices = [];
      this.selectedTemplate = null;
      this.generatedCardTemplates = null;
      this.orderedCard = this._loadOrderedCard();
      this.isPublishing = false;
      this.onMessage = this.onMessage.bind(this);
      this._init();
    }

    _init() {
      this._ensureInvoicePageStyles();
      this._subscribe();
      this._loadStoredSettings();
      this._render();
      this._bind();
      this._requestInvoices();
      this._requestCardOrder();
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
          padding: 0;
          border: 2px solid #a98211;
          border-radius: 50%;
          background: #ffffff;
          color: #0f172a;
          line-height: 0;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
        }

        .mtk-biab__invoice-page-close .material-icons {
          display: block;
          font-size: 26px;
          line-height: 1;
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
          }

          .mtk-biab__invoice-page-close .material-icons {
            font-size: 24px;
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

      if (eventName === "4-mtk-biab:invoices-loaded" && data && Array.isArray(data.invoices)) {
        this.invoices = data.invoices;
        this._render();
      }

      if (eventName === "4-mtk-biab:invoice-saved") {
        if (data && Array.isArray(data.invoices)) {
          this.invoices = data.invoices;
        }
        this._closeInvoicePage();
        this._selectSection("invoices");
        this._requestInvoices();
      }

      if (eventName === "4-mtk-biab:card-order-loaded" && data) {
        this.orderedCard = data.order || null;
        if (this.orderedCard) {
          this._saveOrderedCard(this.orderedCard);
        } else {
          try { window.localStorage.removeItem(this._orderedCardStorageKey()); } catch (err) {}
        }
        this._render();
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
      const orderedBusinessCard = safeSection.setupType === "businessCard" && this.orderedCard;
      const showStartSetup = !safeSection.hideStartSetup && !orderedBusinessCard;

      return `
        <article class="mtk-biab__panel" aria-live="polite">
          <p class="mtk-biab__eyebrow">${this._escape(safeSection.eyebrow || "")}</p>
          <h2 class="mtk-biab__panel-title">${this._escape(safeSection.title || safeSection.label || "")}</h2>
          <p class="mtk-biab__description">${this._escape(safeSection.description || "")}</p>
          ${safeSection.body ? `<p class="mtk-biab__body">${this._escape(safeSection.body)}</p>` : ""}
          ${included}
          ${customContent}

          ${orderedBusinessCard ? `
            <p class="mtk-biab__locked-note">
              ${this._escape(this._text("Your business card order is locked. This setup can no longer be changed."))}
            </p>
          ` : ""}

          ${showStartSetup ? `
            <button class="mtk-biab__start-btn" type="button" data-action="open-setup">
              <span class="material-icons" aria-hidden="true">rocket_launch</span>
              <span>${this._escape(this.labels.startSetup || "Start setup")}</span>
            </button>
          ` : ""}
        </article>
      `;
    }

    _renderIncluded(section) {
      if (!section.includedHeading || !Array.isArray(section.includedItems)) return "";
      const actionRequired = section.includedItems.filter((item) => item && item.actionRequired);
      const noAction = section.includedItems.filter((item) => !item || !item.actionRequired);

      return `
        <section class="mtk-biab__included" aria-label="Included by default">
          <h3 class="mtk-biab__included-heading">${this._escape(section.includedHeading)}</h3>
          ${actionRequired.length ? `
            <div class="mtk-biab__included-group">
              <h4>${this._escape(this._text("Action required"))}</h4>
              <ol class="mtk-biab__included-list mtk-biab__included-list--actions">
                ${actionRequired.map((item, index) => this._renderIncludedItem(item, index)).join("")}
              </ol>
            </div>
          ` : ""}
          <div class="mtk-biab__included-group">
            <h4>${this._escape(this._text("No action required"))}</h4>
            <ol class="mtk-biab__included-list">
              ${noAction.map((item, index) => this._renderIncludedItem(item, index)).join("")}
            </ol>
          </div>
        </section>
      `;
    }

    _renderIncludedItem(item, index) {
      if (typeof item === "string") {
        return `<li>${this._escape(item)}</li>`;
      }

      const label = item.actionRequired && (item.page || item.sectionId)
        ? `
            <button
              class="mtk-biab__included-link"
              type="button"
              data-action="go-to-included-setup"
              data-page="${this._escape(item.page || "")}"
              data-settings-tab="${this._escape(item.settingsTab || "")}"
              data-section-id="${this._escape(item.sectionId || "")}"
              data-open-setup="${item.openSetup ? "true" : "false"}"
            >${this._escape(item.label || "")}</button>
          `
        : `<strong class="mtk-biab__included-label">${this._escape(item.label || "")}</strong>`;

      return `
        <li class="${item.done ? "is-done" : ""}">
          <span class="material-icons mtk-biab__included-check" aria-hidden="true">${item.done ? "check_circle" : "radio_button_unchecked"}</span>
          <div>
            ${label}
            <p class="mtk-biab__included-detail" data-included-detail="${index}">
              ${this._escape(item.description || "")}
            </p>
          </div>
        </li>
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
                  ${this._renderInvoiceSortHeader("id", "Invoice #")}
                  ${this._renderInvoiceSortHeader("date", "Date")}
                  ${this._renderInvoiceSortHeader("client", "Client")}
                  ${this._renderInvoiceSortHeader("service", "Service")}
                  ${this._renderInvoiceSortHeader("amount", "Amount")}
                  ${this._renderInvoiceSortHeader("status", "Status")}
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
      const source = this.invoices.length ? this.invoices : (Array.isArray(section.invoices) ? section.invoices : []);
      const rows = source.map((invoice) => this._normalizeInvoiceRow(invoice))
        .filter((invoice) => this.invoiceStatus === "All" || invoice.status === this.invoiceStatus);
      return this._sortInvoices(rows);
    }

    _sortInvoices(rows) {
      const sort = this.invoiceSort || { key: "date", direction: "desc" };
      const direction = sort.direction === "asc" ? 1 : -1;
      const key = sort.key || "date";

      return rows.slice().sort((a, b) => {
        let av = a[key];
        let bv = b[key];
        if (key === "amount") {
          av = Number(av) || 0;
          bv = Number(bv) || 0;
        } else {
          av = String(av || "").toLowerCase();
          bv = String(bv || "").toLowerCase();
        }
        if (av < bv) return -1 * direction;
        if (av > bv) return 1 * direction;
        return 0;
      });
    }

    _normalizeInvoiceRow(invoice) {
      const payload = invoice && invoice.invoice ? invoice.invoice : invoice || {};
      return {
        id: invoice.id || payload.id || payload.invoiceNumber || "",
        date: invoice.invoiceDate || payload.invoiceDate || invoice.date || "",
        client: invoice.customerName || payload.customerName || invoice.client || "",
        service: payload.serviceType || invoice.service || payload.notes || "",
        amount: invoice.total !== undefined ? invoice.total : (payload.total || invoice.amount || 0),
        status: invoice.paymentStatus || payload.paymentStatus || invoice.status || "Open",
        invoice: payload
      };
    }

    _businessPageId() {
      const user = (window.wc && wc.session && wc.session.user) ? wc.session.user : {};
      return String(
        (window._clientProfileInstance && window._clientProfileInstance.data && window._clientProfileInstance.data.nalaUID) ||
        (window.wc && wc.session && wc.session.nalaUID) ||
        user.nalaUID ||
        user.id ||
        user.user_id ||
        user.email ||
        "demo"
      ).replace(/[^a-zA-Z0-9_-]/g, "");
    }

    resetAll() {
      this.invoiceStatus = "All";
      this.invoiceSort = { key: "date", direction: "desc" };
      this.invoices = [];
      this.selectedTemplate = null;
      this.generatedCardTemplates = null;
      this.orderedCard = null;
      try {
        window.localStorage.removeItem(this._orderedCardStorageKey());
        window.localStorage.removeItem("nala_profile_settings");
      } catch (err) {}
      this._publish("mtk-biab:reset", { nalaUID: this._businessPageId() });
      this.activeId = this.sections[0] ? this.sections[0].id : "";
      this._render();
    }

    _requestInvoices() {
      this._publish("mtk-biab:invoices-load", { nalaUID: this._businessPageId() });
    }

    _requestCardOrder() {
      this._publish("mtk-biab:card-order-load", { nalaUID: this._businessPageId() });
    }

    _toggleIncluded(index) {
      const detail = this.root.querySelector('[data-included-detail="' + String(index).replace(/[^0-9]/g, "") + '"]');
      if (detail) detail.hidden = !detail.hidden;
    }

    _goToIncludedSetup(target) {
      const page = target.getAttribute("data-page") || "";
      const settingsTab = target.getAttribute("data-settings-tab") || "";
      const sectionId = target.getAttribute("data-section-id") || "";
      const openSetup = target.getAttribute("data-open-setup") === "true";

      if (page && window.wc && wc.pages && typeof wc.pages.show === "function") {
        wc.pages.show(page);
        if (page === "settings" && settingsTab && typeof wc.publish === "function") {
          [80, 300, 800].forEach((delay) => {
            window.setTimeout(() => {
              wc.publish("4-mtk-settings", { type: "select-tab", tabId: settingsTab });
            }, delay);
          });
        }
        return;
      }

      if (sectionId) {
        this._selectSection(sectionId);
        if (openSetup) {
          window.setTimeout(() => this._openSetup(), 0);
        }
      }
    }

    _renderStatusOptions() {
      return ["All", "Open", "Paid", "Draft"].map((status) => `
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
        if (action === "go-to-included-setup") this._goToIncludedSetup(target);
        if (action === "open-setup") this._openSetup();
        if (action === "new-invoice") this._openNewInvoice();
        if (action === "toggle-included") this._toggleIncluded(target.getAttribute("data-included-index"));
        if (action === "select-card-template") this._selectCardTemplate(target.getAttribute("data-template-id"));
        if (action === "order-card-selection") this._orderSelectedCard();
        if (action === "back-to-templates") this._openBusinessCardTemplatePicker(this._getActiveSection());
        if (action === "submit-card-editor") this._submitCardEditor();
        if (action === "sort-invoices") this._sortInvoiceBy(target.getAttribute("data-sort-key"));

        if (action === "email-invoice") {
          this._publish("mtk-biab:email-invoice", {
            sectionId: this.activeId,
            nalaUID: this._businessPageId(),
            invoiceId: target.getAttribute("data-invoice-id")
          });
        }

        if (action === "delete-invoice") {
          this._publish("mtk-biab:delete-invoice", {
            sectionId: this.activeId,
            nalaUID: this._businessPageId(),
            invoiceId: target.getAttribute("data-invoice-id")
          });
        }

        if (action === "update-invoice") {
          this._openInvoiceForEdit(target.getAttribute("data-invoice-id"));
        }

        if (action === "close-setup") this._closeSetup();
        if (action === "close-invoice-page") this._closeInvoicePage();
      });

      this.root.addEventListener("change", (event) => {
        const filter = event.target.closest("[data-action='filter-invoices']");
        if (filter && this.root.contains(filter)) {
          this.invoiceStatus = filter.value || "All";
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

      this._closeSetup();
      this._closeInvoicePage();
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

    _openNewInvoice(invoiceData) {
      const section = this._getActiveSection();
      const values = invoiceData || this._defaultInvoiceValues();

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
              <h2 class="mtk-biab__invoice-page-title" id="mtk-biab-invoice-page-title">${this._escape(this._text(invoiceData ? "Edit Invoice" : "New Invoice"))}</h2>
            </div>

            <button class="mtk-biab__invoice-page-close" type="button" data-action="close-invoice-page" aria-label="Close invoice">
              <span class="material-icons" aria-hidden="true">close</span>
            </button>
          </div>
        </header>

        <div class="mtk-biab__invoice-page-body">
          <div class="mtk-biab__invoice-page-body-inner">
            ${this._invoiceHostMarkup()}
          </div>
        </div>
      `;

      this.root.appendChild(page);
      document.body.classList.add("mtk-biab-invoice-page-open");

      this._cleanInvoiceInclude(page, values);
      this._initInvoiceWhenReady(values, page);

      const closeButton = page.querySelector(".mtk-biab__invoice-page-close");
      if (closeButton) closeButton.focus();

      this._publish("mtk-biab:new-invoice", {
        sectionId: this.activeId,
        section,
        target: "invoice/mtk-invoice.html"
      });
    }

    _loadInvoiceAssets() {
      this._loadStylesheetOnce("mtk-invoice-css", this._repoAssetUrl("invoice/mtk-invoice.css"));
      this._loadScriptOnce("mtk-invoice-config-js", this._repoAssetUrl("invoice/mtk-invoice.config.js"));
      this._loadScriptOnce("mtk-invoice-js", this._repoAssetUrl("invoice/mtk-invoice.js"));
    }

    _sortInvoiceBy(key) {
      if (!key) return;
      if (this.invoiceSort && this.invoiceSort.key === key) {
        this.invoiceSort.direction = this.invoiceSort.direction === "asc" ? "desc" : "asc";
      } else {
        this.invoiceSort = { key, direction: key === "date" ? "desc" : "asc" };
      }
      this._render();
    }

    _repoAssetUrl(path) {
      try {
        return new URL("../" + String(path || "").replace(/^\/+/, ""), BIAB_SCRIPT_BASE || window.location.href).href;
      } catch (err) {
        return String(path || "");
      }
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
      if (document.getElementById(id)) {
        this._initInvoiceWhenReady();
        return;
      }
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = false;
      script.addEventListener("load", () => this._initInvoiceWhenReady());
      document.body.appendChild(script);
    }

    _invoiceHostMarkup() {
      return `
        <mtk-invoice class="mtk-invoice">
          <div class="mtk-invoice__loading" aria-live="polite">Loading invoice...</div>
        </mtk-invoice>
      `;
    }

    _renderInvoiceSortHeader(key, label) {
      const active = this.invoiceSort && this.invoiceSort.key === key;
      const direction = active ? this.invoiceSort.direction : "none";
      const icon = active && direction === "asc" ? "arrow_upward" : (active ? "arrow_downward" : "unfold_more");
      return `
        <th scope="col">
          <button class="mtk-biab__sort-btn" type="button" data-action="sort-invoices" data-sort-key="${this._escape(key)}" aria-label="Sort by ${this._escape(label)} ${direction === "asc" ? "descending" : "ascending"}">
            <span>${this._escape(label)}</span>
            <span class="material-icons" aria-hidden="true">${icon}</span>
          </button>
        </th>
      `;
    }

    _initInvoiceWhenReady(values, page) {
      if (page && !page.isConnected) {
        return false;
      }

      if (window.MtkInvoice && typeof window.MtkInvoice.initWhenReady === "function") {
        window.MtkInvoice.initWhenReady();
        this._pushInvoiceValues(values || this._defaultInvoiceValues());
        return true;
      }

      window.setTimeout(() => this._initInvoiceWhenReady(values, page), 50);
      return false;
    }

    _cleanInvoiceInclude(page, values) {
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
        this._pushInvoiceValues(values);
      });

      window.setTimeout(() => this._pushInvoiceValues(values), 250);
    }

    _openInvoiceForEdit(invoiceId) {
      const row = this._getInvoiceById(invoiceId);
      if (!row) return;
      this._openNewInvoice(row.invoice || row);
    }

    _getInvoiceById(invoiceId) {
      const rows = this.invoices.length ? this.invoices : (this._getActiveSection().invoices || []);
      const normalized = rows.map((invoice) => this._normalizeInvoiceRow(invoice));
      return normalized.find((invoice) => invoice.id === invoiceId);
    }

    _pushInvoiceValues(values) {
      const payload = Object.assign({}, values || {});
      if (window.wc && typeof window.wc.publish === "function") {
        window.wc.publish("4-mtk-invoice:set-data", payload);
      }
      const root = this.root.querySelector("mtk-invoice.mtk-invoice");
      if (root && root.__mtkInvoiceInstance && typeof root.__mtkInvoiceInstance.setValues === "function") {
        root.__mtkInvoiceInstance.setValues(payload);
      }
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
      if (this.orderedCard && this.orderedCard.templateId) {
        const orderedTemplate = this.orderedCard.template || templates.find((template) => template.id === this.orderedCard.templateId) || templates[0];
        this.selectedTemplate = orderedTemplate;
        this._closeSetup();
        this._showSetupView(section, `
          <div class="mtk-biab__setup-card">
            <h3 class="mtk-biab__template-heading">${this._escape(this._text("Current selection"))}</h3>
            <div class="mtk-biab__template-grid mtk-biab__template-grid--locked" role="list" aria-label="Ordered business card">
              ${orderedTemplate ? this._renderCardTemplateButton(orderedTemplate) : ""}
            </div>
            <p class="mtk-biab__template-text">This business card has been ordered and can no longer be changed.</p>
          </div>
        `);
        return;
      }

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
      if (this.orderedCard) return;
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
                    value="${this._escape(this._cardEditorFieldValue(field))}"
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

      this.orderedCard = {
        templateId: this.selectedTemplate ? this.selectedTemplate.id : "",
        template: this.selectedTemplate,
        values: data,
        orderedAt: new Date().toISOString()
      };
      this._saveOrderedCard(this.orderedCard);

      this._publish("mtk-biab:business-card-submit", {
        sectionId: this.activeId,
        nalaUID: this._businessPageId(),
        template: this.selectedTemplate,
        templateId: this.orderedCard.templateId,
        values: data,
        orderedAt: this.orderedCard.orderedAt
      });

      this._closeSetup();
      this._render();
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
        { bg: "#faf7f2", fg: "#1f2937", accent: "#991b1b", muted: "#57534e" },
        { bg: "#111827", fg: "#f9fafb", accent: "#22c55e", muted: "#d1d5db" },
        { bg: "#f9fafb", fg: "#172554", accent: "#2563eb", muted: "#475569" },
        { bg: "#0c0a09", fg: "#fafaf9", accent: "#d97706", muted: "#d6d3d1" },
        { bg: "#ecfeff", fg: "#164e63", accent: "#0891b2", muted: "#475569" },
        { bg: "#18181b", fg: "#fafafa", accent: "#a3e635", muted: "#d4d4d8" },
        { bg: "#fefce8", fg: "#1f2937", accent: "#ca8a04", muted: "#4b5563" },
        { bg: "#eef2ff", fg: "#1e1b4b", accent: "#4f46e5", muted: "#475569" },
        { bg: "#052e16", fg: "#f0fdf4", accent: "#86efac", muted: "#bbf7d0" },
        { bg: "#fff7ed", fg: "#1f2937", accent: "#c2410c", muted: "#57534e" },
        { bg: "#f1f5f9", fg: "#0f172a", accent: "#334155", muted: "#475569" }
      ];

      const fonts = [
        { heading: "Segoe UI, Arial, sans-serif", body: "Segoe UI, Arial, sans-serif", headingSize: 28, bodySize: 14 },
        { heading: "Franklin Gothic Medium, Arial Narrow, Arial, sans-serif", body: "Arial, sans-serif", headingSize: 29, bodySize: 13 },
        { heading: "Trebuchet MS, Verdana, sans-serif", body: "Verdana, Arial, sans-serif", headingSize: 28, bodySize: 13 },
        { heading: "Arial Black, Arial, sans-serif", body: "Arial, Helvetica, sans-serif", headingSize: 25, bodySize: 13 },
        { heading: "Verdana, Geneva, sans-serif", body: "Arial, Helvetica, sans-serif", headingSize: 26, bodySize: 13 },
        { heading: "Calibri, Segoe UI, sans-serif", body: "Segoe UI, Arial, sans-serif", headingSize: 29, bodySize: 14 },
        { heading: "Century Gothic, Arial, sans-serif", body: "Arial, Helvetica, sans-serif", headingSize: 27, bodySize: 13 },
        { heading: "Gill Sans, Trebuchet MS, sans-serif", body: "Trebuchet MS, Arial, sans-serif", headingSize: 28, bodySize: 13 },
        { heading: "Georgia, Times New Roman, serif", body: "Arial, Helvetica, sans-serif", headingSize: 28, bodySize: 13 },
        { heading: "Cambria, Georgia, serif", body: "Calibri, Arial, sans-serif", headingSize: 28, bodySize: 13 },
        { heading: "Lucida Sans, Arial, sans-serif", body: "Lucida Sans, Arial, sans-serif", headingSize: 26, bodySize: 13 },
        { heading: "Helvetica, Arial, sans-serif", body: "Helvetica, Arial, sans-serif", headingSize: 29, bodySize: 13 },
        { heading: "Tahoma, Geneva, sans-serif", body: "Arial, Helvetica, sans-serif", headingSize: 28, bodySize: 13 },
        { heading: "Palatino Linotype, Georgia, serif", body: "Arial, Helvetica, sans-serif", headingSize: 27, bodySize: 13 },
        { heading: "Book Antiqua, Georgia, serif", body: "Calibri, Arial, sans-serif", headingSize: 27, bodySize: 13 },
        { heading: "Arial Narrow, Arial, sans-serif", body: "Arial, Helvetica, sans-serif", headingSize: 30, bodySize: 13 },
        { heading: "Optima, Segoe UI, sans-serif", body: "Segoe UI, Arial, sans-serif", headingSize: 28, bodySize: 13 },
        { heading: "Futura, Century Gothic, Arial, sans-serif", body: "Arial, Helvetica, sans-serif", headingSize: 27, bodySize: 13 }
      ];

      const icons = [
        "key",
        "lock",
        "lock-open",
        "lock-check",
        "lock-code",
        "shield-lock",
        "shield-check",
        "square-key",
        "home-lock",
        "home-shield",
        "door",
        "door-enter",
        "door-exit",
        "building",
        "fingerprint",
        "id-badge",
        "map-shield"
      ];
      const layouts = [
        "left-mark",
        "top-band",
        "split",
        "corner-badge",
        "centered",
        "vertical-accent",
        "bottom-rule",
        "right-mark",
        "framed",
        "badge-left",
        "double-rule",
        "top-left-icon"
      ];
      const textPlacements = [
        { id: "left-standard", anchor: "start", x: 48, ys: [174, 209, 268, 298, 323] },
        { id: "left-raised", anchor: "start", x: 48, ys: [154, 188, 254, 286, 314] },
        { id: "left-lower", anchor: "start", x: 48, ys: [184, 218, 274, 301, 323] },
        { id: "center-standard", anchor: "middle", x: 280, ys: [153, 187, 255, 285, 312] },
        { id: "center-lower", anchor: "middle", x: 280, ys: [170, 204, 266, 296, 321] },
        { id: "center-raised", anchor: "middle", x: 280, ys: [142, 176, 246, 276, 304] },
        { id: "right-standard", anchor: "end", x: 512, ys: [174, 209, 268, 298, 323] },
        { id: "right-raised", anchor: "end", x: 512, ys: [154, 188, 254, 286, 314] }
      ];
      const textPlacementRules = {
        split: ["left-standard", "left-raised", "left-lower"],
        "right-mark": ["left-standard", "left-raised", "left-lower"],
        "vertical-accent": ["left-standard", "left-raised", "left-lower", "center-lower"],
        centered: ["center-standard", "center-lower", "center-raised"],
        "corner-badge": ["left-standard", "left-lower", "center-lower"],
        "top-band": ["left-standard", "center-lower", "right-standard"],
        "left-mark": ["left-standard", "center-lower", "right-standard"],
        "badge-left": ["left-standard", "center-lower", "right-standard"],
        "bottom-rule": ["left-standard", "left-raised", "center-standard", "right-standard"],
        framed: ["left-standard", "center-standard", "right-standard"],
        "double-rule": ["left-standard", "center-standard", "right-standard"],
        "top-left-icon": ["left-standard", "center-lower", "right-standard"]
      };
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
      const website = this._businessCardFieldValue(section, "website") || this._defaultClientWebsite();
      const area = this._businessCardFieldValue(section, "serviceArea") || "24/7 Locksmith Service";
      const isSpanish = window.i18n && typeof window.i18n.getLang === "function" && window.i18n.getLang() === "es";
      const labelBase = isSpanish ? "Tarjeta" : "Business Card";

      const iconChoices = this._shuffleCardOptions(icons);
      const fontChoices = this._shuffleCardOptions(fonts);
      const paletteChoices = this._shuffleCardOptions(palettes);
      const layoutChoices = this._shuffleCardOptions(layouts);
      const textPlacementChoices = this._shuffleCardOptions(textPlacements);

      this.generatedCardTemplates = Array.from({ length: 6 }).map((_, index) => {
        const palette = paletteChoices[index % paletteChoices.length];
        const font = fontChoices[index % fontChoices.length];
        const icon = iconChoices[index % iconChoices.length];
        const layout = layoutChoices[index % layoutChoices.length];
        const size = sizes[(index + website.length) % sizes.length];
        const textPlacement = this._pickCardTextPlacement(layout, textPlacementChoices, textPlacementRules, textPlacements, index);
        const design = { palette, font, icon, layout, textPlacement, size, businessName, contactName, phone, email, website, area };

        return {
          id: "generated-card-" + (index + 1),
          label: labelBase + " " + (index + 1),
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
      const configured = field && field.value ? String(field.value).trim() : "";
      if (configured) return configured;

      const settings = this.settingsProfile || {};
      const business = settings.business || {};
      const privacy = settings.privacy || {};
      const services = settings.services || {};
      const map = {
        businessName: business.customerFacingBusinessName,
        contactName: privacy.fullName || business.ownerOrResponsiblePartyName,
        phone: business.businessPhone || privacy.contactPhoneNumber,
        email: business.businessEmail || privacy.emailAddress,
        website: business.businessWebsite || this._defaultClientWebsite(),
        serviceArea: services.serviceArea
      };
      return map[fieldId] ? String(map[fieldId]).trim() : "";
    }

    _loadStoredSettings() {
      try {
        this.settingsProfile = JSON.parse(window.localStorage.getItem("nala_profile_settings") || "{}") || {};
      } catch (err) {
        this.settingsProfile = {};
      }
    }

    _defaultInvoiceValues() {
      this._loadStoredSettings();
      const settings = this.settingsProfile || {};
      const business = settings.business || {};
      const today = new Date().toISOString().slice(0, 10);
      return {
        businessName: business.customerFacingBusinessName || "Your Company Name",
        businessPhone: business.businessPhone || "",
        invoiceDate: today,
        invoiceNumber: "INV-" + today.replace(/-/g, "")
      };
    }

    _orderedCardKey() {
      return "nala_biab_ordered_card_" + this._businessPageId();
    }

    _loadOrderedCard() {
      try {
        return JSON.parse(window.localStorage.getItem(this._orderedCardKey()) || "null");
      } catch (err) {
        return null;
      }
    }

    _saveOrderedCard(card) {
      try {
        window.localStorage.setItem(this._orderedCardKey(), JSON.stringify(card || {}));
      } catch (err) {
        console.warn("Could not save ordered card state", err);
      }
    }

    _pickCardTextPlacement(layout, shuffledPlacements, rules, allPlacements, index) {
      const allowedIds = rules[layout] || ["left-standard", "center-standard"];
      const preferred = shuffledPlacements.filter((item) => allowedIds.includes(item.id));
      const choices = preferred.length ? preferred : allPlacements.filter((item) => allowedIds.includes(item.id));
      return choices[index % choices.length] || allPlacements[0];
    }

    _cardEditorFieldValue(field) {
      if (!field) return "";
      if (field.id === "website" && !field.value) {
        return this._defaultClientWebsite();
      }
      return field.value || "";
    }

    _businessCardDataUri(design) {
      const p = design.palette;
      const safe = (value) => this._escape(value);
      const icon = this._placedIcon(design.icon, p.accent, 82, 82, 68);
      const font = design.font || {};
      const headingSize = font.headingSize || 28;
      const contactSize = Math.max(16, headingSize - 11);
      const detailSize = font.bodySize || 13;
      const businessName = safe(this._cardText(design.businessName, 27));
      const area = safe(this._cardText(design.area, 42));
      const contactName = safe(this._cardText(design.contactName, 32));
      const contactLine = safe(this._cardText([design.phone, design.email].filter(Boolean).join("  |  "), 52));
      const website = safe(this._cardDisplayWebsite(design.website));
      const text = this._businessCardTextSvg({
        placement: design.textPlacement,
        palette: p,
        font,
        headingSize,
        contactSize,
        detailSize,
        businessName,
        area,
        contactName,
        contactLine,
        website
      });
      const variants = {
        "left-mark": `<rect width="560" height="350" fill="${p.bg}"/><rect width="150" height="350" fill="${p.accent}" opacity=".16"/>${icon}${text}`,
        "top-band": `<rect width="560" height="350" fill="${p.bg}"/><rect width="560" height="92" fill="${p.accent}"/>${this._placedIcon(design.icon, p.bg, 74, 46, 52)}${text}`,
        "split": `<rect width="560" height="350" fill="${p.bg}"/><rect x="352" width="208" height="350" fill="${p.accent}"/>${this._placedIcon(design.icon, p.bg, 456, 132, 84)}${text}`,
        "corner-badge": `<rect width="560" height="350" fill="${p.bg}"/><circle cx="464" cy="84" r="54" fill="${p.accent}"/>${this._placedIcon(design.icon, p.bg, 464, 84, 58)}${text}`,
        "centered": `<rect width="560" height="350" fill="${p.bg}"/>${this._placedIcon(design.icon, p.accent, 280, 76, 62)}${text}`,
        "vertical-accent": `<rect width="560" height="350" fill="${p.bg}"/><rect x="512" width="48" height="350" fill="${p.accent}"/>${this._placedIcon(design.icon, p.accent, 82, 84, 64)}${text}`,
        "bottom-rule": `<rect width="560" height="350" fill="${p.bg}"/><rect x="40" y="332" width="480" height="5" rx="2.5" fill="${p.accent}"/>${this._placedIcon(design.icon, p.accent, 82, 82, 62)}${text}`,
        "right-mark": `<rect width="560" height="350" fill="${p.bg}"/><rect x="392" y="0" width="168" height="350" fill="${p.accent}" opacity=".14"/>${this._placedIcon(design.icon, p.accent, 454, 86, 74)}${text}`,
        "framed": `<rect width="560" height="350" fill="${p.bg}"/><rect x="24" y="18" width="512" height="314" rx="10" fill="none" stroke="${p.accent}" stroke-width="4"/>${this._placedIcon(design.icon, p.accent, 84, 84, 58)}${text}`,
        "badge-left": `<rect width="560" height="350" fill="${p.bg}"/><circle cx="86" cy="86" r="52" fill="${p.accent}"/>${this._placedIcon(design.icon, p.bg, 86, 86, 56)}${text}`,
        "double-rule": `<rect width="560" height="350" fill="${p.bg}"/><rect x="40" y="40" width="480" height="4" rx="2" fill="${p.accent}"/><rect x="40" y="332" width="480" height="4" rx="2" fill="${p.accent}"/>${this._placedIcon(design.icon, p.accent, 86, 91, 58)}${text}`,
        "top-left-icon": `<rect width="560" height="350" fill="${p.bg}"/><rect x="40" y="40" width="88" height="88" rx="18" fill="${p.accent}" opacity=".16"/>${this._placedIcon(design.icon, p.accent, 84, 84, 58)}${text}`
      };
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="350" viewBox="0 0 560 350">${variants[design.layout] || variants["left-mark"]}</svg>`;
      return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
    }

    _businessCardTextSvg(options) {
      const placement = options.placement || { anchor: "start", x: 48, ys: [174, 209, 268, 298, 323] };
      const anchor = placement.anchor || "start";
      const x = placement.x || 48;
      const ys = placement.ys || [174, 209, 268, 298, 323];
      const anchorAttr = anchor === "start" ? "" : ` text-anchor="${anchor}"`;
      const websiteLength = String(options.website || "").length;
      const websiteFit = websiteLength > 44 ? ` textLength="464" lengthAdjust="spacingAndGlyphs"` : "";

      return `
        <text x="${x}" y="${ys[0]}"${anchorAttr} fill="${options.palette.fg}" font-family="${options.font.heading}" font-size="${options.headingSize}" font-weight="800">${options.businessName}</text>
        <text x="${x}" y="${ys[1]}"${anchorAttr} fill="${options.palette.muted}" font-family="${options.font.body}" font-size="14">${options.area}</text>
        <text x="${x}" y="${ys[2]}"${anchorAttr} fill="${options.palette.fg}" font-family="${options.font.body}" font-size="${options.contactSize}" font-weight="700">${options.contactName}</text>
        <text x="${x}" y="${ys[3]}"${anchorAttr} fill="${options.palette.muted}" font-family="${options.font.body}" font-size="${options.detailSize}">${options.contactLine}</text>
        <text x="${x}" y="${ys[4]}"${anchorAttr}${websiteFit} fill="${options.palette.muted}" font-family="${options.font.body}" font-size="${options.detailSize}">${options.website}</text>
      `;
    }

    _cardText(value, maxLength) {
      const text = String(value || "").replace(/\s+/g, " ").trim();
      if (!maxLength || text.length <= maxLength) return text;
      return text.slice(0, Math.max(0, maxLength - 1)).trimEnd() + "…";
    }

    _cardDisplayWebsite(value) {
      const text = String(value || "").trim();
      try {
        const url = new URL(text, window.location.href);
        return url.href;
      } catch (err) {
        return text;
      }
    }

    _placedIcon(name, color, centerX, centerY, size) {
      const scale = size / 24;
      return `<g transform="translate(${centerX - size / 2} ${centerY - size / 2}) scale(${scale})">${this._iconSvg(name, color)}</g>`;
    }

    _shuffleCardOptions(options) {
      const items = Array.isArray(options) ? options.slice() : [];
      for (let index = items.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const current = items[index];
        items[index] = items[swapIndex];
        items[swapIndex] = current;
      }
      return items;
    }

    _iconSvg(name, color) {
      const attrs = `fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"`;
      const icons = {
        key: `<g ${attrs}><path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" /><path d="M15 9h.01" /></g>`,
        lock: `<g ${attrs}><path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M8 11v-4a4 4 0 1 1 8 0v4" /></g>`,
        "lock-open": `<g ${attrs}><path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -6" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M8 11v-5a4 4 0 0 1 8 0" /></g>`,
        "lock-check": `<g ${attrs}><path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v.5" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M8 11v-4a4 4 0 1 1 8 0v4" /><path d="M15 19l2 2l4 -4" /></g>`,
        "lock-code": `<g ${attrs}><path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M8 11v-4a4 4 0 1 1 8 0v4" /><path d="M20 21l2 -2l-2 -2" /><path d="M17 17l-2 2l2 2" /></g>`,
        "shield-lock": `<g ${attrs}><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /><path d="M11 11a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12l0 2.5" /></g>`,
        "shield-check": `<g ${attrs}><path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" /><path d="M15 19l2 2l4 -4" /></g>`,
        "square-key": `<g ${attrs}><path d="M12 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M12.5 11.5l-4 4l1.5 1.5" /><path d="M12 15l-1.5 -1.5" /><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" /></g>`,
        "home-lock": `<g ${attrs}><path d="M5 12h-2l9 -9l8 8" /><path d="M5 12v7a2 2 0 0 0 2 2h6" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2c.688 0 1.294 .347 1.654 .875" /><path d="M17 19a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-2" /><path d="M18 18v-1.5a1.5 1.5 0 1 1 3 0v1.5" /></g>`,
        "home-shield": `<g ${attrs}><path d="M5 12h-2l9 -9l7.636 7.636" /><path d="M5 12v7a2 2 0 0 0 2 2h5" /><path d="M9 21v-6a2 2 0 0 1 2 -2h1.5" /><path d="M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5" /></g>`,
        door: `<g ${attrs}><path d="M14 12v.01" /><path d="M3 21h18" /><path d="M6 21v-16a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v16" /></g>`,
        "door-enter": `<g ${attrs}><path d="M13 12v.01" /><path d="M3 21h18" /><path d="M5 21v-16a2 2 0 0 1 2 -2h6m4 10.5v7.5" /><path d="M21 7h-7m3 -3l-3 3l3 3" /></g>`,
        "door-exit": `<g ${attrs}><path d="M13 12v.01" /><path d="M3 21h18" /><path d="M5 21v-16a2 2 0 0 1 2 -2h7.5m2.5 10.5v7.5" /><path d="M14 7h7m-3 -3l3 3l-3 3" /></g>`,
        building: `<g ${attrs}><path d="M3 21l18 0" /><path d="M9 8l1 0" /><path d="M9 12l1 0" /><path d="M9 16l1 0" /><path d="M14 8l1 0" /><path d="M14 12l1 0" /><path d="M14 16l1 0" /><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" /></g>`,
        fingerprint: `<g ${attrs}><path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3" /><path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6" /><path d="M12 11v2a14 14 0 0 0 2.5 8" /><path d="M8 15a18 18 0 0 0 1.8 6" /><path d="M4.9 19a22 22 0 0 1 -.9 -7v-1a8 8 0 0 1 12 -6.95" /></g>`,
        "id-badge": `<g ${attrs}><path d="M5 6a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-8a3 3 0 0 1 -3 -3l0 -12" /><path d="M10 13a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M10 6h4" /><path d="M9 18h6" /></g>`,
        "map-shield": `<g ${attrs}><path d="M15 11a3 3 0 1 0 -3 3" /><path d="M12.249 21.47a2 2 0 0 1 -1.662 -.57l-4.244 -4.243a8 8 0 1 1 13.655 -5.828" /><path d="M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5" /></g>`
      };
      return icons[name] || icons.key;
    }

    _defaultClientWebsite() {
      const uid = this._businessPageId();
      const clientUrl = "/repo_deploy/client/index.html";

      try {
        const url = new URL(clientUrl, window.location.origin || window.location.href);
        if (uid) url.searchParams.set("nalaUID", uid);
        return url.href;
      } catch (err) {
        return clientUrl + (uid ? "?nalaUID=" + encodeURIComponent(uid) : "");
      }
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
              <span class="material-icons" aria-hidden="true">close</span>
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
