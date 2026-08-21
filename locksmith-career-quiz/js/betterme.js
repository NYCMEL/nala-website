(function () {
  "use strict";

  class NalaCareerAdvisor {
    constructor(root, config) {
      this.root = root;
      this.config = config;
      this.main = root.querySelector("[data-main]");
      this.backButton = root.querySelector("[data-back]");
      this.brand = root.querySelector("[data-brand]");
      this.chapter = root.querySelector("[data-chapter]");
      this.progress = root.querySelector(".advisor__progress");
      this.progressFill = root.querySelector("[data-progress]");
      this.timers = [];
      this.state = this.restore();

      this.backButton.addEventListener("click", () => this.previous());
      this.render();
    }

    initialState() {
      return {
        current: 0,
        answers: {},
        completed: {},
        roadmapRevealed: false,
        sessionId: this.sessionId(),
        updatedAt: new Date().toISOString()
      };
    }

    sessionId() {
      if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
      }

      return "nala-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    }

    restore() {
      const fallback = this.initialState();

      try {
        const saved = JSON.parse(localStorage.getItem(this.config.storageKey));
        if (!saved || typeof saved !== "object") return fallback;

        return {
          current: Number.isInteger(saved.current) && saved.current >= 0 && saved.current < this.config.screens.length ? saved.current : 0,
          answers: saved.answers && typeof saved.answers === "object" ? saved.answers : {},
          completed: saved.completed && typeof saved.completed === "object" ? saved.completed : {},
          roadmapRevealed: Boolean(saved.roadmapRevealed),
          sessionId: typeof saved.sessionId === "string" ? saved.sessionId : fallback.sessionId,
          updatedAt: saved.updatedAt || fallback.updatedAt
        };
      } catch (error) {
        return fallback;
      }
    }

    persist() {
      this.state.updatedAt = new Date().toISOString();

      try {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.state));
      } catch (error) {
        this.track("persistence_unavailable", { reason: "storage_error" });
      }
    }

    screen() {
      return this.config.screens[this.state.current];
    }

    answer(screen) {
      return screen.key ? this.state.answers[screen.key] : null;
    }

    option(screen, value) {
      return (screen.options || []).find((item) => item.value === value);
    }

    saveAnswer(screen, option) {
      if (!screen.key) return;

      this.state.answers[screen.key] = {
        value: option.value,
        label: option.label,
        flag: option.flag || null,
        weight: Number.isFinite(option.weight) ? option.weight : null,
        answeredAt: new Date().toISOString()
      };
      this.persist();

      const payload = {
        answer_key: screen.key,
        answer_value: option.value,
        answer_flag: option.flag || undefined
      };
      this.track("selection_made", payload);
      this.track(screen.selectionEvent || "answer_selected", payload);
    }

    track(name, extra) {
      const screen = this.screen();
      const event = Object.assign({
        event: name,
        event_namespace: this.config.analyticsNamespace,
        funnel_version: this.config.version,
        screen_id: screen ? screen.id : null,
        screen_type: screen ? screen.type : null,
        session_id: this.state ? this.state.sessionId : null,
        timestamp: new Date().toISOString()
      }, extra || {});

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(event);
      window.dispatchEvent(new CustomEvent("nala:analytics", { detail: event }));
    }

    clearTimers() {
      this.timers.forEach((timer) => window.clearTimeout(timer));
      this.timers = [];
    }

    later(callback, delay) {
      const timer = window.setTimeout(callback, delay);
      this.timers.push(timer);
      return timer;
    }

    render(options) {
      const settings = options || {};
      const screen = this.screen();
      this.clearTimers();
      this.persist();

      const percentage = Math.round(((this.state.current + 1) / this.config.screens.length) * 100);
      this.progressFill.style.width = percentage + "%";
      this.progress.setAttribute("aria-valuenow", String(percentage));
      this.chapter.textContent = screen.chapter || this.config.app.chapter;
      this.backButton.disabled = this.state.current === 0;
      this.backButton.setAttribute("aria-hidden", String(this.state.current === 0));
      this.brand.classList.toggle("is-full", this.state.current >= 18);
      document.title = (screen.title || this.config.app.title) + " | NALA";

      const renderer = this["render" + screen.type.charAt(0).toUpperCase() + screen.type.slice(1)];
      this.main.innerHTML = typeof renderer === "function" ? renderer.call(this, screen) : "";
      this.bind(screen);

      const heading = this.main.querySelector("h1");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        if (settings.focus !== false) heading.focus({ preventScroll: true });
      }

      if (settings.track !== false) {
        this.track("screen_viewed", { screen_number: this.state.current + 1 });
      }

      if (screen.type === "roadmap" && !this.state.roadmapRevealed) this.beginRoadmapReveal(screen);
      if (screen.type === "final" && settings.track !== false) this.track("cta_impression", { cta_label: screen.action });
    }

    bind(screen) {
      this.main.querySelectorAll("[data-advance]").forEach((button) => {
        button.addEventListener("click", () => this.advance());
      });

      this.main.querySelectorAll("[data-choice]").forEach((button) => {
        button.addEventListener("click", () => this.select(screen, button.dataset.choice));
      });

      if (screen.type === "welcome") {
        const start = this.main.querySelector("[data-start]");
        if (start) start.addEventListener("click", () => {
          this.track("assessment_started");
          this.advance();
        });
      }

      if (screen.type === "dob") this.bindDob(screen);

      if (screen.type === "roadmapSetup") {
        const build = this.main.querySelector("[data-build-roadmap]");
        if (build) build.addEventListener("click", () => {
          if (!this.answer(screen)) return;
          this.track("roadmap_build_started", { work_path: this.answer(screen).value });
          this.advance();
        });
      }

      if (screen.type === "final") {
        const cta = this.main.querySelector("[data-final-cta]");
        if (cta) cta.addEventListener("click", () => {
          this.track("cta_click", { cta_label: screen.action });
          this.track("checkout_start_requested", { destination: "register" });
          window.location.assign(this.config.checkoutUrl);
        });
      }
    }

    select(screen, value) {
      const option = this.option(screen, value);
      if (!option) return;

      this.saveAnswer(screen, option);

      if (screen.type === "guidedChoice") {
        this.showGuidedFeedback(screen, option);
        return;
      }

      this.render({ track: false, focus: false });
    }

    showGuidedFeedback(screen, option) {
      this.clearTimers();
      this.main.querySelectorAll("[data-choice]").forEach((button) => {
        const selected = button.dataset.choice === option.value;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-checked", String(selected));
        button.disabled = true;
      });

      const response = this.main.querySelector("[data-response]");
      const insight = this.main.querySelector("[data-insight]");
      if (response) {
        response.innerHTML = `<p>${this.escape(option.response)}</p>`;
        response.hidden = false;
        this.track("dynamic_response_viewed", { answer_key: screen.key });
      }

      this.later(() => {
        if (!insight) return;
        insight.hidden = false;
        this.track("insight_viewed", { answer_key: screen.key });
      }, 1500);

      this.later(() => this.advance(), 3500);
    }

    complete(screen) {
      this.state.completed[screen.id] = new Date().toISOString();
      this.persist();
      this.track("screen_completed", { screen_number: this.state.current + 1 });
    }

    advance() {
      const screen = this.screen();
      this.complete(screen);
      if (this.state.current >= this.config.screens.length - 1) return;
      this.state.current += 1;
      this.persist();
      this.render();
    }

    previous() {
      if (this.state.current === 0) return;
      this.clearTimers();
      this.state.current -= 1;
      this.persist();
      this.track("navigation_back", { destination_screen_id: this.screen().id });
      this.render();
    }

    shell(screen, body, modifier) {
      return `
        <section class="screen ${modifier || ""}" data-screen-id="${this.escape(screen.id)}">
          <div class="screen__content">
            ${screen.step ? `<p class="screen__step">${this.escape(screen.step)}</p>` : ""}
            ${body}
          </div>
        </section>`;
    }

    title(text, className) {
      return `<h1 class="screen__title ${className || ""}">${this.escape(text)}</h1>`;
    }

    description(text) {
      return text ? `<p class="screen__description">${this.escape(text)}</p>` : "";
    }

    button(label, attributes, className) {
      return `<button class="primary-button ${className || ""}" type="button" ${attributes || ""}><span>${this.escape(label)}</span><span aria-hidden="true">→</span></button>`;
    }

    renderWelcome(screen) {
      const body = `
        <div class="welcome-mark" aria-hidden="true"><span></span><i></i></div>
        ${this.title(screen.title)}
        ${this.description(screen.description)}
        <p class="screen__supporting">${this.escape(screen.supporting)}</p>
        <div class="screen__actions">
          ${this.button(screen.action, "data-start", "primary-button--wide")}
          <p class="screen__secondary">${this.escape(screen.secondary)}</p>
        </div>`;
      return this.shell(screen, body, "screen--welcome");
    }

    renderDob(screen) {
      const answer = this.answer(screen);
      let controls = "";

      if (answer && Number.isFinite(answer.age)) {
        const eligible = answer.age_verified;
        controls = `
          <div class="eligibility ${eligible ? "is-eligible" : "is-ineligible"}" role="status">
            <span class="eligibility__icon" aria-hidden="true">${eligible ? "✓" : "i"}</span>
            <div>
              <strong>${this.escape(eligible ? screen.adultMessage : screen.minorMessage)}</strong>
              ${eligible ? `<p>Your age group is ${this.escape(answer.age_group)}. Your full birth date was not stored.</p>` : ""}
            </div>
          </div>
          <div class="screen__actions screen__actions--row">
            ${eligible ? this.button(this.config.app.continueLabel, "data-advance") : `<a class="primary-button" href="../" data-minor-return><span>${this.escape(screen.minorAction)}</span><span aria-hidden="true">→</span></a>`}
            <button class="text-button" type="button" data-change-dob>Change date</button>
          </div>`;
      } else {
        controls = `
          <div class="dob-grid" data-dob-form>
            <label class="select-field"><span>Month</span><select data-dob-month aria-label="Birth month"><option value="">Month</option>${this.monthOptions()}</select></label>
            <label class="select-field"><span>Day</span><select data-dob-day aria-label="Birth day"><option value="">Day</option>${this.numberOptions(1, 31)}</select></label>
            <label class="select-field"><span>Year</span><select data-dob-year aria-label="Birth year"><option value="">Year</option>${this.yearOptions()}</select></label>
          </div>
          <p class="form-message" data-dob-message aria-live="polite"></p>`;
      }

      return this.shell(screen, `${this.title(screen.title)}${this.description(screen.description)}${controls}`, "screen--dob");
    }

    bindDob(screen) {
      const change = this.main.querySelector("[data-change-dob]");
      if (change) change.addEventListener("click", () => {
        delete this.state.answers[screen.key];
        this.persist();
        this.render({ track: false });
      });

      const minorReturn = this.main.querySelector("[data-minor-return]");
      if (minorReturn) minorReturn.addEventListener("click", () => {
        this.complete(screen);
        this.track("ineligible_return_home");
      });

      const form = this.main.querySelector("[data-dob-form]");
      if (!form) return;

      form.querySelectorAll("select").forEach((select) => {
        select.addEventListener("change", () => this.validateDob(screen, form));
      });
    }

    validateDob(screen, form) {
      const month = Number(form.querySelector("[data-dob-month]").value);
      const day = Number(form.querySelector("[data-dob-day]").value);
      const year = Number(form.querySelector("[data-dob-year]").value);
      const message = this.main.querySelector("[data-dob-message]");
      if (!month || !day || !year) return;

      const birthDate = new Date(year, month - 1, day);
      if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day || birthDate > new Date()) {
        message.textContent = "Please choose a valid date.";
        return;
      }

      const age = this.calculateAge(birthDate);
      this.state.answers[screen.key] = {
        age: age,
        age_group: this.ageGroup(age),
        age_verified: age >= 18,
        answeredAt: new Date().toISOString()
      };
      this.persist();
      this.track("dob_selected", { age_group: this.ageGroup(age), age_verified: age >= 18 });
      this.render({ track: false });
    }

    calculateAge(date) {
      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const monthDifference = today.getMonth() - date.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) age -= 1;
      return age;
    }

    ageGroup(age) {
      if (age < 18) return "Under 18";
      if (age <= 24) return "18–24";
      if (age <= 34) return "25–34";
      if (age <= 44) return "35–44";
      if (age <= 54) return "45–54";
      if (age <= 64) return "55–64";
      return "65+";
    }

    monthOptions() {
      return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        .map((month, index) => `<option value="${index + 1}">${month}</option>`).join("");
    }

    numberOptions(start, end) {
      let output = "";
      for (let value = start; value <= end; value += 1) output += `<option value="${value}">${value}</option>`;
      return output;
    }

    yearOptions() {
      const current = new Date().getFullYear();
      let output = "";
      for (let year = current; year >= current - 100; year -= 1) output += `<option value="${year}">${year}</option>`;
      return output;
    }

    choices(screen, selected, modifier) {
      return `<div class="choice-list ${modifier || ""}" role="radiogroup" aria-label="${this.escape(screen.question || screen.title)}">
        ${(screen.options || []).map((option) => {
          const isSelected = selected === option.value;
          return `<button class="choice ${isSelected ? "is-selected" : ""}" type="button" role="radio" aria-checked="${String(isSelected)}" data-choice="${this.escape(option.value)}">
            <span class="choice__marker" aria-hidden="true"><i></i></span>
            <span class="choice__text"><strong>${this.escape(option.label)}</strong>${option.detail ? `<small>${this.escape(option.detail)}</small>` : ""}</span>
          </button>`;
        }).join("")}
      </div>`;
    }

    renderGuidedChoice(screen) {
      const answer = this.answer(screen);
      const selected = answer ? answer.value : "";
      const option = answer ? this.option(screen, selected) : null;
      const existingFeedback = option ? `
        <div class="response-card"><p>${this.escape(option.response)}</p></div>
        <aside class="insight-card"><span>${this.escape(this.config.app.insightLabel)}</span><p>${this.escape(screen.insight)}</p></aside>
        <div class="screen__actions">${this.button(this.config.app.continueLabel, "data-advance")}</div>` : `
        <div class="response-card" data-response hidden></div>
        <aside class="insight-card" data-insight hidden><span>${this.escape(this.config.app.insightLabel)}</span><p>${this.escape(screen.insight)}</p></aside>`;

      return this.shell(screen, `${this.title(screen.title)}${this.description(screen.description)}${this.choices(screen, selected)}${existingFeedback}`, "screen--choice");
    }

    renderFactsChoice(screen) {
      const answer = this.answer(screen);
      const selected = answer ? answer.value : "";
      const feedback = answer ? `
        <div class="response-card"><p>${this.escape(screen.dynamicResponse)}</p></div>
        <aside class="insight-card"><span>${this.escape(this.config.app.insightLabel)}</span><p>${this.escape(screen.insight)}</p></aside>
        <div class="screen__actions">${this.button(this.config.app.continueLabel, "data-advance")}</div>` : "";

      const facts = screen.facts.map((fact) => `<article class="fact-card"><strong>${this.escape(fact.value)}</strong><p>${this.escape(fact.label)}</p>${fact.source ? `<small>${this.escape(fact.source)}</small>` : ""}</article>`).join("");
      const body = `
        ${this.title(screen.title)}
        <p class="response-line">${this.escape(screen.response)}</p>
        <div class="fact-grid">${facts}</div>
        <h2 class="screen__question">${this.escape(screen.question)}</h2>
        ${this.choices(screen, selected)}
        ${feedback}`;
      return this.shell(screen, body, "screen--facts");
    }

    renderDiscovery(screen) {
      const answer = this.answer(screen);
      const selected = answer ? answer.value : "";
      const reveal = answer ? `
        <div class="discovery-reveal" aria-live="polite">
          <p class="discovery-reveal__pre">Interesting guess... <span>${screen.id === "09" ? "Let's see..." : "Let's look at the real number."}</span></p>
          <div class="number-reveal"><strong>${this.escape(screen.revealValue)}</strong><span>${this.escape(screen.revealLabel)}</span></div>
          <p class="source-note">${this.escape(screen.source)}</p>
          <p class="discovery-reveal__meaning">${this.escape(screen.meaning)}</p>
          ${screen.insight ? `<aside class="insight-card"><p>${this.escape(screen.insight)}</p></aside>` : ""}
          ${screen.transition ? `<p class="transition-copy">${this.escape(screen.transition)}</p>` : ""}
          <div class="screen__actions">${this.button(this.config.app.continueLabel, "data-advance")}</div>
        </div>` : "";

      const body = `
        ${screen.title ? this.title(screen.title) : ""}
        ${this.description(screen.description)}
        <h2 class="screen__question">${this.escape(screen.question)}</h2>
        ${this.choices(screen, selected, "choice-list--compact")}
        ${reveal}`;
      return this.shell(screen, body, "screen--discovery");
    }

    renderBigPicture(screen) {
      const city = `<div class="city-visual" aria-hidden="true">
        <span class="city-visual__moon"></span><i class="building b1"></i><i class="building b2"></i><i class="building b3"></i><i class="building b4"></i><i class="building b5"></i><span class="city-visual__road"></span>
      </div>`;
      const body = `${city}<div class="big-message">${this.title(screen.title)}<p>${this.escape(screen.secondTitle)}</p></div><div class="screen__actions">${this.button(screen.action, "data-advance")}</div>`;
      return this.shell(screen, body, "screen--big-picture");
    }

    renderConfidence(screen) {
      const answer = this.answer(screen);
      const selected = answer ? answer.value : "";
      const reveal = answer ? `
        <div class="confidence-reveal">
          <p class="reveal-pre">Interesting perspective...</p>
          <p>${this.escape(screen.revealIntro)}</p>
          <div class="tool-visual" aria-hidden="true"><span></span></div>
          <h2>${this.escape(screen.revealTitle)}</h2>
          <p>${this.escape(screen.revealSupporting)}</p>
          <aside class="insight-card"><p>${this.escape(screen.insight)}</p></aside>
          <p class="closing-whisper">${this.escape(screen.closing)}</p>
          <div class="screen__actions">${this.button(this.config.app.continueLabel, "data-advance")}</div>
        </div>` : "";
      const body = `${this.title(screen.title)}<h2 class="screen__question">${this.escape(screen.question)}</h2>${this.description(screen.description)}${this.choices(screen, selected)}${reveal}`;
      return this.shell(screen, body, "screen--confidence");
    }

    renderModernLearning(screen) {
      const answer = this.answer(screen);
      const selected = answer ? answer.value : "";
      const reveal = answer ? `
        <div class="modern-reveal">
          <p class="reveal-pre">Interesting perspective...</p>
          <h2>${this.escape(screen.revealTitle)}</h2>
          <div class="era-visual" aria-hidden="true"><div><span class="vhs"></span></div><i></i><div><span class="phone"></span></div></div>
          <ul class="change-list">${screen.changes.map((item) => `<li>${this.escape(item)}</li>`).join("")}</ul>
          <strong class="future-statement">${this.escape(screen.future)}</strong>
          <aside class="insight-card"><p>${this.escape(screen.insight)}</p></aside>
          <p class="closing-whisper">${this.escape(screen.caption)}</p>
          <div class="screen__actions">${this.button(this.config.app.continueLabel, "data-advance")}</div>
        </div>` : "";
      return this.shell(screen, `${this.title(screen.title)}${this.description(screen.description)}${this.choices(screen, selected)}${reveal}`, "screen--modern");
    }

    renderMeaning(screen) {
      const answer = this.answer(screen);
      const selected = answer ? answer.value : "";
      const reveal = answer ? `
        <div class="meaning-reveal">
          <h2>${this.escape(screen.reveal)}</h2>
          <p class="meaning-reveal__closing">${this.escape(screen.closing)}</p>
          <aside class="insight-card"><p>${this.escape(screen.insight)}</p></aside>
          <div class="screen__actions">${this.button(this.config.app.continueLabel, "data-advance")}</div>
        </div>` : "";
      const body = `<div class="family-visual" aria-hidden="true"><span></span><i></i><b></b></div>${this.title(screen.title)}${this.description(screen.description)}<h2 class="screen__question">${this.escape(screen.question)}</h2>${this.choices(screen, selected, "choice-list--compact")}${reveal}`;
      return this.shell(screen, body, "screen--meaning");
    }

    renderRoadmapSetup(screen) {
      const answer = this.answer(screen);
      const selected = answer ? answer.value : "";
      const cards = screen.dataCards.map((card) => `<article class="data-card">${this.icon(card.icon)}<div><strong>${this.escape(card.label)}</strong>${card.lines.map((line) => `<span>${this.escape(line)}</span>`).join("")}</div></article>`).join("");
      const body = `
        <div class="roadmap-lock" aria-hidden="true"><span></span><i></i></div>
        ${this.title(screen.title)}
        ${this.description(screen.description)}
        <div class="data-grid">${cards}</div>
        <h2 class="screen__question">${this.escape(screen.question)}</h2>
        ${this.choices(screen, selected, "choice-list--paths")}
        <div class="screen__actions">${this.button(screen.action, `data-build-roadmap ${answer ? "" : "disabled aria-disabled=\"true\""}`, "primary-button--wide")}</div>`;
      return this.shell(screen, body, "screen--roadmap-setup");
    }

    renderRoadmap(screen) {
      if (!this.state.roadmapRevealed) {
        const steps = screen.loadingSteps.map((step, index) => `<li data-loading-step="${index}"><span aria-hidden="true">✓</span>${this.escape(step)}</li>`).join("");
        return this.shell(screen, `<div class="roadmap-loader"><div class="loader-orbit" aria-hidden="true"><span></span></div>${this.title(screen.title)}<ul>${steps}</ul></div>`, "screen--roadmap screen--loading");
      }

      const roadmap = this.buildRoadmap();
      const basis = screen.basis.map((item) => `<li><span aria-hidden="true">✓</span>${this.escape(item)}</li>`).join("");
      const anchors = `<div class="market-anchors"><div><strong>145M+</strong><span>housing units</span></div><div><strong>289M+</strong><span>registered vehicles</span></div><div><strong>≈18,000</strong><span>U.S. locksmiths</span></div></div>`;
      const body = `
        <div class="roadmap-heading"><p>${this.escape(roadmap.path.label)} · ${this.escape(roadmap.path.hours)}</p>${this.title(screen.revealTitle)}</div>
        ${this.roadmapChart(roadmap.values)}
        <p class="chart-caption">Estimated monthly gross service revenue · $${this.escape(String(this.config.roadmap.averageServiceValue))} average service value</p>
        ${anchors}
        <div class="roadmap-basis"><h2>Based on your answers</h2><ul>${basis}</ul></div>
        <div class="roadmap-notes"><p><strong>${this.escape(screen.averageNote)}</strong></p><p>${this.escape(screen.beyondNote)}</p><p class="legal-note">${this.escape(screen.disclaimer)}</p></div>
        <p class="roadmap-closing">${this.escape(screen.closing)}</p>
        <div class="screen__actions">${this.button(screen.action, "data-advance")}</div>`;
      return this.shell(screen, body, "screen--roadmap screen--roadmap-result");
    }

    beginRoadmapReveal(screen) {
      const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const stepDelay = reducedMotion ? 80 : 520;
      screen.loadingSteps.forEach((step, index) => {
        this.later(() => {
          const item = this.main.querySelector(`[data-loading-step="${index}"]`);
          if (item) item.classList.add("is-done");
        }, stepDelay * (index + 1));
      });

      this.later(() => {
        this.state.roadmapRevealed = true;
        this.persist();
        this.track("roadmap_revealed", { work_path: this.answer(this.config.screens[16]).value });
        this.render({ track: false });
      }, stepDelay * (screen.loadingSteps.length + 1));
    }

    buildRoadmap() {
      const setup = this.config.screens[16];
      const answer = this.answer(setup);
      const key = answer && this.config.roadmap.paths[answer.value] ? answer.value : "balanced";
      const path = this.config.roadmap.paths[key];
      const values = path.monthlyCalls.map((calls) => calls * this.config.roadmap.averageServiceValue);
      return { path: path, values: values };
    }

    roadmapChart(values) {
      const width = 720;
      const height = 300;
      const left = 64;
      const right = 28;
      const top = 30;
      const bottom = 54;
      const chartWidth = width - left - right;
      const chartHeight = height - top - bottom;
      const max = Math.max.apply(null, values) * 1.12;
      const points = values.map((value, index) => {
        const x = left + (index / (values.length - 1)) * chartWidth;
        const y = top + chartHeight - (value / max) * chartHeight;
        return { x: x, y: y, value: value, month: index + 1 };
      });
      const path = points.map((point, index) => (index === 0 ? "M" : "L") + point.x.toFixed(1) + " " + point.y.toFixed(1)).join(" ");
      const area = `${path} L ${points[points.length - 1].x.toFixed(1)} ${top + chartHeight} L ${left} ${top + chartHeight} Z`;
      const markers = [3, 7, 11].map((index) => {
        const point = points[index];
        return `<g class="chart-marker"><line x1="${point.x}" y1="${point.y}" x2="${point.x}" y2="${top + chartHeight}"/><circle cx="${point.x}" cy="${point.y}" r="7"/><text class="chart-value" x="${point.x}" y="${point.y - 18}" text-anchor="middle">${this.escape(this.money(point.value))}/mo</text><text class="chart-month" x="${point.x}" y="${height - 18}" text-anchor="middle">Month ${point.month}</text></g>`;
      }).join("");
      const grid = [0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = top + chartHeight - ratio * chartHeight;
        return `<line class="chart-gridline" x1="${left}" x2="${width - right}" y1="${y}" y2="${y}"/>`;
      }).join("");

      return `<div class="roadmap-chart" role="img" aria-label="Estimated 12-month income trajectory with values at months 4, 8 and 12">
        <svg viewBox="0 0 ${width} ${height}" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <defs><linearGradient id="roadmapArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a84f" stop-opacity=".34"/><stop offset="1" stop-color="#c9a84f" stop-opacity="0"/></linearGradient></defs>
          ${grid}<path class="chart-area" d="${area}"/><path class="chart-line" d="${path}"/>${markers}
        </svg>
        <div class="chart-mobile-values">${[3, 7, 11].map((index) => `<div><span>Month ${index + 1}</span><strong>${this.escape(this.money(values[index]))}/mo</strong></div>`).join("")}</div>
      </div>`;
    }

    money(value) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
    }

    renderBrandReveal(screen) {
      const visual = `<div class="future-collage" aria-hidden="true"><span class="future-card certificate">✓</span><span class="future-card car-key"></span><span class="future-card family"></span><span class="future-card boarding"></span><span class="future-card house-key"></span></div>`;
      const body = `${visual}${this.title(screen.title)}<h2 class="screen__title screen__title--second">${this.escape(screen.secondTitle)}</h2>${this.description(screen.description)}<div class="brand-promise"><strong>NALA</strong><p>${this.escape(screen.support)}</p></div><p class="ready-line">${this.escape(screen.transition)}</p><div class="screen__actions">${this.button(screen.action, "data-advance")}</div>`;
      return this.shell(screen, body, "screen--brand-reveal");
    }

    renderFinal(screen) {
      const included = screen.included.map((item) => `<li><span aria-hidden="true">✓</span>${this.escape(item)}</li>`).join("");
      const assurances = screen.assurances.map((item) => `<li>${this.escape(item)}</li>`).join("");
      const body = `
        <div class="final-key" aria-hidden="true"><span></span></div>
        ${this.title(screen.title)}
        ${this.description(screen.description)}
        <div class="final-divider"><span></span><strong>${this.escape(screen.roadmapReady)}</strong><span></span></div>
        <ul class="included-list">${included}</ul>
        <div class="screen__actions">${this.button(screen.action, "data-final-cta", "primary-button--final")}</div>
        <p class="final-closing">${this.escape(screen.closing)}</p>
        <ul class="assurances">${assurances}</ul>`;
      return this.shell(screen, body, "screen--final");
    }

    icon(name) {
      const icons = {
        vehicle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 16-1 2v2h2l1-2h10l1 2h2v-2l-1-2-2-7H7l-2 7Z"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>',
        home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-7 9 7v9h-6v-6H9v6H3v-9Z"/></svg>',
        chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></svg>',
        clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
      };
      return `<span class="data-card__icon">${icons[name] || icons.chart}</span>`;
    }

    escape(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }

  function boot() {
    const root = document.querySelector("[data-advisor]");
    if (!root || !window.NALA_V4_CONFIG || root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";
    window.nalaCareerAdvisor = new NalaCareerAdvisor(root, window.NALA_V4_CONFIG);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
}());
