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
      this.googleSeo = null;
      this.logo = this._loadSavedLogo();
      this.logoOptions = [];
      this.selectedLogoId = "";
      this.logoProviderStatus = null;
      this.selectedTemplate = null;
      this.generatedCardTemplates = null;
      this.cardOptionsPersisted = false;
      this.orderedCard = this._loadOrderedCard();
      this.isPublishing = false;
      this.onMessage = this.onMessage.bind(this);
      this.onLanguageChange = this.onLanguageChange.bind(this);
      this._init();
    }

    _init() {
      this._subscribe();
      document.addEventListener("i18n:changed", this.onLanguageChange);
      this._loadStoredSettings();
      this._render();
      this._bind();
      this._requestInvoices();
      this._requestCardOrder();
      this._requestLogo();
      this._requestGoogleSeoStatus();
      this._publish(this.events.publish.ready || "mtk-biab:ready", {
        component: this.config.component || "mtk-biab",
        version: this.config.version || "1.0.17"
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
        if (Array.isArray(data.options)) {
          if (data.options.length) {
            this.generatedCardTemplates = data.options.slice(0, 6);
            this.cardOptionsPersisted = true;
            if (!this.selectedTemplate) {
              this.selectedTemplate = this.generatedCardTemplates.find((template) => template.isDefault) || this.generatedCardTemplates[0] || null;
            }
          } else {
            this.generatedCardTemplates = null;
            this.cardOptionsPersisted = false;
            this.selectedTemplate = null;
          }
        } else if (!this.generatedCardTemplates) {
          this.cardOptionsPersisted = false;
        }
        if (this.orderedCard) {
          this._saveOrderedCard(this.orderedCard);
        } else {
          try { window.localStorage.removeItem(this._orderedCardStorageKey()); } catch (err) {}
        }
        this._render();
      }

      if (eventName === "4-mtk-biab:logo-loaded" && data) {
        this.logo = this._cleanLogo(data.logo);
        this.logoOptions = Array.isArray(data.options) ? this._cleanLogoOptions(data.options) : this.logoOptions;
        this.logoProviderStatus = data.provider || this.logoProviderStatus;
        if (this.logo) {
          this._saveLogoLocal(this.logo);
        } else {
          try { window.localStorage.removeItem(this._logoStorageKey()); } catch (err) {}
        }
        if (!this.cardOptionsPersisted) {
          this.generatedCardTemplates = null;
        }
        this._render();
      }

      if (eventName === "4-mtk-biab:logo-options" && data) {
        this.logoOptions = Array.isArray(data.options) ? this._cleanLogoOptions(data.options) : [];
        this.logoProviderStatus = data.provider || null;
        this.selectedLogoId = this.logoOptions[0] ? this.logoOptions[0].id : "";
        this._openLogoSetup(this._getActiveSection());
      }

      if (eventName === "4-mtk-biab:logo-saved" && data) {
        this.logo = this._cleanLogo(data.logo) || this.logo;
        if (this.logo) this._saveLogoLocal(this.logo);
        if (!this.cardOptionsPersisted) {
          this.generatedCardTemplates = null;
        }
        this._closeSetup();
        this._render();
      }

      if (eventName === "4-mtk-biab:google-seo-status" && data) {
        this.googleSeo = data.status || data;
        this._render();
      }
    }

    onLanguageChange() {
      if (window.i18n && typeof window.i18n.applyConfig === "function") {
        window.i18n.applyConfig(this.config);
      }
      this.sections = Array.isArray(this.config.sections) ? this.config.sections : [];
      this.labels = this.config.labels || {};
      this._render();
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
      const nextStep = this._renderNextStep(safeSection.nextStep);
      const links = this._renderSectionLinks(safeSection);

      return `
        <article class="mtk-biab__panel" aria-live="polite">
          <p class="mtk-biab__eyebrow">${this._escape(safeSection.eyebrow || "")}</p>
          <h2 class="mtk-biab__panel-title">${this._escape(safeSection.title || safeSection.label || "")}</h2>
          <p class="mtk-biab__description">${this._escape(safeSection.description || "")}</p>
          ${safeSection.body ? `<p class="mtk-biab__body">${this._escape(safeSection.body)}</p>` : ""}
          ${nextStep}
          ${links}
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

    _renderNextStep(text) {
      if (!text) return "";
      return `
        <p class="mtk-biab__next-step">
          <span class="material-icons" aria-hidden="true">arrow_forward</span>
          <span>${this._escape(this._text(text))}</span>
        </p>
      `;
    }

    _renderSectionLinks(section) {
      const links = Array.isArray(section.links) ? section.links : [];
      if (!links.length) return "";

      return `
        <div class="mtk-biab__quick-links" aria-label="${this._escape(this._text("Helpful links"))}">
          ${links.map((link) => {
            const href = this._sectionLinkHref(link);
            const external = link.external ? ' target="_blank" rel="noopener noreferrer"' : "";
            const externalText = link.external ? " " + this._text("(opens in a new tab)") : "";
            return `<a class="mtk-biab__quick-link" href="${this._escape(href)}"${external}>${this._escape(this._text(link.label || "Open link") + externalText)}</a>`;
          }).join("")}
        </div>
      `;
    }

    _sectionLinkHref(link) {
      const rawHref = link && link.href ? String(link.href) : "#";
      if (rawHref.indexOf("client/index.html") > -1) {
        try {
          const url = new URL(rawHref, window.location.href);
          url.searchParams.set("nalaUID", this._businessPageId());
          return url.href;
        } catch (err) {
          return rawHref + (rawHref.indexOf("?") > -1 ? "&" : "?") + "nalaUID=" + encodeURIComponent(this._businessPageId());
        }
      }
      return rawHref;
    }

    _renderIncluded(section) {
      if (!section.includedHeading || !Array.isArray(section.includedItems)) return "";
      const items = section.includedItems.map((item) => this._setupChecklistItem(item));
      const actionRequired = items.filter((item) => item && item.actionRequired);
      const noAction = items.filter((item) => !item || !item.actionRequired);

      return `
        <section class="mtk-biab__included" aria-label="Included by default">
          <h3 class="mtk-biab__included-heading">${this._escape(section.includedHeading)}</h3>
          ${actionRequired.length ? `
            <div class="mtk-biab__included-group">
              <h4>${this._escape(this._text("Things you need to do"))}</h4>
              <ol class="mtk-biab__included-list mtk-biab__included-list--actions">
                ${actionRequired.map((item, index) => this._renderIncludedItem(item, index)).join("")}
              </ol>
            </div>
          ` : ""}
          <div class="mtk-biab__included-group">
            <h4>${this._escape(this._text("Things NALA handles for you"))}</h4>
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

      const done = this._setupChecklistDone(item);
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
        <li class="${done ? "is-done" : ""}">
          <span class="material-icons mtk-biab__included-check" aria-hidden="true">${done ? "check_circle" : "radio_button_unchecked"}</span>
          <div>
            ${label}
            <span class="mtk-biab__included-status">${this._escape(this._text(done ? "Done" : "Not done yet"))}</span>
            <p class="mtk-biab__included-detail" data-included-detail="${index}">
              ${this._escape(item.description || "")}
            </p>
          </div>
        </li>
      `;
    }

    _setupChecklistItem(item) {
      if (!item || typeof item === "string") return item;
      const copy = Object.assign({}, item);
      copy.done = this._setupChecklistDone(copy);
      return copy;
    }

    _setupChecklistDone(item) {
      if (!item || typeof item === "string") return false;

      const key = item.setupKey || "";
      const settings = this._currentSettingsProfile();
      const business = settings.business || {};
      const privacy = settings.privacy || {};
      const services = settings.services || {};
      const hasBusinessInfo = this._hasBusinessInfo(business, privacy);
      const hasContactInfo = this._hasContactInfo(business, privacy);
      const hasServices = this._hasServicesOffered(services);
      const savedClientUrl = this._cleanValue(business.businessWebsite || business.website);
      const hasClientUrl = !!(savedClientUrl && !(window.nalaClientUrl && typeof window.nalaClientUrl.isLegacyUrl === "function" && window.nalaClientUrl.isLegacyUrl(savedClientUrl)));
      const hasLogo = !!(this.logo && (this.logo.svg || this.logo.image || this.logo.previewUrl || this.logo.providerLogoId));
      const hasCardOrder = !!(this.orderedCard && (this.orderedCard.templateId || this.orderedCard.orderedAt));
      const hasGoogleStarted = !!(this.googleSeo && (this.googleSeo.authorizationEmailSentAt || this.googleSeo.authorizationEmailSent));

      if (key === "business-info") return hasBusinessInfo;
      if (key === "services-offered") return hasServices;
      if (key === "client-url") return hasClientUrl;
      if (key === "logo") return hasLogo;
      if (key === "business-card") return hasCardOrder;
      if (key === "google-setup") return hasGoogleStarted;
      if (key === "website-pages") return hasBusinessInfo && hasServices;
      if (key === "contact-details") return hasContactInfo;
      if (key === "review-requests") return true;
      if (key === "google-website") return hasGoogleStarted;
      if (key === "local-listing-info") return hasBusinessInfo && hasServices;

      return !!item.done;
    }

    _currentSettingsProfile() {
      this._loadStoredSettings();
      return this.settingsProfile || {};
    }

    _hasBusinessInfo(business, privacy) {
      return !!(
        this._cleanValue(business.customerFacingBusinessName || business.legalBusinessName) &&
        this._cleanValue(business.businessPhone || privacy.contactPhoneNumber) &&
        this._cleanValue(business.businessEmail || privacy.emailAddress)
      );
    }

    _hasContactInfo(business, privacy) {
      return !!(
        this._cleanValue(business.businessPhone || privacy.contactPhoneNumber) &&
        this._cleanValue(business.businessEmail || privacy.emailAddress) &&
        this._cleanValue(this._businessWebsiteOrDefault(business))
      );
    }

    _businessWebsiteOrDefault(business = {}) {
      const configured = this._cleanValue(business.businessWebsite || business.website);
      if (configured && !(window.nalaClientUrl && typeof window.nalaClientUrl.isLegacyUrl === "function" && window.nalaClientUrl.isLegacyUrl(configured))) {
        return configured;
      }
      return this._defaultClientWebsite();
    }

    _hasServicesOffered(services) {
      const launchServices = Array.isArray(services.launchServices) ? services.launchServices.filter(Boolean) : [];
      return !!(
        this._cleanValue(services.serviceArea) &&
        (launchServices.length || this._cleanValue(this._customServiceLabels(services.customServices)))
      );
    }

    _cleanValue(value) {
      return String(value || "").trim();
    }

    _renderSectionContent(section) {
      if (section.viewType === "invoices") return this._renderInvoices(section);
      if (section.viewType === "reviews") return this._renderReviews(section);
      if (section.viewType === "googleSeo") return this._renderGoogleSeo(section);
      return "";
    }

    _renderGoogleSeo(section) {
      const status = this.googleSeo || {};
      const rawSteps = Array.isArray(status.steps) && status.steps.length ? status.steps : (Array.isArray(section.workflow) ? section.workflow : []);
      const steps = rawSteps.map((step) => this._friendlyGoogleSeoStep(step));
      const exportData = status.exportData || this._buildGoogleSeoPayload().exportData;
      const requestedAt = status.requestedAt ? new Date(status.requestedAt).toLocaleString() : "";
      const authorizationEmailSentAt = status.authorizationEmailSentAt ? new Date(status.authorizationEmailSentAt).toLocaleString() : "";
      const authorizationEmail = status.authorizationEmail || (exportData && exportData.email) || "";
      const visibleGoogleDataKeys = Object.keys(exportData).filter((key) => key !== "sitemapUrl");

      return `
        <section class="mtk-biab__google-seo" aria-label="${this._escape(section.title || "Google SEO Automation")}">
          <div class="mtk-biab__google-seo-head">
            <div>
              <h3>${this._escape(this._text("Google setup status"))}</h3>
              <p>${this._escape(this._text("After you click the email button, the status below shows what is ready and what you still need to do."))}</p>
              ${requestedAt ? `<p class="mtk-biab__google-seo-note">${this._escape(this._text("Last prepared"))}: ${this._escape(requestedAt)}</p>` : ""}
              ${authorizationEmailSentAt ? `<p class="mtk-biab__google-seo-note">${this._escape(this._text("Authorization email sent"))}: ${this._escape(authorizationEmailSentAt)}${authorizationEmail ? ` ${this._escape(this._text("to"))} ${this._escape(authorizationEmail)}` : ""}</p>` : ""}
            </div>
            <div class="mtk-biab__google-seo-actions">
              <button class="mtk-biab__submit-btn" type="button" data-action="start-google-seo-authorization">
                <span class="material-icons" aria-hidden="true">mark_email_read</span>
                <span>${this._escape(this._text("Send Google setup email"))}</span>
              </button>
              <button class="mtk-biab__secondary-btn" type="button" data-action="refresh-google-seo">
                <span class="material-icons" aria-hidden="true">refresh</span>
                <span>${this._escape(this._text("Refresh"))}</span>
              </button>
            </div>
          </div>

          <div class="mtk-biab__google-seo-grid">
            ${steps.map((step) => `
              <article class="mtk-biab__google-seo-card">
                <span class="mtk-biab__google-seo-status">${this._escape(this._text(step.status || "Prepared"))}</span>
                <h4>${this._escape(this._text(step.label || step.name || ""))}</h4>
                <p>${this._escape(this._text(step.description || ""))}</p>
              </article>
            `).join("")}
          </div>

          <div class="mtk-biab__google-seo-data">
            <h4>${this._escape(this._text("Business details NALA will use"))}</h4>
            <dl>
              ${visibleGoogleDataKeys.map((key) => `
                <div>
                  <dt>${this._escape(this._text(this._humanizeKey(key)))}</dt>
                  <dd>${this._escape(exportData[key] || this._text("Not provided yet"))}</dd>
                </div>
              `).join("")}
            </dl>
          </div>
        </section>
      `;
    }

    _friendlyGoogleSeoStep(step) {
      const source = step || {};
      const label = String(source.label || source.name || "");

      if (label === "Hosted website SEO") {
        return {
          label: "Website information",
          status: "Ready",
          description: "NALA uses the saved business information to prepare the website for Google."
        };
      }

      if (label === "Search Console sitemap") {
        return {
          label: "Google approval",
          status: source.status === "Authorization email sent" ? "Authorization email sent" : "Needs your action",
          description: source.status === "Authorization email sent"
            ? "You have been emailed the Google setup steps. Open the email from NALA and follow each step in order."
            : "You must approve Google access before NALA can finish the Google steps."
        };
      }

      if (label === "Google Business Profile") {
        return {
          label: "Business verification",
          status: "Needs your action",
          description: "Google may ask you to verify by email, phone, text, video, or postcard. The email explains what to do."
        };
      }

      if (label === "Local SEO data package") {
        return {
          label: "Local listing details",
          status: "Ready",
          description: "NALA keeps the business name, phone, website, service area, hours, services, and description ready for listings."
        };
      }

      return source;
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

          <p class="mtk-biab__invoice-help">${this._escape(this._text("Tip: click a column name to sort the invoices. Click the same column again to reverse the order."))}</p>

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
            <p class="mtk-biab__reviews-help">${this._escape(this._text("New reviews appear here after customers answer the review request email."))}</p>
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
        const av = this._invoiceSortValue(a, key);
        const bv = this._invoiceSortValue(b, key);
        if (av < bv) return -1 * direction;
        if (av > bv) return 1 * direction;
        return 0;
      });
    }

    _invoiceSortValue(invoice, key) {
      const value = invoice ? invoice[key] : "";

      if (key === "amount") {
        return Number(value) || 0;
      }

      if (key === "date") {
        const time = Date.parse(value);
        return Number.isFinite(time) ? time : 0;
      }

      return String(value || "").toLowerCase();
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
      this.cardOptionsPersisted = false;
      this.orderedCard = null;
      this.logo = null;
      this.logoOptions = [];
      this.selectedLogoId = "";
      this.logoProviderStatus = null;
      this.googleSeo = null;
      try {
        window.localStorage.removeItem(this._orderedCardStorageKey());
        window.localStorage.removeItem(this._logoStorageKey());
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

    _requestLogo() {
      this._publish("mtk-biab:logo-load", { nalaUID: this._businessPageId() });
    }

    _requestGoogleSeoStatus() {
      this._publish("mtk-biab:google-seo-status-load", { nalaUID: this._businessPageId() });
    }

    _requestGoogleSeoSetup() {
      this._publish("mtk-biab:google-seo-request", this._buildGoogleSeoPayload());
    }

    _startGoogleSeoAuthorization() {
      this._publish("mtk-biab:google-seo-request", Object.assign({}, this._buildGoogleSeoPayload(), {
        action: "start_authorization"
      }));
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
        if (action === "select-client-url") this._selectClientUrl(target.getAttribute("data-client-url"));
        if (action === "save-client-url") this._saveClientUrl();
        if (action === "generate-logo-options") this._generateLogoOptions();
        if (action === "view-logo-option") this._openLogoPreview(target.getAttribute("data-logo-id"));
        if (action === "close-logo-preview") this._closeLogoPreview();
        if (action === "select-logo-option") this._selectLogoOption(target.getAttribute("data-logo-id"));
        if (action === "save-logo-option") this._saveSelectedLogo();
        if (action === "sort-invoices") this._sortInvoiceBy(target.getAttribute("data-sort-key"));
        if (action === "refresh-google-seo") this._requestGoogleSeoStatus();
        if (action === "request-google-seo") this._requestGoogleSeoSetup();
        if (action === "start-google-seo-authorization") this._startGoogleSeoAuthorization();

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

      this.root.addEventListener("keydown", (event) => {
        const target = event.target.closest("[data-action='select-logo-option']");
        if (!target || !this.root.contains(target)) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        this._selectLogoOption(target.getAttribute("data-logo-id"));
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

      if (section.setupType === "logo") {
        this._openLogoSetup(section);
        return;
      }

      if (section.setupType === "clientUrl") {
        this._openClientUrlSetup(section);
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
              <h2 class="mtk-biab__invoice-page-title" id="mtk-biab-invoice-page-title">${this._escape(this._text(invoiceData ? "Edit this invoice" : "Create a new invoice"))}</h2>
              <p class="mtk-biab__invoice-page-help">${this._escape(this._text("Fill in the customer and job details, then click Save invoice. NALA sends the review request automatically."))}</p>
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
          <p class="mtk-biab__setup-help">${this._escape(this._text("This step is ready. Follow the instructions on this page, then click the main button when you are done."))}</p>
        </div>
      `);

      this._publish(this.events.publish.setupOpen || "mtk-biab:setup-open", {
        sectionId: this.activeId,
        section
      });
    }

    _openLogoSetup(section) {
      const payload = this._buildLogoPayload();
      const hasBusinessName = !!this._cleanValue(payload.businessName);
      const hasServiceArea = !!this._cleanValue(payload.serviceArea);
      const status = this._logoProviderStatusText();
      const options = Array.isArray(this.logoOptions) ? this.logoOptions : [];

      this._closeSetup();

      this._showSetupView(section, `
        <div class="mtk-biab__setup-card">
          <div class="mtk-biab__logo-workflow">
            <section class="mtk-biab__logo-readiness" aria-label="Logo readiness">
              <h3>${this._escape(this._text("1. Check the business details"))}</h3>
              <p class="mtk-biab__setup-help">${this._escape(this._text("These details are sent to the logo engine so the options match your business."))}</p>
              <dl>
                <div class="${hasBusinessName ? "is-ready" : "is-missing"}">
                  <dt>${this._escape(this._text("Business name"))}</dt>
                  <dd>${this._escape(payload.businessName || this._text("Missing - go to Profile & Settings first"))}</dd>
                </div>
                <div class="${hasServiceArea ? "is-ready" : "is-missing"}">
                  <dt>${this._escape(this._text("Service area"))}</dt>
                  <dd>${this._escape(payload.serviceArea || this._text("Missing - add your service area first"))}</dd>
                </div>
                <div class="is-ready">
                  <dt>${this._escape(this._text("Services"))}</dt>
                  <dd>${this._escape(payload.services || this._text("Locksmith services"))}</dd>
                </div>
              </dl>
            </section>

            <section class="mtk-biab__logo-provider" aria-label="Logo provider">
              <h3>${this._escape(this._text("2. Generate logo options"))}</h3>
              <p>${this._escape(status)}</p>
              <button class="mtk-biab__submit-btn" type="button" data-action="generate-logo-options" ${hasBusinessName ? "" : "disabled"}>
                ${this._escape(this._text(options.length ? "Generate new logo options" : "Generate 6 logo options"))}
              </button>
              ${!hasBusinessName ? `<p class="mtk-biab__status">${this._escape(this._text("Add your business name before generating logos."))}</p>` : ""}
            </section>

            ${this.logo ? `
              <section class="mtk-biab__logo-saved" aria-label="Saved logo">
                <h3>${this._escape(this._text("Saved logo"))}</h3>
                <div class="mtk-biab__logo-card mtk-biab__logo-card--saved">
                  ${this._logoPreviewMarkup(this.logo)}
                  <strong>${this._escape(this.logo.name || payload.businessName || this._text("Saved logo"))}</strong>
                  <span>${this._escape(this._text("This logo will be used on your business card."))}</span>
                </div>
              </section>
            ` : ""}

            <section class="mtk-biab__logo-options" aria-label="Logo options">
              <h3>${this._escape(this._text("3. Choose one logo"))}</h3>
              ${options.length ? `
                <div class="mtk-biab__logo-grid">
                  ${options.map((option) => this._renderLogoOption(option)).join("")}
                </div>
                <div class="mtk-biab__template-actions">
                  <button class="mtk-biab__submit-btn" type="button" data-action="save-logo-option" ${this.selectedLogoId ? "" : "disabled"}>
                    ${this._escape(this._text("Save this logo"))}
                  </button>
                </div>
              ` : `
                <p class="mtk-biab__setup-help">${this._escape(this._text("No logo options yet. Click Generate 6 logo options and then pick your favorite."))}</p>
              `}
            </section>
          </div>
        </div>
      `);

      this._publish(this.events.publish.setupOpen || "mtk-biab:setup-open", {
        sectionId: this.activeId,
        section,
        mode: "logo"
      });
    }

    _clientUrlPayload() {
      this._loadStoredSettings();
      const settings = this.settingsProfile || {};
      const business = settings.business || {};
      const services = settings.services || {};
      const privacy = settings.privacy || {};
      const user = (window.wc && wc.session && wc.session.user) ? wc.session.user : {};

      return {
        uid: this._businessPageId(),
        businessName: business.customerFacingBusinessName || business.legalBusinessName || "",
        legalName: business.legalBusinessName || "",
        ownerName: business.ownerOrResponsiblePartyName || privacy.fullName || user.name || "",
        serviceArea: services.serviceArea || business.serviceArea || "",
        email: business.businessEmail || privacy.emailAddress || user.email || "",
        phone: business.businessPhone || privacy.contactPhoneNumber || user.phone || ""
      };
    }

    _clientUrlOptions() {
      if (window.nalaClientUrl && typeof window.nalaClientUrl.options === "function") {
        return window.nalaClientUrl.options(this._clientUrlPayload(), 18);
      }
      return [];
    }

    _currentClientUrl() {
      const saved = this._savedClientUrl();
      if (saved) return saved;
      this._loadStoredSettings();
      const business = (this.settingsProfile && this.settingsProfile.business) || {};
      return this._businessWebsiteOrDefault(business);
    }

    _savedClientUrl() {
      this._loadStoredSettings();
      const business = (this.settingsProfile && this.settingsProfile.business) || {};
      const saved = this._cleanValue(business.businessWebsite || business.website);
      if (!saved) return "";
      if (window.nalaClientUrl && typeof window.nalaClientUrl.isLegacyUrl === "function" && window.nalaClientUrl.isLegacyUrl(saved)) return "";
      return saved;
    }

    _openClientUrlSetup(section) {
      const options = this._clientUrlOptions();
      const savedUrl = this._savedClientUrl();
      const selectedUrl = this.selectedClientUrl || savedUrl || (options[0] && options[0].url) || "";
      this.selectedClientUrl = selectedUrl;
      this._closeSetup();

      this._showSetupView(section, `
        <div class="mtk-biab__setup-card">
          <div class="mtk-biab__url-workflow">
            <section class="mtk-biab__url-current" aria-label="Saved client URL">
              <h3>${this._escape(this._text("1. Saved URL"))}</h3>
              <p class="mtk-biab__url-current-value${savedUrl ? "" : " is-empty"}">${this._escape(savedUrl || this._text("No URL saved yet"))}</p>
            </section>
            <section class="mtk-biab__url-options" aria-label="Client URL options">
              <h3>${this._escape(this._text("2. Choose one URL"))}</h3>
              <p class="mtk-biab__setup-help">${this._escape(this._text("Pick the option that will be easiest for customers to remember and type."))}</p>
              ${options.length ? `
                <div class="mtk-biab__url-grid">
                  ${options.map((option) => this._renderClientUrlOption(option, selectedUrl)).join("")}
                </div>
                <div class="mtk-biab__template-actions">
                  <button class="mtk-biab__submit-btn" type="button" data-action="save-client-url" ${selectedUrl ? "" : "disabled"}>
                    ${this._escape(this._text("Save this URL"))}
                  </button>
                </div>
              ` : `
                <p class="mtk-biab__setup-help">${this._escape(this._text("Add the business name first, then come back to choose a URL."))}</p>
              `}
            </section>
          </div>
        </div>
      `);

      this._publish(this.events.publish.setupOpen || "mtk-biab:setup-open", {
        sectionId: this.activeId,
        section,
        mode: "client-url"
      });
    }

    _renderClientUrlOption(option, selectedUrl) {
      const isSelected = option && option.url === selectedUrl;
      const base = (window.nalaClientUrl && window.nalaClientUrl.baseUrl) || "https://pro.nalanetwork.com";
      return `
        <button
          class="mtk-biab__url-option${isSelected ? " is-selected" : ""}"
          type="button"
          data-action="select-client-url"
          data-client-url="${this._escape(option.url || "")}"
          aria-pressed="${isSelected ? "true" : "false"}"
        >
          <span class="mtk-biab__url-host">${this._escape(base)}/</span>
          <strong>${this._escape(option.slug || option.label || "")}</strong>
          <span class="mtk-biab__template-check" aria-hidden="true">✓</span>
        </button>
      `;
    }

    _selectClientUrl(url) {
      if (!url) return;
      this.selectedClientUrl = url;
      this._openClientUrlSetup(this._getActiveSection());
    }

    _saveClientUrl() {
      const url = this.selectedClientUrl || this._currentClientUrl();
      if (!url) return;
      this._loadStoredSettings();
      const settings = this.settingsProfile || {};
      settings.business = Object.assign({}, settings.business || {}, {
        businessWebsite: url
      });
      this.settingsProfile = settings;
      try {
        window.localStorage.setItem("nala_profile_settings", JSON.stringify(settings));
      } catch (err) {
        console.warn("Could not save client URL", err);
      }
      if (window.wc && typeof window.wc.publish === "function") {
        window.wc.publish("mtk-settings:business-save", {
          tabId: "business",
          actionId: "saveBusiness",
          values: settings.business
        });
      }
      this._closeSetup();
      this._render();
    }

    _logoProviderStatusText() {
      const provider = this.logoProviderStatus || {};
      if (provider.mode === "zoviz") {
        return this._text("Zoviz is connected. Generated options come from the Zoviz Logo Engine API.");
      }
      if (provider.mode === "preview") {
        return this._text("Zoviz API access is not configured yet. Add the key before generating logos.");
      }
      return this._text("This step is ready for Zoviz. The Generate button creates 6 watermarked logo previews.");
    }

    _renderLogoOption(option) {
      const isSelected = option && option.id === this.selectedLogoId;
      return `
        <div
          class="mtk-biab__logo-option${isSelected ? " is-selected" : ""}"
          data-action="select-logo-option"
          data-logo-id="${this._escape(option.id || "")}"
          role="button"
          tabindex="0"
          aria-pressed="${isSelected ? "true" : "false"}"
        >
          <button
            class="mtk-biab__logo-expand"
            type="button"
            data-action="view-logo-option"
            data-logo-id="${this._escape(option.id || "")}"
            aria-label="${this._escape(this._text("View this logo larger"))}"
          >
            ${this._logoPreviewMarkup(option)}
            <span class="mtk-biab__logo-expand-label">${this._escape(this._text("View larger"))}</span>
          </button>
          <span class="mtk-biab__logo-option-name">${this._escape(option.name || option.label || this._text("Logo option"))}</span>
          ${option.previewOnly ? `<span class="mtk-biab__logo-preview-badge">${this._escape(this._text("Preview"))}</span>` : ""}
          <span class="mtk-biab__template-check" aria-hidden="true">✓</span>
        </div>
      `;
    }

    _logoPreviewMarkup(logo, isLarge = false) {
      const sizeClass = isLarge ? " mtk-biab__logo-preview--large" : "";
      if (this._isJunkLogo(logo)) {
        return `<span class="mtk-biab__logo-preview${sizeClass} mtk-biab__logo-preview--empty">${this._escape(this._text("Generate a new Zoviz logo"))}</span>`;
      }
      if (logo && logo.svg) {
        return `<span class="mtk-biab__logo-preview${sizeClass}">${logo.svg}</span>`;
      }
      const src = (logo && (logo.previewUrl || logo.image)) || "";
      if (src) {
        return `<span class="mtk-biab__logo-preview${sizeClass}"><img src="${this._escape(src)}" alt=""></span>`;
      }
      return `<span class="mtk-biab__logo-preview${sizeClass} mtk-biab__logo-preview--empty">${this._escape(this._text("No logo preview available"))}</span>`;
    }

    _openLogoPreview(logoId) {
      const logo = this.logoOptions.find((option) => option.id === logoId);
      if (!logo) return;
      this._closeLogoPreview();

      const overlay = document.createElement("div");
      overlay.className = "mtk-biab__logo-lightbox";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", this._text("Logo preview"));
      overlay.innerHTML = `
        <button class="mtk-biab__logo-lightbox-backdrop" type="button" data-action="close-logo-preview" aria-label="${this._escape(this._text("Close preview"))}"></button>
        <div class="mtk-biab__logo-lightbox-dialog">
          <button class="mtk-biab__logo-lightbox-close" type="button" data-action="close-logo-preview" aria-label="${this._escape(this._text("Close preview"))}">
            <span class="material-icons" aria-hidden="true">close</span>
          </button>
          ${this._logoPreviewMarkup(logo, true)}
          <strong>${this._escape(logo.name || logo.label || this._text("Logo option"))}</strong>
          <button class="mtk-biab__submit-btn" type="button" data-action="select-logo-option" data-logo-id="${this._escape(logo.id || "")}">
            ${this._escape(this._text("Choose this logo"))}
          </button>
        </div>
      `;

      this.root.appendChild(overlay);
      const closeButton = overlay.querySelector(".mtk-biab__logo-lightbox-close");
      if (closeButton) closeButton.focus();
    }

    _closeLogoPreview() {
      const overlay = this.root.querySelector(".mtk-biab__logo-lightbox");
      if (overlay) overlay.remove();
    }

    _generateLogoOptions() {
      const payload = Object.assign({}, this._buildLogoPayload(), {
        replaceExisting: this.logoOptions.length > 0 || !!this.logo
      });
      this.logoProviderStatus = { mode: "loading" };
      this._publish("mtk-biab:logo-generate", payload);
    }

    _selectLogoOption(logoId) {
      if (!logoId) return;
      if (!this.logoOptions.some((option) => option.id === logoId)) return;
      this._closeLogoPreview();
      this.selectedLogoId = logoId;
      this._openLogoSetup(this._getActiveSection());
    }

    _saveSelectedLogo() {
      const selected = this.logoOptions.find((option) => option.id === this.selectedLogoId);
      if (!selected) return;
      const logo = Object.assign({}, selected, {
        selectedAt: new Date().toISOString()
      });
      this.logo = logo;
      this._saveLogoLocal(logo);
      this.generatedCardTemplates = null;
      this._publish("mtk-biab:logo-save", {
        nalaUID: this._businessPageId(),
        logo
      });
    }

    _buildLogoPayload() {
      this._loadStoredSettings();
      const settings = this.settingsProfile || {};
      const business = settings.business || {};
      const services = settings.services || {};
      const privacy = settings.privacy || {};
      const serviceList = [
        services.primaryService,
        services.secondaryService,
        Array.isArray(services.launchServices) ? services.launchServices.join(", ") : services.launchServices,
        this._customServiceLabels(services.customServices)
      ].filter(Boolean).join(", ");

      return {
        nalaUID: this._businessPageId(),
        provider: "zoviz",
        businessName: business.customerFacingBusinessName || business.legalBusinessName || "",
        ownerName: privacy.fullName || business.ownerOrResponsiblePartyName || "",
        serviceArea: services.serviceArea || business.serviceArea || "",
        services: serviceList || "Residential, commercial, automotive, and emergency locksmith services",
        style: "professional locksmith and security services logo, strong trade-service look, clean vector, readable, trustworthy, modern, relevant lock/key/shield/door/home/security symbol only, no glasses, no eyewear, no beauty/fashion styling, no script fonts, no pink or pastel palette",
        colors: ["#111827", "#1e3a8a", "#166534", "#a98212", "#ffffff"],
        count: 6
      };
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
            <p class="mtk-biab__setup-help">${this._escape(this._text("This is the business card that was already ordered. There is nothing else to click here."))}</p>
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
          <h3 class="mtk-biab__template-heading">${this._escape(this._text("Choose one business card"))}</h3>
          <p class="mtk-biab__setup-help">${this._escape(this._text("Click the card design you like. A check mark will show your choice. Then click Order this business card."))}</p>
          <div class="mtk-biab__template-grid" role="list" aria-label="Business card templates">
            ${templates.map((template) => this._renderCardTemplateButton(template)).join("")}
          </div>

          <div class="mtk-biab__template-actions">
            <button class="mtk-biab__submit-btn" type="button" data-action="order-card-selection">
              ${this._escape(this._text("Order this business card"))}
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
              <p class="mtk-biab__setup-help">${this._escape(this._text("Check each line below. If something is wrong, type the correct information, then click Save and order this card."))}</p>
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
                  <span>${this._escape(this._text("Go back to card choices"))}</span>
                </button>
                <button class="mtk-biab__submit-btn" type="button" data-action="submit-card-editor">${this._escape(this._text("Save and order this card"))}</button>
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

      if (status) status.textContent = this._text("Saved. Your business card order is now locked.");

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
        const design = { palette, font, icon, layout, textPlacement, size, businessName, contactName, phone, email, website, area, logo: this.logo };

        return {
          id: "generated-card-" + (index + 1),
          label: labelBase + " " + (index + 1),
          image: this._businessCardDataUri(design),
          design,
          isDefault: index === 0
        };
      });

      if (!this.cardOptionsPersisted) {
        this.cardOptionsPersisted = true;
        this._publish("mtk-biab:card-options-save", {
          nalaUID: this._businessPageId(),
          options: this.generatedCardTemplates
        });
      }

      return this.generatedCardTemplates;
    }

    _businessCardFieldValue(section, fieldId) {
      const fields = Array.isArray(section.cardFields) ? section.cardFields : [];
      const field = fields.find((item) => item.id === fieldId);
      const configured = field && field.value ? String(field.value).trim() : "";
      if (configured) {
        return fieldId === "phone" && window.nalaPhone && typeof window.nalaPhone.format === "function"
          ? window.nalaPhone.format(configured)
          : configured;
      }

      const settings = this.settingsProfile || {};
      const business = settings.business || {};
      const privacy = settings.privacy || {};
      const services = settings.services || {};
      const map = {
        businessName: business.customerFacingBusinessName,
        contactName: privacy.fullName || business.ownerOrResponsiblePartyName,
        phone: business.businessPhone || privacy.contactPhoneNumber,
        email: business.businessEmail || privacy.emailAddress,
        website: this._businessWebsiteOrDefault(business),
        serviceArea: services.serviceArea
      };
      const value = map[fieldId] ? String(map[fieldId]).trim() : "";
      if (fieldId === "phone" && window.nalaPhone && typeof window.nalaPhone.format === "function") {
        return window.nalaPhone.format(value);
      }
      return value;
    }

    _loadStoredSettings() {
      try {
        this.settingsProfile = JSON.parse(window.localStorage.getItem("nala_profile_settings") || "{}") || {};
      } catch (err) {
        this.settingsProfile = {};
      }
    }

    _buildGoogleSeoPayload() {
      this._loadStoredSettings();
      const settings = this.settingsProfile || {};
      const business = settings.business || {};
      const privacy = settings.privacy || {};
      const services = settings.services || {};
      const businessName = business.customerFacingBusinessName || business.legalBusinessName || "";
      const websiteUrl = this._businessWebsiteOrDefault(business);
      const sitemapUrl = this._sitemapUrlForWebsite(websiteUrl);
      const serviceArea = services.serviceArea || business.serviceArea || "";
      const customServices = this._customServiceLabels(services.customServices);
      const serviceList = [
        services.primaryService,
        services.secondaryService,
        services.launchServices,
        services.servicesOffered,
        customServices
      ].filter(Boolean).join(", ");

      return {
        nalaUID: this._businessPageId(),
        requestedAt: new Date().toISOString(),
        exportData: {
          businessName,
          legalBusinessName: business.legalBusinessName || businessName,
          ownerName: privacy.fullName || business.ownerOrResponsiblePartyName || "",
          phone: business.businessPhone || privacy.contactPhoneNumber || "",
          email: business.businessEmail || privacy.emailAddress || "",
          websiteUrl,
          sitemapUrl,
          address: business.businessAddress || "",
          serviceArea,
          hours: business.businessHours || "",
          services: serviceList,
          description: business.businessDescription || "Professional locksmith services for local residential and commercial customers."
        }
      };
    }

    _customServiceLabels(value) {
      if (Array.isArray(value)) {
        return value.map((item) => {
          if (typeof item === "string") return item.trim();
          if (item && item.checked === false) return "";
          return String((item && item.label) || "").trim();
        }).filter(Boolean).join(", ");
      }
      return String(value || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean).join(", ");
    }

    _sitemapUrlForWebsite(websiteUrl) {
      try {
        const url = new URL(websiteUrl, window.location.origin);
        return url.origin + "/repo_deploy/client/sitemap.xml?nalaUID=" + encodeURIComponent(this._businessPageId());
      } catch (err) {
        return "/repo_deploy/client/sitemap.xml?nalaUID=" + encodeURIComponent(this._businessPageId());
      }
    }

    _humanizeKey(key) {
      return String(key || "")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (letter) => letter.toUpperCase());
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

    _logoStorageKey() {
      return "nala_biab_logo_" + this._businessPageId();
    }

    _loadSavedLogo() {
      try {
        const logo = JSON.parse(window.localStorage.getItem(this._logoStorageKey()) || "null");
        if (this._isJunkLogo(logo)) {
          window.localStorage.removeItem(this._logoStorageKey());
          return null;
        }
        return logo;
      } catch (err) {
        return null;
      }
    }

    _saveLogoLocal(logo) {
      if (this._isJunkLogo(logo)) {
        try { window.localStorage.removeItem(this._logoStorageKey()); } catch (err) {}
        return;
      }
      try {
        window.localStorage.setItem(this._logoStorageKey(), JSON.stringify(logo || {}));
      } catch (err) {
        console.warn("Could not save logo state", err);
      }
    }

    _cleanLogo(logo) {
      return this._isJunkLogo(logo) ? null : (logo || null);
    }

    _cleanLogoOptions(options) {
      return (Array.isArray(options) ? options : [])
        .filter((option) => !this._isJunkLogo(option))
        .slice(0, 6);
    }

    _isJunkLogo(logo) {
      if (!logo || typeof logo !== "object") return false;
      const haystack = [
        logo.id,
        logo.providerLogoId,
        logo.name,
        logo.label,
        logo.svg,
        logo.previewUrl,
        logo.image
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.indexOf("zoviz preview test") > -1 || haystack.indexOf("preview-logo-") > -1;
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
      if (field.id === "phone" && window.nalaPhone && typeof window.nalaPhone.format === "function") {
        return window.nalaPhone.format(field.value || "");
      }
      return field.value || "";
    }

    _businessCardDataUri(design) {
      const p = design.palette;
      const safe = (value) => this._escape(value);
      const icon = this._placedLogoOrIcon(design.logo, design.icon, p.accent, 82, 82, 68);
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
        "top-band": `<rect width="560" height="350" fill="${p.bg}"/><rect width="560" height="92" fill="${p.accent}"/>${this._placedLogoOrIcon(design.logo, design.icon, p.bg, 74, 46, 52)}${text}`,
        "split": `<rect width="560" height="350" fill="${p.bg}"/><rect x="352" width="208" height="350" fill="${p.accent}"/>${this._placedLogoOrIcon(design.logo, design.icon, p.bg, 456, 132, 84)}${text}`,
        "corner-badge": `<rect width="560" height="350" fill="${p.bg}"/><circle cx="464" cy="84" r="54" fill="${p.accent}"/>${this._placedLogoOrIcon(design.logo, design.icon, p.bg, 464, 84, 58)}${text}`,
        "centered": `<rect width="560" height="350" fill="${p.bg}"/>${this._placedLogoOrIcon(design.logo, design.icon, p.accent, 280, 76, 62)}${text}`,
        "vertical-accent": `<rect width="560" height="350" fill="${p.bg}"/><rect x="512" width="48" height="350" fill="${p.accent}"/>${this._placedLogoOrIcon(design.logo, design.icon, p.accent, 82, 84, 64)}${text}`,
        "bottom-rule": `<rect width="560" height="350" fill="${p.bg}"/><rect x="40" y="332" width="480" height="5" rx="2.5" fill="${p.accent}"/>${this._placedLogoOrIcon(design.logo, design.icon, p.accent, 82, 82, 62)}${text}`,
        "right-mark": `<rect width="560" height="350" fill="${p.bg}"/><rect x="392" y="0" width="168" height="350" fill="${p.accent}" opacity=".14"/>${this._placedLogoOrIcon(design.logo, design.icon, p.accent, 454, 86, 74)}${text}`,
        "framed": `<rect width="560" height="350" fill="${p.bg}"/><rect x="24" y="18" width="512" height="314" rx="10" fill="none" stroke="${p.accent}" stroke-width="4"/>${this._placedLogoOrIcon(design.logo, design.icon, p.accent, 84, 84, 58)}${text}`,
        "badge-left": `<rect width="560" height="350" fill="${p.bg}"/><circle cx="86" cy="86" r="52" fill="${p.accent}"/>${this._placedLogoOrIcon(design.logo, design.icon, p.bg, 86, 86, 56)}${text}`,
        "double-rule": `<rect width="560" height="350" fill="${p.bg}"/><rect x="40" y="40" width="480" height="4" rx="2" fill="${p.accent}"/><rect x="40" y="332" width="480" height="4" rx="2" fill="${p.accent}"/>${this._placedLogoOrIcon(design.logo, design.icon, p.accent, 86, 91, 58)}${text}`,
        "top-left-icon": `<rect width="560" height="350" fill="${p.bg}"/><rect x="40" y="40" width="88" height="88" rx="18" fill="${p.accent}" opacity=".16"/>${this._placedLogoOrIcon(design.logo, design.icon, p.accent, 84, 84, 58)}${text}`
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

    _placedLogoOrIcon(logo, iconName, color, centerX, centerY, size) {
      if (logo && logo.svg) {
        const href = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(logo.svg);
        return `<image href="${href}" x="${centerX - size / 2}" y="${centerY - size / 2}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
      }
      if (logo && (logo.previewUrl || logo.image)) {
        const href = this._escape(logo.previewUrl || logo.image);
        return `<image href="${href}" x="${centerX - size / 2}" y="${centerY - size / 2}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
      }
      return this._placedIcon(iconName, color, centerX, centerY, size);
    }

    _placedIcon(name, color, centerX, centerY, size) {
      const scale = size / 24;
      return `<g transform="translate(${centerX - size / 2} ${centerY - size / 2}) scale(${scale})">${this._iconSvg(name, color)}</g>`;
    }

    _fallbackLogoSvg(name, primary, accent, iconName) {
      const cleanName = this._escape(this._cardText(name || "Locksmith", 24));
      const initials = this._escape(String(name || "L").trim().split(/\s+/).map((part) => part.charAt(0)).join("").slice(0, 3).toUpperCase() || "L");
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240" role="img" aria-label="${cleanName} logo">
          <rect width="360" height="240" rx="18" fill="#ffffff"/>
          <circle cx="96" cy="96" r="54" fill="${this._escape(accent || "#a98212")}"/>
          <g transform="translate(62 62) scale(2.85)">${this._iconSvg(iconName || "key", "#ffffff")}</g>
          <text x="176" y="94" fill="${this._escape(primary || "#111827")}" font-family="Arial, sans-serif" font-size="30" font-weight="800">${cleanName}</text>
          <text x="178" y="130" fill="${this._escape(accent || "#a98212")}" font-family="Arial, sans-serif" font-size="22" font-weight="800">${initials}</text>
          <rect x="176" y="145" width="118" height="5" rx="2.5" fill="${this._escape(accent || "#a98212")}"/>
        </svg>
      `;
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
      const profile = this._currentSettingsProfile();
      const business = profile.business || {};
      const services = profile.services || {};
      const privacy = profile.privacy || {};

      if (window.nalaClientUrl && typeof window.nalaClientUrl.best === "function") {
        return window.nalaClientUrl.best({
          uid,
          businessName: business.customerFacingBusinessName || business.legalBusinessName || "",
          legalName: business.legalBusinessName || "",
          ownerName: business.ownerOrResponsiblePartyName || privacy.fullName || "",
          serviceArea: services.serviceArea || "",
          email: business.businessEmail || privacy.emailAddress || "",
          phone: business.businessPhone || privacy.contactPhoneNumber || ""
        });
      }

      return "https://pro.nalanetwork.com/" + (uid ? String(uid).toLowerCase().replace(/[^a-z0-9-]+/g, "-") : "local-locksmith");
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
