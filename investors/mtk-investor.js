class MtkInvestor {
  constructor(root, config) {
    this.root = root;
    this.config = config;
    this.onMessage = this.onMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  init() {
    if (!this.root || !this.config) {
      return;
    }

    this.render();
    this.bindEvents();
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("resize", this.handleResize, { passive: true });
    this.handleScroll();
    this.subscribe();
  }

  render() {
    this.renderHeader();
    this.renderHero();
    this.renderOverview();
    this.renderMetrics();
    this.renderPrinciples();
    this.renderStrategy();
    this.renderHighlights();
    this.renderUpdates();
    this.renderClosing();
    this.renderLatestNews();
    this.renderFooter();
    this.renderToTop();
    this.setActiveNavigation("overview");
    this.applyAccessibilityLabels();
    this.closeMobileMenus();
  }


  renderHeader() {
    this.renderChrome(this.getRegion("header"), false);
  }

  renderChrome(region, isFooter = false) {
    const { brand, mobileMenu } = this.config;
    const navigationClass = isFooter ? "mtk-investor__footer-nav" : "mtk-investor__nav";
    const navButtonClass = isFooter ? "mtk-investor__footer-nav-button" : "mtk-investor__nav-button";
    const toggleAction = isFooter ? "toggle-footer-menu" : "toggle-menu";
    const navRegion = isFooter ? "" : ' data-region="navigation"';
    const navLabel = isFooter ? "Investor footer navigation" : this.config.accessibility.navigationLabel;

    region.innerHTML = `
      <div class="container">
        <div class="mtk-investor__chrome-inner">
          <div class="mtk-investor__mobile-toggle">
            <button
              class="mtk-investor__menu-toggle"
              type="button"
              data-event="${this.config.events.publish.nav}"
              data-action="${toggleAction}"
              aria-expanded="false"
              aria-label="${this.escapeAttribute(mobileMenu.openLabel)}"
            >
              <span class="mtk-investor__menu-toggle-icon" aria-hidden="true">${this.iconSvg(mobileMenu.iconOpen)}</span>
            </button>
          </div>
          <button
            class="mtk-investor__brand"
            type="button"
            data-event="${this.config.events.publish.nav}"
            data-action="brand-home"
            data-target="overview"
            aria-label="${this.escapeAttribute(`${brand.name} ${brand.eyebrow}`)}"
          >
            <img
              class="mtk-investor__logo"
              src="${this.escapeAttribute(brand.logo)}"
              alt="${this.escapeAttribute(brand.logoAlt)}"
            >
          </button>
          <nav class="${navigationClass}"${navRegion} aria-label="${this.escapeAttribute(navLabel)}">
            ${this.config.navigation.map((item) => `
              <button
                class="${navButtonClass}"
                type="button"
                data-event="${this.config.events.publish.nav}"
                data-action="${item.type === "email" ? "email" : "navigate"}"
                data-target="${this.escapeAttribute(item.target)}"
              >
                ${item.icon ? `<span class="mtk-investor__nav-icon" aria-hidden="true">${this.iconSvg(item.icon)}</span>` : ""}
                <span>${this.escapeHtml(item.label)}</span>
              </button>
            `).join("")}
          </nav>
        </div>
      </div>
    `;
  }

  renderMobileToggle() {
    const region = this.getRegion("header-toggle");
    const menu = this.config.mobileMenu;

    if (!region || !menu) {
      return;
    }

    region.innerHTML = `
      <button
        class="mtk-investor__menu-toggle"
        type="button"
        data-event="${this.config.events.publish.nav}"
        data-action="toggle-menu"
        aria-expanded="false"
        aria-label="${this.escapeAttribute(menu.openLabel)}"
      >
        <span class="mtk-investor__menu-toggle-icon" aria-hidden="true">${this.iconSvg(menu.iconOpen)}</span>
      </button>
    `;
  }

  renderBrand() {
    const region = this.getRegion("brand");
    const { brand } = this.config;

    region.innerHTML = `
      <button
        class="mtk-investor__brand"
        type="button"
        data-event="${this.config.events.publish.nav}"
        data-action="brand-home"
        data-target="overview"
        aria-label="${this.escapeAttribute(`${brand.name} ${brand.eyebrow}`)}"
      >
        <img
          class="mtk-investor__logo"
          src="${this.escapeAttribute(brand.logo)}"
          alt="${this.escapeAttribute(brand.logoAlt)}"
        >
      </button>
    `;
  }

  renderNavigation() {
    const region = this.getRegion("navigation");
    region.innerHTML = this.config.navigation.map((item) => `
      <button
        class="mtk-investor__nav-button"
        type="button"
        data-event="${this.config.events.publish.nav}"
        data-action="navigate"
        data-target="${this.escapeAttribute(item.target)}"
      >
        ${item.icon ? `<span class="mtk-investor__nav-icon" aria-hidden="true">${this.iconSvg(item.icon)}</span>` : ""}
                <span>${this.escapeHtml(item.label)}</span>
      </button>
    `).join("");
  }

  renderHero() {
    const region = this.getRegion("hero");
    const { hero, metrics } = this.config;
    const leadMetric = metrics[0];

    region.innerHTML = `
      <div class="container">
        <div class="mtk-investor__hero-inner row align-items-center g-5">
          <div class="col-12 col-lg-8">
            <p class="mtk-investor__eyebrow">${this.escapeHtml(hero.kicker)}</p>
            <h1 class="mtk-investor__hero-title">${this.escapeHtml(hero.title)}</h1>
            <p class="mtk-investor__hero-summary">${this.escapeHtml(hero.summary)}</p>
            <div class="mtk-investor__actions">
              ${this.renderActionButton(hero.primaryAction, "primary")}
              ${this.renderActionButton(hero.secondaryAction, "secondary")}
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <aside class="mtk-investor__hero-panel" aria-label="${this.escapeAttribute(leadMetric.label)}">
              <p class="mtk-investor__hero-panel-label">${this.escapeHtml(leadMetric.label)}</p>
              <p class="mtk-investor__hero-panel-value">${this.escapeHtml(leadMetric.value)}</p>
              <p class="mtk-investor__hero-panel-copy">${this.escapeHtml(leadMetric.detail)}</p>
            </aside>
          </div>
        </div>
      </div>
    `;
  }

  renderOverview() {
    const region = this.getRegion("overview");
    const { overview } = this.config;

    region.innerHTML = `
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-9">
            <p class="mtk-investor__eyebrow">${this.escapeHtml(overview.eyebrow)}</p>
            <h2 class="mtk-investor__section-title">${this.escapeHtml(overview.title)}</h2>
            <p class="mtk-investor__section-copy">${this.escapeHtml(overview.body)}</p>
          </div>
        </div>
      </div>
    `;
  }

  renderMetrics() {
    const region = this.getRegion("metrics");

    region.innerHTML = `
      <div class="container">
        <div class="row g-4 mtk-investor__metric-grid">
          ${this.config.metrics.map((metric) => `
            <div class="col-12 col-sm-6 col-xl-3">
              <button
                class="mtk-investor__metric"
                type="button"
                data-event="${this.escapeAttribute(metric.event)}"
                data-action="${this.escapeAttribute(metric.action)}"
                aria-label="${this.escapeAttribute(`${metric.label}: ${metric.value}`)}"
              >
                <span class="mtk-investor__metric-icon" aria-hidden="true">
                  <span class="mtk-investor__material-icon">${this.iconSvg(metric.icon)}</span>
                </span>
                <span class="mtk-investor__metric-value">${this.escapeHtml(metric.value)}</span>
                <span class="mtk-investor__metric-label">${this.escapeHtml(metric.label)}</span>
                <span class="mtk-investor__metric-detail">${this.escapeHtml(metric.detail)}</span>
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderPrinciples() {
    const region = this.getRegion("principles");
    const { principles } = this.config;

    region.innerHTML = `
      <div class="container">
        <div class="row g-0 mtk-investor__principles-grid">
          ${principles.items.map((item) => `
            <article class="col-12 col-md-6 col-xl-3 mtk-investor__principle">
              <span class="mtk-investor__principle-icon" aria-hidden="true">
                <span class="mtk-investor__material-icon">${this.iconSvg(item.icon)}</span>
              </span>
              <div class="mtk-investor__principle-content">
                <h2 class="mtk-investor__principle-title">${this.escapeHtml(item.title)}</h2>
                <p class="mtk-investor__principle-copy">${this.escapeHtml(item.text)}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderStrategy() {
    const region = this.getRegion("strategy");
    const { strategy } = this.config;

    region.innerHTML = `
      <div class="container">
        <p class="mtk-investor__eyebrow">${this.escapeHtml(strategy.eyebrow)}</p>
        <h2 class="mtk-investor__section-title">${this.escapeHtml(strategy.title)}</h2>
        <div class="row g-4 mtk-investor__strategy-grid">
          ${strategy.items.map((item) => `
            <article class="col-12 col-md-6 col-xl-3">
              <div class="mtk-investor__strategy-item">
                <span class="mtk-investor__strategy-number">${this.escapeHtml(item.number)}</span>
                <span class="mtk-investor__strategy-icon" aria-hidden="true">
                  <span class="mtk-investor__material-icon">${this.iconSvg(item.icon)}</span>
                </span>
                <h3 class="mtk-investor__strategy-title">${this.escapeHtml(item.title)}</h3>
                <p class="mtk-investor__strategy-copy">${this.escapeHtml(item.text)}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderHighlights() {
    const region = this.getRegion("highlights");
    const { highlights } = this.config;

    region.innerHTML = `
      <div class="container">
        <div class="row align-items-start g-5">
          <div class="col-12 col-lg-7">
            <p class="mtk-investor__eyebrow">${this.escapeHtml(highlights.eyebrow)}</p>
            <h2 class="mtk-investor__section-title">${this.escapeHtml(highlights.title)}</h2>
            <p class="mtk-investor__section-copy">${this.escapeHtml(highlights.body)}</p>
          </div>
          <div class="col-12 col-lg-5">
            <ul class="mtk-investor__highlight-list">
              ${highlights.points.map((point) => `
                <li class="mtk-investor__highlight-item">
                  <span class="mtk-investor__material-icon" aria-hidden="true">${this.iconSvg(point.icon)}</span>
                  <span>${this.escapeHtml(point.text)}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  renderUpdates() {
    const region = this.getRegion("updates");
    const { updates } = this.config;

    region.innerHTML = `
      <div class="container">
        <p class="mtk-investor__eyebrow">${this.escapeHtml(updates.eyebrow)}</p>
        <h2 class="mtk-investor__section-title">${this.escapeHtml(updates.title)}</h2>
        <div class="row g-4 mtk-investor__updates-grid">
          ${updates.items.map((item) => `
            <article class="col-12 col-md-6 col-xl-4">
              <button
                class="mtk-investor__update-card"
                type="button"
                data-event="${this.escapeAttribute(item.event)}"
                data-action="${this.escapeAttribute(item.action)}"
                ${item.href ? `data-href="${this.escapeAttribute(item.href)}"` : ""}
              >
                <span class="mtk-investor__update-top">
                  <span class="mtk-investor__update-date">${this.escapeHtml(item.date)}</span>
                  <span class="mtk-investor__material-icon" aria-hidden="true">${this.iconSvg(item.icon)}</span>
                </span>
                <span class="mtk-investor__update-title">${this.escapeHtml(item.title)}</span>
                <span class="mtk-investor__update-copy">${this.escapeHtml(item.description)}</span>
                <span class="mtk-investor__update-arrow" aria-hidden="true">
                  <span class="mtk-investor__material-icon">${this.iconSvg("arrow_forward")}</span>
                </span>
              </button>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderClosing() {
    const region = this.getRegion("closing");
    const { closing } = this.config;

    region.innerHTML = `
      <div class="container">
        <div class="row align-items-end g-4">
          <div class="col-12 col-lg-8">
            <p class="mtk-investor__eyebrow">${this.escapeHtml(closing.eyebrow)}</p>
            <h2 class="mtk-investor__section-title">${this.escapeHtml(closing.title)}</h2>
            <p class="mtk-investor__section-copy">${this.escapeHtml(closing.body)}</p>
          </div>
          <div class="col-12 col-lg-4 d-lg-flex justify-content-lg-end">
            ${this.renderActionButton(closing.action, "primary")}
          </div>
        </div>
      </div>
    `;
  }


  renderLatestNews() {
    const region = this.getRegion("latest-news");
    const news = this.config.latestNews;

    if (!region || !news) {
      return;
    }

    region.innerHTML = `
      <div class="container">
        <div class="mtk-investor__latest-news-heading">
          <h2 class="mtk-investor__latest-news-title">${this.escapeHtml(news.title)}</h2>
          <button
            class="mtk-investor__latest-news-view-all"
            type="button"
            data-event="${this.escapeAttribute(news.event)}"
            data-action="${this.escapeAttribute(news.action)}"
            ${news.href ? `data-href="${this.escapeAttribute(news.href)}"` : ""}
          >
            <span>${this.escapeHtml(news.viewAllLabel)}</span>
            <span class="mtk-investor__latest-news-view-all-icon" aria-hidden="true">${this.iconSvg(news.viewAllIcon)}</span>
          </button>
        </div>

        <div class="mtk-investor__latest-news-grid">
          ${news.items.map((item) => `
            <article class="mtk-investor__latest-news-card">
              <div class="mtk-investor__latest-news-media" aria-hidden="true">
                <span class="mtk-investor__latest-news-media-icon">${this.iconSvg(item.icon)}</span>
              </div>
              <div class="mtk-investor__latest-news-content">
                <p class="mtk-investor__latest-news-date">${this.escapeHtml(item.date)}</p>
                <h3 class="mtk-investor__latest-news-card-title">${this.escapeHtml(item.title)}</h3>
                <button
                  class="mtk-investor__latest-news-link"
                  type="button"
                  data-event="${this.escapeAttribute(item.event)}"
                  data-action="${this.escapeAttribute(item.action)}"
                  ${item.href ? `data-href="${this.escapeAttribute(item.href)}"` : ""}
                  aria-label="${this.escapeAttribute(item.title)}"
                >
                  <span aria-hidden="true">${this.iconSvg("arrow_forward")}</span>
                </button>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderFooter() {
    this.renderChrome(this.getRegion("footer"), true);
  }

  renderToTop() {
    const region = this.getRegion("to-top");
    const toTop = this.config.toTop;

    if (!region || !toTop) {
      return;
    }

    region.innerHTML = `
      <button
        class="mtk-investor__to-top"
        type="button"
        data-event="${this.escapeAttribute(toTop.event)}"
        data-action="${this.escapeAttribute(toTop.action)}"
        aria-label="${this.escapeAttribute(toTop.label)}"
        title="${this.escapeAttribute(toTop.label)}"
      >
        <span class="mtk-investor__to-top-icon" aria-hidden="true">${this.iconSvg(toTop.icon)}</span>
      </button>
    `;
  }


  handleResize() {
    if (window.innerWidth > 768) {
      this.closeMobileMenus();
    }
  }

  handleScroll() {
    const button = this.root.querySelector(".mtk-investor__to-top");
    const showAfter = Number((this.config.toTop && this.config.toTop.showAfter) || 320);

    if (!button) {
      return;
    }

    button.classList.toggle("mtk-investor__to-top--visible", window.scrollY > showAfter);
  }

  renderActionButton(action, variant) {
    const target = action.target ? ` data-target="${this.escapeAttribute(action.target)}"` : "";
    const href = action.href ? ` data-href="${this.escapeAttribute(action.href)}"` : "";

    return `
      <button
        class="mtk-investor__button mtk-investor__button--${this.escapeAttribute(variant)}"
        type="button"
        data-event="${this.escapeAttribute(action.event)}"
        data-action="${this.escapeAttribute(action.action)}"${target}${href}
      >
        <span>${this.escapeHtml(action.label)}</span>
        <span class="mtk-investor__material-icon" aria-hidden="true">${this.iconSvg(action.icon)}</span>
      </button>
    `;
  }

  iconSvg(icon) {
    const paths = {
      add_business: '<path d="M4 20h16"/><path d="M6 20V9l2-5h8l2 5v11"/><path d="M6 9h12"/><path d="M10 20v-6h4v6"/><path d="M16 4v4"/><path d="M14 6h4"/>',
      arrow_forward: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
      article: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h4"/><path d="M9 12h6"/><path d="M9 16h6"/>',
      analytics: '<path d="M4 19h16"/><path d="M7 16v-5"/><path d="M12 16V6"/><path d="M17 16v-8"/><path d="M6 5h12"/>',
      business: '<path d="M4 20V8h16v12"/><path d="M8 8V4h8v4"/><path d="M8 12h1"/><path d="M12 12h1"/><path d="M16 12h1"/><path d="M8 16h1"/><path d="M12 16h1"/><path d="M16 16h1"/>',
      business_center: '<path d="M9 7V5h6v2"/><path d="M4 8h16v11H4z"/><path d="M4 12h16"/><path d="M10 12v2h4v-2"/>',
      call: '<path d="M7 4h4l1 5-2 1a12 12 0 0 0 4 4l1-2 5 1v4a3 3 0 0 1-3 3A13 13 0 0 1 4 7a3 3 0 0 1 3-3z"/>',
      check_circle: '<circle cx="12" cy="12" r="8"/><path d="m8 12 3 3 5-6"/>',
      close: '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
      construction: '<path d="m14 7 3-3 3 3-3 3z"/><path d="M14 7 4 17l3 3 10-10"/><path d="m5 18 2 2"/>',
      description: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h4"/><path d="M9 12h6"/><path d="M9 15h6"/><path d="M9 18h4"/>',
      diamond: '<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18"/><path d="m9 4 3 16 3-16"/>',
      directions_car: '<path d="M6 16h12"/><path d="M7 16l1-5 2-4h4l2 4 1 5"/><path d="M8 16v2"/><path d="M16 16v2"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/>',
      download: '<path d="M12 4v10"/><path d="m8 10 4 4 4-4"/><path d="M5 20h14"/><path d="M6 17v3"/><path d="M18 17v3"/>',
      email: '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
      event: '<path d="M5 5h14v15H5z"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M5 9h14"/><path d="M8 13h3"/><path d="M13 13h3"/><path d="M8 16h3"/>',
      groups: '<circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M14 18a5 5 0 0 1 7 2"/>',
      handshake: '<path d="M8 12l3-3 3 3"/><path d="m12 16 2 2a2 2 0 0 0 3-3l-5-5"/><path d="M7 13 4 10l4-4 3 3"/><path d="m17 13 3-3-4-4-3 3"/><path d="M9 15l2 2"/><path d="M7 17l2 2"/>',
      home_work: '<path d="M3 11 10 5l7 6"/><path d="M5 10v10h10V10"/><path d="M15 20h6V9h-6"/><path d="M8 20v-5h4v5"/><path d="M18 12h1"/><path d="M18 15h1"/>',
      hub: '<circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 7.5 10 10"/><path d="m14 10 3-2.5"/><path d="m14 14 3 2.5"/>',
      keyboard_arrow_up: '<path d="m6 15 6-6 6 6"/>',
      lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/>',
      mail: '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
      menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
      menu_book: '<path d="M4 5h7a3 3 0 0 1 3 3v12a3 3 0 0 0-3-3H4z"/><path d="M20 5h-7a3 3 0 0 0-3 3v12a3 3 0 0 1 3-3h7z"/>',
      monitoring: '<path d="M4 19h16"/><path d="M6 16l4-5 3 3 5-8"/><path d="M18 6v5h-5"/>',
      payments: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/>',
      picture_as_pdf: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h4"/><path d="M9 13h6"/><path d="M9 17h4"/>',
      play_circle: '<circle cx="12" cy="12" r="8"/><path d="m10 8 6 4-6 4z"/>',
      public: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><path d="M12 4a12 12 0 0 1 0 16"/><path d="M12 4a12 12 0 0 0 0 16"/>',
      query_stats: '<path d="M4 19h16"/><path d="M7 16v-5"/><path d="M12 16V7"/><path d="M17 16v-3"/><circle cx="17" cy="7" r="3"/><path d="m19 9 2 2"/>',
      rocket_launch: '<path d="M13 4c4 1 6 3 7 7l-5 5-7-7z"/><path d="M8 9 5 8 3 10l4 3"/><path d="m15 16 1 4-2 2-3-3"/><circle cx="15" cy="9" r="1.5"/><path d="M4 20l4-4"/>',
      science: '<path d="M9 3h6"/><path d="M10 3v5l-5 9a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-5-9V3"/><path d="M7 16h10"/>',
      show_chart: '<path d="M4 19h16"/><path d="m6 15 4-4 3 3 5-7"/><path d="M18 7v5h-5"/>',
      speed: '<path d="M5 17a8 8 0 1 1 14 0"/><path d="m12 14 4-4"/><path d="M12 18h.01"/><path d="M7 13h2"/><path d="M15 13h2"/>',
      support_agent: '<path d="M5 13v-1a7 7 0 0 1 14 0v1"/><path d="M5 13h3v5H5z"/><path d="M16 13h3v5h-3z"/><path d="M16 18a4 4 0 0 1-4 3h-2"/><path d="M10 21h2"/>',
      task_alt: '<path d="M5 5h14v14H5z"/><path d="m8 12 3 3 5-6"/>',
      track_changes: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4"/><path d="M22 12h-4"/><path d="M12 22v-4"/><path d="M2 12h4"/>',
      trending_up: '<path d="M4 17 10 11l4 4 6-8"/><path d="M15 7h5v5"/>',
      vertical_align_top: '<path d="M5 4h14"/><path d="M12 20V8"/><path d="m7 13 5-5 5 5"/>',
      verified: '<circle cx="12" cy="12" r="8"/><path d="M12 7v10"/><path d="M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5-1.3 2.5-3 2.5-3 1.1-3 2.5 1.3 2.5 3 2.5 3-1.1 3-2.5"/><path d="M9 12h6"/>',
      visibility: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
    };
    const path = paths[icon] || paths.article;

    return `<svg class="mtk-investor__icon-svg" viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true">${path}</svg>`;
  }

  applyAccessibilityLabels() {
    const { accessibility } = this.config;
    this.getRegion("navigation").setAttribute("aria-label", accessibility.navigationLabel);
    this.getRegion("hero").setAttribute("aria-label", accessibility.heroLabel);
    this.getRegion("overview").setAttribute("aria-label", accessibility.overviewLabel);
    this.getRegion("metrics").setAttribute("aria-label", accessibility.metricsLabel);
    this.getRegion("principles").setAttribute("aria-label", accessibility.principlesLabel);
    this.getRegion("strategy").setAttribute("aria-label", accessibility.strategyLabel);
    this.getRegion("updates").setAttribute("aria-label", accessibility.updatesLabel);
    this.getRegion("closing").setAttribute("aria-label", accessibility.closingLabel);
  }

  bindEvents() {
    this.root.addEventListener("click", this.handleClick);
  }

  handleClick(event) {
    const trigger = event.target.closest("[data-event]");

    if (!trigger || !this.root.contains(trigger)) {
      return;
    }

    const eventName = trigger.dataset.event;
    const detail = {
      component: "mtk-investor",
      action: trigger.dataset.action || "",
      target: trigger.dataset.target || "",
      href: trigger.dataset.href || "",
      label: trigger.textContent.trim()
    };

    if (detail.action === "email") {
      const contact = this.config.closing || {};
      const email =
        contact.email ||
        contact.emailAddress ||
        contact.contactEmail ||
        "investorrelations@nala.org";

      this.publish(eventName, {
        ...detail,
        email
      });
      this.closeMobileMenus();
      window.location.href = `mailto:${email}`;
      return;
    }

    if (detail.action === "toggle-menu" || detail.action === "toggle-footer-menu") {
      const isFooter = detail.action === "toggle-footer-menu";
      const nav = this.root.querySelector(isFooter ? ".mtk-investor__footer-nav" : ".mtk-investor__nav");
      const icon = trigger.querySelector(".mtk-investor__menu-toggle-icon");
      const menu = this.config.mobileMenu;
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      const willOpen = !isOpen;

      trigger.setAttribute("aria-expanded", String(willOpen));
      trigger.setAttribute("aria-label", willOpen ? menu.closeLabel : menu.openLabel);

      if (icon) {
        icon.innerHTML = this.iconSvg(willOpen ? menu.iconClose : menu.iconOpen);
      }

      if (nav) {
        nav.classList.toggle("mtk-investor__mobile-menu-open", willOpen);
      }

      return;
    }

    if (detail.target) {
      this.scrollToSection(detail.target);
      if (detail.action === "navigate" || detail.action === "brand-home") {
        this.setActiveNavigation(detail.target);
      }
    }

    if (detail.href) {
      window.location.href = detail.href;
    }

    this.publish(eventName, detail);
    this.closeMobileMenus();

    if (detail.action === "to-top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }


  setActiveNavigation(target) {
    this.root.querySelectorAll(".mtk-investor__nav-button, .mtk-investor__footer-nav-button").forEach((button) => {
      const active = button.dataset.target === target;
      button.classList.toggle("mtk-investor__nav-button--active", active);
      if (active) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }


  scrollToTarget(target) {
    if (!target) {
      return;
    }

    const header = this.root.querySelector(".mtk-investor__header");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const extraGap = 16;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const top = Math.max(0, targetTop - headerHeight - extraGap);

    window.scrollTo({
      top,
      behavior: "smooth"
    });
  }

  closeMobileMenus() {
    const menu = this.config.mobileMenu;

    this.root.querySelectorAll(".mtk-investor__menu-toggle").forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", menu.openLabel);
      const icon = toggle.querySelector(".mtk-investor__menu-toggle-icon");
      if (icon) {
        icon.innerHTML = this.iconSvg(menu.iconOpen);
      }
    });

    this.root.querySelectorAll(".mtk-investor__nav, .mtk-investor__footer-nav").forEach((nav) => {
      nav.classList.remove("mtk-investor__mobile-menu-open");
    });
  }

  publish(eventName, detail) {
    if (!eventName) {
      return;
    }

    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log(`[mtk-investor] publishing ${eventName}`, detail);
    } else {
      console.log(`[mtk-investor] publishing ${eventName}`, detail);
    }

    if (window.wc && typeof window.wc.publish === "function") {
      window.wc.publish(eventName, detail);
    }
  }

  subscribe() {
    if (!window.wc || typeof window.wc.subscribe !== "function") {
      return;
    }

    this.config.events.subscribe.forEach((eventName) => {
      window.wc.subscribe(eventName, this.onMessage);
    });
  }

  onMessage(message, data) {
    const status = this.getRegion("status");
    status.textContent = `${message || "mtk-investor event"} received.`;

    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log("[mtk-investor] message received", message, data);
    }
  }

  scrollToSection(target) {
    const section = this.root.querySelector(`[data-section="${CSS.escape(target)}"]`);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  getRegion(name) {
    return this.root.querySelector(`[data-region="${name}"]`);
  }

  escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  escapeAttribute(value) {
    return this.escapeHtml(value);
  }
}

(function initializeMtkInvestor() {
  const selector = "mtk-investor.mtk-investor";
  let observer = null;
  let retryTimer = null;

  const log = (...args) => {
    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log(...args);
    } else {
      console.log(...args);
    }
  };

  const findRoot = () => document.querySelector(selector);

  const start = () => {
    const root = findRoot();
    const config = window.MTK_INVESTOR_CONFIG;

    if (!root || !config) {
      return false;
    }

    if (root.dataset.initialized === "true") {
      return true;
    }

    root.dataset.initialized = "true";
    const investor = new MtkInvestor(root, config);
    investor.init();
    root.mtkInvestor = investor;
    log("[mtk-investor] initialized");
    return true;
  };

  const stopWatching = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (retryTimer) {
      window.clearInterval(retryTimer);
      retryTimer = null;
    }
  };

  const tryStart = () => {
    if (start()) {
      stopWatching();
      return true;
    }
    return false;
  };


  document.addEventListener("include:loaded", tryStart);
  document.addEventListener("mtk-investor:config-ready", tryStart);

  observer = new MutationObserver(tryStart);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  retryTimer = window.setInterval(tryStart, 100);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      tryStart();
    }, { once: true });
  } else {
    tryStart();
  }
})();
