(function () {
  const API_BASE = "../api";
  const app = document.querySelector("[data-app]");

  const state = {
    config: null,
    current: -1,
    answers: {},
    showingInsight: false,
    result: null,
    submitting: false,
    saved: false,
    error: ""
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function scoreLabel(type, key) {
    const item = ((state.config.scoreKeys || {})[type] || []).find((entry) => entry.key === key);
    return item ? item.label : key;
  }

  async function api(path, options) {
    const response = await fetch(`${API_BASE}/${path}`, Object.assign({
      headers: { "Content-Type": "application/json" }
    }, options || {}));
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
      throw new Error(payload.error || "The enrollment engine is unavailable.");
    }
    return payload;
  }

  function shell(content) {
    const total = state.config ? state.config.questions.length : 1;
    const progress = state.current < 0 ? 0 : Math.round(((state.current + 1) / total) * 100);
    app.innerHTML = `
      <div class="topbar">
        <button class="icon-button" type="button" data-back aria-label="Go back" ${state.current <= -1 ? "disabled" : ""}>&lt;</button>
        <div class="brand"><img class="brand-logo" src="assets/nala-logo-black.png" alt="NALA"></div>
        <span></span>
      </div>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}">
        <div class="progress__bar" style="width:${progress}%"></div>
      </div>
      ${content}
    `;
    const back = app.querySelector("[data-back]");
    if (back) {
      back.addEventListener("click", previous);
    }
  }

  function renderIntro() {
    const questionCount = state.config.questions.length;
    shell(`
      <section class="app-card">
        <p class="eyebrow">${escapeHtml(state.config.app.title || "Enrollment Path Builder")}</p>
        <h1>Find your NALA enrollment path.</h1>
        <p class="lead">Answer ${questionCount} source-driven questions. NALA will assemble a blueprint, overlays, messaging theme, and next step from the scoring matrix and output text library.</p>
        <div class="actions">
          <button class="button button--primary" type="button" data-start>Start</button>
        </div>
        <p class="notice">${escapeHtml(state.config.app.disclaimer || "")}</p>
      </section>
    `);
    app.querySelector("[data-start]").addEventListener("click", () => {
      state.current = 0;
      renderQuestion();
    });
  }

  function renderQuestion() {
    const question = state.config.questions[state.current];
    const selected = state.answers[question.id];
    state.showingInsight = false;
    shell(`
      <section class="app-card">
        <p class="eyebrow">Question ${state.current + 1} of ${state.config.questions.length}</p>
        <h1>${escapeHtml(question.title)}</h1>
        ${question.description ? `<p class="lead">${escapeHtml(question.description)}</p>` : ""}
        <div class="choice-list" role="radiogroup" aria-label="${escapeHtml(question.title)}">
          ${(question.options || []).map((option) => `
            <button class="choice ${selected === option.id ? "is-selected" : ""}" type="button" data-answer="${escapeHtml(option.id)}" role="radio" aria-checked="${selected === option.id ? "true" : "false"}">
              <span>${escapeHtml(option.label)}</span>
              <span class="choice__mark" aria-hidden="true">${selected === option.id ? "✓" : ""}</span>
            </button>
          `).join("")}
        </div>
        <div class="actions">
          <button class="button button--primary" type="button" data-next ${selected ? "" : "disabled"}>${state.current === state.config.questions.length - 1 ? "See Result" : "Continue"}</button>
        </div>
      </section>
    `);
    app.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        state.answers[question.id] = button.dataset.answer;
        renderQuestion();
      });
    });
    app.querySelector("[data-next]").addEventListener("click", next);
  }

  async function next() {
    if (!state.showingInsight) {
      renderInsight();
      return;
    }

    state.showingInsight = false;
    if (state.current < state.config.questions.length - 1) {
      state.current += 1;
      renderQuestion();
      return;
    }
    await score();
  }

  function previous() {
    state.error = "";
    if (state.showingInsight) {
      state.showingInsight = false;
      renderQuestion();
      return;
    }

    if (state.result) {
      state.result = null;
      state.current = state.config.questions.length - 1;
      renderQuestion();
      return;
    }
    if (state.current > 0) {
      state.current -= 1;
      renderQuestion();
      return;
    }
    state.current = -1;
    renderIntro();
  }

  function renderInsight() {
    const question = state.config.questions[state.current];
    const option = selectedOption(question);

    if (!option) {
      renderQuestion();
      return;
    }

    state.showingInsight = true;
    const insight = buildChoiceInsight(question, option);
    const isLast = state.current === state.config.questions.length - 1;

    shell(`
      <section class="app-card app-card--insight">
        <p class="eyebrow">Why your answer matters</p>
        <h1>${escapeHtml(insight.title)}</h1>
        <p class="lead">${escapeHtml(insight.lead)}</p>
        <div class="insight-panel">
          <p>${escapeHtml(insight.body)}</p>
          <ul class="insight-list">
            ${insight.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
          </ul>
        </div>
        <p class="notice">${escapeHtml(insight.guardrail)}</p>
        <div class="actions">
          <button class="button button--primary" type="button" data-next>${isLast ? "See Result" : "Next Question"}</button>
        </div>
      </section>
    `);
    app.querySelector("[data-next]").addEventListener("click", next);
  }

  function selectedOption(question) {
    const selected = state.answers[question.id];
    return (question.options || []).find((option) => option.id === selected);
  }

  function buildChoiceInsight(question, option) {
    const label = option.label || "your answer";
    const text = `${question.title || ""} ${label}`.toLowerCase();
    const scores = option.scores || {};
    const points = [];

    if (text.includes("retired") || text.includes("55") || text.includes("older") || text.includes("senior")) {
      points.push("A calm, mature presence can be an advantage in a trust-based service, because customers often need help at homes, vehicles, or businesses.");
      points.push("Locksmithing is hands-on, but many starter services are more about precision, patience, and problem solving than brute strength.");
      points.push("You can aim for a practical service mix and pace: rekeys, lock changes, key support, and scheduled work before heavier safe or door-hardware jobs.");
    } else if (text.includes("student") || text.includes("young") || text.includes("18")) {
      points.push("Starting early gives you time to build skill, judgment, and customer confidence before you need the trade to carry your full income.");
      points.push("Locksmithing rewards repetition: keys, cylinders, door hardware, and customer scenarios become easier as you practice.");
    } else if (text.includes("full-time") || text.includes("time") || text.includes("schedule")) {
      points.push("A current job or limited schedule does not block the path; the first step is structured study and practice, not immediately taking calls.");
      points.push("Many locksmith paths can begin part-time, especially when you focus on fundamentals before offering services.");
    } else if (text.includes("between jobs") || text.includes("new career") || text.includes("fresh") || text.includes("change")) {
      points.push("This can be a practical transition because the work connects training to visible skills: keys, locks, door hardware, safes, vehicles, and access systems.");
      points.push("A clear training sequence can turn a broad career-change feeling into smaller, concrete milestones.");
    } else if (text.includes("money") || text.includes("income")) {
      points.push("Locksmithing solves urgent local problems, which is why service value can be meaningful when the skill, market, and customer acquisition are real.");
      points.push("The better frame is not guaranteed income; it is building a useful skill that can support paid service opportunities over time.");
    } else if (text.includes("business") || text.includes("self-employed") || text.includes("own")) {
      points.push("Locksmithing can fit an ownership mindset because local service work depends on trust, responsiveness, repeat customers, and reputation.");
      points.push("You can begin with the technical core, then add business systems such as pricing, scheduling, reviews, and follow-up.");
    } else if (text.includes("helping") || text.includes("people")) {
      points.push("The trade has a real service element: customers may be locked out, worried about security, or trying to solve a practical problem quickly.");
      points.push("Patience and clear communication can matter as much as the tool work, especially when people are stressed.");
    }

    if ((scores.BUSINESS || 0) >= 3) {
      points.push("Your answer also points toward independence, so the business-owner path may deserve extra attention.");
    }
    if ((scores.CAREER_CHANGE || 0) >= 3) {
      points.push("This answer is a strong career-change signal: it suggests you may want a practical skill with a clearer next chapter.");
    }
    if ((scores.SIDE_INCOME || 0) >= 3) {
      points.push("This answer fits a side-income path, where you learn steadily while keeping your current life stable.");
    }
    if ((scores.EMPLOYMENT || 0) >= 3) {
      points.push("This answer also fits an employment-oriented route, where certification, reliability, and supervised experience can matter.");
    }

    if (option.rationale) {
      points.push(option.rationale);
    }

    const uniquePoints = Array.from(new Set(points)).slice(0, 5);
    const lead = `${escapeLabel(label)} can fit locksmithing because this trade combines customer trust, technical skill, and practical local problem-solving.`;
    const body = option.uiCopyEffect
      ? option.uiCopyEffect
      : "NALA uses this answer to tune the blueprint, pace, and messaging you see at the end.";

    return {
      title: `${escapeLabel(label)} can be a real advantage.`,
      lead,
      body,
      points: uniquePoints.length ? uniquePoints : [
        "Locksmithing includes learnable fundamentals such as keys, cylinders, locks, door hardware, safes, vehicles, and access systems.",
        "The strongest path is usually the one that matches your schedule, confidence, market, and reason for starting."
      ],
      guardrail: "Important: requirements vary by state and locality, and some locksmith work is physically demanding. The goal is to match you with a realistic starting path, not to promise an outcome."
    };
  }

  function escapeLabel(value) {
    const label = String(value || "That answer").trim();
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  async function score() {
    shell(`
      <section class="app-card app-card--loading">
        <p class="eyebrow">Scoring</p>
        <h1>Building your result...</h1>
      </section>
    `);
    try {
      const payload = await api("nala_enrollment_score.php", {
        method: "POST",
        body: JSON.stringify({ answers: state.answers })
      });
      state.result = payload.result;
      renderResult();
    } catch (error) {
      state.error = error.message;
      renderQuestion();
    }
  }

  function renderResult() {
    const result = state.result;
    const assembly = result.assembly || {};
    const overlayBadges = (result.overlays || []).map((overlay) => overlay.badge || overlay.name).filter(Boolean);
    const blueprintScores = ((state.config.scoreKeys || {}).blueprints || []).map((entry) => [entry.label, result.scores[entry.key] || 0]);
    const themeScores = ((state.config.scoreKeys || {}).themes || []).map((entry) => [entry.label, result.scores[entry.key] || 0]);

    shell(`
      <section class="app-card">
        <p class="eyebrow">Your Result</p>
        <h1>${escapeHtml(assembly.title)}</h1>
        <p class="lead">${escapeHtml(assembly.subtitle)}</p>
        <div class="badges">
          <span class="badge">${escapeHtml(result.theme.name || scoreLabel("themes", result.themeKey))}</span>
          ${overlayBadges.map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`).join("")}
        </div>
        <div class="result-grid">
          ${block("Why This Blueprint", assembly.why)}
          ${block("Theme Effect", assembly.themeEffect)}
          ${block("Study Pace", assembly.studyPace)}
          ${block("Timeline", assembly.timeline)}
          ${block("Revenue Potential", assembly.revenuePotential)}
          ${block("Next Milestone", assembly.nextMilestone)}
          ${block("Overlay Effects", (assembly.overlayEffects || []).join(" "))}
          ${block("Next Step", `<strong>${escapeHtml(assembly.ctaButton)}</strong><br>${escapeHtml(assembly.ctaHelperText)}`, true)}
        </div>
        <div class="result-grid">
          ${scoreTable("Blueprint Scores", blueprintScores)}
          ${scoreTable("Theme Scores", themeScores)}
        </div>
        <form class="lead-form" data-lead-form>
          <h2>Save this enrollment result</h2>
          <label class="field"><span>Name</span><input name="name" autocomplete="name"></label>
          <label class="field"><span>Email</span><input name="email" type="email" autocomplete="email"></label>
          <label class="field"><span>Phone</span><input name="phone" autocomplete="tel"></label>
          <div class="actions">
            <button class="button" type="button" data-restart>Start Over</button>
            <button class="button button--primary" type="submit">${state.saved ? "Saved" : "Save Result"}</button>
          </div>
          ${state.error ? `<p class="notice error">${escapeHtml(state.error)}</p>` : ""}
          ${state.saved ? `<p class="notice">Saved to the staging enrollment database.</p>` : ""}
          <p class="notice">${escapeHtml(state.config.app.disclaimer || "")}</p>
        </form>
      </section>
    `);

    app.querySelector("[data-restart]").addEventListener("click", restart);
    app.querySelector("[data-lead-form]").addEventListener("submit", submitResult);
  }

  function block(title, body, raw) {
    if (!body) {
      body = "This section is available for this blueprint when configured in the source text library.";
    }
    return `
      <article class="result-block">
        <h2>${escapeHtml(title)}</h2>
        <p>${raw ? body : escapeHtml(body)}</p>
      </article>
    `;
  }

  function scoreTable(title, rows) {
    return `
      <article class="result-block">
        <h2>${escapeHtml(title)}</h2>
        <table class="score-table">
          <thead><tr><th>Signal</th><th>Score</th></tr></thead>
          <tbody>${rows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`).join("")}</tbody>
        </table>
      </article>
    `;
  }

  async function submitResult(event) {
    event.preventDefault();
    if (state.submitting) {
      return;
    }
    state.submitting = true;
    state.error = "";
    const form = event.currentTarget;
    const profile = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim()
    };
    try {
      await api("nala_enrollment_submit.php", {
        method: "POST",
        body: JSON.stringify({ profile, answers: state.answers })
      });
      state.saved = true;
    } catch (error) {
      state.error = error.message;
    } finally {
      state.submitting = false;
      renderResult();
    }
  }

  function restart() {
    state.current = -1;
    state.answers = {};
    state.showingInsight = false;
    state.result = null;
    state.saved = false;
    state.error = "";
    renderIntro();
  }

  async function init() {
    try {
      const payload = await api("nala_enrollment_config.php");
      state.config = payload;
      renderIntro();
    } catch (error) {
      app.innerHTML = `
        <section class="app-card app-card--loading">
          <p class="eyebrow">NALA</p>
          <h1>Enrollment engine unavailable.</h1>
          <p class="lead error">${escapeHtml(error.message)}</p>
        </section>
      `;
    }
  }

  init();
})();
