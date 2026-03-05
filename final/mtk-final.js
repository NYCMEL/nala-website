/**
 * mtk-final.js
 * Certificate email selection component.
 * Waits for <mtk-final> to appear in the DOM (supports <wc-include>).
 * Reads all data from MTK_FINAL_CONFIG (mtk-final.config.js).
 * Publishes events via wc.publish / subscribes via wc.subscribe.
 */

(function () {
    'use strict';

    // ── Guard: config must be loaded ─────────────────────────────────
    if (typeof MTK_FINAL_CONFIG === 'undefined') {
	console.error('[mtk-final] MTK_FINAL_CONFIG not found. Load mtk-final.config.js first.');
	return;
    }

    const CFG = MTK_FINAL_CONFIG;

    // ════════════════════════════════════════════════════════════════
    //  MtkFinal Class
    // ════════════════════════════════════════════════════════════════
    class MtkFinal {

	/**
	 * @param {HTMLElement} root  — the <mtk-final> element
	 */
	constructor(root) {
	    this.root   = root;
	    this.S      = CFG.strings;
	    this.E      = CFG.events;
	    this.choice = 'keep';          // 'keep' | 'new'

	    this._hydrate();
	    this._bindEvents();
	    this._subscribeAll();
	    this._publish(this.E.ready, { component: 'mtk-final', status: 'initialised' });
	}


	// ── 1. Hydrate: fill all data-mtk bindings ──────────────────────
	_hydrate() {
	    const S = this.S;
	    const U = CFG.user;

	    const bindings = {
		successHeading:    S.successHeading,
		successSubheading: S.successSubheading,
		currentEmailLabel: S.currentEmailLabel,
		currentEmail:      U.currentEmail,
		optionKeep:        S.optionKeep,
		optionNew:         S.optionNew,
		newEmailLabel:     S.newEmailLabel,
		newEmailHint:      S.newEmailHint,
		confirmEmailLabel: S.confirmEmailLabel,
		confirmEmailHint:  S.confirmEmailHint,
		submitLabel:       S.submitLabel,
		successToast:      S.successToast,
	    };

	    // Text bindings
	    this.root.querySelectorAll('[data-mtk]').forEach(el => {
		const key = el.dataset.mtk;
		if (key in bindings) el.textContent = bindings[key];
	    });

	    // The "keep" option description shows current email
	    this.root.querySelectorAll('[data-mtk-desc]').forEach(el => {
		const key = el.dataset.mtkDesc;
		if (key === 'currentEmail') el.textContent = U.currentEmail;
	    });
	}


	// ── 2. Bind all DOM events ──────────────────────────────────────
	_bindEvents() {
	    // Radio change → toggle new email panel
	    this.root.querySelectorAll('.mtk-final__radio').forEach(radio => {
		radio.addEventListener('change', e => this._onRadioChange(e));
		// Keyboard: Space / Enter also fires 'change', but ensure Enter is handled
		radio.addEventListener('keydown', e => {
		    if (e.key === 'Enter') { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
		});
	    });

	    // Clicking anywhere on an option card selects its radio
	    this.root.querySelectorAll('.mtk-final__option').forEach(card => {
		card.addEventListener('click', e => {
		    const radio = card.querySelector('.mtk-final__radio');
		    if (radio && !radio.checked) {
			radio.checked = true;
			radio.dispatchEvent(new Event('change', { bubbles: true }));
		    }
		});
	    });

	    // Live validation on email fields
	    const inp1 = this._q('#mtk-input-email1');
	    const inp2 = this._q('#mtk-input-email2');

	    if (inp1) {
		inp1.addEventListener('input',  () => this._validateField(inp1));
		inp1.addEventListener('blur',   () => this._validateField(inp1, true));
		inp1.addEventListener('focus',  () => this._floatLabel(inp1, true));
		inp1.addEventListener('blur',   () => this._floatLabel(inp1, false));
		inp1.addEventListener('input',  () => this._checkMatch());
	    }
	    if (inp2) {
		inp2.addEventListener('input',  () => this._validateField(inp2));
		inp2.addEventListener('blur',   () => this._validateField(inp2, true));
		inp2.addEventListener('focus',  () => this._floatLabel(inp2, true));
		inp2.addEventListener('blur',   () => this._floatLabel(inp2, false));
		inp2.addEventListener('input',  () => this._checkMatch());
	    }

	    // Toggle show/hide email text
	    this.root.querySelectorAll('[data-mtk-toggle]').forEach(btn => {
		btn.addEventListener('click', () => {
		    const id   = btn.dataset.mtkToggle;
		    const inp  = this._q(`#mtk-input-${id}`);
		    const icon = btn.querySelector('.material-icons');
		    if (!inp) return;
		    const show = inp.type === 'email';
		    inp.type   = show ? 'text' : 'email';
		    if (icon) icon.textContent = show ? 'visibility_off' : 'visibility';
		    btn.setAttribute('aria-label', show ? 'Hide email' : 'Show email');
		});
	    });

	    // Form submit
	    const form = this._q('.mtk-final__form');
	    if (form) form.addEventListener('submit', e => this._onSubmit(e));
	}


	// ── 3. Subscribe to all 4 component events ─────────────────────
	_subscribeAll() {
	    Object.values(this.E).forEach(eventName => {
		this._subscribe(eventName, this._onMessage.bind(this));
	    });
	}

	/**
	 * onMessage — central handler for all subscribed events.
	 * Passed as the callback to wc.subscribe.
	 */
	_onMessage(eventName, data) {
	    console.log(`[mtk-final] onMessage received → ${eventName}`, data);
	}


	// ── 4. Radio change handler ─────────────────────────────────────
	_onRadioChange(e) {
	    const value = e.target.value;           // 'keep' | 'new'
	    this.choice = value;

	    // Update option card selected state
	    this.root.querySelectorAll('.mtk-final__option').forEach(card => {
		const isSelected = card.dataset.mtkOption === value;
		card.classList.toggle('mtk-final__option--selected', isSelected);
	    });

	    // Show / hide new email panel
	    const panel = this._q('#mtk-new-email-panel');
	    const isNew = value === 'new';
	    if (panel) {
		panel.classList.toggle('mtk-final__new-email-panel--open', isNew);
		panel.setAttribute('aria-hidden', String(!isNew));
	    }

	    // Toggle tabindex on panel inputs
	    ['#mtk-input-email1', '#mtk-input-email2'].forEach(sel => {
		const inp = this._q(sel);
		if (inp) inp.setAttribute('tabindex', isNew ? '0' : '-1');
	    });
	    this.root.querySelectorAll('[data-mtk-toggle]').forEach(btn => {
		btn.setAttribute('tabindex', isNew ? '0' : '-1');
	    });

	    // Clear panel on hide
	    if (!isNew) {
		this._clearNewEmailPanel();
	    }

	    this._publish(this.E.change, { choice: value });
	}


	// ── 5. Submit handler ───────────────────────────────────────────
	_onSubmit(e) {
	    e.preventDefault();

	    const valid = this._validate();
	    if (!valid) return;

	    const btn = this._q('.mtk-final__submit');
	    btn?.classList.add('mtk-final__submit--loading');

	    const payload = {
		choice:   this.choice,
		email:    this.choice === 'keep'
		    ? CFG.user.currentEmail
		    : this._q('#mtk-input-email1')?.value.trim(),
	    };

	    // Simulate async (replace with real API call)
	    setTimeout(() => {
		btn?.classList.remove('mtk-final__submit--loading');
		this._showToast();
		this._publish(this.E.submit, payload);
	    }, 1200);
	}


	// ── 6. Validation ───────────────────────────────────────────────
	_validate() {
	    if (this.choice === 'keep') return true;

	    const inp1   = this._q('#mtk-input-email1');
	    const inp2   = this._q('#mtk-input-email2');
	    let allValid = true;

	    [inp1, inp2].forEach(inp => {
		if (!this._validateField(inp, true)) allValid = false;
	    });

	    if (allValid && inp1.value.trim() !== inp2.value.trim()) {
		this._setFieldError(this._q('#mtk-field-email2'), this.S.mismatchError);
		inp2.setAttribute('aria-invalid', 'true');
		allValid = false;
	    }

	    if (!allValid) {
		this._publish(this.E.error, {
		    reason: 'validation',
		    choice: this.choice,
		});
	    }

	    return allValid;
	}

	/**
	 * Validate a single input field.
	 * @param {HTMLInputElement} inp
	 * @param {boolean} showError — true when called on blur or submit
	 * @returns {boolean}
	 */
	_validateField(inp, showError = false) {
	    const fieldId = inp.id === 'mtk-input-email1' ? 'mtk-field-email1' : 'mtk-field-email2';
	    const field   = this._q(`#${fieldId}`);
	    const val     = inp.value.trim();

	    if (!val) {
		if (showError) this._setFieldError(field, this.S.requiredError);
		else           this._clearFieldState(field);
		inp.setAttribute('aria-invalid', showError ? 'true' : 'false');
		return false;
	    }

	    if (!this._isValidEmail(val)) {
		if (showError) this._setFieldError(field, this.S.invalidEmailError);
		inp.setAttribute('aria-invalid', 'true');
		return false;
	    }

	    // Valid
	    this._setFieldSuccess(field);
	    inp.setAttribute('aria-invalid', 'false');
	    return true;
	}

	_isValidEmail(v) {
	    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
	}

	_setFieldError(field, msg) {
	    if (!field) return;
	    field.classList.add('mtk-final__field--error');
	    field.classList.remove('mtk-final__field--success');
	    const hint = field.querySelector('.mtk-final__field-hint');
	    if (hint) {
		hint.textContent = msg;
		hint.classList.add('mtk-final__field-hint--error');
	    }
	}

	_setFieldSuccess(field) {
	    if (!field) return;
	    field.classList.remove('mtk-final__field--error');
	    field.classList.add('mtk-final__field--success');
	    const hint    = field.querySelector('.mtk-final__field-hint');
	    const hintKey = field.id === 'mtk-field-email1' ? 'newEmailHint' : 'confirmEmailHint';
	    if (hint) {
		hint.textContent = this.S[hintKey];
		hint.classList.remove('mtk-final__field-hint--error');
	    }
	}

	_clearFieldState(field) {
	    if (!field) return;
	    field.classList.remove('mtk-final__field--error', 'mtk-final__field--success');
	    const hint    = field.querySelector('.mtk-final__field-hint');
	    const hintKey = field.id === 'mtk-field-email1' ? 'newEmailHint' : 'confirmEmailHint';
	    if (hint) {
		hint.textContent = this.S[hintKey];
		hint.classList.remove('mtk-final__field-hint--error');
	    }
	}


	// ── 7. Real-time match check ────────────────────────────────────
	_checkMatch() {
	    const inp1  = this._q('#mtk-input-email1');
	    const inp2  = this._q('#mtk-input-email2');
	    const badge = this._q('#mtk-match-badge');
	    if (!inp1 || !inp2 || !badge) return;

	    const v1 = inp1.value.trim();
	    const v2 = inp2.value.trim();

	    badge.classList.remove('mtk-final__match-badge--match', 'mtk-final__match-badge--mismatch');
	    badge.textContent = '';

	    if (!v1 || !v2) return;

	    if (v1 === v2 && this._isValidEmail(v1)) {
		badge.classList.add('mtk-final__match-badge--match');
		badge.innerHTML = `<span class="material-icons" aria-hidden="true">check_circle</span>${this.S.matchConfirmed}`;
	    } else if (v2.length > 0) {
		badge.classList.add('mtk-final__match-badge--mismatch');
		badge.innerHTML = `<span class="material-icons" aria-hidden="true">error_outline</span>${this.S.mismatchError}`;
	    }
	}


	// ── 8. Floating label helper ────────────────────────────────────
	_floatLabel(inp, isFocused) {
	    const label = inp.parentElement?.querySelector('.mtk-final__field-label');
	    if (!label) return;
	    const hasValue = inp.value.length > 0;
	    label.classList.toggle('mtk-final__field-label--float',   isFocused || hasValue);
	    label.classList.toggle('mtk-final__field-label--focused', isFocused);
	}


	// ── 9. Clear new-email panel ────────────────────────────────────
	_clearNewEmailPanel() {
	    ['#mtk-input-email1', '#mtk-input-email2'].forEach(sel => {
		const inp = this._q(sel);
		if (!inp) return;
		inp.value = '';
		inp.setAttribute('aria-invalid', 'false');
		this._floatLabel(inp, false);
	    });
	    ['#mtk-field-email1', '#mtk-field-email2'].forEach(sel => {
		this._clearFieldState(this._q(sel));
	    });
	    const badge = this._q('#mtk-match-badge');
	    if (badge) {
		badge.textContent = '';
		badge.className = 'mtk-final__match-badge';
	    }
	}


	// ── 10. Toast ───────────────────────────────────────────────────
	_showToast() {
	    const toast = this._q('#mtk-toast');
	    if (!toast) return;
	    toast.classList.add('mtk-final__toast--show');
	    // Auto-dismiss after 5 s
	    setTimeout(() => toast.classList.remove('mtk-final__toast--show'), 5000);
	}


	// ── Utilities ───────────────────────────────────────────────────

	/** Scoped querySelector */
	_q(selector) {
	    return this.root.querySelector(selector);
	}

	/**
	 * Publish an event via wc.publish (if available).
	 * Always logs with wc.log before publishing.
	 */
	_publish(eventName, data = {}) {
	    const payload = { event: eventName, ...data, timestamp: Date.now() };

	    if (typeof wc !== 'undefined' && typeof wc.log === 'function') {
		wc.log(`[mtk-final] publishing → ${eventName}`, payload);
	    } else {
		console.log(`[mtk-final] publishing → ${eventName}`, payload);
	    }

	    if (typeof wc !== 'undefined' && typeof wc.publish === 'function') {
		wc.publish(eventName, payload);
	    }
	}

	/**
	 * Subscribe to an event via wc.subscribe (if available).
	 * Falls back to a DOM CustomEvent listener on the root element.
	 */
	_subscribe(eventName, callback) {
	    if (typeof wc !== 'undefined' && typeof wc.subscribe === 'function') {
		wc.subscribe(eventName, callback);
	    } else {
		// Fallback: listen on the root element
		this.root.addEventListener(eventName, e => callback(eventName, e.detail));
	    }
	}

    }
    // /class MtkFinal


    // ════════════════════════════════════════════════════════════════
    //  DOM-ready initialisation
    //  Polls for <mtk-final> every 50 ms (supports <wc-include> lazy
    //  injection). Stops after 10 s to avoid runaway intervals.
    // ════════════════════════════════════════════════════════════════
    function init() {
	const root = document.querySelector('mtk-final.mtk-final');
	if (root) {
	    // Prevent double-init
	    if (root._mtkFinalInstance) return;
	    root._mtkFinalInstance = new MtkFinal(root);
	    return;
	}

	// Element not yet in DOM — observe for it
	let elapsed = 0;
	const interval = setInterval(() => {
	    elapsed += 50;
	    const el = document.querySelector('mtk-final.mtk-final');
	    if (el) {
		clearInterval(interval);
		if (!el._mtkFinalInstance) {
		    el._mtkFinalInstance = new MtkFinal(el);
		}
		return;
	    }
	    if (elapsed >= 10000) {
		clearInterval(interval);
		console.warn('[mtk-final] <mtk-final> element not found after 10 s.');
	    }
	}, 50);
    }

    // Run after DOM is parsed, or immediately if already ready
    if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
    } else {
	init();
    }

})();
