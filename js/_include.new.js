class Include extends HTMLElement {
    static cache = new Map(); // simple in-memory cache

    constructor() {
        super();
    }

    connectedCallback() {
        const href = this.getAttribute("href");
        if (!href) return;

        // Loading placeholder
        this.innerHTML = "<span class='wc-loading-img'></span>";

        this.load(href);
    }

    async load(href) {
        // fire before-load event
        this.dispatchEvent(new CustomEvent("include:before-load", {
            detail: { href, include: this },
            bubbles: true,
            composed: true
        }));

        try {
            // serve from cache if available
            if (Include.cache.has(href)) {
                this.innerHTML = Include.cache.get(href);
                this.emitLoaded(href);
                return;
            }

            const response = await fetch(href, { credentials: "same-origin" });

            if (!response.ok) {
                throw new Error(`Failed to load ${href}`);
            }

            const html = await response.text();

            // cache result
            Include.cache.set(href, html);

            this.innerHTML = html;
            this.emitLoaded(href);

        } catch (err) {
            console.error("wc-include error:", err);
            this.innerHTML = `wc-include: Page not found: ${href}`;
        }
    }

    emitLoaded(href) {
        this.dispatchEvent(new CustomEvent("include:loaded", {
            detail: { href, include: this },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define("wc-include", Include);
