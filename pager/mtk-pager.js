// mtk-pager.js
// Standalone page/section manager component
// Uses fetch() only — never jQuery.load() — so script execution is fully controlled
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

        // External scripts already loaded (by src URL) - loaded once via <script> tag
        loadedScriptUrls: new Set(),

        // Stylesheets already injected (by href URL)
        loadedStyleUrls: new Set()
    };

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
                _log(`ERROR: Container not found after ${maxAttempts} attempts`, 'error');
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
    // Load an external script:
    //   First load  → real <script src> tag appended to <head>
    //   Subsequent  → fetch + indirect eval (re-runs init without redeclaring)
    // ─────────────────────────────────────────────────────────────────────────
    const _runExternalScript = (src, useCache) => {
        return new Promise((resolve) => {

            if (useCache && state.loadedScriptUrls.has(src)) {
                _log(`Script cached, skipping: ${src}`, 'debug');
                resolve();
                return;
            }

            if (!useCache && state.loadedScriptUrls.has(src)) {
                // Re-fetch and eval so init code runs again
                _log(`Re-executing via fetch+eval: ${src}`, 'debug');
                fetch(src)
                    .then(r => r.text())
                    .then(code => {
                        try { (0, eval)(code); } catch(e) {
                            _log(`eval error for ${src}: ${e.message}`, 'error');
                        }
                        resolve();
                    })
                    .catch(e => {
                        _log(`fetch error for ${src}: ${e.message}`, 'error');
                        resolve();
                    });
                return;
            }

            // First time — append real <script> tag
            _log(`Loading script: ${src}`, 'debug');
            const el = document.createElement('script');
            el.src = src;
            el.onload  = () => { state.loadedScriptUrls.add(src); resolve(); };
            el.onerror = () => { _log(`Script failed: ${src}`, 'error'); resolve(); };
            document.head.appendChild(el);
        });
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Strip <script> and <link> tags from raw HTML string before setting
    // innerHTML, then process them ourselves in order via _processAssets.
    // This prevents jQuery or the browser from auto-executing scripts.
    // ─────────────────────────────────────────────────────────────────────────
    const _stripAndCollectAssets = (html) => {
        const assets = [];

        // Use a temporary div to parse HTML safely
        const tmp = document.createElement('div');
        tmp.innerHTML = html;

        // Collect and remove <link rel="stylesheet">
        tmp.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            assets.push({ type: 'style', href: link.getAttribute('href') });
            link.parentNode.removeChild(link);
        });

        // Collect and remove <script> tags
        tmp.querySelectorAll('script').forEach(script => {
            const src     = script.getAttribute('src');
            const content = script.innerHTML.trim();
            if (src) {
                assets.push({ type: 'external', src });
            } else if (content) {
                assets.push({ type: 'inline', content });
            }
            script.parentNode.removeChild(script);
        });

        return { cleanHtml: tmp.innerHTML, assets };
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Process collected assets in order, then call callback when done.
    // ─────────────────────────────────────────────────────────────────────────
    const _processAssets = (assets, sectionId, useCache, callback) => {
        if (assets.length === 0) {
            callback();
            return;
        }

        const _next = (index) => {
            if (index >= assets.length) {
                callback();
                return;
            }

            const item = assets[index];

            if (item.type === 'style') {
                if (!item.href || state.loadedStyleUrls.has(item.href)) {
                    _next(index + 1);
                    return;
                }
                const el = document.createElement('link');
                el.rel  = 'stylesheet';
                el.href = item.href;
                document.head.appendChild(el);
                state.loadedStyleUrls.add(item.href);
                _log(`Injected stylesheet: ${item.href}`, 'debug');
                _next(index + 1);

            } else if (item.type === 'external') {
                _runExternalScript(item.src, useCache).then(() => _next(index + 1));

            } else if (item.type === 'inline') {
                _log(`Running inline script for '${sectionId}'`, 'debug');
                try {
                    (0, eval)(item.content);
                } catch(e) {
                    _log(`Inline script error in '${sectionId}': ${e.message}`, 'error');
                    console.error(`[mtk-pager] Inline script error in '${sectionId}':`, e);
                }
                _next(index + 1);
            }
        };

        _next(0);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Fetch HTML, strip scripts/styles from it, set innerHTML, then
    // process assets in order. Uses fetch() only — no jQuery.load().
    // ─────────────────────────────────────────────────────────────────────────
    const _loadContent = (section, sectionId, useCache, callback) => {
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

        const url = state.config[sectionId].url;
        _log(`Loading content from: ${url}`, 'info');

        if (state.container) state.container.classList.add('loading');

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                return response.text();
            })
            .then(html => {
                // Strip scripts/styles BEFORE setting innerHTML
                const { cleanHtml, assets } = _stripAndCollectAssets(html);

                // Set clean HTML (no scripts, no styles)
                section.innerHTML = cleanHtml;

                _log(`Content loaded for: ${sectionId}, processing ${assets.length} assets`, 'info');

                if (state.container) state.container.classList.remove('loading');

                // Now process assets in order
                _processAssets(assets, sectionId, useCache, () => {
                    _log(`Content ready for: ${sectionId}`, 'success');
                    if (callback) callback(true);
                });
            })
            .catch(error => {
                _log(`Failed to load content: ${error.message}`, 'error');
                if (state.container) state.container.classList.remove('loading');
                section.innerHTML = `
                    <div class="mtk-pager-error">
                        <span class="material-icons">error_outline</span>
                        <strong>Load Error:</strong> Failed to load content from "${url}"
                        <br><small>${error.message}</small>
                    </div>
                `;
                if (callback) callback(false);
            });
    };

    const _showSection = (sectionId) => {
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

        const entry    = state.config && state.config[sectionId];
        const useCache = entry ? (entry.cache === 'true' || entry.cache === true) : true;

        let section = state.sections.get(sectionId);

        if (section && useCache) {
            // Cache hit — activate immediately
            _log(`Section '${sectionId}' found in cache, re-activating`, 'debug');
            section.classList.add('active');
            state.currentSection = sectionId;
            window.scrollTo(0, 0);
            _log(`Current section: ${state.currentSection}`, 'success');
            _dispatchEvent('mtk-pager:show', { sectionId, isNew: false });

        } else {
            if (section) {
                _log(`Section '${sectionId}' cache:false, reloading`, 'info');
                section.innerHTML = '';
            } else {
                _log(`Creating new section: ${sectionId}`, 'debug');
                section = _createSection(sectionId);
                state.container.appendChild(section);
                state.sections.set(sectionId, section);
            }

            _loadContent(section, sectionId, useCache, (success) => {
                section.classList.add('active');
                state.currentSection = sectionId;
                window.scrollTo(0, 0);
                _log(`Current section: ${state.currentSection}`, 'success');
                _dispatchEvent('mtk-pager:show', { sectionId, isNew: false });
                if (success) _dispatchEvent('mtk-pager:loaded', { sectionId });
            });
        }
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
                if (e.detail) _log(`Event detail: ${JSON.stringify(e.detail)}`, 'debug');
            });
        });

        _log('Subscribed to mtk-pager events', 'debug');
    };

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
            setTimeout(() => _showSection(initialSection), 50);
        });
    };

    // Public API
    const mtk_pager = {
        show: function(sectionId) {
            if (!sectionId) { _log('ERROR: sectionId is required', 'error'); return; }
            if (!state.isInitialized) { _log('WARNING: Not initialized, initializing now...', 'warning'); _initialize(); }
            _showSection(sectionId);
        },

        remove: function(sectionId) {
            if (!sectionId) { _log('ERROR: sectionId is required', 'error'); return false; }

            const section = state.sections.get(sectionId);
            if (!section) { _log(`Section '${sectionId}' not found`, 'warning'); return false; }

            section.classList.remove('active');
            if (section.parentNode) section.parentNode.removeChild(section);

            state.sections.delete(sectionId);
            if (state.currentSection === sectionId) state.currentSection = null;

            _dispatchEvent('mtk-pager:removed', { sectionId });
            _log(`Section '${sectionId}' removed successfully`, 'success');
            return true;
        },

        getCurrentSection: function() { return state.currentSection; },
        getSections:       function() { return Array.from(state.sections.keys()); },
        isInitialized:     function() { return state.isInitialized; },
        getConfig:         function() { return state.config; }
    };

    window.mtk_pager = mtk_pager;
    _log('mtk-pager component loaded', 'info');
    _initialize();

})();
