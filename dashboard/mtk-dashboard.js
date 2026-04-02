(function () {
    function _t(key, fallback) {
        if (!window.i18n || typeof window.i18n.t !== 'function') return fallback;
        const value = window.i18n.t(key);
        return value === key ? fallback : value;
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
        }

        createSubscriptionCard(option) {
            const card = document.createElement('div');
            card.className = 'mtk-dashboard__subscription-card';
            card.setAttribute('role', option.clickable === false ? 'group' : 'button');
            card.setAttribute('tabindex', option.clickable === false ? '-1' : '0');
            card.setAttribute('aria-label', `${option.title || ''}${option.price ? ', ' + option.price : ''}`);
            card.dataset.subscriptionId = option.id || '';

            const icon = document.createElement('div');
            icon.className = 'mtk-dashboard__card-icon';
            icon.innerHTML = this.resolveSubscriptionIcon(option.icon);
            icon.style.setProperty('background', 'linear-gradient(135deg, #8a6920 0%, #b38a2e 100%)', 'important');
            icon.style.setProperty('background-color', '#8a6920', 'important');
            icon.style.setProperty('border', '2px solid rgba(17, 17, 17, 0.18)', 'important');
            icon.style.setProperty('box-shadow', '0 10px 24px rgba(0, 0, 0, 0.16)', 'important');
            icon.style.setProperty('color', '#ffffff', 'important');
            icon.style.setProperty('opacity', '1', 'important');

            const svg = icon.querySelector('svg');
            if (svg) {
                svg.style.setProperty('width', '26px', 'important');
                svg.style.setProperty('height', '26px', 'important');
                svg.style.setProperty('display', 'block', 'important');
                svg.style.setProperty('color', '#ffffff', 'important');
                svg.style.setProperty('fill', '#ffffff', 'important');
                svg.style.setProperty('stroke', '#ffffff', 'important');
                svg.setAttribute('fill', '#ffffff');
                svg.querySelectorAll('path').forEach(path => {
                    path.style.setProperty('fill', '#ffffff', 'important');
                    path.style.setProperty('stroke', 'none', 'important');
                    path.setAttribute('fill', '#ffffff');
                });
            }

            const title = document.createElement('h3');
            title.className = 'mtk-dashboard__card-title';
            title.textContent = option.title || '';

            const description = document.createElement('p');
            description.className = 'mtk-dashboard__card-description';
            description.textContent = option.description || '';

            const price = document.createElement('p');
            price.className = 'mtk-dashboard__card-price';
            price.textContent = option.price || '';

            card.appendChild(icon);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(price);

            if (option.clickable !== false) {
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

        resolveSubscriptionIcon(iconName) {
            const icons = {
                school: `
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
                        <path fill="currentColor" d="M12 3 2 8l10 5 8-4v6h2V8L12 3Zm-6 8.4V15c0 1.7 3.1 3 6 3s6-1.3 6-3v-3.6l-6 3-6-3Z"></path>
                    </svg>`,
                people: `
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
                        <path fill="currentColor" d="M16 11c1.7 0 3-1.6 3-3.5S17.7 4 16 4s-3 1.6-3 3.5S14.3 11 16 11Zm-8 0c1.7 0 3-1.6 3-3.5S9.7 4 8 4 5 5.6 5 7.5 6.3 11 8 11Zm0 2c-2.7 0-8 1.3-8 4v3h10v-3c0-1.1.4-2.1 1.2-2.9C10.2 13.4 8.8 13 8 13Zm8 0c-.3 0-.7 0-1.1.1 1.3.9 2.1 2.1 2.1 3.9v3H24v-3c0-2.7-5.3-4-8-4Z"></path>
                    </svg>`,
                work: `
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
                        <path fill="currentColor" d="M9 6V4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2h5c1.1 0 2 .9 2 2v3H2V8c0-1.1.9-2 2-2h5Zm2 0h2V4h-2v2Zm11 7v7c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-7h20Z"></path>
                    </svg>`
            };

            return icons[iconName] || icons.work;
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
                        id: 'business-in-a-box',
                        icon: 'work',
                        title: _t('dashboard.option.business.title', 'Business in a Box'),
                        description: _t('dashboard.option.business.addOn', 'Add the full business package to your Premium access.'),
                        price: '$3,999',
                        clickable: true
                    }
                ]
            };
        }

        return {
            title: _t('dashboard.chooseNext', 'Choose your next step:'),
            options: [
                {
                    id: 'premium-course',
                    icon: 'school',
                    title: _t('dashboard.option.premium.title', 'Premium'),
                    description: _t('dashboard.option.premium.description', 'Full premium locksmith course access.'),
                    price: '$997',
                    clickable: true
                },
                {
                    id: 'business-in-a-box',
                    icon: 'work',
                    title: _t('dashboard.option.business.title', 'Business in a Box'),
                    description: _t('dashboard.option.business.description', 'Includes Premium plus the full business package.'),
                    price: '$3,999',
                    clickable: true
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
})();
