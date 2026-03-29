/**
 * mtk-pages
 * Web component for managing multi-page navigation without full page reloads.
 * Reads config from window.app.pages
 */
class Pages extends HTMLElement {

    connectedCallback() {
        wc.group("mtk-pages.connectedCallback");

        if (!this.id) {
            this.id = "mtk-pages";
        }

        wc.pages = this;
        this.currentPage = null;

        this._historyReady = false;
        this._suppressNextPush = false;
        this._allowExitOnce = false;
        this._onPopState = this._onPopState.bind(this);

        this._waitForData();

        wc.groupEnd();
    }

    disconnectedCallback() {
        window.removeEventListener("popstate", this._onPopState);
    }

    _waitForData() {
        wc.group("mtk-pages._waitForData");

        const maxRetries = 50;
        let attempts = 0;

        const check = () => {
            attempts++;

            if (window.app && window.app.pages && window.app.pages.length) {
                wc.log("mtk-pages: data found after", attempts, "attempt(s)");
                this._process(window.app.pages);
                return;
            }

            if (attempts >= maxRetries) {
                wc.warn("mtk-pages: window.app.pages not found after", maxRetries, "attempts");
                return;
            }

            setTimeout(check, 100);
        };

        check();

        wc.groupEnd();
    }

    _process(data) {
        wc.group("mtk-pages._process", data);

        this.data = data;
        this.cname = "pages";
        wc.pages = this;

        let html = "";
        for (let i = 0; i < data.length; i++) {
            html += `<div class="mtk-pages__page ${data[i].page}" mtk-pages-id="${data[i].page}" style="display:none"></div>`;
        }
        this.innerHTML = html;

        const defaultPage = this.getAttribute("page") || data[0].page;
        const requestedPublicPage = window.__nalaRequestedPublicPage;
        const initialPage = requestedPublicPage || defaultPage;

        this._initHistory(initialPage);
        this.show(initialPage, { replaceHistory: true });

        if (this.getAttribute("env") === "dev") {
            this._dev();
        }

        this.style.visibility = "visible";

        wc.groupEnd();
    }

    _initHistory(defaultPage) {
        if (this._historyReady) return;

        const initialPage = defaultPage || "home";

        try {
            window.history.replaceState(
                { app: "nala", page: initialPage, guard: false },
                "",
                window.location.href
            );

            window.history.pushState(
                { app: "nala", page: initialPage, guard: true },
                "",
                window.location.href
            );

            window.addEventListener("popstate", this._onPopState);
            this._historyReady = true;

            wc.log("mtk-pages: history barrier initialized for page:", initialPage);
        } catch (e) {
            wc.warn("mtk-pages: history init failed", e);
        }
    }

    _updateHistory(page, opts = {}) {
        if (!this._historyReady) return;
        if (opts.fromPopState === true) return;

        if (this._suppressNextPush === true) {
            this._suppressNextPush = false;
            return;
        }

        const state = {
            app: "nala",
            page: page,
            guard: true
        };

        try {
            if (opts.replaceHistory === true) {
                window.history.replaceState(state, "", window.location.href);
            } else {
                window.history.pushState(state, "", window.location.href);
            }
        } catch (e) {
            wc.warn("mtk-pages: history update failed", e);
        }
    }

    _onPopState(event) {
        const state = event && event.state ? event.state : null;
        const fallbackPage = this.currentPage || (this.data && this.data[0] ? this.data[0].page : "home");

        if (this.currentPage === "dashboard" && this._allowExitOnce !== true) {
            const leave = window.confirm("Are you sure you want to leave?");

            if (!leave) {
                try {
                    window.history.pushState(
                        { app: "nala", page: "dashboard", guard: true },
                        "",
                        window.location.href
                    );
                } catch (e) {
                    wc.warn("mtk-pages: failed to restore dashboard state", e);
                }

                this._suppressNextPush = true;
                this.show("dashboard", {
                    fromPopState: true,
                    replaceHistory: true,
                    forceReload: true
                });
                return;
            }

            this._allowExitOnce = true;
            setTimeout(() => {
                window.history.back();
            }, 0);
            return;
        }

        if (this._allowExitOnce === true) {
            this._allowExitOnce = false;
            return;
        }

        if (state && state.app === "nala" && state.page) {
            this._suppressNextPush = true;
            this.show(state.page, {
                fromPopState: true,
                replaceHistory: true,
                forceReload: state.page === "dashboard"
            });
            return;
        }

        try {
            window.history.pushState(
                { app: "nala", page: fallbackPage, guard: true },
                "",
                window.location.href
            );
        } catch (e) {
            wc.warn("mtk-pages: failed to restore guarded state", e);
        }

        this._suppressNextPush = true;
        this.show(fallbackPage, { fromPopState: true, replaceHistory: true });
    }

