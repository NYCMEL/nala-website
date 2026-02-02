/**
 * MTK-Header Component
 * Material Design Header with JSON-driven configuration
 */

class MTKHeader {
  constructor(element) {
    this.element = element;
    this.config = null;
    this.activeDropdown = null;
    
    this.init();
  }

  /**
   * Initialize the header component
   */
  init() {
    // Wait for config to be available
    this.waitForConfig()
      .then(() => {
        this.config = window.app.header;
        this.render();
        this.attachEventListeners();
        this.subscribeToEvents();
      })
      .catch((error) => {
        console.error('MTKHeader: Failed to initialize', error);
      });
  }

  /**
   * Wait for configuration to be available
   */
  waitForConfig() {
    return new Promise((resolve, reject) => {
      const checkConfig = () => {
        if (window.app && window.app.header) {
          resolve();
        } else {
          setTimeout(checkConfig, 50);
        }
      };
      checkConfig();
      
      // Timeout after 5 seconds
      setTimeout(() => reject('Config timeout'), 5000);
    });
  }

  /**
   * Render the header component
   */
  render() {
    this.renderLogo();
    this.renderMenu();
  }

  /**
   * Render logo section
   */
  renderLogo() {
    const logoLink = this.element.querySelector('[data-logo-link]');
    const logoImg = this.element.querySelector('[data-logo-img]');
    
    if (logoLink && logoImg && this.config.logo) {
      logoLink.href = this.config.logo.link;
      logoImg.src = this.config.logo.src;
      logoImg.alt = this.config.logo.alt;
      logoImg.style.height = this.config.logo.height;
    }
  }

  /**
   * Render navigation menu
   */
  renderMenu() {
    const navMenu = this.element.querySelector('[data-nav-menu]');
    if (!navMenu || !this.config.menuItems) return;

    navMenu.innerHTML = '';

    this.config.menuItems.forEach((item) => {
      const menuItem = this.createMenuItem(item);
      navMenu.appendChild(menuItem);
    });
  }

  /**
   * Create a menu item element
   */
  createMenuItem(item) {
    const li = document.createElement('li');
    li.className = 'mtk-header__menu-item';
    li.setAttribute('data-menu-id', item.id);

    if (item.dropdown) {
      li.classList.add('mtk-header__menu-item--has-dropdown');
    }

    const link = document.createElement('a');
    link.className = 'mtk-header__menu-link';
    link.href = item.link;
    link.innerHTML = item.label;
    link.setAttribute('data-menu-link', item.id);
    link.setAttribute('role', 'menuitem');
    link.setAttribute('tabindex', '0');

    if (item.active) {
      link.classList.add('mtk-header__menu-link--active');
    }

    li.appendChild(link);

    // Add dropdown if exists
    if (item.dropdown) {
      const dropdown = this.createDropdown(item.dropdown);
      li.appendChild(dropdown);
    }

    return li;
  }

