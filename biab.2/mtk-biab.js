class MtkBiab {
    constructor(element, config) {
        this.element = element;
        this.config = config || window.mtkBiabConfig || {};
        this.activeSectionId = this.config.defaultSection || "introduction";
        this.selectors = {
            eyebrow: "[data-biab-eyebrow]",
            title: "[data-biab-title]",
            subtitle: "[data-biab-subtitle]",
            menuButton: "[data-biab-menu-button]",
            menuLabel: "[data-biab-menu-label]",
            side: "[data-biab-side]",
            nav: "[data-biab-nav]",
            main: "[data-biab-main]",
            sectionIcon: "[data-biab-section-icon]",
            activeLabel: "[data-biab-active-label]",
            sectionTitle: "[data-biab-section-title]",
            sectionSummary: "[data-biab-section-summary]",
            sectionBody: "[data-biab-section-body]",
            bullets: "[data-biab-bullets]",
            stats: "[data-biab-stats]",
            getStartedLabel: "[data-biab-get-started-label]",
            learnMoreLabel: "[data-biab-learn-more-label]",
            actions: "[data-biab-action]"
        };

        this.onMessage = this.onMessage.bind(this);
        this.handleNavClick = this.handleNavClick.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleActionClick = this.handleActionClick.bind(this);

        this.init();
    }

    init() {
        this.cacheElements();
        this.renderStaticContent();
        this.renderNav();
        this.renderSection(this.activeSectionId, false);
        this.bindEvents();
        this.subscribe();
        this.publish("4-mtk-biab:ready", {
            component: this.config.component,
            activeSectionId: this.activeSectionId
        });
    }

    cacheElements() {
        Object.keys(this.selectors).forEach((key) => {
            if (key === "actions") {
                this[key] = Array.from(this.element.querySelectorAll(this.selectors[key]));
            } else {
                this[key] = this.element.querySelector(this.selectors[key]);
            }
        });
    }

    renderStaticContent() {
        this.setText(this.eyebrow, this.config.eyebrow);
        this.setText(this.title, this.config.title);
        this.setText(this.subtitle, this.config.subtitle);
        this.setText(this.menuLabel, this.getLabel("mobileMenu"));
        this.setText(this.activeLabel, this.getLabel("activeSection"));
        this.setText(this.getStartedLabel, this.config.actions?.getStarted?.label || this.getLabel("getStarted"));
        this.setText(this.learnMoreLabel, this.config.actions?.learnMore?.label || this.getLabel("learnMore"));
    }

    renderNav() {
        if (!this.nav) {
            return;
        }

        this.nav.innerHTML = "";

        this.getSections().forEach((section) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "mtk-biab__nav-button";
            button.dataset.sectionId = section.id;
            button.setAttribute("aria-current", section.id === this.activeSectionId ? "page" : "false");

            const icon = document.createElement("span");
            icon.className = "mtk-biab__material-icon";
            icon.setAttribute("aria-hidden", "true");
            icon.textContent = section.icon || "widgets";

            const label = document.createElement("span");
            label.textContent = section.label || section.title || section.id;

            button.append(icon, label);
            this.nav.appendChild(button);
        });
    }

    renderSection(sectionId, shouldFocus = true) {
        const section = this.getSectionById(sectionId) || this.getSections()[0];

        if (!section) {
            return;
        }

        this.activeSectionId = section.id;
        this.setText(this.sectionIcon, section.icon || "widgets");
        this.setText(this.sectionTitle, section.title);
        this.setText(this.sectionSummary, section.summary);
        this.setText(this.sectionBody, section.body);
        this.renderBullets(section.bullets || []);
        this.renderStats(section.stats || []);
        this.updateNavState();
        this.closeMobileMenu();

        if (shouldFocus && this.main) {
            this.main.focus({ preventScroll: true });
        }
    }

    renderBullets(bullets) {
        if (!this.bullets) {
            return;
        }

        this.bullets.innerHTML = "";

        bullets.forEach((item) => {
            const li = document.createElement("li");
            li.className = "mtk-biab__bullet";

            const icon = document.createElement("span");
            icon.className = "mtk-biab__material-icon";
            icon.setAttribute("aria-hidden", "true");
            icon.textContent = "check_circle";

            const text = document.createElement("span");
            text.textContent = item;

            li.append(icon, text);
            this.bullets.appendChild(li);
        });
    }

    renderStats(stats) {
        if (!this.stats) {
            return;
        }

        this.stats.innerHTML = "";

        stats.forEach((stat) => {
            const card = document.createElement("div");
            card.className = "mtk-biab__stat";

            const value = document.createElement("span");
            value.className = "mtk-biab__stat-value";
            value.textContent = stat.value;

            const label = document.createElement("span");
            label.className = "mtk-biab__stat-label";
            label.textContent = stat.label;

            card.append(value, label);
            this.stats.appendChild(card);
        });
    }

    updateNavState() {
        if (!this.nav) {
            return;
        }

        const buttons = Array.from(this.nav.querySelectorAll(".mtk-biab__nav-button"));

        buttons.forEach((button) => {
            const isActive = button.dataset.sectionId === this.activeSectionId;
            button.setAttribute("aria-current", isActive ? "page" : "false");
        });
    }

    bindEvents() {
        if (this.nav) {
            this.nav.addEventListener("click", this.handleNavClick);
        }

        if (this.menuButton) {
            this.menuButton.addEventListener("click", this.handleMenuClick);
        }

        this.actions.forEach((action) => {
            action.addEventListener("click", this.handleActionClick);
        });
    }

    subscribe() {
        if (!window.wc || typeof window.wc.subscribe !== "function") {
            this.log("wc.subscribe unavailable", { component: this.config.component });
            return;
        }

        window.wc.subscribe("4-mtk-biab", this.onMessage);
        window.wc.subscribe("4-mtk-biab:select-section", this.onMessage);
        window.wc.subscribe("4-mtk-biab:open-menu", this.onMessage);
        window.wc.subscribe("4-mtk-biab:close-menu", this.onMessage);
        window.wc.subscribe("4-mtk-biab:toggle-menu", this.onMessage);
        window.wc.subscribe("4-mtk-biab:refresh", this.onMessage);
    }

    onMessage(message = {}) {
        const topic = message.topic || message.type || message.event || "4-mtk-biab";
        const payload = message.payload || message.data || message;

        this.log("received", { topic, payload });

        switch (topic) {
            case "4-mtk-biab:select-section":
                this.renderSection(payload.sectionId || payload.id);
                break;
            case "4-mtk-biab:open-menu":
                this.openMobileMenu();
                break;
            case "4-mtk-biab:close-menu":
                this.closeMobileMenu();
                break;
            case "4-mtk-biab:toggle-menu":
                this.toggleMobileMenu();
                break;
            case "4-mtk-biab:refresh":
            case "4-mtk-biab":
                this.renderStaticContent();
                this.renderNav();
                this.renderSection(this.activeSectionId, false);
                break;
            default:
                break;
        }
    }

    handleNavClick(event) {
        const button = event.target.closest(".mtk-biab__nav-button");

        if (!button) {
            return;
        }

        const sectionId = button.dataset.sectionId;
        const section = this.getSectionById(sectionId);

        this.renderSection(sectionId);
        this.publish("4-mtk-biab:nav-clicked", {
            sectionId,
            section
        });
    }

    handleMenuClick() {
        this.toggleMobileMenu();
        this.publish("4-mtk-biab:menu-clicked", {
            isOpen: this.element.classList.contains("mtk-biab--menu-open")
        });
    }

    handleActionClick(event) {
        const actionKey = event.currentTarget.dataset.biabAction;
        const actionConfig = this.config.actions?.[actionKey] || {};
        const topic = actionConfig.topic || `4-mtk-biab:${actionKey}-clicked`;
        const section = this.getSectionById(this.activeSectionId);

        this.publish(topic, {
            action: actionKey,
            sectionId: this.activeSectionId,
            section
        });
    }

    toggleMobileMenu() {
        const isOpen = this.element.classList.toggle("mtk-biab--menu-open");
        this.setMenuState(isOpen);
    }

    openMobileMenu() {
        this.element.classList.add("mtk-biab--menu-open");
        this.setMenuState(true);
    }

    closeMobileMenu() {
        this.element.classList.remove("mtk-biab--menu-open");
        this.setMenuState(false);
    }

    setMenuState(isOpen) {
        if (!this.menuButton) {
            return;
        }

        this.menuButton.setAttribute("aria-expanded", String(isOpen));
        this.menuButton.setAttribute("aria-label", isOpen ? this.getLabel("closeMenu") : this.getLabel("openMenu"));
    }

    publish(topic, payload = {}) {
        this.log("publishing", { topic, payload });

        if (!window.wc || typeof window.wc.publish !== "function") {
            return;
        }

        window.wc.publish(topic, payload);
    }

    log(message, data) {
        if (window.wc && typeof window.wc.log === "function") {
            window.wc.log(`[mtk-biab] ${message}`, data);
            return;
        }

        console.log(`[mtk-biab] ${message}`, data || "");
    }

    getSections() {
        return Array.isArray(this.config.sections) ? this.config.sections : [];
    }

    getSectionById(sectionId) {
        return this.getSections().find((section) => section.id === sectionId);
    }

    getLabel(key) {
        return this.config.labels?.[key] || "";
    }

    setText(node, value) {
        if (node) {
            node.textContent = value || "";
        }
    }
}

