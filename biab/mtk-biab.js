/**
 * mtk-biab.js
 * Business In A Box — Vanilla JS Class
 * Material Design UI | Bootstrap 5 layout
 * All events published/subscribed via wc.publish / wc.subscribe
 */

// ─── wc shim ────────────────────────────────────────────────────────────────
// Provides wc.publish, wc.subscribe, and wc.log if the host page
// has not already defined a "wc" bus.
if (typeof window.wc === 'undefined') {
  window.wc = (() => {
    const _channels = {};

    function subscribe(event, callback) {
      if (!_channels[event]) _channels[event] = [];
      _channels[event].push(callback);
    }

    function publish(event, data) {
      if (_channels[event]) {
        _channels[event].forEach(cb => {
          try { cb(event, data); } catch (e) { console.error('[wc] subscriber error', e); }
        });
      }
    }

    function log(event, data) {
      console.log(`[wc] ${event}`, data);
    }

    return { subscribe, publish, log };
  })();
}
// ────────────────────────────────────────────────────────────────────────────

const MTK_BIAB_LOGO_ICONS = [
  {
    key: 'precision-key',
    label: 'Precision Key',
    svg: `
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <circle cx="28" cy="48" r="16" fill="currentColor"></circle>
        <circle cx="28" cy="48" r="7" fill="var(--logo-bg, #ffffff)"></circle>
        <rect x="42" y="43" width="34" height="10" rx="5" fill="currentColor"></rect>
        <rect x="68" y="43" width="6" height="18" rx="2" fill="currentColor"></rect>
        <rect x="58" y="43" width="6" height="14" rx="2" fill="currentColor"></rect>
      </svg>`
  },
  {
    key: 'shield-lock',
    label: 'Shield Lock',
    svg: `
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <path d="M48 12l24 8v18c0 20-10 34-24 42C34 72 24 58 24 38V20l24-8z" fill="currentColor"></path>
        <rect x="37" y="43" width="22" height="19" rx="4" fill="var(--logo-bg, #ffffff)"></rect>
        <path d="M40 43v-5c0-5 3-10 8-10s8 5 8 10v5" fill="none" stroke="var(--logo-bg, #ffffff)" stroke-width="6" stroke-linecap="round"></path>
      </svg>`
  },
  {
    key: 'modern-keyhole',
    label: 'Modern Keyhole',
    svg: `
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <circle cx="48" cy="36" r="18" fill="currentColor"></circle>
        <path d="M48 44l10 24H38l10-24z" fill="currentColor"></path>
        <circle cx="48" cy="36" r="7" fill="var(--logo-bg, #ffffff)"></circle>
      </svg>`
  },
  {
    key: 'entry-lock',
    label: 'Entry Lock',
    svg: `
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <rect x="26" y="38" width="44" height="34" rx="8" fill="currentColor"></rect>
        <path d="M34 38V30c0-8 6-14 14-14s14 6 14 14v8" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"></path>
        <circle cx="48" cy="54" r="5" fill="var(--logo-bg, #ffffff)"></circle>
        <rect x="46" y="54" width="4" height="10" rx="2" fill="var(--logo-bg, #ffffff)"></rect>
      </svg>`
  },
  {
    key: 'garage-key',
    label: 'Garage Key',
    svg: `
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <path d="M19 55l20-20 11 11 19-19 8 8-19 19 11 11-20 20-30-30z" fill="currentColor"></path>
        <circle cx="33" cy="40" r="6" fill="var(--logo-bg, #ffffff)"></circle>
      </svg>`
  },
  {
    key: 'monogram-n',
    label: 'Monogram N',
    svg: `
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <rect x="18" y="18" width="60" height="60" rx="18" fill="currentColor"></rect>
        <path d="M34 64V32h7l21 20V32h8v32h-7L42 44v20h-8z" fill="var(--logo-bg, #ffffff)"></path>
      </svg>`
  }
];

const MTK_BIAB_LOGO_PALETTES = [
  {
    key: 'midnight-brass',
    label: 'Midnight Brass',
    description: 'High-trust dark navy with warm brass accents for premium residential and commercial positioning.',
    surface: '#0f172a',
    surfaceSoft: '#16213b',
    primary: '#c6952d',
    accent: '#f5d36c',
    textOnDark: '#f8fafc',
    textOnLight: '#0f172a',
    neutral: '#e5e7eb'
  },
  {
    key: 'forest-steel',
    label: 'Forest Steel',
    description: 'Professional green and steel for locksmiths leaning into property managers, hardware, and security.',
    surface: '#163126',
    surfaceSoft: '#23483a',
    primary: '#7dbb8b',
    accent: '#dfe7e2',
    textOnDark: '#f7fbf8',
    textOnLight: '#163126',
    neutral: '#d1d5db'
  },
  {
    key: 'signal-orange',
    label: 'Signal Orange',
    description: 'Urgency-focused palette suited to mobile, emergency, and roadside-first positioning.',
    surface: '#1f2937',
    surfaceSoft: '#374151',
    primary: '#f97316',
    accent: '#fed7aa',
    textOnDark: '#ffffff',
    textOnLight: '#1f2937',
    neutral: '#e5e7eb'
  },
  {
    key: 'royal-cobalt',
    label: 'Royal Cobalt',
    description: 'Refined bronze system for corporate, access-control, and service-contract oriented brands.',
    surface: '#3a2f1b',
    surfaceSoft: '#4a3a08',
    primary: '#c6952d',
    accent: '#fbf4e5',
    textOnDark: '#f8fbff',
    textOnLight: '#3a2f1b',
    neutral: '#dbe4f0'
  }
];

