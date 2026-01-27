(function () {
    window.app = window.app || {};

    window.app.path = {
	heading: "Choose Your Path to Success",
	subheading: "Flexible pricing plans designed for every stage of your locksmith journey",
	plans: [
	    {
		id: "basic",
		title: "Basic",
		price: "$41",
		period: "/month",
		description: "Perfect for beginners starting their locksmith journey",
		features: [
		    "Access to 3 beginner courses",
		    "Video lessons and quizzes",
		    "Community forum access",
		    "Email support",
		    "Course completion certificate"
		],
		cta: "Get Started",
		popular: false
	    },
	    {
		id: "professional",
		title: "Professional",
		price: "$79",
		period: "/month",
		description: "Comprehensive training for serious professionals",
		features: [
		    "Access to ALL courses",
		    "Live instructor sessions",
		    "1-on-1 mentorship",
		    "Priority support",
		    "Job placement assistance",
		    "Industry certifications"
		],
		cta: "Get Started",
		popular: true
	    }
	]
    };
})();
