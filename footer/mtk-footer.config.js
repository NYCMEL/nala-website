/* mtk-footer.config.js */

window.app = window.app || {};

window.app.footer = {
    brand: {
        logo: "img/footer-logo.png",
        description: "NALA empowers locksmith professionals through education, certification, and industry leadership."
    },

    groups: [
        {
            title: "Programs",
            links: [
                { label: "Certification", event: "nav:certification" },
                { label: "Training", event: "nav:training" },
                { label: "Continuing Education", event: "nav:education" }
            ]
        },
        {
            title: "Organization",
            links: [
                { label: "About NALA", event: "nav:about" },
                { label: "Leadership", event: "nav:leadership" },
                { label: "Careers", event: "nav:careers" }
            ]
        },
        {
            title: "Resources",
            links: [
                { label: "Member Portal", event: "nav:portal" },
                { label: "Support", event: "nav:support" },
                { label: "FAQs", event: "nav:faq" }
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", event: "nav:privacy" },
                { label: "Terms of Service", event: "nav:terms" }
            ]
        },

	{
            title: "Social",
	    links: [
		{ icon: "<img src='img/facebook.png' height=30>", event: "social:facebook" },
		{ icon: "<img src='img/linkedin.webp' height=60>", event: "social:linkedin" },
		{ icon: "youtube", event: "social:youtube" }
	    ]
	}
    ],

    bottom: {
        left: "© 2026 NALA - North America Locksmith Association",
        right: "Raising standards for the locksmith profession"
    }
};
