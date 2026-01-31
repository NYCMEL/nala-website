class MtkLogin {
constructor() {
this.root = document.querySelector(".mtk-login");
if (!this.root) return;

this.config = window.mtkLoginConfig;
this.form = this.root.querySelector("form");

this.onMessage = this.onMessage.bind(this);

wc.subscribe(this.config.events.submit, this.onMessage);
wc.subscribe(this.config.events.forgot, this.onMessage);
wc.subscribe(this.config.events.register, this.onMessage);
wc.subscribe(this.config.events.ready, this.onMessage);

this.init();
}

init() {
const { labels } = this.config;

this.root.querySelector("h1").textContent = labels.title;
this.root.querySelector("input[name=email]").nextElementSibling.textContent = labels.email;
this.root.querySelector("input[name=password]").nextElementSibling.textContent = labels.password;

this.root.querySelector(".submit").textContent = labels.submit;
this.root.querySelector(".forgot").textContent = labels.forgot;
this.root.querySelector(".register").textContent = labels.register;

this.bindEvents();

wc.publish(this.config.events.ready);
}

bindEvents() {
this.form.addEventListener("submit", e => {
e.preventDefault();
if (this.validate()) {
wc.publish(this.config.events.submit, this.getData());
}
});

this.root.querySelector(".forgot").addEventListener("click", () => {
wc.publish(this.config.events.forgot);
});

this.root.querySelector(".register").addEventListener("click", () => {
wc.publish(this.config.events.register);
});
}

validate() {
const email = this.form.email;
const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
email.parentElement.querySelector(".error").textContent = valid ? "" : "Invalid email";
return valid && this.form.password.value.length > 0;
}

getData() {
return {
email: this.form.email.value,
password: this.form.password.value
};
}

onMessage(msg) {
wc.log("mtk-login event", msg);
}
}

function waitForLogin() {
if (document.querySelector(".mtk-login")) {
new MtkLogin();
} else {
setTimeout(waitForLogin, 50);
}
}

waitForLogin();
