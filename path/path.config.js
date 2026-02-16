(function () {
    window.app = window.app || {};

    window.app.path = {
        heading: "Choose Your Training Package",
        subheading: "Pick the option that fits your goals—start free, upgrade anytime, or launch with Business-in-a-Box.",
        plans: [
            {
                id: "trial",
                title: "Trial",
                price: "$0",
                period: "",
                description: "Explore the program with a small preview before you commit.",
                features: [
                    "Introduction to Locksmithing",
                    "3 free lessons",
                    "Preview the learning platform",
                    "Upgrade anytime"
                ],
                cta: "Get Started",
                popular: false
            },
            {
                id: "premium",
                title: "Premium",
                price: "$1,999",
                period: "One-time payment · financing up to 24 months available via Klarna",
                description: "Full program access with a certificate of completion.",
                features: [
                    "Full program access (all 5 parts)",
                    "Full access included",
                    "Certificate of completion",
                    "Learn at your own pace"
                ],
                cta: "Get Started",
                popular: true
            },
            {
                id: "business",
                title: "Business-in-a-Box",
                price: "$3,999",
                period: "One-time payment · financing up to 24 months available via Klarna",
                description: "Everything in Premium, plus tools to help you launch your locksmith business.",
                features: [
                    "Everything included in Premium",
                    "Pre-built locksmith website",
                    "Business card and branding templates",
                    "Service pricing starter framework",
                    "Marketing launch checklist"
                ],
                cta: "Get Started",
                popular: false
            }
        ]
    };
})();
