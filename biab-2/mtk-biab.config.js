const MTK_BIAB_CONFIG = {
  "component": "mtk-biab",
  "version": "1.0.0",
  "brand": {
    "eyebrow": "Business in a Box",
    "title": "Business in a Box",
    "subtitle": "Launch, manage, and grow your locksmith business from one simple dashboard.",
    "mobileMenuLabel": "Menu",
    "closeLabel": "Close setup",
    "startSetupLabel": "Start setup",
    "setupEyebrow": "Current selection",
    "setupBody": [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
      "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus auctor fringilla.",
      "Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum."
    ]
  },
  "events": {
    "publish": {
      "ready": "mtk-biab:ready",
      "navSelect": "mtk-biab:nav-select",
      "setupOpen": "mtk-biab:setup-open",
      "setupClose": "mtk-biab:setup-close"
    },
    "subscribe": [
      "4-mtk-biab",
      "4-mtk-biab:select",
      "4-mtk-biab:open-setup",
      "4-mtk-biab:close-setup"
    ]
  },
  "sections": [
    {
      "id": "introduction",
      "label": "Introduction",
      "icon": "info",
      "eyebrow": "Getting started",
      "title": "Introduction",
      "description": "A guided overview of your Business in a Box setup.",
      "body": "Start here to understand the tools, setup flow, and launch checklist."
    },
    {
      "id": "website-builder",
      "label": "Website Builder",
      "icon": "language",
      "eyebrow": "Website",
      "title": "Website Builder",
      "description": "Create the public website your customers will use.",
      "body": "Plan the homepage, services, service area, contact details, and call-to-action structure."
    },
    {
      "id": "business-card-logo",
      "label": "Business Card & Logo",
      "icon": "badge",
      "eyebrow": "Brand",
      "title": "Business Card & Logo",
      "description": "Create basic brand assets for print and digital use.",
      "body": "Prepare a simple logo direction, business card content, colors, and contact information."
    },
    {
      "id": "marketing-seo",
      "label": "Marketing, SEO",
      "icon": "campaign",
      "eyebrow": "Growth",
      "title": "Marketing, SEO",
      "description": "Set up discoverability, search basics, and launch messaging.",
      "body": "Organize local search terms, Google profile details, review prompts, and starter marketing copy."
    },
    {
      "id": "invoices",
      "label": "Invoices",
      "icon": "receipt_long",
      "eyebrow": "Operations",
      "title": "Invoices",
      "description": "Prepare invoices for completed locksmith jobs.",
      "body": "Define invoice labels, line items, service notes, payment terms, and customer receipt details."
    },
    {
      "id": "customer-reviews",
      "label": "Customer Reviews",
      "icon": "reviews",
      "eyebrow": "Reputation",
      "title": "Customer Reviews",
      "description": "Build a simple review request workflow.",
      "body": "Create a repeatable process for asking satisfied customers for reviews after completed work."
    }
  ]
};