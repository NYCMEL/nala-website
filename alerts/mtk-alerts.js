/**
 * MTK-ALERTS
 * Material Design Alert System
 * ─────────────────────────────────────────────
 * Requires: mtk-alerts.config.js (MTKAlertsConfig)
 * Uses:     wc.publish / wc.subscribe / wc.log
 */

/* ── Lightweight pub/sub bus (polyfill if wc is absent) ── */
const wc = window.wc || (() => {
  const _channels = {};
  return {
    publish(event, data) {
      (_channels[event] || []).forEach(fn => fn(data));
    },
    subscribe(event, fn) {
      if (!_channels[event]) _channels[event] = [];
      _channels[event].push(fn);
    },
    log(label, data) {
      console.log(`[wc] ${label}`, data);
    }
  };
})();
window.wc = wc;

/* ════════════════════════════════════════════
   MTKAlerts Class
   ════════════════════════════════════════════ */
class MTKAlerts {

  /**
   * @param {string|Element} root - CSS selector or DOM element of <mtk-alerts>
   * @param {object}         config - MTKAlertsConfig
   */
  constructor(root, config) {
    // ── Wait for the element if not yet in DOM ──────────────────
    if (typeof root === 'string') {
      this._rootSelector = root;
      this._config       = config;
      this._waitForDOM(root, config);
      return;
    }
    this._init(root, config);
  }

  /* ── DOM Readiness ──────────────────────────────────────────── */
  _waitForDOM(selector, config) {
    const tryMount = () => {
      const el = document.querySelector(selector);
      if (el) {
        this._init(el, config);
        return true;
      }
      return false;
    };

    if (document.readyState !== 'loading') {
      if (!tryMount()) {
        // Use MutationObserver for <wc-include> dynamic injection
        const obs = new MutationObserver(() => {
          if (tryMount()) obs.disconnect();
        });
        obs.observe(document.body, { childList: true, subtree: true });
      }
      return;
    }
    document.addEventListener('DOMContentLoaded', () => {
      if (!tryMount()) {
        const obs = new MutationObserver(() => {
          if (tryMount()) obs.disconnect();
        });
        obs.observe(document.body, { childList: true, subtree: true });
      }
    });
  }

  /* ── Initialise ─────────────────────────────────────────────── */
  _init(rootEl, config) {
    this.root   = rootEl;
    this.config = config;

    // Deep-clone alerts so we mutate our own copy
    this.alerts = JSON.parse(JSON.stringify(config.alerts));
    this.events = config.events;

    // Active detail alert id
    this._currentId  = null;
    this._activeTab  = 'unread';

    this._bindElements();
    this._bindTabs();
    this._bindBack();
    this._subscribeAll();
    this._render();
  }

  /* ── Element Refs ───────────────────────────────────────────── */
  _bindElements() {
    const q = (sel) => this.root.querySelector(sel);
    this.$ = {
      unreadCount:    q('#mtk-unread-count'),
      listView:       q('#mtk-list-view'),
      detailView:     q('#mtk-detail-view'),
      unreadList:     q('#mtk-unread-list'),
      archivedList:   q('#mtk-archived-list'),
      emptyUnread:    q('#mtk-empty-unread'),
      emptyArchived:  q('#mtk-empty-archived'),
      btnBack:        q('#mtk-btn-back'),
      detailCard:     q('#mtk-detail-card'),
      detailIcon:     q('#mtk-detail-icon'),
      detailType:     q('#mtk-detail-type'),
      detailTitle:    q('#mtk-detail-title'),
      detailTime:     q('#mtk-detail-time'),
      detailMessage:  q('#mtk-detail-message'),
      detailActions:  q('#mtk-detail-actions'),
      tabs:           Array.from(this.root.querySelectorAll('.mtk-tab')),
      panels:         Array.from(this.root.querySelectorAll('.mtk-panel')),
    };
  }

