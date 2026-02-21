(function () {
  'use strict';

  // Wait for element utility
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

  // Wait for data utility
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

  // Wrap main content in #page-content if missing
  const wrapPageContent = () => {
    let content = document.querySelector('#page-content');
    if (!content) {
      content = document.createElement('div');
      content.id = 'page-content';
      // Move all body children except footer into #page-content
      const footer = document.querySelector('#mtk-footer');
      Array.from(document.body.children).forEach(el => {
        if (el !== footer) content.appendChild(el);
      });
      document.body.insertBefore(content, document.body.firstChild);
    }
    // Apply body flex layout
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    content.style.flex = '1 0 auto';
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

      // Attach click handlers
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

  // Run
  waitForElement('#mtk-footer', footerEl => {
    wrapPageContent();
    waitForData(() => window.app && window.app.footer, footerData => {
      createFooter(footerEl, footerData);
    });
  });

})();
