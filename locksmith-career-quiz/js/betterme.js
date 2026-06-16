class MtkBetterme {
    constructor(root, config) {
	if (!root || root.dataset.bettermeInitialized === "true") {
	    return;
	}

	this.root = root;
	this.config = config;
	this.state = {
	    current: 0,
	    history: [],
	    answers: {},
	    recommendation: null
	};

	this.selectors = {
	    brand: "[data-betterme-brand]",
	    title: "[data-betterme-header-title]",
	    back: "[data-betterme-back]",
	    menu: "[data-betterme-menu]",
	    main: "[data-betterme-main]",
	    footer: "[data-betterme-footer]",
	    continue: "[data-betterme-continue]",
	    progress: "[data-betterme-progress-bar]"
	};

	this.root.dataset.bettermeInitialized = "true";
	this.cache();
	this.bind();
	wc.subscribe("4-betterme", this.onMessage.bind(this));
	this.render();
    }

    cache() {
	this.brand = this.root.querySelector(this.selectors.brand);
	this.headerTitle = this.root.querySelector(this.selectors.title);
	this.backBtn = this.root.querySelector(this.selectors.back);
	this.menuBtn = this.root.querySelector(this.selectors.menu);
	this.main = this.root.querySelector(this.selectors.main);
	this.footer = this.root.querySelector(this.selectors.footer);
	this.continueBtn = this.root.querySelector(this.selectors.continue);
	this.progressBar = this.root.querySelector(this.selectors.progress);
    }

    bind() {
	this.backBtn.addEventListener("click", this.previous.bind(this));
	this.continueBtn.addEventListener("click", this.next.bind(this));
    }

    onMessage(message) {
	const payload = message && message.payload ? message.payload : {};

	if (payload.action === "next") {
	    this.next();
	}

	if (payload.action === "back") {
	    this.previous();
	}

	if (payload.action === "restart") {
	    this.restart();
	}

	if (payload.action === "goTo" && Number.isInteger(payload.index)) {
	    this.goTo(payload.index);
	}
    }

    getScreen() {
	return this.config.screens[this.state.current];
    }

    render() {
	const screen = this.getScreen();

	this.brand.textContent = this.config.app.brand;
	this.headerTitle.textContent = this.state.current === 0 ? "" : this.config.app.headerTitle;
	this.backBtn.textContent = this.config.app.backText;
	this.backBtn.setAttribute("aria-label", this.config.app.backLabel);
	this.backBtn.disabled = this.state.current === 0;
	this.backBtn.setAttribute("aria-disabled", String(this.state.current === 0));
	this.menuBtn.setAttribute("aria-label", this.config.app.menuLabel);
	this.continueBtn.textContent = this.config.app.continueText;

	this.updateProgress();

	if (screen.type === 0) {
	    this.renderImageChoice(screen);
	}

	if (screen.type === 1) {
	    this.renderSelection(screen);
	}

	if (screen.type === 3) {
	    this.renderContent(screen);
	}

	if (screen.type === 4) {
	    this.renderForm(screen);
	}

	this.updateFooter(screen);

	wc.log("betterme rendered", {
	    index: this.state.current,
	    type: screen.type,
	    key: screen.key
	});
    }

    updateProgress(forceComplete) {
	const totalSteps = this.config.screens.length;
	const percent = forceComplete ? 100 : Math.round((this.state.current / totalSteps) * 100);
	this.progressBar.style.width = percent + "%";
	this.progressBar.setAttribute("aria-valuemin", "0");
	this.progressBar.setAttribute("aria-valuemax", "100");
	this.progressBar.setAttribute("aria-valuenow", String(percent));
    }

    renderImageChoice(screen) {
	this.main.innerHTML = `
      <section class="betterme__screen betterme__screen--images" aria-label="${this.escape(screen.title)}">
        ${this.renderEyebrow(screen)}
        <h1 class="betterme__title">${this.escape(screen.title)}</h1>
        ${this.renderDescription(screen)}
        <div class="betterme__image-grid">
          ${screen.options.map((option) => `
            <button class="betterme__image-card" type="button" data-value="${this.escape(option.value)}">
              <img class="betterme__image-card-img" src="${this.escape(option.image)}" alt="${this.escape(option.alt)}" />
              <span class="betterme__image-card-label">${this.escape(option.label)}</span>
            </button>
          `).join("")}
        </div>
      </section>
    `;

	this.main.querySelectorAll(".betterme__image-card").forEach((button) => {
	    button.addEventListener("click", () => {
		this.state.answers[screen.key] = button.dataset.value;
		this.publishSelection(screen, button.dataset.value);
		this.next();
	    });
	});
    }

    renderSelection(screen) {
	const selected = this.state.answers[screen.key];
	const isCheckbox = screen.inputType === "checkbox";
	const groupRole = isCheckbox ? "group" : "radiogroup";

	this.main.innerHTML = `
      <section class="betterme__screen betterme__screen--selection" aria-label="${this.escape(screen.title)}">
        ${this.renderEyebrow(screen)}
        <h1 class="betterme__title">${this.escape(screen.title)}</h1>
        ${this.renderDescription(screen)}
        <div class="betterme__choice-list" role="${groupRole}" aria-label="${this.escape(screen.title)}">
          ${screen.options.map((option) => {
            const isSelected = isCheckbox
              ? Array.isArray(selected) && selected.includes(option.value)
              : selected === option.value;

            return `
            <button
              class="betterme__choice ${isSelected ? "is-selected" : ""}"
              type="button"
              data-value="${this.escape(option.value)}"
              role="${isCheckbox ? "checkbox" : "radio"}"
              aria-checked="${String(isSelected)}"
            >
              <span class="betterme__choice-label">${this.escape(option.label)}</span>
              <span class="betterme__choice-control" aria-hidden="true">${isSelected ? "✓" : ""}</span>
            </button>
            `;
          }).join("")}
        </div>
      </section>
    `;

	this.main.querySelectorAll(".betterme__choice").forEach((button) => {
	    button.addEventListener("click", () => {
		this.selectOption(screen, button.dataset.value);
	    });
	});
    }

    renderContent(screen) {
	this.main.innerHTML = `
      <section class="betterme__screen betterme__screen--content" aria-label="${this.escape(screen.title)}">
        <div class="betterme__content-card">
          <div class="betterme__content-icon" aria-hidden="true">${this.escape(screen.icon || "✓")}</div>
          <h1 class="betterme__title">${this.escape(screen.title)}</h1>
          ${(screen.paragraphs || []).map((text) => `<p class="betterme__paragraph">${this.escape(text)}</p>`).join("")}
        </div>
      </section>
    `;
    }

    renderForm(screen) {
	const current = this.state.answers[screen.key] || {};

	this.main.innerHTML = `
      <section class="betterme__screen betterme__screen--form" aria-label="${this.escape(screen.title)}">
        ${this.renderEyebrow(screen)}
        <h1 class="betterme__title">${this.escape(screen.title)}</h1>
        ${this.renderDescription(screen)}
        <form class="betterme__form" novalidate>
          ${(screen.fields || []).map((field) => `
            <label class="betterme__field">
              <input
                class="betterme__field-input"
                name="${this.escape(field.name)}"
                type="${this.escape(field.type)}"
                autocomplete="${this.escape(field.autocomplete || "off")}"
                placeholder=" "
                value="${this.escape(current[field.name] || "")}"
                ${field.required ? "required" : ""}
              />
              <span class="betterme__field-label">${this.escape(field.label)}</span>
            </label>
          `).join("")}
        </form>
      </section>
    `;

	this.main.querySelectorAll(".betterme__field-input").forEach((input) => {
	    input.addEventListener("input", () => {
		this.collectForm(screen);
		this.updateFooter(screen);
	    });
	});
    }

    renderEyebrow(screen) {
	if (!screen.eyebrow) {
	    return "";
	}

	return `<p class="betterme__eyebrow">${this.escape(screen.eyebrow)}</p>`;
    }

    renderDescription(screen) {
	if (!screen.description) {
	    return "";
	}

	return `<p class="betterme__description">${this.escape(screen.description)}</p>`;
    }

    selectOption(screen, value) {
	if (screen.inputType === "checkbox") {
	    const current = Array.isArray(this.state.answers[screen.key]) ? this.state.answers[screen.key] : [];
	    const exists = current.includes(value);
	    this.state.answers[screen.key] = exists
		? current.filter((item) => item !== value)
		: current.concat(value);
	} else {
	    this.state.answers[screen.key] = value;
	}

	this.publishSelection(screen, value);
	this.render();
    }

    collectForm(screen) {
	const values = {};
	this.main.querySelectorAll(".betterme__field-input").forEach((input) => {
	    values[input.name] = input.value.trim();
	});
	this.state.answers[screen.key] = values;
	return values;
    }

    hasValidSelection(screen) {
	const value = this.state.answers[screen.key];

	if (screen.type === 4) {
	    const fields = screen.fields || [];
	    const values = value || {};
	    return fields.every((field) => {
		if (!field.required) {
		    return true;
		}

		return typeof values[field.name] === "string" && values[field.name].trim().length > 0;
	    });
	}

	if (screen.inputType === "checkbox") {
	    return Array.isArray(value) && value.length > 0;
	}

	if (screen.inputType === "radio") {
	    return typeof value === "string" && value.length > 0;
	}

	return false;
    }

    updateFooter(screen) {
	if (screen.type === 1 || screen.type === 4) {
	    const valid = this.hasValidSelection(screen);
	    this.footer.classList.toggle("is-visible", valid);
	    this.continueBtn.disabled = !valid;
	    this.continueBtn.setAttribute("aria-disabled", String(!valid));
	    return;
	}

	if (screen.type === 3) {
	    this.footer.classList.add("is-visible");
	    this.continueBtn.disabled = false;
	    this.continueBtn.setAttribute("aria-disabled", "false");
	    return;
	}

	this.footer.classList.remove("is-visible");
	this.continueBtn.disabled = true;
	this.continueBtn.setAttribute("aria-disabled", "true");
    }

    next() {
	const current = this.getScreen();

	if (current.type === 4) {
	    this.collectForm(current);
	}

	if ((current.type === 1 || current.type === 4) && !this.hasValidSelection(current)) {
	    this.updateFooter(current);
	    return;
	}

	if (this.state.current >= this.config.screens.length - 1) {
	    const recommendation = this.evaluateRecommendation();
	    this.state.recommendation = recommendation;
	    wc.log("betterme complete", { answers: this.state.answers, recommendation: recommendation });
	    wc.publish("betterme:complete", { answers: this.state.answers, recommendation: recommendation });
	    this.renderComplete(recommendation);
	    return;
	}

	this.state.history.push(this.state.current);
	this.state.current += 1;
	wc.log("betterme next", { index: this.state.current });
	wc.publish("betterme:navigation", { action: "next", index: this.state.current });
	this.render();
    }

    previous() {
	if (!this.state.history.length) {
	    return;
	}

	this.state.current = this.state.history.pop();
	wc.log("betterme back", { index: this.state.current });
	wc.publish("betterme:navigation", { action: "back", index: this.state.current });
	this.render();
    }

    restart() {
	this.state = {
	    current: 0,
	    history: [],
	    answers: {},
	    recommendation: null
	};
	wc.log("betterme restart", {});
	wc.publish("betterme:navigation", { action: "restart", index: 0 });
	this.render();
    }

    goTo(index) {
	if (index < 0 || index >= this.config.screens.length) {
	    return;
	}

	this.state.history.push(this.state.current);
	this.state.current = index;
	wc.log("betterme goTo", { index: index });
	wc.publish("betterme:navigation", { action: "goTo", index: index });
	this.render();
    }

    renderComplete(recommendation) {
	const labels = this.config.result;

	this.updateProgress(true);
	this.backBtn.disabled = false;
	this.backBtn.setAttribute("aria-disabled", "false");
	this.headerTitle.textContent = this.config.app.headerTitle;

	this.main.innerHTML = `
      <section class="betterme__screen betterme__screen--result" aria-label="${this.escape(this.config.app.completedTitle)}">
        <p class="betterme__eyebrow">${this.escape(labels.eyebrow)}</p>
        <h1 class="betterme__title">${this.escape(this.config.app.completedTitle)}</h1>
        <p class="betterme__description">${this.escape(this.config.app.completedText)}</p>

        <div class="betterme__result-hero">
          <p class="betterme__result-kicker">${this.escape(recommendation.persona.name)}</p>
          <h2 class="betterme__result-path">${this.escape(recommendation.persona.path)}</h2>
          <p class="betterme__result-copy">${this.escape(recommendation.summary)}</p>
        </div>

        <div class="betterme__result-grid">
          ${this.renderResultBlock(labels.whyTitle, this.renderList(recommendation.reasons))}
          ${this.renderResultBlock(labels.scheduleTitle, this.renderList(recommendation.schedule))}
          ${this.renderResultBlock(labels.timelineTitle, `<p>${this.escape(recommendation.timeline)}</p>`)}
          ${this.renderResultBlock(labels.servicesTitle, this.renderList(recommendation.services))}
          ${this.renderResultBlock(labels.revenueTitle, this.renderRevenue(recommendation))}
          ${this.renderResultBlock(labels.visionTitle, `<p>${this.escape(recommendation.persona.vision)}</p>`)}
        </div>

        <div class="betterme__next-card">
          <h2>${this.escape(labels.nextTitle)}</h2>
          <div class="betterme__next-actions">
            ${Object.keys(labels.ctaLabels).map((key) => `
              <button class="betterme__next-action ${recommendation.persona.nextStep === key ? "is-recommended" : ""}" type="button" data-result-cta="${this.escape(key)}">
                ${this.escape(labels.ctaLabels[key])}
              </button>
            `).join("")}
          </div>
          <button class="betterme__restart" type="button" data-betterme-restart>${this.escape(this.config.app.restartText)}</button>
        </div>
      </section>
    `;

	this.main.querySelectorAll("[data-result-cta]").forEach((button) => {
	    button.addEventListener("click", () => {
		const action = button.dataset.resultCta;
		wc.log("betterme result cta", { action: action, recommendation: recommendation });
		wc.publish("betterme:result-cta", { action: action, recommendation: recommendation });
	    });
	});

	const restart = this.main.querySelector("[data-betterme-restart]");
	if (restart) {
	    restart.addEventListener("click", this.restart.bind(this));
	}

	this.footer.classList.remove("is-visible");
    }

    renderResultBlock(title, body) {
	return `
      <article class="betterme__result-block">
        <h2>${this.escape(title)}</h2>
        ${body}
      </article>
    `;
    }

    renderList(items) {
	return `<ul>${items.map((item) => `<li>${this.escape(item)}</li>`).join("")}</ul>`;
    }

    renderRevenue(recommendation) {
	const labels = this.config.result;
	return `
      <p>${this.escape(labels.revenuePrefix)}</p>
      <p><strong>${this.escape(recommendation.jobBand.label)}</strong></p>
      <p>${this.escape(labels.revenueSuffix)}</p>
      <p><strong>${this.escape(recommendation.revenueRange)}</strong></p>
      <p class="betterme__result-note">${this.escape(labels.notGuaranteed)}</p>
    `;
    }

    evaluateRecommendation() {
	const answers = this.state.answers;
	const engine = this.config.engine;
	const personaKey = this.pickPersona(answers);
	const persona = engine.personas[personaKey];
	const marketMultiplier = engine.marketMultipliers[answers.marketType] || 1;
	const radiusMultiplier = engine.radiusMultipliers[answers.travelRadius] || 1;
	const timeline = engine.timelines[answers.studyHours] || engine.timelines["5_8"];
	const jobBand = engine.jobBands[answers.workHours] || engine.jobBands["6_10"];
	const ticket = this.getAverageTicket(personaKey, answers);
	const lowRevenue = this.roundMoney(ticket * jobBand.low * 4.3 * marketMultiplier * radiusMultiplier);
	const highRevenue = this.roundMoney(ticket * jobBand.high * 4.3 * marketMultiplier * radiusMultiplier);
	const services = engine.services[answers.serviceInterest] || engine.services.residential;
	const schedule = engine.schedules[answers.studySchedule] || engine.schedules.flexible;

	return {
	    persona: persona,
	    timeline: timeline,
	    jobBand: jobBand,
	    services: services,
	    schedule: schedule,
	    revenueRange: this.formatCurrency(lowRevenue) + "-" + this.formatCurrency(highRevenue) + "/month",
	    reasons: this.getReasons(answers),
	    summary: this.getSummary(persona, answers)
	};
    }

    pickPersona(answers) {
	if (answers.age === "under_16" || answers.age === "16_17") {
	    return "student_builder";
	}

	if (answers.age === "55_plus" || answers.employmentStatus === "retired") {
	    return "retiree";
	}

	if (answers.desiredIncome === "10000_plus" || answers.threeYearGoal === "manage_technicians" || answers.workStyle === "build_company") {
	    return "scale_builder";
	}

	if (answers.mainGoal === "start_business" || answers.threeYearGoal === "own_business" || answers.businessExperience === "one_business" || answers.businessExperience === "multiple_businesses") {
	    return "entrepreneur";
	}

	if (answers.incomePressure === "extremely_important") {
	    return "fast_starter";
	}

	if ((answers.mainGoal === "career_change" || answers.mainGoal === "long_term_career" || answers.threeYearGoal === "full_time_locksmith") && this.hasWorkCapacity(answers.workHours, "11_20")) {
	    return "career_transition";
	}

	if ((answers.familyStatus === "married_children" || answers.familyStatus === "single_parent") && ["1000", "2500", "5000"].includes(answers.desiredIncome)) {
	    return "family_provider";
	}

	if (answers.age === "18_24" && answers.employmentStatus !== "full_time" && (this.hasStudyCapacity(answers.studyHours, "13_20") || this.hasWorkCapacity(answers.workHours, "21_30"))) {
	    return "recent_graduate";
	}

	if (answers.employmentStatus === "full_time" || answers.mainGoal === "extra_income" || ["evenings_only", "weekends_only", "side_hustle"].includes(answers.workStyle)) {
	    return "side_hustle_builder";
	}

	return "independence_seeker";
    }

    getAverageTicket(personaKey, answers) {
	if (personaKey === "scale_builder" || personaKey === "entrepreneur" || ["commercial", "business_setup", "all"].includes(answers.serviceInterest)) {
	    return this.config.engine.averageTickets.strong;
	}

	if (personaKey === "student_builder" || personaKey === "retiree" || answers.transportation !== "reliable" || answers.toolComfort === "not_comfortable") {
	    return this.config.engine.averageTickets.starter;
	}

	return this.config.engine.averageTickets.standard;
    }

    getReasons(answers) {
	const reasons = [
	    "You can study " + this.labelFor("studyHours", answers.studyHours) + " hours weekly",
	    "You can work " + this.labelFor("workHours", answers.workHours) + " hours weekly",
	    "You want " + this.labelFor("desiredIncome", answers.desiredIncome) + " in additional monthly income",
	    "You are in a " + this.labelFor("marketType", answers.marketType).toLowerCase() + " market",
	    "You can travel " + this.labelFor("travelRadius", answers.travelRadius).toLowerCase(),
	    "You are most interested in " + this.labelFor("serviceInterest", answers.serviceInterest).toLowerCase() + " services"
	];

	if (answers.location && answers.location.state) {
	    reasons.push("You plan to start in " + answers.location.state);
	}

	if (answers.familyStatus === "married_children" || answers.familyStatus === "single_parent") {
	    reasons.push("Your schedule should account for family responsibilities");
	}

	if (answers.transportation !== "reliable") {
	    reasons.push("Transportation should be solved before relying on mobile service revenue");
	}

	return reasons;
    }

    getSummary(persona, answers) {
	const market = this.labelFor("marketType", answers.marketType).toLowerCase();
	const work = this.labelFor("workHours", answers.workHours).toLowerCase();
	return persona.path + " is the best fit because your goals, " + work + " work availability, and " + market + " market point to this launch pace.";
    }

    hasStudyCapacity(value, threshold) {
	const order = ["2_4", "5_8", "9_12", "13_20", "20_plus"];
	return order.indexOf(value) >= order.indexOf(threshold);
    }

    hasWorkCapacity(value, threshold) {
	const order = ["3_5", "6_10", "11_20", "21_30", "full_time"];
	return order.indexOf(value) >= order.indexOf(threshold);
    }

    labelFor(key, value) {
	const screen = this.config.screens.find((item) => item.key === key);
	if (!screen || !screen.options) {
	    return String(value || "");
	}

	const match = screen.options.find((option) => option.value === value);
	return match ? match.label : String(value || "");
    }

    roundMoney(value) {
	return Math.round(value / 50) * 50;
    }

    formatCurrency(value) {
	return "$" + Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 });
    }

    publishSelection(screen, value) {
	const payload = {
	    key: screen.key,
	    value: value,
	    inputType: screen.inputType || (screen.type === 4 ? "form" : "image"),
	    answers: this.state.answers
	};

	wc.log("betterme selection", payload);
	wc.publish("betterme:selection", payload);
    }

    escape(value) {
	return String(value || "")
	    .replace(/&/g, "&amp;")
	    .replace(/</g, "&lt;")
	    .replace(/>/g, "&gt;")
	    .replace(/"/g, "&quot;")
	    .replace(/'/g, "&#039;");
    }

    static boot() {
	const start = function () {
	    wc.waitForElement("betterme.betterme")
		.then(function (root) {
		    if (!window.bettermeConfig) {
			wc.log("betterme config missing");
			return;
		    }

		    new MtkBetterme(root, window.bettermeConfig);
		})
		.catch(function (error) {
		    wc.log("betterme boot failed", { error: error.message });
		});
	};

	if (window.wc && typeof window.wc.ready === "function") {
	    window.wc.ready(start);
	} else if (document.readyState === "loading") {
	    document.addEventListener("DOMContentLoaded", start, { once: true });
	} else {
	    start();
	}
    }
}

window.MtkBetterme = MtkBetterme;
MtkBetterme.boot();
