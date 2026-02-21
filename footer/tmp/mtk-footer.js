(function () {
  'use strict';

  // Wait for an element to appear in the DOM (works with wc-include)
  const waitForElement = (selector, callback, interval = 100, timeout = 5000) => {
    const start = Date.now();
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        callback(el);
      } else if (Date.now() - start > timeout) {
        observer.disconnect();
        console.warn('mtk-footer: Element not found', selector);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // fallback interval in case MutationObserver misses
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        observer.disconnect();
        callback(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
      }
    }, interval);
  };

  // Wait for JSON config data
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

  // Wrap body content for sticky footer
  const wrapPageContent = () => {
    let content = document.querySelector('#page-content');
    if (!content) {
      content = document.createElement('div');
      content.id = 'page-content';
      const footer = document.querySelector('#mtk-footer');
      Array.from(document.body.children).forEach(el => {
        if (el !== footer) content.appendChild(el);
      });
      document.body.insertBefore(content, document.body.firstChild);
    }
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    content.style.flex = '1 0 auto';
  };

  // Build footer DOM dynamically
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
                if (link.icon) {
                  return `<i class="${link.icon} social-icon" data-event="${link.event}"></i>`;
                }
                return `<span class="footer-link" data-event="${link.event}">${link.text}</span>`;
              }).join('')}
            </div>
          `).join('')}
        </div>
      `;

      // Attach click handlers for wc.publish
      container.querySelectorAll('[data-event]').forEach(el => {
        el.addEventListener('click', e => {
          const eventName = el.getAttribute('data-event');
          if (window.wc && typeof window.wc.publish === 'function') {
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

  // Main init function
  const initFooter = () => {
    waitForElement('#mtk-footer', footerEl => {
      wrapPageContent();
      waitForData(() => window.app && window.app.footer, footerData => {
        createFooter(footerEl, footerData);
      });
    });
  };

  // Start after DOMContentLoaded to ensure wc-include runs
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }

})();
