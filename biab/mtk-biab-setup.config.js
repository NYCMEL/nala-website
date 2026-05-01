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
      position: "Confident, established, and polished",
      colors: ["#0f172a", "#c6952d", "#f8fafc", "#d9dee8"]
    },
    {
      id: "professional-steel",
      name: "Professional Blue + Steel",
      position: "Crisp, clear, and highly credible",
      colors: ["#123a63", "#4f7fa8", "#f7f9fb", "#b9c4cf"]
    },
    {
      id: "charcoal-signal",
      name: "Charcoal + Safety Yellow",
      position: "Visible, direct, and action-oriented",
      colors: ["#20242a", "#f2c94c", "#ffffff", "#6b7280"]
    },
    {
      id: "forest-slate",
      name: "Forest Green + Slate",
      position: "Calm, grounded, and dependable",
      colors: ["#163126", "#7dbb8b", "#f7fbf8", "#475569"]
    },
    {
      id: "security-metal",
      name: "Black + Brushed Metal + Amber",
      position: "Precise, technical, and premium",
      colors: ["#111111", "#9ca3af", "#f59e0b", "#ffffff"]
    },
    {
      id: "heritage-burgundy",
      name: "Burgundy + Charcoal + Cream",
      position: "Warm, traditional, and memorable",
      colors: ["#6d1f2f", "#2f3033", "#fff8ea", "#b89662"]
    },
    {
      id: "coastal-teal",
      name: "Coastal Teal + Graphite",
      position: "Modern, calm, and approachable",
      colors: ["#0f3f46", "#2fb7a8", "#f5fbfa", "#334155"]
    },
    {
      id: "graphite-copper",
      name: "Graphite + Copper",
      position: "Strong, crafted, and refined",
      colors: ["#24272d", "#b66a38", "#f7f2ec", "#6b7280"]
    },
    {
      id: "royal-lime",
      name: "Royal Blue + Fresh Lime",
      position: "Energetic, friendly, and easy to notice",
      colors: ["#173d8f", "#a3d635", "#f8fafc", "#1f2937"]
    },
    {
      id: "evergreen-gold",
      name: "Evergreen + Soft Gold",
      position: "Stable, respectful, and trustworthy",
      colors: ["#12352f", "#d6b35a", "#fbfaf4", "#4b5563"]
    },
    {
      id: "black-red",
      name: "Black + White + Signal Red",
      position: "Bold, simple, and memorable",
      colors: ["#0b0b0c", "#d62828", "#ffffff", "#7b8794"]
    },
    {
      id: "sky-slate",
      name: "Sky Blue + Slate",
      position: "Open, clean, and reassuring",
      colors: ["#075985", "#38bdf8", "#f8fafc", "#475569"]
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
        { id: "services", label: "Launch services", type: "checks", required: true, options: ["House lockouts", "Rekeys", "Lock changes", "Deadbolt installation", "Mailbox / cabinet locks", "Car lockouts", "Basic commercial lock service"] },
        { id: "additionalLaunchServices", label: "Additional launch services", type: "textarea", placeholder: "Add any other services you want to offer at launch.", rows: 3, full: true },
        { id: "businessDescription", label: "Short business description", type: "textarea", placeholder: "Mobile locksmith service focused on clear pricing, fast response, and clean work.", required: true, rows: 3, full: true }
      ]
    },
    {
      id: "legal",
      navLabel: "Legal",
      title: "Legal operating setup",
      eyebrow: "Guided setup, not legal advice",
      summary: "Use official resources to register your business, confirm licensing, apply for an EIN, record insurance, and document operating policies.",
      sourceNote: "External instructions are based on official IRS and SBA guidance checked before implementation. Locksmith licensing varies by state, county, and city.",
      fields: [
        { id: "entityType", label: "Business structure chosen", type: "select", required: true, options: ["Not decided", "Sole proprietor", "LLC", "Corporation", "Partnership"] },
        { id: "stateRegistration", label: "State registration status", type: "select", required: true, incompleteValues: ["Not started", "In progress"], options: ["Not started", "In progress", "Completed", "Not required / verified"] },
        { id: "ein", label: "EIN", type: "text", placeholder: "__-_______", required: true, helper: "The IRS says the online EIN application is free, completed in one session, and generally issues the EIN immediately when approved." },
        { id: "licenseNotes", label: "License and local registration notes", type: "textarea", placeholder: "State license checked; city business license application submitted...", required: true },
        { id: "insuranceStatus", label: "Insurance status", type: "select", required: true, incompleteValues: ["Not started", "Quotes requested"], options: ["Not started", "Quotes requested", "Policy active", "Not required / verified"] },
        { id: "authorizationPolicy", label: "Authorization before entry policy", type: "textarea", placeholder: "Verify customer identity and authorization before opening, rekeying, or changing locks.", required: true }
      ],
      links: [
        { label: "IRS EIN information", href: "https://www.irs.gov/businesses/employer-identification-number" },
        { label: "IRS online EIN tool", href: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number" },
        { label: "SBA launch your business", href: "https://www.sba.gov/business-guide/launch-your-business" }
      ],
      instructions: [
        "Confirm your business structure before applying for an EIN if you are forming an LLC, corporation, partnership, or other state-created entity.",
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
      summary: "Set up your money operations: bank account, payment processor, bookkeeping habit, pricing assumptions, and weekly metrics.",
      fields: [
        { id: "bankStatus", label: "Business bank account status", type: "select", required: true, incompleteValues: ["Not started", "Appointment scheduled"], options: ["Not started", "Appointment scheduled", "Account open", "Using existing account"] },
        { id: "paymentProcessor", label: "Payment processor", type: "select", required: true, options: ["Not selected", "Stripe", "Square", "QuickBooks Payments", "PayPal Business", "Wave Payments", "Other"] },
        { id: "processorAccountId", label: "Processor account/reference ID", type: "text", placeholder: "Optional" },
        { id: "bookkeepingStatus", label: "Bookkeeping setup", type: "select", required: true, options: ["Not started", "Spreadsheet", "QuickBooks", "Wave", "Other"] },
        { id: "pricingNotes", label: "Pricing notes", type: "textarea", placeholder: "Trip fee, lockout rate, rekey per cylinder, after-hours policy...", required: true }
      ],
      links: [
        { label: "SBA open a business bank account", href: "https://www.sba.gov/business-guide/launch-your-business/open-business-bank-account" }
      ],
      instructions: [
        "Use the EIN and legal business name from Legal Setup when opening a bank account.",
        "Choose a payment processor that supports the way you will collect payment in the field.",
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
        { id: "palette", label: "Color scheme", type: "palette", required: true },
        { id: "brandToneExplainer", label: "Color scheme vs. brand tone", type: "info", text: "Color scheme controls the visual look across the website, logo, invoices, and marketing. Brand tone controls the wording style: how direct, warm, polished, or reassuring the business sounds." },
        { id: "brandTone", label: "Brand tone", type: "select", required: true, options: ["Clear and professional", "Warm and neighborly", "Direct and practical", "Polished and premium", "Security-focused and reassuring"] },
        { id: "tagline", label: "Tagline", type: "text", placeholder: "Mobile Locksmith Service", required: true },
        { id: "logoStatus", label: "Logo status", type: "select", required: true, options: ["Create in logo step", "Upload existing logo", "Production logo needed later"] }
      ]
    },
    {
      id: "logo",
      navLabel: "Logo",
      title: "Logo and icon creation",
      eyebrow: "Placeholder builder, production assets later",
      summary: "Create a simple locksmith logo direction using placeholder icons, letters, background shapes, and the selected brand colors, or upload an existing icon/logo instead.",
      sourceNote: "Logo guidance follows common branding practice: keep it simple, scalable, readable at small sizes, and usable in full-color, one-color, and reversed versions.",
      fields: [
        { id: "logoSource", label: "Logo path", type: "select", required: true, options: ["Create logo here", "Upload existing icon/logo"] },
        { id: "logoIcon", label: "Placeholder icon", type: "logo-icons", required: true, requiredWhen: { field: "logoSource", equals: "Create logo here" } },
        { id: "logoLetters", label: "Letter(s) or initials", type: "text", placeholder: "HLK", required: true, requiredWhen: { field: "logoSource", equals: "Create logo here" } },
        { id: "logoTemplate", label: "Template direction", type: "logo-templates", required: true, requiredWhen: { field: "logoSource", equals: "Create logo here" } },
        { id: "logoTypeStyle", label: "Placeholder font system", type: "logo-fonts", required: true, requiredWhen: { field: "logoSource", equals: "Create logo here" } },
        { id: "logoVariation", label: "Primary variation", type: "logo-variations", required: true, requiredWhen: { field: "logoSource", equals: "Create logo here" } },
        { id: "logoUpload", label: "Upload existing icon/logo", type: "file", required: true, requiredWhen: { field: "logoSource", equals: "Upload existing icon/logo" }, helper: "Placeholder upload field for now. Production should store SVG/PNG assets and generate logo kit variants." },
        { id: "logoNotes", label: "Logo notes", type: "textarea", placeholder: "Avoid tiny details, use 2-3 colors, check small-size readability, prepare icon-only and full lockup versions.", rows: 3, full: true },
        { id: "logoPreview", label: "Logo preview", type: "logo-preview" },
        { id: "logoHandoff", label: "Logo handoff", type: "logo-handoff" }
      ],
      instructions: [
        "Choose whether to create a logo direction here or upload an existing icon/logo.",
        "If creating here, pick one clear symbol or initials. Avoid combining too many icons.",
        "Choose a simple background shape that still works at favicon, invoice, shirt, van, and Google profile sizes.",
        "Use the brand color scheme from the previous step and keep the mark readable in one color.",
        "Treat the generated icon/font choices as placeholders until production licensed assets are purchased."
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
        { id: "googleProfileStatus", label: "Google Business Profile status", type: "select", required: true, incompleteValues: ["Not started", "Added / claimed", "Verification in progress", "Needs attention"], options: ["Not started", "Added / claimed", "Verification in progress", "Verified", "Needs attention"] },
        { id: "googleProfileUrl", label: "Google profile URL", type: "url", placeholder: "https://...", required: true },
        { id: "googleVerificationMethod", label: "Verification method offered by Google", type: "select", required: true, options: ["Not offered yet", "Video recording", "Phone or SMS", "Email", "Postcard", "Instant / Search Console", "Other"] },
        { id: "serviceAreaConfirmed", label: "Service-area setup confirmed", type: "checkbox", required: true }
      ],
      links: [
        { label: "Add or claim Business Profile", href: "https://support.google.com/business/answer/2911778" },
        { label: "Manage service areas", href: "https://support.google.com/business/answer/9157481" },
        { label: "Verify your business", href: "https://support.google.com/business/answer/7107242" }
      ],
      instructions: [
        "Open Google Business Profile with your business Google account.",
        "Add a new business if no profile exists, or claim the existing profile if Google already shows it.",
        "Use your business name from Business Background.",
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
        { id: "websiteUrl", label: "BIAB website URL", type: "computed-url", source: "website", required: true, helper: "This is the actual website generated by Business in a Box." },
        { id: "searchConsoleStatus", label: "Search Console status", type: "select", required: true, incompleteValues: ["Not started", "Property added", "Needs attention"], options: ["Not started", "Property added", "Ownership verified", "Sitemap submitted", "Needs attention"] },
        { id: "sitemapUrl", label: "Sitemap URL", type: "computed-url", source: "sitemap", required: true, helper: "Submit this sitemap URL in Search Console when the site is live." },
        { id: "primaryKeywords", label: "Primary local search terms", type: "seo-keywords", placeholder: "locksmith near me, rekey locks, house lockout, lock change...", required: true, helper: "Suggested from the launch services and service area entered earlier. Edit before saving if needed." }
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
        "Submit the sitemap URL shown here after verification.",
        "Use honest local service terms and avoid fake city pages."
      ]
    },
    {
      id: "invoices",
      navLabel: "Invoices",
      title: "Invoice setup",
      eyebrow: "Field closeout tool",
      summary: "Once setup is complete, you can generate invoices from the standalone invoice generator on-site without going through the website flow.",
      fields: [
        { id: "invoicePrefix", label: "Invoice prefix", type: "text", placeholder: "HLK", required: true },
        { id: "invoiceEmail", label: "Invoice sender email", type: "email", placeholder: "billing@example.com", required: true },
        { id: "invoiceTerms", label: "Payment terms", type: "textarea", placeholder: "Payment due upon completion unless otherwise agreed.", required: true },
        { id: "askReviewDefault", label: "Ask for a review by default after sending an invoice", type: "checkbox" }
      ]
    },
    {
      id: "reviews",
      navLabel: "Reviews",
      title: "Review workflow setup",
      eyebrow: "Close the job with reputation",
      summary: "Set your review request habit. Your invoices can include a checkbox to automatically send a review request to your customer's email.",
      fields: [
        { id: "reviewEmailFrom", label: "Review request reply-to email", type: "email", placeholder: "service@example.com", required: true },
        { id: "reviewMessage", label: "Default review request message", type: "textarea", placeholder: "Thank you for choosing us. If you were happy with the service, please leave a review.", required: true },
        { id: "reviewPublicUrl", label: "Public review page URL", type: "url", placeholder: "Generated or connected later", required: true }
      ],
      links: [
        { label: "FTC CAN-SPAM business guide", href: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business" }
      ],
      instructions: [
        "Use review requests for customers who received completed service.",
        "Keep the message short and honest.",
        "Use a real reply-to email and keep business contact information accurate.",
        "When sending an invoice, leave 'Ask for a review' checked when your customer's email is correct."
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
        { id: "launchApproved", label: "I reviewed the setup and am ready to use Business in a Box tools", type: "checkbox", required: true }
      ]
    }
  ]
};
