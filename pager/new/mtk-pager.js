// mtk-pager.js
// Standalone page/section manager component
// Vanilla JavaScript with optional jQuery support
// Material Design & Bootstrap compatible

(function() {
    'use strict';
    
    // Private state
    const state = {
        container: null,
        sections: new Map(),
        currentSection: null,
        isInitialized: false,
        config: null,
        debugMode: false
    };
    
    // Private methods
    const _log = (message, type = 'info') => {
        if (!state.debugMode && type === 'debug') return;
        
        const prefix = '[mtk-pager]';
        const styles = {
            info: 'color: #2196F3',
            success: 'color: #4CAF50',
            error: 'color: #F44336',
            warning: 'color: #FF9800',
            debug: 'color: #9E9E9E'
        };
        
        console.log(`%c${prefix} ${message}`, styles[type] || styles.info);
    };
    
    const _dispatchEvent = (eventName, detail = {}) => {
        const event = new CustomEvent(eventName, {
            detail: detail,
            bubbles: true,
            cancelable: true
        });
        
        if (state.container) {
            state.container.dispatchEvent(event);
            _log(`Event dispatched: ${eventName}`, 'debug');
        }
    };
    
    const _waitForContainer = (callback, maxAttempts = 50) => {
        let attempts = 0;
        
        const checkContainer = () => {
            attempts++;
            const container = document.getElementById('mtk-pager');
            
            if (container) {
                _log(`Container found after ${attempts} attempt(s)`, 'success');
                callback(container);
                return true;
            }
            
            if (attempts >= maxAttempts) {
                _log(`ERROR: Container not found after ${maxAttempts} attempts (${maxAttempts * 50}ms)`, 'error');
                return false;
            }
            
            _log(`Container not found yet, attempt ${attempts}/${maxAttempts}...`, 'debug');
            setTimeout(checkContainer, 50);
        };
        
        checkContainer();
    };
    
    const _findContainer = () => {
        const container = document.getElementById('mtk-pager');
        
        if (!container) {
            _log('Container <PAGER id="mtk-pager"> not found in DOM', 'warning');
            return null;
        }
        
        if (container.tagName !== 'PAGER') {
            _log('WARNING: Container found but is not a <PAGER> element', 'warning');
        }
        
        _log('Container found successfully', 'success');
        return container;
    };
    
    const _createSection = (sectionId) => {
        const section = document.createElement('PAGER-SECTION');
        section.id = `mtk-pager-${sectionId}`;
        section.className = 'mtk-pager-section';
        section.setAttribute('data-section-id', sectionId);
        
        _log(`Section created: ${sectionId}`, 'debug');
        return section;
    };
    
    const _hideAllSections = () => {
        // Hide all sections in the container
        const allSections = state.container.querySelectorAll('PAGER-SECTION');
        allSections.forEach((section) => {
            if (section.classList.contains('active')) {
                section.classList.remove('active');
                const sectionId = section.getAttribute('data-section-id');
                _log(`Section hidden: ${sectionId}`, 'debug');
                
                // Dispatch hide event
                _dispatchEvent('mtk-pager:hide', {
                    sectionId: sectionId
                });
            }
        });
        
        // Also update our state map
        state.sections.forEach((section, id) => {
            if (section.classList.contains('active')) {
                section.classList.remove('active');
            }
        });
    };
    
    const _loadContent = (section, sectionId, callback) => {
        if (!state.config || !state.config[sectionId]) {
            _log(`No URL configured for section: ${sectionId}`, 'warning');
            section.innerHTML = `
                <div class="mtk-pager-error">
                    <span class="material-icons">error_outline</span>
                    <strong>Configuration Error:</strong> No URL defined for section "${sectionId}"
                </div>
            `;
            if (callback) callback(false);
            return;
        }
        
        const url = state.config[sectionId];
        _log(`Loading content from: ${url}`, 'info');
        
        // Add loading state
        if (state.container) {
            state.container.classList.add('loading');
        }
        
        // Try jQuery first (if available)
        if (typeof jQuery !== 'undefined' && jQuery.fn.load) {
            _log('Using jQuery to load content', 'debug');
            
            jQuery(section).load(url, function(response, status, xhr) {
                if (state.container) {
                    state.container.classList.remove('loading');
                }
                
                if (status === 'error') {
                    _log(`Failed to load content: ${xhr.status} ${xhr.statusText}`, 'error');
                    section.innerHTML = `
                        <div class="mtk-pager-error">
                            <span class="material-icons">error_outline</span>
                            <strong>Load Error:</strong> Failed to load content from "${url}"
                            <br><small>${xhr.status} ${xhr.statusText}</small>
                        </div>
                    `;
                    if (callback) callback(false);
                } else {
                    _log(`Content loaded successfully for: ${sectionId}`, 'success');
                    if (callback) callback(true);
                }
            });
        } else {
            // Fallback to fetch API
            _log('jQuery not available, using fetch API', 'debug');
            
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(html => {
                    if (state.container) {
                        state.container.classList.remove('loading');
                    }
                    section.innerHTML = html;
                    _log(`Content loaded successfully for: ${sectionId}`, 'success');
                    if (callback) callback(true);
                })
                .catch(error => {
                    if (state.container) {
                        state.container.classList.remove('loading');
                    }
                    _log(`Failed to load content: ${error.message}`, 'error');
                    section.innerHTML = `
                        <div class="mtk-pager-error">
                            <span class="material-icons">error_outline</span>
                            <strong>Load Error:</strong> Failed to load content from "${url}"
                            <br><small>${error.message}</small>
                        </div>
                    `;
                    if (callback) callback(false);
                });
        }
    };
    
    const _showSection = (sectionId) => {
        if (!state.container) {
            _log('Cannot show section: Container not initialized', 'error');
            return;
        }
        
        _log(`Attempting to show section: ${sectionId}`, 'info');
        
        // Hide all sections first
        _hideAllSections();
        
        // Check if section already exists
        let section = state.sections.get(sectionId);
        
        if (section) {
            // Section exists, just activate it
            _log(`Section already exists: ${sectionId}`, 'debug');
            section.classList.add('active');
            state.currentSection = sectionId;
            
            _dispatchEvent('mtk-pager:show', {
                sectionId: sectionId,
                isNew: false
            });
        } else {
            // Section doesn't exist, create it
            _log(`Creating new section: ${sectionId}`, 'debug');
            section = _createSection(sectionId);
            
            // Load content
            _loadContent(section, sectionId, (success) => {
                if (success) {
                    _dispatchEvent('mtk-pager:loaded', {
                        sectionId: sectionId
                    });
                }
            });
            
            // Add to container
            state.container.appendChild(section);
            
            // Store reference
            state.sections.set(sectionId, section);
            
            // Activate it
            section.classList.add('active');
            state.currentSection = sectionId;
            
            _dispatchEvent('mtk-pager:show', {
                sectionId: sectionId,
                isNew: true
            });
        }
        
        _log(`Current section: ${state.currentSection}`, 'success');
    };
    
    const _subscribeToEvents = () => {
        // Subscribe to custom mtk-pager events
        const eventNames = [
            'mtk-pager:show',
            'mtk-pager:loaded',
            'mtk-pager:hide',
            'mtk-pager:error'
        ];
        
        eventNames.forEach(eventName => {
            document.addEventListener(eventName, (e) => {
                _log(`Event received: ${eventName}`, 'debug');
                if (e.detail) {
                    _log(`Event detail: ${JSON.stringify(e.detail)}`, 'debug');
                }
            });
        });
        
        _log('Subscribed to mtk-pager events', 'debug');
    };
    
    const _initialize = () => {
        if (state.isInitialized) {
            _log('Already initialized', 'warning');
            return;
        }
        
        _log('Initializing mtk-pager...', 'info');
        
        // Load configuration
        if (typeof app !== 'undefined' && app.pager) {
            state.config = app.pager;
            _log('Configuration loaded from app.pager', 'success');
            
            // Load defaults if available
            if (app.pagerDefaults) {
                state.debugMode = app.pagerDefaults.debugMode || false;
                _log(`Debug mode: ${state.debugMode}`, 'debug');
            }
        } else {
            _log('WARNING: app.pager configuration not found!', 'warning');
            state.config = {};
        }
        
        // Wait for container to be in DOM
        _log('Waiting for PAGER container to be in DOM...', 'info');
        _waitForContainer((container) => {
            state.container = container;
            
            // Subscribe to events
            _subscribeToEvents();
            
            // Mark as initialized
            state.isInitialized = true;
            _log('mtk-pager initialized successfully', 'success');
            
            // Dispatch initialization event
            _dispatchEvent('mtk-pager:initialized', {
                sections: Array.from(state.sections.keys())
            });
            
            // ALWAYS load initial section (first page)
            let initialSection = 'home'; // Default fallback
            
            if (typeof app !== 'undefined' && app.pagerDefaults && app.pagerDefaults.initialSection) {
                initialSection = app.pagerDefaults.initialSection;
            }
            
            _log(`Auto-loading first page: ${initialSection}`, 'info');
            
            // Small delay to ensure DOM is fully ready
            setTimeout(() => {
                _showSection(initialSection);
            }, 50);
        });
    };
    
    // Public API
    const mtk_pager = {
        show: function(sectionId) {
            if (!sectionId) {
                _log('ERROR: sectionId is required', 'error');
                return;
            }
            
            if (!state.isInitialized) {
                _log('WARNING: Not initialized, initializing now...', 'warning');
                _initialize();
            }
            
            _showSection(sectionId);
        },
        
        // Additional helper methods (not required but useful)
        getCurrentSection: function() {
            return state.currentSection;
        },
        
        getSections: function() {
            return Array.from(state.sections.keys());
        },
        
        isInitialized: function() {
            return state.isInitialized;
        }
    };
    
    // Expose globally
    window.mtk_pager = mtk_pager;
    
    // Auto-initialize immediately
    _log('mtk-pager component loaded', 'info');
    _initialize();
    
})();