(function initializeMtkBiabWhenReady() {
    const componentSelector = "mtk-biab.mtk-biab";
    const initialized = new WeakSet();

    function loadConfig(callback) {
        if (window.mtkBiabConfig) {
            callback(window.mtkBiabConfig);
            return;
        }

        const existingScript = document.querySelector('script[src$="mtk-biab.config.js"]');

        if (existingScript) {
            existingScript.addEventListener("load", () => callback(window.mtkBiabConfig || {}), { once: true });
            existingScript.addEventListener("error", () => callback({}), { once: true });
            return;
        }

        const script = document.createElement("script");
        script.src = "mtk-biab.config.js";
        script.defer = true;
        script.addEventListener("load", () => callback(window.mtkBiabConfig || {}), { once: true });
        script.addEventListener("error", () => callback({}), { once: true });
        document.head.appendChild(script);
    }

    function initElements(config) {
        const elements = Array.from(document.querySelectorAll(componentSelector));

        elements.forEach((element) => {
            if (!initialized.has(element)) {
                initialized.add(element);
                element.mtkBiab = new MtkBiab(element, config);
            }
        });
    }

    function start() {
        loadConfig((config) => {
            initElements(config);

            const observer = new MutationObserver(() => {
                initElements(window.mtkBiabConfig || config);
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
