// mtk-pager.js

class MtkPager {
  constructor(containerId, config) {
    console.log('🟢 MtkPager: Initializing...');
    
    this.containerId = containerId;
    this.container = null;
    this.config = config || {};
    this.sections = {};
    this.activeSectionId = null;
    this.hasJQuery = typeof jQuery !== 'undefined';
    
    console.log(`🟢 MtkPager: jQuery ${this.hasJQuery ? 'detected' : 'not detected'}`);
    
    this.init();
  }

  init() {
    // Check if container exists
    this.container = document.getElementById(this.containerId);
    
    if (!this.container) {
      console.error(`🔴 MtkPager: Container with id "${this.containerId}" not found!`);
      console.error(`🔴 MtkPager: Initialization failed. Component will not function.`);
      return;
    }
    
    console.log(`🟢 MtkPager: Container found:`, this.container);
    
    // Add mtk-pager class to container
    if (!this.container.classList.contains('mtk-pager')) {
      this.container.classList.add('mtk-pager');
    }
    
    // Subscribe to events
    this.subscribeToEvents();
    
    // Load default section if specified
    if (this.config.sections && this.config.defaultSection) {
      console.log(`🟢 MtkPager: Loading default section: ${this.config.defaultSection}`);
      this.show(this.config.defaultSection);
    }
    
    console.log('🟢 MtkPager: Initialization complete');
    
    // Publish initialization event
    if (window.wc && window.wc.publish) {
      const initData = {
        containerId: this.containerId,
        hasJQuery: this.hasJQuery,
        sectionsCount: Object.keys(this.config.sections || {}).length,
        timestamp: new Date().toISOString()
      };
      
      if (window.wc.log) {
        window.wc.log('4-mtk-pager-initialized', initData);
      }
      
      window.wc.publish('4-mtk-pager-initialized', initData);
    }
  }

  show(sectionId) {
    console.log(`🟡 MtkPager: show() called with sectionId: "${sectionId}"`);
    
    if (!this.container) {
      console.error('🔴 MtkPager: Container not initialized. Cannot show section.');
      return;
    }
    
    if (!sectionId) {
      console.error('🔴 MtkPager: sectionId is required');
      return;
    }
    
    // Check if section already exists
    const sectionElementId = `mtk-pager-${sectionId}`;
    let sectionElement = document.getElementById(sectionElementId);
    
    if (sectionElement) {
      console.log(`🟢 MtkPager: Section "${sectionId}" already exists, activating it`);
      this._activateSection(sectionId);
    } else {
      console.log(`🟡 MtkPager: Section "${sectionId}" does not exist, creating it`);
      this._createSection(sectionId);
    }
  }

  _createSection(sectionId) {
    console.log(`🟡 MtkPager: Creating section "${sectionId}"`);
    
    // Create section element
    const sectionElement = document.createElement('PAGER-SECTION');
    sectionElement.id = `mtk-pager-${sectionId}`;
    sectionElement.classList.add('mtk-pager-section');
    
    // Get section config
    const sectionConfig = this.config.sections ? this.config.sections[sectionId] : null;
    
    if (!sectionConfig) {
      console.warn(`🟡 MtkPager: No configuration found for section "${sectionId}", creating empty section`);
      sectionElement.innerHTML = `<div class="page-content"><h2>Section: ${sectionId}</h2><p>No content configured.</p></div>`;
      this.container.appendChild(sectionElement);
      this.sections[sectionId] = sectionElement;
      this._activateSection(sectionId);
      return;
    }
    
    // Add to DOM first (hidden)
    this.container.appendChild(sectionElement);
    this.sections[sectionId] = sectionElement;
    
    // Load content if URL is provided
    if (sectionConfig.url) {
      console.log(`🟡 MtkPager: Loading content from: ${sectionConfig.url}`);
      this._loadContent(sectionId, sectionConfig.url);
    } else {
      console.log(`🟢 MtkPager: No URL provided, section created empty`);
      this._activateSection(sectionId);
    }
  }

