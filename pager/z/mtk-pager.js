/* mtk-pager.js */

(function () {
  class MtkPager {
    constructor() {
      this.container = document.querySelector('PAGER#mtk-pager');

      if (!this.container) {
        console.error('mtk-pager: <PAGER id="mtk-pager"> not found');
        return;
      }

      this.config = window.app && window.app.pager;
      if (!this.config || !this.config.sections) {
        console.warn('mtk-pager: missing app.pager config');
      }

      this._initSubscriptions();
      console.info('mtk-pager: initialized');
    }

    show(sectionId) {
      if (!sectionId) return;

      const sectionElId = `mtk-pager-${sectionId}`;

      this._hideAll();

      let section = this.container.querySelector(`#${sectionElId}`);

      if (!section) {
        section = this._createSection(sectionId, sectionElId);
        this.container.appendChild(section);
        this._loadContent(sectionId, section);
      }

      section.classList.add('active');

      console.info('mtk-pager: showing section', sectionId);
    }

    _hideAll() {
      const sections = this.container.querySelectorAll('.mtk-pager-section');
      sections.forEach(sec => sec.classList.remove('active'));
    }

    _createSection(sectionId, domId) {
      const el = document.createElement('PAGER-SECTION');
      el.id = domId;
      el.className = 'mtk-pager-section';
      el.style.display = 'block';
      return el;
    }

    _loadContent(sectionId, el) {
      const cfg = this.config && this.config.sections && this.config.sections[sectionId];
      if (!cfg || !cfg.url) {
        console.warn(`mtk-pager: no url for section ${sectionId}`);
        return;
      }

      if (window.jQuery && typeof window.jQuery.fn.load === 'function') {
        window.jQuery(el).load(cfg.url);
      } else {
        console.warn('mtk-pager: jQuery not available, content not loaded');
      }
    }

    _initSubscriptions() {
      if (!window.wc || !wc.subscribe) return;

      const handler = (msg, data) => {
        if (data && data.sectionId) {
          this.show(data.sectionId);
        }
      };

      wc.subscribe('mtk-pager:show', handler);
      wc.subscribe('mtk-header:click', handler);
      wc.subscribe('mtk-menu:select', handler);
      wc.subscribe('mtk-nav:go', handler);
    }
  }

  const instance = new MtkPager();

  window['mtk-pager'] = {
    show: (id) => instance && instance.show(id)
  };
})();
