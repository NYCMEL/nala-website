window.MTK_BIAB_CONFIG = {
  component: "mtk-biab",
  version: "1.0.6",

  labels: {
    pageTitle: "Business in a Box",
    pageSubtitle: "Launch, manage, and grow your business from one simple dashboard.",
    menu: "Menu",
    startSetup: "Start setup",
    currentSelection: "Current selection",
    closeSetup: "Close setup"
  },

  events: {
    publish: {
      ready: "mtk-biab:ready",
      select: "mtk-biab:select",
      setupOpen: "mtk-biab:setup-open",
      setupClose: "mtk-biab:setup-close"
    },
    subscribe: [
      "4-mtk-biab",
      "4-mtk-biab:select",
      "4-mtk-biab:setup-open",
      "4-mtk-biab:setup-close"
    ]
  },

  setupLorem: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue.",
    "Proin porttitor, orci nec nonummy molestie, enim est eleifend mi."
  ],

  sections: [
    {
      id: "introduction",
      label: "Introduction",
      icon: "info",
      eyebrow: "Getting started",
      title: "Introduction",
      description: "A guided overview of your Business in a Box setup.",
      includedHeading: "Included by default — <small>no action required</small>",
      includedItems: [
        "Business profile setup",
        "Basic website structure",
        "Contact information configuration",
        "Service listing template",
        "Customer review workflow"
      ]
    },
    {
      id: "website-builder",
      label: "Website Builder",
      icon: "language",
      eyebrow: "Website",
      title: "Website Builder",
      description: "Create the public website your customers will use.",
      body: "Plan the homepage, services, service area, contact details, and call-to-action structure."
    },
    {
      id: "business-card-logo",
      label: "Business Card & Logo",
      icon: "badge",
      eyebrow: "Brand",
      title: "Business Card & Logo",
      description: "Create basic brand assets for print and digital use.",
      body: "Click Start setup to choose a business card design and customize the fields.",
      setupType: "businessCard",
      cardTemplates: [
        {
          id: "card-1",
          label: "Business Card 1",
          image: "img/b-card/card-1.png"
        },
        {
          id: "card-2",
          label: "Business Card 2",
          image: "img/b-card/card-2.png"
        },
        {
          id: "card-3",
          label: "Business Card 3",
          image: "img/b-card/card-3.png"
        }
      ],
      cardFields: [
        {
          id: "businessName",
          label: "Business name",
          type: "text",
          value: "NALA Locksmith"
        },
        {
          id: "contactName",
          label: "Contact name",
          type: "text",
          value: "Mike Mason"
        },
        {
          id: "phone",
          label: "Phone",
          type: "tel",
          value: "(555) 123-4567"
        },
        {
          id: "email",
          label: "Email",
          type: "email",
          value: "info@example.com"
        },
        {
          id: "website",
          label: "Website",
          type: "url",
          value: "www.example.com"
        },
        {
          id: "serviceArea",
          label: "Service area",
          type: "text",
          value: "New Jersey"
        }
      ]
    },
    {
      id: "marketing-seo",
      label: "Marketing, SEO",
      icon: "campaign",
      eyebrow: "Growth",
      title: "Marketing, SEO",
      description: "Set up discoverability, search basics, and launch messaging.",
      body: "Organize local search terms, Google profile details, review prompts, and starter marketing copy."
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: "receipt_long",
      eyebrow: "Operations",
      title: "Invoices",
      description: "Prepare invoices for completed locksmith jobs.",
      body: "Define invoice labels, line items, service notes, payment terms, and customer receipt details."
    },
    {
      id: "customer-reviews",
      label: "Customer Reviews",
      icon: "reviews",
      eyebrow: "Reputation",
      title: "Customer Reviews",
      description: "Build a simple review request workflow.",
      body: "Create a repeatable process for asking satisfied customers for reviews after completed work."
    }
  ]
};