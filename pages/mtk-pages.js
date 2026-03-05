/**
 * Pages Component
 * Web component for managing multi-page navigation without page reloads.
 * Renamed from Pager to Pages.
 */
class Pages extends HTMLElement {
    constructor() {
        wc.group("Pages.constructor");

        super();

        wc.groupEnd();
    };

    /**
     * Set observable values here. When changed, attributeChangedCallback is invoked.
     * @observedAttributes
     */
    static get observedAttributes() {
        wc.group("Pages.observedAttributes");

        this.observables = [];

        wc.groupEnd();
        return this.observables;
    };

    /**
     * Called when this is attached to the DOM.
     * @connectedCallback
     */
    connectedCallback() {
        wc.group("Pages.connectedCallback");

        // ADD A RANDOM ID IF NONE EXISTS
        if (!this.id) {
            this.id = this.constructor.name.toLowerCase() + "-" + wc.uid();
        }

        // GET PROPERTIES AND INTERESTING ELEMENTS
        this._initialize();

        if (this.properties.cfg) {
            this.configure();
        }

        // ADD STATS AND OTHER FINAL STUFF
        this._finalize();

        wc.groupEnd();
    };

    /**
     * Called with .setAttribute(...) function call.
     * @attributeChangedCallback
     */
    attributeChangedCallback(attr, oldval, newval) {
        wc.group("Pages.attributeChangedCallback:", attr, oldval, newval);

        this.properties = this.properties || [];

        let obs = Pages.observedAttributes;

        for (let i = 0; i < obs.length; i++) {
            if (newval) {
                this.properties[obs[i]] = newval;
            }
        }

        try {
            switch (attr) {
                case "header":
                    break;
                default:
                    break;
            }
        } catch (e) {
            wc.warn(e.name + ' > ' + e.message);
        }

        wc.groupEnd();
    };

    /**
     * Stores DOM elements of interest for future use.
     * @private
     * @_fetchElements
     */
    _fetchElements() {
        wc.group("Pages._fetchElements");

        this.dom = this.dom || [];
        this.dom.content = this.innerHTML;

        wc.groupEnd();
    };

    /**
     * Component attributes are fetched and defaults are set if undefined.
     * @private
     * @_fetchAttributes
     */
    _fetchAttributes() {
        wc.group("Pages._fetchAttributes");

        this.properties = {
            uparam:  "",
            cname:   "Pages",
            author:  "Mel M. Heravi",
            id:      "1561999078",
            version: "1.0",
            env:     "prod"
        };

        // SAVE WIDGET SPECIFIC PROPERTIES
        this.propertiesW = [];

        // SAVE ALL OTHER PROPERTIES
        let attrs = wc.getAttributes(this);

        for (var key in attrs) {
            let attr = this.getAttribute(key) || this.properties.key;
            this.properties[key]  = this.getAttribute(key);
            this.propertiesW[key] = this.getAttribute(key);
            wc.log(key + ": " + attrs[key]);
        }

        // SET ALL INITIAL ATTRIBUTES
        for (var key in this.properties) {
            switch (key) {
                case "header":
                    break;
                default:
                    break;
            }
        }

        wc.log("ATTRIBUTES: ", this.properties);

        wc.groupEnd();
    };

