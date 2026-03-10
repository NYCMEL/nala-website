/**
 * mtk-buy.js
 * Reusable buy/purchase popup component.
 * Vanilla JS · Material Design · wc.publish / wc.subscribe event bus
 */

import MTK_BUY_CONFIG from './mtk-buy.config.js';

// =============================================================================
// Lightweight fallback event bus (used only when wc is not present on window)
// =============================================================================
const _bus = (() => {
  const _map = new Map();
  return {
    publish(event, data) {
      (_map.get(event) || []).forEach(fn => fn(data));
    },
    subscribe(event, fn) {
      if (!_map.has(event)) _map.set(event, []);
      _map.get(event).push(fn);
    },
    log(msg, data) {
      console.log(`[wc.log] ${msg}`, data ?? '');
    }
  };
})();

/**
 * Returns the wc bus if available on window, otherwise the local fallback.
 * Components always call via getWC() so they always reference the live object.
 */
function getWC() {
  return window.wc || _bus;
}

// =============================================================================
// MtkBuy — main component class
// =============================================================================
class MtkBuy {
  /**
   * @param {HTMLElement} rootEl — the <mtk-buy> host element
   * @param {object}      config — MTK_BUY_CONFIG
   */
  constructor(rootEl, config) {
    this._root   = rootEl;
    this._config = config;
    this._isOpen = false;

    this._backdrop  = null;
    this._dialog    = null;
    this._lastFocus = null; // element to restore focus to on close

    this._init();
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  _init() {
    this._queryElements();
    this._populateFromConfig();
    this._bindInternalEvents();
    this._subscribeToEventBus();
    this._publishReady();
  }

  _queryElements() {
    const r = this._root;
    this._backdrop      = r.querySelector('.mtk-buy__backdrop');
    this._dialog        = r.querySelector('.mtk-buy__dialog');
    this._titleEl       = r.querySelector('.mtk-buy__title');
    this._subtitleEl    = r.querySelector('.mtk-buy__subtitle');
    this._purchaseBtn   = r.querySelector('[data-mtk-action="purchase"]');
    this._closeBtns     = r.querySelectorAll('[data-mtk-action="close"]');
  }

  _populateFromConfig() {
    const { popup, button } = this._config;

    if (this._titleEl)    this._titleEl.textContent    = popup.title;
    if (this._subtitleEl) this._subtitleEl.textContent = popup.subtitle;

    if (this._purchaseBtn) {
      // Keep the icon, append label text node
      const labelNode = document.createTextNode(` ${button.label}`);
      this._purchaseBtn.appendChild(labelNode);
      this._purchaseBtn.setAttribute('aria-label', button.ariaLabel);
    }
  }

  // ---------------------------------------------------------------------------
  // DOM event bindings (internal to the component)
  // ---------------------------------------------------------------------------
  _bindInternalEvents() {
    // Close buttons (X + "Maybe Later")
    this._closeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // Purchase CTA
    if (this._purchaseBtn) {
      this._purchaseBtn.addEventListener('click', (e) => {
        this._addRipple(this._purchaseBtn, e);
        this._onPurchaseClick();
      });
    }

    // Ripple on text button clicks
    this._closeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this._addRipple(btn, e));
    });

    // Backdrop click → close (if configured)
    if (this._config.popup.closeOnBackdrop) {
      this._backdrop.addEventListener('click', (e) => {
        if (e.target === this._backdrop) this.close();
      });
    }

    // Keyboard: Escape → close, Tab → trap focus
    this._backdrop.addEventListener('keydown', (e) => {
      if (!this._isOpen) return;
      if (e.key === 'Escape' && this._config.popup.closeOnEscape) {
        e.preventDefault();
        this.close();
      }
      if (e.key === 'Tab') {
        this._trapFocus(e);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Event bus (wc.publish / wc.subscribe)
  // ---------------------------------------------------------------------------
  _subscribeToEventBus() {
    const wc     = getWC();
    const events = this._config.events;

    // Subscribe to all 4 mtk-buy events
    wc.subscribe(events.open,     (data) => this._onMessage(events.open,     data));
    wc.subscribe(events.close,    (data) => this._onMessage(events.close,    data));
    wc.subscribe(events.purchase, (data) => this._onMessage(events.purchase, data));
    wc.subscribe(events.ready,    (data) => this._onMessage(events.ready,    data));
  }

  /**
   * Central message handler passed to wc.subscribe.
   * Routes incoming events to the appropriate component method.
   *
   * @param {string} event - event name
   * @param {*}      data  - event payload
   */
  _onMessage(event, data) {
    const events = this._config.events;
    console.log(`[mtk-buy] onMessage received → "${event}"`, data ?? '');

    switch (event) {
      case events.open:
        this.open();
        break;

      case events.close:
        this.close();
        break;

      case events.purchase:
        // External system confirmed purchase — could redirect, etc.
        console.log('[mtk-buy] Purchase confirmed externally:', data);
        break;

      case events.ready:
        console.log('[mtk-buy] Component is ready:', data);
        break;

      default:
        console.warn('[mtk-buy] Unknown event received:', event, data);
    }
  }

  _publishReady() {
    const wc      = getWC();
    const payload = { component: this._config.component, version: this._config.version };

    wc.log('[mtk-buy] Publishing ready event', payload);
    console.log('[mtk-buy] Publishing →', this._config.events.ready, payload);
    wc.publish(this._config.events.ready, payload);
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /** Open the popup */
  open() {
    if (this._isOpen) return;
    this._isOpen    = true;
    this._lastFocus = document.activeElement;

    this._backdrop.classList.add('is-open');
    this._backdrop.removeAttribute('hidden');

    // Move focus into dialog for screen-reader / keyboard users
    requestAnimationFrame(() => {
      this._dialog.focus();
    });

    const wc      = getWC();
    const payload = { component: this._config.component, timestamp: Date.now() };
    wc.log('[mtk-buy] Publishing open event', payload);
    console.log('[mtk-buy] Publishing →', this._config.events.open, payload);
    wc.publish(this._config.events.open, payload);
  }

  /** Close the popup */
  close() {
    if (!this._isOpen) return;
    this._isOpen = false;

    this._backdrop.classList.remove('is-open');

    // Restore focus
    if (this._lastFocus && typeof this._lastFocus.focus === 'function') {
      this._lastFocus.focus();
    }

    const wc      = getWC();
    const payload = { component: this._config.component, timestamp: Date.now() };
    wc.log('[mtk-buy] Publishing close event', payload);
    console.log('[mtk-buy] Publishing →', this._config.events.close, payload);
    wc.publish(this._config.events.close, payload);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  _onPurchaseClick() {
    const wc      = getWC();
    const payload = {
      component:  this._config.component,
      action:     'purchase',
      timestamp:  Date.now()
    };

    wc.log('[mtk-buy] Publishing purchase event', payload);
    console.log('[mtk-buy] Publishing →', this._config.events.purchase, payload);
    wc.publish(this._config.events.purchase, payload);

    // Default UX: close the popup after triggering purchase
    this.close();
  }

  /** Material ripple effect */
  _addRipple(btn, e) {
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = (e.clientX - rect.left) - size / 2;
    const y      = (e.clientY - rect.top)  - size / 2;

    const ripple = document.createElement('span');
    ripple.className   = 'mtk-buy__ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  /** Trap focus within the dialog while it is open (ADA) */
  _trapFocus(e) {
    const focusable = Array.from(
      this._dialog.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.closest('[hidden]'));

    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

// =============================================================================
// Bootstrap — wait for the host element (handles <wc-include> deferred loading)
// =============================================================================
(function bootstrap() {
  const SELECTOR = 'mtk-buy.mtk-buy';

  function mount(el) {
    if (el._mtkBuyInstance) return;                     // already mounted
    el._mtkBuyInstance = new MtkBuy(el, MTK_BUY_CONFIG);
    console.log('[mtk-buy] Mounted on', el);
  }

  // 1. If element already exists, mount immediately
  const existing = document.querySelector(SELECTOR);
  if (existing) {
    mount(existing);
    return;
  }

  // 2. Otherwise, observe the DOM for dynamic insertion (wc-include, etc.)
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        // Check the node itself
        if (node.matches && node.matches(SELECTOR)) {
          mount(node);
          observer.disconnect();
          return;
        }

        // Check descendants
        const found = node.querySelector && node.querySelector(SELECTOR);
        if (found) {
          mount(found);
          observer.disconnect();
          return;
        }
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  console.log('[mtk-buy] Waiting for <mtk-buy> element in DOM…');
})();
