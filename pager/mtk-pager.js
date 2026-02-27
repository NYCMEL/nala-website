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
    const _dispatchEvent = (eventName, detail = {}) => {
        const event = new CustomEvent(eventName, {
            detail: detail,
            bubbles: true,
            cancelable: true
        });
        
        if (state.container) {
            state.container.dispatchEvent(event);
            wc.log(`Event dispatched: ${eventName}`, 'debug');
        }
    };
    
    const _waitForContainer = (callback, maxAttempts = 50) => {
        let attempts = 0;
        
        const checkContainer = () => {
            attempts++;
            const container = document.getElementById('mtk-pager');
            
            if (container) {
                wc.log(`Container found after ${attempts} attempt(s)`, 'success');
                callback(container);
                return true;
            }
            
            if (attempts >= maxAttempts) {
                wc.log(`ERROR: Container not found after ${maxAttempts} attempts (${maxAttempts * 50}ms)`, 'error');
                return false;
            }
            
            wc.log(`Container not found yet, attempt ${attempts}/${maxAttempts}...`, 'debug');
            setTimeout(checkContainer, 50);
        };
        
        checkContainer();
    };
    
    const _findContainer = () => {
        const container = document.getElementById('mtk-pager');
        
        if (!container) {
            wc.log('Container <PAGER id="mtk-pager"> not found in DOM', 'warning');
            return null;
        }
        
        if (container.tagName !== 'PAGER') {
            wc.log('WARNING: Container found but is not a <PAGER> element', 'warning');
        }
        
        wc.log('Container found successfully', 'success');
        return container;
    };
    
    const _createSection = (sectionId) => {
        const section = document.createElement('PAGER-SECTION');
        section.id = `mtk-pager-${sectionId}`;
        section.className = 'mtk-pager-section';
        section.setAttribute('data-section-id', sectionId);
        
        wc.log(`Section created: ${sectionId}`, 'debug');
        return section;
    };
    
    const _hideAllSections = () => {
        // Hide all sections in the container
        const allSections = state.container.querySelectorAll('PAGER-SECTION');
        allSections.forEach((section) => {
            if (section.classList.contains('active')) {
                section.classList.remove('active');
                const sectionId = section.getAttribute('data-section-id');
                wc.log(`Section hidden: ${sectionId}`, 'debug');
                
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
            wc.log(`No URL configured for section: ${sectionId}`, 'warning');
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
        wc.log(`Loading content from: ${url}`, 'info');
        
        // Add loading state
        if (state.container) {
            state.container.classList.add('loading');
        }
        
        // Try jQuery first (if available)
        if (typeof jQuery !== 'undefined' && jQuery.fn.load) {
            wc.log('Using jQuery to load content', 'debug');
            
            jQuery(section).load(url, function(response, status, xhr) {
                if (state.container) {
                    state.container.classList.remove('loading');
                }
                
                if (status === 'error') {
                    wc.log(`Failed to load content: ${xhr.status} ${xhr.statusText}`, 'error');
                    section.innerHTML = `
                        <div class="mtk-pager-error">
                            <span class="material-icons">error_outline</span>
                            <strong>Load Error:</strong> Failed to load content from "${url}"
                            <br><small>${xhr.status} ${xhr.statusText}</small>
                        </div>
                    `;
                    if (callback) callback(false);
                } else {
                    wc.log(`Content loaded successfully for: ${sectionId}`, 'success');
                    if (callback) callback(true);
                }
            });
        } else {
            // Fallback to fetch API
            wc.log('jQuery not available, using fetch API', 'debug');
            
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
                    wc.log(`Content loaded successfully for: ${sectionId}`, 'success');
                    if (callback) callback(true);
                })
                .catch(error => {
                    if (state.container) {
                        state.container.classList.remove('loading');
                    }
                    wc.log(`Failed to load content: ${error.message}`, 'error');
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
	// ADD ACTIVE TO CURRENT LINK
	$(".nav-link, .navbar-brand, .btn").removeClass("active");

	if (sectionId == "course") {
	    $("#mtk-header-hierarchy").addClass("active");

	} else {
	    $("#mtk-header-" + sectionId).addClass("active");
	}

        if (!state.container) {
            wc.log('Cannot show section: Container not initialized', 'error');
            return;
        }
        
        wc.log(`Attempting to show section: ${sectionId}`, 'info');
        
        // Hide all sections first
        _hideAllSections();
        
        // Check if section already exists
        let section = state.sections.get(sectionId);
        
        if (section) {
            // Section exists, just activate it
            wc.log(`Section already exists: ${sectionId}`, 'debug');

            section.classList.add('active');
            state.currentSection = sectionId;
            
            _dispatchEvent('mtk-pager:show', {
                sectionId: sectionId,
                isNew: false
            });
        } else {
	    alert("mtk-pager.js:" + sectionId);

            // Section doesn't exist, create it
            wc.log(`Creating new section: ${sectionId}`, 'debug');
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
        
        wc.log(`Current section: ${state.currentSection}`, 'success');
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
                wc.log(`Event received: ${eventName}`, 'debug');
                if (e.detail) {
                    wc.log(`Event detail: ${JSON.stringify(e.detail)}`, 'debug');
                }
            });
        });
        
        wc.log('Subscribed to mtk-pager events', 'debug');
    };
    
    const _initialize = () => {
        if (state.isInitialized) {
            wc.log('Already initialized', 'warning');
            return;
        }
        
        wc.log('Initializing mtk-pager...', 'info');
        
        // Load configuration
        if (typeof app !== 'undefined' && app.pager) {
            state.config = app.pager;
            wc.log('Configuration loaded from app.pager', 'success');
            
            // Load defaults if available
            if (app.pagerDefaults) {
                state.debugMode = app.pagerDefaults.debugMode || false;
                wc.log(`Debug mode: ${state.debugMode}`, 'debug');
            }
        } else {
            wc.log('WARNING: app.pager configuration not found!', 'warning');
            state.config = {};
        }
        
        // Wait for container to be in DOM
        wc.log('Waiting for PAGER container to be in DOM...', 'info');
        _waitForContainer((container) => {
            state.container = container;
            
            // Subscribe to events
            _subscribeToEvents();
            
            // Mark as initialized
            state.isInitialized = true;
            wc.log('mtk-pager initialized successfully', 'success');
            
            // Dispatch initialization event
            _dispatchEvent('mtk-pager:initialized', {
                sections: Array.from(state.sections.keys())
            });
            
            // ALWAYS load initial section (first page)
            let initialSection = 'home'; // Default fallback
            
            if (typeof app !== 'undefined' && app.pagerDefaults && app.pagerDefaults.initialSection) {
                initialSection = app.pagerDefaults.initialSection;
            }
            
            wc.log(`Auto-loading first page: ${initialSection}`, 'info');
            
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
                wc.log('ERROR: sectionId is required', 'error');
                return;
            }
            
            if (!state.isInitialized) {
                wc.log('WARNING: Not initialized, initializing now...', 'warning');
                _initialize();
            }
            
            _showSection(sectionId);

	    // FIX FOOTER IF CONTENT IS SHORTER THAN PAGE
	    //checkFooter();
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
    wc.log('mtk-pager component loaded', 'info');
    _initialize();
    
})();
