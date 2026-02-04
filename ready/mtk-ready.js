/**
 * MTK Ready Component Class
 */
class MTKReady {
    constructor(element) {
        this.element = element;
        this.button = null;
        this.config = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    /**
     * Initialize component
     */
    init() {
        // Check if configuration is available
        if (!this.waitForConfig()) {
            console.error('[MTK Ready] Configuration not found in window.app.ready');
            return;
        }
        
        this.config = window.app.ready;
        this.cacheDOM();
        this.populateContent();
        this.bindEvents();
        this.isInitialized = true;
        
        wc.log('[MTK Ready] Component initialized successfully');
    }
    
    /**
     * Wait for configuration to be available
     */
    waitForConfig() {
        return window.app && window.app.ready;
    }
    
    /**
     * Cache DOM elements
     */
    cacheDOM() {
        this.title = this.element.querySelector('.mtk-ready__title');
        this.subtitle = this.element.querySelector('.mtk-ready__subtitle');
        this.button = this.element.querySelector('.mtk-ready__btn');
        this.buttonText = this.element.querySelector('.mtk-ready__btn-text');
        this.ripple = this.element.querySelector('.mtk-ready__btn-ripple');
    }
    
    /**
     * Populate content from configuration
     */
    populateContent() {
        if (this.title && this.config.title) {
            this.title.textContent = this.config.title;
        }
        
        if (this.subtitle && this.config.subtitle) {
            this.subtitle.textContent = this.config.subtitle;
        }
        
        if (this.buttonText && this.config.buttonText) {
            this.buttonText.textContent = this.config.buttonText;
        }
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        if (this.button) {
            this.button.addEventListener('click', this.handleButtonClick.bind(this));
            this.button.addEventListener('mousedown', this.handleRipple.bind(this));
        }
    }
    
    /**
     * Handle button click event
     */
    handleButtonClick(event) {
        event.preventDefault();
        
        if (!this.isInitialized) {
            console.warn('[MTK Ready] Component not initialized');
            return;
        }
        
        // Prepare data for wc.publish
        const publishData = {
            action: this.config.buttonAction || 'ready.get-started',
            component: 'mtk-ready',
            timestamp: new Date().toISOString(),
            config: this.config
        };
        
        // Add analytics data if available
        if (this.config.analytics) {
            publishData.analytics = this.config.analytics;
        }
        
        // Publish event using wc.publish
        wc.publish(this.config.buttonAction || 'ready.get-started', publishData);
        
        // Log for debugging
        wc.log('[MTK Ready] Button clicked, event published:', publishData);
        
        // Optional: Add loading state
        this.setLoadingState(true);
        
        // Simulate async action (remove in production)
        setTimeout(() => {
            this.setLoadingState(false);
        }, 1000);
    }
    
    /**
     * Handle Material Design ripple effect
     */
    handleRipple(event) {
        if (!this.ripple) return;
        
        // Remove existing animation
        this.ripple.classList.remove('animate');
        
        // Calculate ripple position
        const rect = this.button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Set ripple position
        this.ripple.style.left = x + 'px';
        this.ripple.style.top = y + 'px';
        
        // Trigger animation
        requestAnimationFrame(() => {
            this.ripple.classList.add('animate');
        });
        
        // Remove animation class after completion
        setTimeout(() => {
            this.ripple.classList.remove('animate');
        }, 600);
    }
    
    /**
     * Set loading state
     */
    setLoadingState(isLoading) {
        if (isLoading) {
            this.element.classList.add('mtk-ready--loading');
            this.button.disabled = true;
        } else {
            this.element.classList.remove('mtk-ready--loading');
            this.button.disabled = false;
        }
    }
    
    /**
     * Set error state
     */
    setErrorState(hasError) {
        if (hasError) {
            this.element.classList.add('mtk-ready--error');
        } else {
            this.element.classList.remove('mtk-ready--error');
        }
    }
    
    /**
     * Destroy component
     */
    destroy() {
        if (this.button) {
            this.button.removeEventListener('click', this.handleButtonClick);
            this.button.removeEventListener('mousedown', this.handleRipple);
        }
        this.isInitialized = false;
    }
}

/**
 * Wait for element to be available in DOM (supports wc-include)
 */
function waitForElement(selector, callback, timeout = 30000) {
    const startTime = Date.now();
    
    wc.log('[MTK Ready] Waiting for element:', selector);
    
    // Check if element already exists
    const existingElement = document.querySelector(selector);
    if (existingElement) {
        wc.log('[MTK Ready] Element found immediately');
        callback(existingElement);
        return;
    }
    
    // Use MutationObserver to watch for element
    const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        
        if (element) {
            wc.log('[MTK Ready] Element detected via MutationObserver');
            obs.disconnect();
            callback(element);
            return;
        }
        
        // Check timeout
        if (Date.now() - startTime > timeout) {
            console.error('[MTK Ready] Timeout waiting for element:', selector);
            obs.disconnect();
        }
    });
    
    // Start observing
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    wc.log('[MTK Ready] MutationObserver started, watching for element...');
}

/**
 * Initialize component when element is ready
 */
function initializeComponent(element) {
    wc.log('[MTK Ready] Initializing component...');
    
    // Check if configuration is available
    if (!window.app || !window.app.ready) {
        console.warn('[MTK Ready] Configuration not available, waiting...');
        
        // Wait for config with retries
        let retries = 0;
        const maxRetries = 20;
        const checkInterval = 100;
        
        const configInterval = setInterval(() => {
            retries++;
            
            if (window.app && window.app.ready) {
                clearInterval(configInterval);
                wc.log('[MTK Ready] Configuration loaded');
                // Initialize and store instance globally
                window.mtkReadyInstance = new MTKReady(element);
            } else if (retries >= maxRetries) {
                clearInterval(configInterval);
                console.error('[MTK Ready] Configuration timeout after', retries * checkInterval, 'ms');
            }
        }, checkInterval);
        
        return;
    }
    
    // Initialize immediately if config is ready and store instance globally
    window.mtkReadyInstance = new MTKReady(element);
}

/**
 * Start the initialization process
 */
function start() {
    wc.log('[MTK Ready] Starting initialization...');
    
    // Wait for element to be available (supports wc-include dynamic loading)
    waitForElement('#mtkReady', initializeComponent);
}

// Start when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}

// Export MTKReady class and initialize function for external use
window.MTKReady = MTKReady;
window.initializeMTKReady = start;
