/**
 * MTK Industry Certifications Component
 * Material Design + Bootstrap 5 Certification Cards
 * Load-order safe, fully JSON-driven
 */

(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    elementId: 'mtk-industry-certs',
    dataPath: 'window.app.industryCerts',
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
    const data = window.app && window.app.industryCerts;
    
    return !!(element && data);
  }
  
  /**
   * Get certification data safely
   * @returns {Object|null}
   */
  function getCertificationData() {
    try {
      return window.app && window.app.industryCerts ? window.app.industryCerts : null;
    } catch (error) {
      console.error('MTK Industry Certs: Error accessing certification data', error);
      return null;
    }
  }
  
  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string}
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Create feature list HTML
   * @param {Array<string>} features - Array of feature strings
   * @returns {string}
   */
  function createFeatureList(features) {
    if (!Array.isArray(features) || features.length === 0) {
      return '';
    }
    
    const featureItems = features
      .map(feature => `<li class="mtk-industry-certs__feature-item">${escapeHtml(feature)}</li>`)
      .join('');
    
    return `
      <ul class="mtk-industry-certs__features">
        ${featureItems}
      </ul>
    `;
  }
  
  /**
   * Create certification card HTML
   * @param {Object} cert - Certification object
   * @returns {string}
   */
  function createCertificationCard(cert) {
    return `
      <div 
        class="mtk-industry-certs__card" 
        data-cert-id="${cert.id}"
        role="button"
        tabindex="0"
        aria-label="${escapeHtml(cert.title)}"
      >
        <div class="mtk-industry-certs__card-header">
          <div class="mtk-industry-certs__icon-container">
            <i class="${cert.icon} mtk-industry-certs__icon" style="color: ${cert.iconColor}"></i>
          </div>
        </div>
        <div class="mtk-industry-certs__content">
          <h3 class="mtk-industry-certs__title">${escapeHtml(cert.title)}</h3>
          <p class="mtk-industry-certs__description">${escapeHtml(cert.description)}</p>
          ${createFeatureList(cert.features)}
        </div>
      </div>
    `;
  }
  
  /**
   * Render the certifications grid
   * @param {HTMLElement} containerElement - The container DOM element
   * @param {Object} data - Certification data from configuration
   */
  function renderCertifications(containerElement, data) {
    try {
      if (!data.certifications || !Array.isArray(data.certifications)) {
        console.error('MTK Industry Certs: Invalid certifications data');
        return;
      }
      
      // Build certification cards
      const certificationCards = data.certifications
        .map(cert => createCertificationCard(cert))
        .join('');
      
      // Build complete HTML
      const html = `
        <div class="mtk-industry-certs__grid">
          ${certificationCards}
        </div>
      `;
      
      // Insert HTML into container element
      containerElement.innerHTML = html;
      
      // Attach event listeners
      attachEventListeners(containerElement, data);
      
    } catch (error) {
      console.error('MTK Industry Certs: Error rendering certifications', error);
    }
  }
  
  /**
   * Handle card click/keyboard interaction
   * @param {HTMLElement} card - The card element
   * @param {Object} certData - The certification data
   */
  function handleCardInteraction(card, certData) {
    const certId = card.getAttribute('data-cert-id');
    
    // Publish event using wc object if available
    if (window.wc && typeof window.wc.publish === 'function') {
      window.wc.publish('certification-selected', {
        certificationId: certId,
        title: certData.title,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('MTK Industry Certs: Certification selected', {
        certificationId: certId,
        title: certData.title
      });
    }
  }
  
  /**
   * Attach event listeners to certification cards
   * @param {HTMLElement} containerElement - The container DOM element
   * @param {Object} data - Certification data
   */
  function attachEventListeners(containerElement, data) {
    try {
      const cards = containerElement.querySelectorAll('.mtk-industry-certs__card');
      
      cards.forEach(card => {
        const certId = card.getAttribute('data-cert-id');
        const certData = data.certifications.find(cert => cert.id === certId);
        
        if (!certData) {
          return;
        }
        
        // Click event
        card.addEventListener('click', function() {
          handleCardInteraction(this, certData);
        });
        
        // Keyboard event (Enter or Space)
        card.addEventListener('keydown', function(event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleCardInteraction(this, certData);
          }
        });
      });
      
    } catch (error) {
      console.error('MTK Industry Certs: Error attaching event listeners', error);
    }
  }
  
  /**
   * Initialize the component
   */
  function initialize() {
    if (isInitialized) {
      return;
    }
    
    try {
      const containerElement = document.getElementById(CONFIG.elementId);
      const certificationData = getCertificationData();
      
      if (!containerElement) {
        console.error('MTK Industry Certs: Container element not found');
        return;
      }
      
      if (!certificationData) {
        console.error('MTK Industry Certs: Certification data not available');
        return;
      }
      
      // Render the certifications
      renderCertifications(containerElement, certificationData);
      
      isInitialized = true;
      console.log('MTK Industry Certs: Initialized successfully');
      
    } catch (error) {
      console.error('MTK Industry Certs: Initialization error', error);
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
      console.error('MTK Industry Certs: Failed to initialize after maximum retries. Dependencies not available.');
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
