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
        debugMode: false,

        // Tracks which external asset src/href URLs have already been injected
        loadedAssetUrls: new Set(),

        // Tracks injected asset DOM elements per section (for removal on reload)
        // { sectionId: [ DOMElement, ... ] }
        injectedAssets: {}
    };

    // Private methods
    const _log = (message, type = 'info') => {
        if (!state.debugMode && type === 'debug') return;

        const prefix = '[mtk-pager]';
        const styles = {
            info:    'color: #2196F3',
            success: 'color: #4CAF50',
            error:   'color: #F44336',
            warning: 'color: #FF9800',
            debug:   'color: #9E9E9E'
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

    const _createSection = (sectionId) => {
        const section = document.createElement('PAGER-SECTION');
        section.id = `mtk-pager-${sectionId}`;
        section.className = 'mtk-pager-section';
        section.setAttribute('data-section-id', sectionId);

        _log(`Section created: ${sectionId}`, 'debug');
        return section;
    };

    const _hideAllSections = () => {
        const allSections = state.container.querySelectorAll('PAGER-SECTION');
        allSections.forEach((section) => {
            if (section.classList.contains('active')) {
                section.classList.remove('active');
                const sectionId = section.getAttribute('data-section-id');
                _log(`Section hidden: ${sectionId}`, 'debug');
                _dispatchEvent('mtk-pager:hide', { sectionId });
            }
        });

        state.sections.forEach((section) => {
            if (section.classList.contains('active')) {
                section.classList.remove('active');
            }
        });
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Execute an inline script safely using Function() so it runs in its own
    // scope. This means class/const/let declarations inside it do NOT land in
    // the global scope and cannot cause "already been declared" errors on
    // subsequent reloads.
    // ─────────────────────────────────────────────────────────────────────────
    const _executeInlineScript = (content, sectionId) => {
        try {
            // Using Function() runs the code in a fresh function scope,
            // not the top-level global scope — so redeclarations are safe.
            // eslint-disable-next-line no-new-func
            const fn = new Function(content);
            fn();
            _log(`Inline script executed for '${sectionId}'`, 'debug');
        } catch (e) {
            _log(`Inline script error in '${sectionId}': ${e.message}`, 'error');
            console.error(`[mtk-pager] Inline script error in section '${sectionId}':`, e);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Load an external script by appending a <script src="..."> to <head>.
    // Returns a Promise that resolves when loaded.
    // ─────────────────────────────────────────────────────────────────────────
    const _loadExternalScript = (src, sectionId) => {
        return new Promise((resolve) => {
            if (state.loadedAssetUrls.has(src)) {
                _log(`External script already loaded, skipping: ${src}`, 'debug');
                resolve(null);
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.setAttribute('data-mtk-pager-section', sectionId);

            script.onload = () => {
                _log(`External script loaded for '${sectionId}': ${src}`, 'debug');
                state.loadedAssetUrls.add(src);
                resolve(script);
            };

            script.onerror = () => {
                _log(`External script failed to load for '${sectionId}': ${src}`, 'error');
                resolve(null);
            };

            document.head.appendChild(script);
        });
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Inject a stylesheet into <head>, skipping duplicates.
    // ─────────────────────────────────────────────────────────────────────────
    const _loadExternalStyle = (href, originalEl, sectionId) => {
        if (state.loadedAssetUrls.has(href)) {
            _log(`Stylesheet already loaded, skipping: ${href}`, 'debug');
            return null;
        }

        const clone = originalEl.cloneNode(true);
        clone.setAttribute('data-mtk-pager-section', sectionId);
        document.head.appendChild(clone);
        state.loadedAssetUrls.add(href);
        _log(`Injected stylesheet for '${sectionId}': ${href}`, 'debug');
        return clone;
    };

    // ─────────────────────────────────────────────────────────────────────────
    // After content is loaded into a section, process all <script> and <link>
    // tags found inside it:
    //   - External scripts  → append to <head> once, track element
    //   - Inline scripts    → execute via Function() scope, never re-append
    //   - Stylesheets       → append to <head> once, track element
    // ─────────────────────────────────────────────────────────────────────────
    const _registerAndMoveAssets = async (section, sectionId) => {
        const assets = [];

        // ── Stylesheets ──────────────────────────────────────────────────────
        const links = Array.from(section.querySelectorAll('link[rel="stylesheet"]'));
        links.forEach(link => {
            const href = link.getAttribute('href');
            link.parentNode.removeChild(link);

            if (!href) return;

            const el = _loadExternalStyle(href, link, sectionId);
            if (el) assets.push(el);
        });

        // ── Scripts ──────────────────────────────────────────────────────────
        const scripts = Array.from(section.querySelectorAll('script'));

        for (const script of scripts) {
            const src     = script.getAttribute('src');
            const content = script.innerHTML.trim();

            // Remove from section HTML immediately
            script.parentNode.removeChild(script);

            if (src) {
                // External script — load once, track the element
                const el = await _loadExternalScript(src, sectionId);
                if (el) assets.push(el);
            } else if (content) {
                // Inline script — execute in isolated Function() scope
                // We do NOT append to DOM, so no redeclaration is possible
                _executeInlineScript(content, sectionId);
                // Nothing to track for removal (never appended to DOM)
            }
        }

        state.injectedAssets[sectionId] = assets;
        _log(`Assets processed for '${sectionId}': ${assets.length} tracked`, 'debug');
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Remove tracked external assets for a section and clear them from the
    // URL registry so they reload fresh next time.
    // Inline scripts are never tracked here (they run in Function scope).
    // ─────────────────────────────────────────────────────────────────────────
    const _removeInjectedAssets = (sectionId) => {
        const assets = state.injectedAssets[sectionId];
        if (!assets || assets.length === 0) return;

        assets.forEach(asset => {
            if (asset && asset.parentNode) {
                const key = asset.getAttribute('src') || asset.getAttribute('href');
                if (key) state.loadedAssetUrls.delete(key);
                asset.parentNode.removeChild(asset);
                _log(`Removed asset for '${sectionId}': ${key}`, 'debug');
            }
        });

        delete state.injectedAssets[sectionId];
        _log(`All injected assets removed for section '${sectionId}'`, 'info');
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

        const entry = state.config[sectionId];
        const url   = entry.url;

        _log(`Loading content from: ${url}`, 'info');

        if (state.container) {
            state.container.classList.add('loading');
        }

        const _onLoaded = async (success) => {
            if (state.container) {
                state.container.classList.remove('loading');
            }
            if (success) {
                await _registerAndMoveAssets(section, sectionId);
            }
            if (callback) callback(success);
        };

        // Try jQuery first (if available)
        if (typeof jQuery !== 'undefined' && jQuery.fn.load) {
            _log('Using jQuery to load content', 'debug');

            jQuery(section).load(url, function(response, status, xhr) {
                if (status === 'error') {
                    _log(`Failed to load content: ${xhr.status} ${xhr.statusText}`, 'error');
                    section.innerHTML = `
                        <div class="mtk-pager-error">
                            <span class="material-icons">error_outline</span>
                            <strong>Load Error:</strong> Failed to load content from "${url}"
                            <br><small>${xhr.status} ${xhr.statusText}</small>
                        </div>
                    `;
                    _onLoaded(false);
                } else {
                    _log(`Content loaded successfully for: ${sectionId}`, 'success');
                    _onLoaded(true);
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
                    section.innerHTML = html;
                    _log(`Content loaded successfully for: ${sectionId}`, 'success');
                    _onLoaded(true);
                })
                .catch(error => {
                    _log(`Failed to load content: ${error.message}`, 'error');
                    section.innerHTML = `
                        <div class="mtk-pager-error">
                            <span class="material-icons">error_outline</span>
                            <strong>Load Error:</strong> Failed to load content from "${url}"
                            <br><small>${error.message}</small>
                        </div>
                    `;
                    _onLoaded(false);
                });
        }
    };

    const _showSection = (sectionId) => {
        // REMOVE THE SECTION FROM CACHE AND RELOAD
        if (sectionId === 'quiz') {
            mtk_pager.remove('quiz');
            window.MtkQuiz = null;
        }

        if (!state.container) {
            _log('Cannot show section: Container not initialized', 'error');
            return;
        }

        _log(`Attempting to show section: ${sectionId}`, 'info');

        _hideAllSections();

        let section = state.sections.get(sectionId);

        if (section) {
            const entry    = state.config && state.config[sectionId];
            const useCache = entry ? (entry.cache === 'true' || entry.cache === true) : true;

            if (useCache) {
                _log(`Section '${sectionId}' found in cache, re-activating`, 'debug');
                section.classList.add('active');
                state.currentSection = sectionId;
                _dispatchEvent('mtk-pager:show', { sectionId, isNew: false });
            } else {
                // cache:false — remove old assets and reload fresh
                _log(`Section '${sectionId}' cache disabled, removing old assets and reloading`, 'info');
                _removeInjectedAssets(sectionId);
                section.innerHTML = '';

                _loadContent(section, sectionId, (success) => {
                    if (success) {
                        _dispatchEvent('mtk-pager:loaded', { sectionId });
                    }
                });

                section.classList.add('active');
                state.currentSection = sectionId;
                _dispatchEvent('mtk-pager:show', { sectionId, isNew: false });
            }
        } else {
            _log(`Creating new section: ${sectionId}`, 'debug');
            section = _createSection(sectionId);

            _loadContent(section, sectionId, (success) => {
                if (success) {
                    _dispatchEvent('mtk-pager:loaded', { sectionId });
                }
            });

            state.container.appendChild(section);
            state.sections.set(sectionId, section);

            section.classList.add('active');
            state.currentSection = sectionId;
            _dispatchEvent('mtk-pager:show', { sectionId, isNew: true });
        }

        window.scrollTo(0, 0);
        _log(`Current section: ${state.currentSection}`, 'success');
    };

    const _subscribeToEvents = () => {
        const eventNames = [
            'mtk-pager:show',
            'mtk-pager:loaded',
            'mtk-pager:hide',
            'mtk-pager:removed',
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

    // ─────────────────────────────────────────────────────────────────────────
    // Parse app.pager — supports BOTH formats:
    //   NEW: Array of { page, url, cache, label }
    //   OLD: Plain object { pageName: url }
    // ─────────────────────────────────────────────────────────────────────────
    const _parseConfig = (raw) => {
        const map = {};

        if (Array.isArray(raw)) {
            raw.forEach(entry => {
                if (entry.page) {
                    map[entry.page] = {
                        url:   entry.url   || '',
                        cache: entry.cache !== undefined ? entry.cache : 'true',
                        label: entry.label || entry.page
                    };
                }
            });
            _log(`Config parsed from array format (${raw.length} pages)`, 'success');
        } else if (typeof raw === 'object' && raw !== null) {
            Object.keys(raw).forEach(page => {
                map[page] = {
                    url:   raw[page],
                    cache: app.pagerCache && app.pagerCache[page] !== undefined
                           ? String(app.pagerCache[page])
                           : 'true',
                    label: page
                };
            });
            _log(`Config parsed from legacy object format (${Object.keys(raw).length} pages)`, 'success');
        } else {
            _log('WARNING: app.pager config is in an unrecognised format', 'warning');
        }

        return map;
    };

    const _initialize = () => {
        if (state.isInitialized) {
            _log('Already initialized', 'warning');
            return;
        }

        _log('Initializing mtk-pager...', 'info');

        if (typeof app !== 'undefined' && app.pager) {
            state.config = _parseConfig(app.pager);
            _log('Configuration loaded from app.pager', 'success');

            if (app.pagerDefaults) {
                state.debugMode = app.pagerDefaults.debugMode || false;
                _log(`Debug mode: ${state.debugMode}`, 'debug');
            }
        } else {
            _log('WARNING: app.pager configuration not found!', 'warning');
            state.config = {};
        }

        _log('Waiting for PAGER container to be in DOM...', 'info');
        _waitForContainer((container) => {
            state.container = container;

            _subscribeToEvents();

            state.isInitialized = true;
            _log('mtk-pager initialized successfully', 'success');

            _dispatchEvent('mtk-pager:initialized', {
                sections: Array.from(state.sections.keys())
            });

            let initialSection = 'home';

            if (typeof app !== 'undefined' && app.pagerDefaults && app.pagerDefaults.initialSection) {
                initialSection = app.pagerDefaults.initialSection;
            }

            _log(`Auto-loading first page: ${initialSection}`, 'info');

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

        remove: function(sectionId) {
            if (!sectionId) {
                _log('ERROR: sectionId is required', 'error');
                return false;
            }

            const section = state.sections.get(sectionId);

            if (!section) {
                _log(`Section '${sectionId}' not found, nothing to remove`, 'warning');
                return false;
            }

            // Clean up injected assets before removing
            _removeInjectedAssets(sectionId);

            section.classList.remove('active');
            _log(`Section '${sectionId}' hidden`, 'debug');

            if (section.parentNode) {
                section.parentNode.removeChild(section);
                _log(`Section '${sectionId}' removed from DOM`, 'info');
            }

            state.sections.delete(sectionId);
            _log(`Section '${sectionId}' removed from state`, 'info');

            if (state.currentSection === sectionId) {
                state.currentSection = null;
                _log('Current section cleared', 'debug');
            }

            _dispatchEvent('mtk-pager:removed', { sectionId });
            _log(`Section '${sectionId}' removed successfully`, 'success');
            return true;
        },

        getCurrentSection: function() {
            return state.currentSection;
        },

        getSections: function() {
            return Array.from(state.sections.keys());
        },

        isInitialized: function() {
            return state.isInitialized;
        },

        getConfig: function() {
            return state.config;
        }
    };

    // Expose globally if not already defined
    if (typeof window.mtk_pager === 'undefined') {
	window.mtk_pager = mtk_pager;
    }

    // Auto-initialize immediately
    _log('mtk-pager component loaded', 'info');
    _initialize();

})();
