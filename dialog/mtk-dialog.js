/**
 * mtk-dialog.js
 * Vanilla JS — MTKDialog class + early-proxy bootstrap.
 *
 * WHY THE PROXY EXISTS
 * ────────────────────
 * When the component is loaded via <wc-include>, the HTML element arrives
 * asynchronously. Any page code that calls mtkDialog.open() before the
 * element lands would throw "mtkDialog is not a function" (or undefined).
 *
 * The proxy is written to window.mtkDialog the instant this script executes —
 * long before <wc-include> completes. It silently queues every .open() /
 * .close() call. The moment the real MTKDialog instance is created, the proxy
 * replays the queue and hands off all future calls transparently.
 *
 * ── Usage (identical whether wc-include is used or not) ──────────────────
 *
 *   mtkDialog.open({
 *     id      : 'confirm-delete',
 *     title   : 'Delete Record',
 *     message : 'This action cannot be undone.',
 *     icon    : 'delete_forever',
 *     iconColor: '#D32F2F',
 *     maxWidth: '440px',
 *     closeOnBackdrop: false,
 *     closeOnEscape  : true,
 *     buttons: [
 *       { label: 'Cancel', action: 'cancel', classes: 'btn btn-link'   },
 *       { label: 'Delete', action: 'delete', classes: 'btn btn-danger' }
 *     ]
 *   });
 *
 *   mtkDialog.close();
 *
 * ── Or via wc event bus ───────────────────────────────────────────────────
 *
 *   wc.publish('mtk-dialog:open',  { config: { title: '...', ... } });
 *   wc.publish('mtk-dialog:close', {});
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. EARLY PROXY
//    Installed on window immediately so mtkDialog.open() never throws,
//    regardless of when the real instance becomes available.
// ─────────────────────────────────────────────────────────────────────────────
(function installProxy() {
  // If a real instance is already on window (e.g. script loaded twice), skip.
  if (window.mtkDialog && window.mtkDialog.__isReal) return;

  const _queue  = [];   // calls made before the real instance is ready
  let   _real   = null; // reference to the MTKDialog instance once ready

  const proxy = {
    __isProxy: true,

    /**
     * open(config)
     * Opens the dialog with the given config object.
     * If the real instance is not yet ready, the call is queued.
     *
     * @param {Object} config - Full dialog config for this invocation
     */
    open(config) {
      if (_real) {
        _real.open(config);
      } else {
        _queue.push({ method: 'open', args: [config] });
      }
    },

    /**
     * close()
     * Closes the dialog.
     * If the real instance is not yet ready, the call is queued.
     */
    close() {
      if (_real) {
        _real.close();
      } else {
        _queue.push({ method: 'close', args: [] });
      }
    },

    /**
     * _resolve(instance)
     * Called internally once the MTKDialog class is instantiated.
     * Replays any queued calls in order, then removes itself.
     *
     * @param {MTKDialog} instance
     */
    _resolve(instance) {
      _real = instance;

      // Replay queued calls in the order they were made
      _queue.forEach(({ method, args }) => {
        if (typeof _real[method] === 'function') {
          _real[method](...args);
        }
      });
      _queue.length = 0;

      // Replace proxy with the real instance on window so future calls
      // go straight to the instance without the proxy overhead.
      window.mtkDialog = _real;
      window.mtkDialog.__isReal = true;
    }
  };

  window.mtkDialog = proxy;
})();


