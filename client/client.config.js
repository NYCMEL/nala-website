const clientData = {
    breadcrumb: [],
    business: {
	name: "Mel the Locksmith",
	logo: "img/home/client-face-d.jpg",
	rating: 4.6,
	ratingText: "Excellent",
	reviewCount: 612,
	isTopPro: true,
	isOnline: false,
    },
    stats: [
	{ icon: "verified_user", text: "Current Top Pro", type: "badge" },
	{ icon: "emoji_events", text: "Hired 73 times", type: "achievement" },
	{ icon: "verified", text: "Background checked", type: "verification" },
	{ icon: "groups", text: "2 employees", type: "team" },
	{ icon: "schedule", text: "5 years in business", type: "experience" },
    ],
    contact: {
	priceText: "Contact for estimate",
	ctaButton: "Request estimate",
	viewDetailsLink: "",
    },
    guarantee: {
	title: "Mel the Locksmith Guarantee",
	text: "Work is guaranteed, or your money back.",
	learnMoreLink: "",
    },

    tabs: [],

    about: {
	description:
	"Your neighborhood locksmith has been serving customers for 17 years, with fast response times and straightforward pricing.",
	readMoreLink: "",
    },
    businessHours: {
	title: "Business hours",
	text: "This pro hasn't listed their business hours.",
    },
    paymentMethods: {
	title: "Payment methods",
	methods:
	"This business accepts payments via Apple Pay, cash, check, credit card, PayPal, Cash App, Venmo, and Zelle.",
    },
    socialMedia: {
	title: "Social media",
	links: [
	    { platform: "<img src='img/facebook.png' height=30>", url: "#" },
	    { platform: "<img src='img/instagram.png' height=30", url: "#" },
	    { platform: "<img src='img/twitter.png' height=30>",  url: "#" }
	]
    },
    reviews: [
	{ id: "rev-001", customerName: "Maria S.", rating: 5, text: "Fast response, clear price, and the new deadbolt works perfectly.", createdAt: "2026-04-10", published: true },
	{ id: "rev-002", customerName: "Jordan P.", rating: 4, text: "Professional service and good communication from arrival through payment.", createdAt: "2026-04-18", published: true },
	{ id: "rev-003", customerName: "Ari L.", rating: 3, text: "The lock was fixed, but arrival took longer than expected.", createdAt: "2026-04-21", published: false }
    ],
    topProStatus: {
	title: "Top Pro status",
	description: "Top Pros are among the highest-rated, most popular professionals on Thumbtack.",
	years: [],
    },
}
