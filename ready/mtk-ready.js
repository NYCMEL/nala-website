/* mtk-ready.js */

class MtkReady {
    constructor(el) {
	this.el = el;
	this.config = window.app && window.app.ready;

	if (!this.config) {
	    wc.warn && wc.warn('mtk-ready: missing window.app.ready config');
	    return;
	}

	this.render();
	this.bindEvents();
    }

    render() {
	const titleEl = this.el.querySelector('.mtk-ready-title');
	const descEl = this.el.querySelector('.mtk-ready-desc');
	const btnLabelEl = this.el.querySelector('.mtk-ready-btn-label');

	if (titleEl) titleEl.innerHTML = this.config.title || '';
	if (descEl) descEl.innerHTML = this.config.description || '';
	if (btnLabelEl) btnLabelEl.innerHTML =
	    this.config.button?.label || 'Get Started';
    }

    bindEvents() {
	const btn = this.el.querySelector('.mtk-ready-btn');
	if (!btn) return;

	btn.addEventListener('click', () => {
	    wc.publish('mtk-ready:click', {
		component: 'mtk-ready',
		id: 'primary',
		action: this.config.button?.action || null
	    });
	});
    }
}

/* ---------- DOM availability watcher ---------- */
(function waitForMtkReady() {
    let initialized = false;

    alert("A")

    const init = (el) => {
	if (initialized) return;
	initialized = true;

	new MtkReady(el);

	wc.publish && wc.publish('mtk-ready:ready', {
	    component: 'mtk-ready'
	});
    };

    const existing = document.querySelector('.mtk-ready');
    if (existing) {
	init(existing);
	return;
    }

    const observer = new MutationObserver(() => {
	const el = document.querySelector('.mtk-ready');
	if (el) {
	    observer.disconnect();
	    init(el);
	}
    });

    observer.observe(document.documentElement, {
	childList: true,
	subtree: true
    });
})();