// ─────────────────────────────────────────────────────────────────────────────
// 2. wc SHIM
//    Safe fallback when the real wc event bus is not provided by the host.
// ─────────────────────────────────────────────────────────────────────────────
if (typeof wc === 'undefined') {
  window.wc = {
    _subscribers: {},

    publish(event, data) {
      console.info(`[wc.publish] ${event}`, data);
      (this._subscribers[event] || []).forEach(fn => fn(event, data));
    },

    subscribe(event, fn) {
      if (!this._subscribers[event]) this._subscribers[event] = [];
      this._subscribers[event].push(fn);
    },

    log(...args) {
      console.log(...args);
    }
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. MTKDialog CLASS
// ─────────────────────────────────────────────────────────────────────────────
class MTKDialog {
  /**
   * @param {HTMLElement} element    - The <mtk-dialog> root element
   * @param {Object}      baseConfig - Default config from MTKDialogConfig.dialog
   */
  constructor(element, baseConfig) {
    this.root        = element;
    this._baseConfig = { ...baseConfig };  // immutable base — never mutated
    this.config      = { ...baseConfig };  // active config — replaced on every open()
    this.isOpen      = false;
    this._prevFocus  = null;
    this.__isReal    = true;

    this._cacheDom();
    this._applyConfig(this.config);
    this._bindEvents();
    this._subscribe();
  }

  // ── DOM caching ────────────────────────────────────────────────────────

  _cacheDom() {
    this._backdrop  = this.root.querySelector('[data-mtk-backdrop]');
    this._container = this.root.querySelector('[data-mtk-container]');
    this._iconWrap  = this.root.querySelector('[data-mtk-icon-wrap]');
    this._iconEl    = this.root.querySelector('[data-mtk-icon]');
    this._titleEl   = this.root.querySelector('[data-mtk-title]');
    this._messageEl = this.root.querySelector('[data-mtk-message]');
    this._footer    = this.root.querySelector('[data-mtk-footer]');
    this._closeBtn  = this.root.querySelector('[data-mtk-close]');
  }

  // ── Rendering ──────────────────────────────────────────────────────────

  /**
   * _applyConfig(cfg)
   * Stamps a config object onto the DOM.
   * Called on init and on every open() call.
   */
  _applyConfig(cfg) {
    this._titleEl.textContent   = cfg.title   || '';
    this._messageEl.textContent = cfg.message || '';

    // Icon
    this._iconEl.textContent = cfg.icon || '';
    if (cfg.iconColor) {
      this._iconWrap.style.setProperty('--mtk-icon-color', cfg.iconColor);
      this._iconWrap.style.setProperty('--mtk-icon-bg', this._hexToAlpha(cfg.iconColor, 0.12));
    } else {
      this._iconWrap.style.removeProperty('--mtk-icon-color');
      this._iconWrap.style.removeProperty('--mtk-icon-bg');
    }

    // Max-width
    this._container.style.setProperty('--mtk-dialog-max-width', cfg.maxWidth || '480px');

    // Buttons
    this._renderButtons(cfg.buttons || []);
  }

  _renderButtons(buttons) {
    this._footer.innerHTML = '';

    buttons.forEach((btn) => {
      const el = document.createElement('button');
      el.type = 'button';

      // Rule: label "Cancel" always forces btn btn-link
      el.className       = btn.label === 'Cancel' ? 'btn btn-link' : (btn.classes || 'btn btn-secondary');
      el.textContent       = btn.label;
      el.dataset.mtkAction = btn.action || btn.label.toLowerCase();

      this._footer.appendChild(el);
    });
  }

  // ── Event binding ──────────────────────────────────────────────────────

  _bindEvents() {
    // X close button
    this._closeBtn.addEventListener('click', () => this._handleClose('close'));

    // Backdrop click
    this._backdrop.addEventListener('click', (e) => {
      if (this.config.closeOnBackdrop && e.target === this._backdrop) {
        this._handleClose('backdrop');
      }
    });

    // Action buttons (delegated)
    this._footer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-mtk-action]');
      if (btn) this._handleButtonClick(btn.dataset.mtkAction, btn.textContent.trim());
    });

    // Keyboard
    this.root.addEventListener('keydown', (e) => this._handleKeydown(e));
  }

  _handleKeydown(e) {
    if (!this.isOpen) return;
    if (e.key === 'Escape' && this.config.closeOnEscape) {
      e.preventDefault();
      this._handleClose('escape');
      return;
    }
    if (e.key === 'Tab') this._trapFocus(e);
  }

  _trapFocus(e) {
    const focusable = Array.from(
      this._container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.disabled && el.offsetParent !== null);

    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  // ── Action / close handlers ────────────────────────────────────────────

  _handleButtonClick(action, label) {
    const payload = { dialogId: this.config.id, action, label, timestamp: new Date().toISOString() };
    wc.log('[mtk-dialog] Publishing "mtk-dialog:action"', payload);
    wc.publish('mtk-dialog:action', payload);
    if (action === 'cancel') this.close();
  }

  _handleClose(source) {
    const payload = { dialogId: this.config.id, source, timestamp: new Date().toISOString() };
    wc.log('[mtk-dialog] Publishing "mtk-dialog:close"', payload);
    wc.publish('mtk-dialog:close', payload);
    this.close();
  }

  // ── wc.subscribe message handler ──────────────────────────────────────

  /**
   * onMessage(event, data)
   * Passed as the callback to wc.subscribe.
   * Handles all inbound channel messages for this dialog instance.
   *
   * @param {string} event
   * @param {Object} data
   */
  onMessage(event, data) {
    switch (event) {
      case 'mtk-dialog:open':
        // Support both: { config: {...} }  and  config object passed directly
        this.open(data && data.config ? data.config : data);
        break;

      case 'mtk-dialog:close':
        if (!data?.dialogId || data.dialogId === this.config.id) {
          this.close();
        }
        break;

      default:
        break;
    }
  }

  _subscribe() {
    const handler = (event, data) => this.onMessage(event, data);
    wc.subscribe('mtk-dialog:open',  handler);
    wc.subscribe('mtk-dialog:close', handler);
  }

  // ── Public API ─────────────────────────────────────────────────────────

  /**
   * open(config)
   * ──────────────────────────────────────────────────────────────────────
   * Opens the dialog using the config object passed at call time.
   * The config is used AS-IS for this invocation only — baseConfig is
   * never mutated. Each call is fully self-contained.
   *
   * @param {Object} [config] - Full dialog config for this invocation.
   *                            Falls back to baseConfig when omitted.
   *
   * Config keys:
   *   id              {string}   Identifier echoed in published events
   *   title           {string}   Dialog heading
   *   message         {string}   Body text
   *   icon            {string}   Material Icon ligature e.g. 'warning'
   *   iconColor       {string}   Hex color e.g. '#D32F2F'
   *   maxWidth        {string}   CSS max-width e.g. '480px'
   *   closeOnBackdrop {boolean}  Close on backdrop click
   *   closeOnEscape   {boolean}  Close on Escape key
   *   buttons         {Array}    [{ label, action, classes }]
   *                              label "Cancel" always → btn btn-link
   */
  open(config) {
    this.config = (config && typeof config === 'object' && Object.keys(config).length)
      ? { ...config }
      : { ...this._baseConfig };

    this._applyConfig(this.config);

    this._prevFocus = document.activeElement;
    this.isOpen     = true;
    this._backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => this._container.focus());

    const payload = { dialogId: this.config.id, timestamp: new Date().toISOString() };
    wc.log('[mtk-dialog] Publishing "mtk-dialog:opened"', payload);
    wc.publish('mtk-dialog:opened', payload);
  }

  /**
   * close()
   * Closes the dialog and restores focus to the previously focused element.
   */
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this._backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    if (this._prevFocus && typeof this._prevFocus.focus === 'function') {
      this._prevFocus.focus();
    }
  }

  // ── Utilities ──────────────────────────────────────────────────────────

  _hexToAlpha(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. BOOTSTRAP
//    Waits for the <mtk-dialog> element to appear in the DOM,
//    creates the MTKDialog instance, then resolves the proxy.
// ─────────────────────────────────────────────────────────────────────────────
(function bootstrap() {
  const SELECTOR = 'mtk-dialog.mtk-dialog';

  function tryInit() {
    const el = document.querySelector(SELECTOR);
    if (!el) return false;

    // Guard: already initialized
    if (el.__mtkDialogInstance) return true;

    if (typeof MTKDialogConfig === 'undefined') {
      console.warn('[mtk-dialog] MTKDialogConfig not found. Ensure mtk-dialog.config.js loads before mtk-dialog.js.');
      return false;
    }

    // Create the real instance
    const instance = new MTKDialog(el, { ...MTKDialogConfig.dialog });
    el.__mtkDialogInstance = instance;

    // Hand off to the proxy — replays queued calls, then replaces itself on window
    if (window.mtkDialog && window.mtkDialog.__isProxy) {
      window.mtkDialog._resolve(instance);
    } else {
      // Proxy wasn't installed (e.g. script loaded after element was already in DOM)
      window.mtkDialog = instance;
      window.mtkDialog.__isReal = true;
    }

    return true;
  }

  // Try immediately (element might already be in DOM)
  if (tryInit()) return;

  // MutationObserver: catches <wc-include> injecting the element asynchronously
  const observer = new MutationObserver(() => {
    if (tryInit()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // DOMContentLoaded fallback
  document.addEventListener('DOMContentLoaded', () => {
    if (tryInit()) observer.disconnect();
  });
})();
