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
    key: 'contract-bronze',
    label: 'Contract Bronze',
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

const MTK_BIAB_I18N = {
  en: {
    selectOption: 'Select an option',
    chooseTopic: 'Choose a topic from the menu on the left to get started.',
    applyLogo: 'Apply to Website Maker',
    uploadLogo: 'Upload your own logo',
    download: 'Download',
    email: 'Send in an email',
    previous: 'Previous',
    next: 'Next',
    step: 'Step',
    finalDocument: 'Final document',
    businessInfo: 'Business Info',
    contactInfo: 'Contact Info',
    serviceSetup: 'Service Setup',
    marketingSetup: 'Marketing Setup',
    operations: 'Operations',
    invoiceSetup: 'Invoice Setup',
    automationIntro: 'These APIs can reduce manual work, but they need OAuth, approved access, and server-side credential handling before the website can create or change accounts automatically.',
    logoApplied: 'Logo sent to the Website Maker. Open or refresh the Website Maker tab if it is not visible yet.',
    reviewsIntro: 'Send review requests after completed jobs. Every submitted rating counts toward the public average; you can only choose which written reviews appear on the webpage.',
    sendReviewRequest: 'Send review request',
    customerName: 'Customer name',
    customerEmail: 'Customer email',
    jobType: 'Job type or note',
    publicReviewLink: 'Public review link',
    visibleOnWebsite: 'Show on webpage',
    hiddenOnWebsite: 'Hidden from webpage',
    allRatingsCount: 'All ratings count',
    publishedReviews: 'Published reviews',
    reviewValidation: 'Add the customer name and email before sending.'
  },
  es: {
    selectOption: 'Selecciona una opción',
    chooseTopic: 'Elige un tema del menú de la izquierda para comenzar.',
    applyLogo: 'Aplicar al creador de página',
    uploadLogo: 'Subir tu propio logo',
    download: 'Descargar',
    email: 'Enviar por correo',
    previous: 'Anterior',
    next: 'Siguiente',
    step: 'Paso',
    finalDocument: 'Documento final',
    businessInfo: 'Información del negocio',
    contactInfo: 'Información de contacto',
    serviceSetup: 'Configuración de servicios',
    marketingSetup: 'Configuración de marketing',
    operations: 'Operaciones',
    invoiceSetup: 'Configuración de factura',
    automationIntro: 'Estas APIs pueden reducir trabajo manual, pero requieren OAuth, acceso aprobado y manejo seguro de credenciales en el servidor antes de que el sitio pueda crear o modificar cuentas automáticamente.',
    logoApplied: 'Logo enviado al creador de página. Abre o actualiza la pestaña Website Maker si aún no aparece.',
    reviewsIntro: 'Envía solicitudes de reseña después de trabajos terminados. Cada calificación enviada cuenta para el promedio público; solo puedes elegir qué reseñas escritas aparecen en la página web.',
    sendReviewRequest: 'Enviar solicitud de reseña',
    customerName: 'Nombre del cliente',
    customerEmail: 'Correo del cliente',
    jobType: 'Tipo de trabajo o nota',
    publicReviewLink: 'Enlace público de reseña',
    visibleOnWebsite: 'Mostrar en la página',
    hiddenOnWebsite: 'Oculta en la página',
    allRatingsCount: 'Todas las calificaciones cuentan',
    publishedReviews: 'Reseñas publicadas',
    reviewValidation: 'Agrega el nombre y el correo del cliente antes de enviar.'
  }
};

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
    this.formState = this._getDefaultFormState();
    this.reviewState = this._getDefaultReviewState();
    this.invoiceState = { records: [], loadedForUid: '', status: '' };
    this.reviewsLoadedForUid = '';
    this.formSteps = {};

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
    this._renderToolPanels();
    this._bindAll();
    this._activateDefaultTab();
    this._bindLanguageChanges();

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
          <div class="mtk-biab__lang-switch" aria-label="Language">
            <button type="button" class="${this._getLang() === 'en' ? 'is-active' : ''}" data-action="set-lang" data-lang="en" aria-pressed="${this._getLang() === 'en'}">EN</button>
            <button type="button" class="${this._getLang() === 'es' ? 'is-active' : ''}" data-action="set-lang" data-lang="es" aria-pressed="${this._getLang() === 'es'}">ES</button>
          </div>
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
            <h3>${this._t('selectOption')}</h3>
            <p>${this._t('chooseTopic')}</p>
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
    this.el.addEventListener('change', this._onInput.bind(this));
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
      case 'logo-apply-to-client':
        this._applyLogoToClient();
        break;
      case 'logo-upload':
        this._openLogoUpload();
        break;
      case 'logo-download-set':
        this._downloadLogoSet();
        break;
      case 'set-lang':
        this._setLanguage(btn.dataset.lang);
        break;
      case 'tool-prev':
        this._moveToolStep(btn.dataset.tool, -1);
        break;
      case 'tool-next':
        this._moveToolStep(btn.dataset.tool, 1);
        break;
      case 'tool-download':
        this._handleToolDownload(btn.dataset.tool);
        break;
      case 'tool-email':
        this._handleToolEmail(btn.dataset.tool);
        break;
      case 'invoice-save':
        this._saveInvoiceRecord();
        break;
      case 'invoice-load':
        this._loadInvoiceRecord(btn.dataset.invoiceId);
        break;
      case 'review-send-request':
        this._sendReviewRequest();
        break;
      case 'review-toggle-published':
        this._toggleReviewPublished(btn.dataset.reviewId);
        break;
    }
  }

  _onInput(e) {
    if (e.target.dataset.reviewField) {
      this.reviewState.request[e.target.dataset.reviewField] = e.target.value;
      return;
    }

    if (e.target.dataset.toolField) {
      this._updateToolField(e.target.dataset.tool, e.target.dataset.toolField, e.target.value);
      return;
    }

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
      variationKey: 'horizontal',
      customLogo: ''
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
    this._renderLogoDownloadsPanel();
    this._renderStationeryPanels();
  }

  _renderToolPanels() {
    this._renderBusinessPlanTool();
    this._renderStartupTool();
    this._renderInvoiceTool();
    this._renderAutomationTool();
    this._renderReviewsTool();
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
          <strong>Step 1:</strong> choose the name, tagline, logo source, color system, font system, and template direction. Then apply the approved mark to the Website Maker.
        </div>

        <div class="mtk-biab__logo-preview-area mtk-biab__logo-preview-area--hero">
          <div class="mtk-biab__logo-preview-summary">
            <span class="mtk-biab__logo-badge">Research-based starter direction</span>
            <h3>${template.label}</h3>
            <p>${template.description}</p>
            <div class="mtk-biab__logo-actions">
              <button type="button" class="mtk-biab__action-btn" data-action="logo-upload">${this._t('uploadLogo')}</button>
              <button type="button" class="mtk-biab__action-btn mtk-biab__action-btn--primary" data-action="logo-apply-to-client">${this._t('applyLogo')}</button>
            </div>
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
            <div class="mtk-biab__logo-control-group mtk-biab__logo-control-group--brand">
              <h3>Brand text</h3>
              <label class="mtk-biab__logo-label">Business name
                <input class="mtk-biab__logo-input" data-logo-field="businessName" type="text" maxlength="40" value="${this._escapeHtml(state.businessName)}">
              </label>
              <label class="mtk-biab__logo-label">Tagline
                <input class="mtk-biab__logo-input" data-logo-field="tagline" type="text" maxlength="70" value="${this._escapeHtml(state.tagline)}">
              </label>
              <div class="mtk-biab__logo-subcontrol">
                <h4>Primary variation</h4>
                <div class="mtk-biab__logo-pill-row">
                  ${MTK_BIAB_LOGO_VARIATIONS.map(option => `
                    <button type="button" role="radio" aria-checked="${option.key === state.variationKey}" class="mtk-biab__logo-pill${option.key === state.variationKey ? ' is-active' : ''}" data-action="logo-set-variation" data-logo-value="${option.key}">
                      <span class="mtk-biab__logo-radio" aria-hidden="true"></span>
                      <span>${option.label}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <div class="mtk-biab__logo-control-group">
              <h3>Icon library</h3>
              <p>Starter test icons for locksmith brands. These are intentionally simple so they remain readable on vans, invoices, and social avatars.</p>
              ${state.customLogo ? '<p><strong>Custom logo uploaded.</strong> It will be used in previews and stationery until another logo is chosen.</p>' : ''}
              <div class="mtk-biab__logo-option-grid">
                ${MTK_BIAB_LOGO_ICONS.map(option => `
                  <button type="button" role="radio" aria-checked="${option.key === state.iconKey}" class="mtk-biab__logo-option-card${option.key === state.iconKey ? ' is-active' : ''}" data-action="logo-set-icon" data-logo-value="${option.key}">
                    <span class="mtk-biab__logo-radio" aria-hidden="true"></span>
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
                  <button type="button" role="radio" aria-checked="${option.key === state.paletteKey}" class="mtk-biab__logo-swatch-card${option.key === state.paletteKey ? ' is-active' : ''}" data-action="logo-set-palette" data-logo-value="${option.key}">
                    <span class="mtk-biab__logo-radio" aria-hidden="true"></span>
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
                  <button type="button" role="radio" aria-checked="${option.key === state.fontKey}" class="mtk-biab__logo-choice${option.key === state.fontKey ? ' is-active' : ''}" data-action="logo-set-font" data-logo-value="${option.key}">
                    <span class="mtk-biab__logo-radio" aria-hidden="true"></span>
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
                  <button type="button" role="radio" aria-checked="${option.key === state.templateKey}" class="mtk-biab__logo-choice${option.key === state.templateKey ? ' is-active' : ''}" data-action="logo-set-template" data-logo-value="${option.key}">
                    <span class="mtk-biab__logo-radio" aria-hidden="true"></span>
                    <strong>${option.label}</strong>
                    <span>${option.description}</span>
                  </button>
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
        <div class="mtk-biab__logo-note">
          <strong>Step 2:</strong> review the rules that keep the logo consistent on invoices, stationery, Google profiles, vans, and the public website.
        </div>
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
          <strong>Step 3:</strong> inspect the production variations. A real handoff should include dark, light, social, favicon, one-color, and vehicle/banner versions.
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
    const iconMarkup = state.customLogo
      ? `<span class="mtk-biab__logo-mark mtk-biab__logo-mark--custom"><img src="${state.customLogo}" alt=""></span>`
      : `<span class="mtk-biab__logo-mark" style="color:${iconColor};--logo-bg:${bgColor};">${icon.svg}</span>`;
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

  _getLang() {
    return (window.i18n && typeof window.i18n.getLang === 'function') ? window.i18n.getLang() : 'en';
  }

  _t(key) {
    const lang = this._getLang();
    return (MTK_BIAB_I18N[lang] && MTK_BIAB_I18N[lang][key]) || MTK_BIAB_I18N.en[key] || key;
  }

  _setLanguage(lang) {
    if (window.i18n && typeof window.i18n.setLang === 'function') {
      window.i18n.setLang(lang);
      return;
    }
    document.documentElement.lang = lang;
    this._handleLanguageChanged();
  }

  _bindLanguageChanges() {
    document.addEventListener('i18n:changed', () => this._handleLanguageChanged());
  }

  _handleLanguageChanged() {
    this._render();
    this._renderDynamicPanels();
    this._renderToolPanels();
    this._activateDefaultTab();
  }

  _openLogoUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        this.logoDesignerState.customLogo = event.target.result;
        this._renderDynamicPanels();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  _buildLogoDataUrl() {
    if (this.logoDesignerState.customLogo) return this.logoDesignerState.customLogo;
    const state = this.logoDesignerState;
    const palette = this._getLogoResource(MTK_BIAB_LOGO_PALETTES, state.paletteKey);
    const name = this._escapeHtml(state.businessName || 'Your Locksmith Brand');
    const tagline = this._escapeHtml(state.tagline || '');
    const initials = name.split(/\s+/).map(word => word.charAt(0)).join('').slice(0, 3).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="240" viewBox="0 0 720 240">
      <rect width="720" height="240" rx="28" fill="${palette.surface}"/>
      <circle cx="108" cy="120" r="58" fill="${palette.primary}"/>
      <text x="108" y="137" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="${palette.surface}">${initials}</text>
      <text x="194" y="108" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="${palette.textOnDark}">${name}</text>
      <text x="196" y="151" font-family="Arial, sans-serif" font-size="22" fill="${palette.accent}">${tagline}</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  _downloadLogoSet() {
    const state = this.logoDesignerState;
    const variants = [
      ['primary-dark', 'primary-dark'],
      ['primary-light', 'primary-light'],
      ['social-icon', 'icon-only'],
      ['one-color', 'mono']
    ];

    variants.forEach(([name, variant]) => {
      this._downloadTextFile(
        `${this._slugify(state.businessName)}-${name}.svg`,
        this._buildExportLogoSvg(variant),
        'image/svg+xml'
      );
    });

    this._downloadTextFile(
      `${this._slugify(state.businessName)}-brand-notes.txt`,
      this._buildLogoBrandNotes(),
      'text/plain'
    );
  }

  _buildExportLogoSvg(variant) {
    const state = this.logoDesignerState;
    const palette = this._getLogoResource(MTK_BIAB_LOGO_PALETTES, state.paletteKey);
    const font = this._getLogoResource(MTK_BIAB_LOGO_FONTS, state.fontKey);
    const name = this._escapeXml(state.businessName || 'Your Locksmith Brand');
    const tagline = this._escapeXml(state.tagline || 'Residential, commercial, automotive');
    const initials = this._escapeXml((state.businessName || 'YLB').split(/\s+/).map(word => word.charAt(0)).join('').slice(0, 3).toUpperCase());
    const isLight = variant === 'primary-light';
    const isMono = variant === 'mono';
    const isIcon = variant === 'icon-only';
    const bg = isLight || isMono ? '#ffffff' : palette.surface;
    const primary = isMono ? '#111827' : palette.primary;
    const text = isLight || isMono ? palette.textOnLight : palette.textOnDark;
    const accent = isMono ? '#111827' : palette.accent;
    const width = isIcon ? 512 : 1440;
    const height = isIcon ? 512 : 480;

    if (isIcon) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${name} icon">
  <rect width="${width}" height="${height}" rx="112" fill="${palette.surface}"/>
  <circle cx="256" cy="256" r="142" fill="${primary}"/>
  <text x="256" y="289" text-anchor="middle" font-family="Arial, sans-serif" font-size="112" font-weight="800" fill="${palette.surface}">${initials}</text>
</svg>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${name} logo">
  <rect width="${width}" height="${height}" rx="56" fill="${bg}"/>
  <circle cx="220" cy="240" r="116" fill="${primary}"/>
  <text x="220" y="274" text-anchor="middle" font-family="Arial, sans-serif" font-size="86" font-weight="800" fill="${bg}">${initials}</text>
  <text x="390" y="218" font-family="${this._escapeXml(font.headline.replace(/'/g, ''))}" font-size="86" font-weight="800" fill="${text}">${name}</text>
  <text x="394" y="292" font-family="${this._escapeXml(font.body.replace(/'/g, ''))}" font-size="40" fill="${accent}">${tagline}</text>
</svg>`;
  }

  _buildLogoBrandNotes() {
    const state = this.logoDesignerState;
    const palette = this._getLogoResource(MTK_BIAB_LOGO_PALETTES, state.paletteKey);
    const font = this._getLogoResource(MTK_BIAB_LOGO_FONTS, state.fontKey);
    const template = this._getLogoResource(MTK_BIAB_LOGO_TEMPLATES, state.templateKey);
    const variation = this._getLogoResource(MTK_BIAB_LOGO_VARIATIONS, state.variationKey);
    return [
      `${state.businessName || 'Your Locksmith Brand'} - Logo Package`,
      '',
      `Tagline: ${state.tagline || ''}`,
      `Template: ${template.label}`,
      `Primary variation: ${variation.label}`,
      `Palette: ${palette.label}`,
      `Base color: ${palette.surface}`,
      `Primary color: ${palette.primary}`,
      `Accent color: ${palette.accent}`,
      `Headline font: ${font.label}`,
      '',
      'Included files:',
      '- primary-dark.svg',
      '- primary-light.svg',
      '- social-icon.svg',
      '- one-color.svg',
      '',
      'Production notes:',
      '- Use SVG for websites, signs, print, and embroidery vendor handoff.',
      '- Keep clear space around the logo equal to at least half the icon width.',
      '- Do not stretch, outline, bevel, or add drop shadows to the mark.',
      '- Replace prototype icons/fonts with licensed production assets before final commercial use.'
    ].join('\n');
  }

  _downloadTextFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  _slugify(value) {
    return String(value || 'locksmith-logo').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'locksmith-logo';
  }

  _escapeXml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  _applyLogoToClient() {
    const logo = this._buildLogoDataUrl();
    const payload = {
      logo,
      businessName: this.logoDesignerState.businessName,
      tagline: this.logoDesignerState.tagline
    };
    try {
      localStorage.setItem('nalaBiabLogo', JSON.stringify(payload));
    } catch (err) {
      wc.warn('[mtk-biab] Could not save logo locally', err);
    }

    const iframe = this.el.querySelector('#mtk-biab-iframe-website-maker');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'nala:biab-logo', payload }, '*');
    }

    wc.publish('mtk-biab:logo-applied', payload);
    if (window.MTKMsgs && typeof MTKMsgs.show === 'function') {
      MTKMsgs.show({ type: 'success', icon: 'success', message: this._t('logoApplied'), closable: true, timer: 5 });
    }
  }

  _getDefaultFormState() {
    return {
      'business-plan': {
        businessName: 'Harbor Lock & Key',
        ownerName: '',
        serviceArea: '',
        coreServices: 'Rekeys, lock changes, lockouts, deadbolt installation',
        customerFocus: 'Homeowners, property managers, small businesses',
        launchGoal: 'Book the first 25 paid locksmith jobs and collect 10 reviews.',
        pricingPlan: 'Use fixed service call pricing plus itemized labor and parts.',
        marketingPlan: 'Google Business Profile, local SEO, review requests, and tightly targeted ads.'
      },
      'startup-checklist': {
        legal: '',
        phoneEmail: '',
        website: '',
        profile: '',
        insurance: '',
        payments: '',
        launch: ''
      },
      'invoice-setup': {
        id: '',
        businessName: 'Harbor Lock & Key',
        dbaName: '',
        businessAddress: '',
        businessPhone: '',
        businessEmail: '',
        businessWebsite: '',
        licenseNumber: '',
        invoiceNumber: 'HLK-0001',
        invoiceDate: new Date().toISOString().slice(0, 10),
        customerName: '',
        customerEmail: '',
        serviceAddress: '',
        billingAddress: '',
        workDescription: 'Opened front entry door using non-destructive methods where possible, rekeyed 2 cylinders, cut 4 keys, tested operation with customer, and confirmed proper latch and key function before leaving.',
        serviceFeeDescription: 'Service call / trip fee',
        serviceFeeAmount: '0.00',
        laborDescription: 'Locksmith labor',
        laborAmount: '0.00',
        partsDescription: 'Parts / hardware',
        partsAmount: '0.00',
        taxAmount: '0.00',
        paymentTerms: 'Due on receipt',
        paymentMethod: '',
        paymentStatus: 'Unpaid',
        technician: '',
        authorizationNote: 'Authorization confirmed by customer before work began.',
        warranty: 'Workmanship warranty applies to installed parts and labor unless otherwise stated.',
        disclosureNote: 'No warranty on customer-supplied parts unless stated. Destructive entry and after-hours fees are disclosed before work begins.'
      }
    };
  }

  _getDefaultReviewState() {
    return {
      request: {
        customerName: '',
        customerEmail: '',
        jobType: ''
      },
      reviews: []
    };
  }

  _moveToolStep(tool, direction) {
    const steps = this._getToolSteps(tool);
    const current = this.formSteps[tool] || 0;
    this.formSteps[tool] = Math.max(0, Math.min(steps.length - 1, current + direction));
    this._renderToolPanels();
  }

  _updateToolField(tool, field, value) {
    if (!this.formState[tool]) return;
    this.formState[tool][field] = value;
    this._renderToolPreview(tool);
  }

  _getToolSteps(tool) {
    const map = {
      'business-plan': [
        { title: this._t('businessInfo'), fields: ['businessName', 'ownerName', 'serviceArea'] },
        { title: this._t('serviceSetup'), fields: ['coreServices', 'customerFocus'] },
        { title: this._t('marketingSetup'), fields: ['launchGoal', 'pricingPlan', 'marketingPlan'] }
      ],
      'startup-checklist': [
        { title: this._t('businessInfo'), fields: ['legal', 'phoneEmail'] },
        { title: this._t('marketingSetup'), fields: ['website', 'profile'] },
        { title: this._t('operations'), fields: ['insurance', 'payments', 'launch'] }
      ],
      'invoice-setup': [
        { title: 'Business and invoice details', fields: ['invoiceNumber', 'invoiceDate', 'businessName', 'dbaName', 'businessAddress', 'businessPhone', 'businessEmail', 'businessWebsite', 'licenseNumber'] },
        { title: 'Customer and job details', fields: ['customerName', 'customerEmail', 'serviceAddress', 'billingAddress', 'technician', 'workDescription'] },
        { title: 'Itemized charges', fields: ['serviceFeeDescription', 'serviceFeeAmount', 'laborDescription', 'laborAmount', 'partsDescription', 'partsAmount', 'taxAmount'] },
        { title: 'Payment and disclosures', fields: ['paymentTerms', 'paymentMethod', 'paymentStatus', 'authorizationNote', 'warranty', 'disclosureNote'] }
      ]
    };
    return map[tool] || [];
  }

  _renderBusinessPlanTool() {
    this._renderWizardTool('business-plan', 'Business Plan Builder');
  }

  _renderStartupTool() {
    this._renderWizardTool('startup-checklist', 'Startup Checklist Builder');
  }

  _renderInvoiceTool() {
    this._renderWizardTool('invoice-setup', 'Invoice Setup Builder');
    this._renderInvoiceRecords();
    this._loadSavedInvoices();
  }

  _renderWizardTool(tool, heading) {
    const mount = this.el.querySelector(`[data-biab-tool="${tool}"]`);
    if (!mount) return;
    const steps = this._getToolSteps(tool);
    const stepIndex = this.formSteps[tool] || 0;
    const active = steps[stepIndex] || steps[0];
    const state = this.formState[tool] || {};
    const isInvoice = tool === 'invoice-setup';
    mount.innerHTML = `
      <section class="mtk-biab-tool">
        <div class="mtk-biab-tool__head">
          <div>
            <span class="mtk-biab__logo-badge">${this._t('step')} ${stepIndex + 1} / ${steps.length}</span>
            <h3>${heading}</h3>
            <p>${active.title}</p>
          </div>
          <div class="mtk-biab-tool__actions">
            ${isInvoice ? `<button type="button" class="mtk-biab__action-btn mtk-biab__action-btn--primary" data-action="invoice-save">Save Invoice</button>` : ''}
            <button type="button" class="mtk-biab__action-btn" data-action="tool-download" data-tool="${tool}">${this._t('download')}</button>
            <button type="button" class="mtk-biab__action-btn" data-action="tool-email" data-tool="${tool}">${this._t('email')}</button>
          </div>
        </div>
        <div class="mtk-biab-tool__grid">
          <div class="mtk-biab-tool__form">
            ${active.fields.map(field => this._buildToolField(tool, field, state[field])).join('')}
            <div class="mtk-biab-tool__nav">
              <button type="button" class="mtk-biab__action-btn" data-action="tool-prev" data-tool="${tool}" ${stepIndex === 0 ? 'disabled' : ''}>${this._t('previous')}</button>
              <button type="button" class="mtk-biab__action-btn mtk-biab__action-btn--primary" data-action="tool-next" data-tool="${tool}" ${stepIndex === steps.length - 1 ? 'disabled' : ''}>${this._t('next')}</button>
            </div>
          </div>
          <article class="mtk-biab-tool__preview" data-tool-preview="${tool}">
            ${this._buildToolDocument(tool)}
          </article>
        </div>
        ${isInvoice ? '<div class="mtk-biab-invoice-records" data-invoice-records></div>' : ''}
      </section>
    `;
  }

  _renderLogoDownloadsPanel() {
    const mount = this.el.querySelector('[data-logo-designer-panel="downloads"]');
    if (!mount) return;

    const state = this.logoDesignerState;
    const palette = this._getLogoResource(MTK_BIAB_LOGO_PALETTES, state.paletteKey);
    const font = this._getLogoResource(MTK_BIAB_LOGO_FONTS, state.fontKey);
    const template = this._getLogoResource(MTK_BIAB_LOGO_TEMPLATES, state.templateKey);

    mount.innerHTML = `
      <section class="mtk-biab__logo-downloads">
        <div class="mtk-biab__logo-note">
          <strong>Step 4:</strong> download a professional starter logo set. The files are vector SVGs, so they can be used by a designer, printer, website builder, or sign shop.
        </div>
        <div class="mtk-biab__logo-download-grid">
          <article class="mtk-biab__logo-download-card">
            <span class="material-icons" aria-hidden="true">folder_zip</span>
            <h3>Professional logo set</h3>
            <p>Includes primary dark, primary light, social icon, one-color mark, and a brand notes file with colors, typography, and usage guidance.</p>
            <button type="button" class="mtk-biab__action-btn mtk-biab__action-btn--primary" data-action="logo-download-set">Download logo set</button>
          </article>
          <article class="mtk-biab__logo-download-card">
            <span class="material-icons" aria-hidden="true">fact_check</span>
            <h3>Package summary</h3>
            <ul>
              <li><strong>Business:</strong> ${this._escapeHtml(state.businessName)}</li>
              <li><strong>Template:</strong> ${template.label}</li>
              <li><strong>Palette:</strong> ${palette.label}</li>
              <li><strong>Font system:</strong> ${font.label}</li>
              <li><strong>Format:</strong> SVG vector files plus brand notes</li>
            </ul>
          </article>
        </div>
        <div class="mtk-biab__logo-preview-grid">
          ${this._buildLogoPreviewCard('Included: dark primary', this._buildLogoMarkup(state, 'primary-dark'), palette.surface, palette.textOnDark)}
          ${this._buildLogoPreviewCard('Included: light primary', this._buildLogoMarkup(state, 'primary-light'), '#ffffff', palette.textOnLight, true)}
          ${this._buildLogoPreviewCard('Included: icon mark', this._buildLogoMarkup(state, 'icon-only'), palette.surfaceSoft, palette.textOnDark)}
          ${this._buildLogoPreviewCard('Included: one-color mark', this._buildLogoMarkup(state, 'mono'), '#f3f4f6', '#111827', true)}
        </div>
      </section>
    `;
  }

  _buildToolField(tool, field, value) {
    const labels = {
      businessName: 'Business name',
      ownerName: 'Owner name',
      serviceArea: 'Service area',
      coreServices: 'Core services',
      customerFocus: 'Customer focus',
      launchGoal: 'Launch goal',
      pricingPlan: 'Pricing plan',
      marketingPlan: 'Marketing plan',
      legal: 'Registration / licensing steps',
      phoneEmail: 'Phone and email setup',
      website: 'Website setup',
      profile: 'Google Business Profile setup',
      insurance: 'Insurance / compliance',
      payments: 'Payments and bookkeeping',
      launch: 'Launch-day checklist',
      invoicePrefix: 'Invoice prefix',
      invoiceNumber: 'Invoice number',
      invoiceDate: 'Invoice date',
      dbaName: 'DBA name, if used',
      businessAddress: 'Business address / mailing address',
      businessPhone: 'Business phone',
      businessEmail: 'Business email',
      businessWebsite: 'Business website',
      licenseNumber: 'License number, if required',
      customerName: 'Customer name',
      customerEmail: 'Customer email',
      serviceAddress: 'Service address',
      billingAddress: 'Billing address, if different',
      workDescription: 'Clear description of work performed',
      serviceFeeDescription: 'Service fee description',
      serviceFeeAmount: 'Service fee amount',
      laborDescription: 'Labor line item',
      laborAmount: 'Labor amount',
      partsDescription: 'Parts / hardware line item',
      partsAmount: 'Parts / hardware amount',
      taxAmount: 'Tax amount, if applicable',
      paymentTerms: 'Payment terms',
      paymentMethod: 'Payment method',
      paymentStatus: 'Payment status',
      technician: 'Technician name or ID',
      authorizationNote: 'Authorization note',
      taxLine: 'Tax line',
      warranty: 'Warranty note',
      disclosureNote: 'Other disclosures'
    };
    const fieldValue = this._escapeHtml(value || '');
    const amountFields = new Set(['serviceFeeAmount', 'laborAmount', 'partsAmount', 'taxAmount']);
    const longFields = new Set(['businessAddress', 'serviceAddress', 'billingAddress', 'workDescription', 'authorizationNote', 'warranty', 'disclosureNote']);
    const inputTypes = {
      invoiceDate: 'date',
      businessEmail: 'email',
      customerEmail: 'email',
      businessWebsite: 'url',
      businessPhone: 'tel'
    };
    if (field === 'paymentStatus') {
      return `
        <label class="mtk-biab-tool__field">${labels[field] || field}
          <select data-tool="${tool}" data-tool-field="${field}">
            ${['Unpaid', 'Paid', 'Partially paid'].map(option => `<option value="${option}" ${value === option ? 'selected' : ''}>${option}</option>`).join('')}
          </select>
        </label>
      `;
    }
    if (amountFields.has(field)) {
      return `
        <label class="mtk-biab-tool__field">${labels[field] || field}
          <input data-tool="${tool}" data-tool-field="${field}" type="number" min="0" step="0.01" value="${fieldValue}">
        </label>
      `;
    }
    if (longFields.has(field)) {
      return `
        <label class="mtk-biab-tool__field">${labels[field] || field}
          <textarea data-tool="${tool}" data-tool-field="${field}" rows="3">${fieldValue}</textarea>
        </label>
      `;
    }
    return `
      <label class="mtk-biab-tool__field">${labels[field] || field}
        <input data-tool="${tool}" data-tool-field="${field}" type="${inputTypes[field] || 'text'}" value="${fieldValue}">
      </label>
    `;
  }

  _renderToolPreview(tool) {
    const target = this.el.querySelector(`[data-tool-preview="${tool}"]`);
    if (target) target.innerHTML = this._buildToolDocument(tool);
  }

  _buildToolDocument(tool) {
    const s = this.formState[tool] || {};
    if (tool === 'startup-checklist') {
      return `<h3>${this._t('finalDocument')}</h3><ol><li>${this._escapeHtml(s.legal)}</li><li>${this._escapeHtml(s.phoneEmail)}</li><li>${this._escapeHtml(s.website)}</li><li>${this._escapeHtml(s.profile)}</li><li>${this._escapeHtml(s.insurance)}</li><li>${this._escapeHtml(s.payments)}</li><li>${this._escapeHtml(s.launch)}</li></ol>`;
    }
    if (tool === 'invoice-setup') {
      return this._buildInvoiceDocument(s);
    }
    return `<h3>${this._escapeHtml(s.businessName || 'Business Plan')}</h3><p><strong>Owner:</strong> ${this._escapeHtml(s.ownerName)}</p><p><strong>Service area:</strong> ${this._escapeHtml(s.serviceArea)}</p><p><strong>Core services:</strong> ${this._escapeHtml(s.coreServices)}</p><p><strong>Customer focus:</strong> ${this._escapeHtml(s.customerFocus)}</p><p><strong>Launch goal:</strong> ${this._escapeHtml(s.launchGoal)}</p><p><strong>Pricing:</strong> ${this._escapeHtml(s.pricingPlan)}</p><p><strong>Marketing:</strong> ${this._escapeHtml(s.marketingPlan)}</p>`;
  }

  _buildInvoiceDocument(s) {
    const raw = value => Number(String(value || '0').replace(/[^0-9.-]/g, '')) || 0;
    const money = value => '$' + raw(value).toFixed(2);
    const subtotal = raw(s.serviceFeeAmount) + raw(s.laborAmount) + raw(s.partsAmount);
    const tax = raw(s.taxAmount);
    const total = subtotal + tax;

    return `
      <article class="mtk-biab-invoice">
        <header class="mtk-biab-invoice__header">
          <div>
            <h3>${this._escapeHtml(s.businessName || 'Locksmith Business')}</h3>
            ${s.dbaName ? `<p><strong>DBA:</strong> ${this._escapeHtml(s.dbaName)}</p>` : ''}
            <p>${this._escapeHtml(s.businessAddress || 'Business address / mailing address')}</p>
            <p>${this._escapeHtml(s.businessPhone || 'Business phone')} · ${this._escapeHtml(s.businessEmail || 'Business email')}</p>
            ${s.businessWebsite ? `<p>${this._escapeHtml(s.businessWebsite)}</p>` : ''}
            ${s.licenseNumber ? `<p><strong>License:</strong> ${this._escapeHtml(s.licenseNumber)}</p>` : ''}
          </div>
          <div class="mtk-biab-invoice__meta">
            <h4>Invoice</h4>
            <p><strong>No.</strong> ${this._escapeHtml(s.invoiceNumber || '')}</p>
            <p><strong>Date:</strong> ${this._escapeHtml(s.invoiceDate || '')}</p>
            <p><strong>Status:</strong> ${this._escapeHtml(s.paymentStatus || '')}</p>
          </div>
        </header>

        <section class="mtk-biab-invoice__parties">
          <div>
            <h4>Bill To</h4>
            <p>${this._escapeHtml(s.customerName || 'Customer name')}</p>
            ${s.customerEmail ? `<p>${this._escapeHtml(s.customerEmail)}</p>` : ''}
            <p>${this._escapeHtml(s.billingAddress || s.serviceAddress || 'Billing address')}</p>
          </div>
          <div>
            <h4>Service Location</h4>
            <p>${this._escapeHtml(s.serviceAddress || 'Service address')}</p>
            ${s.technician ? `<p><strong>Technician:</strong> ${this._escapeHtml(s.technician)}</p>` : ''}
          </div>
        </section>

        <section class="mtk-biab-invoice__work">
          <h4>Work Performed</h4>
          <p>${this._escapeHtml(s.workDescription || '')}</p>
        </section>

        <table class="mtk-biab-invoice__table">
          <thead><tr><th>Description</th><th>Amount</th></tr></thead>
          <tbody>
            <tr><td>${this._escapeHtml(s.serviceFeeDescription || 'Service call / trip fee')}</td><td>${money(s.serviceFeeAmount)}</td></tr>
            <tr><td>${this._escapeHtml(s.laborDescription || 'Labor')}</td><td>${money(s.laborAmount)}</td></tr>
            <tr><td>${this._escapeHtml(s.partsDescription || 'Parts / hardware')}</td><td>${money(s.partsAmount)}</td></tr>
          </tbody>
          <tfoot>
            <tr><th>Subtotal</th><td>${money(subtotal)}</td></tr>
            <tr><th>Tax</th><td>${money(tax)}</td></tr>
            <tr><th>Total</th><td>${money(total)}</td></tr>
          </tfoot>
        </table>

        <section class="mtk-biab-invoice__terms">
          <p><strong>Payment terms:</strong> ${this._escapeHtml(s.paymentTerms || '')}</p>
          <p><strong>Payment method:</strong> ${this._escapeHtml(s.paymentMethod || 'Not recorded')}</p>
          <p><strong>Authorization:</strong> ${this._escapeHtml(s.authorizationNote || '')}</p>
          <p><strong>Warranty:</strong> ${this._escapeHtml(s.warranty || '')}</p>
          <p><strong>Disclosures:</strong> ${this._escapeHtml(s.disclosureNote || '')}</p>
        </section>
      </article>
    `;
  }

  _invoiceTotal(invoice = this.formState['invoice-setup'] || {}) {
    const raw = value => Number(String(value || '0').replace(/[^0-9.-]/g, '')) || 0;
    return raw(invoice.serviceFeeAmount) + raw(invoice.laborAmount) + raw(invoice.partsAmount) + raw(invoice.taxAmount);
  }

  _formatInvoiceMoney(value) {
    return '$' + (Number(value || 0) || 0).toFixed(2);
  }

  _getInvoicePayload() {
    return Object.assign({}, this.formState['invoice-setup'] || {}, {
      total: this._invoiceTotal()
    });
  }

  _renderInvoiceRecords() {
    const mount = this.el.querySelector('[data-invoice-records]');
    if (!mount) return;
    const records = Array.isArray(this.invoiceState.records) ? this.invoiceState.records : [];
    mount.innerHTML = `
      <div class="mtk-biab-invoice-records__head">
        <div>
          <h4>Saved invoices</h4>
          <p>Invoice records are saved for this Business in a Box page and can be loaded back into the builder.</p>
        </div>
        <span class="mtk-biab-invoice-records__status${this.invoiceState.statusIsError ? ' is-error' : ''}" aria-live="polite">${this._escapeHtml(this.invoiceState.status || '')}</span>
      </div>
      <div class="mtk-biab-invoice-records__list">
        ${records.length ? records.map(record => this._buildInvoiceRecordCard(record)).join('') : '<p class="mtk-biab-invoice-records__empty">No invoices saved yet.</p>'}
      </div>
    `;
  }

  _buildInvoiceRecordCard(record) {
    const invoice = record.invoice || {};
    const id = this._escapeHtml(record.id || invoice.id || '');
    const number = this._escapeHtml(record.invoiceNumber || invoice.invoiceNumber || 'Invoice');
    const customer = this._escapeHtml(record.customerName || invoice.customerName || 'Customer not entered');
    const date = this._escapeHtml(record.invoiceDate || invoice.invoiceDate || '');
    const status = this._escapeHtml(record.paymentStatus || invoice.paymentStatus || '');
    const updated = this._escapeHtml(record.updatedAt ? String(record.updatedAt).slice(0, 10) : '');
    return `
      <article class="mtk-biab-invoice-records__card">
        <div>
          <strong>${number}</strong>
          <span>${customer}</span>
          <small>${date}${updated ? ` · saved ${updated}` : ''}</small>
        </div>
        <div>
          <strong>${this._formatInvoiceMoney(record.total !== undefined ? record.total : this._invoiceTotal(invoice))}</strong>
          <span>${status}</span>
          <button type="button" class="mtk-biab__action-btn" data-action="invoice-load" data-invoice-id="${id}">Load</button>
        </div>
      </article>
    `;
  }

  _setInvoiceStatus(message, isError = false) {
    this.invoiceState.status = message || '';
    this.invoiceState.statusIsError = !!isError;
    this._renderInvoiceRecords();
  }

  _loadSavedInvoices() {
    const uid = this._getReviewUid();
    if (!uid || this.invoiceState.loadedForUid === uid || !window.fetch) return;
    this.invoiceState.loadedForUid = uid;
    fetch((window.wc && wc.apiURL ? wc.apiURL : '') + `/api/business_in_a_box_invoices.php?nalaUID=${encodeURIComponent(uid)}`, {
      credentials: 'include'
    })
      .then(res => res.json().then(json => {
        if (!res.ok) throw new Error((json && (json.error || json.message)) || 'Could not load invoices.');
        return json;
      }))
      .then(json => {
        this.invoiceState.records = Array.isArray(json.invoices) ? json.invoices : [];
        this._renderInvoiceRecords();
      })
      .catch(err => {
        this.invoiceState.loadedForUid = '';
        this._setInvoiceStatus(err && err.message ? err.message : 'Could not load invoices.', true);
        if (window.wc && wc.warn) wc.warn('[mtk-biab] Could not load saved invoices', err);
      });
  }

  _saveInvoiceRecord(options = {}) {
    const uid = this._getReviewUid();
    if (!window.fetch) {
      if (!options.silent) this._setInvoiceStatus('This browser cannot save invoice records.', true);
      return Promise.resolve(null);
    }
    const payload = {
      nalaUID: uid,
      invoice: this._getInvoicePayload()
    };
    if (!options.silent) this._setInvoiceStatus('Saving invoice...');
    return fetch((window.wc && wc.apiURL ? wc.apiURL : '') + '/api/business_in_a_box_invoices.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json().then(json => {
        if (!res.ok) throw new Error((json && (json.error || json.message)) || 'Could not save invoice.');
        return json;
      }))
      .then(json => {
        if (json && json.id) this.formState['invoice-setup'].id = json.id;
        this.invoiceState.records = Array.isArray(json.invoices) ? json.invoices : this.invoiceState.records;
        if (!options.silent) this._setInvoiceStatus('Invoice saved.');
        else this._renderInvoiceRecords();
        return json;
      })
      .catch(err => {
        if (!options.silent) this._setInvoiceStatus(err && err.message ? err.message : 'Could not save invoice.', true);
        throw err;
      });
  }

  _loadInvoiceRecord(id) {
    const record = (this.invoiceState.records || []).find(item => item.id === id);
    if (!record || !record.invoice) return;
    this.formState['invoice-setup'] = Object.assign({}, this.formState['invoice-setup'], record.invoice, { id: record.id });
    this.formSteps['invoice-setup'] = 0;
    this._renderInvoiceTool();
    this._setInvoiceStatus('Invoice loaded.');
  }

  _handleToolDownload(tool) {
    if (tool === 'invoice-setup') {
      this._saveInvoiceRecord({ silent: true }).catch(() => null).finally(() => this._downloadToolDocument(tool));
      return;
    }
    this._downloadToolDocument(tool);
  }

  _handleToolEmail(tool) {
    if (tool === 'invoice-setup') {
      this._saveInvoiceRecord({ silent: true }).catch(() => null).finally(() => this._emailToolDocument(tool));
      return;
    }
    this._emailToolDocument(tool);
  }

  _downloadToolDocument(tool) {
    const invoiceStyles = tool === 'invoice-setup' ? `<style>
      body{margin:24px;font-family:Arial,sans-serif;color:#202124;background:#f7f3eb}.mtk-biab-invoice{max-width:900px;margin:auto;border:1px solid #d9cda9;border-radius:10px;background:#fff;overflow:hidden}.mtk-biab-invoice__header,.mtk-biab-invoice__parties,.mtk-biab-invoice__work,.mtk-biab-invoice__terms{padding:18px}.mtk-biab-invoice__header{display:grid;grid-template-columns:minmax(0,1fr)190px;gap:18px;background:#fffaf0;border-bottom:1px solid #eadfca}.mtk-biab-invoice__header h3{margin:0 0 8px;font-size:24px}.mtk-biab-invoice p{margin:0 0 6px;line-height:1.55}.mtk-biab-invoice__meta{padding:14px;border-radius:8px;background:#202124;color:#fff}.mtk-biab-invoice__parties{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;border-bottom:1px solid #eadfca}.mtk-biab-invoice h4{margin:0 0 8px;color:#4a3a08;font-size:14px;text-transform:uppercase}.mtk-biab-invoice__work{border-bottom:1px solid #eadfca}.mtk-biab-invoice__table{width:100%;border-collapse:collapse;font-size:14px}.mtk-biab-invoice__table th,.mtk-biab-invoice__table td{padding:12px 18px;border-bottom:1px solid #eadfca;text-align:left}.mtk-biab-invoice__table th:last-child,.mtk-biab-invoice__table td:last-child{text-align:right;white-space:nowrap}.mtk-biab-invoice__table thead th{background:#fbf4e5;color:#4a3a08}.mtk-biab-invoice__table tfoot th,.mtk-biab-invoice__table tfoot td{font-weight:800}.mtk-biab-invoice__table tfoot tr:last-child th,.mtk-biab-invoice__table tfoot tr:last-child td{background:#202124;color:#fff;font-size:16px}.mtk-biab-invoice__terms{background:#fffdf8}@media(max-width:700px){.mtk-biab-invoice__header,.mtk-biab-invoice__parties{grid-template-columns:1fr}}
    </style>` : '';
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${tool}</title>${invoiceStyles}</head><body>${this._buildToolDocument(tool)}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${tool}-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  _emailToolDocument(tool) {
    const text = this._buildToolDocument(tool).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (tool === 'invoice-setup') {
      const s = this.formState[tool] || {};
      const subject = `Invoice ${s.invoiceNumber || ''} from ${s.businessName || 'Locksmith Business'}`.trim();
      window.location.href = `mailto:${encodeURIComponent(s.customerEmail || '')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      return;
    }
    window.location.href = `mailto:?subject=${encodeURIComponent(tool.replace(/-/g, ' '))}&body=${encodeURIComponent(text)}`;
  }

  _renderReviewsTool() {
    const mount = this.el.querySelector('[data-biab-tool="reviews"]');
    if (!mount) return;
    this._loadSavedReviewState();
    const request = this.reviewState.request;
    const reviews = this.reviewState.reviews;
    const ratingTotal = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    const ratingCount = reviews.length;
    const average = ratingCount ? (ratingTotal / ratingCount).toFixed(1) : '0.0';
    const publishedCount = reviews.filter(review => review.published).length;
    const reviewUrl = this._buildReviewUrl();

    mount.innerHTML = `
      <section class="mtk-biab-tool mtk-biab-reviews">
        <div class="mtk-biab-tool__head">
          <div>
            <span class="mtk-biab__logo-badge">${this._t('allRatingsCount')}</span>
            <h3>Review Requests</h3>
            <p>${this._t('reviewsIntro')}</p>
          </div>
          <div class="mtk-biab-reviews__score" aria-label="Current rating">
            <strong>${average}</strong>
            <span>${'★'.repeat(Math.round(Number(average)))}</span>
            <small>${ratingCount} ratings · ${publishedCount} shown</small>
          </div>
        </div>

        <div class="mtk-biab-tool__grid">
          <form class="mtk-biab-tool__form" onsubmit="return false">
            <label class="mtk-biab-tool__field">${this._t('customerName')}
              <input data-review-field="customerName" type="text" value="${this._escapeHtml(request.customerName)}" placeholder="Jane Customer">
            </label>
            <label class="mtk-biab-tool__field">${this._t('customerEmail')}
              <input data-review-field="customerEmail" type="email" value="${this._escapeHtml(request.customerEmail)}" placeholder="jane@example.com">
            </label>
            <label class="mtk-biab-tool__field">${this._t('jobType')}
              <textarea data-review-field="jobType" rows="3" placeholder="Rekey, lockout, lock change...">${this._escapeHtml(request.jobType)}</textarea>
            </label>
            <label class="mtk-biab-tool__field">${this._t('publicReviewLink')}
              <input type="text" readonly value="${this._escapeHtml(reviewUrl)}">
            </label>
            <button type="button" class="mtk-biab__action-btn mtk-biab__action-btn--primary mtk-biab-reviews__send" data-action="review-send-request">
              ${this._t('sendReviewRequest')}
            </button>
            <p class="mtk-biab-reviews__message" data-review-message aria-live="polite"></p>
          </form>

          <article class="mtk-biab-tool__preview">
            <h3>${this._t('publishedReviews')}</h3>
            <p>Written reviews can be hidden from the public webpage, but the rating number remains part of the business average.</p>
            <div class="mtk-biab-reviews__list">
              ${reviews.length ? reviews.map(review => this._buildReviewModerationCard(review)).join('') : '<p>No customer reviews have been submitted yet.</p>'}
            </div>
          </article>
        </div>
      </section>
    `;
  }

  _buildReviewModerationCard(review) {
    const status = review.published ? this._t('visibleOnWebsite') : this._t('hiddenOnWebsite');
    return `
      <article class="mtk-biab-reviews__card${review.published ? ' is-published' : ''}">
        <div>
          <strong>${this._escapeHtml(review.customerName)}</strong>
          <span class="mtk-biab-reviews__stars">${'★'.repeat(Number(review.rating || 0))}</span>
          <small>${this._escapeHtml(review.createdAt)}</small>
        </div>
        <p>${this._escapeHtml(review.text)}</p>
        <button type="button" class="mtk-biab__action-btn" data-action="review-toggle-published" data-review-id="${this._escapeHtml(review.id)}">
          ${status}
        </button>
      </article>
    `;
  }

  _getReviewUid() {
    let uid = (window.config && window.config.nalaUID) || '';
    try {
      const iframe = this.el.querySelector('#mtk-biab-iframe-website-maker');
      const profile = iframe && iframe.contentWindow && iframe.contentWindow._clientProfileInstance;
      if (profile && profile.data && profile.data.nalaUID) uid = profile.data.nalaUID;
    } catch (err) {
      wc.warn('[mtk-biab] Could not read Website Maker profile UID', err);
    }
    return uid || 'U12345';
  }

  _buildReviewUrl(token = '') {
    const origin = window.location.origin || '';
    const uid = this._getReviewUid();
    const tokenQuery = token ? `&token=${encodeURIComponent(token)}` : '';
    return `${origin}/repo_deploy/client/review.html?nalaUID=${encodeURIComponent(uid)}${tokenQuery}`;
  }

  _sendReviewRequest() {
    const request = this.reviewState.request;
    const token = this._createReviewToken();
    const payload = {
      nalaUID: this._getReviewUid(),
      token,
      customerName: request.customerName.trim(),
      customerEmail: request.customerEmail.trim(),
      jobType: request.jobType.trim(),
      reviewUrl: this._buildReviewUrl(token)
    };

    if (!payload.customerName || !payload.customerEmail) {
      this._setReviewMessage(this._t('reviewValidation'), true);
      return;
    }

    wc.publish('mtk-biab:review-request', payload);
    if (window.MTKMsgs && typeof MTKMsgs.show === 'function') {
      MTKMsgs.show({ type: 'success', icon: 'success', message: 'Review request queued for email delivery.', closable: true, timer: 6 });
    }
    this.reviewState.request = { customerName: '', customerEmail: '', jobType: '' };
    this._renderReviewsTool();
  }

  _setReviewMessage(message, isError = false) {
    const target = this.el.querySelector('[data-review-message]');
    if (!target) return;
    target.textContent = message;
    target.classList.toggle('is-error', isError);
  }

  _createReviewToken() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'review-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  }

  _loadSavedReviewState() {
    const uid = this._getReviewUid();
    if (!uid || this.reviewsLoadedForUid === uid || !window.fetch) return;
    this.reviewsLoadedForUid = uid;

    fetch((window.wc && wc.apiURL ? wc.apiURL : '') + `/api/business_in_a_box_reviews.php?nalaUID=${encodeURIComponent(uid)}`, {
      credentials: 'include'
    }).then(res => res.json().then(json => {
      if (!res.ok) throw new Error((json && (json.error || json.message)) || 'Could not load reviews.');
      return json;
    })).then(json => {
      if (Array.isArray(json.reviews) && json.reviews.length) {
        this.reviewState.reviews = json.reviews;
        this._renderReviewsTool();
      }
    }).catch(err => {
      wc.warn('[mtk-biab] Could not load saved reviews', err);
    });
  }

  _toggleReviewPublished(reviewId) {
    const review = this.reviewState.reviews.find(item => item.id === reviewId);
    if (!review) return;
    review.published = !review.published;
    wc.publish('mtk-biab:reviews-save', {
      nalaUID: this._getReviewUid(),
      reviews: this.reviewState.reviews,
      rating: this._calculateReviewAverage(),
      reviewCount: this.reviewState.reviews.length
    });
    this._renderReviewsTool();
  }

  _calculateReviewAverage() {
    const reviews = this.reviewState.reviews;
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }

  _renderAutomationTool() {
    const mount = this.el.querySelector('[data-biab-tool="automation-options"]');
    if (!mount) return;
    mount.innerHTML = `
      <section class="mtk-biab-tool">
        <div class="mtk-biab-tool__head"><div><h3>Automation Readiness</h3><p>${this._t('automationIntro')}</p></div></div>
        <div class="mtk-biab-api-grid">
          ${[
            ['Google Ads API', 'Create accounts/campaign pieces, keywords, budgets, conversion actions after OAuth and developer-token approval.', 'https://developers.google.com/google-ads/api/docs/start'],
            ['Business Profile APIs', 'Read and manage business locations, attributes, photos, and some profile data after account authorization.', 'https://developers.google.com/my-business'],
            ['Search Console API', 'Add verified sites, inspect URLs, submit sitemaps, and read performance data.', 'https://developers.google.com/webmaster-tools'],
            ['Google Analytics Admin API', 'Create/manage GA4 properties and data streams when authorized.', 'https://developers.google.com/analytics/devguides/config/admin/v1'],
            ['Local Services Ads', 'API surface is limited compared with standard Google Ads; eligibility and screening still require Google workflows.', 'https://developers.google.com/google-ads/api/docs/campaigns/local-service-campaigns']
          ].map(([name, detail, href]) => `<article class="mtk-biab-api-card"><h4>${name}</h4><p>${detail}</p><a class="mtk-biab-guide__link" href="${href}" target="_blank" rel="noopener">Open docs</a></article>`).join('')}
        </div>
      </section>
    `;
  }

  _renderStationeryPanels() {
    ['business-card', 'letterhead', 'envelope'].forEach(type => {
      const mount = this.el.querySelector(`[data-stationery-designer-panel="${type}"]`);
      if (!mount) return;
      const logo = this._buildLogoDataUrl();
      const state = this.logoDesignerState;
      mount.innerHTML = `
        <section class="mtk-biab-stationery">
          <div class="mtk-biab-tool__head">
            <div><span class="mtk-biab__logo-badge">Auto-filled from logo designer</span><h3>${type.replace('-', ' ')}</h3><p>Logo, business name, and tagline update automatically from the Logo Designer.</p></div>
            <button type="button" class="mtk-biab__action-btn mtk-biab__action-btn--primary" data-action="logo-apply-to-client">${this._t('applyLogo')}</button>
          </div>
          <div class="mtk-biab-stationery__preview mtk-biab-stationery__preview--${type}">
            <img src="${logo}" alt="">
            <strong>${this._escapeHtml(state.businessName)}</strong>
            <span>${this._escapeHtml(state.tagline)}</span>
            <small>(555) 555-0123 · service@example.com · yourlocksmith.com</small>
          </div>
        </section>
      `;
    });
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


