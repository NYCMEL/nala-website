/**
 * MTK-ALERTS
 * Material Design Alert System — Table Layout, Inline Actions
 * ─────────────────────────────────────────────────────────────
 * Requires: mtk-alerts.config.js  (MTKAlertsConfig)
 * Uses:     wc.publish / wc.subscribe / wc.log
 */

/* ── Lightweight pub/sub bus (polyfill if wc is absent) ── */
const wc = window.wc || (() => {
  const _ch = {};
  return {
    publish(event, data) { (_ch[event] || []).forEach(fn => fn(data)); },
    subscribe(event, fn) { if (!_ch[event]) _ch[event] = []; _ch[event].push(fn); },
    log(label, data)     { console.log(`[wc] ${label}`, data); }
  };
})();
window.wc = wc;

/* ════════════════════════════════════════════
   MTKAlerts Class
   ════════════════════════════════════════════ */
class MTKAlerts {

  constructor(root, config) {
    if (typeof root === 'string') {
      this._waitForDOM(root, config);
      return;
    }
    this._init(root, config);
  }

  /* ── DOM Readiness ─────────────────────────────────────────── */
  _waitForDOM(selector, config) {
    const tryMount = () => {
      const el = document.querySelector(selector);
      if (el) { this._init(el, config); return true; }
      return false;
    };
    const observe = () => {
      if (!tryMount()) {
        const obs = new MutationObserver(() => { if (tryMount()) obs.disconnect(); });
        obs.observe(document.body, { childList: true, subtree: true });
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observe);
    } else {
      observe();
    }
  }

  /* ── Init ──────────────────────────────────────────────────── */
  _init(rootEl, config) {
    this.root   = rootEl;
    this.config = config;
    this.alerts = JSON.parse(JSON.stringify(config.alerts));
    this.events = config.events;

    this._activeTab = 'unread';

    this._bindElements();
    this._bindTabs();
    this._subscribeAll();
    this._render();
  }

  /* ── Element Refs ──────────────────────────────────────────── */
  _bindElements() {
    const q = sel => this.root.querySelector(sel);
    this.$ = {
      unreadCount:   q('#mtk-unread-count'),
      unreadTbody:   q('#mtk-unread-tbody'),
      archivedTbody: q('#mtk-archived-tbody'),
      unreadWrap:    q('#mtk-unread-wrap'),
      archivedWrap:  q('#mtk-archived-wrap'),
      emptyUnread:   q('#mtk-empty-unread'),
      emptyArchived: q('#mtk-empty-archived'),
      tabs:          Array.from(this.root.querySelectorAll('.mtk-tab')),
      panels:        Array.from(this.root.querySelectorAll('.mtk-panel')),
    };
  }

