/**
 * mtk-pages
 * Web component for managing multi-page navigation without page reloads.
 * Reads config from window.app.pages
 */
class Pages extends HTMLElement {

    connectedCallback() {
        wc.group("mtk-pages.connectedCallback");

        if (!this.id) {
            this.id = "mtk-pages";
        }

        this._waitForData();

        wc.groupEnd();
    };

    disconnectedCallback() {
        wc.group("mtk-pages.disconnectedCallback");
        wc.groupEnd();
    };

    /**
     * Wait for window.app.pages to be available then initialize.
     * @private
     */
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
    };

    /**
     * Build page containers and show the default page.
     * @private
     */
    _process(data) {
        wc.group("mtk-pages._process", data);

        this.data  = data;
        this.cname = "pages";

        // BUILD PAGE DIV FOR EACH ENTRY
        let html = "";
        for (let i = 0; i < data.length; i++) {
            html += `<div class="mtk-pages__page ${data[i].page}" mtk-pages-id="${data[i].page}" style="display:none"></div>`;
        }
        this.innerHTML = html;

        // SHOW DEFAULT PAGE FROM ATTRIBUTE OR FIRST IN LIST
        const defaultPage = this.getAttribute("page") || data[0].page;
        this.show(defaultPage);

        // DEV TOOLBAR
        if (this.getAttribute("env") === "dev") {
            this._dev();
        }

        this.style.visibility = "visible";

        wc.groupEnd();
    };

    /**
     * Show a page by ID. Creates content on first visit, respects cache setting.
     * @param {string} page - The page ID to display
     */
    show(page) {
        wc.group("mtk-pages.show:", page);

	// FIX FOOTER TO BOTTOM
	checkFooter()

	try {
	    headerSelect("mtk-header-" + page);
	} catch(e) {
	    //wc.error(e.name + ' > ' + e.message);
	}

        if (!this.data) {
            wc.warn("mtk-pages: not initialized yet");
            wc.groupEnd();
            return;
        }

        // FIND PAGE CONFIG
        const obj = this.data.find(o => o.page === page);

        if (!obj) {
            wc.warn("mtk-pages: page not found in config:", page);
            wc.groupEnd();
            return;
        }

        // HIDE ALL PAGES
        const allPages = this.querySelectorAll(".mtk-pages__page");
        allPages.forEach(el => el.style.display = "none");

        // GET TARGET PAGE ELEMENT
        const target = this.querySelector(`.${page}`);

        if (!target) {
            wc.warn("mtk-pages: DOM element not found for page:", page);
            wc.groupEnd();
            return;
        }

        const isEmpty = target.innerHTML.trim() === "";

        // LOAD CONTENT IF EMPTY OR CACHE IS FALSE
        if (isEmpty || obj.cache === "false") {
            target.innerHTML = obj.url;
        }

        // SHOW THE PAGE
        target.style.display = "block";

        // SCROLL TO TOP
        window.scrollTo(0, 0);

        // PUBLISH EVENT
        wc.publish("mtk-pages", {
            time:   new Date().getTime(),
            action: "show",
            page:   page,
            label:  obj.label || page
        });

        wc.log("mtk-pages: showing page:", page);
        wc.groupEnd();
        return page;
    };

    /**
     * Refresh a page - clears content and reloads it.
     * @param {string} page - The page ID to refresh
     */
    refresh(page) {
        wc.group("mtk-pages.refresh:", page);

        const target = this.querySelector(`.${page}`);
        if (target) target.innerHTML = "";

        this.show(page);

        wc.groupEnd();
        return page;
    };

    /**
     * Add a new page dynamically at runtime.
     * @param {Object} values - { page, url, cache, label }
     */
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

        // ADD TO DEV TOOLBAR IF PRESENT
        const toolbar = document.querySelector(".mtk-pages-toolbar");
        if (toolbar) {
            const btn = document.createElement("button");
            btn.type      = "button";
            btn.className = "btn btn-sm btn-danger mtk-pages-btn-tester";
            btn.style.cssText = "font-size:11px;border-radius:0";
            btn.textContent = values.label || values.page;
            btn.addEventListener("click", () => this.show(values.page));
            toolbar.appendChild(btn);
        }

        this.show(values.page);

        wc.groupEnd();
    };

    /**
     * Dev toolbar - renders fixed buttons for each page.
     * Only shown when env="dev" attribute is set.
     * @private
     */
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
            btn.type      = "button";
            btn.className = "btn btn-sm btn-success mtk-pages-btn-tester";
            btn.style.cssText = "font-size:11px;border-radius:0";
            btn.textContent = this.data[idx].label || this.data[idx].page;
            btn.addEventListener("click", function() {
                self.show(self.data[idx].page);
            });
            toolbar.appendChild(btn);
        }

        document.body.appendChild(toolbar);

        wc.groupEnd();
    };
}

window.customElements.define('mtk-pages', Pages);

wc.timeout(function(){
    wc.pages = document.getElementById('mtk-pages');
}, 300, 1);
