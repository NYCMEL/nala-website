/**
 * mtk-gift.js
 * Material Design Gift Form component
 * Vanilla JS class — no frameworks, no libraries
 */

(function () {
  'use strict';

  // ─── Lightweight event bus (wc) ─────────────────────────────────────────────
  // Used for pub/sub across components.
  // If a wc bus already exists on the page, we reuse it.
  if (!window.wc) {
    window.wc = (() => {
      const _channels = {};

      /**
       * Publish a message to a channel.
       * @param {string} channel
       * @param {*} payload
       */
      function publish(channel, payload) {
        if (!_channels[channel]) return;
        _channels[channel].forEach(fn => {
          try { fn({ channel, payload }); } catch (e) { console.error('[wc.publish] handler error:', e); }
        });
      }

      /**
       * Subscribe to a channel.
       * @param {string} channel
       * @param {Function} fn  — callback receives { channel, payload }
       * @returns {Function}   — unsubscribe function
       */
      function subscribe(channel, fn) {
        if (!_channels[channel]) _channels[channel] = [];
        _channels[channel].push(fn);
        return function unsubscribe() {
          _channels[channel] = _channels[channel].filter(f => f !== fn);
        };
      }

      /**
       * Log utility – prefixed, timestamped.
       * @param {string} channel
       * @param {*} payload
       */
      function log(channel, payload) {
        console.log(
          `%c[wc.log] %c${channel}`,
          'color:#a98211;font-weight:700',
          'color:#202124;font-weight:500',
          '→',
          payload,
          `@ ${new Date().toISOString()}`
        );
      }

      return { publish, subscribe, log };
    })();
  }


  // ─── MTKGift Class ──────────────────────────────────────────────────────────
  class MTKGift {
    /**
     * @param {HTMLElement} el  — the <mtk-gift> root element
     * @param {Object}      config — MTKGiftConfig.gift (from mtk-gift.config.js)
     */
    constructor(el, config) {
      if (!el || !config) {
        console.error('[MTKGift] Missing element or config.');
        return;
      }
      this.el     = el;
      this.config = config;
      this._unsubscribers = [];

      this._hydrateStateOptions();
      this._bindEvents();
      this._subscribeAll();

      // Signal component is ready
      this._publish(this.config.events.open, { status: 'ready', id: this.config.id });
    }

    // ── Private: Populate state <select> from config ─────────────────────────
    _hydrateStateOptions() {
      const select = this.el.querySelector('#mtk-gift-state');
      if (!select) return;

      const stateField = this.config.form.fields.find(f => f.id === 'state');
      if (!stateField || !stateField.options) return;

      select.innerHTML = '';
      stateField.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        select.appendChild(option);
      });

      // Float label when a real value is selected
      select.addEventListener('change', () => {
        if (select.value) {
          select.classList.add('has-value');
        } else {
          select.classList.remove('has-value');
        }
      });
    }

    // ── Private: Bind DOM events ─────────────────────────────────────────────
    _bindEvents() {
      const form       = this.el.querySelector('.mtk-gift__form');
      const cancelBtn  = this.el.querySelector('[data-action="cancel"]');

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this._onSubmit();
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => this._onCancel());
      }

      // Keyboard: Escape cancels
      this.el.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this._onCancel();
      });
    }

    // ── Private: Subscribe to all 4 mtk-gift events ──────────────────────────
    _subscribeAll() {
      const events = this.config.events;

      [events.submit, events.cancel, events.open, events.close].forEach(channel => {
        const unsub = wc.subscribe(channel, (msg) => this.onMessage(msg));
        this._unsubscribers.push(unsub);
      });
    }

    /**
     * onMessage — handler passed to wc.subscribe.
     * Called whenever any of the 4 mtk-gift events fire.
     * @param {{ channel: string, payload: * }} msg
     */
    onMessage(msg) {
      console.log('[MTKGift.onMessage]', msg.channel, msg.payload);

      switch (msg.channel) {
        case this.config.events.open:
          // Component opened / ready
          break;
        case this.config.events.submit:
          // Form submitted — data available in msg.payload.data
          break;
        case this.config.events.cancel:
          // Form cancelled
          this._showSnackbar('info', this.config.messages.cancel, 'info');
          break;
        case this.config.events.close:
          // Component closed
          break;
      }
    }

    // ── Private: Publish helper (log → publish) ───────────────────────────────
    _publish(channel, payload) {
      wc.log(channel, payload);
      wc.publish(channel, payload);
    }

    // ── Private: Handle submit ────────────────────────────────────────────────
    _onSubmit() {
      const valid = this._validateForm();
      if (!valid) {
        this._showSnackbar('error', this.config.messages.error, 'error_outline');
        return;
      }

      const data = this._collectFormData();

      const payload = {
        id: this.config.id,
        timestamp: new Date().toISOString(),
        data: Object.assign({
          accountEmail: (window.wc && wc.session && wc.session.user && wc.session.user.email) ? wc.session.user.email : '',
          accountName: (window.wc && wc.session && wc.session.user && wc.session.user.name) ? wc.session.user.name : ''
        }, data)
      };

      const deliveryEndpoint = this.config.deliveryApi && this.config.deliveryApi.enabled
        ? String(this.config.deliveryApi.endpoint || '').trim()
        : '';

      const finishSuccess = () => {
        this._publish(this.config.events.submit, payload);
        this._showSnackbar('success', this.config.messages.success, 'check_circle');
        this._resetForm();
      };

      if (!deliveryEndpoint) {
        finishSuccess();
        return;
      }

      fetch(deliveryEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'nala-gift',
          submittedAt: payload.timestamp,
          form: payload.data
        })
      }).then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || 'Gift delivery request failed.');
        }
        finishSuccess();
      }).catch((err) => {
        console.error('[MTKGift] delivery request failed', err);
        const message = window.wc && typeof wc.customerMessage === 'function'
          ? wc.customerMessage(err, 'Could not submit gift request. Please try again.')
          : 'Could not submit gift request. Please try again.';
        this._showSnackbar('error', message, 'error_outline');
      });
    }

    // ── Private: Handle cancel ────────────────────────────────────────────────
    _onCancel() {
      this._publish(this.config.events.cancel, {
        id:        this.config.id,
        timestamp: new Date().toISOString()
      });
    }

    // ── Private: Validate form fields ────────────────────────────────────────
    _validateForm() {
      let isValid = true;

      // Required text / select fields
      const requiredFields = this.el.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        const wrapper   = field.closest('[data-field]');
        const errorSpan = wrapper ? wrapper.querySelector('.mtk-gift__field-error') : null;
        const empty     = !field.value || !field.value.trim();

        if (empty) {
          field.classList.add('is-invalid');
          field.setAttribute('aria-invalid', 'true');
          if (errorSpan) errorSpan.classList.add('is-visible');
          isValid = false;
        } else {
          field.classList.remove('is-invalid');
          field.setAttribute('aria-invalid', 'false');
          if (errorSpan) errorSpan.classList.remove('is-visible');
        }
      });

      // State must be a valid configured US state or territory
      const stateSelect = this.el.querySelector('#mtk-gift-state');
      if (stateSelect) {
        const allowed = (this.config.form.fields.find(f => f.id === 'state')?.options || []).map(opt => String(opt.value || '')).filter(Boolean);
        if (!allowed.includes(String(stateSelect.value || '').trim())) {
          stateSelect.classList.add('is-invalid');
          stateSelect.setAttribute('aria-invalid', 'true');
          const wrapper = stateSelect.closest('[data-field]');
          const errorSpan = wrapper ? wrapper.querySelector('.mtk-gift__field-error') : null;
          if (errorSpan) errorSpan.classList.add('is-visible');
          isValid = false;
        }
      }

      // ZIP pattern validation
      const zipInput = this.el.querySelector('#mtk-gift-zip');
      if (zipInput && zipInput.value) {
        const zipPattern = /^[0-9]{5}(-[0-9]{4})?$/;
        if (!zipPattern.test(zipInput.value.trim())) {
          zipInput.classList.add('is-invalid');
          zipInput.setAttribute('aria-invalid', 'true');
          const wrapper   = zipInput.closest('[data-field]');
          const errorSpan = wrapper ? wrapper.querySelector('.mtk-gift__field-error') : null;
          if (errorSpan) errorSpan.classList.add('is-visible');
          isValid = false;
        }
      }

      // Move focus to first invalid field
      if (!isValid) {
        const firstInvalid = this.el.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
      }

      return isValid;
    }

    // ── Private: Collect form data as plain object ────────────────────────────
    _collectFormData() {
      const form = this.el.querySelector('.mtk-gift__form');
      if (!form) return {};
      const fd = new FormData(form);
      const data = {};
      fd.forEach((value, key) => { data[key] = value; });
      data.country = 'US';
      return data;
    }

    // ── Private: Reset form ───────────────────────────────────────────────────
    _resetForm() {
      const form = this.el.querySelector('.mtk-gift__form');
      if (!form) return;
      form.reset();

      // Remove validation states
      this.el.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
        el.removeAttribute('aria-invalid');
      });
      this.el.querySelectorAll('.mtk-gift__field-error.is-visible').forEach(el => {
        el.classList.remove('is-visible');
      });

      // Reset select has-value
      const stateSelect = this.el.querySelector('#mtk-gift-state');
      if (stateSelect) stateSelect.classList.remove('has-value');
    }

    // ── Private: Show snackbar feedback ──────────────────────────────────────
    _showSnackbar(type, message, icon) {
      const snackbar  = this.el.querySelector('#mtk-gift-snackbar');
      if (!snackbar) return;

      const iconEl    = snackbar.querySelector('.material-icons');
      const textEl    = snackbar.querySelector('.mtk-gift__snackbar-text');

      // Reset classes
      snackbar.classList.remove('is-visible', 'mtk-gift__snackbar--success', 'mtk-gift__snackbar--error', 'mtk-gift__snackbar--info');

      if (iconEl) iconEl.textContent = icon || '';
      if (textEl) textEl.textContent = message;

      snackbar.classList.add('is-visible', `mtk-gift__snackbar--${type}`);

      // Auto-hide after 4 s
      if (this._snackbarTimer) clearTimeout(this._snackbarTimer);
      this._snackbarTimer = setTimeout(() => {
        snackbar.classList.remove('is-visible');
      }, 4000);
    }

    // ── Public: Destroy — clean up subscriptions ──────────────────────────────
    destroy() {
      this._unsubscribers.forEach(fn => fn());
      this._unsubscribers = [];
      this._publish(this.config.events.close, { id: this.config.id });
    }
  }


  // ─── Init: Wait for <mtk-gift> to be available in the DOM ──────────────────
  // Supports both immediate availability and <wc-include> deferred injection.

  function initMTKGift() {
    const els = document.querySelectorAll('mtk-gift.mtk-gift, .mtk-gift');
    if (!els.length) return;

    if (typeof MTKGiftConfig === 'undefined') {
      console.error('[MTKGift] MTKGiftConfig not found. Make sure mtk-gift.config.js is loaded first.');
      return;
    }

    els.forEach(el => {
      if (el.__mtkGiftInstance) return;  // already initialised
      el.__mtkGiftInstance = new MTKGift(el, MTKGiftConfig.gift);
    });
  }

  // 1. Try immediately (element already in DOM)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMTKGift);
  } else {
    initMTKGift();
  }

  // 2. MutationObserver — handles <wc-include> injecting the HTML later
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        // Direct match
        if (node.matches && (node.matches('mtk-gift.mtk-gift') || node.matches('.mtk-gift'))) {
          if (!node.__mtkGiftInstance) {
            if (typeof MTKGiftConfig !== 'undefined') {
              node.__mtkGiftInstance = new MTKGift(node, MTKGiftConfig.gift);
            }
          }
        }

        // Descendant match (wc-include wraps inside another container)
        const nested = node.querySelectorAll ? node.querySelectorAll('mtk-gift.mtk-gift, .mtk-gift') : [];
        nested.forEach(el => {
          if (!el.__mtkGiftInstance && typeof MTKGiftConfig !== 'undefined') {
            el.__mtkGiftInstance = new MTKGift(el, MTKGiftConfig.gift);
          }
        });
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Expose class globally for external use
  window.MTKGift = MTKGift;

})();