  /* ── Tabs ──────────────────────────────────────────────────── */
  _bindTabs() {
    this.$.tabs.forEach(tab => {
      tab.addEventListener('click', () => this._switchTab(tab.dataset.tab));
      tab.addEventListener('keydown', e => {
        const idx = this.$.tabs.indexOf(tab);
        let next  = -1;
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
    this.$.tabs.forEach(tab => {
      const active = tab.dataset.tab === name;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    this.$.panels.forEach(panel => {
      panel.setAttribute('aria-hidden', String(panel.id !== `panel-${name}`));
    });
  }

  /* ── pub/sub ───────────────────────────────────────────────── */
  _subscribeAll() {
    wc.subscribe(this.events.alertRead,    data => this._onMessage(this.events.alertRead,    data));
    wc.subscribe(this.events.alertArchive, data => this._onMessage(this.events.alertArchive, data));
    wc.subscribe(this.events.alertDelete,  data => this._onMessage(this.events.alertDelete,  data));
    wc.subscribe(this.events.alertView,    data => this._onMessage(this.events.alertView,    data));
  }

  _onMessage(event, data) {
    switch (event) {
      case this.events.alertRead:    this._handleRead(data.id);    break;
      case this.events.alertArchive: this._handleArchive(data.id); break;
      case this.events.alertDelete:  this._handleDelete(data.id);  break;
      case this.events.alertView:    /* no detail view */           break;
    }
  }

  _publish(event, data) {
    wc.log(event, data);
    wc.publish(event, data);
  }

  /* ── State Handlers ────────────────────────────────────────── */
  _handleRead(id) {
    const alert = this._find(id);
    if (!alert || alert.read) return;
    alert.read = true;
    this._render();
  }

  _handleArchive(id) {
    const alert = this._find(id);
    if (!alert) return;
    alert.read     = true;
    alert.archived = true;
    this._render();
    this._switchTab('archived');
  }

  _handleDelete(id) {
    this.alerts = this.alerts.filter(a => a.id !== id);
    this._render();
  }

  /* ── Render ────────────────────────────────────────────────── */
  _render() {
    const unread   = this.alerts.filter(a => !a.archived);
    const archived = this.alerts.filter(a =>  a.archived);
    const unreadN  = unread.filter(a => !a.read).length;

    // Badge
    this.$.unreadCount.textContent = unreadN;
    this.$.unreadCount.hidden      = unreadN === 0;

    // Unread table
    this.$.unreadTbody.innerHTML = '';
    if (unread.length === 0) {
      this.$.unreadWrap.hidden  = true;
      this.$.emptyUnread.hidden = false;
    } else {
      this.$.unreadWrap.hidden  = false;
      this.$.emptyUnread.hidden = true;
      unread.forEach(a => this.$.unreadTbody.appendChild(this._buildRow(a)));
    }

    // Archived table
    this.$.archivedTbody.innerHTML = '';
    if (archived.length === 0) {
      this.$.archivedWrap.hidden  = true;
      this.$.emptyArchived.hidden = false;
    } else {
      this.$.archivedWrap.hidden  = false;
      this.$.emptyArchived.hidden = true;
      archived.forEach(a => this.$.archivedTbody.appendChild(this._buildRow(a)));
    }
  }

  /* ── Build Table Row ───────────────────────────────────────── */
  _buildRow(alert) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id',   alert.id);
    tr.setAttribute('data-type', alert.type);
    tr.setAttribute('data-read', String(alert.read));
    tr.setAttribute('aria-label', `${alert.read ? '' : 'Unread: '}${alert.title}`);

    // ── Icon cell ──
    const tdIcon = document.createElement('td');
    tdIcon.className = 'col-icon';
    tdIcon.setAttribute('aria-hidden', 'true');
    tdIcon.innerHTML = `
      <div class="mtk-tbl-icon">
        <span class="material-icons">${this._esc(alert.icon)}</span>
      </div>`;

    // ── Date cell ──
    const tdDate = document.createElement('td');
    tdDate.className = 'col-date';
    tdDate.innerHTML = `<time class="mtk-tbl-date" datetime="${alert.timestamp}">${this._formatDate(alert.timestamp)}</time>`;

    // ── Message cell — title + full multi-line body ──
    const tdMsg = document.createElement('td');
    tdMsg.className = 'col-message';

    const title = document.createElement('span');
    title.className   = 'mtk-tbl-title';
    title.textContent = alert.title;

    const body = document.createElement('p');
    body.className   = 'mtk-tbl-body';
    body.textContent = alert.message;   // textContent respects \n with white-space:pre-wrap

    tdMsg.appendChild(title);
    tdMsg.appendChild(body);

    // ── Actions cell ──
    const tdActions = document.createElement('td');
    tdActions.className = 'col-actions';

    const actWrap = document.createElement('div');
    actWrap.className = 'mtk-tbl-actions';

    // Mark as read — only when unread
    if (!alert.read) {
      actWrap.appendChild(this._buildAction('is-read', 'done', 'Mark Read', () => {
        this._publish(this.events.alertRead, { id: alert.id, alert });
      }));
    }

    // Archive — only when not yet archived
    if (!alert.archived) {
      actWrap.appendChild(this._buildAction('is-archive', 'inventory_2', 'Archive', () => {
        this._publish(this.events.alertArchive, { id: alert.id, alert });
      }));
    }

    // Delete — always
    actWrap.appendChild(this._buildAction('is-delete', 'delete', 'Delete', () => {
      if (window.confirm(this.config.labels.confirmDelete)) {
        this._publish(this.events.alertDelete, { id: alert.id, alert });
      }
    }));

    tdActions.appendChild(actWrap);

    tr.appendChild(tdIcon);
    tr.appendChild(tdDate);
    tr.appendChild(tdMsg);
    tr.appendChild(tdActions);

    return tr;
  }

  /* ── Build Inline Action Button ────────────────────────────── */
  _buildAction(modifier, icon, label, onClick) {
    const btn = document.createElement('button');
    btn.className = `mtk-action-btn ${modifier}`;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = `<span class="material-icons" aria-hidden="true">${icon}</span>${this._esc(label)}`;
    btn.addEventListener('click', e => { e.stopPropagation(); onClick(); });
    return btn;
  }

  /* ── Helpers ───────────────────────────────────────────────── */
  _find(id) { return this.alerts.find(a => a.id === id) || null; }

  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  _formatDate(iso) {
    const d       = new Date(iso);
    const now     = new Date();
    const diffMs  = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffH   = Math.floor(diffMin / 60);
    const diffD   = Math.floor(diffH   / 24);

    if (diffMin < 1)  return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffH   < 24) return `${diffH}h ago`;
    if (diffD   <  7) return `${diffD}d ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

/* ── Auto-initialise ──────────────────────────────────────────── */
new MTKAlerts('mtk-alerts.mtk-alerts', MTKAlertsConfig);
