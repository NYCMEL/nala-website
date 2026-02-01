(function () {
    const NS = "MTKDashboard";

    class MtkDashboard {
	constructor() {
	    this.host = null;
	    this.config = null;
	    this.init();
	}

	init() {
	    const wait = setInterval(() => {
		const el = document.querySelector("mtk-dashboard");
		if (el && window.mtkDashboardConfig) {
		    clearInterval(wait);
		    this.host = el;
		    this.config = window.mtkDashboardConfig;
		    this.render();
		    this.subscribe();
		}
	    }, 50);
	}

	subscribe() {
	    wc.subscribe("4-mtk-dashboard:init", (msg) => this.onMessage(msg));
	    wc.subscribe("4-mtk-dashboard:update", (msg) => this.onMessage(msg));
	    wc.subscribe("4-mtk-dashboard:progress", (msg) => this.onMessage(msg));
	    wc.subscribe("4-mtk-dashboard:suggestion", (msg) => this.onMessage(msg));
	}

	onMessage(msg) {
	    if (msg.type === "updateProgress" && msg.value !== undefined) {
		this.updateProgress(msg.value);
	    }
	    if (msg.type === "updateSuggestions" && msg.suggestions) {
		this.updateSuggestions(msg.suggestions);
	    }
	}

	render() {
	    // Top row: user name
	    const nameEl = this.host.querySelector(".dashboard-user-name");
	    nameEl.textContent = this.config.user.fullName;

	    // Continue Your Course button
	    const continueBtn = this.host.querySelector(".dashboard-continue-btn");
	    if (continueBtn) {
		continueBtn.addEventListener("click", () => {
		    let key = "mtk-dashboard:continue";
		    let msg = key;
		    wc.log(key);
		    wc.publish(key);
		});
	    }

	    // Progress bar
	    const progressBar = this.host.querySelector(".dashboard-progress-bar");
	    const percent = Math.min(Math.max(this.config.user.progressPercent, 0), 100);
	    progressBar.style.width = percent + "%";
	    progressBar.textContent = percent + "%";
	    progressBar.setAttribute("aria-valuenow", percent);

	    // Suggestions
	    const suggestionsContainer = this.host.querySelector(".dashboard-suggestions");
	    suggestionsContainer.innerHTML = "";

	    this.config.suggestions.forEach((sugg) => {
		const suggestionEl = document.createElement("div");
		suggestionEl.className = "dashboard-suggestion";
		suggestionEl.tabIndex = 0;
		suggestionEl.setAttribute("role", "button");
		suggestionEl.setAttribute("aria-label", sugg.title + " - " + sugg.description);

		const infoDiv = document.createElement("div");
		const titleEl = document.createElement("div");
		titleEl.className = "dashboard-suggestion-title";
		titleEl.textContent = sugg.title;

		const descEl = document.createElement("div");
		descEl.className = "dashboard-suggestion-description";
		descEl.textContent = sugg.description;

		infoDiv.append(titleEl, descEl);

		// Suggestion action button (Subscribe)
		const actionBtn = document.createElement("button");
		actionBtn.className = "dashboard-suggestion-action";
		actionBtn.textContent = sugg.action;

		// Click on action button publishes WC event
		actionBtn.addEventListener("click", (e) => {
		    e.stopPropagation(); // Prevent firing row click
		    let key = "mtk-dashboard:subscribe:click";
		    let msg = (key, { user: this.config.user })
		    wc.log(key, { user: this.config.user });
		    wc.publish(msg);
		});

		// Keyboard accessibility for action button
		actionBtn.addEventListener("keypress", (e) => {
		    if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			let key = "mtk-dashboard:subscribe:click";
			let msg = (key, sugg)
			wc.log(key, sugg);
			wc.publish(msg);
		    }
		});

		suggestionEl.append(infoDiv, actionBtn);

		// Clicking entire suggestion row also publishes general WC event
		suggestionEl.addEventListener("click", () => {
		    let key = "mtk-dashboard:suggestion:click";
		    let msg = (key, sugg)
		    wc.log(key, sugg);
		    wc.publish(msg);
		});

		// Keyboard accessibility for row
		suggestionEl.addEventListener("keypress", (e) => {
		    if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();

			let key = "mtk-dashboard:suggestion:click";
			let msg = (key, sugg)
			wc.log(key, sugg);
			wc.publish(msg);
		    }
		});

		suggestionsContainer.appendChild(suggestionEl);
	    });
	}

	updateProgress(value) {
	    const progressBar = this.host.querySelector(".dashboard-progress-bar");
	    const percent = Math.min(Math.max(value, 0), 100);
	    progressBar.style.width = percent + "%";
	    progressBar.textContent = percent + "%";
	    progressBar.setAttribute("aria-valuenow", percent);
	}

	updateSuggestions(suggestions) {
	    this.config.suggestions = suggestions;
	    this.render();
	}
    }

    new MtkDashboard();
})();
