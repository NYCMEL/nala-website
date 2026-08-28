window.MTK_INVESTOR_CONFIG = Object.freeze({
  "brand": {
    "name": "NALA",
    "eyebrow": "Investor Relations",
    "logo": "img/logo-nala-association.webp",
    "logoAlt": "NALA North American Locksmith Association",
    "tagline": "Building durable value through disciplined growth"
  },
  "navigation": [
    { "label": "Overview", "target": "overview" },
    { "label": "Financials", "target": "highlights" },
    { "label": "Governance", "target": "principles" },
    { "label": "News", "target": "updates" },
    { "label": "Resources", "target": "updates" },
    { "label": "Contact", "target": "closing" }
  ],
  "hero": {
    "kicker": "NALA Investor Relations",
    "title": "Investing in the next chapter of NALA",
    "summary": "A focused platform built around sustainable growth, customer value, operational discipline, and long-term stakeholder returns.",
    "primaryAction": {
      "label": "View investor highlights",
      "icon": "trending_up",
      "event": "mtk-investor:cta",
      "action": "view-highlights",
      "target": "highlights"
    },
    "secondaryAction": {
      "label": "Contact investor relations",
      "icon": "mail",
      "event": "mtk-investor:contact",
      "action": "contact-investor-relations"
    }
  },
  "overview": {
    "eyebrow": "At a glance",
    "title": "A simple investment story",
    "body": "NALA is positioned around focused execution, scalable digital experiences, and measured investment in the areas that create durable customer and shareholder value."
  },
  "metrics": [
    {
      "value": "$1.2B",
      "label": "Illustrative annual revenue",
      "detail": "A clear top-line view for investor storytelling.",
      "icon": "payments",
      "event": "mtk-investor:metric",
      "action": "revenue"
    },
    {
      "value": "18%",
      "label": "Illustrative growth",
      "detail": "Year-over-year growth shown as a configurable investor KPI.",
      "icon": "show_chart",
      "event": "mtk-investor:metric",
      "action": "growth"
    },
    {
      "value": "42%",
      "label": "Illustrative gross margin",
      "detail": "A configurable profitability indicator.",
      "icon": "analytics",
      "event": "mtk-investor:metric",
      "action": "margin"
    },
    {
      "value": "28",
      "label": "Illustrative markets",
      "detail": "A configurable footprint indicator for global scale.",
      "icon": "public",
      "event": "mtk-investor:metric",
      "action": "markets"
    }
  ],
  "principles": {
    "items": [
      {
        "title": "Our Mission",
        "text": "Advance the locksmith profession through education, advocacy, and community.",
        "icon": "track_changes"
      },
      {
        "title": "Our Vision",
        "text": "Be the global leader in security standards, innovation, and professional development.",
        "icon": "visibility"
      },
      {
        "title": "Our Values",
        "text": "Integrity, excellence, inclusion, and service drive everything we do.",
        "icon": "diamond"
      },
      {
        "title": "For Investors",
        "text": "We are committed to creating sustainable value and long-term impact.",
        "icon": "handshake"
      }
    ]
  },
  "strategy": {
    "eyebrow": "Investment thesis",
    "title": "Four priorities guide the business",
    "items": [
      {
        "number": "01",
        "title": "Grow the core",
        "text": "Deepen customer value through better products, stronger retention, and focused market expansion.",
        "icon": "hub"
      },
      {
        "number": "02",
        "title": "Scale efficiently",
        "text": "Use reusable platforms, disciplined operations, and automation to expand without unnecessary complexity.",
        "icon": "speed"
      },
      {
        "number": "03",
        "title": "Invest selectively",
        "text": "Prioritize initiatives with clear customer impact, measurable economics, and strategic fit.",
        "icon": "track_changes"
      },
      {
        "number": "04",
        "title": "Compound trust",
        "text": "Build long-term value through transparency, reliability, responsible execution, and strong governance.",
        "icon": "verified"
      }
    ]
  },
  "highlights": {
    "eyebrow": "Investor highlights",
    "title": "Designed for clarity, not noise",
    "body": "The investor page focuses attention on the few signals that matter most: performance, strategic priorities, business momentum, and access to updates.",
    "points": [
      { "icon": "check_circle", "text": "JSON-driven content and actions" },
      { "icon": "check_circle", "text": "Accessible semantic page structure" },
      { "icon": "check_circle", "text": "Responsive Bootstrap 5 layout utilities only" },
      { "icon": "check_circle", "text": "Material-inspired surfaces, motion, elevation, and focus states" }
    ]
  },
  "updates": {
    "eyebrow": "Latest updates",
    "title": "Investor information",
    "items": [
      {
        "date": "Q2 2026",
        "title": "Quarterly results",
        "description": "Configure this card with earnings highlights, financial statements, or presentation links.",
        "icon": "description",
        "event": "mtk-investor:cta",
        "action": "quarterly-results"
      },
      {
        "date": "2026",
        "title": "Annual report",
        "description": "Configure this card with the latest annual report, shareholder letter, or filing destination.",
        "icon": "menu_book",
        "event": "mtk-investor:cta",
        "action": "annual-report"
      },
      {
        "date": "Upcoming",
        "title": "Investor events",
        "description": "Configure this card with earnings calls, conferences, webcasts, and investor meetings.",
        "icon": "event",
        "event": "mtk-investor:cta",
        "action": "investor-events"
      }
    ]
  },
  "closing": {
    "eyebrow": "Stay informed",
    "title": "Follow NALA's investor story",
    "body": "Use this area for investor alerts, shareholder communications, or direct investor-relations contact.",
    "action": {
      "label": "Investor relations",
      "icon": "arrow_forward",
      "event": "mtk-investor:contact",
      "action": "investor-relations"
    }
  },
  "events": {
    "publish": {
      "cta": "mtk-investor:cta",
      "nav": "mtk-investor:nav",
      "metric": "mtk-investor:metric",
      "contact": "mtk-investor:contact"
    },
    "subscribe": [
      "mtk-investor:cta",
      "mtk-investor:nav",
      "mtk-investor:metric",
      "mtk-investor:contact"
    ]
  },
  "mobileMenu": {
    "openLabel": "Open investor navigation",
    "closeLabel": "Close investor navigation",
    "iconOpen": "menu",
    "iconClose": "close"
  },
  "toTop": {
    "icon": "vertical_align_top",
    "label": "Back to top",
    "showAfter": 320,
    "event": "mtk-investor:nav",
    "action": "to-top"
  },
  "accessibility": {
    "navigationLabel": "Investor page navigation",
    "heroLabel": "NALA investor overview",
    "overviewLabel": "Investor overview",
    "metricsLabel": "Investor highlights",
    "principlesLabel": "NALA mission, vision, values, and investor commitment",
    "strategyLabel": "Investment priorities",
    "updatesLabel": "Investor updates",
    "closingLabel": "Investor relations contact"
  }
});

document.dispatchEvent(new CustomEvent("mtk-investor:config-ready"));
