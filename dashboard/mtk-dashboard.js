class MTKDashboard {
    constructor(config) {
	this.config = config;
	this.elements = {};
	this.subscriptions = [];
	
	// Wait for DOM to be ready
	if (document.readyState === 'loading') {
	    document.addEventListener('DOMContentLoaded', () => this.init());
	} else {
	    this.init();
	}
    }
    
    /**
     * Initialize the dashboard
     */
    init() {
	this.waitForElement('.mtk-dashboard', (element) => {
	    this.dashboardElement = element;
	    this.cacheElements();
	    this.subscribeToEvents();
	    this.render();
	    this.attachEventListeners();
	    
	    // Publish dashboard ready event
	    wc.publish('mtk-dashboard:ready', {
		timestamp: new Date().toISOString()
	    });
	});
    }
    
    /**
     * Wait for element to be available in DOM
     */
    waitForElement(selector, callback) {
	const element = document.querySelector(selector);
	
	if (element) {
	    callback(element);
	    return;
	}
	
	const observer = new MutationObserver((mutations, obs) => {
	    const element = document.querySelector(selector);
	    if (element) {
		obs.disconnect();
		callback(element);
	    }
	});
	
	observer.observe(document.body, {
	    childList: true,
	    subtree: true
	});
    }
    
    /**
     * Cache DOM elements
     */
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
    
    /**
     * Subscribe to all mtk-dashboard events
     */
    subscribeToEvents() {
	// Subscribe to config update event
	this.subscriptions.push(
	    wc.subscribe('mtk-dashboard:config-update', this.onMessage.bind(this))
	);
	
	// Subscribe to progress update event
	this.subscriptions.push(
	    wc.subscribe('mtk-dashboard:progress-update', this.onMessage.bind(this))
	);
	
	// Subscribe to user update event
	this.subscriptions.push(
	    wc.subscribe('mtk-dashboard:user-update', this.onMessage.bind(this))
	);
	
	// Subscribe to subscription update event
	this.subscriptions.push(
	    wc.subscribe('mtk-dashboard:subscription-update', this.onMessage.bind(this))
	);
    }
    
    /**
     * Handle incoming messages from subscribed events
     */
    onMessage(data) {
	const { type, payload } = data;
	
	switch (type) {
	case 'config-update':
            this.config = payload;
            this.render();
            break;
            
	case 'progress-update':
            this.updateProgress(payload);
            break;
            
	case 'user-update':
            this.updateUser(payload);
            break;
            
	case 'subscription-update':
            this.updateSubscriptions(payload);
            break;
            
	default:
            console.warn('Unknown message type:', type);
	}
    }
    
    /**
     * Render the dashboard
     */
    render() {
	this.renderUserInfo();
	this.renderProgress();
	this.renderSubscriptions();
	
	// Publish render complete event
	wc.publish('mtk-dashboard:rendered', {
	    timestamp: new Date().toISOString()
	});
    }
    
    /**
     * Render user information
     */
    renderUserInfo() {
	if (this.elements.userName) {
	    this.elements.userName.textContent = this.config.user.fullName;
	}
    }
    
    /**
     * Render progress section
     */
    renderProgress() {
	const { progress } = this.config;
	
	if (this.elements.progressLabel) {
	    this.elements.progressLabel.textContent = progress.label;
	}
	
	if (this.elements.courseTitle) {
	    this.elements.courseTitle.textContent = progress.courseTitle;
	}
	
	if (this.elements.progressPercentage) {
	    this.elements.progressPercentage.textContent = `${progress.percentage}%`;
	}
	
	if (this.elements.progressFill) {
	    // Animate progress bar
	    setTimeout(() => {
		this.elements.progressFill.style.width = `${progress.percentage}%`;
	    }, 100);
	}
	
	if (this.elements.progressBar) {
	    this.elements.progressBar.setAttribute('aria-valuenow', progress.percentage);
	    this.elements.progressBar.setAttribute('aria-label', 
						   `Course progress: ${progress.percentage}% complete`);
	}
    }
    
    /**
     * Render subscription options
     */
    renderSubscriptions() {
	const { subscriptions } = this.config;
	
	if (this.elements.subscriptionsTitle) {
	    this.elements.subscriptionsTitle.textContent = subscriptions.title;
	}
	
	if (this.elements.subscriptionGrid) {
	    this.elements.subscriptionGrid.innerHTML = '';
	    
	    subscriptions.options.forEach((option, index) => {
		const card = this.createSubscriptionCard(option, index);
		this.elements.subscriptionGrid.appendChild(card);
	    });
	}
    }
    
    /**
     * Create a subscription card element
     */
    createSubscriptionCard(option, index) {
	const card = document.createElement('div');
	card.className = 'mtk-dashboard__subscription-card';
	card.setAttribute('role', 'button');
	card.setAttribute('tabindex', '0');
	card.setAttribute('aria-label', `Subscribe to ${option.title}, ${option.price}`);
	card.dataset.subscriptionId = option.id;
	
	const icon = document.createElement('div');
	icon.className = 'mtk-dashboard__card-icon';
	icon.innerHTML = `<span class="material-icons" aria-hidden="true">${option.icon}</span>`;
	
	const title = document.createElement('h3');
	title.className = 'mtk-dashboard__card-title';
	title.textContent = option.title;
	
	const description = document.createElement('p');
	description.className = 'mtk-dashboard__card-description';
	description.textContent = option.description;
	
	const price = document.createElement('p');
	price.className = 'mtk-dashboard__card-price';
	price.textContent = option.price;
	
	card.appendChild(icon);
	card.appendChild(title);
	card.appendChild(description);
	card.appendChild(price);
	
	// Add click event
	card.addEventListener('click', () => this.handleSubscriptionClick(option));
	
	// Add keyboard support
	card.addEventListener('keydown', (e) => {
	    if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault();
		this.handleSubscriptionClick(option);
	    }
	});
	
	return card;
    }
    
    /**
     * Handle subscription card click
     */
    handleSubscriptionClick(option) {
	// Publish subscription clicked event
	let msg = {
	    subscriptionId: option.id,
	    title: option.title,
	    price: option.price,
	    timestamp: new Date().toISOString()
	}

	wc.publish('mtk-dashboard:subscription-clicked', msg);
    }
    
    /**
     * Update progress
     */
    updateProgress(data) {
	if (data.percentage !== undefined) {
	    this.config.progress.percentage = data.percentage;
	}
	
	if (data.courseTitle) {
	    this.config.progress.courseTitle = data.courseTitle;
	}
	
	this.renderProgress();
	
	// Publish progress updated event
	wc.publish('mtk-dashboard:progress-updated', {
	    percentage: this.config.progress.percentage,
	    timestamp: new Date().toISOString()
	});
    }
    
    /**
     * Update user information
     */
    updateUser(data) {
	if (data.fullName) {
	    this.config.user.fullName = data.fullName;
	    this.renderUserInfo();
	    
	    // Publish user updated event
	    wc.publish('mtk-dashboard:user-updated', {
		fullName: data.fullName,
		timestamp: new Date().toISOString()
	    });
	}
    }
    
    /**
     * Update subscriptions
     */
    updateSubscriptions(data) {
	if (data.options) {
	    this.config.subscriptions.options = data.options;
	}
	
	if (data.title) {
	    this.config.subscriptions.title = data.title;
	}
	
	this.renderSubscriptions();
	
	// Publish subscriptions updated event
	wc.publish('mtk-dashboard:subscriptions-updated', {
	    optionsCount: this.config.subscriptions.options.length,
	    timestamp: new Date().toISOString()
	});
    }
    
    /**
     * Attach additional event listeners
     */
    attachEventListeners() {
	// Listen for visibility changes
	document.addEventListener('visibilitychange', () => {
	    if (!document.hidden) {
		wc.publish('mtk-dashboard:visible', {
		    timestamp: new Date().toISOString()
		});
	    }
	});
    }
    
    /**
     * Destroy the dashboard and clean up
     */
    destroy() {
	// Unsubscribe from all events
	this.subscriptions.forEach(unsubscribe => unsubscribe());
	this.subscriptions = [];
	
	// Publish destroyed event
	wc.publish('mtk-dashboard:destroyed', {
	    timestamp: new Date().toISOString()
	});
    }
}

