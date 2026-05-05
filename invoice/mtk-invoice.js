class MtkInvoice {
  constructor(root, config) {
    this.root = root;
    this.config = config || {};
    this.labels = this.config.labels || {};
    this.events = this.config.events || { publish: {}, subscribe: [] };
    this.values = {};
    this.isPublishing = false;
    this.onMessage = this.onMessage.bind(this);
    this._init();
  }

  _init() {
    this._hydrateValues();
    this._subscribe();
    this._render();
    this._bind();
    this._updateTotals();
    this._publish(this.events.publish.ready || "mtk-invoice:ready", {
      component: this.config.component || "mtk-invoice",
      version: this.config.version || "1.0.2"
    });
  }

  _hydrateValues() {
    const groups = this.config.fields || {};

    Object.keys(groups).forEach((groupName) => {
      const fields = Array.isArray(groups[groupName]) ? groups[groupName] : [];

      fields.forEach((field) => {
        this.values[field.id] = field.value || "";
      });
    });
  }

  _subscribe() {
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
      this._print();
    }

    if (topic === "4-mtk-invoice:reset") {
      this._hydrateValues();
      this._render();
      this._bind();
      this._updateTotals();
    }

    if (topic === "4-mtk-invoice:set-data" && data && typeof data === "object") {
      Object.assign(this.values, data);
      this._render();
      this._bind();
      this._updateTotals();
    }
  }

  _publish(topic, data) {
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

  _render() {
    this.root.innerHTML = `
      <section class="mtk-invoice__shell" aria-labelledby="mtk-invoice-title">
        <div class="mtk-invoice__card">
          <header class="mtk-invoice__header">
            <h1 class="mtk-invoice__title" id="mtk-invoice-title">${this._escape(this.labels.title || "Locksmith Invoice")}</h1>
            <p class="mtk-invoice__subtitle">${this._escape(this.labels.subtitle || "")}</p>
          </header>

          <div class="mtk-invoice__divider" aria-hidden="true"></div>

          <form class="mtk-invoice__form" novalidate>
            <section class="mtk-invoice__section" aria-label="Business and invoice information">
              <div class="mtk-invoice__grid">
                ${this._renderFields("business")}
              </div>
            </section>

            <section class="mtk-invoice__section" aria-labelledby="mtk-invoice-customer-heading">
              <h2 class="mtk-invoice__section-title" id="mtk-invoice-customer-heading">${this._escape(this.labels.customerHeading || "Customer")}</h2>
              <div class="mtk-invoice__grid">
                ${this._renderFields("customer")}
              </div>
            </section>

            <section class="mtk-invoice__section" aria-labelledby="mtk-invoice-service-heading">
              <h2 class="mtk-invoice__section-title" id="mtk-invoice-service-heading">${this._escape(this.labels.serviceHeading || "Service Details")}</h2>
              <div class="mtk-invoice__grid mtk-invoice__grid--three">
                ${this._renderFields("service")}
              </div>
            </section>

            <section class="mtk-invoice__section" aria-labelledby="mtk-invoice-totals-heading">
              <h2 class="mtk-invoice__section-title" id="mtk-invoice-totals-heading">${this._escape(this.labels.totalsHeading || "Totals")}</h2>
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
                <span>${this._escape(this.labels.printButton || "Print")}</span>
              </button>

              <button class="mtk-invoice__save-btn" type="button" data-action="save">
                <span class="material-icons" aria-hidden="true">save</span>
                <span>${this._escape(this.labels.saveButton || "Save Invoice")}</span>
              </button>
            </div>

            <p class="mtk-invoice__status" data-status aria-live="polite"></p>
          </form>
        </div>
      </section>
    `;
  }

  _renderFields(groupName) {
    const fields = this.config.fields && Array.isArray(this.config.fields[groupName])
      ? this.config.fields[groupName]
      : [];

    return fields.map((field) => this._renderField(field)).join("");
  }

  _renderField(field) {
    const fieldClass = field.full ? "mtk-invoice__field mtk-invoice__field--full" : "mtk-invoice__field";
    const value = this.values[field.id] || "";
    const required = field.required ? " required" : "";

    if (field.type === "select") {
      const isEmpty = !value;

      return `
        <div class="${fieldClass}">
          <label for="mtk-invoice-${this._escape(field.id)}">${this._escape(field.label)}</label>
          <select
            id="mtk-invoice-${this._escape(field.id)}"
            class="${isEmpty ? "mtk-invoice__select-placeholder" : ""}"
            name="${this._escape(field.id)}"
            data-field="${this._escape(field.id)}"
            ${required}
          >
            <option value="" disabled${isEmpty ? " selected" : ""}>${this._escape(field.helper || "Select")}</option>
            ${(field.options || []).map((option) => `
              <option value="${this._escape(option)}"${value === option ? " selected" : ""}>${this._escape(option)}</option>
            `).join("")}
          </select>
        </div>
      `;
    }

    if (field.type === "textarea") {
      return `
        <div class="${fieldClass}">
          <label for="mtk-invoice-${this._escape(field.id)}">${this._escape(field.label)}</label>
          <textarea
            id="mtk-invoice-${this._escape(field.id)}"
            name="${this._escape(field.id)}"
            data-field="${this._escape(field.id)}"
            placeholder="${this._escape(field.helper || "")}"
            ${required}
          >${this._escape(value)}</textarea>
        </div>
      `;
    }

    return `
      <div class="${fieldClass}">
        <label for="mtk-invoice-${this._escape(field.id)}">${this._escape(field.label)}</label>
        <input
          id="mtk-invoice-${this._escape(field.id)}"
          name="${this._escape(field.id)}"
          data-field="${this._escape(field.id)}"
          type="${this._escape(field.type || "text")}"
          value="${this._escape(value)}"
          placeholder="${this._escape(field.helper || "")}"
          ${required}
        >
      </div>
    `;
  }

  _bind() {
    this.root.addEventListener("input", (event) => {
      const field = event.target.closest("[data-field]");
      if (!field || !this.root.contains(field)) return;

      this.values[field.getAttribute("data-field")] = field.value;
      this._updateTotals();

      this._publish(this.events.publish.change || "mtk-invoice:change", {
        values: this._getValues(),
        totals: this._calculateTotals()
      });
    });

    this.root.addEventListener("change", (event) => {
      const field = event.target.closest("[data-field]");
      if (!field || !this.root.contains(field)) return;

      this.values[field.getAttribute("data-field")] = field.value;

      if (field.tagName.toLowerCase() === "select") {
        field.classList.toggle("mtk-invoice__select-placeholder", !field.value);
      }

      this._updateTotals();
    });

    this.root.addEventListener("click", (event) => {
      const actionTarget = event.target.closest("[data-action]");
      if (!actionTarget || !this.root.contains(actionTarget)) return;

      const action = actionTarget.getAttribute("data-action");

      if (action === "print") {
        this._print();
      }

      if (action === "save") {
        this._save();
      }
    });
  }

  _print() {
    this._publish(this.events.publish.print || "mtk-invoice:print", {
      values: this._getValues(),
      totals: this._calculateTotals()
    });

    window.print();
  }

  _save() {
    const status = this.root.querySelector("[data-status]");

    if (status) {
      status.textContent = "Invoice saved.";
    }

    this._publish(this.events.publish.save || "mtk-invoice:save", {
      values: this._getValues(),
      totals: this._calculateTotals()
    });
  }

  _updateTotals() {
    const totals = this._calculateTotals();

    Object.keys(totals).forEach((key) => {
      const target = this.root.querySelector(`[data-total="${key}"]`);
      if (target) {
        target.textContent = this._formatCurrency(totals[key]);
      }
    });
  }

  _calculateTotals() {
    const serviceFee = this._number(this.values.serviceFee);
    const partsMaterials = this._number(this.values.partsMaterials);
    const emergencyFee = this._number(this.values.emergencyFee);
    const discount = this._number(this.values.discount);
    const taxRate = this._number(this.values.taxRate);

    const subtotal = Math.max(0, serviceFee + partsMaterials + emergencyFee - discount);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }

  _getValues() {
    return Object.assign({}, this.values);
  }

  _number(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  _formatCurrency(value) {
    return "$" + (Number(value) || 0).toLocaleString("en-US", {
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
