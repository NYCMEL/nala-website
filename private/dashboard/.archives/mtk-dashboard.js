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
	    /* User name */
	    const nameEl = this.host.querySelector(".dashboard-user-name");
	    nameEl.textContent = this.config.user.fullName;

	    /* Continue button */
	    const continueBtn = this.host.querySelector(".dashboard-continue-btn");
	    if (continueBtn) {
		continueBtn.addEventListener("click", () => {
		    wc.publish("mtk-dashboard:continue", { user: this.config.user });
		});

		continueBtn.addEventListener("keypress", (e) => {
		    if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			wc.publish("mtk-dashboard:continue", { user: this.config.user });
		    }
		});
	    }

	    /* Progress */
	    const progressBar = this.host.querySelector(".dashboard-progress-bar");
	    const percent = Math.min(Math.max(this.config.user.progressPercent, 0), 100);
	    progressBar.style.width = percent + "%";
	    progressBar.textContent = percent + "%";
	    progressBar.setAttribute("aria-valuenow", percent);

	    /* Suggestions */
	    const container = this.host.querySelector(".dashboard-suggestions");
	    container.innerHTML = "";

	    this.config.suggestions.forEach((sugg) => {
		const row = document.createElement("div");
		row.className = "dashboard-suggestion";
		row.tabIndex = 0;
		row.setAttribute("role", "button");
		row.setAttribute("aria-label", "Dashboard suggestion");

		const info = document.createElement("div");

		const title = document.createElement("div");
		title.className = "dashboard-suggestion-title";
		title.innerHTML = sugg.title; // ✅ HTML enabled

		const desc = document.createElement("div");
		desc.className = "dashboard-suggestion-description";
		desc.innerHTML = sugg.description; // ✅ HTML enabled

		info.append(title, desc);

		const actionBtn = document.createElement("button");
		actionBtn.className = "dashboard-suggestion-action btn btn-primary";
		actionBtn.type = "button";
		actionBtn.textContent = sugg.action;

		/* Subscribe button */
		actionBtn.addEventListener("click", (e) => {
		    e.stopPropagation();
		    wc.publish("mtk-dashboard:subscribe:click", sugg);
		});

		actionBtn.addEventListener("keypress", (e) => {
		    if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			wc.publish("mtk-dashboard:subscribe:click", sugg);
		    }
		});

		row.append(info, actionBtn);

		/* Row click */
		row.addEventListener("click", () => {
		    wc.publish("mtk-dashboard:suggestion:click", sugg);
		});

		row.addEventListener("keypress", (e) => {
		    if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			wc.publish("mtk-dashboard:suggestion:click", sugg);
		    }
		});

		container.appendChild(row);
	    });
	}

	updateProgress(value) {
	    const bar = this.host.querySelector(".dashboard-progress-bar");
	    const percent = Math.min(Math.max(value, 0), 100);
	    bar.style.width = percent + "%";
	    bar.textContent = percent + "%";
	    bar.setAttribute("aria-valuenow", percent);
	}

	updateSuggestions(suggestions) {
	    this.config.suggestions = suggestions;
	    this.render();
	}
    }

    new MtkDashboard();
})();