// mtk-dashboard configuration
window.myConfig = {
    user: {
	fullName: "Mel M. Heravi"
    },
    progress: {
	label: "Your progress to date:",
	percentage: 23,
	courseTitle: "NALA - Locksmith Course"
    },
    subscriptions: {
	title: "You can also subscribe to our premium features:",
	options: [
	    {
		id: "premium-course",
		icon: "school",
		title: "Premium Courses",
		description: "Access advanced courses and certifications",
		price: "$136.25/month"
	    },
	    {
		id: "mentorship",
		icon: "people",
		title: "1-on-1 Mentorship",
		description: "Get personalized guidance from experts",
		price: "$99.99/month"
	    },
	    {
		id: "career-services",
		icon: "work",
		title: "Career Services",
		description: "Resume review, interview prep, and job matching",
		price: "$49.99/month"
	    }
	]
    }
};

// Wait for mtk-dashboard element to be completely loaded into DOM
function initializeDashboard(config) {
    console.log(">>>>>>>>>", config);
    const resolvedConfig = config || (typeof window.mtkDashboardConfig !== "undefined" ? window.mtkDashboardConfig : null);
    
    if (!resolvedConfig) {
	console.error(
	    "MTK Dashboard: Configuration not found. Pass config to initializeDashboard() or include mtk-dashboard.config.js"
	);
	return;
    }

    const init = () => {
	const dashboard = new MTKDashboard(resolvedConfig);
	window.mtkDashboard = dashboard; // optional, for debugging
    };

    const dashboardElement = document.querySelector("mtk-dashboard.mtk-dashboard");

    if (dashboardElement) {
	init();
	return;
    }

    // Wait until element is added to DOM
    const observer = new MutationObserver((_, obs) => {
	const el = document.querySelector("mtk-dashboard.mtk-dashboard");
	if (el) {
	    obs.disconnect();
	    init();
	}
    });

    observer.observe(document.documentElement, {
	childList: true,
	subtree: true
    });
}

// INITIALIZE WHEN DOM IS READY
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    // FOR TESTING
    wc.session.dashboard.panels = ["mentorship", "career-services"]
    
    // UPDATE USER NAME AND PROGRESS
    window.myConfig.user.fullName = wc.session.user.name;
    window.myConfig.progress.percentage = wc.session.dashboard.progress;

    // UPDATE PER-USER PANELS
    wc.timeout(function(){
	// INITIALLY HIDE ALL PANELS
	for (let i = 0; i < window.myConfig.subscriptions.options.length; i++) {
	    let id = window.myConfig.subscriptions.options[i].id;
	    let panel = "[data-subscription-id=" + id + "]";
	    
	    $(panel).hide();
	}

	for (let i = 0; i < wc.session.dashboard.panels.length; i++) {
	    let panel = "[data-subscription-id=" + wc.session.dashboard.panels[i] + "]";

	    $(panel).show();
	}    
    }, 100, 1);

    initializeDashboard(window.myConfig);
}


/////////////////////////////////////////////////////////////////////////
//// wc.session.dashboard.panels = ['mentorship', 'career-services']
/////////////////////////////////////////////////////////////////////////
