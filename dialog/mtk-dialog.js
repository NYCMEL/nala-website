/**
 * mtk-dialog.js
 * Vanilla JS class for the mtk-dialog component.
 * Data-driven via MTKDialogConfig (mtk-dialog.config.js).
 * Publishes events via wc.publish / subscribes via wc.subscribe.
 *
 * ── Programmatic usage ────────────────────────────────────────────────────
 *
 *   mtkDialog.show({
 *     title      : 'Delete File',
 *     message    : 'This action cannot be undone.',
 *     icon       : 'delete_forever',
 *     iconColor  : '#D32F2F',
 *     maxWidth   : '420px',
 *     closeOnBackdrop: true,
 *     closeOnEscape  : true,
 *     buttons: [
 *       { label: 'Cancel',  action: 'cancel',  classes: 'btn btn-link'    },
 *       { label: 'Delete',  action: 'delete',  classes: 'btn btn-danger'  }
 *     ]
 *   });
 *
 *  The config passed to show() is merged on top of the base MTKDialogConfig.dialog,
 *  so you only need to supply the keys you want to override.
 *
 *  Or publish via wc bus — same result:
 *   wc.publish('mtk-dialog:open', { title: '...', message: '...', buttons: [...] });
 * ─────────────────────────────────────────────────────────────────────────
 */

class MTKDialog {
  /**
   * @param {HTMLElement} element - The <mtk-dialog> root element
   * @param {Object}      config  - Base config from MTKDialogConfig.dialog
   */
  constructor(element, config) {
    this.root        = element;
    this._baseConfig = { ...config };   // immutable base — never mutated directly
    this.config      = { ...config };   // active config — replaced on each show()
    this.isOpen      = false;

    this._render();
    this._bindEvents();
    this._subscribe();
  }

  // ── Rendering ─────────────────────────────────────────────────────────

  _render() {
    const cfg = this.config;

    // Cache DOM references
    this._backdrop  = this.root.querySelector('[data-mtk-backdrop]');
    this._container = this.root.querySelector('[data-mtk-container]');
    this._iconWrap  = this.root.querySelector('[data-mtk-icon-wrap]');
    this._iconEl    = this.root.querySelector('[data-mtk-icon]');
    this._titleEl   = this.root.querySelector('[data-mtk-title]');
    this._messageEl = this.root.querySelector('[data-mtk-message]');
    this._footer    = this.root.querySelector('[data-mtk-footer]');
    this._closeBtn  = this.root.querySelector('[data-mtk-close]');

    // Content
    this._titleEl.textContent   = cfg.title   || '';
    this._messageEl.textContent = cfg.message || '';

    // Icon
    this._iconEl.textContent = cfg.icon || '';
    if (cfg.iconColor) {
      this._iconWrap.style.setProperty('--mtk-icon-color', cfg.iconColor);
      this._iconWrap.style.setProperty('--mtk-icon-bg', this._hexToAlpha(cfg.iconColor, 0.12));
    }

    // Max-width
    if (cfg.maxWidth) {
      this._container.style.setProperty('--mtk-dialog-max-width', cfg.maxWidth);
    }

    // Accessibility
    this.root.setAttribute('aria-labelledby',  'mtk-dialog-title');
    this.root.setAttribute('aria-describedby', 'mtk-dialog-message');

    // Buttons
    this._renderButtons(cfg.buttons || []);
  }

  _renderButtons(buttons) {
    this._footer.innerHTML = '';

    buttons.forEach((btn) => {
      const el = document.createElement('button');
      el.type = 'button';

      // Rule: label "Cancel" always forces btn btn-link regardless of config classes
      el.className         = btn.label === 'Cancel' ? 'btn btn-link' : (btn.classes || 'btn btn-secondary');
      el.textContent       = btn.label;
      el.dataset.mtkAction = btn.action || btn.label.toLowerCase();

      this._footer.appendChild(el);
    });
  }

  // ── Event Binding ─────────────────────────────────────────────────────

