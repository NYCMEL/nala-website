/**
 * MTK-ALERTS
 * Material Design Alert System — Table Layout, Inline Actions
 * ─────────────────────────────────────────────────────────────
 * Requires: mtk-alerts.config.js  (MTKAlertsConfig)
 * Uses:     wc.publish / wc.subscribe / wc.log
 *
 * Badge IDs:
 *   #mtk-unread-count          → header bell badge (header.private.html)
 *   #mtk-alerts-unread-count   → in-component badge (mtk-alerts.html)
 */

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
      if (!el) return false;
      // Guard: skip if already mounted (cache:false re-injects same HTML)
      if (el.dataset.mtkMounted === '1') return true;
      el.dataset.mtkMounted = '1';
      this._init(el, config);
      return true;
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
      componentBadge: q('#mtk-alerts-unread-count'),
      unreadTbody:    q('#mtk-unread-tbody'),
      archivedTbody:  q('#mtk-archived-tbody'),
      unreadWrap:     q('#mtk-unread-wrap'),
      archivedWrap:   q('#mtk-archived-wrap'),
      emptyUnread:    q('#mtk-empty-unread'),
      emptyArchived:  q('#mtk-empty-archived'),
      tabs:           Array.from(this.root.querySelectorAll('.mtk-nav-tab')),
      panels:         Array.from(this.root.querySelectorAll('.mtk-panel')),
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
        if (next >= 0) { this.$.tabs[next].focus(); this._switchTab(this.$.tabs[next].dataset.tab); }
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
    const ev = this.events;
    wc.subscribe(ev.alertRead,    data => this._onMessage(ev.alertRead,    data));
    wc.subscribe(ev.alertArchive, data => this._onMessage(ev.alertArchive, data));
    wc.subscribe(ev.alertDelete,  data => this._onMessage(ev.alertDelete,  data));
    wc.subscribe(ev.alertView,    data => this._onMessage(ev.alertView,    data));
  }

  _onMessage(event, data) {
    const ev = this.events;
    switch (event) {
      case ev.alertRead:    this._handleRead(data.id);    break;
      case ev.alertArchive: this._handleArchive(data.id); break;
      case ev.alertDelete:  this._handleDelete(data.id);  break;
    }
  }

  _publish(event, data) {
    wc.log(event, data);
    wc.publish(event, data);
  }

  /* ── State Handlers ────────────────────────────────────────── */
  _handleRead(id) {
    const a = this._find(id);
    if (!a || a.read) return;
    a.read = true;
    this._render();
  }

  _handleArchive(id) {
    const a = this._find(id);
    if (!a) return;
    a.read = true; a.archived = true;
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

    // Sync both badges
    this._setBadge(this.$.componentBadge, unreadN);
    this._setBadge(document.getElementById('mtk-unread-count'), unreadN);

    // Unread table
    this.$.unreadTbody.innerHTML = '';
    const hasUnread = unread.length > 0;
    this.$.unreadWrap.hidden  = !hasUnread;
    this.$.emptyUnread.hidden =  hasUnread;
    unread.forEach(a => this.$.unreadTbody.appendChild(this._buildRow(a)));

    // Archived table
    this.$.archivedTbody.innerHTML = '';
    const hasArchived = archived.length > 0;
    this.$.archivedWrap.hidden  = !hasArchived;
    this.$.emptyArchived.hidden =  hasArchived;
    archived.forEach(a => this.$.archivedTbody.appendChild(this._buildRow(a)));
  }

  _setBadge(el, count) {
    if (!el) return;
    el.textContent = count;
    el.hidden      = count === 0;
  }

  /* ── Build Table Row ───────────────────────────────────────── */
  _buildRow(alert) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id',   alert.id);
    tr.setAttribute('data-type', alert.type);
    tr.setAttribute('data-read', String(alert.read));
    tr.setAttribute('aria-label', `${alert.read ? '' : 'Unread: '}${alert.title}`);

    // Icon
    const tdIcon = document.createElement('td');
    tdIcon.className = 'col-icon';
    tdIcon.setAttribute('aria-hidden', 'true');
    tdIcon.innerHTML = `<div class="mtk-tbl-icon"><span class="material-icons">${this._esc(alert.icon)}</span></div>`;

    // Date
    const tdDate = document.createElement('td');
    tdDate.className = 'col-date';
    tdDate.innerHTML = `<time class="mtk-tbl-date" datetime="${alert.timestamp}">${this._formatDate(alert.timestamp)}</time>`;

    // Message
    const tdMsg   = document.createElement('td');
    tdMsg.className = 'col-message';
    const title   = document.createElement('span');
    title.className   = 'mtk-tbl-title';
    title.textContent = alert.title;
    const body    = document.createElement('p');
    body.className   = 'mtk-tbl-body';
    body.textContent = alert.message;
    tdMsg.appendChild(title);
    tdMsg.appendChild(body);

    // Actions
    const tdAct  = document.createElement('td');
    tdAct.className = 'col-actions';
    const wrap   = document.createElement('div');
    wrap.className  = 'mtk-tbl-actions';

    if (!alert.read) {
      wrap.appendChild(this._buildAction('is-read', 'done', 'Mark Read', () =>
        this._publish(this.events.alertRead, { id: alert.id, alert })
      ));
    }
    if (!alert.archived) {
      wrap.appendChild(this._buildAction('is-archive', 'inventory_2', 'Archive', () =>
        this._publish(this.events.alertArchive, { id: alert.id, alert })
      ));
    }
    wrap.appendChild(this._buildAction('is-delete', 'delete', 'Delete', () => {
      if (window.confirm(this.config.labels.confirmDelete)) {
        this._publish(this.events.alertDelete, { id: alert.id, alert });
      }
    }));

    tdAct.appendChild(wrap);
    tr.append(tdIcon, tdDate, tdMsg, tdAct);
    return tr;
  }

  _buildAction(mod, icon, label, fn) {
    const btn = document.createElement('button');
    btn.className = `mtk-action-btn ${mod}`;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = `<span class="material-icons" aria-hidden="true">${icon}</span>${this._esc(label)}`;
    btn.addEventListener('click', e => { e.stopPropagation(); fn(); });
    return btn;
  }

  /* ── Helpers ───────────────────────────────────────────────── */
  _find(id) { return this.alerts.find(a => a.id === id) || null; }

  _esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  _formatDate(iso) {
    const d = new Date(iso), now = new Date();
    const m = Math.floor((now - d) / 60000);
    const h = Math.floor(m / 60), dd = Math.floor(h / 24);
    if (m  <  1) return 'Just now';
    if (m  < 60) return `${m}m ago`;
    if (h  < 24) return `${h}h ago`;
    if (dd <  7) return `${dd}d ago`;
    return d.toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' });
  }
}

/* ── Init ─────────────────────────────────────────────────────── */
new MTKAlerts('mtk-alerts.mtk-alerts', MTKAlertsConfig);
