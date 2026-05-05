class MtkInvoice {
  constructor(root, config) {
    this.root = root;
    this.config = config || {};
    this.labels = this.config.labels || {};
    this.events = this.config.events || { publish: {}, subscribe: [] };
    this.values = {};
    this.isPublishing = false;
    this.onMessage = this.onMessage.bind(this);
    this.init();
  }

  init() {
    this.hydrateValues();
    this.subscribe();
    this.render();
    this.bind();
    this.updateTotals();
    this.publish(this.events.publish.ready || "mtk-invoice:ready", {
      component: this.config.component || "mtk-invoice",
      version: this.config.version || "1.0.3"
    });
  }

  hydrateValues() {
    const groups = this.config.fields || {};

    Object.keys(groups).forEach((groupName) => {
      const fields = Array.isArray(groups[groupName]) ? groups[groupName] : [];

      fields.forEach((field) => {
        this.values[field.id] = field.value || "";
      });
    });
  }

  subscribe() {
    const topics = Array.isArray(this.events.subscribe) ? this.events.subscribe : [];

    topics.forEach((topic) => {
      if (window.wc && typeof window.wc.subscribe === "function") {
        window.wc.subscribe(topic, this.onMessage);
      }
    });
  }

  onMessage(topic, data) {
    if (this.isPublishing) return;

    if (topic === "4-mtk-invoice:print") {
      this.print();
    }

    if (topic === "4-mtk-invoice:reset") {
      this.hydrateValues();
      this.render();
      this.bind();
      this.updateTotals();
    }

    if (topic === "4-mtk-invoice:set-data" && data && typeof data === "object") {
      Object.assign(this.values, data);
      this.render();
      this.bind();
      this.updateTotals();
    }
  }

  publish(topic, data) {
    this.isPublishing = true;

    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log(topic, data);
    } else {
      console.log(topic, data);
    }

    if (window.wc && typeof window.wc.publish === "function") {
      window.wc.publish(topic, data);
    }

    this.isPublishing = false;
  }

  render() {
    this.root.innerHTML = `
      <section class="mtk-invoice__shell" aria-labelledby="mtk-invoice-title">
        <div class="mtk-invoice__card">
          <header class="mtk-invoice__header">
            <h1 class="mtk-invoice__title" id="mtk-invoice-title">${this.escape(this.labels.title || "Locksmith Invoice")}</h1>
            <p class="mtk-invoice__subtitle">${this.escape(this.labels.subtitle || "")}</p>
          </header>

          <div class="mtk-invoice__divider" aria-hidden="true"></div>

          <form class="mtk-invoice__form" novalidate>
            <section class="mtk-invoice__section" aria-label="Business and invoice information">
              <div class="mtk-invoice__grid">
                ${this.renderFields("business")}
              </div>
            </section>

            <section class="mtk-invoice__section" aria-labelledby="mtk-invoice-customer-heading">
              <h2 class="mtk-invoice__section-title" id="mtk-invoice-customer-heading">${this.escape(this.labels.customerHeading || "Customer")}</h2>
              <div class="mtk-invoice__grid">
                ${this.renderFields("customer")}
              </div>
            </section>

            <section class="mtk-invoice__section" aria-labelledby="mtk-invoice-service-heading">
              <h2 class="mtk-invoice__section-title" id="mtk-invoice-service-heading">${this.escape(this.labels.serviceHeading || "Service Details")}</h2>
              <div class="mtk-invoice__grid mtk-invoice__grid--three">
                ${this.renderFields("service")}
              </div>
            </section>

            <section class="mtk-invoice__section" aria-labelledby="mtk-invoice-totals-heading">
              <h2 class="mtk-invoice__section-title" id="mtk-invoice-totals-heading">${this.escape(this.labels.totalsHeading || "Totals")}</h2>
              <div class="mtk-invoice__totals" aria-live="polite">
                <div class="mtk-invoice__total-row">
                  <span>Subtotal</span>
                  <strong data-total="subtotal">$0.00</strong>
                </div>
                <div class="mtk-invoice__total-row">
                  <span>Tax</span>
                  <strong data-total="tax">$0.00</strong>
                </div>
                <div class="mtk-invoice__total-row mtk-invoice__total-row--grand">
                  <span>Total</span>
                  <strong data-total="total">$0.00</strong>
                </div>
              </div>
            </section>

            <div class="mtk-invoice__actions">
              <button class="mtk-invoice__print-btn" type="button" data-action="print">
                <span class="material-icons" aria-hidden="true">print</span>
                <span>${this.escape(this.labels.printButton || "Print")}</span>
              </button>

              <button class="mtk-invoice__save-btn" type="button" data-action="save">
                <span class="material-icons" aria-hidden="true">save</span>
                <span>${this.escape(this.labels.saveButton || "Save Invoice")}</span>
              </button>
            </div>

            <p class="mtk-invoice__status" data-status aria-live="polite"></p>
          </form>
        </div>
      </section>
    `;
  }

  renderFields(groupName) {
    const fields = this.config.fields && Array.isArray(this.config.fields[groupName])
      ? this.config.fields[groupName]
      : [];

    return fields.map((field) => this.renderField(field)).join("");
  }

  renderField(field) {
    const fieldClass = field.full ? "mtk-invoice__field mtk-invoice__field--full" : "mtk-invoice__field";
    const value = this.values[field.id] || "";
    const required = field.required ? " required" : "";
    const label = this.escape(field.label || "");
    const fieldId = this.escape(field.id);
    const placeholder = this.escape(field.placeholder || "");

    if (field.type === "select") {
      const isEmpty = !value;

      return `
        <div class="${fieldClass}">
          <label for="mtk-invoice-${fieldId}">${label}</label>
          <select
            id="mtk-invoice-${fieldId}"
            class="${isEmpty ? "is-placeholder" : ""}"
            name="${fieldId}"
            data-field="${fieldId}"
            ${required}
          >
            <option value="" disabled${isEmpty ? " selected" : ""}>${placeholder || "Select"}</option>
            ${(field.options || []).map((option) => `
              <option value="${this.escape(option)}"${value === option ? " selected" : ""}>${this.escape(option)}</option>
            `).join("")}
          </select>
        </div>
      `;
    }

    if (field.type === "textarea") {
      return `
        <div class="${fieldClass}">
          <label for="mtk-invoice-${fieldId}">${label}</label>
          <textarea
            id="mtk-invoice-${fieldId}"
            name="${fieldId}"
            data-field="${fieldId}"
            placeholder="${placeholder}"
            ${required}
          >${this.escape(value)}</textarea>
        </div>
      `;
    }

    return `
      <div class="${fieldClass}">
        <label for="mtk-invoice-${fieldId}">${label}</label>
        <input
          id="mtk-invoice-${fieldId}"
          name="${fieldId}"
          data-field="${fieldId}"
          type="${this.escape(field.type || "text")}"
          value="${this.escape(value)}"
          placeholder="${placeholder}"
          ${required}
        >
      </div>
    `;
  }

  bind() {
    this.root.addEventListener("input", (event) => {
      const field = event.target.closest("[data-field]");
      if (!field || !this.root.contains(field)) return;

      this.values[field.getAttribute("data-field")] = field.value;
      this.updateTotals();

      this.publish(this.events.publish.change || "mtk-invoice:change", {
        values: this.getValues(),
        totals: this.calculateTotals()
      });
    });

    this.root.addEventListener("change", (event) => {
      const field = event.target.closest("[data-field]");
      if (!field || !this.root.contains(field)) return;

      this.values[field.getAttribute("data-field")] = field.value;

      if (field.tagName.toLowerCase() === "select") {
        field.classList.toggle("is-placeholder", !field.value);
      }

      this.updateTotals();
    });

    this.root.addEventListener("click", (event) => {
      const actionTarget = event.target.closest("[data-action]");
      if (!actionTarget || !this.root.contains(actionTarget)) return;

      const action = actionTarget.getAttribute("data-action");

      if (action === "print") {
        this.print();
      }

      if (action === "save") {
        this.save();
      }
    });
  }

  print() {
    this.publish(this.events.publish.print || "mtk-invoice:print", {
      values: this.getValues(),
      totals: this.calculateTotals()
    });

    window.print();
  }

  save() {
    const status = this.root.querySelector("[data-status]");

    if (status) {
      status.textContent = "Invoice saved.";
    }

    this.publish(this.events.publish.save || "mtk-invoice:save", {
      values: this.getValues(),
      totals: this.calculateTotals()
    });
  }

  updateTotals() {
    const totals = this.calculateTotals();

    Object.keys(totals).forEach((key) => {
      const target = this.root.querySelector(`[data-total="${key}"]`);
      if (target) {
        target.textContent = this.formatCurrency(totals[key]);
      }
    });
  }

  calculateTotals() {
    const serviceFee = this.number(this.values.serviceFee);
    const partsMaterials = this.number(this.values.partsMaterials);
    const emergencyFee = this.number(this.values.emergencyFee);
    const discount = this.number(this.values.discount);
    const taxRate = this.number(this.values.taxRate);

    const subtotal = Math.max(0, serviceFee + partsMaterials + emergencyFee - discount);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }

  getValues() {
    return Object.assign({}, this.values);
  }

  number(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  formatCurrency(value) {
    return "$" + (Number(value) || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  escape(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  static initWhenReady() {
    const start = () => {
      const root = document.querySelector("mtk-invoice.mtk-invoice");

      if (!root || root.dataset.mtkInvoiceReady === "true") {
        return false;
      }

      root.dataset.mtkInvoiceReady = "true";
      new MtkInvoice(root, window.MTK_INVOICE_CONFIG || {});
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

MtkInvoice.initWhenReady();
