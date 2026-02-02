/**
 * MTK Dashboard - Material Design User Dashboard
 * A reusable, accessible dashboard component with event-driven architecture
 */

// Simple Web Component Communication Helper
const wc = {
  listeners: {},
  
  publish(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  },
  
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }
};

/**
 * MTKDashboard Class
 * Manages the dashboard UI, data binding, and event handling
 */
class MTKDashboard {
  constructor(config) {
    this.config = config;
    this.element = null;
    this.elements = {};
    this.initialized = false;
    
    // Bind methods
    this.onMessage = this.onMessage.bind(this);
    this.handleSubscribeClick = this.handleSubscribeClick.bind(this);
    this.handleContinueCourseClick = this.handleContinueCourseClick.bind(this);
    
    // Wait for DOM to be ready
    this.waitForElement();
  }

  /**
   * Wait for dashboard element to be available in DOM
   */
  waitForElement() {
    // Use MutationObserver to watch for element addition
    const observer = new MutationObserver((mutations, obs) => {
      this.element = document.querySelector('.mtk-dashboard');
      
      if (this.element) {
        obs.disconnect();
        this.init();
      }
    });
    
    const checkElement = () => {
      this.element = document.querySelector('.mtk-dashboard');
      
      if (this.element) {
        this.init();
      } else {
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
   * Initialize the dashboard
   */
  init() {
    if (this.initialized) return;
    
    this.cacheElements();
    this.subscribeToEvents();
    this.render();
    this.attachEventListeners();
    
    this.initialized = true;
    
    // Publish initialization event
    wc.publish('mtk-dashboard:initialized', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.elements = {
      userName: document.getElementById('user-name'),
      progressLabel: document.getElementById('progress-label'),
      progressPercentage: document.getElementById('progress-percentage'),
      progressFill: document.getElementById('progress-fill'),
      progressBar: this.element.querySelector('.mtk-progress-bar'),
      subscriptionTitle: document.getElementById('subscription-title'),
      subscriptionDescription: document.getElementById('subscription-description'),
      subscriptionFeatures: document.getElementById('subscription-features'),
      subscribeBtn: document.getElementById('subscribe-btn'),
      continueCourseBtn: document.getElementById('continue-course-btn')
    };
  }

  /**
   * Subscribe to dashboard events
   */
  subscribeToEvents() {
    wc.subscribe('mtk-dashboard:update-progress', this.onMessage);
    wc.subscribe('mtk-dashboard:update-user', this.onMessage);
    wc.subscribe('mtk-dashboard:update-subscription', this.onMessage);
    wc.subscribe('mtk-dashboard:refresh', this.onMessage);
  }

  /**
   * Handle incoming messages from event subscriptions
   */
  onMessage(data) {
    const { type, payload } = data;
    
    switch (type) {
      case 'update-progress':
        this.updateProgress(payload.percentage);
        break;
        
      case 'update-user':
        this.updateUserName(payload.fullName);
        break;
        
      case 'update-subscription':
        this.updateSubscription(payload);
        break;
        
      case 'refresh':
        this.render();
        break;
        
      default:
        console.warn(`Unknown message type: ${type}`);
    }
  }

  /**
   * Render all dashboard content
   */
  render() {
    this.renderUserInfo();
    this.renderProgress();
    this.renderSubscription();
    
    // Publish render complete event
    wc.publish('mtk-dashboard:rendered', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Render user information
   */
  renderUserInfo() {
    if (this.elements.userName && this.config.user.fullName) {
      this.elements.userName.textContent = this.config.user.fullName;
    }
  }

  /**
   * Render progress section
   */
  renderProgress() {
    const { progress } = this.config.user;
    
    // Render progress label
    if (this.elements.progressLabel && progress.label) {
      this.elements.progressLabel.textContent = progress.label;
    }
    
    // Render progress percentage
    if (this.elements.progressPercentage && progress.percentage !== undefined) {
      this.elements.progressPercentage.innerHTML = `
        <span class="material-icons" aria-hidden="true">trending_up</span>
        <span>${progress.percentage}%</span>
      `;
    }
    
    // Render progress bar
    if (this.elements.progressFill && this.elements.progressBar) {
      // Update ARIA attributes
      this.elements.progressBar.setAttribute('aria-valuenow', progress.percentage);
      
      // Animate progress bar
      requestAnimationFrame(() => {
        this.elements.progressFill.style.width = `${progress.percentage}%`;
      });
    }
  }

  /**
   * Render subscription section
   */
  renderSubscription() {
    const { subscription } = this.config;
    
    // Render title
    if (this.elements.subscriptionTitle && subscription.title) {
      this.elements.subscriptionTitle.textContent = subscription.title;
    }
    
    // Render description
    if (this.elements.subscriptionDescription && subscription.description) {
      this.elements.subscriptionDescription.textContent = subscription.description;
    }
    
    // Render features
    if (this.elements.subscriptionFeatures && subscription.features) {
      this.elements.subscriptionFeatures.innerHTML = subscription.features
        .map(feature => `
          <li class="mtk-subscription-card__feature">
            <span class="material-icons" aria-hidden="true">check_circle</span>
            <span>${this.escapeHtml(feature)}</span>
          </li>
        `)
        .join('');
    }
    
    // Render CTA button text
    if (this.elements.subscribeBtn && subscription.ctaText) {
      const btnTextSpan = this.elements.subscribeBtn.querySelector('span:last-child');
      if (btnTextSpan) {
        btnTextSpan.textContent = subscription.ctaText;
      }
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Subscribe button
    if (this.elements.subscribeBtn) {
      this.elements.subscribeBtn.addEventListener('click', this.handleSubscribeClick);
      
      // Keyboard accessibility
      this.elements.subscribeBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleSubscribeClick(e);
        }
      });
    }

    // Continue Course button
    if (this.elements.continueCourseBtn) {
      this.elements.continueCourseBtn.addEventListener('click', this.handleContinueCourseClick);
      
      // Keyboard accessibility
      this.elements.continueCourseBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleContinueCourseClick(e);
        }
      });
    }
  }

  /**
   * Handle subscribe button click
   */
  handleSubscribeClick(event) {
    // Publish click event
    wc.publish('mtk-dashboard:subscribe-clicked', {
      timestamp: new Date().toISOString(),
      user: this.config.user.fullName,
      element: event.target
    });
    
    // Add visual feedback
    const btn = event.currentTarget;
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);
  }

