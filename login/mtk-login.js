// Define the custom element
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
	this.titleEl = this.querySelector(".mtk-login-title");
	this.formEl = this.querySelector("form");
	this.emailEl = this.querySelector("#mtk-email");
	this.passwordEl = this.querySelector("#mtk-password");
	this.submitBtn = this.querySelector('button[type="submit"]');
	this.forgotLink = this.querySelector(".forgot-password");
	this.registerLink = this.querySelector(".register");

	// Guard against bad markup
	if (!this.formEl) {
	    console.error("MTK Login: required markup missing");
	    return;
	}

	this.render();
	this.addEvents();
	this.subscribeEvents();
    }

    render() {
	this.titleEl.textContent = this.config.title;
	this.emailEl.placeholder = this.config.email.placeholder;
	this.emailEl.previousElementSibling.textContent = this.config.email.label;
	this.passwordEl.placeholder = this.config.password.placeholder;
	this.passwordEl.previousElementSibling.textContent = this.config.password.label;
	this.submitBtn.textContent = this.config.submit.label;
	this.forgotLink.textContent = this.config.links.forgotPassword;
	this.registerLink.textContent = this.config.links.register;
    }

    addEvents() {
	this.formEl.addEventListener("submit", e => {
	    e.preventDefault();
	    this.handleSubmit();
	});

	this.forgotLink.addEventListener("click", e => {
	    e.preventDefault();
	    wc.publish("mtk-login-forgot-password", { source: "mtk-login" });
	});

	this.registerLink.addEventListener("click", e => {
	    e.preventDefault();
	    wc.publish("mtk-login-register", { source: "mtk-login" });
	});
    }

    subscribeEvents() {
	this.onMessage = this.onMessage.bind(this);

	wc.subscribe("mtk-login-update", this.onMessage);
	wc.subscribe("mtk-login-disable", this.onMessage);
	wc.subscribe("mtk-login-enable", this.onMessage);
	wc.subscribe("mtk-login-reset", this.onMessage);
    }

    onMessage(msg, data = {}) {
	switch (msg) {
	case "mtk-login-update":
            if (data.email) this.emailEl.value = data.email;
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
	this.emailEl.disabled = state;
	this.passwordEl.disabled = state;
	this.submitBtn.disabled = state;
    }

    handleSubmit() {
	this.clearErrors();
	let valid = true;

	if (!this.emailEl.value.trim()) {
	    this.showError(this.emailEl, "Email is required");
	    valid = false;
	} else if (!this.validateEmail(this.emailEl.value.trim())) {
	    this.showError(this.emailEl, "Invalid email format");
	    valid = false;
	}

	if (!this.passwordEl.value.trim()) {
	    this.showError(this.passwordEl, "Password is required");
	    valid = false;
	}

	if (valid) {
	    wc.publish("mtk-login-success", {
		email: this.emailEl.value.trim(),
		password: this.passwordEl.value.trim()
	    });
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
