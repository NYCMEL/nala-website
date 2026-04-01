// Define the custom element
if (!customElements.get("mtk-login")) {

    class MTKLogin extends HTMLElement {
        constructor() {
            super();
            this._initialized = false;
        }
        connectedCallback() {
            // Prevent double init if re-attached
            if (this._initialized) return;
            this._initialized = true;
            this.init();
        }
        init() {
            // Ensure config exists
            this.config = window.app?.["mtk-login"];
            if (!this.config) {
                console.error("MTK Login: missing config window.app['mtk-login']");
                return;
            }
            // Cache elements
            this.titleEl      = this.querySelector(".mtk-login-title");
            this.formEl       = this.querySelector("form");
            this.emailEl      = this.querySelector("#mtk-email");
            this.passwordEl   = this.querySelector("#mtk-password");
            this.submitBtn    = this.querySelector('button[type="submit"]');
            this.forgotLink   = this.querySelector(".forgot-password");
            this.registerLink = this.querySelector(".register");
            // Guard against bad markup
            if (!this.formEl) {
                console.error("MTK Login: required markup missing");
                return;
            }
            this.render();
            this.addEvents();
            this.subscribeEvents();

            // Re-render on language change
            document.addEventListener('i18n:changed', () => {
                this.config = window.app?.["mtk-login"];
                this.render();
            });
        }
        render() {
            // Use i18n.t() directly for guaranteed current language,
            // falling back to config values if i18n not available.
            const _t = key => (window.i18n ? window.i18n.t(key) : null);

            if (this.titleEl)
                this.titleEl.textContent    = _t('login.title')           || this.config.title;
            if (this.emailEl) {
                this.emailEl.placeholder    = _t('login.email.placeholder') || this.config.email.placeholder;
                const emailLabel = this.emailEl.previousElementSibling;
                if (emailLabel) emailLabel.textContent = _t('login.email.label') || this.config.email.label;
            }
            if (this.passwordEl) {
                this.passwordEl.placeholder = _t('login.password.placeholder') || this.config.password.placeholder;
                const pwLabel = this.passwordEl.previousElementSibling;
                if (pwLabel) pwLabel.textContent = _t('login.password.label') || this.config.password.label;
            }
            if (this.submitBtn)
                this.submitBtn.textContent    = _t('login.submit')   || this.config.submit.label;
            if (this.forgotLink)
                this.forgotLink.textContent   = _t('login.forgot')   || this.config.links.forgotPassword;
            if (this.registerLink)
                this.registerLink.textContent = _t('login.register') || this.config.links.register;
        }
        addEvents() {
            this.formEl.addEventListener("submit", e => {
                e.preventDefault();
                this.handleSubmit();
            });
            this.forgotLink.addEventListener("click", e => {
                e.preventDefault();
                if (window.wc && wc.febe && typeof wc.febe.goToPage === "function") {
                    wc.febe.goToPage("login");
                }
                wc.publish(this.config.events?.forgotPassword || "mtk-login-forgot", {
                    source: "mtk-login"
                });
            });
            this.registerLink.addEventListener("click", e => {
                e.preventDefault();
                if (window.wc && wc.pages && typeof wc.pages.show === "function") {
                    wc.pages.show("register");
                }
                wc.publish(this.config.events?.register || "mtk-login-register", {
                    source: "mtk-login"
                });
            });
        }
        subscribeEvents() {
            this.onMessage = this.onMessage.bind(this);
            wc.subscribe("mtk-login-update",  this.onMessage);
            wc.subscribe("mtk-login-disable", this.onMessage);
            wc.subscribe("mtk-login-enable",  this.onMessage);
            wc.subscribe("mtk-login-reset",   this.onMessage);
        }
        onMessage(msg, data = {}) {
            switch (msg) {
            case "mtk-login-update":
                if (data.email)    this.emailEl.value    = data.email;
                if (data.password) this.passwordEl.value = data.password;
                break;
            case "mtk-login-disable":
                this.setDisabled(true);
                break;
            case "mtk-login-enable":
                this.setDisabled(false);
                break;
            case "mtk-login-reset":
                this.formEl.reset();
                this.clearErrors();
                break;
            }
        }
        setDisabled(state) {
            this.emailEl.disabled    = state;
            this.passwordEl.disabled = state;
            this.submitBtn.disabled  = state;
        }
        handleSubmit() {
            this.clearErrors();
            let valid = true;
            const _t = key => (window.i18n ? window.i18n.t(key) : key);

            if (!this.emailEl.value.trim()) {
                this.showError(this.emailEl, _t('login.error.email.required'));
                valid = false;
            } else if (!this.validateEmail(this.emailEl.value.trim())) {
                this.showError(this.emailEl, _t('login.error.email.invalid'));
                valid = false;
            }
            if (!this.passwordEl.value.trim()) {
                this.showError(this.passwordEl, _t('login.error.password.required'));
                valid = false;
            }
            if (valid) {
                const payload = {
                    email:    this.emailEl.value.trim(),
                    password: this.passwordEl.value.trim()
                };

                if (window.wc && wc.febe && typeof wc.febe.handleLoginSubmit === "function") {
                    wc.febe.handleLoginSubmit(payload);
                    return;
                }

                wc.publish(this.config.events?.submit || "mtk-login-submit", payload);
            }
        }
        validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
        showError(el, message) {
            el.parentElement.querySelector(".error").textContent = message;
            el.focus();
        }
        clearErrors() {
            this.querySelectorAll(".error").forEach(el => (el.textContent = ""));
        }
    }

    // Register the element
    customElements.define("mtk-login", MTKLogin);
}
