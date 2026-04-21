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

    // Active state
    this.activeTabId    = null;
    this.activeMenuState = {}; // { tabId: { menuId, itemId } }

    this._init();
  }

  // ── Initialization ─────────────────────────────────────────────────────────

  _init() {
    this._subscribeAll();
    this._render();
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
    console.log(`[mtk-biab] onMessage received → ${event}`, data);

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
          this._activateItem(data.tabId, data.itemId);
        }
        break;

      default:
        console.warn(`[mtk-biab] onMessage: unhandled event "${event}"`);
    }
  }

  // ── Publish helper ─────────────────────────────────────────────────────────

  _publish(eventName, data) {
    wc.log(eventName, data);
    wc.publish(eventName, data);
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
        <div class="container">
          <div class="row g-0">
            <div class="mtk-biab__header-inner col-md-12">
              <a class="mtk-biab__logo" href="#" tabindex="0" aria-label="NALA - Business in a Box">
                <img class="mtk-biab__logo-icon" src="img/logo-nala-association.webp" alt="NALA logo" />
                <span class="mtk-biab__logo-text">
                  <span class="mtk-biab__logo-full"><small> Business in a Box</small></span>
                  <span class="mtk-biab__logo-short">NALA</span>
                </span>
              </a>
              <div class="mtk-biab__header-divider" aria-hidden="true"></div>
              <nav
                class="mtk-biab__tabs-nav"
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
                  </button>
                `).join('')}
              </nav>
            </div>
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
          class="mtk-biab__sidebar-menu-header"
          aria-expanded="true"
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
          class="mtk-biab__sidebar-items"
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
    `;
  }

  // ── Bind Events ────────────────────────────────────────────────────────────

  _bindAll() {
    // Delegate all interactions from the root element
    this.el.addEventListener('click', this._onClick.bind(this));
    this.el.addEventListener('keydown', this._onKeydown.bind(this));
  }

  _onClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;

    switch (action) {
      case 'select-tab':
        this._activateTab(btn.dataset.tabId);
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

    // Tab panels
    const allPanels = this.el.querySelectorAll('.mtk-biab__tab-panel');
    allPanels.forEach(panel => {
      const isActive = panel.dataset.panelId === tabId;
      panel.classList.toggle('is-active', isActive);
      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    if (!silent) {
      this._publish(this.events.publish.tabChange, { tabId });
    }
  }

  // ── Item Activation ────────────────────────────────────────────────────────

  _activateItem(tabId, itemId, menuId, clickedBtn) {
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

    // Update state
    this.activeMenuState[tabId] = { menuId, itemId };

    // Publish
    this._publish(this.events.publish.itemSelect, { tabId, menuId, itemId });
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
