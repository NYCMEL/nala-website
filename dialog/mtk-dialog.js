/**
 * mtk-dialog.js
 * Vanilla JS class for the mtk-dialog component.
 * Data-driven via MTKDialogConfig (mtk-dialog.config.js).
 * Publishes events via wc.publish / subscribes via wc.subscribe.
 */

class MTKDialog {
    /**
     * @param {HTMLElement} element  - The <mtk-dialog> root element
     * @param {Object}      config   - Dialog configuration object (from MTKDialogConfig.dialog)
     */
    constructor(element, config) {
	this.root       = element;
	this.config     = config;
	this.isOpen     = false;
	this._focusTrap = null;

	this._render();
	this._bindEvents();
	this._subscribe();

	// Apply CSS custom property for max-width
	if (this.config.maxWidth) {
	    this._container.style.setProperty('--mtk-dialog-max-width', this.config.maxWidth);
	}
    }

    // ── Rendering ──────────────────────────────────────────────────────────

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

	// Populate content from config
	this._titleEl.textContent   = cfg.title   || '';
	this._messageEl.textContent = cfg.message || '';

	// Icon
	if (cfg.icon) {
	    this._iconEl.textContent = cfg.icon;
	}
	if (cfg.iconColor) {
	    this._iconWrap.style.setProperty('--mtk-icon-color', cfg.iconColor);
	    // Derive a soft background from the icon color
	    this._iconWrap.style.setProperty('--mtk-icon-bg', this._hexToAlpha(cfg.iconColor, 0.12));
	}

	// Accessibility attributes
	this.root.setAttribute('aria-labelledby', 'mtk-dialog-title');
	this.root.setAttribute('aria-describedby', 'mtk-dialog-message');

