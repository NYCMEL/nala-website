// Declare PubSub variable here or import it from another module
const PubSub = window.PubSub

class ClientProfile {
  constructor(data) {
    this.data = data
    this.pubsub = PubSub
    this.init()
  }

  init() {
    this.renderBreadcrumb()
    this.renderHeader()
    this.renderStats()
    this.renderTabs()
    this.renderContent()
    this.renderSidebar()
    this.attachEventListeners()
    this.initGlobalClickListener()
  }

  renderBreadcrumb() {
    const breadcrumb = document.getElementById("breadcrumb")
    const items = this.data.breadcrumb
      .map((item, index) => {
        const isLast = index === this.data.breadcrumb.length - 1
        return `
        <a href="${item.link}">${item.text}</a>
        ${!isLast ? '<span class="breadcrumb-separator">›</span>' : ""}
      `
      })
      .join("")
    breadcrumb.innerHTML = items
  }

  renderHeader() {
    // Logo
    const logo = document.getElementById("clientLogo")
    logo.innerHTML = `<img src="${this.data.business.logo}" alt="${this.data.business.name}">`

    // Name
    document.getElementById("clientName").textContent = this.data.business.name

    // Rating
    const rating = document.getElementById("clientRating")
    const stars = "★".repeat(Math.floor(this.data.business.rating))
    rating.innerHTML = `
      <span class="rating-text">${this.data.business.ratingText}</span>
      <span class="rating-value">${this.data.business.rating}</span>
      <span class="stars">${stars}</span>
      <span class="review-count">(${this.data.business.reviewCount})</span>
    `

    // Badges
    if (this.data.business.isTopPro) {
      const badges = document.getElementById("clientBadges")
      badges.innerHTML = `
        <span class="badge">
          <span class="material-icons">verified</span>
          Top Pro
        </span>
      `
    }
  }

  renderStats() {
    const statsContainer = document.getElementById("clientStats")
    const statsHTML = this.data.stats
      .map(
        (stat) => `
      <div class="stat-item stat-${stat.type}">
        <span class="material-icons">${stat.icon}</span>
        <span>${stat.text}</span>
      </div>
    `,
      )
      .join("")
    statsContainer.innerHTML = statsHTML
  }

  renderTabs() {
    const tabsContainer = document.getElementById("clientTabs")
    const tabsHTML = this.data.tabs
      .map(
        (tab) => `
      <button class="tab ${tab.active ? "active" : ""}" data-tab="${tab.id}">
        ${tab.label}
      </button>
    `,
      )
      .join("")
    tabsContainer.innerHTML = tabsHTML
  }

  renderContent() {
    // About section
    const aboutText = document.getElementById("aboutText")
    aboutText.innerHTML = `
      ${this.data.about.description}
      <a href="#">${this.data.about.readMoreLink}</a>
    `

    // Business hours
    document.getElementById("businessHoursTitle").textContent = this.data.businessHours.title
    document.getElementById("businessHoursText").textContent = this.data.businessHours.text

    // Payment methods
    document.getElementById("paymentMethodsTitle").textContent = this.data.paymentMethods.title
    document.getElementById("paymentMethodsText").textContent = this.data.paymentMethods.methods

    // Social media
    document.getElementById("socialMediaTitle").textContent = this.data.socialMedia.title
    const socialLinks = document.getElementById("socialMediaLinks")
    socialLinks.innerHTML = this.data.socialMedia.links
      .map((link) => `<a href="${link.url}">${link.platform}</a>`)
      .join("")

    // Top Pro status
    document.getElementById("topProTitle").textContent = this.data.topProStatus.title
    document.getElementById("topProDescription").textContent = this.data.topProStatus.description

    const proBadges = document.getElementById("topProBadges")
    proBadges.innerHTML = this.data.topProStatus.years
      .map(
        (year) => `
      <div class="pro-badge">
        <div class="badge-icon">
          <span class="material-icons">star</span>
        </div>
        <span class="badge-year">${year}</span>
      </div>
    `,
      )
      .join("")
  }

