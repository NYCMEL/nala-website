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

    /* ===============================
       Init
       =============================== */
    async init() {
        try {
            await this.waitForElement();
        } catch {
            return;
        }

        this.root = document.querySelector("mtk-header.mtk-header");
        this.config = window.app?.header;

        if (!this.root || !this.config) return;

        this.render();
        this.bindEvents();
        this.subscribe();

        wc.publish("mtk-header.init", {});
    }

    /* ===============================
       Wait for DOM
       =============================== */
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

    /* ===============================
       Render
       =============================== */
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
                    <button class="mtk-header__link"
                            aria-haspopup="true"
                            aria-expanded="false">
                        ${menu.label}
                    </button>
                    <div class="mtk-header__dropdown" role="menu">
                        ${menu.items.map(item => `
                            <button role="menuitem"
                                    data-id="${item.id}">
                                ${item.label}
                            </button>
                        `).join("")}
                    </div>
                `;
            } else {
                li.innerHTML = `
                    <a class="mtk-header__link"
                       href="${menu.href}"
                       role="menuitem">
                        ${menu.label}
                    </a>
                `;
            }

            menuEl.appendChild(li);
        });
    }

    /* ===============================
       Events
       =============================== */
    bindEvents() {
        this.root.addEventListener("click", e => {

            const dropdownItem = e.target.closest(".mtk-header__dropdown button");
            const menuItem = e.target.closest(".mtk-header__item");

            /* -------------------------------
               Dropdown item click
               ------------------------------- */
            if (dropdownItem) {
                e.preventDefault();
                e.stopPropagation();

                const id = dropdownItem.dataset.id || null;
                const label = dropdownItem.textContent.trim();

                this.closeAllMenus();

                wc.publish("mtk-header.action", {
                    type: "dropdown",
                    id,
                    label
                });

                return;
            }

            /* -------------------------------
               Top-level menu click
               ------------------------------- */
            if (!menuItem) return;

            const hasDropdown = !!menuItem.querySelector(".mtk-header__dropdown");

            this.closeAllMenus();
            menuItem.classList.add("active");

            if (hasDropdown) {
                e.preventDefault();
                menuItem.classList.add("open");
                menuItem.querySelector(".mtk-header__link")
                    ?.setAttribute("aria-expanded", "true");
            }

            wc.publish("mtk-header.action", {
                type: hasDropdown ? "menu-dropdown" : "menu-link",
                label: e.target.textContent.trim()
            });
        });
    }

    /* ===============================
       Helpers
       =============================== */
    closeAllMenus() {
        this.root.querySelectorAll(".mtk-header__item")
            .forEach(item => {
                item.classList.remove("open", "active");
                item.querySelector(".mtk-header__link")
                    ?.setAttribute("aria-expanded", "false");
            });
    }

    /* ===============================
       PubSub
       =============================== */
    subscribe() {
        this.events.forEach(evt => {
            wc.subscribe(evt, this.onMessage.bind(this));
        });
    }

    onMessage(message, data) {
        switch (message) {
            case "mtk-header.update":
                this.render();
                break;

            case "mtk-header.destroy":
                this.closeAllMenus();
                break;
        }
    }
}

/* ===============================
   Bootstrap
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
    new MTKHeader().init();
});
