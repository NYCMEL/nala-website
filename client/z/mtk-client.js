// MTK Client JavaScript
class MTKClient {
  constructor(config) {
    this.config = config;
    this.init();
  }
  
  init() {
    this.renderBreadcrumb();
    this.renderHeader();
    this.renderMainContent();
    this.renderSidebar();
    this.attachEventListeners();
  }
  
  // Render breadcrumb navigation
  renderBreadcrumb() {
    const breadcrumbEl = document.querySelector('.mtk-client__breadcrumb');
    if (!breadcrumbEl) return;
    
    const breadcrumbHTML = this.config.breadcrumb.map((item, index) => {
      const isLast = index === this.config.breadcrumb.length - 1;
      if (isLast) {
        return `<span class="current">${item.label}</span>`;
      }
      return `<a href="${item.link}">${item.label}</a><span class="separator">›</span>`;
    }).join('');
    
    breadcrumbEl.innerHTML = breadcrumbHTML;
  }
  
  // Render header section
  renderHeader() {
    const headerEl = document.querySelector('.mtk-client__header-content');
    if (!headerEl) return;
    
    const { business } = this.config;
    const stars = '★'.repeat(5);
    
    headerEl.innerHTML = `
      <h1 class="mtk-client__title">${business.name}</h1>
      <div class="mtk-client__rating">
        <span class="mtk-client__rating-text">Excellent ${business.rating}</span>
        <div class="mtk-client__stars">${stars.split('').map(s => `<span class="star">${s}</span>`).join('')}</div>
        <span class="mtk-client__review-count">(${business.reviewCount})</span>
      </div>
      ${business.badges.map(badge => `
        <div class="mtk-client__badge">
          <span class="badge-icon">✓</span>
          <span>${badge}</span>
        </div>
      `).join('')}
    `;
    
    // Set logo
    const logoEl = document.querySelector('.mtk-client__logo');
    if (logoEl) {
      logoEl.src = business.logo;
      logoEl.alt = business.name;
    }
  }
  
  // Render main content
  renderMainContent() {
    this.renderAbout();
    this.renderOverview();
    this.renderBusinessInfo();
    this.renderActions();
  }
  
  // Render about section
  renderAbout() {
    const aboutEl = document.querySelector('.mtk-client__about');
    if (!aboutEl) return;
    
    const { about } = this.config;
    aboutEl.innerHTML = `
      <h2>${about.title}</h2>
      <p>${about.shortDescription}</p>
      <p>${about.fullDescription} <a href="#" class="read-more">...Read More</a></p>
    `;
  }
  
  // Render overview section
  renderOverview() {
    const overviewEl = document.querySelector('.mtk-client__overview');
    if (!overviewEl) return;
    
    const iconMap = {
      star: '⭐',
      trophy: '🏆',
      location: '📍',
      shield: '🛡️',
      users: '👥',
      clock: '🕐'
    };
    
    const overviewHTML = this.config.overview.map(item => `
      <li>
        <span class="icon">${iconMap[item.icon] || '•'}</span>
        <span>${item.label}</span>
      </li>
    `).join('');
    
    overviewEl.innerHTML = `
      <h2>Overview</h2>
      <ul class="mtk-client__overview-list">
        ${overviewHTML}
      </ul>
    `;
  }
  
  // Render business info sections
  renderBusinessInfo() {
    const businessInfoEl = document.querySelector('.mtk-client__business-info');
    if (!businessInfoEl) return;
    
    const { businessHours, paymentMethods, socialMedia } = this.config;
    
    businessInfoEl.innerHTML = `
      <div class="mtk-client__business-hours">
        <h2>${businessHours.title}</h2>
        <p>${businessHours.message}</p>
      </div>
      
      <div class="mtk-client__payment-section">
        <h2>${paymentMethods.title}</h2>
        <p class="mtk-client__payment-methods">This pro accepts payments via ${this.formatList(paymentMethods.methods)}.</p>
      </div>
      
      <div class="mtk-client__social-section">
        <h2>${socialMedia.title}</h2>
        <div class="mtk-client__social-links">
          ${socialMedia.links.map(link => `
            <a href="${link.url}">${link.platform}</a>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Render action buttons
  renderActions() {
    const actionsEl = document.querySelector('.mtk-client__actions');
    if (!actionsEl) return;
    
    const { actions } = this.config;
    
    actionsEl.innerHTML = actions.secondary.map(action => `
      <button class="mtk-client__action-btn" data-action="${action.toLowerCase().replace(' ', '-')}">
        <span class="icon">${action === 'Message' ? '💬' : '📞'}</span>
        <span>${action}</span>
      </button>
    `).join('');
  }
  
  // Render sidebar
  renderSidebar() {
    this.renderPricingCard();
    this.renderGuaranteeCard();
  }
  
  // Render pricing card
  renderPricingCard() {
    const pricingCardEl = document.querySelector('.mtk-client__pricing-card');
    if (!pricingCardEl) return;
    
    const { business, actions } = this.config;
    
    pricingCardEl.innerHTML = `
      <h3>$${business.serviceCallFee}/service call</h3>
      ${business.feeWaived ? '<p class="waived-text">(waived if hired)</p>' : ''}
      <a href="#" class="details-link">${actions.detailsLink}</a>
      <button class="mtk-client__request-btn">${actions.primary}</button>
      ${business.onlineStatus ? `
        <div class="mtk-client__online-status">
          <span class="status-dot"></span>
          <span>Online now</span>
        </div>
      ` : ''}
    `;
  }
  
  // Render guarantee card
  renderGuaranteeCard() {
    const guaranteeCardEl = document.querySelector('.mtk-client__guarantee-card');
    if (!guaranteeCardEl) return;
    
    const { guarantee } = this.config;
    
    guaranteeCardEl.innerHTML = `
      <h3>
        <span class="guarantee-icon">🛡️</span>
        <span>${guarantee.title}</span>
      </h3>
      <p>${guarantee.description} <a href="${guarantee.learnMoreLink}" class="learn-more-link">Learn more</a></p>
    `;
  }
  
  // Attach event listeners
  attachEventListeners() {
    // Request estimate button
    const requestBtn = document.querySelector('.mtk-client__request-btn');
    if (requestBtn) {
      requestBtn.addEventListener('click', () => this.handleRequestEstimate());
    }
    
    // Action buttons
    const actionBtns = document.querySelectorAll('.mtk-client__action-btn');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleAction(action);
      });
    });
    
    // Read more link
    const readMoreLink = document.querySelector('.read-more');
    if (readMoreLink) {
      readMoreLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleReadMore();
      });
    }
  }
  
  // Handle request estimate
  handleRequestEstimate() {
    alert(`Request estimate from ${this.config.business.name}`);
    console.log('Request estimate clicked');
  }
  
  // Handle action buttons
  handleAction(action) {
    switch(action) {
      case 'message':
        alert(`Open message dialog for ${this.config.business.name}`);
        break;
      case 'request-a-call':
        alert(`Request a call from ${this.config.business.name}`);
        break;
      default:
        console.log('Action:', action);
    }
  }
  
  // Handle read more
  handleReadMore() {
    alert('Show full about description');
    console.log('Read more clicked');
  }
  
  // Helper: Format list with commas and "and"
  formatList(items) {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    
    const last = items[items.length - 1];
    const rest = items.slice(0, -1).join(', ');
    return `${rest}, and ${last}`;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof mtkClientConfig !== 'undefined') {
    new MTKClient(mtkClientConfig);
  } else {
    console.error('MTK Client Config not found!');
  }
});
