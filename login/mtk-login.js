class MTKLogin {
  constructor() {
    this.init();
  }

  async init() {
    // Wait for the element in DOM
    await this.waitForElement('mtk-login');
    this.root = document.querySelector('mtk-login');
    this.config = window.app['mtk-login'];

    this.titleEl = this.root.querySelector('.mtk-login-title');
    this.formEl = this.root.querySelector('form');
    this.emailEl = this.root.querySelector('#mtk-email');
    this.passwordEl = this.root.querySelector('#mtk-password');
    this.submitBtn = this.formEl.querySelector('button[type="submit"]');
    this.forgotLink = this.root.querySelector('.forgot-password');
    this.registerLink = this.root.querySelector('.register');

    this.render();
    this.addEvents();
    this.subscribeEvents();
  }

  waitForElement(selector) {
    return new Promise(resolve => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          resolve(el);
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
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
    this.formEl.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmit();
    });

    this.forgotLink.addEventListener('click', e => {
      e.preventDefault();
      wc.publish(this.config.events.forgotPassword, { source: 'mtk-login' });
    });

    this.registerLink.addEventListener('click', e => {
      e.preventDefault();
      wc.publish(this.config.events.register, { source: 'mtk-login' });
    });

    [this.emailEl, this.passwordEl].forEach(input => {
      input.addEventListener('focus', () => {
        wc.publish(this.config.events.focusChange, { field: input.name });
      });
    });
  }

  subscribeEvents() {
    this.onMessage = this.onMessage.bind(this);
    wc.subscribe('mtk-login-update', this.onMessage);
    wc.subscribe('mtk-login-disable', this.onMessage);
    wc.subscribe('mtk-login-enable', this.onMessage);
    wc.subscribe('mtk-login-reset', this.onMessage);
  }

  onMessage(msg, data) {
    switch (msg) {
      case 'mtk-login-update':
        if (data.email) this.emailEl.value = data.email;
        if (data.password) this.passwordEl.value = data.password;
        break;
      case 'mtk-login-disable':
        this.emailEl.disabled = true;
        this.passwordEl.disabled = true;
        this.submitBtn.disabled = true;
        break;
      case 'mtk-login-enable':
        this.emailEl.disabled = false;
        this.passwordEl.disabled = false;
        this.submitBtn.disabled = false;
        break;
      case 'mtk-login-reset':
        this.formEl.reset();
        this.clearErrors();
        break;
    }
  }

  handleSubmit() {
    this.clearErrors();
    let valid = true;

    // Email validation
    if (!this.emailEl.value.trim()) {
      this.showError(this.emailEl, "Email is required");
      valid = false;
    } else if (!this.validateEmail(this.emailEl.value.trim())) {
      this.showError(this.emailEl, "Invalid email format");
      valid = false;
    }

    // Password validation
    if (!this.passwordEl.value.trim()) {
      this.showError(this.passwordEl, "Password is required");
      valid = false;
    }

    if (valid) {
      wc.publish(this.config.events.submit, {
        email: this.emailEl.value.trim(),
        password: this.passwordEl.value.trim()
      });
    }
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  showError(el, message) {
    const errorEl = el.parentElement.querySelector('.error');
    errorEl.textContent = message;
    el.focus();
  }

  clearErrors() {
    this.root.querySelectorAll('.error').forEach(el => (el.textContent = ''));
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => new MTKLogin());