const MTK_BIAB_LOGO_FONTS = [
  {
    key: 'outfit-manrope',
    label: 'Outfit + Manrope',
    headline: "'Outfit', 'Segoe UI', sans-serif",
    body: "'Manrope', 'Segoe UI', sans-serif",
    rationale: 'Modern geometric pairing with clean counters and excellent van, website, and social readability.'
  },
  {
    key: 'archivo-manrope',
    label: 'Archivo Black + Manrope',
    headline: "'Archivo Black', 'Arial Black', sans-serif",
    body: "'Manrope', 'Segoe UI', sans-serif",
    rationale: 'Bold signage-first wordmark system for roadside visibility and simple fleet graphics.'
  },
  {
    key: 'space-libre',
    label: 'Space Grotesk + Libre Baskerville',
    headline: "'Space Grotesk', 'Segoe UI', sans-serif",
    body: "'Libre Baskerville', Georgia, serif",
    rationale: 'A more premium pairing that balances modern locksmith service with established trust.'
  }
];

const MTK_BIAB_LOGO_TEMPLATES = [
  {
    key: 'service-wordmark',
    label: 'Service Wordmark',
    badge: 'Best for vans',
    description: 'Horizontal lockup with strong icon-left hierarchy for vehicle wraps, Google profile art, and website headers.'
  },
  {
    key: 'trusted-shield',
    label: 'Trusted Shield',
    badge: 'Best for trust',
    description: 'Badge-driven system with stronger security cues for rekeys, property managers, and commercial accounts.'
  },
  {
    key: 'modern-stack',
    label: 'Modern Stack',
    badge: 'Best for web',
    description: 'Clean stacked layout for websites, proposals, and social assets with a simple modern feel.'
  },
  {
    key: 'monogram-seal',
    label: 'Monogram Seal',
    badge: 'Best for premium',
    description: 'Compact emblem system suited to invoices, stationery, stamps, and polished premium brands.'
  }
];

const MTK_BIAB_LOGO_VARIATIONS = [
  { key: 'horizontal', label: 'Horizontal', description: 'Primary website and van lockup.' },
  { key: 'stacked', label: 'Stacked', description: 'Balanced for square ads and flyers.' },
  { key: 'badge', label: 'Badge', description: 'Compact seal for uniforms, decals, and favicons.' },
  { key: 'icon-only', label: 'Icon Only', description: 'Small-format social avatar and favicon mark.' }
];

class MtkBiab {
  /**
   * @param {HTMLElement} el  - The <mtk-biab> root element
   * @param {Object}      cfg - MTK_BIAB_CONFIG from mtk-biab.config.js
   */
  constructor(el, cfg) {
    this.el     = el;
    this.cfg    = cfg;
    this.tabs   = cfg.tabs;
    this.events = cfg.events;
    this.logoDesignerState = this._getDefaultLogoDesignerState();

    // Active state
    this.activeTabId    = null;
    this.activeMenuState = {}; // { tabId: { menuId, itemId } }

    this._init();
  }

  // ── Initialization ─────────────────────────────────────────────────────────

  _init() {
    this._subscribeAll();
    this._render();
    this._renderDynamicPanels();
    this._bindAll();
    this._activateDefaultTab();

    // Publish ready
    this._publish(this.events.publish.ready, {
      component: this.cfg.component,
      version:   this.cfg.version
    });
  }

  // ── Subscriptions ──────────────────────────────────────────────────────────

  _subscribeAll() {
    this.events.subscribe.forEach(eventName => {
      wc.subscribe(eventName, this.onMessage.bind(this));
    });
  }

  /**
   * onMessage — handler passed to wc.subscribe for all 4 mtk-biab events
   * @param {string} event
   * @param {Object} data
   */
  onMessage(event, data) {
    // Ignore events we published ourselves to prevent infinite loops
    if (this._publishing) return;

    switch (event) {
      case this.events.publish.ready:
        // Component ready — no further action needed here
        break;

      case this.events.publish.tabChange:
        // External tab change request
        if (data && data.tabId) {
          this._activateTab(data.tabId);
        }
        break;

      case this.events.publish.menuSelect:
        // External menu selection request
        if (data && data.tabId && data.menuId) {
          this._expandMenu(data.tabId, data.menuId);
        }
        break;

      case this.events.publish.itemSelect:
        // External item selection request
        if (data && data.tabId && data.itemId) {
          this._activateItem(data.tabId, data.itemId, data.menuId, null, true);
        }
        break;

      default:
        console.warn(`[mtk-biab] onMessage: unhandled event "${event}"`);
    }
  }

  // ── Publish helper ─────────────────────────────────────────────────────────

