window.app = window.app || {};

window.app.footer = {
    brand: {
	logo: "./img/footer-logo.png",
	description: "North American Locksmith Association - Empowering locksmiths with professional education and industry connections since 1985."
    },

    columns: [
	{
	    title: "Quick Links",
	    links: [
		{ label: "Courses", event: "nav:courses" },
		{ label: "Certifications", event: "nav:certifications" },
		{ label: "Pricing", event: "nav:pricing" },
		{ label: "About", event: "nav:about" }
	    ]
	},
	{
	    title: "Support",
	    links: [
		{ label: "Contact", event: "nav:contact" },
		{ label: "FAQ", event: "nav:faq" },
		{ label: "Help Center", event: "nav:help" },
		{ label: "Career Services", event: "nav:careers" }
	    ]
	},
	{
	    title: "Legal",
	    links: [
		{ label: "Privacy Policy", event: "nav:privacy" },
		{ label: "Terms of Service", event: "nav:terms" },
		{ label: "Refund Policy", event: "nav:refunds" }
	    ]
	},
	{
	    title: "Connect",
	    social: [
		{ icon: "facebook", event: "social:facebook" },
		{ icon: "twitter", event: "social:twitter" },
		{ icon: "instagram", event: "social:instagram" }
	    ]
	}
    ],

    bottom: {
	left: "© 2026 North American Locksmith Association. All rights reserved.",
	right: "Made with care for aspiring locksmiths everywhere."
    }
};
