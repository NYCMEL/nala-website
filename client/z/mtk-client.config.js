// MTK Client Configuration
const mtkClientConfig = {
    business: {
	name: "El Tridente Services LLC",
	logo: "https://via.placeholder.com/200x200/3a3a3a/7ed321?text=EL+TRIDENTE",
	rating: 4.9,
	reviewCount: 16,
	badges: ["Top Pro"],
	onlineStatus: true,
	serviceCallFee: 165,
	feeWaived: true
    },
    
    breadcrumb: [
	{ label: "Thumbtack", link: "#" },
	{ label: "Locksmiths", link: "#" },
	{ label: "El Tridente Services LLC", link: "#" }
    ],
    
    about: {
	title: "About",
	shortDescription: "Looking for a trusted local team that can handle everything from lockouts to full remodeling?",
	fullDescription: "At El Tridente Services, we bring you fast, mobile, and professional solutions — whether you're locked out, painting a room, or upgrading your property."
    },
    
    overview: [
	{ icon: "star", label: "Current Top Pro" },
	{ icon: "trophy", label: "Hired 8 times" },
	{ icon: "location", label: "Serves Fort Lee, NJ" },
	{ icon: "shield", label: "Background checked" },
	{ icon: "users", label: "1 employee" },
	{ icon: "clock", label: "9 years in business" }
    ],
    
    businessHours: {
	title: "Business hours",
	message: "This pro hasn't listed their business hours."
    },
    
    paymentMethods: {
	title: "Payment methods",
	methods: ["Apple Pay", "Cash", "Check", "Credit card", "PayPal", "Venmo", "Zelle"]
    },
    
    socialMedia: {
	title: "Social media",
	links: [
	    { platform: "Facebook", url: "#" },
	    { platform: "Instagram", url: "#" }
	]
    },
    
    guarantee: {
	title: "Thumbtack Guarantee",
	description: "If you hire this pro, you're covered by a money-back guarantee.",
	learnMoreLink: "#"
    },
    
    actions: {
	primary: "Request estimate",
	secondary: ["Message", "Request a call"],
	detailsLink: "View details"
    },
    
    theme: {
	primaryColor: "#00a5cf",
	secondaryColor: "#3a3a3a",
	accentColor: "#7ed321",
	ratingColor: "#00a896",
	backgroundColor: "#ffffff",
	textColor: "#2d3748",
	lightTextColor: "#718096",
	borderColor: "#e2e8f0"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mtkClientConfig;
}