  _publish(eventName, data) {
    this._publishing = true;
    wc.log(eventName, data);
    wc.publish(eventName, data);
    this._publishing = false;
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  _render() {
    this.el.innerHTML = this._buildHTML();
  }

  _buildHTML() {
    return `
      <div class="mtk-biab__wrapper">
        ${this._buildHeader()}
        <main class="mtk-biab__content" id="mtk-biab-content">
          <div class="mtk-biab__container">
            <div class="row g-0">
              <div class="col-md-12">
                ${this.tabs.map(tab => this._buildTabPanel(tab)).join('')}
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  _buildHeader() {
    return `
      <header class="mtk-biab__header" role="banner">
        <div class="mtk-biab__header-inner">
          <a class="mtk-biab__logo" href="#" tabindex="0" aria-label="NALA - Business in a Box">
            <img class="mtk-biab__logo-icon" src="img/logo-nala-association.webp" alt="NALA logo" height="70" />
            <span class="mtk-biab__logo-text">
              <span class="mtk-biab__logo-full"><small> Business in a Box</small></span>
              <span class="mtk-biab__logo-short">NALA</span>
            </span>
          </a>

          <button
            class="mtk-biab__hamburger"
            aria-label="Toggle navigation"
            aria-expanded="false"
            aria-controls="mtk-biab-tabs-nav"
            data-action="toggle-nav"
          >
            <span class="material-icons" aria-hidden="true">menu</span>
          </button>

          <div class="mtk-biab__header-divider" aria-hidden="true"></div>

          <nav
            class="mtk-biab__tabs-nav"
            id="mtk-biab-tabs-nav"
            role="tablist"
            aria-label="Main navigation tabs"
          >
            ${this.tabs.map((tab, i) => `
              <button
                class="mtk-biab__tab-btn${tab.active ? ' is-active' : ''}"
                role="tab"
                id="mtk-biab-tab-${tab.id}"
                aria-controls="mtk-biab-panel-${tab.id}"
                aria-selected="${tab.active ? 'true' : 'false'}"
                tabindex="${tab.active ? '0' : '-1'}"
                data-action="select-tab"
                data-tab-id="${tab.id}"
              >
                <span class="material-icons" aria-hidden="true">${tab.icon}</span>
                <span>${tab.label}</span>
                <span class="mtk-biab__tab-indicator" aria-hidden="true"></span>
              </button>
            `).join('')}
          </nav>
        </div>
      </header>
    `;
  }

  _buildTabPanel(tab) {
    let inner = '';
    if (tab.type === 'iframe') {
      inner = this._buildIframePanel(tab);
    } else if (tab.type === 'sidebar') {
      inner = this._buildSidebarPanel(tab);
    } else if (tab.type === 'simple') {
      inner = this._buildSimplePanel(tab);
    }

    return `
      <section
        class="mtk-biab__tab-panel${tab.active ? ' is-active' : ''}"
        id="mtk-biab-panel-${tab.id}"
        role="tabpanel"
        aria-labelledby="mtk-biab-tab-${tab.id}"
        ${!tab.active ? 'hidden' : ''}
        data-panel-id="${tab.id}"
      >
        ${inner}
      </section>
    `;
  }

  _buildIframePanel(tab) {
    return `
      <div class="mtk-biab__iframe-panel">
        <iframe
          class="mtk-biab__iframe"
          id="mtk-biab-iframe-${tab.id}"
          src="${tab.iframeUrl}"
          title="Client Website Preview"
          aria-label="Client website preview"
          loading="lazy"
          allow="fullscreen"
        ></iframe>
      </div>
    `;
  }

  _buildSidebarPanel(tab) {
    const { menus } = tab.sidebar;

    const sidebarHTML = menus.map((menu, mi) => `
      <nav class="mtk-biab__sidebar-menu" aria-label="${menu.label}">
        <button
          class="mtk-biab__sidebar-menu-header is-collapsed"
          aria-expanded="false"
          aria-controls="mtk-biab-menu-items-${tab.id}-${menu.id}"
          data-action="toggle-menu"
          data-tab-id="${tab.id}"
          data-menu-id="${menu.id}"
        >
          <span class="material-icons" aria-hidden="true">${menu.icon}</span>
          <span>${menu.label}</span>
          <span class="material-icons mtk-biab__sidebar-menu-header-chevron" aria-hidden="true">expand_more</span>
        </button>
        <ul
          class="mtk-biab__sidebar-items is-collapsed"
          id="mtk-biab-menu-items-${tab.id}-${menu.id}"
          role="list"
        >
          ${menu.items.map(item => `
            <li class="mtk-biab__sidebar-item" role="listitem">
              <button
                class="mtk-biab__sidebar-item-btn"
                data-action="select-item"
                data-tab-id="${tab.id}"
                data-menu-id="${menu.id}"
                data-item-id="${item.id}"
                aria-current="false"
              >
                <span class="material-icons" aria-hidden="true">${item.icon}</span>
                <span>${item.label}</span>
              </button>
            </li>
          `).join('')}
        </ul>
        ${mi < menus.length - 1 ? '<div class="mtk-biab__sidebar-divider" aria-hidden="true"></div>' : ''}
      </nav>
    `).join('');

    const contentPanels = menus.flatMap(menu =>
      menu.items.map(item => `
        <article
          class="mtk-biab__content-panel"
          id="mtk-biab-content-${tab.id}-${item.id}"
          data-tab-id="${tab.id}"
          data-item-id="${item.id}"
          aria-label="${item.content.title}"
          tabindex="-1"
        >
          <nav class="mtk-biab__breadcrumb" aria-label="Breadcrumb">
            <span>${tab.label}</span>
            <span class="material-icons" aria-hidden="true">chevron_right</span>
            <span>${menu.label}</span>
            <span class="material-icons" aria-hidden="true">chevron_right</span>
            <span class="is-current" aria-current="page">${item.label}</span>
          </nav>
          <div class="mtk-biab__content-card">
            <h2 class="mtk-biab__content-title">${item.content.title}</h2>
            <p class="mtk-biab__content-subtitle">${menu.label} · ${tab.label}</p>
            <div class="mtk-biab__content-body">
              ${item.content.body}
            </div>
          </div>
        </article>
      `)
    ).join('');

    return `
      <div class="mtk-biab__sidebar-panel row g-0">
        <aside
          class="mtk-biab__sidebar col-md-3"
          aria-label="${tab.label} navigation"
        >
          ${sidebarHTML}
        </aside>
        <div class="mtk-biab__sidebar-content col-md-9">
          <div
            class="mtk-biab__content-empty"
            id="mtk-biab-empty-${tab.id}"
            aria-live="polite"
          >
            <span class="material-icons" aria-hidden="true">touch_app</span>
            <h3>Select an option</h3>
            <p>Choose a topic from the menu on the left to get started.</p>
          </div>
          ${contentPanels}
        </div>
      </div>
    `;
  }

  _buildSimplePanel(tab) {
    return `
      <div class="mtk-biab__simple-panel">
        <div class="mtk-biab__container">
          <div class="row g-0">
            <div class="col-md-12">
              <div class="mtk-biab__content-card">
                <h2 class="mtk-biab__content-title">${tab.content.title}</h2>
                <div class="mtk-biab__content-body">
                  ${tab.content.body}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Bind Events ────────────────────────────────────────────────────────────

  _bindAll() {
    // Delegate all interactions from the root element
    this.el.addEventListener('click', this._onClick.bind(this));
    this.el.addEventListener('keydown', this._onKeydown.bind(this));
    this.el.addEventListener('input', this._onInput.bind(this));
  }

  _onClick(e) {
    // Prevent hash-only anchors from navigating (avoids wc-include re-injection)
    const anchor = e.target.closest('a[href="#"]');
    if (anchor) {
      e.preventDefault();
      // Logo click → go home
      if (anchor.classList.contains('mtk-biab__logo')) {
        window.location.replace('/repo_deploy/');
      }
      return;
    }

    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;

    switch (action) {
      case 'toggle-nav':
        this._handleNavToggle();
        break;
      case 'select-tab':
        this._activateTab(btn.dataset.tabId);
        this._closeNav();
        break;
      case 'select-item':
        this._handleItemClick(btn);
        break;
      case 'toggle-menu':
        this._handleMenuToggle(btn);
        break;
      case 'iframe-reload':
        this._handleIframeReload(btn);
        break;
      case 'iframe-open':
        this._handleIframeOpen(btn);
        break;
      case 'logo-set-icon':
        this._setLogoDesignerState('iconKey', btn.dataset.logoValue);
        break;
      case 'logo-set-palette':
        this._setLogoDesignerState('paletteKey', btn.dataset.logoValue);
        break;
      case 'logo-set-font':
        this._setLogoDesignerState('fontKey', btn.dataset.logoValue);
        break;
      case 'logo-set-template':
        this._setLogoDesignerState('templateKey', btn.dataset.logoValue);
        break;
      case 'logo-set-variation':
        this._setLogoDesignerState('variationKey', btn.dataset.logoValue);
        break;
    }
  }

  _onInput(e) {
    const field = e.target.dataset.logoField;
    if (!field) return;
    const cursorStart = typeof e.target.selectionStart === 'number' ? e.target.selectionStart : null;
    const cursorEnd = typeof e.target.selectionEnd === 'number' ? e.target.selectionEnd : cursorStart;
    this.logoDesignerState[field] = e.target.value;
    this._renderDynamicPanels();

    const replacement = this.el.querySelector(`[data-logo-field="${field}"]`);
    if (replacement) {
      replacement.focus();
      if (cursorStart !== null && typeof replacement.setSelectionRange === 'function') {
        replacement.setSelectionRange(cursorStart, cursorEnd);
      }
    }
  }

  _onKeydown(e) {
    // Tab navigation: arrow keys within tablist
    if (e.target.classList.contains('mtk-biab__tab-btn')) {
      const tabs = Array.from(this.el.querySelectorAll('.mtk-biab__tab-btn'));
      const idx  = tabs.indexOf(e.target);

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        next.focus();
        next.click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        prev.focus();
        prev.click();
      } else if (e.key === 'Home') {
        e.preventDefault();
        tabs[0].focus();
        tabs[0].click();
      } else if (e.key === 'End') {
        e.preventDefault();
        tabs[tabs.length - 1].focus();
        tabs[tabs.length - 1].click();
      }
    }

    // Sidebar item: Enter / Space
    if (e.target.classList.contains('mtk-biab__sidebar-item-btn')) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.target.click();
      }
    }
  }

  // ── Action Handlers ────────────────────────────────────────────────────────

  _handleItemClick(btn) {
    const { tabId, menuId, itemId } = btn.dataset;
    this._activateItem(tabId, itemId, menuId, btn);
  }

  _handleNavToggle() {
    const nav = this.el.querySelector('.mtk-biab__tabs-nav');
    const btn = this.el.querySelector('.mtk-biab__hamburger');
    if (!nav) return;
    const isOpen = nav.classList.toggle('is-open');
    if (btn) btn.setAttribute('aria-expanded', String(isOpen));
  }

  _closeNav() {
    const nav = this.el.querySelector('.mtk-biab__tabs-nav');
    const btn = this.el.querySelector('.mtk-biab__hamburger');
    if (nav) nav.classList.remove('is-open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  _handleMenuToggle(btn) {
    const { tabId, menuId } = btn.dataset;
    const itemsEl = this.el.querySelector(`#mtk-biab-menu-items-${tabId}-${menuId}`);
    const isCollapsed = itemsEl.classList.toggle('is-collapsed');

    btn.classList.toggle('is-collapsed', isCollapsed);
    btn.setAttribute('aria-expanded', String(!isCollapsed));

    // Publish menu select
    this._publish(this.events.publish.menuSelect, {
      tabId,
      menuId,
      collapsed: isCollapsed
    });
  }

  _handleIframeReload(btn) {
    const { tabId } = btn.dataset;
    const iframe = this.el.querySelector(`#mtk-biab-iframe-${tabId}`);
    if (iframe) iframe.src = iframe.src;
  }

  _handleIframeOpen(btn) {
    const url = btn.dataset.url;
    if (url) window.open(url, '_blank', 'noopener noreferrer');
  }

  // ── Tab Activation ─────────────────────────────────────────────────────────

  _activateDefaultTab() {
    const defaultTab = this.tabs.find(t => t.active) || this.tabs[0];
    if (defaultTab) this._activateTab(defaultTab.id, true);
  }

  _activateTab(tabId, silent = false) {
    if (this.activeTabId === tabId) return;
    this.activeTabId = tabId;

    // Tab buttons
    const allTabBtns = this.el.querySelectorAll('.mtk-biab__tab-btn');
    allTabBtns.forEach(btn => {
      const isActive = btn.dataset.tabId === tabId;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
    });

    // Tab panels — use visibility to avoid layout reflow
    const allPanels = this.el.querySelectorAll('.mtk-biab__tab-panel');
    allPanels.forEach(panel => {
      const isActive = panel.dataset.panelId === tabId;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
      panel.style.display = isActive ? '' : 'none';
    });

    if (!silent) {
      this._publish(this.events.publish.tabChange, { tabId });
    }
  }

  // ── Item Activation ────────────────────────────────────────────────────────

  _activateItem(tabId, itemId, menuId, clickedBtn, silent = false) {
    // Deactivate previous item buttons in this tab
    const prevBtns = this.el.querySelectorAll(
      `#mtk-biab-panel-${tabId} .mtk-biab__sidebar-item-btn.is-active`
    );
    prevBtns.forEach(b => {
      b.classList.remove('is-active');
      b.setAttribute('aria-current', 'false');
    });

    // Activate clicked button
    const btn = clickedBtn || this.el.querySelector(
      `[data-tab-id="${tabId}"][data-item-id="${itemId}"].mtk-biab__sidebar-item-btn`
    );
    if (btn) {
      btn.classList.add('is-active');
      btn.setAttribute('aria-current', 'true');
    }

    // Hide empty state
    const empty = this.el.querySelector(`#mtk-biab-empty-${tabId}`);
    if (empty) empty.style.display = 'none';

    // Deactivate all content panels in this tab
    const prevPanels = this.el.querySelectorAll(
      `#mtk-biab-panel-${tabId} .mtk-biab__content-panel.is-active`
    );
    prevPanels.forEach(p => p.classList.remove('is-active'));

    // Activate target content panel
    const targetPanel = this.el.querySelector(
      `#mtk-biab-content-${tabId}-${itemId}`
    );
    if (targetPanel) {
      targetPanel.classList.add('is-active');
      targetPanel.focus({ preventScroll: true });
    }

    this._renderDynamicPanels();

    // Update state
    this.activeMenuState[tabId] = { menuId, itemId };

    // Publish
    if (!silent) {
      this._publish(this.events.publish.itemSelect, { tabId, menuId, itemId });
    }
  }

  // ── Expand Menu ────────────────────────────────────────────────────────────

  _expandMenu(tabId, menuId) {
    const itemsEl = this.el.querySelector(`#mtk-biab-menu-items-${tabId}-${menuId}`);
    const headerBtn = this.el.querySelector(
      `[data-action="toggle-menu"][data-tab-id="${tabId}"][data-menu-id="${menuId}"]`
    );
    if (!itemsEl) return;
    itemsEl.classList.remove('is-collapsed');
    if (headerBtn) {
      headerBtn.classList.remove('is-collapsed');
      headerBtn.setAttribute('aria-expanded', 'true');
    }
  }

  _getDefaultLogoDesignerState() {
    return {
      businessName: 'Harbor Lock & Key',
      tagline: 'Mobile locksmith, rekeys, and access upgrades',
      iconKey: 'precision-key',
      paletteKey: 'midnight-brass',
      fontKey: 'outfit-manrope',
      templateKey: 'service-wordmark',
      variationKey: 'horizontal'
    };
  }

  _setLogoDesignerState(field, value) {
    if (!field || typeof value === 'undefined') return;
    this.logoDesignerState[field] = value;
    this._renderDynamicPanels();
  }

  _renderDynamicPanels() {
    this._renderLogoConceptsPanel();
    this._renderLogoGuidelinesPanel();
    this._renderLogoVariationsPanel();
  }

  _renderLogoConceptsPanel() {
    const mount = this.el.querySelector('[data-logo-designer-panel="concepts"]');
    if (!mount) return;

    const state = this.logoDesignerState;
    const icon = this._getLogoResource(MTK_BIAB_LOGO_ICONS, state.iconKey);
    const palette = this._getLogoResource(MTK_BIAB_LOGO_PALETTES, state.paletteKey);
    const font = this._getLogoResource(MTK_BIAB_LOGO_FONTS, state.fontKey);
    const template = this._getLogoResource(MTK_BIAB_LOGO_TEMPLATES, state.templateKey);
    const variation = this._getLogoResource(MTK_BIAB_LOGO_VARIATIONS, state.variationKey);

    mount.innerHTML = `
      <section class="mtk-biab__logo-designer">
        <div class="mtk-biab__logo-note">
          <strong>Production note:</strong> this builder uses free test icons and Google Fonts for workflow validation. Replace them with a paid locksmith icon set and a licensed production font set before launch.
        </div>

        <div class="mtk-biab__logo-preview-area mtk-biab__logo-preview-area--hero">
          <div class="mtk-biab__logo-preview-summary">
            <span class="mtk-biab__logo-badge">Research-based starter direction</span>
            <h3>${template.label}</h3>
            <p>${template.description}</p>
            <ul>
              <li><strong>Chosen icon:</strong> ${icon.label}</li>
              <li><strong>Chosen palette:</strong> ${palette.label}</li>
              <li><strong>Chosen font system:</strong> ${font.label}</li>
              <li><strong>Chosen primary variation:</strong> ${variation.label}</li>
            </ul>
          </div>

          <div class="mtk-biab__logo-preview-grid mtk-biab__logo-preview-grid--concepts">
            ${this._buildLogoPreviewCard('Primary concept', this._buildLogoMarkup(state, 'primary-dark'), palette.surface, palette.textOnDark, false, 'hero')}
            ${this._buildLogoPreviewCard('Light-background concept', this._buildLogoMarkup(state, 'primary-light'), '#ffffff', palette.textOnLight, true)}
            ${this._buildLogoPreviewCard('Social avatar / favicon', this._buildLogoMarkup(state, 'icon-only'), palette.surfaceSoft, palette.textOnDark)}
            ${this._buildLogoPreviewCard('Vehicle / signage lockup', this._buildLogoMarkup(state, 'horizontal-banner'), palette.surface, palette.textOnDark)}
          </div>
        </div>

        <div class="mtk-biab__logo-controls">
          <div class="mtk-biab__logo-controls-grid">
            <div class="mtk-biab__logo-control-group">
              <h3>Brand text</h3>
              <label class="mtk-biab__logo-label">Business name
                <input class="mtk-biab__logo-input" data-logo-field="businessName" type="text" maxlength="40" value="${this._escapeHtml(state.businessName)}">
              </label>
              <label class="mtk-biab__logo-label">Tagline
                <input class="mtk-biab__logo-input" data-logo-field="tagline" type="text" maxlength="70" value="${this._escapeHtml(state.tagline)}">
              </label>
            </div>

            <div class="mtk-biab__logo-control-group">
              <h3>Icon library</h3>
              <p>Starter test icons for locksmith brands. These are intentionally simple so they remain readable on vans, invoices, and social avatars.</p>
              <div class="mtk-biab__logo-option-grid">
                ${MTK_BIAB_LOGO_ICONS.map(option => `
                  <button type="button" class="mtk-biab__logo-option-card${option.key === state.iconKey ? ' is-active' : ''}" data-action="logo-set-icon" data-logo-value="${option.key}">
                    <span class="mtk-biab__logo-option-icon" style="--logo-option-color:${palette.primary};--logo-bg:${palette.surface};">${option.svg}</span>
                    <span class="mtk-biab__logo-option-title">${option.label}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="mtk-biab__logo-control-group">
              <h3>Color schemes</h3>
              <p>Each scheme is built for contrast, vehicle readability, and a practical locksmith positioning.</p>
              <div class="mtk-biab__logo-option-grid">
                ${MTK_BIAB_LOGO_PALETTES.map(option => `
                  <button type="button" class="mtk-biab__logo-swatch-card${option.key === state.paletteKey ? ' is-active' : ''}" data-action="logo-set-palette" data-logo-value="${option.key}">
                    <span class="mtk-biab__logo-swatch-row">
                      <span class="mtk-biab__logo-swatch" style="background:${option.surface};"></span>
                      <span class="mtk-biab__logo-swatch" style="background:${option.primary};"></span>
                      <span class="mtk-biab__logo-swatch" style="background:${option.accent};"></span>
                    </span>
                    <span class="mtk-biab__logo-option-title">${option.label}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="mtk-biab__logo-control-group">
              <h3>Font systems</h3>
              <div class="mtk-biab__logo-stack">
                ${MTK_BIAB_LOGO_FONTS.map(option => `
                  <button type="button" class="mtk-biab__logo-choice${option.key === state.fontKey ? ' is-active' : ''}" data-action="logo-set-font" data-logo-value="${option.key}">
                    <strong style="font-family:${option.headline};">${option.label}</strong>
                    <span>${option.rationale}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="mtk-biab__logo-control-group">
              <h3>Template direction</h3>
              <div class="mtk-biab__logo-stack">
                ${MTK_BIAB_LOGO_TEMPLATES.map(option => `
                  <button type="button" class="mtk-biab__logo-choice${option.key === state.templateKey ? ' is-active' : ''}" data-action="logo-set-template" data-logo-value="${option.key}">
                    <strong>${option.label}</strong>
                    <span>${option.description}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="mtk-biab__logo-control-group">
              <h3>Primary variation</h3>
              <div class="mtk-biab__logo-pill-row">
                ${MTK_BIAB_LOGO_VARIATIONS.map(option => `
                  <button type="button" class="mtk-biab__logo-pill${option.key === state.variationKey ? ' is-active' : ''}" data-action="logo-set-variation" data-logo-value="${option.key}">${option.label}</button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  _renderLogoGuidelinesPanel() {
    const mount = this.el.querySelector('[data-logo-designer-panel="guidelines"]');
    if (!mount) return;

    const state = this.logoDesignerState;
    const palette = this._getLogoResource(MTK_BIAB_LOGO_PALETTES, state.paletteKey);
    const font = this._getLogoResource(MTK_BIAB_LOGO_FONTS, state.fontKey);
    const template = this._getLogoResource(MTK_BIAB_LOGO_TEMPLATES, state.templateKey);
    const variation = this._getLogoResource(MTK_BIAB_LOGO_VARIATIONS, state.variationKey);

    mount.innerHTML = `
      <section class="mtk-biab__logo-guidelines">
        <div class="mtk-biab__logo-preview-area mtk-biab__logo-preview-area--hero">
          ${this._buildLogoPreviewCard('Approved guideline sample', this._buildLogoMarkup(state, 'primary-dark'), palette.surface, palette.textOnDark, false, 'hero')}
        </div>

        <div class="mtk-biab__logo-preview-summary">
          <span class="mtk-biab__logo-badge">Starter brand system</span>
          <h3>${this._escapeHtml(state.businessName)}</h3>
          <p>Built for simplicity, memorability, scalability, and contrast across van graphics, invoices, Google Business Profile, and web headers.</p>
        </div>

        <div class="mtk-biab__logo-guideline-grid">
          <div class="mtk-biab__logo-guideline-card">
            <h4>Color system</h4>
            <p>${palette.description}</p>
            <div class="mtk-biab__logo-swatch-row">
              <span class="mtk-biab__logo-swatch mtk-biab__logo-swatch--large" style="background:${palette.surface};"></span>
              <span class="mtk-biab__logo-swatch mtk-biab__logo-swatch--large" style="background:${palette.primary};"></span>
              <span class="mtk-biab__logo-swatch mtk-biab__logo-swatch--large" style="background:${palette.accent};"></span>
            </div>
            <ul>
              <li><strong>Base:</strong> ${palette.surface}</li>
              <li><strong>Primary:</strong> ${palette.primary}</li>
              <li><strong>Accent:</strong> ${palette.accent}</li>
            </ul>
          </div>

          <div class="mtk-biab__logo-guideline-card">
            <h4>Typography</h4>
            <p>${font.rationale}</p>
            <div class="mtk-biab__logo-font-demo">
              <div style="font-family:${font.headline};">Primary wordmark face</div>
              <div style="font-family:${font.body};">Support copy / tagline face</div>
            </div>
            <ul>
              <li>Use the headline face for the business name only.</li>
              <li>Use the support face for taglines, subheads, and stationery body copy.</li>
              <li>Keep tracking tight and avoid stretching or outlining the type.</li>
            </ul>
          </div>

          <div class="mtk-biab__logo-guideline-card">
            <h4>Layout rules</h4>
            <ul>
              <li><strong>Template:</strong> ${template.label}</li>
              <li><strong>Primary variation:</strong> ${variation.label}</li>
              <li>Keep icon-to-wordmark spacing consistent across every application.</li>
              <li>Protect minimum clear space equal to half the icon width.</li>
              <li>Never add metallic bevels, drop shadows, or tiny hardware details.</li>
            </ul>
          </div>

          <div class="mtk-biab__logo-guideline-card">
            <h4>Production checklist</h4>
            <ul>
              <li>Replace test icons with a premium locksmith icon pack.</li>
              <li>Replace free prototype fonts with the licensed production set you choose.</li>
              <li>Export SVG, transparent PNG, PDF, and one-color embroidery-safe files.</li>
              <li>Test on a white invoice, dark website header, and a van mockup before final approval.</li>
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  _renderLogoVariationsPanel() {
    const mount = this.el.querySelector('[data-logo-designer-panel="variations"]');
    if (!mount) return;

    const state = this.logoDesignerState;
    const palette = this._getLogoResource(MTK_BIAB_LOGO_PALETTES, state.paletteKey);

    mount.innerHTML = `
      <section class="mtk-biab__logo-variations">
        <div class="mtk-biab__logo-note">
          <strong>Expected production handoff:</strong> every approved locksmith logo should ship with dark, light, social, favicon, and one-color variants.
        </div>

        <div class="mtk-biab__logo-preview-area mtk-biab__logo-preview-area--hero">
          ${this._buildLogoPreviewCard('Primary selected variation', this._buildLogoMarkup(state, 'primary-dark'), palette.surface, palette.textOnDark, false, 'hero')}
        </div>

        <div class="mtk-biab__logo-preview-grid">
          ${this._buildLogoPreviewCard('Dark background primary', this._buildLogoMarkup(state, 'primary-dark'), palette.surface, palette.textOnDark)}
          ${this._buildLogoPreviewCard('White background primary', this._buildLogoMarkup(state, 'primary-light'), '#ffffff', palette.textOnLight, true)}
          ${this._buildLogoPreviewCard('One-color mark', this._buildLogoMarkup(state, 'mono'), '#f3f4f6', '#111827', true)}
          ${this._buildLogoPreviewCard('Badge / favicon', this._buildLogoMarkup(state, 'icon-only'), palette.surfaceSoft, palette.textOnDark)}
          ${this._buildLogoPreviewCard('Stacked social format', this._buildLogoMarkup(state, 'stacked'), '#ffffff', palette.textOnLight, true)}
          ${this._buildLogoPreviewCard('Service van banner', this._buildLogoMarkup(state, 'horizontal-banner'), palette.surface, palette.textOnDark)}
        </div>
      </section>
    `;
  }

  _buildLogoPreviewCard(label, markup, background, textColor, isLight = false, size = 'standard') {
    const cardClass = isLight ? ' mtk-biab__logo-preview-card--light' : '';
    const sizeClass = size === 'hero' ? ' mtk-biab__logo-preview-card--hero' : '';
    return `
      <article class="mtk-biab__logo-preview-card${cardClass}${sizeClass}">
        <div class="mtk-biab__logo-preview-label">${label}</div>
        <div class="mtk-biab__logo-preview-canvas" style="background:${background};color:${textColor};">
          ${markup}
        </div>
      </article>
    `;
  }

  _buildLogoMarkup(state, variant) {
    const palette = this._getLogoResource(MTK_BIAB_LOGO_PALETTES, state.paletteKey);
    const font = this._getLogoResource(MTK_BIAB_LOGO_FONTS, state.fontKey);
    const icon = this._getLogoResource(MTK_BIAB_LOGO_ICONS, state.iconKey);
    const template = this._getLogoResource(MTK_BIAB_LOGO_TEMPLATES, state.templateKey);
    const businessName = this._escapeHtml(state.businessName || 'Your Locksmith Brand');
    const tagline = this._escapeHtml(state.tagline || 'Residential, commercial, automotive');
    const isMono = variant === 'mono';
    const iconColor = isMono ? '#111827' : palette.primary;
    const bgColor = variant === 'primary-light' || variant === 'stacked' ? '#ffffff' : palette.surface;
    const textColor = bgColor === '#ffffff' ? palette.textOnLight : palette.textOnDark;
    const iconMarkup = `<span class="mtk-biab__logo-mark" style="color:${iconColor};--logo-bg:${bgColor};">${icon.svg}</span>`;
    const resolvedVariant = (variant === 'primary-dark' || variant === 'primary-light')
      ? state.variationKey
      : variant;

    if (resolvedVariant === 'icon-only') {
      return `<div class="mtk-biab__logo-lockup mtk-biab__logo-lockup--icon-only">${iconMarkup}</div>`;
    }

    if (resolvedVariant === 'stacked' || template.key === 'modern-stack') {
      return `
        <div class="mtk-biab__logo-lockup mtk-biab__logo-lockup--stacked" style="--logo-heading-font:${font.headline};--logo-body-font:${font.body};color:${textColor};">
          ${iconMarkup}
          <div class="mtk-biab__logo-copy">
            <div class="mtk-biab__logo-name">${businessName}</div>
            <div class="mtk-biab__logo-tagline">${tagline}</div>
          </div>
        </div>
      `;
    }

    if (resolvedVariant === 'horizontal-banner' || resolvedVariant === 'horizontal' || template.key === 'service-wordmark') {
      return `
        <div class="mtk-biab__logo-lockup mtk-biab__logo-lockup--horizontal" style="--logo-heading-font:${font.headline};--logo-body-font:${font.body};color:${textColor};">
          ${iconMarkup}
          <div class="mtk-biab__logo-copy">
            <div class="mtk-biab__logo-name">${businessName}</div>
            <div class="mtk-biab__logo-tagline">${tagline}</div>
          </div>
        </div>
      `;
    }

    if (resolvedVariant === 'badge' || template.key === 'trusted-shield' || template.key === 'monogram-seal') {
      return `
        <div class="mtk-biab__logo-lockup mtk-biab__logo-lockup--badge" style="--logo-heading-font:${font.headline};--logo-body-font:${font.body};color:${textColor};border-color:${isMono ? '#111827' : palette.primary};">
          ${iconMarkup}
          <div class="mtk-biab__logo-copy">
            <div class="mtk-biab__logo-name">${businessName}</div>
            <div class="mtk-biab__logo-tagline">${tagline}</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="mtk-biab__logo-lockup mtk-biab__logo-lockup--horizontal" style="--logo-heading-font:${font.headline};--logo-body-font:${font.body};color:${textColor};">
        ${iconMarkup}
        <div class="mtk-biab__logo-copy">
          <div class="mtk-biab__logo-name">${businessName}</div>
          <div class="mtk-biab__logo-tagline">${tagline}</div>
        </div>
      </div>
    `;
  }

  _getLogoResource(collection, key) {
    return collection.find(item => item.key === key) || collection[0];
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}


// ─── Auto-init ───────────────────────────────────────────────────────────────
// Wait for the <mtk-biab> element to appear, even when inserted via <wc-include>.

(function initMtkBiab() {
  const SELECTOR = 'mtk-biab.mtk-biab';

  function tryInit() {
    const el = document.querySelector(SELECTOR);
    if (!el) return false;

    // Guard: already initialized
    if (el._mtkBiabInstance) return true;

    const cfg = (typeof MTK_BIAB_CONFIG !== 'undefined')
      ? MTK_BIAB_CONFIG
      : null;

    if (!cfg) {
      console.error('[mtk-biab] MTK_BIAB_CONFIG not found. Make sure mtk-biab.config.js is loaded first.');
      return false;
    }

    el._mtkBiabInstance = new MtkBiab(el, cfg);
    return true;
  }

  // Try immediately (if DOM already has the element)
  if (tryInit()) return;

  // Otherwise wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (tryInit()) return;
      observeForElement();
    });
  } else {
    // DOM ready but element might be injected later (wc-include)
    observeForElement();
  }

  function observeForElement() {
    const observer = new MutationObserver(() => {
      if (tryInit()) observer.disconnect();
    });

    observer.observe(document.body, {
      childList: true,
      subtree:   true
    });

    // Safety timeout: stop observing after 15s
    setTimeout(() => observer.disconnect(), 15000);
  }
})();


