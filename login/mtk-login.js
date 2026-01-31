class MtkLogin {
  constructor() {
    this.root = document.querySelector(".mtk-login");
    if (!this.root) return;

    this.config = window.mtkLoginConfig;
    this.form = this.root.querySelector("form");
    this.submitBtn = this.root.querySelector(".submit");

    this.onMessage = this.onMessage.bind(this);

    wc.subscribe(this.config.events.ready, this.onMessage);
    wc.subscribe(this.config.events.submit, this.onMessage);
    wc.subscribe(this.config.events.forgot, this.onMessage);
    wc.subscribe(this.config.events.register, this.onMessage);

    this.init();
  }

  init() {
    const { labels } = this.config;

    this.root.querySelector("h1").textContent = labels.title;
    this.submitBtn.textContent = labels.submit;
    this.root.querySelector(".forgot").textContent = labels.forgot;
    this.root.querySelector(".register").textContent = labels.register;

    this.bindEvents();

    wc.publish(this.config.events.ready);
  }

  bindEvents() {
    const email = this.form.email;
    const password = this.form.password;

    const updateSubmitState = () => {
      this.submitBtn.disabled = !(email.value && password.value);
    };

    email.addEventListener("input", updateSubmitState);
    password.addEventListener("input", updateSubmitState);

    this.form.addEventListener("submit", e => {
      e.preventDefault();
      e.stopPropagation();

      if (this.validate()) {
        wc.publish(this.config.events.submit, this.getData());
      }
    });

    this.root.querySelector(".forgot").addEventListener("click", e => {
      e.preventDefault();
      wc.publish(this.config.events.forgot);
    });

    this.root.querySelector(".register").addEventListener("click", e => {
      e.preventDefault();
      wc.publish(this.config.events.register);
    });
  }

  validate() {
    let valid = true;

    const email = this.form.email;
    const password = this.form.password;

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

    email.parentElement.querySelector(".error").textContent =
      emailValid ? "" : "Enter a valid email address";

    if (!password.value) {
      password.parentElement.querySelector(".error").textContent =
        "Password is required";
      valid = false;
    } else {
      password.parentElement.querySelector(".error").textContent = "";
    }

    if (!emailValid) valid = false;

    return valid;
  }

  getData() {
    return {
      email: this.form.email.value,
      password: this.form.password.value
    };
  }

  onMessage(message) {
    wc.log("mtk-login received", message);
  }
}

(function waitForLogin() {
  if (document.querySelector(".mtk-login")) {
    new MtkLogin();
  } else {
    setTimeout(waitForLogin, 50);
  }
})();