  /**
   * Handle continue course button click
   */
  handleContinueCourseClick(event) {
    // Publish click event
    wc.publish('mtk-dashboard:continue-course-clicked', {
      timestamp: new Date().toISOString(),
      user: this.config.user.fullName,
      progress: this.config.user.progress.percentage,
      element: event.target
    });
    
    // Add visual feedback
    const btn = event.currentTarget;
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);
  }

  /**
   * Update progress dynamically
   */
  updateProgress(percentage) {
    if (percentage < 0 || percentage > 100) {
      console.error('Progress percentage must be between 0 and 100');
      return;
    }
    
    this.config.user.progress.percentage = percentage;
    
    // Update UI
    if (this.elements.progressPercentage) {
      this.elements.progressPercentage.innerHTML = `
        <span class="material-icons" aria-hidden="true">trending_up</span>
        <span>${percentage}%</span>
      `;
    }
    
    if (this.elements.progressFill && this.elements.progressBar) {
      this.elements.progressBar.setAttribute('aria-valuenow', percentage);
      this.elements.progressFill.style.width = `${percentage}%`;
    }
    
    // Publish update event
    wc.publish('mtk-dashboard:progress-updated', {
      percentage,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Update user name dynamically
   */
  updateUserName(fullName) {
    this.config.user.fullName = fullName;
    
    if (this.elements.userName) {
      this.elements.userName.textContent = fullName;
    }
    
    // Publish update event
    wc.publish('mtk-dashboard:user-updated', {
      fullName,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Update subscription content dynamically
   */
  updateSubscription(subscriptionData) {
    this.config.subscription = { ...this.config.subscription, ...subscriptionData };
    this.renderSubscription();
    
    // Publish update event
    wc.publish('mtk-dashboard:subscription-updated', {
      subscription: this.config.subscription,
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
   * Destroy the dashboard and clean up
   */
  destroy() {
    // Remove event listeners
    if (this.elements.subscribeBtn) {
      this.elements.subscribeBtn.removeEventListener('click', this.handleSubscribeClick);
    }

    if (this.elements.continueCourseBtn) {
      this.elements.continueCourseBtn.removeEventListener('click', this.handleContinueCourseClick);
    }
    
    // Clear elements
    this.elements = {};
    this.element = null;
    this.initialized = false;
    
    // Publish destroy event
    wc.publish('mtk-dashboard:destroyed', {
      timestamp: new Date().toISOString()
    });
  }
}

// Initialize dashboard when config is available
if (typeof mtkDashboardConfig !== 'undefined') {
  const dashboard = new MTKDashboard(mtkDashboardConfig);
  
  // Expose to window for external access if needed
  window.mtkDashboard = dashboard;
  
  // Example: Listen to dashboard events
  wc.subscribe('mtk-dashboard:subscribe-clicked', (data) => {
    console.log('Subscribe button clicked:', data);
  });

  wc.subscribe('mtk-dashboard:continue-course-clicked', (data) => {
    console.log('Continue Course button clicked:', data);
  });
  
  wc.subscribe('mtk-dashboard:initialized', (data) => {
    console.log('Dashboard initialized:', data);
  });
  
  wc.subscribe('mtk-dashboard:progress-updated', (data) => {
    console.log('Progress updated:', data);
  });
  
  wc.subscribe('mtk-dashboard:rendered', (data) => {
    console.log('Dashboard rendered:', data);
  });
} else {
  console.error('mtkDashboardConfig is not defined. Please include mtk-dashboard.config.js before mtk-dashboard.js');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MTKDashboard, wc };
}
