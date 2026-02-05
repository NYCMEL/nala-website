// MTK Client Component Controller
// This script waits for the wc-include component to load before initializing

class MTKClient {
    constructor() {
        this.config = null;
        this.shadowRoot = null;
        this.init();
    }

    async init() {
        // Load configuration
        this.config = typeof mtkClientConfig !== 'undefined' ? mtkClientConfig : null;
        
        if (!this.config) {
            console.error('MTK Client Config not found! Make sure mtk-client.config.js is loaded.');
            return;
        }

        // Wait for wc-include to load the component
        this.waitForComponent();
    }

    waitForComponent() {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds timeout

        const checkComponent = setInterval(() => {
            attempts++;

            // Look for wc-include element
            const wcInclude = document.querySelector('wc-include');
            
            if (wcInclude && wcInclude.shadowRoot) {
                const mtkClient = wcInclude.shadowRoot.querySelector('#mtk-client');
                
                if (mtkClient) {
                    clearInterval(checkComponent);
                    this.shadowRoot = wcInclude.shadowRoot;
                    this.onComponentReady();
                }
            }

            // Timeout after max attempts
            if (attempts >= maxAttempts) {
                clearInterval(checkComponent);
                console.error('MTK Client component not found after timeout');
            }
        }, 100);
    }

    onComponentReady() {
        console.log('MTK Client component is ready!');
        this.populateData();
        this.attachEventListeners();
    }

