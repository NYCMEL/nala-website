/**
 * MTK Header - Material Design Header Component
 * A reusable, accessible header component with event-driven architecture
 * Uses wc.js library for PubSub and utilities
 */

/**
 * MTKHeader Class
 * Manages the header UI, data binding, and event handling
 */
class MTKHeader {
  constructor(config) {
    this.config = config;
    this.element = null;
    this.elements = {};
    this.initialized = false;
    this.activeDropdown = null;
    this.mobileMenuOpen = false;
    
    // Bind methods
    this.onMessage = this.onMessage.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleDropdownToggle = this.handleDropdownToggle.bind(this);
    this.handleMobileToggle = this.handleMobileToggle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    
    // Wait for DOM to be ready
    this.waitForElement();
  }

  /**
   * Wait for header element to be available in DOM
   */
  waitForElement() {
    wc.log("MTKHeader: Waiting for DOM element...");
    
    // Use MutationObserver to watch for element addition
    const observer = new MutationObserver((mutations, obs) => {
      this.element = document.querySelector('.mtk-header');
      
      if (this.element) {
        wc.log("MTKHeader: Element found via MutationObserver");
        obs.disconnect();
        this.init();
      }
    });
    
    const checkElement = () => {
      this.element = document.querySelector('.mtk-header');
      
      if (this.element) {
        wc.log("MTKHeader: Element found immediately");
        this.init();
      } else {
        wc.log("MTKHeader: Element not found, starting observer...");
        // Start observing the document for changes
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      }
    };
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkElement);
    } else {
      checkElement();
    }
  }

  /**
   * Initialize the header
   */
  init() {
    if (this.initialized) return;
    
    wc.group("MTKHeader: Initializing");
    
    this.cacheElements();
    this.subscribeToEvents();
    this.render();
    this.attachEventListeners();
    
    this.initialized = true;
    
    wc.groupEnd();
    
    // Publish initialization event
    wc.publish('mtk-header:initialized', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.elements = {
      logo: this.element.querySelector('.mtk-header__logo'),
      menu: this.element.querySelector('.mtk-header__menu'),
      nav: this.element.querySelector('.mtk-header__nav'),
      mobileToggle: this.element.querySelector('.mtk-header__mobile-toggle')
    };
    
    wc.log("MTKHeader: Elements cached", this.elements);
  }

  /**
   * Subscribe to header events
   */
  subscribeToEvents() {
    wc.subscribe('mtk-header:update-logo', this.onMessage);
    wc.subscribe('mtk-header:update-menu', this.onMessage);
    wc.subscribe('mtk-header:set-active', this.onMessage);
    wc.subscribe('mtk-header:refresh', this.onMessage);
    
    wc.log("MTKHeader: Subscribed to events");
  }

  /**
   * Handle incoming messages from event subscriptions
   */
  onMessage(message, data) {
    wc.log("MTKHeader: Message received", message, data);
    
    const { type, payload } = data;
    
    switch (type) {
      case 'update-logo':
        this.updateLogo(payload);
        break;
        
      case 'update-menu':
        this.updateMenu(payload);
        break;
        
      case 'set-active':
        this.setActiveMenuItem(payload.id);
        break;
        
      case 'refresh':
        this.render();
        break;
        
      default:
        wc.warn(`Unknown message type: ${type}`);
    }
  }

  /**
   * Render all header content
   */
  render() {
    wc.group("MTKHeader: Rendering");
    
    this.renderLogo();
    this.renderMenu();
    
    wc.groupEnd();
    
    // Publish render complete event
    wc.publish('mtk-header:rendered', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Render logo
   */
  renderLogo() {
    if (!this.elements.logo || !this.config.logo) {
      wc.warn("MTKHeader: Cannot render logo - missing element or config");
      return;
    }
    
    const { src, alt, height, link } = this.config.logo;
    
    this.elements.logo.innerHTML = `
      <a href="${this.sanitizeUrl(link)}" aria-label="${this.escapeHtml(alt)}">
        <img src="${this.sanitizeUrl(src)}" alt="${this.escapeHtml(alt)}" style="height: ${this.escapeHtml(height)};">
      </a>
    `;
    
    wc.log("MTKHeader: Logo rendered");
  }

  /**
   * Render menu items
   */
  renderMenu() {
    if (!this.elements.menu || !this.config.menuItems) {
      wc.warn("MTKHeader: Cannot render menu - missing element or config");
      return;
    }
    
    const menuHTML = this.config.menuItems.map(item => {
      if (item.dropdown) {
        return this.renderDropdownItem(item);
      } else {
        return this.renderMenuItem(item);
      }
    }).join('');
    
    this.elements.menu.innerHTML = menuHTML;
    
    wc.log("MTKHeader: Menu rendered with", this.config.menuItems.length, "items");
  }

  /**
   * Render single menu item
   */
  renderMenuItem(item) {
    const activeClass = item.active ? 'mtk-header__menu-link--active' : '';
    
    return `
      <li class="mtk-header__menu-item" role="none">
        <a 
          href="${this.sanitizeUrl(item.link)}" 
          class="mtk-header__menu-link ${activeClass}"
          data-menu-id="${this.escapeHtml(item.id)}"
          role="menuitem"
          tabindex="0">
          ${item.label}
        </a>
      </li>
    `;
  }

  /**
   * Render dropdown menu item
   */
  renderDropdownItem(item) {
    const dropdownItemsHTML = item.items.map(dropdownItem => `
      <li class="mtk-header__dropdown-item" role="none">
        <a 
          href="${this.sanitizeUrl(dropdownItem.link)}" 
          data-menu-id="${this.escapeHtml(dropdownItem.id)}"
          role="menuitem"
          tabindex="-1">
          ${dropdownItem.label}
        </a>
      </li>
    `).join('');
    
    return `
      <li class="mtk-header__menu-item mtk-header__menu-item--dropdown" role="none">
        <a 
          href="#" 
          class="mtk-header__menu-link"
          data-menu-id="${this.escapeHtml(item.id)}"
          data-dropdown-toggle
          role="menuitem"
          aria-haspopup="true"
          aria-expanded="false"
          tabindex="0">
          ${item.label}
        </a>
        <ul class="mtk-header__dropdown" role="menu" aria-label="${this.escapeHtml(item.id)} submenu">
          ${dropdownItemsHTML}
        </ul>
      </li>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Menu item clicks
    if (this.elements.menu) {
      this.elements.menu.addEventListener('click', this.handleMenuClick);
      
      // Keyboard navigation
      this.elements.menu.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleMenuClick(e);
        }
      });
    }

    // Mobile toggle
    if (this.elements.mobileToggle) {
      this.elements.mobileToggle.addEventListener('click', this.handleMobileToggle);
    }

    // Click outside to close dropdowns
    document.addEventListener('click', this.handleClickOutside);
    
    // Escape key to close dropdowns
    document.addEventListener('keydown', this.handleEscapeKey);
    
    wc.log("MTKHeader: Event listeners attached");
  }

  /**
   * Handle menu item clicks
   */
  handleMenuClick(event) {
    const target = event.target.closest('a[data-menu-id]');
    if (!target) return;
    
    const menuId = target.dataset.menuId;
    const isDropdownToggle = target.hasAttribute('data-dropdown-toggle');
    
    wc.log("MTKHeader: Menu clicked", menuId);
    
    if (isDropdownToggle) {
      event.preventDefault();
      this.handleDropdownToggle(event);
      return;
    }
    
    // Publish click event
    wc.publish('mtk-header:menu-clicked', {
      menuId,
      link: target.getAttribute('href'),
      timestamp: new Date().toISOString(),
      element: target
    });
    
    // Don't prevent default for regular links
  }

  /**
   * Handle dropdown toggle
   */
  handleDropdownToggle(event) {
    const dropdownItem = event.target.closest('.mtk-header__menu-item--dropdown');
    if (!dropdownItem) return;
    
    const isOpen = dropdownItem.classList.contains('mtk-header__menu-item--open');
    
    wc.log("MTKHeader: Dropdown toggle", isOpen ? 'closing' : 'opening');
    
    // Close all dropdowns
    this.closeAllDropdowns();
    
    // Toggle current dropdown
    if (!isOpen) {
      dropdownItem.classList.add('mtk-header__menu-item--open');
      const toggle = dropdownItem.querySelector('[data-dropdown-toggle]');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'true');
      }
      this.activeDropdown = dropdownItem;
      
      // Make dropdown items focusable
      const dropdownLinks = dropdownItem.querySelectorAll('.mtk-header__dropdown a');
      dropdownLinks.forEach(link => link.setAttribute('tabindex', '0'));
      
      // Publish dropdown opened event
      wc.publish('mtk-header:dropdown-opened', {
        menuId: toggle.dataset.menuId,
        timestamp: new Date().toISOString()
      });
    } else {
      this.activeDropdown = null;
    }
  }

  /**
   * Handle mobile menu toggle
   */
  handleMobileToggle() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    
    wc.log("MTKHeader: Mobile menu", this.mobileMenuOpen ? 'opened' : 'closed');
    
    if (this.mobileMenuOpen) {
      this.elements.nav.classList.add('mtk-header__nav--open');
      this.elements.mobileToggle.setAttribute('aria-expanded', 'true');
      this.elements.mobileToggle.querySelector('.material-icons').textContent = 'close';
    } else {
      this.elements.nav.classList.remove('mtk-header__nav--open');
      this.elements.mobileToggle.setAttribute('aria-expanded', 'false');
      this.elements.mobileToggle.querySelector('.material-icons').textContent = 'menu';
      this.closeAllDropdowns();
    }
    
    // Publish mobile menu toggle event
    wc.publish('mtk-header:mobile-toggled', {
      isOpen: this.mobileMenuOpen,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle click outside to close dropdowns
   */
  handleClickOutside(event) {
    if (!this.activeDropdown) return;
    
    if (!this.activeDropdown.contains(event.target)) {
      wc.log("MTKHeader: Click outside, closing dropdown");
      this.closeAllDropdowns();
    }
  }

  /**
   * Handle escape key to close dropdowns
   */
  handleEscapeKey(event) {
    if (event.key === 'Escape') {
      wc.log("MTKHeader: Escape pressed");
      this.closeAllDropdowns();
      
      if (this.mobileMenuOpen) {
        this.handleMobileToggle();
      }
    }
  }

  /**
   * Close all dropdown menus
   */
  closeAllDropdowns() {
    const openDropdowns = this.element.querySelectorAll('.mtk-header__menu-item--open');
    openDropdowns.forEach(dropdown => {
      dropdown.classList.remove('mtk-header__menu-item--open');
      const toggle = dropdown.querySelector('[data-dropdown-toggle]');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
      
      // Make dropdown items not focusable
      const dropdownLinks = dropdown.querySelectorAll('.mtk-header__dropdown a');
      dropdownLinks.forEach(link => link.setAttribute('tabindex', '-1'));
    });
    
    this.activeDropdown = null;
  }

  /**
   * Set active menu item
   */
  setActiveMenuItem(menuId) {
    wc.log("MTKHeader: Setting active menu item", menuId);
    
    // Remove active class from all menu items
    const allLinks = this.element.querySelectorAll('.mtk-header__menu-link');
    allLinks.forEach(link => link.classList.remove('mtk-header__menu-link--active'));
    
    // Add active class to specified menu item
    const activeLink = this.element.querySelector(`[data-menu-id="${menuId}"]`);
    if (activeLink && activeLink.classList.contains('mtk-header__menu-link')) {
      activeLink.classList.add('mtk-header__menu-link--active');
      
      // Update config
      this.config.menuItems.forEach(item => {
        item.active = item.id === menuId;
      });
      
      // Publish active menu changed event
      wc.publish('mtk-header:active-changed', {
        menuId,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update logo
   */
  updateLogo(logoData) {
    wc.log("MTKHeader: Updating logo", logoData);
    
    this.config.logo = { ...this.config.logo, ...logoData };
    this.renderLogo();
    
    wc.publish('mtk-header:logo-updated', {
      logo: this.config.logo,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Update menu
   */
  updateMenu(menuItems) {
    wc.log("MTKHeader: Updating menu", menuItems);
    
    this.config.menuItems = menuItems;
    this.renderMenu();
    
    wc.publish('mtk-header:menu-updated', {
      menuItems: this.config.menuItems,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Sanitize URL to prevent XSS
   */
  sanitizeUrl(url) {
    // Allow relative URLs and common protocols
    if (url.startsWith('#') || url.startsWith('/') || 
        url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return '#';
  }

  /**
   * Destroy the header and clean up
   */
  destroy() {
    wc.log("MTKHeader: Destroying");
    
    // Remove event listeners
    if (this.elements.menu) {
      this.elements.menu.removeEventListener('click', this.handleMenuClick);
    }

    if (this.elements.mobileToggle) {
      this.elements.mobileToggle.removeEventListener('click', this.handleMobileToggle);
    }

    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleEscapeKey);
    
    // Clear elements
    this.elements = {};
    this.element = null;
    this.initialized = false;
    
    // Publish destroy event
    wc.publish('mtk-header:destroyed', {
      timestamp: new Date().toISOString()
    });
  }
}

// Initialize header when config is available
if (typeof window.app !== 'undefined' && window.app.header) {
  wc.log("MTKHeader: Config found, creating instance");
  const header = new MTKHeader(window.app.header);
  
  // Expose to window for external access if needed
  window.mtkHeader = header;
  
  // Example: Listen to header events
  wc.subscribe('mtk-header:menu-clicked', function(msg, data) {
    wc.info('🔵 Menu Clicked:', data);
  });
  
  wc.subscribe('mtk-header:dropdown-opened', function(msg, data) {
    wc.info('🟢 Dropdown Opened:', data);
  });
  
  wc.subscribe('mtk-header:initialized', function(msg, data) {
    wc.info('✅ Header Initialized:', data);
  });
  
  wc.subscribe('mtk-header:rendered', function(msg, data) {
    wc.info('✅ Header Rendered:', data);
  });
  
  wc.subscribe('mtk-header:mobile-toggled', function(msg, data) {
    wc.info('🟡 Mobile Menu Toggled:', data);
  });
} else {
  wc.error('window.app.header is not defined. Please include mtk-header.config.js before mtk-header.js');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MTKHeader };
}
