(function () {
  const LOGO_ICONS = [
    { id: "precision-key", label: "Precision Key", svg: `<svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="28" cy="48" r="16" fill="currentColor"></circle><circle cx="28" cy="48" r="7" fill="var(--logo-bg, #ffffff)"></circle><rect x="42" y="43" width="34" height="10" rx="5" fill="currentColor"></rect><rect x="68" y="43" width="6" height="18" rx="2" fill="currentColor"></rect><rect x="58" y="43" width="6" height="14" rx="2" fill="currentColor"></rect></svg>` },
    { id: "shield-lock", label: "Shield Lock", svg: `<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M48 12l24 8v18c0 20-10 34-24 42C34 72 24 58 24 38V20l24-8z" fill="currentColor"></path><rect x="37" y="43" width="22" height="19" rx="4" fill="var(--logo-bg, #ffffff)"></rect><path d="M40 43v-5c0-5 3-10 8-10s8 5 8 10v5" fill="none" stroke="var(--logo-bg, #ffffff)" stroke-width="6" stroke-linecap="round"></path></svg>` },
    { id: "modern-keyhole", label: "Modern Keyhole", svg: `<svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="36" r="18" fill="currentColor"></circle><path d="M48 44l10 24H38l10-24z" fill="currentColor"></path><circle cx="48" cy="36" r="7" fill="var(--logo-bg, #ffffff)"></circle></svg>` },
    { id: "entry-lock", label: "Entry Lock", svg: `<svg viewBox="0 0 96 96" aria-hidden="true"><rect x="26" y="38" width="44" height="34" rx="8" fill="currentColor"></rect><path d="M34 38V30c0-8 6-14 14-14s14 6 14 14v8" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"></path><circle cx="48" cy="54" r="5" fill="var(--logo-bg, #ffffff)"></circle><rect x="46" y="54" width="4" height="10" rx="2" fill="var(--logo-bg, #ffffff)"></rect></svg>` },
    { id: "garage-key", label: "Garage Key", svg: `<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M19 55l20-20 11 11 19-19 8 8-19 19 11 11-20 20-30-30z" fill="currentColor"></path><circle cx="33" cy="40" r="6" fill="var(--logo-bg, #ffffff)"></circle></svg>` },
    { id: "monogram", label: "Monogram", svg: "" }
  ];

  const LOGO_FONTS = [
    { id: "outfit-manrope", label: "Outfit + Manrope", headline: "'Outfit', 'Segoe UI', sans-serif", body: "'Manrope', 'Segoe UI', sans-serif", summary: "Modern geometric pairing for web, vans, and social readability." },
    { id: "archivo-manrope", label: "Archivo Black + Manrope", headline: "'Arial Black', 'Arial', sans-serif", body: "'Manrope', 'Segoe UI', sans-serif", summary: "Bold signage-first style for roadside visibility." },
    { id: "space-libre", label: "Space Grotesk + Libre Baskerville", headline: "'Segoe UI', sans-serif", body: "Georgia, serif", summary: "Premium mix for established, trust-forward locksmith brands." }
  ];

  const LOGO_TEMPLATES = [
    { id: "service-wordmark", label: "Service Wordmark", summary: "Horizontal lockup for vehicle wraps, Google profile art, and website headers." },
    { id: "trusted-shield", label: "Trusted Shield", summary: "Security-forward badge direction for rekeys, property managers, and commercial accounts." },
    { id: "modern-stack", label: "Modern Stack", summary: "Clean stacked layout for websites, proposals, and social assets." },
    { id: "monogram-seal", label: "Monogram Seal", summary: "Compact emblem suited to invoices, stationery, and premium service brands." }
  ];

  const LOGO_VARIATIONS = [
    { id: "horizontal", label: "Horizontal", summary: "Primary website and van lockup." },
    { id: "stacked", label: "Stacked", summary: "Square ads and flyers." },
    { id: "badge", label: "Badge", summary: "Uniforms, decals, and favicons." },
    { id: "icon-only", label: "Icon only", summary: "Small social avatar and favicon." }
  ];

  class MTKBIABSetup {
    constructor(config) {
      this.cfg = config || {};
      this.el = null;
      this.state = this.loadState();
      this.currentStep = this.getInitialStep();
      this.activeHelp = false;
      this.invoiceDraft = {
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        serviceType: "Rekey service",
        notes: "",
        lineItems: [
          { label: "Labor", amount: "125" },
          { label: "Parts", amount: "35" },
          { label: "Service fee", amount: "25" }
        ],
        askReview: true
      };
      this.notice = "";

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.init(), { once: true });
      } else {
        this.init();
      }
    }

    init() {
      this.el = document.querySelector("mtk-biab-setup");
      if (this.el) {
        this.render();
        this.bind();
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        this.el = document.querySelector("mtk-biab-setup");
        if (!this.el) return;
        obs.disconnect();
        this.render();
        this.bind();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    loadState() {
      const empty = { values: {}, completed: {}, skipped: {}, invoices: [], reviewRequests: [] };
      try {
        const raw = localStorage.getItem(this.cfg.storageKey);
        return raw ? Object.assign(empty, JSON.parse(raw)) : empty;
      } catch (err) {
        return empty;
      }
    }

    saveState() {
      try {
        localStorage.setItem(this.cfg.storageKey, JSON.stringify(this.state));
      } catch (err) {
        console.warn("[mtk-biab-setup] Could not save state", err);
      }
    }

    getInitialStep() {
      const requested = new URLSearchParams(window.location.search).get("step");
      const index = this.cfg.steps.findIndex(step => step.id === requested);
      if (index >= 0) return index;
      const firstOpen = this.cfg.steps.findIndex(step => !this.state.completed[step.id]);
      return firstOpen >= 0 ? firstOpen : 0;
    }

    mode() {
      return new URLSearchParams(window.location.search).get("tool") || "setup";
    }

    bind() {
      this.el.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-biab-action]");
        if (!btn) return;
        const action = btn.dataset.biabAction;

        if (action === "next") this.nextStep();
        if (action === "prev") this.prevStep();
        if (action === "goto") this.gotoStep(btn.dataset.stepId);
        if (action === "complete") this.completeStep();
        if (action === "skip") this.skipStep();
        if (action === "help") this.toggleHelp();
        if (action === "exit-help") this.toggleHelp(false);
        if (action === "tool") this.openTool(btn.dataset.toolId);
        if (action === "invoice-send") this.sendInvoice();
        if (action === "invoice-add-line") this.addInvoiceLine();
        if (action === "invoice-remove-line") this.removeInvoiceLine(Number(btn.dataset.index));
        if (action === "reset-demo") this.resetDemoState();
        if (action === "logo-choice") this.setLogoChoice(btn.dataset.field, btn.dataset.value);
        if (action === "logo-apply") this.applyLogoToWebsite();
        if (action === "logo-download") this.downloadLogoSvg();
      });

      this.el.addEventListener("input", (event) => {
        const field = event.target.dataset.field;
        if (field) this.updateField(event.target);

        const invoiceField = event.target.dataset.invoiceField;
        if (invoiceField) this.updateInvoiceField(event.target);
      });

      this.el.addEventListener("change", (event) => {
        const field = event.target.dataset.field;
        if (field) this.updateField(event.target);

        const invoiceField = event.target.dataset.invoiceField;
        if (invoiceField) this.updateInvoiceField(event.target);
      });
    }

    render() {
      const mode = this.mode();
      if (mode !== "setup") {
        this.renderTool(mode);
        return;
      }

      const step = this.cfg.steps[this.currentStep] || this.cfg.steps[0];
      const pct = this.progressPct();

      this.el.innerHTML = `
        <div class="mtk-biab-setup__shell">
          ${this.renderHeader(pct)}
          ${this.renderStepNav(step)}
          <div class="mtk-biab-setup__body">
            <main class="mtk-biab-setup__main" aria-labelledby="biab-step-title">
              ${this.renderStep(step)}
            </main>
            ${this.activeHelp ? this.renderHelp(step) : ""}
          </div>
        </div>
      `;
    }

    renderHeader(pct) {
      return `
        <header class="mtk-biab-setup__header">
          <div>
            <a class="mtk-biab-setup__brand" href="dashboard/index.html" aria-label="Back to dashboard">
              <img src="img/logo-nala-association.webp" alt="NALA" />
              <span>Business in a Box Setup</span>
            </a>
            <p>Your guided setup/editing space. Daily tools live from the main dashboard after setup.</p>
          </div>
          <div class="mtk-biab-setup__header-actions">
            <div class="mtk-biab-setup__progress-summary" aria-label="${pct}% complete">
              <strong>${pct}% done</strong>
              <span class="mtk-biab-setup__bar"><span style="width:${pct}%"></span></span>
            </div>
            <button type="button" class="mtk-biab-setup__icon-btn" data-biab-action="help" aria-expanded="${this.activeHelp ? "true" : "false"}">
              <span class="material-icons" aria-hidden="true">help_outline</span>
              <span>Help</span>
            </button>
          </div>
        </header>
      `;
    }

    renderStepNav(activeStep) {
      return `
        <nav class="mtk-biab-setup__stepper" aria-label="Setup steps">
          <ol>
            ${this.cfg.steps.map((step, index) => {
              const current = step.id === activeStep.id;
              const complete = !!this.state.completed[step.id];
              const skipped = !!this.state.skipped[step.id];
              const inProgress = !complete && !skipped && this.stepHasProgress(step);
              const status = complete ? "Complete" : skipped ? "Skipped" : current ? "Current" : inProgress ? "In progress" : "Not started";
              const icon = complete ? "check_circle" : skipped ? "remove_circle_outline" : current ? "radio_button_checked" : inProgress ? "pending" : "radio_button_unchecked";
              return `
                <li>
                  <button type="button" class="${current ? "is-current" : ""}" data-biab-action="goto" data-step-id="${step.id}" aria-current="${current ? "step" : "false"}">
                    <span class="material-icons" aria-hidden="true">${icon}</span>
                    <span><strong>${this.escape(step.navLabel)}</strong><small>${status}</small></span>
                  </button>
                </li>
              `;
            }).join("")}
          </ol>
        </nav>
      `;
    }

    renderStep(step) {
      if (step.kind === "intro") return this.renderIntro(step);
      if (step.kind === "launch") return this.renderLaunch(step);

      return `
        <section class="mtk-biab-setup__panel">
          <div class="mtk-biab-setup__panel-head">
            <span class="mtk-biab-setup__eyebrow">${this.escape(step.eyebrow || "")}</span>
            <h1 id="biab-step-title">${this.escape(step.title)}</h1>
            <p>${this.escape(step.summary || "")}</p>
          </div>
          ${step.sourceNote ? `<p class="mtk-biab-setup__source-note">${this.escape(step.sourceNote)}</p>` : ""}
          ${this.notice ? `<div class="mtk-biab-setup__notice" role="status">${this.escape(this.notice)}</div>` : ""}
          ${this.renderInstructions(step)}
          ${this.renderLinks(step)}
          ${this.renderFields(step)}
          ${this.renderFooter(step)}
        </section>
      `;
    }

    renderIntro(step) {
      return `
        <section class="mtk-biab-setup__panel mtk-biab-setup__intro">
          <span class="mtk-biab-setup__eyebrow">${this.escape(step.eyebrow)}</span>
          <h1 id="biab-step-title">${this.escape(step.title)}</h1>
          <p>${this.escape(step.summary)}</p>
          <div class="mtk-biab-setup__intro-grid">
            ${["Business background", "Legal reminders", "Financial setup", "Brand system", "Logo creation", "Actual website", "Google profile", "Invoices", "Reviews", "Launch review"].map(item => `
              <div><span class="material-icons" aria-hidden="true">arrow_forward</span>${item}</div>
            `).join("")}
          </div>
          <div class="mtk-biab-setup__video-placeholder">
            <span class="material-icons" aria-hidden="true">play_circle</span>
            <div><strong>Video walkthrough</strong><p>Marked for later: setup walkthrough and Business in a Box services overview.</p></div>
          </div>
          ${this.renderFooter(step, "Start setup")}
        </section>
      `;
    }

    renderLaunch(step) {
      const missing = this.cfg.steps.filter(item => item.id !== "launch" && item.id !== "intro" && !this.state.completed[item.id]);
      return `
        <section class="mtk-biab-setup__panel">
          <div class="mtk-biab-setup__panel-head">
            <span class="mtk-biab-setup__eyebrow">${this.escape(step.eyebrow)}</span>
            <h1 id="biab-step-title">${this.escape(step.title)}</h1>
            <p>${this.escape(step.summary)}</p>
          </div>
          <div class="mtk-biab-setup__readiness">
            <h2>Readiness summary</h2>
            ${missing.length ? `<p>${missing.length} setup area${missing.length === 1 ? "" : "s"} still need attention.</p>` : "<p>All guided setup areas are marked complete.</p>"}
            <ul>
              ${this.cfg.steps.filter(item => item.id !== "intro").map(item => `
                <li><span class="material-icons" aria-hidden="true">${this.state.completed[item.id] ? "check_circle" : "radio_button_unchecked"}</span>${this.escape(item.title)}</li>
              `).join("")}
            </ul>
          </div>
          ${this.renderFields(step)}
          <div class="mtk-biab-setup__tool-grid">
            ${this.cfg.tools.filter(tool => tool.id !== "setup").map(tool => this.renderToolCard(tool)).join("")}
          </div>
          ${this.renderFooter(step, "Finish setup")}
        </section>
      `;
    }

    renderInstructions(step) {
      if (!Array.isArray(step.instructions) || !step.instructions.length) return "";
      return `
        <section class="mtk-biab-setup__instructions" aria-label="Step-by-step instructions">
          <h2>Guided instructions</h2>
          <ol>${step.instructions.map(item => `<li>${this.escape(this.fill(item))}</li>`).join("")}</ol>
        </section>
      `;
    }

    renderLinks(step) {
      if (!Array.isArray(step.links) || !step.links.length) return "";
      return `
        <section class="mtk-biab-setup__links" aria-label="Official links">
          <h2>Official links</h2>
          <div>
            ${step.links.map(link => `<a href="${this.escape(link.href)}" target="_blank" rel="noopener">${this.escape(link.label)} <span aria-hidden="true">↗</span></a>`).join("")}
          </div>
        </section>
      `;
    }

    renderFields(step) {
      if (!Array.isArray(step.fields) || !step.fields.length) return "";
      return `
        <form class="mtk-biab-setup__form" novalidate>
          ${step.fields.map(field => this.renderField(field)).join("")}
        </form>
      `;
    }

    renderField(field) {
      const value = this.state.values[field.id];
      const inputId = `biab-field-${field.id}`;
      const helper = field.helper ? `<small id="${inputId}-help">${this.escape(field.helper)}</small>` : "";
      const isRequired = this.fieldIsRequired(field);
      const required = isRequired ? " required" : "";
      const requiredMark = isRequired ? " *" : "";
      const described = field.helper ? ` aria-describedby="${inputId}-help"` : "";

      if (field.type === "textarea") {
        const fullClass = field.full ? " mtk-biab-setup__field--full" : "";
        return `<label class="mtk-biab-setup__field${fullClass}" for="${inputId}"><span>${this.escape(field.label)}${requiredMark}</span><textarea id="${inputId}" data-field="${field.id}" rows="${Number(field.rows || 4)}" placeholder="${this.escape(field.placeholder || "")}"${required}${described}>${this.escape(value || "")}</textarea>${helper}</label>`;
      }

      if (field.type === "select") {
        return `<label class="mtk-biab-setup__field" for="${inputId}"><span>${this.escape(field.label)}${requiredMark}</span><select id="${inputId}" data-field="${field.id}"${required}>${(field.options || []).map(option => `<option value="${this.escape(option)}" ${value === option ? "selected" : ""}>${this.escape(option)}</option>`).join("")}</select>${helper}</label>`;
      }

      if (field.type === "checkbox") {
        return `<label class="mtk-biab-setup__check"><input id="${inputId}" data-field="${field.id}" type="checkbox" ${value ? "checked" : ""}${required}> <span>${this.escape(field.label)}${requiredMark}</span></label>`;
      }

      if (field.type === "checks") {
        const selected = Array.isArray(value) ? value : [];
        return `<fieldset class="mtk-biab-setup__checks"><legend>${this.escape(field.label)}${requiredMark}</legend><div class="mtk-biab-setup__checks-grid">${(field.options || []).map(option => `<label><input data-field="${field.id}" type="checkbox" value="${this.escape(option)}" ${selected.includes(option) ? "checked" : ""}> <span>${this.escape(option)}</span></label>`).join("")}</div></fieldset>`;
      }

      if (field.type === "palette") {
        const selected = value || this.cfg.palettes[0].id;
        return `<fieldset class="mtk-biab-setup__palettes"><legend>${this.escape(field.label)}${requiredMark}</legend><div class="mtk-biab-setup__palette-grid">${this.cfg.palettes.map(palette => `
          <label class="${selected === palette.id ? "is-selected" : ""}">
            <input data-field="${field.id}" type="radio" name="${field.id}" value="${this.escape(palette.id)}" ${selected === palette.id ? "checked" : ""}>
            <span class="mtk-biab-setup__swatches">${palette.colors.map(color => `<i style="background:${this.escape(color)}"></i>`).join("")}</span>
            <strong>${this.escape(palette.name)}</strong>
            <small>${this.escape(palette.position)}</small>
          </label>
        `).join("")}</div></fieldset>`;
      }

      if (field.type === "file") {
        const fileName = value ? `<small>Selected: ${this.escape(value)}</small>` : helper;
        return `<label class="mtk-biab-setup__field mtk-biab-setup__field--full" for="${inputId}"><span>${this.escape(field.label)}${requiredMark}</span><input id="${inputId}" data-field="${field.id}" type="file" accept=".svg,.png,.jpg,.jpeg,.webp"${required}${described}>${fileName}</label>`;
      }

      if (field.type === "logo-icons") {
        return this.renderLogoChoiceGroup(field, LOGO_ICONS, "logoIcon", "icons");
      }

      if (field.type === "logo-fonts") {
        return this.renderLogoChoiceGroup(field, LOGO_FONTS, "logoTypeStyle", "fonts");
      }

      if (field.type === "logo-templates") {
        return this.renderLogoChoiceGroup(field, LOGO_TEMPLATES, "logoTemplate", "templates");
      }

      if (field.type === "logo-variations") {
        return this.renderLogoChoiceGroup(field, LOGO_VARIATIONS, "logoVariation", "variations");
      }

      if (field.type === "logo-preview") {
        return this.renderLogoPreview(field);
      }

      if (field.type === "logo-handoff") {
        return this.renderLogoHandoff();
      }

      return `<label class="mtk-biab-setup__field" for="${inputId}"><span>${this.escape(field.label)}${requiredMark}</span><input id="${inputId}" data-field="${field.id}" type="${this.escape(field.type || "text")}" value="${this.escape(value || "")}" placeholder="${this.escape(field.placeholder || "")}"${required}${described}>${helper}</label>`;
    }

    renderLogoChoiceGroup(field, options, fieldId, modifier) {
      const selected = this.logoValue(fieldId);
      return `
        <fieldset class="mtk-biab-setup__logo-choices mtk-biab-setup__logo-choices--${this.escape(modifier)}">
          <legend>${this.escape(field.label)}${this.fieldIsRequired(field) ? " *" : ""}</legend>
          <div>
            ${options.map(option => {
              const active = selected === option.id;
              const iconMarkup = modifier === "icons"
                ? `<span class="mtk-biab-setup__logo-choice-icon">${option.id === "monogram" ? this.escape(this.logoLetters()) : option.svg}</span>`
                : "";
              const fontStyle = modifier === "fonts" ? ` style="font-family:${this.escape(option.headline)}"` : "";
              return `
                <button type="button" class="${active ? "is-active" : ""}" data-biab-action="logo-choice" data-field="${this.escape(fieldId)}" data-value="${this.escape(option.id)}">
                  ${iconMarkup}
                  <strong${fontStyle}>${this.escape(option.label)}</strong>
                  ${option.summary ? `<small>${this.escape(option.summary)}</small>` : ""}
                </button>
              `;
            }).join("")}
          </div>
        </fieldset>
      `;
    }

    renderLogoPreview(field) {
      const source = this.val("logoSource") || "Create logo here";
      const template = this.logoResource(LOGO_TEMPLATES, "logoTemplate");
      const uploaded = this.val("logoUploadData");
      return `
        <section class="mtk-biab-setup__logo-designer">
          <div class="mtk-biab-setup__logo-summary">
            <span>Research-based starter direction</span>
            <h2>${this.escape(template.label)}</h2>
            <p>${this.escape(source === "Upload existing icon/logo" ? "Uploaded artwork will replace the generated placeholder in previews and the website handoff." : template.summary)}</p>
          </div>
          <div class="mtk-biab-setup__logo-preview-grid">
            ${this.renderLogoPreviewCard("Primary concept", "primary-dark")}
            ${this.renderLogoPreviewCard("Light background", "primary-light")}
            ${this.renderLogoPreviewCard("Social / favicon", "icon-only")}
            ${this.renderLogoPreviewCard("Vehicle banner", "horizontal")}
          </div>
        </section>
      `;
    }

    renderLogoPreviewCard(label, variant) {
      const palette = this.logoPalette();
      const dark = variant === "primary-dark" || variant === "horizontal" || variant === "icon-only";
      const bg = dark ? palette.surface : "#ffffff";
      const color = dark ? palette.textOnDark : palette.textOnLight;
      return `
        <article class="mtk-biab-setup__logo-preview-card">
          <span>${this.escape(label)}</span>
          <div style="background:${this.escape(bg)};color:${this.escape(color)}">
            ${this.buildLogoMarkup(variant)}
          </div>
        </article>
      `;
    }

    renderLogoHandoff() {
      return `
        <section class="mtk-biab-setup__logo-handoff">
          <h2>Production handoff</h2>
          <ul>
            <li>Replace placeholder icons and fonts with licensed production assets.</li>
            <li>Export SVG, transparent PNG, one-color, reversed, favicon, and vehicle/banner versions.</li>
            <li>Test the logo on the website header, Google profile, invoice, shirt, and vehicle mockup.</li>
          </ul>
          <div>
            <button type="button" class="mtk-biab-setup__btn" data-biab-action="logo-download">Download SVG draft</button>
            <button type="button" class="mtk-biab-setup__btn mtk-biab-setup__btn--primary" data-biab-action="logo-apply">Apply to website</button>
          </div>
        </section>
      `;
    }

    buildLogoMarkup(variant = "primary-dark") {
      const palette = this.logoPalette();
      const font = this.logoResource(LOGO_FONTS, "logoTypeStyle");
      const template = this.logoResource(LOGO_TEMPLATES, "logoTemplate");
      const source = this.val("logoSource") || "Create logo here";
      const uploaded = this.val("logoUploadData");
      const resolved = variant === "primary-dark" || variant === "primary-light" ? this.logoValue("logoVariation") : variant;
      const isStacked = resolved === "stacked" || template.id === "modern-stack";
      const isBadge = resolved === "badge" || template.id === "trusted-shield" || template.id === "monogram-seal";
      const isIconOnly = resolved === "icon-only";
      const icon = source === "Upload existing icon/logo" && uploaded
        ? `<span class="mtk-biab-setup__logo-mark mtk-biab-setup__logo-mark--custom"><img src="${this.escape(uploaded)}" alt=""></span>`
        : `<span class="mtk-biab-setup__logo-mark" style="color:${this.escape(palette.primary)};--logo-bg:${this.escape(variant === "primary-light" ? "#ffffff" : palette.surface)};">${this.logoIconMarkup()}</span>`;
      if (isIconOnly) return `<div class="mtk-biab-setup__logo-lockup mtk-biab-setup__logo-lockup--icon-only">${icon}</div>`;
      const cls = isBadge ? "badge" : isStacked ? "stacked" : "horizontal";
      return `
        <div class="mtk-biab-setup__logo-lockup mtk-biab-setup__logo-lockup--${cls}" style="--logo-heading-font:${this.escape(font.headline)};--logo-body-font:${this.escape(font.body)};">
          ${icon}
          <div class="mtk-biab-setup__logo-copy">
            <strong>${this.escape(this.val("businessName") || "Your Locksmith")}</strong>
            <span>${this.escape(this.val("tagline") || "Mobile Locksmith Service")}</span>
          </div>
        </div>
      `;
    }

    renderFooter(step, nextText) {
      const isFirst = this.currentStep === 0;
      const isLast = this.currentStep === this.cfg.steps.length - 1;
      return `
        <footer class="mtk-biab-setup__footer">
          <button type="button" class="mtk-biab-setup__btn" data-biab-action="prev" ${isFirst ? "disabled" : ""}>Previous</button>
          <div>
            ${step.kind !== "intro" && step.kind !== "launch" ? `<button type="button" class="mtk-biab-setup__btn" data-biab-action="skip">Skip for now</button>` : ""}
            <button type="button" class="mtk-biab-setup__btn mtk-biab-setup__btn--primary" data-biab-action="${isLast ? "complete" : "next"}">${nextText || "Save & Continue"}</button>
          </div>
        </footer>
      `;
    }

    renderHelp(step) {
      return `
        <aside class="mtk-biab-setup__help" aria-label="Help">
          <button type="button" class="mtk-biab-setup__help-close" data-biab-action="exit-help" aria-label="Close help"><span class="material-icons" aria-hidden="true">close</span></button>
          <h2>Help</h2>
          <p>Business in a Box guides you step by step through creating and configuring your locksmith business tools.</p>
          <p>Your answers are reused across the actual website, invoice generator, review workflow, business plan, brand kit, and marketing setup.</p>
          <h3>Current step</h3>
          <p><strong>${this.escape(step.title)}</strong></p>
          <p>${this.escape(step.summary || "")}</p>
          <h3>General issues</h3>
          <p>Email <a href="mailto:${this.escape(this.cfg.supportEmail)}">${this.escape(this.cfg.supportEmail)}</a>.</p>
          <h3>Video walkthrough</h3>
          <p>Coming later.</p>
        </aside>
      `;
    }

    renderTool(mode) {
      const titleMap = {
        invoices: "Invoice Generator",
        reviews: "Reviews",
        "business-plan": "Business Plan",
        brand: "Brand Kit",
        marketing: "Marketing Setup"
      };

      this.el.innerHTML = `
        <div class="mtk-biab-setup__shell">
          ${this.renderHeader(this.progressPct())}
          <main class="mtk-biab-setup__tool-page">
            <nav class="mtk-biab-setup__tool-nav" aria-label="Business in a Box tools">
              ${this.cfg.tools.map(tool => `<a class="${mode === tool.id ? "is-active" : ""}" href="${this.escape(tool.href)}"><span class="material-icons" aria-hidden="true">${this.escape(tool.icon)}</span>${this.escape(tool.label)}</a>`).join("")}
            </nav>
            <section class="mtk-biab-setup__panel">
              <div class="mtk-biab-setup__panel-head">
                <span class="mtk-biab-setup__eyebrow">Business in a Box tool</span>
                <h1>${this.escape(titleMap[mode] || "Business in a Box")}</h1>
              </div>
              ${mode === "invoices" ? this.renderInvoiceTool() : this.renderSimpleTool(mode)}
            </section>
          </main>
        </div>
      `;
    }

    renderSimpleTool(mode) {
      if (mode === "reviews") {
        const requests = this.state.reviewRequests || [];
        return `
          <div class="mtk-biab-setup__review-summary"><strong>${requests.length}</strong><span>review request${requests.length === 1 ? "" : "s"} sent from invoices</span></div>
          <div class="mtk-biab-setup__list">${requests.length ? requests.map(req => `<article><strong>${this.escape(req.customerName || "Customer")}</strong><p>${this.escape(req.customerEmail || "")}</p><small>Source: ${this.escape(req.source || "Invoice")} · ${this.escape(req.createdAt || "")}</small></article>`).join("") : "<p>No invoice review requests have been sent yet.</p>"}</div>
        `;
      }

      if (mode === "brand") {
        return `<div class="mtk-biab-setup__tool-grid">${this.cfg.palettes.map(palette => `<article class="mtk-biab-setup__tool-card"><span class="mtk-biab-setup__swatches">${palette.colors.map(color => `<i style="background:${this.escape(color)}"></i>`).join("")}</span><h2>${this.escape(palette.name)}</h2><p>${this.escape(palette.position)}</p></article>`).join("")}</div><p class="mtk-biab-setup__source-note">Production icons and fonts are placeholders for now and should be replaced with licensed assets later.</p>`;
      }

      if (mode === "business-plan") {
        const serviceList = (this.val("services") || []).join(", ");
        const extraServices = this.val("additionalLaunchServices") || "";
        return `<article class="mtk-biab-setup__document-preview"><h2>${this.escape(this.val("businessName") || "Your Locksmith Business")}</h2><p><strong>Service area:</strong> ${this.escape(this.val("serviceArea") || "Not set")}</p><p><strong>Launch services:</strong> ${this.escape(serviceList || "Not set")}</p>${extraServices ? `<p><strong>Additional services:</strong> ${this.escape(extraServices)}</p>` : ""}<p><strong>Differentiator:</strong> clear pricing, professional arrival, clean work, ETA updates, detailed invoices, and review follow-up.</p></article>`;
      }

      return `<p>This area is available after setup. Use <a href="biab/index.html">Edit setup</a> to continue guided configuration.</p>`;
    }

    renderInvoiceTool() {
      const total = this.invoiceDraft.lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const reviewEmail = this.invoiceDraft.customerEmail || this.val("reviewEmailFrom") || this.val("businessEmail") || "";
      return `
        ${this.notice ? `<div class="mtk-biab-setup__notice" role="status">${this.escape(this.notice)}</div>` : ""}
        <div class="mtk-biab-setup__invoice-layout">
          <form class="mtk-biab-setup__form mtk-biab-setup__invoice-form">
            <label class="mtk-biab-setup__field"><span>Customer name</span><input data-invoice-field="customerName" value="${this.escape(this.invoiceDraft.customerName)}" placeholder="Jane Customer"></label>
            <label class="mtk-biab-setup__field"><span>Customer email</span><input data-invoice-field="customerEmail" type="email" value="${this.escape(this.invoiceDraft.customerEmail)}" placeholder="jane@example.com"></label>
            <label class="mtk-biab-setup__field"><span>Customer phone</span><input data-invoice-field="customerPhone" type="tel" value="${this.escape(this.invoiceDraft.customerPhone)}" placeholder="(555) 123-4567"></label>
            <label class="mtk-biab-setup__field"><span>Service type</span><select data-invoice-field="serviceType">${["Rekey service", "House lockout", "Lock change", "Deadbolt installation", "Commercial service"].map(item => `<option ${this.invoiceDraft.serviceType === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
            <label class="mtk-biab-setup__field"><span>Job notes</span><textarea data-invoice-field="notes" rows="3">${this.escape(this.invoiceDraft.notes)}</textarea></label>
            <fieldset class="mtk-biab-setup__line-items"><legend>Line items</legend>
              ${this.invoiceDraft.lineItems.map((item, index) => `<div><input aria-label="Line item ${index + 1} label" data-invoice-field="lineLabel:${index}" value="${this.escape(item.label)}"><input aria-label="Line item ${index + 1} amount" data-invoice-field="lineAmount:${index}" type="number" min="0" step="0.01" value="${this.escape(item.amount)}"><button type="button" data-biab-action="invoice-remove-line" data-index="${index}" aria-label="Remove line item"><span class="material-icons" aria-hidden="true">delete</span></button></div>`).join("")}
              <button type="button" class="mtk-biab-setup__btn" data-biab-action="invoice-add-line">Add line</button>
            </fieldset>
            <label class="mtk-biab-setup__check"><input data-invoice-field="askReview" type="checkbox" ${this.invoiceDraft.askReview ? "checked" : ""}> <span>Ask for a review after sending this invoice</span></label>
            ${this.invoiceDraft.askReview ? `<label class="mtk-biab-setup__field"><span>Review request email</span><input data-invoice-field="reviewEmail" type="email" value="${this.escape(reviewEmail)}"></label>` : ""}
            <button type="button" class="mtk-biab-setup__btn mtk-biab-setup__btn--primary" data-biab-action="invoice-send">Send Invoice</button>
          </form>
          <aside class="mtk-biab-setup__invoice-preview" aria-label="Invoice preview">
            <h2>${this.escape(this.val("businessName") || "Your Locksmith Business")}</h2>
            <p>${this.escape(this.val("businessPhone") || "Business phone")}<br>${this.escape(this.val("businessEmail") || "Business email")}</p>
            <hr>
            <p><strong>Invoice:</strong> ${(this.val("invoicePrefix") || "INV")}-0001</p>
            <p><strong>Customer:</strong> ${this.escape(this.invoiceDraft.customerName || "Customer name")}</p>
            <table><tbody>${this.invoiceDraft.lineItems.map(item => `<tr><td>${this.escape(item.label || "Line item")}</td><td>$${Number(item.amount || 0).toFixed(2)}</td></tr>`).join("")}</tbody><tfoot><tr><th>Total</th><th>$${total.toFixed(2)}</th></tr></tfoot></table>
          </aside>
        </div>
      `;
    }

    renderToolCard(tool) {
      return `<a class="mtk-biab-setup__tool-card" href="${this.escape(tool.href)}"><span class="material-icons" aria-hidden="true">${this.escape(tool.icon)}</span><strong>${this.escape(tool.label)}</strong></a>`;
    }

    updateField(target) {
      const field = target.dataset.field;
      if (target.type === "file") {
        const file = target.files && target.files[0];
        this.state.values[field] = file ? file.name : "";
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.state.values.logoUploadData = event.target.result;
            this.syncCurrentStepCompletion();
            this.saveState();
            this.render();
          };
          reader.readAsDataURL(file);
        } else {
          delete this.state.values.logoUploadData;
        }
      } else if (target.type === "checkbox" && target.value && target.closest("fieldset")) {
        const selected = Array.from(this.el.querySelectorAll(`[data-field="${field}"]:checked`)).map(input => input.value);
        this.state.values[field] = selected;
      } else if (target.type === "checkbox") {
        this.state.values[field] = target.checked;
      } else {
        this.state.values[field] = target.value;
      }
      this.syncCurrentStepCompletion();
      this.saveState();
      if (target.closest(".mtk-biab-setup__palettes") || String(field).indexOf("logo") === 0) this.render();
    }

    setLogoChoice(field, value) {
      if (!field) return;
      this.state.values[field] = value;
      this.syncCurrentStepCompletion();
      this.saveState();
      this.render();
    }

    updateInvoiceField(target) {
      const field = target.dataset.invoiceField;
      if (field === "askReview") {
        this.invoiceDraft.askReview = target.checked;
        this.renderTool("invoices");
        return;
      }
      if (field === "reviewEmail") {
        this.invoiceDraft.customerEmail = target.value;
        return;
      }
      if (field.indexOf("lineLabel:") === 0) {
        this.invoiceDraft.lineItems[Number(field.split(":")[1])].label = target.value;
        this.renderTool("invoices");
        return;
      }
      if (field.indexOf("lineAmount:") === 0) {
        this.invoiceDraft.lineItems[Number(field.split(":")[1])].amount = target.value;
        this.renderTool("invoices");
        return;
      }
      this.invoiceDraft[field] = target.value;
      if (["customerName", "customerEmail", "serviceType"].includes(field)) this.renderTool("invoices");
    }

    addInvoiceLine() {
      this.invoiceDraft.lineItems.push({ label: "Line item", amount: "0" });
      this.renderTool("invoices");
    }

    removeInvoiceLine(index) {
      if (this.invoiceDraft.lineItems.length <= 1) return;
      this.invoiceDraft.lineItems.splice(index, 1);
      this.renderTool("invoices");
    }

    sendInvoice() {
      const total = this.invoiceDraft.lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const record = {
        id: "INV-" + String((this.state.invoices || []).length + 1).padStart(4, "0"),
        customerName: this.invoiceDraft.customerName,
        customerEmail: this.invoiceDraft.customerEmail,
        serviceType: this.invoiceDraft.serviceType,
        total,
        createdAt: new Date().toLocaleString()
      };
      this.state.invoices = this.state.invoices || [];
      this.state.invoices.unshift(record);

      if (this.invoiceDraft.askReview && this.invoiceDraft.customerEmail) {
        const request = {
          customerName: this.invoiceDraft.customerName,
          customerEmail: this.invoiceDraft.customerEmail,
          jobType: this.invoiceDraft.serviceType,
          reviewUrl: this.val("reviewPublicUrl") || (window.location.origin + "/repo_deploy/client/review.html"),
          source: record.id,
          createdAt: record.createdAt
        };
        this.state.reviewRequests = this.state.reviewRequests || [];
        this.state.reviewRequests.unshift(request);
        if (window.wc && typeof wc.publish === "function") {
          wc.publish("mtk-biab:review-request", request);
        }
      }

      this.saveState();
      this.notice = this.invoiceDraft.askReview && this.invoiceDraft.customerEmail
        ? `Invoice ${record.id} sent to ${record.customerEmail}. Review request also sent.`
        : `Invoice ${record.id} sent.`;
      this.renderTool("invoices");
    }

    nextStep() {
      this.completeStep(false);
      if (this.currentStep < this.cfg.steps.length - 1) this.currentStep += 1;
      this.render();
    }

    prevStep() {
      if (this.currentStep > 0) this.currentStep -= 1;
      this.render();
    }

    completeStep(render = true) {
      const step = this.cfg.steps[this.currentStep];
      if (this.stepCanComplete(step)) {
        this.state.completed[step.id] = true;
        delete this.state.skipped[step.id];
        this.notice = "";
      } else {
        delete this.state.completed[step.id];
        this.notice = "Saved. Complete the required items before this step is marked complete.";
      }
      this.saveState();
      if (render) this.render();
    }

    skipStep() {
      const step = this.cfg.steps[this.currentStep];
      this.state.skipped[step.id] = true;
      if (this.currentStep < this.cfg.steps.length - 1) this.currentStep += 1;
      this.saveState();
      this.render();
    }

    gotoStep(stepId) {
      const index = this.cfg.steps.findIndex(step => step.id === stepId);
      if (index >= 0) {
        this.currentStep = index;
        this.render();
      }
    }

    openTool(toolId) {
      const tool = this.cfg.tools.find(item => item.id === toolId);
      if (tool) window.location.href = tool.href;
    }

    toggleHelp(force) {
      this.activeHelp = typeof force === "boolean" ? force : !this.activeHelp;
      this.render();
    }

    resetDemoState() {
      localStorage.removeItem(this.cfg.storageKey);
      this.state = this.loadState();
      this.currentStep = 0;
      this.render();
    }

    progressPct() {
      const countable = this.cfg.steps.filter(step => step.id !== "intro");
      const done = countable.filter(step => this.state.completed[step.id]).length;
      return Math.round((done / Math.max(1, countable.length)) * 100);
    }

    syncCurrentStepCompletion() {
      const step = this.cfg.steps[this.currentStep];
      if (!step || !this.state.completed[step.id]) return;
      if (!this.stepCanComplete(step)) delete this.state.completed[step.id];
    }

    stepCanComplete(step) {
      if (!step) return false;
      if (step.kind === "intro") return true;
      const requiredFields = (step.fields || []).filter(field => this.fieldIsRequired(field));
      if (!requiredFields.length) return true;
      return requiredFields.every(field => this.fieldIsComplete(field));
    }

    stepHasProgress(step) {
      return (step.fields || []).some(field => this.fieldHasProgress(field));
    }

    fieldIsComplete(field) {
      const value = this.state.values[field.id];
      if (field.type === "checkbox") return value === true;
      if (field.type === "checks") return Array.isArray(value) && value.length > 0;
      if (field.type === "palette") return !!(value || this.cfg.palettes[0]?.id);
      if (field.type === "select") return this.selectValueIsComplete(field, value || field.options?.[0]);
      if (field.type === "file") return !!this.state.values.logoUploadData;
      if (String(field.type || "").indexOf("logo-") === 0) return !!this.logoValue(field.id);
      return String(value || "").trim().length > 0;
    }

    fieldIsRequired(field) {
      if (!field.required) return false;
      if (!field.requiredWhen) return true;
      const actual = this.state.values[field.requiredWhen.field];
      if (Object.prototype.hasOwnProperty.call(field.requiredWhen, "equals")) {
        return actual === field.requiredWhen.equals || (!actual && field.requiredWhen.equals === "Create logo here");
      }
      return true;
    }

    fieldHasProgress(field) {
      const value = this.state.values[field.id];
      if (field.type === "checkbox") return value === true;
      if (field.type === "checks") return Array.isArray(value) && value.length > 0;
      if (field.type === "palette") return !!value;
      if (field.type === "select") return this.selectValueIsComplete(field, value || field.options?.[0]);
      return String(value || "").trim().length > 0;
    }

    selectValueIsComplete(field, value) {
      if (!value) return false;
      const incomplete = field.incompleteValues || ["Not started", "Not selected", "Not decided", "Not offered yet", "Needs attention"];
      return !incomplete.includes(value);
    }

    val(key) {
      return this.state.values[key];
    }

    logoValue(key) {
      const defaults = {
        logoIcon: "precision-key",
        logoTemplate: "service-wordmark",
        logoTypeStyle: "outfit-manrope",
        logoVariation: "horizontal"
      };
      return this.state.values[key] || defaults[key] || "";
    }

    logoResource(collection, key) {
      const selected = this.logoValue(key);
      return collection.find(item => item.id === selected) || collection[0];
    }

    logoPalette() {
      const selected = this.cfg.palettes.find(item => item.id === this.val("palette")) || this.cfg.palettes[0] || {};
      return {
        surface: selected.colors?.[0] || "#0f172a",
        primary: selected.colors?.[1] || "#c6952d",
        accent: selected.colors?.[2] || "#f8fafc",
        textOnDark: "#ffffff",
        textOnLight: selected.colors?.[0] || "#0f172a"
      };
    }

    logoLetters() {
      return (this.val("logoLetters") || this.initialsFromName()).slice(0, 4).toUpperCase();
    }

    logoIconMarkup() {
      const icon = this.logoResource(LOGO_ICONS, "logoIcon");
      if (icon.id === "monogram") {
        return `<svg viewBox="0 0 96 96" aria-hidden="true"><rect x="18" y="18" width="60" height="60" rx="18" fill="currentColor"></rect><text x="48" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="800" fill="var(--logo-bg, #ffffff)">${this.escape(this.logoLetters())}</text></svg>`;
      }
      return icon.svg;
    }

    buildLogoSvg() {
      const palette = this.logoPalette();
      const name = this.escape(this.val("businessName") || "Your Locksmith");
      const tagline = this.escape(this.val("tagline") || "Mobile Locksmith Service");
      const initials = this.escape(this.logoLetters());
      return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="240" viewBox="0 0 720 240"><rect width="720" height="240" rx="28" fill="${palette.surface}"/><circle cx="108" cy="120" r="58" fill="${palette.primary}"/><text x="108" y="137" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="${palette.surface}">${initials}</text><text x="194" y="108" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="${palette.textOnDark}">${name}</text><text x="196" y="151" font-family="Arial, sans-serif" font-size="22" fill="${palette.accent}">${tagline}</text></svg>`;
    }

    buildLogoDataUrl() {
      if (this.val("logoSource") === "Upload existing icon/logo" && this.val("logoUploadData")) return this.val("logoUploadData");
      return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(this.buildLogoSvg());
    }

    applyLogoToWebsite() {
      const payload = {
        logo: this.buildLogoDataUrl(),
        businessName: this.val("businessName") || "Your Locksmith",
        tagline: this.val("tagline") || "Mobile Locksmith Service"
      };
      try {
        localStorage.setItem("nalaBiabLogo", JSON.stringify(payload));
      } catch (err) {
        console.warn("[mtk-biab-setup] Could not save logo", err);
      }
      if (window.wc && typeof wc.publish === "function") wc.publish("mtk-biab:logo-applied", payload);
      this.notice = "Logo draft applied to the website preview.";
      this.render();
    }

    downloadLogoSvg() {
      const blob = new Blob([this.buildLogoSvg()], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "locksmith-logo-draft.svg";
      link.click();
      URL.revokeObjectURL(link.href);
    }

    initialsFromName() {
      return String(this.val("businessName") || "YL")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3)
        .map(part => part.charAt(0))
        .join("") || "YL";
    }

    fill(text) {
      return String(text || "")
        .replace("Business Background", "Business Background")
        .replace("business name from Business Background", `business name "${this.val("businessName") || "from Business Background"}"`);
    }

    escape(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
  }

  window.MTKBIABSetup = MTKBIABSetup;
  window.__mtkBiabSetup = new MTKBIABSetup(window.MTK_BIAB_SETUP_CONFIG || {});
})();