  renderSidebar() {
    // Contact info
    document.getElementById("contactPrice").textContent = this.data.contact.priceText
    document.getElementById("viewDetailsLink").textContent = this.data.contact.viewDetailsLink
    document.getElementById("btnEstimate").textContent = this.data.contact.ctaButton

    // Online status
    if (!this.data.business.isOnline) {
      document.getElementById("onlineStatus").style.display = "none"
    }

    // Guarantee
    document.getElementById("guaranteeTitle").textContent = this.data.guarantee.title
    document.getElementById("guaranteeText").textContent = this.data.guarantee.text
    document.getElementById("learnMoreLink").textContent = this.data.guarantee.learnMoreLink
  }

  attachEventListeners() {
    // Tab navigation
    const tabs = document.querySelectorAll(".tab")
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        tabs.forEach((t) => t.classList.remove("active"))
        e.target.classList.add("active")
        this.publishClickEvent(e, "tab.clicked")
      })
    })

    // Share button
    document.getElementById("btnShare").addEventListener("click", (e) => {
      this.publishClickEvent(e, "button.share.clicked")

      if (navigator.share) {
        navigator
          .share({
            title: this.data.business.name,
            text: `Check out ${this.data.business.name} on our platform!`,
            url: window.location.href,
          })
          .catch((err) => console.error("Share error:", err))
      } else {
        alert("Share functionality not supported in this browser")
      }
    })

    // Request estimate button
    document.getElementById("btnEstimate").addEventListener("click", (e) => {
      this.publishClickEvent(e, "button.estimate.clicked")
      alert("Request estimate form would open here")
    })

    document.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        this.publishClickEvent(e, "link.clicked")
      })
    })

    // Material Design ripple effect
    this.addRippleEffect()
  }

  initGlobalClickListener() {
    document.addEventListener("click", (e) => {
      const elementId = e.target.id || e.target.closest("[id]")?.id || "no-id"
      const elementClass = e.target.className || "no-class"
      const elementTag = e.target.tagName.toLowerCase()

      const clickData = {
        elementId: elementId,
        elementClass: elementClass,
        elementTag: elementTag,
        timestamp: new Date().toISOString(),
        coordinates: {
          x: e.clientX,
          y: e.clientY,
        },
        target: e.target,
      }

      if (this.pubsub) {
        this.pubsub.publish("global.click", clickData)
      }

      console.log("[_client] Global Click Event:", clickData)
    })
  }

  publishClickEvent(event, eventName) {
    if (!this.pubsub) return

    const elementId = event.target.id || event.target.closest("[id]")?.id || "no-id"
    const elementClass = event.target.className || "no-class"

    const clickData = {
      eventName: eventName,
      elementId: elementId,
      elementClass: elementClass,
      elementTag: event.target.tagName.toLowerCase(),
      timestamp: new Date().toISOString(),
      coordinates: {
        x: event.clientX,
        y: event.clientY,
      },
      data: event.target.dataset || {},
    }

    this.pubsub.publish(eventName.replace(":", "."), clickData)
    console.log(`[_client] ${eventName}:`, clickData)
  }

  addRippleEffect() {
    const buttons = document.querySelectorAll(".btn-primary, .btn-share, .tab")
    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const ripple = document.createElement("span")
        const rect = this.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2

        ripple.style.width = ripple.style.height = size + "px"
        ripple.style.left = x + "px"
        ripple.style.top = y + "px"
        ripple.classList.add("ripple")

        this.appendChild(ripple)

        setTimeout(() => ripple.remove(), 600)
      })
    })
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("[_client] Initializing Client Profile Component")

  if (typeof PubSub === "undefined") {
    console.error("[_client] PubSubJS not loaded! Make sure _pubsub.js is included before _client.js")
    return
  }

  const profile = new ClientProfile(clientData)

  PubSub.subscribe("global.click", (msg, data) => {
    console.log("[_client] Global click captured:", msg, data)
  })

  // Subscribe to specific button clicks
  PubSub.subscribe("button.estimate.clicked", (msg, data) => {
    console.log("[_client] Estimate button clicked:", msg, data)
  })

  PubSub.subscribe("button.share.clicked", (msg, data) => {
    console.log("[_client] Share button clicked:", msg, data)
  })

  PubSub.subscribe("tab.clicked", (msg, data) => {
    console.log("[_client] Tab clicked:", msg, data)
  })

  PubSub.subscribe("link.clicked", (msg, data) => {
    console.log("[_client] Link clicked:", msg, data)
  })

  PubSub.subscribe("*", (msg, data) => {
    console.log("[_client] PubSub Event:", msg, data)
  })
})