  _loadContent(sectionId, url) {
    const sectionElement = this.sections[sectionId];
    
    if (!sectionElement) {
      console.error(`🔴 MtkPager: Section element not found for "${sectionId}"`);
      return;
    }
    
    // Add loading state
    this.container.classList.add('loading');
    sectionElement.innerHTML = '<div class="page-content"><p>Loading...</p></div>';
    
    // Publish loading event
    if (window.wc && window.wc.publish) {
      const loadingData = {
        sectionId: sectionId,
        url: url,
        timestamp: new Date().toISOString()
      };
      
      if (window.wc.log) {
        window.wc.log('4-mtk-pager-loading', loadingData);
      }
      
      window.wc.publish('4-mtk-pager-loading', loadingData);
    }
    
    if (this.hasJQuery) {
      console.log(`🟢 MtkPager: Using jQuery to load content`);
      
      $(sectionElement).load(url, (response, status, xhr) => {
        this.container.classList.remove('loading');
        
        if (status === 'error') {
          console.error(`🔴 MtkPager: Failed to load ${url}:`, xhr.statusText);
          sectionElement.innerHTML = `<div class="page-content"><div class="alert alert-danger">Failed to load content from ${url}</div></div>`;
          
          // Publish error event
          if (window.wc && window.wc.publish) {
            const errorData = {
              sectionId: sectionId,
              url: url,
              error: xhr.statusText,
              timestamp: new Date().toISOString()
            };
            
            if (window.wc.log) {
              window.wc.log('4-mtk-pager-error', errorData);
            }
            
            window.wc.publish('4-mtk-pager-error', errorData);
          }
        } else {
          console.log(`🟢 MtkPager: Content loaded successfully for "${sectionId}"`);
          
          // Publish loaded event
          if (window.wc && window.wc.publish) {
            const loadedData = {
              sectionId: sectionId,
              url: url,
              timestamp: new Date().toISOString()
            };
            
            if (window.wc.log) {
              window.wc.log('4-mtk-pager-loaded', loadedData);
            }
            
            window.wc.publish('4-mtk-pager-loaded', loadedData);
          }
        }
        
        this._activateSection(sectionId);
      });
    } else {
      console.warn(`🟡 MtkPager: jQuery not available, cannot load external content`);
      console.warn(`🟡 MtkPager: Section will remain empty or use inline content`);
      this.container.classList.remove('loading');
      sectionElement.innerHTML = `<div class="page-content"><div class="alert alert-warning">jQuery required to load external content. URL: ${url}</div></div>`;
      this._activateSection(sectionId);
      
      // Publish warning event
      if (window.wc && window.wc.publish) {
        const warningData = {
          sectionId: sectionId,
          url: url,
          message: 'jQuery not available',
          timestamp: new Date().toISOString()
        };
        
        if (window.wc.log) {
          window.wc.log('4-mtk-pager-warning', warningData);
        }
        
        window.wc.publish('4-mtk-pager-warning', warningData);
      }
    }
  }

  _activateSection(sectionId) {
    console.log(`🟡 MtkPager: Activating section "${sectionId}"`);
    
    // Hide all sections
    Object.keys(this.sections).forEach(id => {
      const section = this.sections[id];
      if (section) {
        section.classList.remove('active');
        console.log(`  - Deactivated section "${id}"`);
      }
    });
    
    // Show requested section
    const sectionElement = this.sections[sectionId];
    if (sectionElement) {
      sectionElement.classList.add('active');
      this.activeSectionId = sectionId;
      console.log(`🟢 MtkPager: Section "${sectionId}" is now active`);
      
      // Publish section changed event
      if (window.wc && window.wc.publish) {
        const changedData = {
          previousSection: this.activeSectionId,
          currentSection: sectionId,
          timestamp: new Date().toISOString()
        };
        
        if (window.wc.log) {
          window.wc.log('4-mtk-pager-section-changed', changedData);
        }
        
        window.wc.publish('4-mtk-pager-section-changed', changedData);
      }
    } else {
      console.error(`🔴 MtkPager: Section element not found for "${sectionId}"`);
    }
  }

  subscribeToEvents() {
    if (!window.wc || !window.wc.subscribe) {
      console.warn('🟡 MtkPager: wc.subscribe not available, skipping event subscription');
      return;
    }
    
    console.log('🟢 MtkPager: Subscribing to 4-mtk-pager events');
    
    // Subscribe to all 4-mtk-pager events
    window.wc.subscribe('4-mtk-pager-show', this.onMessage.bind(this));
    window.wc.subscribe('4-mtk-pager-initialized', this.onMessage.bind(this));
    window.wc.subscribe('4-mtk-pager-loading', this.onMessage.bind(this));
    window.wc.subscribe('4-mtk-pager-loaded', this.onMessage.bind(this));
    window.wc.subscribe('4-mtk-pager-error', this.onMessage.bind(this));
    window.wc.subscribe('4-mtk-pager-warning', this.onMessage.bind(this));
    window.wc.subscribe('4-mtk-pager-section-changed', this.onMessage.bind(this));
  }

  onMessage(event, data) {
    console.log('📩 MtkPager received message:', event, data);
    
    // Handle external show requests
    if (event === '4-mtk-pager-show' && data && data.sectionId) {
      console.log(`🟡 MtkPager: External show request for section "${data.sectionId}"`);
      this.show(data.sectionId);
    }
  }
}

// Initialize mtk-pager when DOM is ready
function initMtkPager() {
  console.log('🟢 Initializing MtkPager...');
  
  // Use MutationObserver to watch for PAGER element
  const observer = new MutationObserver((mutations, obs) => {
    const pagerElement = document.querySelector('PAGER#mtk-pager') || 
                         document.getElementById('mtk-pager');
    
    // Check if config is available
    const configAvailable = typeof app !== 'undefined' && 
                           typeof app.pager !== 'undefined';
    
    if (pagerElement && configAvailable) {
      obs.disconnect();
      
      setTimeout(() => {
        // Create instance
        const pager = new MtkPager('mtk-pager', app.pager);
        
        // Expose globally
        window['mtk-pager'] = pager;
        
        console.log('✅ MtkPager instance created and exposed globally as window["mtk-pager"]');
      }, 50);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Timeout after 30 seconds
  setTimeout(() => {
    observer.disconnect();
  }, 30000);
}

// Multiple initialization strategies
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMtkPager);
} else {
  initMtkPager();
}

// Backup on window load
window.addEventListener('load', () => {
  if (!window['mtk-pager']) {
    const pagerElement = document.querySelector('PAGER#mtk-pager') || 
                         document.getElementById('mtk-pager');
    
    if (pagerElement && typeof app !== 'undefined' && app.pager) {
      const pager = new MtkPager('mtk-pager', app.pager);
      window['mtk-pager'] = pager;
      console.log('✅ MtkPager initialized on window load');
    }
  }
});
