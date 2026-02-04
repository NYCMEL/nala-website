/**
 * MTK Ready Component - Vanilla JavaScript
 * Material Design interactions with wc.publish integration
 */

(function() {
    'use strict';
    
    // WebComponent Communication System
    window.wc = window.wc || {
        subscribers: {},
        
        publish: function(event, data) {
            console.log(`[WC.Publish] Event: ${event}`, data);
            
            if (this.subscribers[event]) {
                this.subscribers[event].forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(`[WC.Publish] Error in subscriber for ${event}:`, error);
                    }
                });
            }
            
            // Dispatch custom event for other listeners
            const customEvent = new CustomEvent('wc:' + event, {
                detail: data,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(customEvent);
        },
        
        subscribe: function(event, callback) {
            if (!this.subscribers[event]) {
                this.subscribers[event] = [];
            }
            this.subscribers[event].push(callback);
        },
        
        unsubscribe: function(event, callback) {
            if (this.subscribers[event]) {
                this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
            }
        }
    };
    
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
            
            console.log('[MTK Ready] Component initialized successfully');
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
            console.log('[MTK Ready] Button clicked, event published:', publishData);
            
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
     * Component availability check and initialization
     */
    function initMTKReady() {
        console.log('[MTK Ready] Init called, readyState:', document.readyState);
        
        // Check if component element exists
        const element = document.getElementById('mtkReady');
        if (!element) {
            console.warn('[MTK Ready] Component element #mtkReady not found yet (may be loading via wc-include)');
            return false;
        }
        
        console.log('[MTK Ready] Element found:', element);
        
        // Check if configuration is available
        if (!window.app || !window.app.ready) {
            console.warn('[MTK Ready] Waiting for configuration...');
            
            // Retry after a short delay
            setTimeout(() => {
                if (window.app && window.app.ready) {
                    new MTKReady(element);
                } else {
                    console.error('[MTK Ready] Configuration still not available after delay');
                }
            }, 100);
            return true;
        }
        
        // Initialize component
        console.log('[MTK Ready] Initializing with config:', window.app.ready);
        new MTKReady(element);
        return true;
    }
    
    /**
     * Watch for dynamically loaded elements (wc-include support)
     */
    function watchForElement() {
        // Try to initialize immediately
        if (initMTKReady()) {
            return; // Successfully initialized
        }
        
        // If not found, watch for it to be added to DOM
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const element = document.getElementById('mtkReady');
                    if (element) {
                        console.log('[MTK Ready] Element detected via MutationObserver');
                        observer.disconnect();
                        initMTKReady();
                        return;
                    }
                }
            }
        });
        
        // Start observing the document body for added nodes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[MTK Ready] Watching for element to be added to DOM...');
        
        // Fallback: Stop observing after 10 seconds
        setTimeout(() => {
            observer.disconnect();
            console.warn('[MTK Ready] Stopped watching for element after 10 seconds');
        }, 10000);
    }
    
    // Start initialization - wait for DOM to be fully ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', watchForElement);
    } else {
        // DOM is already ready, init immediately
        watchForElement();
    }
    
    // Export for external use
    window.MTKReady = MTKReady;
    
    // Example subscriber for testing
    wc.subscribe('ready.get-started', function(data) {
        console.log('[Subscriber Example] Received event:', data);
        // Add your custom logic here
        // Example: redirect to signup page, open modal, etc.
    });
    
})();
