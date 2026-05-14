window.MTK_BIAB_CONFIG = {
  component: "mtk-biab",
  version: "1.0.10",
  labels: {
    pageTitle: "Business in a Box",
    pageSubtitle: "Follow the steps below. Each section tells you what to click, what to enter, and what happens next.",
    startSetup: "Start this step",
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
      "4-mtk-biab:logo-loaded",
      "4-mtk-biab:logo-options",
      "4-mtk-biab:logo-saved",
      "4-mtk-biab:google-seo-status"
    ]
  },
  sections: [
    {
      id: "introduction",
      label: "Introduction",
      icon: "info",
      eyebrow: "Getting started",
      title: "Start here",
      description: "Use this checklist first. Click each item under Things you need to do, finish that step, then come back here for the next one.",
      nextStep: "Start with Business profile setup. Click it, fill in your business name, phone number, email, website, service area, and services, then click Save.",
      includedHeading: "Your setup checklist",
      includedItems: [
        { setupKey: "business-info", label: "Click here to enter your business information", actionRequired: true, page: "settings", settingsTab: "business", description: "Enter the information customers should see, such as your business name, phone number, email, website, and hours. Click Save when you are done." },
        { setupKey: "services-offered", label: "Click here to choose your services offered", actionRequired: true, page: "settings", settingsTab: "services", description: "Enter your service area, check every service you offer, then click Save services offered." },
        { setupKey: "client-url", label: "Click here to choose your client URL", actionRequired: true, sectionId: "client-url", openSetup: true, description: "Choose the short website URL customers will use, then click Save this URL." },
        { setupKey: "logo", label: "Click here to create your logo", actionRequired: true, sectionId: "logo", openSetup: true, description: "Generate logo options, choose the one you like, then click Save this logo. Your business card and website will use the saved logo." },
        { setupKey: "business-card", label: "Click here to choose your business card", actionRequired: true, sectionId: "business-card", openSetup: true, description: "Choose the card you want, check the name, phone, email, website, and service area, then click Order this business card." },
        { setupKey: "google-setup", label: "Click here to send your Google setup email", actionRequired: true, sectionId: "google-seo", description: "Click the button in the Google section. You will receive step-by-step instructions for approving Google setup." },
        { setupKey: "website-pages", label: "Website pages", done: false, description: "NALA creates your website pages for you. This is checked after your business name, phone, email, and services are saved." },
        { setupKey: "contact-details", label: "Contact details shared across BIAB", done: false, description: "After you save your phone number, email, and website, NALA uses them on the website, business cards, invoices, and review requests." },
        { setupKey: "review-requests", label: "Review requests", done: true, description: "When you save an invoice, NALA automatically asks the customer for a review. You do not need to check a box." },
        { setupKey: "google-website", label: "Google website setup", done: false, description: "NALA prepares your website for Google. This is checked after the Google setup email is sent." },
        { setupKey: "local-listing-info", label: "Local listing information", done: false, description: "NALA keeps your business name, phone, website, hours, service area, and services ready for local business listings." }
      ],
      hideStartSetup: true
    },
    {
      id: "website-builder",
      label: "Website Builder",
      icon: "language",
      eyebrow: "Website",
      title: "Website Builder",
      description: "Preview the website your customers will see.",
      body: "Click Start this step to open the website preview. If something is missing, go back to Profile & Settings and save the missing business information.",
      nextStep: "Click Start this step to open the website. Review the phone number, email, website link, services, and service area.",
      links: [
        { label: "Open your website preview", href: "client/index.html" }
      ],
      setupType: "websiteBuilder",
      clientUrl: "client/index.html"
    },
    {
      id: "client-url",
      label: "Client URL",
      icon: "link",
      eyebrow: "Website",
      title: "Client URL",
      description: "Choose the short URL customers will use for this business.",
      body: "Click Start this step, review the URL options, choose one, then click Save this URL.",
      nextStep: "Pick the URL that is easiest to say, type, and remember. The business card, website, and Google setup will use the saved URL.",
      setupType: "clientUrl"
    },
    {
      id: "google-seo",
      label: "Google SEO",
      icon: "travel_explore",
      eyebrow: "Search",
      title: "Google Setup",
      description: "Send yourself a simple email that tells you exactly how to approve Google setup.",
      body: "Click Send Google setup email. You will get step-by-step instructions. NALA support will also get the business details needed for the next steps.",
      nextStep: "Click Send Google setup email. Then open the email from NALA and follow the steps in order.",
      links: [
        { label: "Open Google Business Profile setup", href: "https://business.google.com/add", external: true }
      ],
      viewType: "googleSeo",
      hideStartSetup: true,
      workflow: [
        { label: "Website information", status: "Ready", description: "NALA uses the saved business information to prepare the website for Google." },
        { label: "Google approval", status: "Needs your action", description: "You must approve Google access before NALA can finish the Google steps." },
        { label: "Business verification", status: "Needs your action", description: "Google may ask you to verify by email, phone, text, video, or postcard. The email explains what to do." },
        { label: "Local listing details", status: "Ready", description: "NALA keeps the business name, phone, website, service area, hours, services, and description ready for listings." }
      ]
    },
    {
      id: "logo",
      label: "Logo",
      icon: "auto_awesome",
      eyebrow: "Brand",
      title: "Logo",
      description: "Create logo options for your business before you choose a business card.",
      body: "Click Start this step, check the business information, generate logo options, choose one, then click Save this logo.",
      nextStep: "Click Start this step. If your business name or service area is missing, go back to Profile & Settings first. Then generate options and save the logo you want.",
      setupType: "logo",
      provider: {
        id: "zoviz",
        label: "Logo Generator",
        testingNote: "The logo generator key is loaded from the site config file."
      }
    },
    {
      id: "business-card",
      label: "Business Card",
      icon: "badge",
      eyebrow: "Brand",
      title: "Business Card",
      description: "Choose the business card you will receive.",
      body: "Click Start this step. Pick one card design, check the contact details, then click Order this business card. If you saved a logo in the Logo step, it will appear on the card. After the card is ordered, this section is locked.",
      nextStep: "Click Start this step, choose one design, then click Order this business card. On the next screen, check every field before you submit.",
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
      description: "Create invoices and send review requests.",
      body: "Click Create a new invoice to enter the customer and job details. When you save the invoice, NALA automatically sends the customer a review request.",
      nextStep: "Click Create a new invoice. Fill in the customer name, customer email, job details, and price, then click Save invoice.",
      viewType: "invoices",
      hideStartSetup: true,
      newInvoiceLabel: "Create a new invoice",
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
      description: "See the reviews customers have sent in.",
      body: "After an invoice is saved, NALA asks that customer for a review automatically. Check this page to see the reviews that came in.",
      nextStep: "To get a new review, go to Invoices and click Create a new invoice. Saving the invoice sends the review request.",
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