  /**
   * Create dropdown menu
   */
  createDropdown(items) {
    const ul = document.createElement('ul');
    ul.className = 'mtk-header__dropdown';
    ul.setAttribute('role', 'menu');

    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'mtk-header__dropdown-item';

      const link = document.createElement('a');
      link.href = item.link;
      link.innerHTML = item.label;
      link.setAttribute('data-dropdown-link', item.id);
      link.setAttribute('role', 'menuitem');
      link.setAttribute('tabindex', '0');

      li.appendChild(link);
      ul.appendChild(li);
    });

    return ul;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Menu item clicks
    this.element.addEventListener('click', (e) => {
      const menuLink = e.target.closest('[data-menu-link]');
      const dropdownLink = e.target.closest('[data-dropdown-link]');
      const logoLink = e.target.closest('[data-logo-link]');

      if (menuLink) {
        this.handleMenuClick(e, menuLink);
      } else if (dropdownLink) {
        this.handleDropdownClick(e, dropdownLink);
      } else if (logoLink) {
        this.handleLogoClick(e, logoLink);
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) {
        this.closeAllDropdowns();
      }
    });

    // Keyboard navigation
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
      }
    });
  }

  /**
   * Handle menu item click
   */
  handleMenuClick(e, link) {
    const menuItem = link.closest('.mtk-header__menu-item');
    const hasDropdown = menuItem.classList.contains('mtk-header__menu-item--has-dropdown');

    if (hasDropdown) {
      e.preventDefault();
      this.toggleDropdown(menuItem);
    }

    // Publish click event
    this.publishEvent('mtk-header:menu-click', {
      id: link.getAttribute('data-menu-link'),
      href: link.href,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle dropdown item click
   */
  handleDropdownClick(e, link) {
    e.preventDefault();
    
    // Publish click event
    this.publishEvent('mtk-header:dropdown-click', {
      id: link.getAttribute('data-dropdown-link'),
      href: link.href,
      timestamp: new Date().toISOString()
    });

    this.closeAllDropdowns();
  }

  /**
   * Handle logo click
   */
  handleLogoClick(e, link) {
    e.preventDefault();
    
    // Publish click event
    this.publishEvent('mtk-header:logo-click', {
      href: link.href,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Toggle dropdown menu
   */
  toggleDropdown(menuItem) {
    const dropdown = menuItem.querySelector('.mtk-header__dropdown');
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains('mtk-header__dropdown--open');

    // Close all dropdowns first
    this.closeAllDropdowns();

    // Toggle current dropdown
    if (!isOpen) {
      dropdown.classList.add('mtk-header__dropdown--open');
      this.activeDropdown = dropdown;
    }
  }

  /**
   * Close all dropdown menus
   */
  closeAllDropdowns() {
    const dropdowns = this.element.querySelectorAll('.mtk-header__dropdown--open');
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove('mtk-header__dropdown--open');
    });
    this.activeDropdown = null;
  }

  /**
   * Publish event using wc.publish
   */
  publishEvent(eventName, data) {
    if (window.wc && typeof window.wc.publish === 'function') {
      window.wc.publish(eventName, data);
      console.log(`📢 Published: ${eventName}`, data);
    } else {
      console.warn('wc.publish not available');
    }
  }

  /**
   * Subscribe to events
   */
  subscribeToEvents() {
    if (window.wc && typeof window.wc.subscribe === 'function') {
      window.wc.subscribe('mtk-header:menu-click', this.onMessage.bind(this));
      window.wc.subscribe('mtk-header:dropdown-click', this.onMessage.bind(this));
      window.wc.subscribe('mtk-header:logo-click', this.onMessage.bind(this));
      window.wc.subscribe('mtk-header:update-config', this.onMessage.bind(this));
      
      console.log('✅ MTKHeader: Subscribed to all events');
    }
  }

  /**
   * Handle incoming messages
   */
  onMessage(eventName, data) {
    console.log(`📥 Received: ${eventName}`, data);

    switch (eventName) {
      case 'mtk-header:update-config':
        if (data && data.config) {
          window.app.header = data.config;
          this.config = data.config;
          this.render();
        }
        break;
      
      default:
        // Handle other events as needed
        break;
    }
  }

  /**
   * Update active menu item
   */
  setActiveMenuItem(menuId) {
    // Remove all active states
    const allLinks = this.element.querySelectorAll('.mtk-header__menu-link');
    allLinks.forEach(link => link.classList.remove('mtk-header__menu-link--active'));

    // Set new active state
    const activeLink = this.element.querySelector(`[data-menu-link="${menuId}"]`);
    if (activeLink) {
      activeLink.classList.add('mtk-header__menu-link--active');
    }
  }
}

/**
 * Initialize MTKHeader when element is available in DOM
 */
(function initMTKHeader() {
  console.log('MTKHeader: Waiting for element...');

  const observer = new MutationObserver((mutations, obs) => {
    const element = document.querySelector('mtk-header.mtk-header');
    
    if (element) {
      console.log('✅ MTKHeader: Element found, initializing...');
      
      // Initialize the component
      const headerInstance = new MTKHeader(element);
      
      // Store instance globally if needed
      window.mtkHeader = headerInstance;
      
      // Stop observing
      obs.disconnect();
    }
  });

  // Start observing
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Also check if element already exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const element = document.querySelector('mtk-header.mtk-header');
      if (element && !window.mtkHeader) {
        const headerInstance = new MTKHeader(element);
        window.mtkHeader = headerInstance;
      }
    });
  }
})();
