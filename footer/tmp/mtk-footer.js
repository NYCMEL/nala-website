// mtk-footer.js
(function () {
  'use strict';

  const waitForElement = (selector, callback, interval = 100, timeout = 5000) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        callback(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
        console.warn('mtk-footer: Element not found', selector);
      }
    }, interval);
  };

  const waitForData = (dataPath, callback, interval = 100, timeout = 5000) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const data = dataPath();
      if (data) {
        clearInterval(timer);
        callback(data);
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
        console.warn('mtk-footer: Data not found', dataPath);
      }
    }, interval);
  };

  const createFooter = (container, config) => {
    try {
      container.classList.add('container');
      container.innerHTML = `
        <div class="row">
          <div class="col-md-4 mb-3 mb-md-0">
            <img class="brand-logo" src="${config.brand.logo}" alt="Brand Logo">
            <div class="brand-description">${config.brand.description}</div>
          </div>
          ${config.navigation.map(group => `
            <div class="col-md-4 mb-3 mb-md-0">
              <div class="footer-title">${group.title}</div>
              ${group.links.map(link => {
                if(link.icon) {
                  return `<i class="${link.icon} social-icon" data-event="${link.event}"></i>`;
                }
                return `<span class="footer-link" data-event="${link.event}">${link.text}</span>`;
              }).join('')}
            </div>
          `).join('')}
        </div>
      `;

      // Attach click handlers for event publishing
      container.querySelectorAll('[data-event]').forEach(el => {
        el.addEventListener('click', e => {
          const eventName = el.getAttribute('data-event');
          if(window.wc && typeof window.wc.publish === 'function') {
            window.wc.publish(eventName, { element: el });
          } else {
            console.log(`mtk-footer: Event published: ${eventName}`);
          }
          e.preventDefault();
        });
      });

    } catch (err) {
      console.error('mtk-footer: Failed to create footer', err);
    }
  };

  // Wait for footer element and data before rendering
  waitForElement('#mtk-footer', footerEl => {
    waitForData(() => window.app && window.app.footer, footerData => {
      createFooter(footerEl, footerData);
    });
  });

})();
