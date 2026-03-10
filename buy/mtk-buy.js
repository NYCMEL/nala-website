/**
 * mtk-buy.js
 * Reusable buy/purchase popup component.
 * Vanilla JS · Material Design · wc.publish / wc.subscribe event bus
 *
 * Depends on:  mtk-buy.config.js  loaded BEFORE this file as a plain <script>
 *              window.MTK_BUY_CONFIG is expected to exist at runtime
 */

(function () {
  'use strict';

  // ===========================================================================
  // Lightweight fallback event bus (used only when window.wc is absent)
  // ===========================================================================
  var _bus = (function () {
    var _map = {};
    return {
      publish: function (event, data) {
        (_map[event] || []).forEach(function (fn) { fn(data); });
      },
      subscribe: function (event, fn) {
        if (!_map[event]) _map[event] = [];
        _map[event].push(fn);
      },
      log: function (msg, data) {
        console.log('[wc.log] ' + msg, data !== undefined ? data : '');
      }
    };
  }());

  function getWC() {
    return window.wc || _bus;
  }

  // ===========================================================================
  // MtkBuy class
  // ===========================================================================
  function MtkBuy(rootEl, config) {
    this._root   = rootEl;
    this._config = config;
    this._isOpen = false;

    this._backdrop    = null;
    this._dialog      = null;
    this._titleEl     = null;
    this._subtitleEl  = null;
    this._purchaseBtn = null;
    this._closeBtns   = [];
    this._lastFocus   = null;

    this._init();
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  MtkBuy.prototype._init = function () {
    this._queryElements();
    this._populateFromConfig();
    this._bindInternalEvents();
    this._subscribeToEventBus();
    this._publishReady();
  };

  MtkBuy.prototype._queryElements = function () {
    var r = this._root;
    this._backdrop    = r.querySelector('.mtk-buy__backdrop');
    this._dialog      = r.querySelector('.mtk-buy__dialog');
    this._titleEl     = r.querySelector('.mtk-buy__title');
    this._subtitleEl  = r.querySelector('.mtk-buy__subtitle');
    this._purchaseBtn = r.querySelector('[data-mtk-action="purchase"]');
    this._closeBtns   = Array.prototype.slice.call(r.querySelectorAll('[data-mtk-action="close"]'));
  };

  MtkBuy.prototype._populateFromConfig = function () {
    var popup  = this._config.popup;
    var button = this._config.button;

    if (this._titleEl)    this._titleEl.textContent   = popup.title;
    if (this._subtitleEl) this._subtitleEl.textContent = popup.subtitle;

    if (this._purchaseBtn) {
      // Label text node appended after the icon span already in markup
      var labelNode = document.createTextNode(' ' + button.label);
      this._purchaseBtn.appendChild(labelNode);
      this._purchaseBtn.setAttribute('aria-label', button.ariaLabel);
    }
  };

  // ---------------------------------------------------------------------------
  // Internal DOM event bindings
  // ---------------------------------------------------------------------------
  MtkBuy.prototype._bindInternalEvents = function () {
    var self = this;

    // Close buttons (header × + "Maybe Later")
    this._closeBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        self._addRipple(btn, e);
        self.close();
      });
    });

    // Purchase CTA
    if (this._purchaseBtn) {
      this._purchaseBtn.addEventListener('click', function (e) {
        self._addRipple(self._purchaseBtn, e);
        self._onPurchaseClick();
      });
    }

    // Backdrop click → close
    if (this._config.popup.closeOnBackdrop && this._backdrop) {
      this._backdrop.addEventListener('click', function (e) {
        if (e.target === self._backdrop) self.close();
      });
    }

    // Keyboard: Escape + focus-trap
    if (this._backdrop) {
      this._backdrop.addEventListener('keydown', function (e) {
        if (!self._isOpen) return;
        if (e.key === 'Escape' && self._config.popup.closeOnEscape) {
          e.preventDefault();
          self.close();
        }
        if (e.key === 'Tab') {
          self._trapFocus(e);
        }
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Event bus — subscribe to all 4 mtk-buy events
  // ---------------------------------------------------------------------------
  MtkBuy.prototype._subscribeToEventBus = function () {
    var wc     = getWC();
    var events = this._config.events;
    var self   = this;

    wc.subscribe(events.open,     function (data) { self._onMessage(events.open,     data); });
    wc.subscribe(events.close,    function (data) { self._onMessage(events.close,    data); });
    wc.subscribe(events.purchase, function (data) { self._onMessage(events.purchase, data); });
    wc.subscribe(events.ready,    function (data) { self._onMessage(events.ready,    data); });
  };

  /**
   * Central message handler passed to wc.subscribe.
   * Routes incoming bus events to component methods.
   */
  MtkBuy.prototype._onMessage = function (event, data) {
    var events = this._config.events;
    console.log('[mtk-buy] onMessage received → "' + event + '"', data !== undefined ? data : '');

    switch (event) {
      case events.open:
        this.open();
        break;
      case events.close:
        this.close();
        break;
      case events.purchase:
        console.log('[mtk-buy] Purchase confirmed externally:', data);
        break;
      case events.ready:
        console.log('[mtk-buy] Component is ready:', data);
        break;
      default:
        console.warn('[mtk-buy] Unknown event received:', event, data);
    }
  };

  MtkBuy.prototype._publishReady = function () {
    var wc      = getWC();
    var payload = { component: this._config.component, version: this._config.version };

    wc.log('[mtk-buy] Publishing ready event', payload);
    console.log('[mtk-buy] Publishing →', this._config.events.ready, payload);
    wc.publish(this._config.events.ready, payload);
  };

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------
  MtkBuy.prototype.open = function () {
    if (this._isOpen) return;
    this._isOpen    = true;
    this._lastFocus = document.activeElement;

    this._backdrop.classList.add('is-open');
    this._backdrop.removeAttribute('hidden');

    var dialog = this._dialog;
    requestAnimationFrame(function () { dialog.focus(); });

    var wc      = getWC();
    var payload = { component: this._config.component, timestamp: Date.now() };
    wc.log('[mtk-buy] Publishing open event', payload);
    console.log('[mtk-buy] Publishing →', this._config.events.open, payload);
    wc.publish(this._config.events.open, payload);
  };

  MtkBuy.prototype.close = function () {
    if (!this._isOpen) return;
    this._isOpen = false;

    this._backdrop.classList.remove('is-open');

    if (this._lastFocus && typeof this._lastFocus.focus === 'function') {
      this._lastFocus.focus();
    }

    var wc      = getWC();
    var payload = { component: this._config.component, timestamp: Date.now() };
    wc.log('[mtk-buy] Publishing close event', payload);
    console.log('[mtk-buy] Publishing →', this._config.events.close, payload);
    wc.publish(this._config.events.close, payload);
  };

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------
  MtkBuy.prototype._onPurchaseClick = function () {
    var wc      = getWC();
    var payload = {
      component: this._config.component,
      action:    'purchase',
      timestamp: Date.now()
    };

    wc.log('[mtk-buy] Publishing purchase event', payload);
    console.log('[mtk-buy] Publishing →', this._config.events.purchase, payload);
    wc.publish(this._config.events.purchase, payload);

    this.close();
  };

  MtkBuy.prototype._addRipple = function (btn, e) {
    var rect   = btn.getBoundingClientRect();
    var size   = Math.max(rect.width, rect.height);
    var x      = (e.clientX - rect.left) - size / 2;
    var y      = (e.clientY - rect.top)  - size / 2;

    var wave = document.createElement('span');
    wave.className = 'mtk-ripple-wave';           // uses nala's .mtk-ripple-wave + keyframe
    wave.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + x + 'px;top:' + y + 'px';

    btn.appendChild(wave);
    wave.addEventListener('animationend', function () { wave.remove(); });
  };

  MtkBuy.prototype._trapFocus = function (e) {
    var focusable = Array.prototype.slice.call(
      this._dialog.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (el) { return !el.closest('[hidden]'); });

    if (!focusable.length) return;

    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  };

  // ===========================================================================
  // Bootstrap — waits for <mtk-buy> element (safe with <wc-include>)
  // ===========================================================================
  function mount(el) {
    if (el._mtkBuyInstance) return;
    var config = window.MTK_BUY_CONFIG;
    if (!config) {
      console.error('[mtk-buy] window.MTK_BUY_CONFIG not found. Load mtk-buy.config.js first.');
      return;
    }
    el._mtkBuyInstance = new MtkBuy(el, config);
    console.log('[mtk-buy] Mounted on', el);
  }

  function bootstrap() {
    var SELECTOR = 'mtk-buy.mtk-buy';

    // 1. Already in DOM
    var existing = document.querySelector(SELECTOR);
    if (existing) { mount(existing); return; }

    // 2. Watch for dynamic insertion (<wc-include> / lazy load)
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) continue;

          if (node.matches && node.matches(SELECTOR)) {
            mount(node);
            observer.disconnect();
            return;
          }
          var found = node.querySelector && node.querySelector(SELECTOR);
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
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

}());
