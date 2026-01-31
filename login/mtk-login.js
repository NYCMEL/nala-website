class MtkLogin {
  constructor() {
    this.config = window.mtkLoginConfig;
    this.root = document.querySelector("mtk-login");

    if (!this.root) return;

    this.form = this.root.querySelector("form");
    this.email = this.form.querySelector('input[name="email"]');
    this.password = this.form.querySelector('input[name="password"]');
    this.submitBtn = this.form.querySelector('button[type="submit"]');

    this.bindEvents();
    this.subscribe();

    // 🔑 Run validation on load AND after a short delay for autofill
    this.validate();
    setTimeout(() => this.validate(), 500); // catches autofill

    wc.publish(this.config.events.ready);
  }

  validate() {
    const emailFilled = this.email.value.trim().length > 0;
    const passwordFilled = this.password.value.trim().length > 0;

    this.submitBtn.disabled = !(emailFilled && passwordFilled);
  }

  bindEvents() {
    // Use input + change + keyup + paste
    const events = ["input", "change", "keyup", "paste"];
    events.forEach(evt => {
      this.email.addEventListener(evt, () => this.validate());
      this.password.addEventListener(evt, () => this.validate());
    });

    // Submit
    this.form.addEventListener("submit", e => {
      e.preventDefault();
      this.validate();
      if (this.submitBtn.disabled) return;

      wc.publish(this.config.events.submit, {
        email: this.email.value,
        password: this.password.value
      });
    });

    // Links
    this.root.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        wc.publish(this.config.events[link.dataset.action]);
      });
    });
  }

  subscribe() {
    Object.values(this.config.events).forEach(evt =>
      wc.subscribe(evt, this.onMessage.bind(this))
    );
  }

  onMessage(topic, data) {
    wc.log("mtk-login received:", topic, data);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MtkLogin();
});