	// Render buttons from config
	this._renderButtons(cfg.buttons || []);
    }

    _renderButtons(buttons) {
	this._footer.innerHTML = '';

	buttons.forEach((btn) => {
	    const el = document.createElement('button');
	    el.type = 'button';

	    // Rule: "Cancel" label always gets btn btn-link
	    const classes = btn.label === 'Cancel'
		  ? 'btn btn-link'
		  : (btn.classes || 'btn btn-secondary');

	    el.className = classes;
	    el.textContent = btn.label;
	    el.dataset.mtkAction = btn.action || btn.label.toLowerCase();

	    this._footer.appendChild(el);
	});
    }

    // ── Event Binding ──────────────────────────────────────────────────────

    _bindEvents() {
	// Close button
	this._closeBtn.addEventListener('click', () => this._handleClose('close'));

	// Backdrop click (optional, from config)
	this._backdrop.addEventListener('click', (e) => {
	    if (this.config.closeOnBackdrop && e.target === this._backdrop) {
		this._handleClose('backdrop');
	    }
	});

	// Footer button clicks (delegated)
	this._footer.addEventListener('click', (e) => {
	    const btn = e.target.closest('[data-mtk-action]');
	    if (btn) {
		const action = btn.dataset.mtkAction;
		this._handleButtonClick(action, btn.textContent.trim());
	    }
	});

	// Keyboard: Escape, Tab (focus trap)
	this.root.addEventListener('keydown', (e) => this._handleKeydown(e));
    }

    _handleKeydown(e) {
	if (!this.isOpen) return;

	if (e.key === 'Escape' && this.config.closeOnEscape) {
	    e.preventDefault();
	    this._handleClose('escape');
	    return;
	}

	if (e.key === 'Tab') {
	    this._trapFocus(e);
	}
    }

    _trapFocus(e) {
	const focusable = Array.from(
	    this._container.querySelectorAll(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	    )
	).filter(el => !el.disabled && el.offsetParent !== null);

	if (focusable.length === 0) return;

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

    _handleButtonClick(action, label) {
	const payload = {
	    dialogId : this.config.id,
	    action   : action,
	    label    : label,
	    timestamp: new Date().toISOString()
	};

	wc.log(`[mtk-dialog] Publishing "mtk-dialog:action"`, payload);
	wc.publish('mtk-dialog:action', payload);

	// Auto-close on any non-primary if desired; always close on cancel
	if (action === 'cancel') {
	    this.close();
	}
    }

    _handleClose(source) {
	const payload = {
	    dialogId : this.config.id,
	    source   : source,
	    timestamp: new Date().toISOString()
	};

	wc.log(`[mtk-dialog] Publishing "mtk-dialog:close"`, payload);
	wc.publish('mtk-dialog:close', payload);

	this.close();
    }

    // ── wc.subscribe Message Handler ──────────────────────────────────────

    onMessage(event, data) {
	switch (event) {
	case 'mtk-dialog:open':
            this.open(data);
            break;
	case 'mtk-dialog:close':
            // Only close if the message targets this dialog (or no target specified)
            if (!data?.dialogId || data.dialogId === this.config.id) {
		this.close();
            }
            break;
	case 'mtk-dialog:update':
            if (data && (!data.dialogId || data.dialogId === this.config.id)) {
		this._updateConfig(data);
            }
            break;
	default:
            break;
	}
    }

    _subscribe() {
	const handler = (event, data) => this.onMessage(event, data);
	wc.subscribe('mtk-dialog:open',   handler);
	wc.subscribe('mtk-dialog:close',  handler);
	wc.subscribe('mtk-dialog:update', handler);
    }

    // ── Public API ────────────────────────────────────────────────────────

    open(overrides = {}) {
	if (overrides && Object.keys(overrides).length) {
	    this._updateConfig(overrides);
	}

	this._prevFocus = document.activeElement;
	this.isOpen = true;
	this._backdrop.classList.add('is-open');
	document.body.style.overflow = 'hidden';

	// Focus the container for screen reader announcement
	requestAnimationFrame(() => {
	    this._container.focus();
	});

	const payload = { dialogId: this.config.id, timestamp: new Date().toISOString() };
	wc.log(`[mtk-dialog] Publishing "mtk-dialog:opened"`, payload);
	wc.publish('mtk-dialog:opened', payload);
    }

    close() {
	if (!this.isOpen) return;
	this.isOpen = false;
	this._backdrop.classList.remove('is-open');
	document.body.style.overflow = '';

	// Restore prior focus
	if (this._prevFocus && typeof this._prevFocus.focus === 'function') {
	    this._prevFocus.focus();
	}
    }

    _updateConfig(data) {
	Object.assign(this.config, data);
	this._render();
    }

    // ── Utilities ─────────────────────────────────────────────────────────

    _hexToAlpha(hex, alpha) {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r},${g},${b},${alpha})`;
    }
}

// ── wc shim (safe fallback if wc is not yet defined) ─────────────────────────
// This shim prevents errors; the real wc object should be provided by the host.
if (typeof wc === 'undefined') {
    window.wc = {
	_subscribers: {},
	publish(event, data) {
	    console.info(`[wc.publish] ${event}`, data);
	    const subs = this._subscribers[event] || [];
	    subs.forEach(fn => fn(event, data));
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

// ── Wait for element & auto-initialize ───────────────────────────────────────
(function initMTKDialog() {
    const SELECTOR = 'mtk-dialog.mtk-dialog';

    function bootstrap() {
	const el = document.querySelector(SELECTOR);
	if (!el) return false;

	// Guard: already initialized
	if (el.__mtkDialogInstance) return true;

	// Config must be loaded
	if (typeof MTKDialogConfig === 'undefined') {
	    console.warn('[mtk-dialog] MTKDialogConfig not found. Ensure mtk-dialog.config.js is loaded first.');
	    return false;
	}

	const instance = new MTKDialog(el, { ...MTKDialogConfig.dialog });
	el.__mtkDialogInstance = instance;

	// Expose globally for programmatic access
	window.mtkDialog = instance;
	return true;
    }

    // Try immediately (element may already be in DOM)
    if (bootstrap()) return;

    // MutationObserver: wait for <wc-include> or dynamic insertion
    const observer = new MutationObserver(() => {
	if (bootstrap()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also try on DOMContentLoaded as a fallback
    document.addEventListener('DOMContentLoaded', () => {
	if (bootstrap()) observer.disconnect();
    });
})();
