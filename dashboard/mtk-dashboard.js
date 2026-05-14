(function () {
    function _t(key, fallback) {
        if (!window.i18n || typeof window.i18n.t !== 'function') return fallback;
        const value = window.i18n.t(key);
        return value === key ? fallback : value;
    }

    function getDisplayPrice(key, fallback) {
        const pricing = window.nalaPricing || {};
        const entry = pricing[key] || {};
        return entry.display || fallback;
    }

    class MTKDashboard {
        constructor(config) {
            this.config = config || {};
            this.elements = {};
            this.subscriptions = [];
            this.dashboardElement = null;
            this.onResetBiabClick = this.onResetBiabClick.bind(this);
            this.onVisibilityChange = this.onVisibilityChange.bind(this);

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init(), { once: true });
            } else {
                this.init();
            }
        }

        init() {
            this.waitForElement('.mtk-dashboard', (element) => {
                this.dashboardElement = element;
                this.cacheElements();
                this.subscribeToEvents();
                this.render();
                this.attachEventListeners();
                this.maybePromptBusinessSetup();

                wc.publish('mtk-dashboard:ready', {
                    timestamp: new Date().toISOString()
                });
            });
        }

        waitForElement(selector, callback) {
            const element = document.querySelector(selector);

            if (element) {
                callback(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const found = document.querySelector(selector);
                if (found) {
                    obs.disconnect();
                    callback(found);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        cacheElements() {
            this.elements = {
                userName: document.getElementById('userName'),
                progressLabel: document.getElementById('progressLabel'),
                courseTitle: document.getElementById('courseTitle'),
                progressPercentage: document.getElementById('progressPercentage'),
                progressFill: document.getElementById('progressFill'),
                progressBar: document.querySelector('.mtk-dashboard__progress-bar'),
                subscriptionsTitle: document.getElementById('subscriptionsTitle'),
                subscriptionGrid: document.getElementById('subscriptionGrid'),
                resetBiabButton: document.getElementById('resetBiabButton')
            };
        }

        subscribeToEvents() {
            this.subscriptions.push(
                wc.subscribe('mtk-dashboard:config-update', this.onMessage.bind(this))
            );

            this.subscriptions.push(
                wc.subscribe('mtk-dashboard:progress-update', this.onMessage.bind(this))
            );

            this.subscriptions.push(
                wc.subscribe('mtk-dashboard:user-update', this.onMessage.bind(this))
            );

            this.subscriptions.push(
                wc.subscribe('mtk-dashboard:subscription-update', this.onMessage.bind(this))
            );
        }

        onMessage(msg) {
            const channel = msg && msg.channel ? msg.channel : '';
            const payload = msg && msg.payload ? msg.payload : {};

            switch (channel) {
                case 'mtk-dashboard:config-update':
                    this.config = payload;
                    this.render();
                    break;

                case 'mtk-dashboard:progress-update':
                    this.updateProgress(payload);
                    break;

                case 'mtk-dashboard:user-update':
                    this.updateUser(payload);
                    break;

                case 'mtk-dashboard:subscription-update':
                    this.updateSubscriptions(payload);
                    break;

                default:
                    break;
            }
        }

        render() {
            this.renderUserInfo();
            this.renderProgress();
            this.renderSubscriptions();

            wc.publish('mtk-dashboard:rendered', {
                timestamp: new Date().toISOString()
            });
        }

        renderUserInfo() {
            if (this.elements.userName) {
                this.elements.userName.textContent = this.config.user?.fullName || 'User';
            }
        }

        renderProgress() {
            const progress = this.config.progress || {};
            const target = Number(progress.percentage || 0);

            if (this.elements.progressLabel) {
                this.elements.progressLabel.textContent = progress.label || 'Your progress to date:';
            }

            if (this.elements.courseTitle) {
                this.elements.courseTitle.textContent = progress.courseTitle || 'NALA locksmith course';
            }

            if (this.elements.progressFill) {
                this.elements.progressFill.style.width = '0%';
                setTimeout(() => {
                    this.elements.progressFill.style.width = `${target}%`;
                }, 80);
            }

            if (this.elements.progressPercentage) {
                this.elements.progressPercentage.textContent = '0%';
                const duration = 2200;
                const startTime = performance.now();
                const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

                const tick = (now) => {
                    const progressValue = Math.min((now - startTime) / duration, 1);
                    const current = target * easeOutCubic(progressValue);
                    this.elements.progressPercentage.textContent = `${Math.round(current)}%`;
                    if (progressValue < 1) requestAnimationFrame(tick);
                };

                requestAnimationFrame(tick);
            }

            if (this.elements.progressBar) {
                this.elements.progressBar.setAttribute('aria-valuenow', target);
                this.elements.progressBar.setAttribute(
                    'aria-label',
                    `Course progress: ${target}% complete`
                );
            }
        }

        renderSubscriptions() {
            const subscriptions = this.config.subscriptions || { title: '', options: [] };

            if (this.elements.subscriptionsTitle) {
                this.elements.subscriptionsTitle.textContent = subscriptions.title || '';
            }

            if (this.elements.subscriptionGrid) {
                this.elements.subscriptionGrid.innerHTML = '';

                const options = Array.isArray(subscriptions.options) ? subscriptions.options : [];
                options.forEach((option) => {
                    const card = this.createSubscriptionCard(option);
                    this.elements.subscriptionGrid.appendChild(card);
                });
            }

            if (window.wc && wc.buy && typeof wc.buy.syncPurchaseButtons === 'function') {
                wc.buy.syncPurchaseButtons();
            }
        }

        navigateToBusinessInABox() {
            wc.log("[dashboard] BIAB card clicked → #biab");

            if (window.location.pathname !== "/repo_deploy/") {
                window.location.href = "/repo_deploy/#biab";
                return;
            }

            if (window.wc && wc.pages && typeof wc.pages.show === "function") {
                window.history.pushState({ mtkPage: "biab" }, "", "#biab");
                wc.pages.show("biab");
                return;
            }

            window.location.hash = "biab";
            window.dispatchEvent(new HashChangeEvent("hashchange"));
        }

        createSubscriptionCard(option) {
            if (option && option.variant === 'message') {
                return this.createMessageCard(option);
            }

            const card = document.createElement('div');
            card.className = 'mtk-dashboard__subscription-card';
            card.setAttribute('role', option.clickable === false ? 'group' : 'button');
            card.setAttribute('tabindex', option.clickable === false ? '-1' : '0');
            card.setAttribute('aria-label', `${option.title || ''}${option.price ? ', ' + option.price : ''}`);
            card.dataset.subscriptionId = option.id || '';

            const icon = document.createElement('div');
            icon.className = 'mtk-dashboard__card-icon';
            icon.innerHTML = `<span class="material-icons" aria-hidden="true">${option.icon || 'work'}</span>`;

            const title = document.createElement('h3');
            title.className = 'mtk-dashboard__card-title';
            title.textContent = option.title || '';

            const description = document.createElement('p');
            description.className = 'mtk-dashboard__card-description';
            description.textContent = option.description || '';

            const price = document.createElement('p');
            price.className = 'mtk-dashboard__card-price';
            price.textContent = option.price || '';

            const isActive = (option.price || '').trim().toLowerCase() === 'active' && (option.id || '').includes('business');
            if (isActive) {
                const cta = document.createElement('span');
                cta.className = 'mtk-dashboard__card-cta';
                cta.textContent = ' ' + _t('dashboard.option.business.viewCta', 'Click here to view Business in a Box.');
                cta.style.cssText = 'display:block;margin-top:6px;font-size:0.85em;font-style:italic;opacity:0.8;cursor:pointer';
                description.appendChild(cta);
            }

            card.appendChild(icon);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(price);

            if ((option.id || '') === 'active-business-in-a-box') {
                const tools = this.createBusinessToolActions();
                card.appendChild(tools);
            }

            if (isActive) {
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    wc.log('[dashboard] Active card clicked → BIAB page');
                    this.navigateToBusinessInABox();
                });
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.navigateToBusinessInABox();
                    }
                });
            } else if (option.clickable !== false) {
                card.addEventListener('click', () => this.handleSubscriptionClick(option));
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.handleSubscriptionClick(option);
                    }
                });
            } else {
                card.classList.add('mtk-dashboard__subscription-card--static');
            }

            return card;
        }

        createBusinessToolActions() {
            const actions = document.createElement('div');
            actions.className = 'mtk-dashboard__business-tools';

            const tools = [
                { label: 'Default Offerings', icon: 'list_alt' },
                { label: 'Website Builder', icon: 'language' },
                { label: 'Logo Generator', icon: 'auto_awesome' },
                { label: 'Business Card', icon: 'badge' },
                { label: 'Invoices', icon: 'receipt_long' },
                { label: 'Customer Reviews', icon: 'reviews' }
            ];

            tools.forEach((tool) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'mtk-dashboard__business-tool';
                button.setAttribute('tabindex', '-1');
                button.setAttribute('aria-hidden', 'true');
                button.innerHTML = `<span class="material-icons" aria-hidden="true">${tool.icon}</span><span>${tool.label}</span>`;
                actions.appendChild(button);
            });

            return actions;
        }

        createMessageCard(option) {
            const card = document.createElement('div');
            card.className = 'mtk-dashboard__subscription-card mtk-dashboard__subscription-card--static mtk-dashboard__message-card';

            const icon = document.createElement('div');
            icon.className = 'mtk-dashboard__message-icon';
            icon.innerHTML = `<span class="material-icons" aria-hidden="true">${option.icon || 'work'}</span>`;

            const title = document.createElement('h3');
            title.className = 'mtk-dashboard__message-title';
            title.textContent = option.title || '';

            const description = document.createElement('p');
            description.className = 'mtk-dashboard__message-description';
            description.textContent = option.description || '';

            const actions = document.createElement('div');
            actions.className = 'mtk-dashboard__message-actions';

            const buttons = Array.isArray(option.buttons) ? option.buttons : [];
            buttons.forEach((btnConfig) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = btnConfig.className || 'btn btn-primary';
                btn.textContent = btnConfig.label || 'Purchase';
                if (btnConfig.plan) {
                    btn.setAttribute('data-purchase-plan', btnConfig.plan || '');
                }
                btn.addEventListener('click', () => {
                    if (btnConfig.href) {
                        window.open(btnConfig.href, btnConfig.target || '_blank', 'noopener');
                    } else if (window.wc && wc.buy && typeof wc.buy.handlePurchasePlan === 'function') {
                        wc.buy.handlePurchasePlan(btnConfig.plan || '');
                    }
                });
                actions.appendChild(btn);
            });

            card.appendChild(icon);
            card.appendChild(title);
            card.appendChild(description);
            if (buttons.length) {
                card.appendChild(actions);
            }

            return card;
        }

        handleSubscriptionClick(option) {
            const msg = {
                subscriptionId: option.id,
                title: option.title,
                price: option.price,
                timestamp: new Date().toISOString()
            };

            wc.publish('mtk-dashboard:subscription-clicked', msg);
        }

        updateProgress(data) {
            this.config.progress = this.config.progress || {};

            if (data.percentage !== undefined) {
                this.config.progress.percentage = data.percentage;
            }

            if (data.courseTitle) {
                this.config.progress.courseTitle = data.courseTitle;
            }

            this.renderProgress();

            wc.publish('mtk-dashboard:progress-updated', {
                percentage: this.config.progress.percentage,
                timestamp: new Date().toISOString()
            });
        }

        updateUser(data) {
            this.config.user = this.config.user || {};

            if (data.fullName) {
                this.config.user.fullName = data.fullName;
                this.renderUserInfo();

                wc.publish('mtk-dashboard:user-updated', {
                    fullName: data.fullName,
                    timestamp: new Date().toISOString()
                });
            }
        }

        updateSubscriptions(data) {
            this.config.subscriptions = this.config.subscriptions || { title: '', options: [] };

            if (data.options) {
                this.config.subscriptions.options = data.options;
            }

            if (data.title) {
                this.config.subscriptions.title = data.title;
            }

            this.renderSubscriptions();

            wc.publish('mtk-dashboard:subscriptions-updated', {
                optionsCount: this.config.subscriptions.options.length,
                timestamp: new Date().toISOString()
            });
        }

        attachEventListeners() {
            if (this.elements.resetBiabButton) {
                const isTestMode = String(window.wcENV || '').toLowerCase() === 'dev' || String(window.wcENV || '').toLowerCase() === 'test';
                this.elements.resetBiabButton.hidden = !isTestMode;
                if (this.elements.resetBiabButton.__mtkDashboardResetHandler) {
                    this.elements.resetBiabButton.removeEventListener('click', this.elements.resetBiabButton.__mtkDashboardResetHandler);
                }
                this.elements.resetBiabButton.__mtkDashboardResetHandler = this.onResetBiabClick;
                this.elements.resetBiabButton.addEventListener('click', this.onResetBiabClick);
            }

            if (document.__mtkDashboardVisibilityHandler) {
                document.removeEventListener('visibilitychange', document.__mtkDashboardVisibilityHandler);
            }
            document.__mtkDashboardVisibilityHandler = this.onVisibilityChange;
            document.addEventListener('visibilitychange', this.onVisibilityChange);
        }

        onResetBiabClick(event) {
            if (event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
            this.resetBusinessInABox();
        }

        onVisibilityChange() {
            if (!document.hidden) {
                wc.publish('mtk-dashboard:visible', {
                    timestamp: new Date().toISOString()
                });
            }
        }

        resetBusinessInABox() {
            if (this.resetBiabInProgress) return;

            this.resetBiabInProgress = true;
            if (!window.confirm('Reset Business in a Box to a new-purchase state for this test account? This clears local setup data, the saved logo, and the selected business card.')) {
                this.resetBiabInProgress = false;
                return;
            }

            const uid = this.businessPageId();
            try {
                window.localStorage.removeItem('nala_profile_settings');
                window.localStorage.removeItem('nala_biab_logo_' + uid);
                window.localStorage.removeItem('nala_biab_ordered_card_' + uid);
                window.localStorage.removeItem('nala_biab_setup_prompt_seen_' + uid);
            } catch (err) {}

            if (window.wc && typeof wc.publish === 'function') {
                wc.publish('mtk-dashboard:reset-biab', { nalaUID: uid });
            }

            if (window.MTKMsgs && typeof MTKMsgs.show === 'function') {
                MTKMsgs.show({
                    type: 'success',
                    icon: 'restart_alt',
                    message: 'Business in a Box was reset for this test account.',
                    closable: true,
                    timer: 8
                });
            }

            window.setTimeout(() => {
                this.resetBiabInProgress = false;
            }, 500);
        }

        maybePromptBusinessSetup() {
            if (window.__nalaBiabPromptShown) return;
            const user = (window.wc && wc.session && wc.session.user) ? wc.session.user : {};
            if (Number(user.has_business_in_a_box || 0) !== 1) return;
            if (this.isBusinessSetupComplete()) return;

            window.__nalaBiabPromptShown = true;
            const message = _t(
                'dashboard.biabSetupPrompt',
                'Your Business in a Box setup still needs a few details before your website and tools are ready.'
            );

            if (window.mtkDialog && typeof window.mtkDialog.open === 'function') {
                window.mtkDialog.open({
                    id: 'biab-setup-needed',
                    title: _t('dashboard.biabSetupTitle', 'Complete Business in a Box setup'),
                    message: message,
                    icon: 'work',
                    iconColor: '#a98212',
                    closeOnBackdrop: true,
                    closeOnEscape: true,
                    buttons: [
                        {
                            label: _t('dashboard.biabSetupButton', 'Continue setup'),
                            action: 'biab-setup',
                            classes: 'btn btn-primary'
                        }
                    ]
                });
                let token = null;
                const handler = function(msg, data) {
                    if (data && data.action === 'biab-setup') {
                        if (token) PubSub.unsubscribe(token);
                        if (window.mtkDialog && typeof window.mtkDialog.close === 'function') {
                            window.mtkDialog.close();
                        }
                        window.__mtkDashboardInstance.navigateToBusinessInABox();
                    }
                };
                token = PubSub.subscribe('mtk-dialog:action', handler);
                return;
            }

            if (window.MTKMsgs && typeof MTKMsgs.show === 'function') {
                MTKMsgs.show({
                    type: 'warning',
                    icon: 'work',
                    message: message + ' Open Business in a Box to continue setup.',
                    closable: true,
                    timer: 12
                });
            }
        }

        isBusinessSetupComplete() {
            let settings = {};
            let cardOrder = null;
            const uid = this.businessPageId();
            try {
                settings = JSON.parse(window.localStorage.getItem('nala_profile_settings') || '{}') || {};
                cardOrder = JSON.parse(window.localStorage.getItem('nala_biab_ordered_card_' + uid) || 'null');
            } catch (err) {}

            const business = settings.business || {};
            const services = settings.services || {};
            const requiredValues = [
                business.customerFacingBusinessName,
                business.businessPhone,
                business.businessEmail,
                services.serviceArea
            ];

            return requiredValues.every((value) => String(value || '').trim()) && !!cardOrder;
        }

        businessPageId() {
            const user = (window.wc && wc.session && wc.session.user) ? wc.session.user : {};
            return String(
                (window.wc && wc.session && wc.session.nalaUID) ||
                user.nalaUID ||
                user.id ||
                user.user_id ||
                user.email ||
                'demo'
            ).replace(/[^a-zA-Z0-9_-]/g, '');
        }

        destroy() {
            this.subscriptions.forEach(unsubscribe => unsubscribe());
            this.subscriptions = [];

            if (this.elements.resetBiabButton && this.elements.resetBiabButton.__mtkDashboardResetHandler === this.onResetBiabClick) {
                this.elements.resetBiabButton.removeEventListener('click', this.onResetBiabClick);
                delete this.elements.resetBiabButton.__mtkDashboardResetHandler;
            }

            if (document.__mtkDashboardVisibilityHandler === this.onVisibilityChange) {
                document.removeEventListener('visibilitychange', this.onVisibilityChange);
                delete document.__mtkDashboardVisibilityHandler;
            }

            wc.publish('mtk-dashboard:destroyed', {
                timestamp: new Date().toISOString()
            });
        }
    }

    window.myConfig = JSON.parse(JSON.stringify(window.mtkDashboardConfig || {
        user: { fullName: 'User' },
        progress: { label: _t('dashboard.progress.label', 'Your progress to date:'), percentage: 0, courseTitle: _t('dashboard.course.title', 'NALA locksmith course') },
        subscriptions: { title: _t('dashboard.chooseNext', 'Choose your next step:'), options: [] }
    }));

    function getDashboardPurchaseOptions() {
        const user = (window.wc && wc.session && wc.session.user) ? wc.session.user : {};
        const giftTracking = (window.wc && wc.session && (wc.session.gift_tracking || user.gift_tracking))
            ? (wc.session.gift_tracking || user.gift_tracking)
            : null;
        const hasPremium = Number(user.has_premium || 0) === 1;
        const hasBusiness = Number(user.has_business_in_a_box || 0) === 1;
        const giftTrackingCard = (giftTracking && giftTracking.available)
            ? {
                id: 'lockout-kit-tracking',
                variant: 'message',
                icon: giftTracking.status === 'shipped' ? 'local_shipping' : 'inventory_2',
                title: _t('dashboard.gift.title', 'Track your lockout kit'),
                description: giftTracking.message || _t('dashboard.gift.description', 'View the status of your complimentary lockout kit order.'),
                buttons: [
                    giftTracking.tracking_url ? {
                        label: _t('dashboard.gift.trackShipment', 'Track Shipment'),
                        href: giftTracking.tracking_url,
                        className: 'btn btn-primary'
                    } : null,
                    giftTracking.order_status_url ? {
                        label: _t('dashboard.gift.viewOrder', 'View Order Status'),
                        href: giftTracking.order_status_url,
                        className: giftTracking.tracking_url ? 'btn btn-outline-primary' : 'btn btn-primary'
                    } : null
                ].filter(Boolean)
            }
            : (hasPremium || hasBusiness)
                ? {
                    id: 'lockout-kit-tracking-pending',
                    variant: 'message',
                    icon: 'inventory_2',
                    title: _t('dashboard.gift.title', 'Track your lockout kit'),
                    description: _t(
                        'dashboard.gift.pending',
                        'Your complimentary lockout kit is tied to your Premium purchase. Tracking will appear here after the order is created.'
                    ),
                    buttons: []
                }
                : null;

        if (hasBusiness) {
            const options = [
                {
                    id: 'active-premium',
                    icon: 'school',
                    title: _t('dashboard.option.premium.title', 'Premium'),
                    description: _t('dashboard.option.premium.active', 'Your Premium locksmith training access is active.'),
                    price: _t('dashboard.price.active', 'Active'),
                    clickable: false
                },
                {
                    id: 'active-business-in-a-box',
                    icon: 'work',
                    title: _t('dashboard.option.business.title', 'Business in a Box'),
                    description: _t('dashboard.option.business.active', 'Your Business in a Box package is active.'),
                    price: _t('dashboard.price.active', 'Active'),
                    clickable: false
                }
            ];
            if (giftTrackingCard) options.push(giftTrackingCard);

            return {
                title: _t('dashboard.activeProducts', 'Your active products'),
                options: options
            };
        }

        if (hasPremium) {
            const options = [
                {
                    id: 'active-premium',
                    icon: 'school',
                    title: _t('dashboard.option.premium.title', 'Premium'),
                    description: _t('dashboard.option.premium.active', 'Your Premium locksmith training access is active.'),
                    price: _t('dashboard.price.active', 'Active'),
                    clickable: false
                },
                {
                    id: 'business-in-a-box-message',
                    variant: 'message',
                    icon: 'storefront',
                    title: _t('dashboard.option.business.title', 'Business in a Box'),
                    description: _t('dashboard.option.business.purchaseOnly', 'To purchase Business in a Box services, click here.'),
                    buttons: [
                        {
                            plan: 'business',
                            label: _t('dashboard.option.business.buttonOnly', 'Purchase Business in a Box'),
                            className: 'btn btn-primary'
                        }
                    ]
                }
            ];
            if (giftTrackingCard) options.push(giftTrackingCard);

            return {
                title: _t('dashboard.activeProducts', 'Your active products'),
                options: options
            };
        }

        return {
            title: _t('dashboard.chooseNext', 'Choose your next step:'),
            options: [
                {
                    id: 'business-in-a-box-message',
                    variant: 'message',
                    icon: 'storefront',
                    title: _t('dashboard.option.business.title', 'Business in a Box'),
                    description: _t('dashboard.option.business.purchaseWithPremium', 'To gain access to the full course and Business in a Box services, click here.'),
                    buttons: [
                        {
                            plan: 'premium',
                            label: _t('dashboard.option.premium.button', 'Purchase Premium'),
                            className: 'btn btn-outline-primary'
                        },
                        {
                            plan: 'business',
                            label: _t('dashboard.option.business.buttonBundle', 'Purchase Premium + Business in a Box'),
                            className: 'btn btn-primary'
                        }
                    ]
                }
            ]
        };
    }

    function buildDashboardConfig() {
        const session = window.wc && wc.session ? wc.session : {};
        const user = session.user || {};
        const dashboard = session.dashboard || {};

        try {
            window.myConfig.user.fullName = user.name || 'User';
            window.myConfig.progress.percentage = Number(dashboard.progress || 0);
            const subscriptions = getDashboardPurchaseOptions();
            window.myConfig.subscriptions.title = subscriptions.title;
            window.myConfig.subscriptions.options = subscriptions.options;
        } catch (e) {
            console.error('Dashboard init error:', e);
        }

        return window.myConfig;
    }

    function initializeDashboard(config) {
        const finalConfig = config || buildDashboardConfig();

        if (window.__mtkDashboardInstance && typeof window.__mtkDashboardInstance.destroy === 'function') {
            try {
                window.__mtkDashboardInstance.destroy();
            } catch (e) {}
        }

        window.__mtkDashboardInstance = new MTKDashboard(finalConfig);
        return window.__mtkDashboardInstance;
    }

    window.MTKDashboard = MTKDashboard;
    window.initializeDashboard = initializeDashboard;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeDashboard(buildDashboardConfig());
        }, { once: true });
    } else {
        initializeDashboard(buildDashboardConfig());
    }

    document.addEventListener('nala-pricing:updated', () => {
        if (window.__mtkDashboardInstance && typeof window.__mtkDashboardInstance.updateSubscriptions === 'function') {
            const subscriptions = getDashboardPurchaseOptions();
            window.__mtkDashboardInstance.updateSubscriptions(subscriptions);
        }
    });
})();
