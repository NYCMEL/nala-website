window.MTK_BIAB_CONFIG = {
  component: "mtk-biab",
  version: "1.0.9",
  labels: {
    pageTitle: "Business in a Box",
    pageSubtitle: "Launch, manage, and grow your business from one simple dashboard.",
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
      ],
      hideStartSetup: true
    },
    {
      id: "website-builder",
      label: "Website Builder",
      icon: "language",
      eyebrow: "Website",
      title: "Website Builder",
      description: "Create the public website your customers will use.",
      body: "Click Start setup to open the website builder using content from the client folder.",
      setupType: "websiteBuilder",
      clientUrl: "client/index.html"
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
        { id: "card-1", label: "Business Card 1", image: "img/b-card/card-1.png" },
        { id: "card-2", label: "Business Card 2", image: "img/b-card/card-2.png" },
        { id: "card-3", label: "Business Card 3", image: "img/b-card/card-3.png" }
      ],
      cardFields: [
        { id: "businessName", label: "Business name", type: "text", value: "" },
        { id: "contactName", label: "Contact name", type: "text", value: "" },
        { id: "phone", label: "Phone", type: "tel", value: "" },
        { id: "email", label: "Email", type: "email", value: "" },
        { id: "website", label: "Website", type: "url", value: "" },
        { id: "serviceArea", label: "Service area", type: "text", value: "" }
      ]
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: "receipt_long",
      eyebrow: "Operations",
      title: "Invoices",
      description: "Track invoices, clients, dates, status, and payment totals.",
      body: "Use the invoice table to review and manage invoices.",
      viewType: "invoices",
      hideStartSetup: true,
      newInvoiceLabel: "New Invoice",
      invoices: [
        { id: "INV-1005", date: "2026-05-05", client: "Maria Garcia", service: "Deadbolt installation", amount: 265.00, status: "Open" },
        { id: "INV-1002", date: "2026-05-02", client: "Acme Property Group", service: "Commercial lock change", amount: 540.00, status: "Open" },
        { id: "INV-1001", date: "2026-05-01", client: "Jane Customer", service: "Residential rekey", amount: 185.00, status: "Paid" },
        { id: "INV-1004", date: "2026-05-04", client: "Northside Realty", service: "Master key consultation", amount: 320.00, status: "Draft" },
        { id: "INV-1003", date: "2026-05-03", client: "Robert Lee", service: "House lockout", amount: 125.00, status: "Paid" }
      ]
    },
    {
      id: "customer-reviews",
      label: "Customer Reviews",
      icon: "reviews",
      eyebrow: "Reputation",
      title: "Customer Reviews",
      description: "Build a simple review request workflow.",
      body: "Review recent customer feedback and ratings.",
      viewType: "reviews",
      hideStartSetup: true,
      reviewsHeading: "Reviews",
      reviews: [
        { id: "REV-1001", rating: 5, date: "2026-05-01", notes: "Fast response, professional service, and the lock was repaired correctly the first time." },
        { id: "REV-1002", rating: 4, date: "2026-05-02", notes: "Good work and fair pricing, technician arrived within the promised window." },
        { id: "REV-1003", rating: 5, date: "2026-05-03", notes: "Excellent customer service and clean installation of the new deadbolt." },
        { id: "REV-1004", rating: 3, date: "2026-05-04", notes: "Service was completed, but arrival time was later than expected." },
        { id: "REV-1005", rating: 5, date: "2026-05-05", notes: "Very helpful and explained everything before starting the job." }
      ]
    }
  ],
  invoiceForm: {
    fields: [
      { id: "businessName", label: "Business Name", type: "text", sample: "Example: ABC Locksmith Services" },
      { id: "invoiceNumber", label: "Invoice #", type: "text", sample: "Example: INV-1001" },
      { id: "businessPhone", label: "Business Phone", type: "tel", sample: "Example: (555) 555-5555" },
      { id: "invoiceDate", label: "Invoice Date", type: "date", sample: "Example: 2026-04-29" },
      { id: "customerName", label: "Customer Name", type: "text", sample: "Example: Jane Smith" },
      { id: "customerPhone", label: "Customer Phone", type: "tel", sample: "Example: (555) 123-4567" },
      { id: "serviceAddress", label: "Service Address", type: "text", sample: "Example: 123 Main Street, Tampa, FL" },
      { id: "serviceType", label: "Service Type", type: "select", sample: "Example: Lockout Service" },
      { id: "serviceFee", label: "Service Fee", type: "number", sample: "Example: 95" },
      { id: "partsMaterials", label: "Parts / Materials", type: "number", sample: "Example: 25" },
      { id: "emergencyFee", label: "Emergency Fee", type: "number", sample: "Example: 50" },
      { id: "discount", label: "Discount", type: "number", sample: "Example: 10" },
      { id: "taxRate", label: "Tax Rate %", type: "number", sample: "Example: 6.625" },
      { id: "notes", label: "Notes", type: "textarea", sample: "Example: Rekeyed front door lock and tested keys." }
    ]
  }
};