  _bindEvents() {
    this._closeBtn.addEventListener('click', () => this._handleClose('close'));

    this._backdrop.addEventListener('click', (e) => {
      if (this.config.closeOnBackdrop && e.target === this._backdrop) {
        this._handleClose('backdrop');
      }
    });

    // Delegated button clicks
    this._footer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-mtk-action]');
      if (btn) this._handleButtonClick(btn.dataset.mtkAction, btn.textContent.trim());
    });

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

  _handleButtonClick(action, label) {
    const payload = {
      dialogId : this.config.id,
      action,
      label,
      timestamp: new Date().toISOString()
    };
    wc.log('[mtk-dialog] Publishing "mtk-dialog:action"', payload);
    wc.publish('mtk-dialog:action', payload);

    if (action === 'cancel') this.close();
  }

  _handleClose(source) {
    const payload = {
      dialogId : this.config.id,
      source,
      timestamp: new Date().toISOString()
    };
    wc.log('[mtk-dialog] Publishing "mtk-dialog:close"', payload);
    wc.publish('mtk-dialog:close', payload);
    this.close();
  }

  // ── wc.subscribe handler ──────────────────────────────────────────────

  /**
   * onMessage — passed as callback to wc.subscribe.
   * Handles all inbound channel messages for this dialog instance.
   *
   * @param {string} event - Channel name
   * @param {Object} data  - Message payload (treated as config for 'mtk-dialog:open')
   */
  onMessage(event, data) {
    switch (event) {
      case 'mtk-dialog:open':
        // data IS the config — identical to calling mtkDialog.show(config)
        this.show(data || {});
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

  // ── Public API ────────────────────────────────────────────────────────

  /**
   * show(config)
   * ─────────────────────────────────────────────────────────────────────
   * Opens the dialog using the supplied config.
   * The supplied config is merged on top of the base MTKDialogConfig.dialog,
   * so you only need to pass the keys you want to change.
   * The dialog re-renders with the merged config before opening.
   *
   * @param {Object} config - Partial or full dialog config
   *
   * Supported config keys:
   *   id              {string}   - Dialog identifier (used in published events)
   *   title           {string}   - Dialog heading text
   *   message         {string}   - Body / description text
   *   icon            {string}   - Material Icon ligature name, e.g. 'warning'
   *   iconColor       {string}   - Hex color for the icon, e.g. '#D32F2F'
   *   maxWidth        {string}   - CSS max-width for the container, e.g. '520px'
   *   closeOnBackdrop {boolean}  - Close when clicking outside the container
   *   closeOnEscape   {boolean}  - Close on Escape key
   *   buttons         {Array}    - Button definitions:
   *     [{ label, action, classes }]
   *     Note: label "Cancel" always receives class "btn btn-link"
   *
   * @example — confirm destructive action
   *   mtkDialog.show({
   *     title    : 'Delete account?',
   *     message  : 'All data will be permanently removed.',
   *     icon     : 'delete_forever',
   *     iconColor: '#D32F2F',
   *     buttons  : [
   *       { label: 'Cancel', action: 'cancel', classes: 'btn btn-link'   },
   *       { label: 'Delete', action: 'delete', classes: 'btn btn-danger' }
   *     ]
   *   });
   *
   * @example — informational
   *   mtkDialog.show({
   *     title  : 'Update available',
   *     message: 'A new version is ready to install.',
   *     icon   : 'system_update',
   *     iconColor: '#1976D2',
   *     buttons: [
   *       { label: 'Later',  action: 'later',  classes: 'btn btn-link'    },
   *       { label: 'Update', action: 'update', classes: 'btn btn-primary' }
   *     ]
   *   });
   */
  show(config = {}) {
    // Merge: base config <- caller config
    // Buttons are deep-cloned so each call gets a clean independent set
    this.config = {
      ...this._baseConfig,
      ...config,
      buttons: config.buttons
        ? config.buttons.map(b => ({ ...b }))
        : (this._baseConfig.buttons || []).map(b => ({ ...b }))
    };

    // Re-render with merged config before making dialog visible
    this._render();

    // Open
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

  // ── Utilities ─────────────────────────────────────────────────────────

  _hexToAlpha(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
}

// ── wc shim ───────────────────────────────────────────────────────────────────
// Safe fallback — the real wc object is provided by the host application.
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

// ── Auto-initialize (waits for element — supports <wc-include>) ───────────────
(function initMTKDialog() {
  const SELECTOR = 'mtk-dialog.mtk-dialog';

  function bootstrap() {
    const el = document.querySelector(SELECTOR);
    if (!el) return false;
    if (el.__mtkDialogInstance) return true;   // already initialized

    if (typeof MTKDialogConfig === 'undefined') {
      console.warn('[mtk-dialog] MTKDialogConfig not found. Load mtk-dialog.config.js first.');
      return false;
    }

    const instance = new MTKDialog(el, { ...MTKDialogConfig.dialog });
    el.__mtkDialogInstance = instance;

    /**
     * window.mtkDialog — global handle
     *
     * Call with config object:
     *   mtkDialog.show({ title: '...', message: '...', buttons: [...] });
     *
     * Close programmatically:
     *   mtkDialog.close();
     *
     * Or use the wc event bus (identical behavior):
     *   wc.publish('mtk-dialog:open',  { title: '...', message: '...', buttons: [...] });
     *   wc.publish('mtk-dialog:close', {});
     */
    window.mtkDialog = instance;
    return true;
  }

  if (bootstrap()) return;

  // Wait for dynamic insertion via <wc-include> or other mechanisms
  const observer = new MutationObserver(() => {
    if (bootstrap()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', () => {
    if (bootstrap()) observer.disconnect();
  });
})();
