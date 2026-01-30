this.config.menus.forEach((menu) => {
    const li = document.createElement("li");
    li.className = "mtk-header__item";
    li.setAttribute("role", "none");

    // Set active based on config.active
    if (menu.id === this.config.active) {
        li.classList.add("active");
    }

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
       Initialize
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
       Wait for header element in DOM
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
                    reject(new Error("mtk-header not found in DOM"));
                }
            }, 50);
        });
    }

    /* ===============================
       Render header
       =============================== */
    render() {
        const logoEl = this.root.querySelector(".mtk-header__logo");
        const menuEl = this.root.querySelector(".mtk-header__menu");

        // Render logo
        logoEl.innerHTML = `
            <a href="${this.config.logo.href}">
                <img src="${this.config.logo.src}" alt="${this.config.logo.alt}">
            </a>
        `;

        // Render menu
        menuEl.innerHTML = "";

        this.config.menus.forEach((menu, index) => {
            const li = document.createElement("li");
            li.className = "mtk-header__item";
            li.setAttribute("role", "none");

            // Set first item active by default
            if (index === 0) {
                li.classList.add("active");
            }

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
       Event binding
       =============================== */
    bindEvents() {
        this.root.addEventListener("click", e => {
            const dropdownItem = e.target.closest(".mtk-header__dropdown button");
            const menuItem = e.target.closest(".mtk-header__item");

            // ----------------------------
            // Dropdown item clicked
            // ----------------------------
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

            // ----------------------------
            // Top-level menu clicked
            // ----------------------------
            if (!menuItem) return;

            const hasDropdown = !!menuItem.querySelector(".mtk-header__dropdown");

            // Close all menus first
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
       Close all menus
       =============================== */
    closeAllMenus() {
        this.root.querySelectorAll(".mtk-header__item")
            .forEach(item => {
                item.classList.remove("open", "active");
                item.querySelector(".mtk-header__link")
                    ?.setAttribute("aria-expanded", "false");
            });

        // Reset first item as active
        const firstItem = this.root.querySelector(".mtk-header__item");
        if (firstItem) {
            firstItem.classList.add("active");
        }
    }

    /* ===============================
       PubSub subscription
       =============================== */
    subscribe() {
        this.events.forEach(evt => {
            wc.subscribe(evt, this.onMessage.bind(this));
        });
    }

    /* ===============================
       Handle subscribed messages
       =============================== */
    onMessage(message, data) {
        switch (message) {
            case "mtk-header.update":
                this.render();
                break;

            case "mtk-header.destroy":
                this.closeAllMenus();
                break;

            // Other events can be handled as needed
        }
    }
}

/* ===============================
   Initialize on DOM ready
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
    new MTKHeader().init();
});
