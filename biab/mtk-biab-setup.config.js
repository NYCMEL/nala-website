window.MTK_BIAB_SETUP_CONFIG = {
  version: "1.0.0",
  supportEmail: "support@nalanetwork.com",
  storageKey: "nala_biab_setup_state_v1",
  tools: [
    { id: "setup", label: "Edit setup", icon: "tune", href: "biab/index.html" },
    { id: "website", label: "Website", icon: "language", href: "client/index.html" },
    { id: "invoices", label: "Invoice Generator", icon: "receipt_long", href: "biab/index.html?tool=invoices" },
    { id: "reviews", label: "Reviews", icon: "reviews", href: "biab/index.html?tool=reviews" },
    { id: "business-plan", label: "Business Plan", icon: "article", href: "biab/index.html?tool=business-plan" },
    { id: "brand", label: "Brand Kit", icon: "palette", href: "biab/index.html?tool=brand" },
    { id: "marketing", label: "Marketing Setup", icon: "campaign", href: "biab/index.html?tool=marketing" }
  ],
  palettes: [
    {
      id: "midnight-brass",
      name: "Trust Navy + Brass",
      position: "Premium residential and commercial locksmith",
      colors: ["#0f172a", "#c6952d", "#f8fafc", "#d9dee8"]
    },
    {
      id: "professional-steel",
      name: "Professional Blue + Steel",
      position: "Broad local-service trust and clean credibility",
      colors: ["#123a63", "#4f7fa8", "#f7f9fb", "#b9c4cf"]
    },
    {
      id: "charcoal-signal",
      name: "Charcoal + Safety Yellow",
      position: "Emergency, mobile, and 24/7 positioning",
      colors: ["#20242a", "#f2c94c", "#ffffff", "#6b7280"]
    },
    {
      id: "forest-slate",
      name: "Forest Green + Slate",
      position: "Dependable neighborhood locksmith service",
      colors: ["#163126", "#7dbb8b", "#f7fbf8", "#475569"]
    },
    {
      id: "security-metal",
      name: "Black + Brushed Metal + Amber",
      position: "High-security and commercial access work",
      colors: ["#111111", "#9ca3af", "#f59e0b", "#ffffff"]
    },
    {
      id: "heritage-burgundy",
      name: "Burgundy + Charcoal + Cream",
      position: "Established family-owned service brand",
      colors: ["#6d1f2f", "#2f3033", "#fff8ea", "#b89662"]
    }
  ],
  steps: [
    {
      id: "intro",
      navLabel: "Intro",
      title: "Business in a Box setup",
      eyebrow: "Start here",
      kind: "intro",
      summary: "A guided setup for the business profile, legal reminders, finances, brand, actual website, local presence, invoices, reviews, and launch readiness.",
      fields: []
    },
    {
      id: "business-background",
      navLabel: "Background",
      title: "Business background",
      eyebrow: "Shared business profile",
      summary: "Enter the core business information once. These answers feed the website, invoices, business plan, Google setup, reviews, and marketing materials.",
      fields: [
        { id: "businessName", label: "Customer-facing business name", type: "text", placeholder: "Harbor Lock & Key", required: true },
        { id: "legalName", label: "Legal business name", type: "text", placeholder: "Harbor Lock & Key LLC" },
        { id: "ownerName", label: "Owner or responsible party name", type: "text", placeholder: "Owner name" },
        { id: "businessPhone", label: "Business phone", type: "tel", placeholder: "(555) 123-4567", required: true },
        { id: "businessEmail", label: "Business email", type: "email", placeholder: "service@example.com", required: true },
        { id: "hours", label: "Business hours", type: "text", placeholder: "Mon-Fri 8am-6pm; emergency calls by appointment" },
        { id: "serviceArea", label: "Service area", type: "textarea", placeholder: "Brooklyn, Queens, Manhattan", required: true, rows: 2, full: true },
        { id: "services", label: "Launch services", type: "checks", options: ["House lockouts", "Rekeys", "Lock changes", "Deadbolt installation", "Mailbox / cabinet locks", "Car lockouts", "Basic commercial lock service"] },
        { id: "additionalLaunchServices", label: "Additional launch services", type: "textarea", placeholder: "Add any other services you want to offer at launch.", rows: 3, full: true },
        { id: "businessDescription", label: "Short business description", type: "textarea", placeholder: "Mobile locksmith service focused on clear pricing, fast response, and clean work.", rows: 3, full: true }
      ]
    },
    {
      id: "legal",
      navLabel: "Legal",
      title: "Legal operating setup",
      eyebrow: "Guided setup, not legal advice",
      summary: "Use official resources to register the business, confirm licensing, apply for an EIN, record insurance, and document operating policies.",
      sourceNote: "External instructions are based on official IRS and SBA guidance checked before implementation. Locksmith licensing varies by state, county, and city.",
      fields: [
        { id: "entityType", label: "Business structure chosen", type: "select", options: ["Not decided", "Sole proprietor", "LLC", "Corporation", "Partnership"] },
        { id: "stateRegistration", label: "State registration status", type: "select", options: ["Not started", "In progress", "Completed", "Not required / verified"] },
        { id: "ein", label: "EIN", type: "text", placeholder: "__-_______", helper: "The IRS says the online EIN application is free, completed in one session, and generally issues the EIN immediately when approved." },
        { id: "licenseNotes", label: "License and local registration notes", type: "textarea", placeholder: "State license checked; city business license application submitted..." },
        { id: "insuranceStatus", label: "Insurance status", type: "select", options: ["Not started", "Quotes requested", "Policy active", "Not required / verified"] },
        { id: "authorizationPolicy", label: "Authorization before entry policy", type: "textarea", placeholder: "Verify customer identity and authorization before opening, rekeying, or changing locks." }
      ],
      links: [
        { label: "IRS EIN information", href: "https://www.irs.gov/businesses/employer-identification-number" },
        { label: "IRS online EIN tool", href: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number" },
        { label: "SBA launch your business", href: "https://www.sba.gov/business-guide/launch-your-business" }
      ],
      instructions: [
        "Confirm the business structure before applying for an EIN if the business is forming an LLC, corporation, partnership, or other state-created entity.",
        "Open the IRS EIN tool only when the responsible party is ready to finish in one session.",
        "Use the legal business name and responsible party information from the Business Background step.",
        "Save the EIN confirmation letter, then enter the EIN here.",
        "Check state, county, and city locksmith/business licensing rules and record the result in the notes field."
      ]
    },
    {
      id: "financial",
      navLabel: "Financial",
      title: "Financial operating setup",
      eyebrow: "Cash, payments, and records",
      summary: "Set up the money side of the locksmith business: bank account, payment processor, bookkeeping habit, pricing assumptions, and weekly metrics.",
      fields: [
        { id: "bankStatus", label: "Business bank account status", type: "select", options: ["Not started", "Appointment scheduled", "Account open", "Using existing account"] },
        { id: "paymentProcessor", label: "Payment processor", type: "select", options: ["Not selected", "Stripe", "Square", "QuickBooks Payments", "Other"] },
        { id: "processorAccountId", label: "Processor account/reference ID", type: "text", placeholder: "Optional" },
        { id: "bookkeepingStatus", label: "Bookkeeping setup", type: "select", options: ["Not started", "Spreadsheet", "QuickBooks", "Wave", "Other"] },
        { id: "pricingNotes", label: "Pricing notes", type: "textarea", placeholder: "Trip fee, lockout rate, rekey per cylinder, after-hours policy..." }
      ],
      links: [
        { label: "SBA open a business bank account", href: "https://www.sba.gov/business-guide/launch-your-business/open-business-bank-account" },
        { label: "Stripe account setup", href: "https://docs.stripe.com/get-started/account" }
      ],
      instructions: [
        "Use the EIN and legal business name from Legal Setup when opening a bank account.",
        "Choose a payment processor that supports the way the locksmith will collect payment in the field.",
        "Record the processor reference here after activation.",
        "Write down the starting pricing rules before the first paid job."
      ]
    },
    {
      id: "brand",
      navLabel: "Brand",
      title: "Brand system",
      eyebrow: "Production fonts and icons later",
      summary: "Choose a brand direction that can carry through the actual website, logo, invoices, review emails, stationery, ads, and other marketing.",
      fields: [
        { id: "palette", label: "Color scheme", type: "palette" },
        { id: "brandTone", label: "Brand tone", type: "select", options: ["Premium security", "Fast emergency service", "Neighborhood trust", "Commercial access control", "Family-owned established"] },
        { id: "tagline", label: "Tagline", type: "text", placeholder: "Mobile Locksmith Service" },
        { id: "logoStatus", label: "Logo status", type: "select", options: ["Use generated placeholder", "Upload existing logo", "Production logo needed later"] }
      ]
    },
    {
      id: "local-presence",
      navLabel: "Local",
      title: "Google Business Profile setup",
      eyebrow: "Assisted external setup",
      summary: "Create or claim the Google Business Profile, set the right business type/service area, complete core fields, and record profile status.",
      sourceNote: "Instructions are based on current Google Business Profile help pages checked before implementation.",
      fields: [
        { id: "googleProfileStatus", label: "Google Business Profile status", type: "select", options: ["Not started", "Added / claimed", "Verification in progress", "Verified", "Needs attention"] },
        { id: "googleProfileUrl", label: "Google profile URL", type: "url", placeholder: "https://..." },
        { id: "googleVerificationMethod", label: "Verification method offered by Google", type: "select", options: ["Not offered yet", "Video recording", "Phone or SMS", "Email", "Postcard", "Instant / Search Console", "Other"] },
        { id: "serviceAreaConfirmed", label: "Service-area setup confirmed", type: "checkbox" }
      ],
      links: [
        { label: "Add or claim Business Profile", href: "https://support.google.com/business/answer/2911778" },
        { label: "Manage service areas", href: "https://support.google.com/business/answer/9157481" },
        { label: "Verify your business", href: "https://support.google.com/business/answer/7107242" }
      ],
      instructions: [
        "Open Google Business Profile with the business Google account.",
        "Add a new business if no profile exists, or claim the existing profile if Google already shows it.",
        "Use the business name from Business Background.",
        "Choose Locksmith as the category when available.",
        "If customers do not visit a staffed storefront, set it up as a service-area business and remove/hide the address when Google asks.",
        "Enter only practical service areas. Google documents that up to 20 service areas can be selected.",
        "Choose the verification option Google offers and return here to record the method and status."
      ]
    },
    {
      id: "seo",
      navLabel: "SEO",
      title: "SEO and Search Console setup",
      eyebrow: "Actual website visibility",
      summary: "Prepare the actual locksmith website for search engines and connect Search Console after the live URL/domain is ready.",
      sourceNote: "Instructions are based on Google Search Console and Search Central documentation checked before implementation.",
      fields: [
        { id: "websiteUrl", label: "Actual website URL", type: "url", placeholder: "https://example.com" },
        { id: "searchConsoleStatus", label: "Search Console status", type: "select", options: ["Not started", "Property added", "Ownership verified", "Sitemap submitted", "Needs attention"] },
        { id: "sitemapUrl", label: "Sitemap URL", type: "url", placeholder: "https://example.com/sitemap.xml" },
        { id: "primaryKeywords", label: "Primary local search terms", type: "textarea", placeholder: "locksmith near me, rekey locks, house lockout, lock change..." }
      ],
      links: [
        { label: "Search Console", href: "https://search.google.com/search-console/welcome" },
        { label: "Verify site ownership", href: "https://support.google.com/webmasters/answer/9008080" },
        { label: "Google SEO starter guide", href: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" }
      ],
      instructions: [
        "Open Search Console and add the actual website property.",
        "Choose an available verification method and follow Google's instructions.",
        "Record the verified status here after Search Console accepts the property.",
        "Submit the sitemap after verification if the live website provides one.",
        "Use honest local service terms and avoid fake city pages."
      ]
    },
    {
      id: "invoices",
      navLabel: "Invoices",
      title: "Invoice setup",
      eyebrow: "Field closeout tool",
      summary: "Configure the standalone invoice generator. The locksmith can use it on-site without going through the website flow.",
      fields: [
        { id: "invoicePrefix", label: "Invoice prefix", type: "text", placeholder: "HLK" },
        { id: "invoiceEmail", label: "Invoice sender email", type: "email", placeholder: "billing@example.com" },
        { id: "invoiceTerms", label: "Payment terms", type: "textarea", placeholder: "Payment due upon completion unless otherwise agreed." },
        { id: "askReviewDefault", label: "Ask for a review by default after sending an invoice", type: "checkbox" }
      ]
    },
    {
      id: "reviews",
      navLabel: "Reviews",
      title: "Review workflow setup",
      eyebrow: "Close the job with reputation",
      summary: "Set the review request habit. Invoices can include a checkbox to automatically send a review request to the customer email.",
      fields: [
        { id: "reviewEmailFrom", label: "Review request reply-to email", type: "email", placeholder: "service@example.com" },
        { id: "reviewMessage", label: "Default review request message", type: "textarea", placeholder: "Thank you for choosing us. If you were happy with the service, please leave a review." },
        { id: "reviewPublicUrl", label: "Public review page URL", type: "url", placeholder: "Generated or connected later" }
      ],
      links: [
        { label: "FTC CAN-SPAM business guide", href: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business" }
      ],
      instructions: [
        "Use review requests for customers who received completed service.",
        "Keep the message short and honest.",
        "Use a real reply-to email and keep business contact information accurate.",
        "When sending an invoice, leave 'Ask for a review' checked when the customer email is correct."
      ]
    },
    {
      id: "launch",
      navLabel: "Launch",
      title: "Launch review",
      eyebrow: "Ready to operate",
      kind: "launch",
      summary: "Review the business setup, actual website readiness, invoice workflow, and review workflow before treating the launch as complete.",
      fields: [
        { id: "launchApproved", label: "I reviewed the setup and am ready to use Business in a Box tools", type: "checkbox" }
      ]
    }
  ]
};
