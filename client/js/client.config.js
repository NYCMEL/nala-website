var config = {
    editable: true, /* REMOVE THIS FOR NORMAL SHOWING */

    nalaUID: "U12345", /* USED FOR IDENTIFYING THE CLIENT WHEN SENDING REQUESTS */

    business: {
	name:        "Mel the Locksmith",
	logo:        "img/mel.co.png",
	rating:      4.1,
	ratingText:  "Excellent",
	reviewCount: 52,
	isTopPro:    true,
	isOnline:    true,
    },
    stats: [
	{ icon: "verified_user", text: "Current Top Pro",      type: "badge"        },
	{ icon: "emoji_events",  text: "Hired 73 times",       type: "achievement"  },
	{ icon: "verified",      text: "Background checked",   type: "verification" },
	{ icon: "groups",        text: "2 employees",          type: "team"         },
	{ icon: "schedule",      text: "5 years in business",  type: "experience"   },
    ],
    contact: {
	priceText:       "Contact me for Estimate",
	ctaButton:       "Need a Hand?",
	viewDetailsLink: "View project details",
    },
    guarantee: {
	title:         "Our Guarantee",
	text:          "Work is guaranteed or your money back. We stand behind every job — residential, commercial, and automotive.",
	learnMoreLink: "Learn more about our guarantee",
    },
    tabs: [],
    about: {
	description:
	    "Your neighborhood locksmith, serving the New York metro area for over 3 years. " +
	    "We specialize in residential, commercial, and automotive locksmith services with fast response times " +
	    "and transparent pricing. Licensed, insured, and background-checked professionals you can trust.",
	readMoreLink: "",
    },
    businessHours: {
	title: "Business hours",
	text:  "Mon – Fri: 8:00 AM – 8:00 PM  |  Sat: 9:00 AM – 6:00 PM  |  Sun: Emergency calls only",
    },
    paymentMethods: {
	title:   "Payment methods",
	methods: "I accepts payments via Apple Pay, Cash, Credit card, PayPal and Zelle.",
    },
    socialMedia: {
	title: "Connect with me",
	links: [
	    { platform: "facebook",  icon: "img/facebook.png",  url: "" },
	    { platform: "instagram", icon: "img/instagram.png", url: "" },
	    { platform: "twitter",   icon: "img/twitter.png",   url: "" },
	]
    },
    topProStatus: {
	title:       "Top Pro status",
	description: "Top Pros are among the highest-rated, most popular professionals. " +
	             "Mel the Locksmith has maintained Top Pro status for two consecutive years.",
	years:       [2024, 2025],
    },
}

// MAKE THIS CALL TO START CLIENT
client(config);
