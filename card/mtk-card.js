class MtkCard {
  constructor(config = window.mtkCardConfig || {}) {
    this.config = config;
    this.root = null;
    this.waitForElement();
  }

  waitForElement() {
    const findElement = () => {
      this.root = document.querySelector('mtk-card.mtk-card, .mtk-card');

      if (this.root) {
        this.init();
        return;
      }

      window.requestAnimationFrame(findElement);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => window.requestAnimationFrame(findElement), { once: true });
    } else {
      window.requestAnimationFrame(findElement);
    }
  }

  init() {
    this.render();
    this.bindEvents();
    this.subscribe();
  }

  render() {
    this.root.querySelectorAll('[data-field]').forEach((field) => {
      const key = field.getAttribute('data-field');
      const text = field.querySelector(':scope > .mtk-card__text');

      if (text && this.config[key] !== undefined && key !== 'phone') {
        text.textContent = this.config[key];
      }
    });

    this.root.querySelectorAll('[data-field-inline]').forEach((field) => {
      const key = field.getAttribute('data-field-inline');

      if (this.config[key] !== undefined) {
        field.textContent = this.config[key];
      }
    });

    this.root.querySelectorAll('[data-label]').forEach((label) => {
      const key = label.getAttribute('data-label');

      if (this.config.labels && this.config.labels[key] !== undefined) {
        label.textContent = this.config.labels[key];
      }
    });
  }

  bindEvents() {
    this.root.querySelectorAll('.mtk-card__field').forEach((field) => {
      field.setAttribute('tabindex', '0');

      field.addEventListener('click', () => {
        this.publish('mtk-card:field-click', {
          component: 'mtk-card',
          field: field.getAttribute('data-field'),
          value: field.textContent.trim()
        });
      });

      field.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          field.click();
        }
      });
    });
  }

  publish(topic, payload) {
    if (window.wc && typeof window.wc.log === 'function') {
      window.wc.log(topic, payload);
    }

    if (window.wc && typeof window.wc.publish === 'function') {
      window.wc.publish(topic, payload);
    }
  }

  subscribe() {
    if (window.wc && typeof window.wc.subscribe === 'function') {
      window.wc.subscribe('4-mtk-card', this.onMessage.bind(this));
    }
  }

  onMessage(message) {
    if (window.wc && typeof window.wc.log === 'function') {
      window.wc.log('4-mtk-card', message);
    }
  }
}

new MtkCard();
