class MTKHeader {
    constructor() {
	this.root = null;
	this.config = null;

	this.events = [
	    "mtk-header.init",
	    "mtk-header.destroy",
	    "mtk-header.update",
	    "mtk-header.action"
	];
    }

    async init() {
	await this.waitForElement();

	this.root = document.querySelector("mtk-header.mtk-header");
	this.config = window.app?.header;

	if (!this.root || !this.config) return;

	this.render();
	this.bindEvents();
	this.subscribe();

	wc.publish("mtk-header.init", {});
    }

    waitForElement(timeout = 3000) {
	return new Promise((resolve, reject) => {
	    const start = Date.now();
	    const timer = setInterval(() => {
		if (document.querySelector("mtk-header.mtk-header")) {
		    clearInterval(timer);
		    resolve();
		}
		if (Date.now() - start > timeout) {
		    clearInterval(timer);
		    reject();
		}
	    }, 50);
	});
    }

    render() {
	const logoEl = this.root.querySelector(".mtk-header__logo");
	const menuEl = this.root.querySelector(".mtk-header__menu");

	logoEl.innerHTML = `
      <a href="${this.config.logo.href}">
        <img src="${this.config.logo.src}" alt="${this.config.logo.alt}">
      </a>
    `;

	menuEl.innerHTML = "";

	this.config.menus.forEach(menu => {
	    const li = document.createElement("li");
	    li.className = "mtk-header__item";
	    li.setAttribute("role", "none");

	    if (menu.type === "dropdown") {
		li.innerHTML = `
          <button class="mtk-header__link" aria-haspopup="true">
            ${menu.label}
          </button>
          <div class="mtk-header__dropdown" role="menu">
            ${menu.items.map(i =>
              `<button data-id="${i.id}" role="menuitem">${i.label}</button>`
            ).join("")}
          </div>
        `;
	    } else {
		li.innerHTML = `
          <a class="mtk-header__link" href="${menu.href}" role="menuitem">
            ${menu.label}
          </a>
        `;
	    }

	    menuEl.appendChild(li);
	});
    }

    bindEvents() {
	this.root.addEventListener("click", e => {
	    const item = e.target.closest(".mtk-header__item");
	    if (!item) return;

	    this.root.querySelectorAll(".mtk-header__item")
		.forEach(i => i.classList.remove("active", "open"));

	    item.classList.add("active");

	    if (item.querySelector(".mtk-header__dropdown")) {
		item.classList.toggle("open");
	    }

	    wc.publish("mtk-header.action", {
		label: e.target.textContent.trim()
	    });
	});
    }

    subscribe() {
	this.events.forEach(evt => {
	    wc.subscribe(evt, this.onMessage.bind(this));
	});
    }

    onMessage(message, data) {
	if (message === "mtk-header.update") {
	    this.render();
	}
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MTKHeader().init();
});
