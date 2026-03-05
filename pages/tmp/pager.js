/**
 * Pager Component<BR>
 * <BR><BR><img src=/tk/lib/components/w/img/pager.png width=30% style="border:1px lime dashed;padding:20px">
 * <BR><BR><a href="/tk/lib/components/w/html/pager.html">DEMO</a>
 */
class Pager extends HTMLElement {
    constructor() {
        wc.group("Pager.constructor")

        super();

        wc.groupEnd();
    };
    
    /**
     * Set observable values here. When Changed, attributeChangedCallback is invoked
     * @observedAttributes
     */
    static get observedAttributes() {
        wc.group("Pager.observedAttributes");

	this.observables = [];

        wc.groupEnd();
        return this.observables;
    };

    /**
     * Called when this is attached to DOM
     * @connectedCallback.
     */
    connectedCallback() {
        wc.group("Pager.connectedCallback")

	// ADD A RANDOM ID IF NONE EXIST
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
     * Called with .setAttribute(...) function call
     * @attributeChangedCallback
     */
    attributeChangedCallback(attr, oldval, newval) {
        wc.group("Pager.attributeChangedCallback:", attr, oldval, newval);

	this.properties = this.properties || [];

	let obs = Pager.observedAttributes;

	for (let i = 0; i < obs.length; i++) {
	    if (newval) {
		this.properties[obs[i]] = newval;
	    }
	}

	// YOUR CODE FOR CHANGES GO HERE (MAYBE NULL FIRST TIME THROUGH)
	try {
	    switch(attr)
	    {
		case "header":
		//this.querySelector("h1").innerHTML = newval;
		break;

		default:
		break;
	    }
	} catch(e) {
	    wc.warn(e.name + ' > ' + e.message);
	}

        wc.groupEnd();
    };

    /**
     * Stores DOM elements of interest for future use
     * @private
     * @_fetchElements
     */
    _fetchElements() {
	wc.group("Pager._fetchElements");

	this.dom = this.dom || [];
	this.dom.content = this.innerHTML;

	wc.groupEnd();
    };

    /**
     * Component attributes are _fetched and defaults are set if undefined
     * @private
     * @_fetchAttributes
     */
    _fetchAttributes() {
	wc.group("Pager._fetchAttributes");

	this.properties = {
	    uparam : "",
	    cname : "Pager",
	    author : "Mel M. Heravi",
	    id : "1561999078",
	    version : "1.0",
	    env : "prod"
	};

	// SAVE WIDGET SPECIFIC PROPERTIES
	this.propertiesW = [];

	// SAVE ALL OTHER PROPERTIES
	let attrs = wc.getAttributes(this)

	for (var key in attrs) {
	    let attr = this.getAttribute(key) || this.properties.key;
	    this.properties[key]  = this.getAttribute(key);
	    this.propertiesW[key] = this.getAttribute(key);
	    wc.log(key + ": " + attrs[key]);
	}

	// SET ALL INITIAL ATTRIBUTES
	for (var key in this.properties) {
	    switch(key)
	    {
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
     * configure the instance object and artifacts
     * @configure
     * @param {string} data use data if exist else use 'this.properties.cfg' parameter
     */
    configure(data) {
	wc.group("Pager.configure:", data);

	// IF JSON VARIABLE (data) IS PROVIDED
	if (data) {
	    this._process(data);
	} else {
	    let self = this;

	    $.getJSON(this.properties.cfg, function(data) {
		self._process(data);
	    }).fail(function(jqXHR, textStatus, errorThrown) {
		alert("ERROR: INCOMING TEXT " + jqXHR.responseText);
	    });
	}

	wc.groupEnd();
    };

    /**
     * _process the instance object and artifacts
     * @private
     * @_process
     */
    _process(data) {
	wc.group("Pager._process:", data);

	this.data = data;
	this.cname = this.properties.cname.toLowerCase();

	let tstr = "";

	for (var i = 0; i < data.length; i++) {
	    tstr += `<div class="wc-${this.cname}__page ${data[i].page}" wc-pager-id="${data[i].page}"></div>`;
	}

	// ADD COMPONENT MARKTOP
	this.innerHTML = tstr;

	var page = wc.getSearchParam("page");

	if (page) {
	    // IF HAVE PAGE ON URL
	    this.show(page)
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
     * Initialize component
     * @private
     * @_initialize
     */
    _initialize() {
	wc.group("Pager._initialize:", this.id);

	// FETCH ALL INTERESTING ELEMENTS
	this._fetchElements();

	// FETCH ALL ATTRIBUTES
	this._fetchAttributes();

	wc.groupEnd();
    };

    /**
     * Save data for analytics and final wrap up
     * @private
     * @_finalize
     */
    _finalize() {
	wc.group("Pager._finalize:", this.id);

	this.classList.add("wc");

	// ADD ANALYTICS HERE
	wc.setStats(this, this.properties.cname, this.properties.version);

	// SHOW IT NOW (NO FLICKERS)
	this.style.visibility = "visible";

	wc.groupEnd();
    };

    /**
     * Invoked When component is removed. Usually with a .remove() function call
     * @disconnectedCallback
     */
    disconnectedCallback() {
        wc.group("Pager.disconnectedCallback")

	// FREE MEMORY AND CLEANUP

        wc.groupEnd();
    };

    /**
     * Destroy the instance object and artifacts
     * @destroy
     */
    destroy() {
	wc.group("Pager.destroy");

	// FREE ALL MEMORY
	// you should delete all created objects here

	// FREE POINTER
	delete this;

	// REMOVE ITEM FROM DOM
	this.parentNode.removeChild(this);

	wc.groupEnd();
    };

    /**
     * refresh a page
     * @refresh
     */
    refresh(page) {
	wc.group("Pager.refresh:", page);

	// EMPTY CONTENT
	$(`#${this.id} .` + page).empty();

	// RE-LOAD THE PAGE
	this.show(page);

	wc.groupEnd();
	return page;
    };

    /**
     * show a page
     * @show
     */
    show(page) {
	wc.group("Pager.show:", page);

	// CHANGE URL
	//wc.pushstate(page);
	
	// HIDE ALL PAGES
	$(`#${this.id} .wc-${this.cname}__page`).hide();

	let obj = $.grep(this.data, function(obj) {
	    return obj.page === page;
	});

	let apage = $(`#${this.id} .${page}`);
	let empty = apage.is(":empty");

	// IF ITS THE FIRST TIME, ADD THE PAGE
	if ($(apage).is(":empty")) {
	    apage.html(obj[0].url);
	}

	if (obj[0].cache == "false" || empty) {
	    apage.html(obj[0].url);
	}

	// SHOW THIS PAGE
	apage.show();

	// PUBLISH SHOW EVENT
	wc.publish(`wc-${this.cname}`, {
	    time: new Date().getTime(),
	    action: "show",
	    id: page
	});

	wc.groupEnd();
	return page;
    };

    /**
     * for testing only
     * @tester
     */
    _dev(page) {
	wc.group("Pager.tester:", page);

	let self = this;

	let str = `<div class="btn-group btn-group-sm btn-group-tester border border-dark" role="group" aria-label="btn-tester" style="position:fixed;bottom:50px;right:10px;z-index:99999999">`;

	for (var i = 0; i < this.data.length; i++) {
	    str += `<button type="button" class="btn btn-sm btn-success wc-pager-btn-tester" style=font-size:11px;border-radius:0>${this.data[i].page}</button>`;
	}
	str += "</div>"

	$("body").append(str);

	$(`.wc-pager-btn-tester`).on("click", function() {
	    self.show($(this).text());
	});

	wc.groupEnd();
    };

    /**
     * for testing only
     * @new
     */
    new(values) {
	wc.group("Pager.new:", values);

	let self = this;

	this.data.push(values);

	var tstr =
	    `<div class="wc-${this.cname}__page ${values.page}" cache="${values.cache}" style="display:none">
	        <wc-include href="${values.url}"></wc-include>
	    </div>`;

	$(`#${this.id} .btn-group-tester`).append(`<button type="button" class="btn btn-sm btn-danger wc-pager-btn-tester" style=font-size:11px;border-radius:0>${values.page}</button>`);

	$(`#${this.id} .wc-pager-btn-tester`).unbind().on("click", function() {
	    self.show($(this).text());
	});

	this.innerHTML += tstr;

	this.show(values.page);
	
	wc.groupEnd();
    };

    /**
     * for testing only
     * @newTest
     */
    newTest() {
	wc.group("Pager.newTest");

	this.new({
	    "cache": "true",
	    "page": "new-page",
	    "url": "/tk/lib/components/w/html/parts/pager/test.html"
	});

	wc.groupEnd();
    };
}

window.customElements.define('wc-pager', Pager);
