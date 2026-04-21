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
                subscriptionGrid: document.getElementById('subscriptionGrid')
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

            if (this.elements.progressLabel) {
                this.elements.progressLabel.textContent = progress.label || 'Your progress to date:';
            }

            if (this.elements.courseTitle) {
                this.elements.courseTitle.textContent = progress.courseTitle || 'NALA - Locksmith Course';
            }

            if (this.elements.progressPercentage) {
                this.elements.progressPercentage.textContent = `${Number(progress.percentage || 0)}%`;
            }

            if (this.elements.progressFill) {
                setTimeout(() => {
                    this.elements.progressFill.style.width = `${Number(progress.percentage || 0)}%`;
                }, 100);
            }

            if (this.elements.progressBar) {
                this.elements.progressBar.setAttribute('aria-valuenow', Number(progress.percentage || 0));
                this.elements.progressBar.setAttribute(
                    'aria-label',
                    `Course progress: ${Number(progress.percentage || 0)}% complete`
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

            // If Active, append "Click here to view Business in a Box" to description
            const isActive = (option.price || '').trim().toLowerCase() === 'active' && (option.id || '').includes('business');
            if (isActive) {
                const cta = document.createElement('span');
                cta.className = 'mtk-dashboard__card-cta';
                cta.textContent = ' Click here to view Business in a Box.';
                cta.style.cssText = 'display:block;margin-top:6px;font-size:0.85em;font-style:italic;opacity:0.8;cursor:pointer';
                description.appendChild(cta);
            }

            card.appendChild(icon);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(price);

            if (isActive) {
                // Active cards always clickable — navigate to client
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    wc.log('[dashboard] Active card clicked → client page');
                    window.location.href = 'client/index.html';
                });
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        window.location.href = 'client/index.html';
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
                btn.setAttribute('data-purchase-plan', btnConfig.plan || '');
                btn.addEventListener('click', () => {
                    if (window.wc && wc.buy && typeof wc.buy.handlePurchasePlan === 'function') {
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
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    wc.publish('mtk-dashboard:visible', {
                        timestamp: new Date().toISOString()
                    });
                }
            });
        }

        destroy() {
            this.subscriptions.forEach(unsubscribe => unsubscribe());
            this.subscriptions = [];

            wc.publish('mtk-dashboard:destroyed', {
                timestamp: new Date().toISOString()
            });
        }
    }

    window.myConfig = JSON.parse(JSON.stringify(window.mtkDashboardConfig || {
        user: { fullName: 'User' },
        progress: { label: _t('dashboard.progress.label', 'Your progress to date:'), percentage: 0, courseTitle: _t('dashboard.course.title', 'NALA - Locksmith Course') },
        subscriptions: { title: _t('dashboard.chooseNext', 'Choose your next step:'), options: [] }
    }));

    function getDashboardPurchaseOptions() {
        const user = (window.wc && wc.session && wc.session.user) ? wc.session.user : {};
        const hasPremium = Number(user.has_premium || 0) === 1;
        const hasBusiness = Number(user.has_business_in_a_box || 0) === 1;

        if (hasBusiness) {
            return {
                title: _t('dashboard.activeProducts', 'Your active products'),
                options: [
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
                ]
            };
        }

        if (hasPremium) {
            return {
                title: _t('dashboard.activeProducts', 'Your active products'),
                options: [
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
                ]
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
