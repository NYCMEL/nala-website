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
      "4-mtk-biab:setup-close",
      "4-mtk-biab:invoices-loaded",
      "4-mtk-biab:invoice-saved",
      "4-mtk-biab:invoice-emailed",
      "4-mtk-biab:card-order-loaded",
      "4-mtk-biab:google-seo-status"
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
      includedHeading: "Included by default - no action required",
      includedItems: [
        { label: "Business profile setup", actionRequired: true, page: "settings", settingsTab: "business", description: "Save the business name, phone, email, service area, hours, and services offered once so the website, cards, invoices, and review flow can reuse the same profile data." },
        { label: "Business card choice", actionRequired: true, sectionId: "business-card-logo", openSetup: true, description: "Choose one business card design. Once ordered, the card choice is locked so the print workflow stays consistent." },
        { label: "Google authorization", actionRequired: true, sectionId: "google-seo", description: "Authorize or invite NALA to the business Google account when you want us to submit Search Console and Google Business Profile updates for you." },
        { label: "Basic website structure", done: true, description: "The client website is generated with a homepage, service positioning, contact details, reviews, and trust sections." },
        { label: "Contact information configuration", done: true, description: "Public contact fields flow from Profile & Settings into the website, cards, and invoices." },
        { label: "Service listing template", done: true, description: "Locksmith services are organized for residential, commercial, rekey, lock change, deadbolt, lockout, and emergency-service pages." },
        { label: "Customer review workflow", done: true, description: "Invoices and customer follow-up send customers to the hosted review page so reviews can be collected and displayed automatically." },
        { label: "SEO setup", done: true, description: "On-site SEO for hosted client pages is automatic. NALA generates titles, descriptions, service-area copy, internal links, review schema, local business schema, sitemap entries, and Google-ready profile data exports." },
        { label: "Local listings checklist", done: true, description: "NALA prepares consistent name, address/service area, phone, website, hours, services, photos, and description for Google Business Profile, Bing Places, Apple Business Connect, Yelp, BBB, Angi, Thumbtack, Nextdoor, and local citation sites." }
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
      id: "google-seo",
      label: "Google SEO",
      icon: "travel_explore",
      eyebrow: "Search",
      title: "Google SEO Automation",
      description: "Prepare the hosted website, Search Console submission, and Google Business Profile data from the same business profile.",
      body: "NALA automatically prepares the on-site SEO and Google-ready business data. Google Search Console and Google Business Profile submissions require the client to authorize the correct Google account or add NALA as a manager first.",
      viewType: "googleSeo",
      hideStartSetup: true,
      workflow: [
        { label: "Hosted website SEO", status: "Automatic", description: "Titles, descriptions, local business schema, review schema, internal links, and sitemap-ready URLs are generated from the business profile." },
        { label: "Search Console sitemap", status: "Needs authorization", description: "After the Google account has access to the website property, NALA can submit the sitemap through the Search Console API." },
        { label: "Google Business Profile", status: "Needs authorization", description: "The owner must claim or verify the profile, then NALA can prepare and manage eligible location details with approved access." },
        { label: "Local SEO data package", status: "Prepared", description: "Name, phone, website, service area, hours, services, and description are kept consistent for listings and citation work." }
      ]
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
