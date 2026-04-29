/**
 * MTK-ALERTS  ·  Material Design Alert System
 * Uses mtka- prefixed classes to avoid Bootstrap conflicts
 */

class MTKAlerts {

  constructor(root, config) {
    if (typeof root === 'string') {
      this._waitForDOM(root, config);
    } else {
      this._init(root, config);
    }
  }

  _waitForDOM(selector, config) {
    const tryMount = () => {
      const el = document.querySelector(selector);
      if (!el) return false;
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
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', observe)
      : observe();
  }

  _init(rootEl, config) {
    this.root   = rootEl;
    this.config = config;
    this.alerts = JSON.parse(JSON.stringify(config.alerts));
    this.events = config.events;
    this._bindElements();
    this._bindSwitch();
    this._subscribeAll();
    this._render();
  }

  _bindElements() {
    const q = s => this.root.querySelector(s);
    this.$ = {
      componentBadge: q('#mtk-alerts-unread-count'),
      unreadTbody:    q('#mtk-unread-tbody'),
      archivedTbody:  q('#mtk-archived-tbody'),
      unreadWrap:     q('#mtk-unread-wrap'),
      archivedWrap:   q('#mtk-archived-wrap'),
      emptyUnread:    q('#mtk-empty-unread'),
      emptyArchived:  q('#mtk-empty-archived'),
      switchBtns:     Array.from(this.root.querySelectorAll('.mtka-switch-btn')),
      panels:         Array.from(this.root.querySelectorAll('.mtka-panel')),
    };
  }

  _bindSwitch() {
    this.$.switchBtns.forEach(btn => {
      btn.addEventListener('click', () => this._switchTab(btn.dataset.tab));
      btn.addEventListener('keydown', e => {
        const idx  = this.$.switchBtns.indexOf(btn);
        let   next = -1;
        if (e.key === 'ArrowRight') next = (idx + 1) % this.$.switchBtns.length;
        if (e.key === 'ArrowLeft')  next = (idx - 1 + this.$.switchBtns.length) % this.$.switchBtns.length;
        if (next >= 0) { this.$.switchBtns[next].focus(); this._switchTab(this.$.switchBtns[next].dataset.tab); }
      });
    });
  }

  _switchTab(name) {
    this.$.switchBtns.forEach(btn => {
      const active = btn.dataset.tab === name;
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
      btn.classList.toggle('mtka-switch-btn--active', active);
    });
    this.$.panels.forEach(panel => {
      panel.setAttribute('aria-hidden', String(panel.id !== `panel-${name}`));
    });
  }

  _subscribeAll() {
    const ev = this.events;
    wc.subscribe(ev.alertRead,    d => this._onMessage(ev.alertRead,    d));
    wc.subscribe(ev.alertArchive, d => this._onMessage(ev.alertArchive, d));
    wc.subscribe(ev.alertDelete,  d => this._onMessage(ev.alertDelete,  d));
    wc.subscribe(ev.alertView,    d => this._onMessage(ev.alertView,    d));
  }

  _onMessage(event, data) {
    const ev = this.events;
    if (event === ev.alertRead)    this._handleRead(data.id);
    if (event === ev.alertArchive) this._handleArchive(data.id);
    if (event === ev.alertDelete)  this._handleDelete(data.id);
  }

  _publish(event, data) { wc.log(event, data); wc.publish(event, data); }

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

  _render() {
    const unread   = this.alerts.filter(a => !a.archived);
    const archived = this.alerts.filter(a =>  a.archived);
    const unreadN  = unread.filter(a => !a.read).length;

    this._setBadge(this.$.componentBadge, unreadN);
    this._setBadge(document.getElementById('mtk-unread-count'), unreadN);

    this.$.unreadTbody.innerHTML   = '';
    this.$.unreadWrap.hidden       = unread.length === 0;
    this.$.emptyUnread.hidden      = unread.length  >  0;
    unread.forEach(a => this.$.unreadTbody.appendChild(this._buildRow(a)));

    this.$.archivedTbody.innerHTML = '';
    this.$.archivedWrap.hidden     = archived.length === 0;
    this.$.emptyArchived.hidden    = archived.length  >  0;
    archived.forEach(a => this.$.archivedTbody.appendChild(this._buildRow(a)));
  }

  _setBadge(el, n) {
    if (!el) return;
    el.textContent = n;
    el.hidden      = n === 0;
  }

  _buildRow(alert) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id',    alert.id);
    tr.setAttribute('data-type',  alert.type);
    tr.setAttribute('data-read',  String(alert.read));
    tr.setAttribute('aria-label', `${alert.read ? '' : 'Unread: '}${alert.title}`);

    const tdIcon = document.createElement('td');
    tdIcon.className = 'col-icon';
    tdIcon.setAttribute('aria-hidden', 'true');
    tdIcon.innerHTML = `<div class="mtka-tbl-icon"><span class="material-icons">${this._esc(alert.icon)}</span></div>`;

    const tdDate = document.createElement('td');
    tdDate.className = 'col-date';
    tdDate.innerHTML = `<time class="mtka-tbl-date" datetime="${alert.timestamp}">${this._fmt(alert.timestamp)}</time>`;

    const tdMsg = document.createElement('td');
    tdMsg.className = 'col-message';
    const title = document.createElement('span');
    title.className = 'mtka-tbl-title'; title.textContent = alert.title;
    const body  = document.createElement('p');
    body.className  = 'mtka-tbl-body';  body.textContent = alert.message;
    tdMsg.append(title, body);

    const tdAct = document.createElement('td');
    tdAct.className = 'col-actions';
    const wrap = document.createElement('div');
    wrap.className  = 'mtka-tbl-actions';

    if (!alert.read) {
      wrap.appendChild(this._btn('is-read', 'done', 'Mark Read', () =>
        this._publish(this.events.alertRead, { id: alert.id, alert })
      ));
    }
    if (!alert.archived) {
      wrap.appendChild(this._btn('is-archive', 'inventory_2', 'Archive', () =>
        this._publish(this.events.alertArchive, { id: alert.id, alert })
      ));
    }
    wrap.appendChild(this._btn('is-delete', 'delete', 'Delete', () => {
      if (window.confirm(this.config.labels.confirmDelete))
        this._publish(this.events.alertDelete, { id: alert.id, alert });
    }));

    tdAct.appendChild(wrap);
    tr.append(tdIcon, tdDate, tdMsg, tdAct);
    return tr;
  }

  _btn(mod, icon, label, fn) {
    const b = document.createElement('button');
    b.className = `mtka-action-btn ${mod}`;
    b.setAttribute('aria-label', label);
    b.innerHTML = `<span class="material-icons" aria-hidden="true">${icon}</span>${this._esc(label)}`;
    b.addEventListener('click', e => { e.stopPropagation(); fn(); });
    return b;
  }

  _find(id) { return this.alerts.find(a => a.id === id) || null; }

  _esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
                    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  _fmt(iso) {
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

new MTKAlerts('mtk-alerts.mtk-alerts', MTKAlertsConfig);
