// MTK Client Component Controller
class MTKClient {
    constructor() {
        this.config = null;
        this.init();
    }

    async init() {
        try {
            await this.loadConfig();
            this.waitForComponent();
        } catch (error) {
            console.error('Failed to initialize MTK Client:', error);
        }
    }

    async loadConfig() {
        try {
            const response = await fetch('config.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.config = await response.json();
        } catch (error) {
            console.error('Error loading config:', error);
            throw error;
        }
    }

    waitForComponent() {
        // Wait for the web component to be loaded
        const checkComponent = setInterval(() => {
            const wcInclude = document.querySelector('wc-include');
            if (wcInclude && wcInclude.shadowRoot) {
                const mtkClient = wcInclude.shadowRoot.querySelector('#mtk-client');
                if (mtkClient) {
                    clearInterval(checkComponent);
                    this.populateData(wcInclude.shadowRoot);
                    this.attachEventListeners(wcInclude.shadowRoot);
                }
            }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkComponent);
        }, 5000);
    }

    populateData(shadowRoot) {
        if (!this.config) return;

        // Populate Logo
        const logoText = shadowRoot.querySelector('#logo-text');
        if (logoText) {
            logoText.textContent = this.config.logo.initials;
            logoText.style.color = this.config.logo.color;
        }

        // Populate Business Name
        const businessName = shadowRoot.querySelector('#business-name');
        if (businessName) {
            businessName.textContent = this.config.business_name;
        }

        // Populate Rating
        const ratingText = shadowRoot.querySelector('#rating-text');
        if (ratingText) {
            ratingText.textContent = `${this.config.rating.description} ${this.config.rating.score} (${this.config.rating.total_reviews} reviews)`;
        }

        // Populate Badges
        const badgesContainer = shadowRoot.querySelector('#badges-container');
        if (badgesContainer && this.config.badges) {
            this.config.badges.forEach(badge => {
                const badgeEl = document.createElement('span');
                badgeEl.className = 'badge';
                badgeEl.textContent = `${badge.icon} ${badge.text}`;
                badgesContainer.appendChild(badgeEl);
            });
        }

        // Populate About
        const aboutTagline = shadowRoot.querySelector('#about-tagline');
        const aboutDescription = shadowRoot.querySelector('#about-description');
        if (aboutTagline) aboutTagline.textContent = this.config.about.tagline;
        if (aboutDescription) aboutDescription.textContent = this.config.about.description;

        // Populate Overview
        const overviewGrid = shadowRoot.querySelector('#overview-grid');
        if (overviewGrid && this.config.overview) {
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
        const paymentMethods = shadowRoot.querySelector('#payment-methods');
        if (paymentMethods && this.config.payment_methods) {
            this.config.payment_methods.forEach(method => {
                const methodEl = document.createElement('span');
                methodEl.className = 'payment-tag';
                methodEl.textContent = `${method.icon} ${method.name}`;
                paymentMethods.appendChild(methodEl);
            });
        }

        // Populate Social Links
        const socialLinks = shadowRoot.querySelector('#social-links');
        if (socialLinks && this.config.social_media) {
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
        const price = shadowRoot.querySelector('#price');
        const priceNote = shadowRoot.querySelector('#price-note');
        if (price) {
            price.textContent = `$${this.config.pricing.service_call_fee}`;
        }
        if (priceNote) {
            priceNote.textContent = `(${this.config.pricing.note})`;
        }

        // Populate Status
        const statusText = shadowRoot.querySelector('#status-text');
        const statusOnline = shadowRoot.querySelector('#status-online');
        if (statusText) {
            statusText.textContent = this.config.status.text;
        }
        if (statusOnline && !this.config.status.online) {
            statusOnline.style.display = 'none';
        }

        // Populate CTA Buttons
        const ctaButtons = shadowRoot.querySelector('#cta-buttons');
        if (ctaButtons && this.config.cta_buttons) {
            this.config.cta_buttons.forEach(button => {
                const btnEl = document.createElement('button');
                btnEl.className = `btn btn-${button.type}`;
                btnEl.setAttribute('data-action', button.action);
                btnEl.textContent = `${button.icon} ${button.text}`;
                ctaButtons.appendChild(btnEl);
            });
        }

        // Populate Guarantee
        const guaranteeIcon = shadowRoot.querySelector('#guarantee-icon');
        const guaranteeTitle = shadowRoot.querySelector('#guarantee-title');
        const guaranteeDesc = shadowRoot.querySelector('#guarantee-desc');
        if (guaranteeIcon) guaranteeIcon.textContent = this.config.guarantee.icon;
        if (guaranteeTitle) guaranteeTitle.textContent = this.config.guarantee.type;
        if (guaranteeDesc) guaranteeDesc.textContent = this.config.guarantee.description;

        // Populate Business Hours
        const businessHours = shadowRoot.querySelector('#business-hours');
        if (businessHours) {
            businessHours.textContent = this.config.business_hours.note;
        }
    }

    attachEventListeners(shadowRoot) {
        // Attach event listeners to buttons
        const buttons = shadowRoot.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.handleButtonClick(action);
            });
        });

        // Attach event listeners to social links
        const socialLinks = shadowRoot.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = e.target.getAttribute('data-platform');
                this.handleSocialClick(platform);
            });
        });

        // Attach event listeners to payment tags (optional hover effects)
        const paymentTags = shadowRoot.querySelectorAll('.payment-tag');
        paymentTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                console.log('Payment method selected:', e.target.textContent);
            });
        });
    }

    handleButtonClick(action) {
        console.log(`Button clicked: ${action}`);
        
        switch(action) {
            case 'estimate':
                alert('Request Estimate functionality would be implemented here.');
                break;
            case 'call':
                alert('Request a Call functionality would be implemented here.');
                break;
            case 'message':
                alert('Message functionality would be implemented here.');
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    handleSocialClick(platform) {
        console.log(`Social link clicked: ${platform}`);
        alert(`Redirecting to ${platform}...`);
    }

    // Public method to update config dynamically
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        const wcInclude = document.querySelector('wc-include');
        if (wcInclude && wcInclude.shadowRoot) {
            this.populateData(wcInclude.shadowRoot);
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
