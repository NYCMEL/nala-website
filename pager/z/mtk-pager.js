/* mtk-pager.js */

(function () {
  class MtkPager {
    constructor(container) {
      this.container = container;
      this.config = window.app && window.app.pager;

      if (!this.config || !this.config.sections) {
        console.warn('mtk-pager: missing app.pager config');
      }

      this._initSubscriptions();
      console.info('mtk-pager: initialized');
    }

    show(sectionId) {
      if (!sectionId || !this.container) return;

      const domId = `mtk-pager-${sectionId}`;

      this._hideAll();

      let section = this.container.querySelector(`#${domId}`);

      if (!section) {
        section = this._createSection(domId);
        this.container.appendChild(section);
        this._loadContent(sectionId, section);
      }

      section.classList.add('active');
      console.info('mtk-pager: show', sectionId);
    }

    _hideAll() {
      this.container
        .querySelectorAll('.mtk-pager-section')
        .forEach(el => el.classList.remove('active'));
    }

    _createSection(domId) {
      const el = document.createElement('PAGER-SECTION');
      el.id = domId;
      el.className = 'mtk-pager-section';
      el.style.display = 'block';
      return el;
    }

    _loadContent(sectionId, el) {
      const cfg = this.config?.sections?.[sectionId];
      if (!cfg || !cfg.url) {
        console.warn(`mtk-pager: no url for section ${sectionId}`);
        return;
      }

      if (window.jQuery && typeof jQuery.fn.load === 'function') {
        jQuery(el).load(cfg.url);
      } else {
        console.warn('mtk-pager: jQuery not available, skipping load');
      }
    }

    _initSubscriptions() {
      if (!window.wc || !wc.subscribe) return;

      const handler = (_, data) => {
        if (data?.sectionId) {
          this.show(data.sectionId);
        }
      };

      wc.subscribe('mtk-pager:show', handler);
      wc.subscribe('mtk-header:click', handler);
      wc.subscribe('mtk-menu:select', handler);
      wc.subscribe('mtk-nav:go', handler);
    }
  }

  /* ---------- wait for <PAGER> (wc-include safe) ---------- */

  let initialized = false;

  const initWhenReady = () => {
    if (initialized) return;

    const pagerEl = document.querySelector('PAGER#mtk-pager');
    if (!pagerEl) return;

    initialized = true;

    const instance = new MtkPager(pagerEl);

    window['mtk-pager'] = {
      show: (id) => instance.show(id)
    };

    wc?.publish?.('mtk-pager:ready', { id: 'mtk-pager' });
  };

  // 1️⃣ Immediate attempt (in case already present)
  initWhenReady();

  // 2️⃣ Observe DOM for wc-include injection
  const observer = new MutationObserver(() => initWhenReady());

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
