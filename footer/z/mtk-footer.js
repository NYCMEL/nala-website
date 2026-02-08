/**
 * MTK Footer Component
 * Material Design + Bootstrap 5 Footer
 * Load-order safe, fully JSON-driven
 */

(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    elementId: 'mtk-footer',
    dataPath: 'window.app.footer',
    maxRetries: 50,
    retryInterval: 100
  };
  
  // State
  let retryCount = 0;
  let isInitialized = false;
  
  /**
   * Check if all required dependencies are available
   * @returns {boolean}
   */
  function checkDependencies() {
    const element = document.getElementById(CONFIG.elementId);
    const data = window.app && window.app.footer;
    
    return !!(element && data);
  }
  
  /**
   * Get footer data safely
   * @returns {Object|null}
   */
  function getFooterData() {
    try {
      return window.app && window.app.footer ? window.app.footer : null;
    } catch (error) {
      console.error('MTK Footer: Error accessing footer data', error);
      return null;
    }
  }
  
  /**
   * Create contact item HTML
   * @param {string} icon - Font Awesome icon class
   * @param {string} text - Contact text
   * @param {string} [href] - Optional link href
   * @returns {string}
   */
  function createContactItem(icon, text, href) {
    const content = href 
      ? `<a href="${href}" class="mtk-footer__contact-link">${text}</a>`
      : `<p class="mtk-footer__contact-text">${text}</p>`;
    
    return `
      <li class="mtk-footer__contact-item">
        <i class="${icon} mtk-footer__contact-icon"></i>
        ${content}
      </li>
    `;
  }
  
  /**
   * Create social link HTML
   * @param {Object} social - Social media link object
   * @returns {string}
   */
  function createSocialLink(social) {
    return `
      <li class="mtk-footer__social-item">
        <a 
          href="#" 
          class="mtk-footer__social-link" 
          data-platform="${social.platform}"
          data-url="${social.url}"
          aria-label="${social.label}"
          title="${social.label}"
        >
          <i class="${social.icon} mtk-footer__social-icon"></i>
        </a>
      </li>
    `;
  }
  
  /**
   * Render the footer content
   * @param {HTMLElement} footerElement - The footer DOM element
   * @param {Object} data - Footer data from configuration
   */
  function renderFooter(footerElement, data) {
    try {
      // Build contact items
      const contactItems = [
        createContactItem('fas fa-phone', data.contact.phone, `tel:${data.contact.phone.replace(/\D/g, '')}`),
        createContactItem('fas fa-envelope', data.contact.email, `mailto:${data.contact.email}`),
        createContactItem('fas fa-map-marker-alt', data.contact.address)
      ].join('');
      
      // Build social links
      const socialLinks = data.social.links
        .map(social => createSocialLink(social))
        .join('');
      
      // Build complete footer HTML
      const footerHTML = `
        <div class="container">
          <div class="row">
            
            <!-- Brand Column -->
            <div class="col-12 col-md-4">
              <div class="mtk-footer__brand">
                <img 
                  src="${data.brand.logo}" 
                  alt="${data.brand.logoAlt}" 
                  class="mtk-footer__logo"
                >
                <p class="mtk-footer__description">${data.brand.description}</p>
              </div>
            </div>
            
            <!-- Contact Column -->
            <div class="col-12 col-md-4">
              <div class="mtk-footer__contact">
                <h3 class="mtk-footer__section-title">${data.contact.title}</h3>
                <ul class="mtk-footer__contact-list">
                  ${contactItems}
                </ul>
              </div>
            </div>
            
            <!-- Social Column -->
            <div class="col-12 col-md-4">
              <div class="mtk-footer__social">
                <h3 class="mtk-footer__section-title">${data.social.title}</h3>
                <ul class="mtk-footer__social-list">
                  ${socialLinks}
                </ul>
              </div>
            </div>
            
          </div>
          
          <!-- Divider -->
          <hr class="mtk-footer__divider">
          
          <!-- Copyright -->
          <div class="row">
            <div class="col-12">
              <p class="mtk-footer__copyright">${data.copyright.text}</p>
            </div>
          </div>
        </div>
      `;
      
      // Insert HTML into footer element
      footerElement.innerHTML = footerHTML;
      
      // Attach event listeners
      attachEventListeners(footerElement);
      
    } catch (error) {
      console.error('MTK Footer: Error rendering footer', error);
    }
  }
  
  /**
   * Attach event listeners to footer links
   * @param {HTMLElement} footerElement - The footer DOM element
   */
  function attachEventListeners(footerElement) {
    try {
      // Social link click handlers
      const socialLinks = footerElement.querySelectorAll('.mtk-footer__social-link');
      
      socialLinks.forEach(link => {
        link.addEventListener('click', function(event) {
          event.preventDefault();
          
          const platform = this.getAttribute('data-platform');
          const url = this.getAttribute('data-url');
          
          // Publish navigation event using wc object if available
          if (window.wc && typeof window.wc.publish === 'function') {
            window.wc.publish('navigation', {
              type: 'social',
              platform: platform,
              url: url,
              timestamp: new Date().toISOString()
            });
          } else {
            console.warn('MTK Footer: wc.publish is not available. Event not published.', {
              platform,
              url
            });
          }
        });
      });
      
      // Contact link click handlers (email and phone)
      const contactLinks = footerElement.querySelectorAll('.mtk-footer__contact-link');
      
      contactLinks.forEach(link => {
        link.addEventListener('click', function(event) {
          const href = this.getAttribute('href');
          
          // Publish navigation event using wc object if available
          if (window.wc && typeof window.wc.publish === 'function') {
            const type = href.startsWith('mailto:') ? 'email' : 'phone';
            
            window.wc.publish('navigation', {
              type: type,
              href: href,
              timestamp: new Date().toISOString()
            });
          }
        });
      });
      
    } catch (error) {
      console.error('MTK Footer: Error attaching event listeners', error);
    }
  }
  
  /**
   * Initialize the footer component
   */
  function initialize() {
    if (isInitialized) {
      return;
    }
    
    try {
      const footerElement = document.getElementById(CONFIG.elementId);
      const footerData = getFooterData();
      
      if (!footerElement) {
        console.error('MTK Footer: Footer element not found');
        return;
      }
      
      if (!footerData) {
        console.error('MTK Footer: Footer data not available');
        return;
      }
      
      // Render the footer
      renderFooter(footerElement, footerData);
      
      isInitialized = true;
      console.log('MTK Footer: Initialized successfully');
      
    } catch (error) {
      console.error('MTK Footer: Initialization error', error);
    }
  }
  
  /**
   * Retry initialization if dependencies are not ready
   */
  function retryInitialization() {
    if (checkDependencies()) {
      initialize();
    } else if (retryCount < CONFIG.maxRetries) {
      retryCount++;
      setTimeout(retryInitialization, CONFIG.retryInterval);
    } else {
      console.error('MTK Footer: Failed to initialize after maximum retries. Dependencies not available.');
    }
  }
  
  /**
   * Start the initialization process
   */
  function start() {
    // Check if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', retryInitialization);
    } else {
      retryInitialization();
    }
  }
  
  // Start the component
  start();
  
})();
