/* mtk-pager.js */

(function () {
  class MTKPagerClass {
    constructor(container) {
      this.container = container;
      this.config = window.app && window.app.pager;

      if (!this.container) {
        console.error('MTKPager: <PAGER id="mtk-pager"> not found');
        return;
      }

      if (!this.config || !this.config.sections) {
        console.warn('MTKPager: missing app.pager config');
      }

      this._initSubscriptions();
      console.info('MTKPager: initialized');
    }

    show(sectionId) {
      if (!sectionId) return;

      const domId = `mtk-pager-${sectionId}`;

      this._hideAll();

      let section = this.container.querySelector(`#${domId}`);

      if (!section) {
        section = this._createSection(domId);
        this.container.appendChild(section);
        this._loadContent(sectionId, section);
      }

      section.classList.add('active');
      console.info('MTKPager: show', sectionId);
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
        console.warn(`MTKPager: no url for section ${sectionId}`);
        return;
      }

      if (window.jQuery && typeof jQuery.fn.load === 'function') {
        jQuery(el).load(cfg.url);
      } else {
        console.warn('MTKPager: jQuery not available, skipping load');
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

  /* ---------- expose singleton API ---------- */

  let instance = null;

  const init = () => {
    if (instance) return;

    const container = document.querySelector('PAGER#mtk-pager');
    if (!container) return;

    instance = new MTKPagerClass(container);
  };

  // Try immediately
  init();

  // wc-include safe
  const observer = new MutationObserver(init);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  /* ---------- PUBLIC API ---------- */
  window.MTKPager = {
    show(sectionId) {
      if (!instance) {
        console.warn('MTKPager: not initialized yet');
        return;
      }
      instance.show(sectionId);
    }
  };
})();