  /* ── Tab Logic ──────────────────────────────────────────────── */
  _bindTabs() {
    this.$.tabs.forEach((tab) => {
      tab.addEventListener('click', () => this._switchTab(tab.dataset.tab));
      tab.addEventListener('keydown', (e) => {
        const idx  = this.$.tabs.indexOf(tab);
        let next   = -1;
        if (e.key === 'ArrowRight') next = (idx + 1) % this.$.tabs.length;
        if (e.key === 'ArrowLeft')  next = (idx - 1 + this.$.tabs.length) % this.$.tabs.length;
        if (next >= 0) {
          this.$.tabs[next].focus();
          this._switchTab(this.$.tabs[next].dataset.tab);
        }
      });
    });
  }

  _switchTab(name) {
    this._activeTab = name;
    this.$.tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    this.$.panels.forEach((panel) => {
      const active = panel.id === `panel-${name}`;
      panel.setAttribute('aria-hidden', String(!active));
    });
  }

  /* ── Back Button ────────────────────────────────────────────── */
  _bindBack() {
    this.$.btnBack.addEventListener('click', () => this._showList());
    this.$.btnBack.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._showList(); }
    });
  }

  /* ── pub/sub ────────────────────────────────────────────────── */
  _subscribeAll() {
    wc.subscribe(this.events.alertRead,    (data) => this._onMessage(this.events.alertRead,    data));
    wc.subscribe(this.events.alertArchive, (data) => this._onMessage(this.events.alertArchive, data));
    wc.subscribe(this.events.alertDelete,  (data) => this._onMessage(this.events.alertDelete,  data));
    wc.subscribe(this.events.alertView,    (data) => this._onMessage(this.events.alertView,    data));
  }

  /**
   * Centralised message handler for all 4 subscriptions.
   * @param {string} event
   * @param {object} data
   */
  _onMessage(event, data) {
    switch (event) {
      case this.events.alertRead:
        this._handleRead(data.id);
        break;
      case this.events.alertArchive:
        this._handleArchive(data.id);
        break;
      case this.events.alertDelete:
        this._handleDelete(data.id);
        break;
      case this.events.alertView:
        this._handleView(data.id);
        break;
    }
  }

  /* ── Publish helpers ────────────────────────────────────────── */
  _publish(event, data) {
    wc.log(event, data);
    wc.publish(event, data);
  }

  /* ── State Handlers (called from wc.subscribe) ──────────────── */
  _handleRead(id) {
    const alert = this._find(id);
    if (!alert || alert.read) return;
    alert.read = true;
    this._render();
    if (this._currentId === id) this._renderDetail(alert);
  }

  _handleArchive(id) {
    const alert = this._find(id);
    if (!alert) return;
    alert.read     = true;
    alert.archived = true;
    this._render();
    this._showList();
    this._switchTab('archived');
  }

  _handleDelete(id) {
    this.alerts = this.alerts.filter(a => a.id !== id);
    this._render();
    this._showList();
  }

  _handleView(id) {
    const alert = this._find(id);
    if (!alert) return;
    this._renderDetail(alert);
    this._showDetail();
    // Auto-mark as read when opened
    if (!alert.read) {
      this._publish(this.events.alertRead, { id });
    }
  }

  /* ── Render ─────────────────────────────────────────────────── */
  _render() {
    const unread   = this.alerts.filter(a => !a.archived);
    const archived = this.alerts.filter(a => a.archived);
    const unreadN  = unread.filter(a => !a.read).length;

    // Badge
    this.$.unreadCount.textContent = unreadN;
    this.$.unreadCount.hidden      = unreadN === 0;

    // Unread panel
    this.$.unreadList.innerHTML = '';
    if (unread.length === 0) {
      this.$.emptyUnread.hidden = false;
    } else {
      this.$.emptyUnread.hidden = true;
      unread.forEach(a => this.$.unreadList.appendChild(this._buildCard(a)));
    }

    // Archived panel
    this.$.archivedList.innerHTML = '';
    if (archived.length === 0) {
      this.$.emptyArchived.hidden = false;
    } else {
      this.$.emptyArchived.hidden = true;
      archived.forEach(a => this.$.archivedList.appendChild(this._buildCard(a)));
    }
  }

  /* ── Build Card ─────────────────────────────────────────────── */
  _buildCard(alert) {
    const li  = document.createElement('li');
    li.setAttribute('role',         'listitem');

    const btn = document.createElement('button');
    btn.className           = 'mtk-card';
    btn.setAttribute('data-id',   alert.id);
    btn.setAttribute('data-type', alert.type);
    btn.setAttribute('data-read', String(alert.read));
    btn.setAttribute('tabindex',  '0');
    btn.setAttribute('aria-label', `${alert.read ? '' : 'Unread: '}${alert.title}`);

    btn.innerHTML = `
      <div class="mtk-card__icon" aria-hidden="true">
        <span class="material-icons">${this._escHtml(alert.icon)}</span>
      </div>
      <div class="mtk-card__body">
        <p class="mtk-card__title">${this._escHtml(alert.title)}</p>
        <p class="mtk-card__preview">${this._escHtml(alert.message)}</p>
        <time class="mtk-card__time" datetime="${alert.timestamp}">${this._formatDate(alert.timestamp)}</time>
      </div>
      <span class="material-icons mtk-card__chevron" aria-hidden="true">chevron_right</span>
    `;

    btn.addEventListener('click', () => {
      this._publish(this.events.alertView, { id: alert.id, alert });
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._publish(this.events.alertView, { id: alert.id, alert });
      }
    });

    li.appendChild(btn);
    return li;
  }

  /* ── Render Detail ──────────────────────────────────────────── */
  _renderDetail(alert) {
    this._currentId = alert.id;

    const card = this.$.detailCard;
    card.setAttribute('data-type', alert.type);

    this.$.detailIcon.textContent    = alert.icon;
    this.$.detailType.textContent    = alert.type.charAt(0).toUpperCase() + alert.type.slice(1);
    this.$.detailTitle.textContent   = alert.title;
    this.$.detailTime.textContent    = this._formatDate(alert.timestamp);
    this.$.detailTime.setAttribute('datetime', alert.timestamp);
    this.$.detailMessage.textContent = alert.message;

    // Build action buttons
    this.$.detailActions.innerHTML = '';

    if (!alert.read) {
      this.$.detailActions.appendChild(
        this._buildBtn('primary', 'done', this.config.labels.markRead, () => {
          this._publish(this.events.alertRead, { id: alert.id, alert });
        })
      );
    }

    if (!alert.archived) {
      this.$.detailActions.appendChild(
        this._buildBtn('secondary', 'inventory_2', this.config.labels.archive, () => {
          this._publish(this.events.alertArchive, { id: alert.id, alert });
        })
      );
    }

    this.$.detailActions.appendChild(
      this._buildBtn('danger', 'delete', this.config.labels.delete, () => {
        if (window.confirm(this.config.labels.confirmDelete)) {
          this._publish(this.events.alertDelete, { id: alert.id, alert });
        }
      })
    );
  }

  _buildBtn(variant, icon, label, onClick) {
    const btn = document.createElement('button');
    btn.className = `mtk-btn mtk-btn--${variant}`;
    btn.innerHTML = `<span class="material-icons" aria-hidden="true">${icon}</span>${this._escHtml(label)}`;
    btn.addEventListener('click', onClick);
    return btn;
  }

  /* ── View Switching ─────────────────────────────────────────── */
  _showDetail() {
    this.$.listView.hidden   = true;
    this.$.detailView.setAttribute('aria-hidden', 'false');
    this.$.btnBack.focus();
  }

  _showList() {
    this.$.listView.hidden   = false;
    this.$.detailView.setAttribute('aria-hidden', 'true');
  }

  /* ── Helpers ────────────────────────────────────────────────── */
  _find(id) {
    return this.alerts.find(a => a.id === id) || null;
  }

  _escHtml(str) {
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;');
  }

  _formatDate(iso) {
    const d   = new Date(iso);
    const now = new Date();
    const diffMs  = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffH   = Math.floor(diffMin / 60);
    const diffD   = Math.floor(diffH   / 24);

    if (diffMin < 1)  return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffH   < 24) return `${diffH}h ago`;
    if (diffD   < 7)  return `${diffD}d ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

/* ── Auto-initialise ──────────────────────────────────────────── */
new MTKAlerts('mtk-alerts.mtk-alerts', MTKAlertsConfig);
