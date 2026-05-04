window.mtkBiabConfig = {
    component: "mtk-biab",
    title: "Business in a Box",
    eyebrow: "NALA Business Toolkit",
    subtitle: "Launch, manage, and grow your small business from one clean workspace.",
    intro: "Business in a Box gives entrepreneurs the basic building blocks they need to create a professional presence, manage customers, send invoices, and collect reviews.",
    defaultSection: "introduction",
    publishPrefix: "4-mtk-biab",
    labels: {
        mobileMenu: "Business menu",
        openMenu: "Open Business in a Box menu",
        closeMenu: "Close Business in a Box menu",
        activeSection: "Current section",
        getStarted: "Get started",
        learnMore: "Learn more",
        setupEyebrow: "Setup workspace"
    },
    actions: {
        getStarted: {
            label: "Start setup",
            topic: "4-mtk-biab:get-started-clicked"
        },
        learnMore: {
            label: "View details",
            topic: "4-mtk-biab:learn-more-clicked"
        }
    },
    setupLorem: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo non risus facilisis posuere. Sed porta, sapien at gravida luctus, lorem orci luctus mi, non pulvinar nibh mi sit amet sapien.",
        "Praesent commodo, magna non tincidunt luctus, mi mauris dignissim lorem, sed pretium tortor neque vitae erat. Donec sed sem sit amet ipsum luctus fermentum.",
        "Aliquam erat volutpat. Suspendisse potenti. Curabitur sed mi vitae arcu rhoncus vulputate. Pellentesque habitant morbi tristique senectus et netus et malesuada fames."
    ],
    sections: [
        {
            id: "introduction",
            icon: "home_work",
            label: "Introduction",
            title: "Everything your business needs in one box",
            summary: "A guided starting point for creating the core tools every small business needs.",
            body: "Start with a simple roadmap: define your business, create your online identity, organize customer touchpoints, and prepare the basic tools you need to operate professionally.",
            bullets: [
                "Define your business identity and customer promise",
                "Create a simple launch checklist",
                "Organize the tools needed to run your business",
                "Keep your setup easy to update as you grow"
            ],
            stats: [
                { "value": "6", "label": "Core tools" },
                { "value": "1", "label": "Simple workspace" }
            ]
        },
        {
            id: "website-builder",
            icon: "web",
            label: "Website Builder",
            title: "Build a clean business website",
            summary: "Create a professional website structure with pages, content blocks, calls to action, and service details.",
            body: "Use this section to plan the public face of your business: homepage, services, contact details, trust signals, photos, and clear calls to action.",
            bullets: [
                "Homepage and service page structure",
                "Contact and lead capture blocks",
                "Mobile friendly layout planning",
                "Content sections for trust, pricing, and location"
            ],
            stats: [
                { "value": "4", "label": "Page types" },
                { "value": "24/7", "label": "Online presence" }
            ]
        },
        {
            id: "business-card-logo",
            icon: "badge",
            label: "Business Card & Logo",
            title: "Create your visual identity",
            summary: "Organize your logo, business card details, brand colors, and reusable identity assets.",
            body: "Give your business a professional look with consistent naming, logo usage, colors, typography, and contact information across print and digital materials.",
            bullets: [
                "Logo and business name guidance",
                "Business card content checklist",
                "Brand color and typography notes",
                "Reusable identity assets for marketing"
            ],
            stats: [
                { "value": "3", "label": "Brand basics" },
                { "value": "100%", "label": "Reusable assets" }
            ]
        },
        {
            id: "marketing-seo",
            icon: "campaign",
            label: "Marketing, SEO",
            title: "Help customers find you",
            summary: "Plan marketing content, search visibility, local business listings, and customer acquisition basics.",
            body: "Use this area to organize keywords, service descriptions, local SEO content, marketing messages, and simple campaigns that help customers discover your business.",
            bullets: [
                "Local SEO keyword planning",
                "Service descriptions for search engines",
                "Campaign ideas for email and social media",
                "Simple analytics and performance tracking"
            ],
            stats: [
                { "value": "SEO", "label": "Ready content" },
                { "value": "Local", "label": "Customer focus" }
            ]
        },
        {
            id: "invoices",
            icon: "receipt_long",
            label: "Invoices",
            title: "Send clear professional invoices",
            summary: "Prepare invoice details, line items, payment terms, customer records, and reusable invoice templates.",
            body: "Set up a simple invoicing flow so customers understand what they owe, when payment is due, and how to contact you with questions.",
            bullets: [
                "Customer and job information",
                "Line items, taxes, discounts, and totals",
                "Payment terms and invoice status",
                "Reusable invoice template structure"
            ],
            stats: [
                { "value": "$", "label": "Payment ready" },
                { "value": "PDF", "label": "Invoice output" }
            ]
        },
        {
            id: "customer-reviews",
            icon: "reviews",
            label: "Customer Reviews",
            title: "Collect trust-building feedback",
            summary: "Ask for reviews, organize testimonials, and show social proof across your business presence.",
            body: "Customer feedback helps build trust. Use this section to create review request messages, organize testimonials, and highlight proof of quality service.",
            bullets: [
                "Review request message templates",
                "Customer testimonial organization",
                "Star rating and feedback summaries",
                "Trust signals for your website and marketing"
            ],
            stats: [
                { "value": "5★", "label": "Review goal" },
                { "value": "Trust", "label": "Growth signal" }
            ]
        }
    ]
};