    show(page, opts = {}) {
        wc.group("mtk-pages.show:", page, opts);

        switch (page) {
            case "login":
            case "dashboard":
                wc.fixFooter();
                break;

            default:
                wc.unfixFooter();
                break;
        }

        try {
            headerSelect("mtk-header-" + page);
        } catch (e) {}

        if (!this.data) {
            wc.warn("mtk-pages: not initialized yet");
            wc.groupEnd();
            return;
        }

        const obj = this.data.find(o => o.page === page);

        if (!obj) {
            wc.warn("mtk-pages: page not found in config:", page);
            wc.groupEnd();
            return;
        }

        const allPages = this.querySelectorAll(".mtk-pages__page");
        allPages.forEach(el => {
            el.style.display = "none";
        });

        const target = this.querySelector(`[mtk-pages-id="${page}"]`);

        if (!target) {
            wc.warn("mtk-pages: DOM element not found for page:", page);
            wc.groupEnd();
            return;
        }

        const isEmpty = target.innerHTML.trim() === "";

        const shouldReload =
            opts.forceReload === true ||
            isEmpty ||
            (page === "dashboard" && (obj.cache === false || obj.cache === "false"));

        if (shouldReload) {
            target.innerHTML = "";
            target.innerHTML = obj.url;
        }

        target.style.display = "block";
        this.currentPage = page;

        this._updateHistory(page, opts);

        window.scrollTo(0, 0);

        wc.publish("mtk-pages", {
            time: new Date().getTime(),
            action: "show",
            page: page,
            label: obj.label || page
        });

        wc.log("mtk-pages: showing page:", page);
        wc.groupEnd();
        return page;
    }

    refresh(page, opts = {}) {
        wc.group("mtk-pages.refresh:", page, opts);

        const target = this.querySelector(`[mtk-pages-id="${page}"]`);
        if (target) {
            target.innerHTML = "";
        }

        const shouldShowPage = opts.showPage === true || this.currentPage === page;

        if (shouldShowPage) {
            this.show(page, { forceReload: true, replaceHistory: true });
        } else {
            wc.log("mtk-pages.refresh: cache cleared only, page not shown:", page);
        }

        wc.groupEnd();
        return page;
    }

    new(values) {
        wc.group("mtk-pages.new:", values);

        if (!values || !values.page || !values.url) {
            wc.warn("mtk-pages.new: missing required fields (page, url)");
            wc.groupEnd();
            return;
        }

        this.data.push(values);

        const div = document.createElement("div");
        div.className = `mtk-pages__page ${values.page}`;
        div.setAttribute("mtk-pages-id", values.page);
        div.style.display = "none";
        this.appendChild(div);

        const toolbar = document.querySelector(".mtk-pages-toolbar");
        if (toolbar) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "btn btn-sm btn-danger mtk-pages-btn-tester";
            btn.style.cssText = "font-size:11px;border-radius:0";
            btn.textContent = values.label || values.page;
            btn.addEventListener("click", () => this.show(values.page));
            toolbar.appendChild(btn);
        }

        this.show(values.page);

        wc.groupEnd();
    }

    _dev() {
        wc.group("mtk-pages._dev");

        const self = this;

        const toolbar = document.createElement("div");
        toolbar.className = "btn-group btn-group-sm mtk-pages-toolbar border border-dark";
        toolbar.setAttribute("role", "group");
        toolbar.style.cssText = "position:fixed;bottom:50px;right:10px;z-index:99999999";

        for (let i = 0; i < this.data.length; i++) {
            const idx = i;
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "btn btn-sm btn-success mtk-pages-btn-tester";
            btn.style.cssText = "font-size:11px;border-radius:0";
            btn.textContent = this.data[idx].label || this.data[idx].page;
            btn.addEventListener("click", function () {
                self.show(self.data[idx].page);
            });
            toolbar.appendChild(btn);
        }

        document.body.appendChild(toolbar);

        wc.groupEnd();
    }
}

window.customElements.define('mtk-pages', Pages);