    populateData() {
        if (!this.config || !this.shadowRoot) return;

        // Populate Logo
        const logoText = this.shadowRoot.querySelector('#logo-text');
        if (logoText) {
            logoText.textContent = this.config.logo.initials;
            logoText.style.color = this.config.logo.color;
        }

        // Update logo border color
        const logo = this.shadowRoot.querySelector('.logo');
        if (logo) {
            logo.style.borderColor = this.config.logo.color;
        }

        // Populate Business Name
        const businessName = this.shadowRoot.querySelector('#business-name');
        if (businessName) {
            businessName.textContent = this.config.business_name;
        }

        // Populate Stars
        const stars = this.shadowRoot.querySelector('#stars');
        if (stars) {
            const starCount = Math.round(this.config.rating.score);
            stars.textContent = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
        }

        // Populate Rating
        const ratingText = this.shadowRoot.querySelector('#rating-text');
        if (ratingText) {
            ratingText.textContent = `${this.config.rating.description} ${this.config.rating.score} (${this.config.rating.total_reviews} reviews)`;
        }

        // Populate Badges
        const badgesContainer = this.shadowRoot.querySelector('#badges-container');
        if (badgesContainer && this.config.badges) {
            badgesContainer.innerHTML = '';
            this.config.badges.forEach(badge => {
                const badgeEl = document.createElement('span');
                badgeEl.className = 'badge';
                badgeEl.textContent = `${badge.icon} ${badge.text}`;
                badgesContainer.appendChild(badgeEl);
            });
        }

        // Populate About
        const aboutTagline = this.shadowRoot.querySelector('#about-tagline');
        const aboutDescription = this.shadowRoot.querySelector('#about-description');
        if (aboutTagline) aboutTagline.textContent = this.config.about.tagline;
        if (aboutDescription) aboutDescription.textContent = this.config.about.description;

        // Populate Overview
        const overviewGrid = this.shadowRoot.querySelector('#overview-grid');
        if (overviewGrid && this.config.overview) {
            overviewGrid.innerHTML = '';
            this.config.overview.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'overview-item';
                
                const iconEl = document.createElement('div');
                iconEl.className = 'overview-icon';
                iconEl.textContent = item.icon;
                
                const textEl = document.createElement('span');
                if (item.label && item.value) {
                    textEl.innerHTML = `${item.label} <strong>${item.value}</strong>`;
                } else if (item.label) {
                    textEl.innerHTML = `<strong>${item.label}</strong>`;
                } else if (item.value) {
                    textEl.innerHTML = `<strong>${item.value}</strong>`;
                }
                
                itemEl.appendChild(iconEl);
                itemEl.appendChild(textEl);
                overviewGrid.appendChild(itemEl);
            });
        }

        // Populate Payment Methods
        const paymentMethods = this.shadowRoot.querySelector('#payment-methods');
        if (paymentMethods && this.config.payment_methods) {
            paymentMethods.innerHTML = '';
            this.config.payment_methods.forEach(method => {
                const methodEl = document.createElement('span');
                methodEl.className = 'payment-tag';
                methodEl.textContent = `${method.icon} ${method.name}`;
                paymentMethods.appendChild(methodEl);
            });
        }

        // Populate Social Links
        const socialLinks = this.shadowRoot.querySelector('#social-links');
        if (socialLinks && this.config.social_media) {
            socialLinks.innerHTML = '';
            this.config.social_media.forEach(social => {
                const linkEl = document.createElement('a');
                linkEl.href = social.url;
                linkEl.className = 'social-link';
                linkEl.setAttribute('data-platform', social.platform.toLowerCase());
                linkEl.textContent = `${social.icon} ${social.platform}`;
                socialLinks.appendChild(linkEl);
            });
        }

        // Populate Pricing
        const price = this.shadowRoot.querySelector('#price');
        const priceNote = this.shadowRoot.querySelector('#price-note');
        if (price) {
            price.textContent = `$${this.config.pricing.service_call_fee}`;
        }
        if (priceNote) {
            priceNote.textContent = `(${this.config.pricing.note})`;
        }

        // Populate Status
        const statusText = this.shadowRoot.querySelector('#status-text');
        const statusOnline = this.shadowRoot.querySelector('#status-online');
        if (statusText) {
            statusText.textContent = this.config.status.text;
        }
        if (statusOnline && !this.config.status.online) {
            statusOnline.style.display = 'none';
        }

        // Populate CTA Buttons
        const ctaButtons = this.shadowRoot.querySelector('#cta-buttons');
        if (ctaButtons && this.config.cta_buttons) {
            ctaButtons.innerHTML = '';
            this.config.cta_buttons.forEach(button => {
                const btnEl = document.createElement('button');
                btnEl.className = `btn btn-${button.type}`;
                btnEl.setAttribute('data-action', button.action);
                btnEl.textContent = `${button.icon} ${button.text}`;
                ctaButtons.appendChild(btnEl);
            });
        }

        // Populate Guarantee
        const guaranteeIcon = this.shadowRoot.querySelector('#guarantee-icon');
        const guaranteeTitle = this.shadowRoot.querySelector('#guarantee-title');
        const guaranteeDesc = this.shadowRoot.querySelector('#guarantee-desc');
        if (guaranteeIcon) guaranteeIcon.textContent = this.config.guarantee.icon;
        if (guaranteeTitle) guaranteeTitle.textContent = this.config.guarantee.type;
        if (guaranteeDesc) guaranteeDesc.textContent = this.config.guarantee.description;

        // Populate Business Hours
        const businessHours = this.shadowRoot.querySelector('#business-hours');
        if (businessHours) {
            businessHours.textContent = this.config.business_hours.note;
        }
    }

    attachEventListeners() {
        if (!this.shadowRoot) return;

        // Attach event listeners to buttons
        const buttons = this.shadowRoot.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.handleButtonClick(action);
            });
        });

        // Attach event listeners to social links
        const socialLinks = this.shadowRoot.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = e.target.getAttribute('data-platform');
                this.handleSocialClick(platform);
            });
        });

        // Attach event listeners to payment tags
        const paymentTags = this.shadowRoot.querySelectorAll('.payment-tag');
        paymentTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                console.log('Payment method selected:', e.target.textContent);
            });
        });
    }

    handleButtonClick(action) {
        console.log(`Button clicked: ${action}`);
        
        // Dispatch custom event that can be listened to from outside
        document.dispatchEvent(new CustomEvent('mtk-client-action', {
            detail: {
                action: action,
                config: this.config
            }
        }));

        // Default action handlers
        switch(action) {
            case 'estimate':
                this.onRequestEstimate();
                break;
            case 'call':
                this.onRequestCall();
                break;
            case 'message':
                this.onMessage();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    handleSocialClick(platform) {
        console.log(`Social link clicked: ${platform}`);
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('mtk-client-social', {
            detail: {
                platform: platform,
                config: this.config
            }
        }));

        // You can implement actual navigation here
        alert(`Opening ${platform}...`);
    }

    // Action handlers - can be overridden
    onRequestEstimate() {
        alert('Request Estimate functionality - implement your logic here');
    }

    onRequestCall() {
        alert('Request Call functionality - implement your logic here');
    }

    onMessage() {
        alert('Message functionality - implement your logic here');
    }

    // Public method to update config dynamically
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        if (this.shadowRoot) {
            this.populateData();
        }
    }

    // Public method to get current config
    getConfig() {
        return this.config;
    }
}

// Initialize the component when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mtkClient = new MTKClient();
    });
} else {
    window.mtkClient = new MTKClient();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MTKClient;
}