    /**
     * Configure the instance object and artifacts.
     * @configure
     * @param {Object} data - Use data if provided, else use this.properties.cfg
     */
    configure(data) {
        wc.group("Pages.configure:", data);

        if (data) {
            this._process(data);
        } else {
            let self = this;

            $.getJSON(this.properties.cfg, function (data) {
                self._process(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert("ERROR: INCOMING TEXT " + jqXHR.responseText);
            });
        }

        wc.groupEnd();
    };

    /**
     * Process the instance object and artifacts.
     * @private
     * @_process
     */
    _process(data) {
        wc.group("Pages._process:", data);

        this.data  = data;
        this.cname = this.properties.cname.toLowerCase();

        let tstr = "";

        for (var i = 0; i < data.length; i++) {
            tstr += `<div class="mtk-${this.cname}__page ${data[i].page}" mtk-pages-id="${data[i].page}"></div>`;
        }

        // ADD COMPONENT MARKUP
        this.innerHTML = tstr;

        var page = wc.getSearchParam("page");

        if (page) {
            // IF PAGE IS ON URL
            this.show(page);
        } else {
            // SHOW DEFAULT PAGE
            this.show(this.properties.page || this.data[0].page);
        }

        // ADD DEVELOPMENT TOOLS
        if (this.properties.env == "dev") {
            this._dev();
        }

        wc.groupEnd();
    };

    /**
     * Initialize component.
     * @private
     * @_initialize
     */
    _initialize() {
        wc.group("Pages._initialize:", this.id);

        this._fetchElements();
        this._fetchAttributes();

        wc.groupEnd();
    };

    /**
     * Save data for analytics and final wrap up.
     * @private
     * @_finalize
     */
    _finalize() {
        wc.group("Pages._finalize:", this.id);

        this.classList.add("mtk");

        // ADD ANALYTICS HERE
        wc.setStats(this, this.properties.cname, this.properties.version);

        // SHOW IT NOW (NO FLICKERS)
        this.style.visibility = "visible";

        wc.groupEnd();
    };

    /**
     * Invoked when component is removed from DOM.
     * @disconnectedCallback
     */
    disconnectedCallback() {
        wc.group("Pages.disconnectedCallback");

        // FREE MEMORY AND CLEANUP

        wc.groupEnd();
    };

    /**
     * Destroy the instance object and artifacts.
     * @destroy
     */
    destroy() {
        wc.group("Pages.destroy");

        delete this;
        this.parentNode.removeChild(this);

        wc.groupEnd();
    };

    /**
     * Refresh a page by clearing and reloading its content.
     * @refresh
     * @param {string} page - Page ID to refresh
     */
    refresh(page) {
        wc.group("Pages.refresh:", page);

        // EMPTY CONTENT
        $(`#${this.id} .` + page).empty();

        // RE-LOAD THE PAGE
        this.show(page);

        wc.groupEnd();
        return page;
    };

    /**
     * Show a page by ID.
     * @show
     * @param {string} page - Page ID to display
     */
    show(page) {
        wc.group("Pages.show:", page);

        // CHANGE URL
        // wc.pushstate(page);

        // HIDE ALL PAGES
        $(`#${this.id} .mtk-${this.cname}__page`).hide();

        let obj = $.grep(this.data, function (obj) {
            return obj.page === page;
        });

        let apage = $(`#${this.id} .${page}`);
        let empty = apage.is(":empty");

        // IF IT IS THE FIRST TIME, ADD THE PAGE
        if ($(apage).is(":empty")) {
            apage.html(obj[0].url);
        }

        if (obj[0].cache == "false" || empty) {
            apage.html(obj[0].url);
        }

        // SHOW THIS PAGE
        apage.show();

        // PUBLISH SHOW EVENT
        wc.publish(`mtk-${this.cname}`, {
            time:   new Date().getTime(),
            action: "show",
            id:     page
        });

        wc.groupEnd();
        return page;
    };

    /**
     * Development toolbar for quickly switching pages.
     * @private
     * @_dev
     */
    _dev(page) {
        wc.group("Pages._dev:", page);

        let self = this;

        let str = `<div class="btn-group btn-group-sm btn-group-tester border border-dark" role="group" aria-label="btn-tester" style="position:fixed;bottom:50px;right:10px;z-index:99999999">`;

        for (var i = 0; i < this.data.length; i++) {
            str += `<button type="button" class="btn btn-sm btn-success mtk-pages-btn-tester" style="font-size:11px;border-radius:0">${this.data[i].page}</button>`;
        }

        str += "</div>";

        $("body").append(str);

        $(`.mtk-pages-btn-tester`).on("click", function () {
            self.show($(this).text());
        });

        wc.groupEnd();
    };

    /**
     * Dynamically add a new page at runtime.
     * @new
     * @param {Object} values - Page config object { page, url, cache }
     */
    new(values) {
        wc.group("Pages.new:", values);

        let self = this;

        this.data.push(values);

        var tstr =
            `<div class="mtk-${this.cname}__page ${values.page}" cache="${values.cache}" style="display:none">
                <mtk-include href="${values.url}"></mtk-include>
            </div>`;

        $(`#${this.id} .btn-group-tester`).append(
            `<button type="button" class="btn btn-sm btn-danger mtk-pages-btn-tester" style="font-size:11px;border-radius:0">${values.page}</button>`
        );

        $(`#${this.id} .mtk-pages-btn-tester`).unbind().on("click", function () {
            self.show($(this).text());
        });

        this.innerHTML += tstr;

        this.show(values.page);

        wc.groupEnd();
    };

    /**
     * Test helper to add a sample new page.
     * @newTest
     */
    newTest() {
        wc.group("Pages.newTest");

        this.new({
            "cache": "true",
            "page":  "new-page",
            "url":   "/tk/lib/components/w/html/parts/pages/test.html"
        });

        wc.groupEnd();
    };
}

window.customElements.define('mtk-pages', Pages);
