window.bettermeConfig = {
    app: {
	name: "nala-locksmith-path",
	brand: "NALA",
	headerTitle: "Path Builder",
	backLabel: "Go back",
	backText: "<",
	menuLabel: "Open menu",
	continueText: "CONTINUE",
	completedTitle: "Your locksmith income path is ready",
	completedText: "Review your personalized path below.",
	restartText: "START OVER",
	disclaimer: "Example revenue only. Actual results depend on market, effort, sales execution, licensing rules, demand, and other local factors."
    },
    result: {
	eyebrow: "Personalized recommendation",
	pathTitle: "Your Recommended Path",
	whyTitle: "Why We Recommended This",
	scheduleTitle: "Personalized Schedule",
	timelineTitle: "Training Timeline",
	servicesTitle: "Recommended Starter Services",
	revenueTitle: "Revenue Scenario",
	visionTitle: "12-Month Vision",
	nextTitle: "Next Step",
	revenuePrefix: "Based on your availability and market:",
	revenueSuffix: "Approximate example gross service revenue:",
	notGuaranteed: "Not guaranteed.",
	ctaLabels: {
	    training: "Start Training",
	    biab: "Explore BIAB",
	    advisor: "Schedule Advisor Call"
	}
    },
    screens: [
	{
	    type: 3,
	    key: "intro",
	    icon: "N",
	    title: "Find your fastest realistic path to locksmith income.",
	    paragraphs: [
		"Answer a few questions and NALA will recommend the path that best matches your time, market, goals, and launch readiness.",
		"This is not about whether you can become a locksmith. It is about the safest and most realistic path for you to start generating income."
	    ]
	},
	{
	    type: 1,
	    key: "age",
	    inputType: "radio",
	    title: "What is your age range?",
	    description: "This helps us tailor timing, launch readiness, and risk.",
	    options: [
		{ label: "Under 16", value: "under_16" },
		{ label: "16-17", value: "16_17" },
		{ label: "18-24", value: "18_24" },
		{ label: "25-34", value: "25_34" },
		{ label: "35-44", value: "35_44" },
		{ label: "45-54", value: "45_54" },
		{ label: "55+", value: "55_plus" }
	    ]
	},
	{
	    type: 4,
	    key: "location",
	    title: "Where would you start?",
	    description: "Enter the state where you would study, train, or begin offering services.",
	    fields: [
		{ label: "State", name: "state", type: "text", autocomplete: "address-level1", required: true }
	    ]
	},
	{
	    type: 1,
	    key: "marketType",
	    inputType: "radio",
	    title: "Which market best describes your area?",
	    description: "Market size changes the example revenue assumptions.",
	    options: [
		{ label: "Major Metro", value: "major_metro" },
		{ label: "Large Suburb", value: "large_suburb" },
		{ label: "Mid-Size City", value: "mid_size_city" },
		{ label: "Small Town", value: "small_town" },
		{ label: "Rural", value: "rural" }
	    ]
	},
	{
	    type: 1,
	    key: "familyStatus",
	    inputType: "radio",
	    title: "What is your family situation?",
	    description: "We use this to keep the recommendation realistic.",
	    options: [
		{ label: "Single", value: "single" },
		{ label: "Married", value: "married" },
		{ label: "Married with children", value: "married_children" },
		{ label: "Single parent", value: "single_parent" }
	    ]
	},
	{
	    type: 1,
	    key: "employmentStatus",
	    inputType: "radio",
	    title: "What is your current employment status?",
	    description: "Your path should fit your real schedule.",
	    options: [
		{ label: "Full-time", value: "full_time" },
		{ label: "Part-time", value: "part_time" },
		{ label: "Self-employed", value: "self_employed" },
		{ label: "Unemployed", value: "unemployed" },
		{ label: "Retired", value: "retired" }
	    ]
	},
	{
	    type: 1,
	    key: "incomePressure",
	    inputType: "radio",
	    title: "How important is extra income right now?",
	    description: "This helps us decide whether to recommend a fast-track path.",
	    options: [
		{ label: "Nice to have", value: "nice_to_have" },
		{ label: "Helpful", value: "helpful" },
		{ label: "Important", value: "important" },
		{ label: "Extremely important", value: "extremely_important" }
	    ]
	},
	{
	    type: 1,
	    key: "mainGoal",
	    inputType: "radio",
	    title: "What is your main goal?",
	    description: "Choose the outcome that feels most accurate.",
	    options: [
		{ label: "Extra income", value: "extra_income" },
		{ label: "Career change", value: "career_change" },
		{ label: "Start business", value: "start_business" },
		{ label: "Learn a trade", value: "learn_trade" },
		{ label: "Long-term career", value: "long_term_career" }
	    ]
	},
	{
	    type: 1,
	    key: "desiredIncome",
	    inputType: "radio",
	    title: "How much additional monthly income would you like?",
	    description: "We use this only for example scenarios, not guarantees.",
	    options: [
		{ label: "$500", value: "500" },
		{ label: "$1,000", value: "1000" },
		{ label: "$2,500", value: "2500" },
		{ label: "$5,000", value: "5000" },
		{ label: "$10,000+", value: "10000_plus" }
	    ]
	},
	{
	    type: 1,
	    key: "threeYearGoal",
	    inputType: "radio",
	    title: "Where would you like to be in three years?",
	    description: "This separates side-income paths from company-building paths.",
	    options: [
		{ label: "Extra income only", value: "extra_income_only" },
		{ label: "Full-time locksmith", value: "full_time_locksmith" },
		{ label: "Own a business", value: "own_business" },
		{ label: "Manage technicians", value: "manage_technicians" },
		{ label: "Not sure", value: "not_sure" }
	    ]
	},
	{
	    type: 1,
	    key: "studyHours",
	    inputType: "radio",
	    title: "How many hours per week can you study?",
	    description: "This determines your training timeline.",
	    options: [
		{ label: "2-4", value: "2_4" },
		{ label: "5-8", value: "5_8" },
		{ label: "9-12", value: "9_12" },
		{ label: "13-20", value: "13_20" },
		{ label: "20+", value: "20_plus" }
	    ]
	},
	{
	    type: 1,
	    key: "workHours",
	    inputType: "radio",
	    title: "How many hours per week could you work?",
	    description: "This sets the job-per-week assumption.",
	    options: [
		{ label: "3-5", value: "3_5" },
		{ label: "6-10", value: "6_10" },
		{ label: "11-20", value: "11_20" },
		{ label: "21-30", value: "21_30" },
		{ label: "Full-time", value: "full_time" }
	    ]
	},
	{
	    type: 1,
	    key: "studySchedule",
	    inputType: "radio",
	    title: "When would you prefer to study?",
	    description: "We will build a simple weekly schedule around this.",
	    options: [
		{ label: "Evenings", value: "evenings" },
		{ label: "Mornings", value: "mornings" },
		{ label: "Weekends", value: "weekends" },
		{ label: "Flexible", value: "flexible" }
	    ]
	},
	{
	    type: 1,
	    key: "workStyle",
	    inputType: "radio",
	    title: "What work style sounds best?",
	    description: "The path changes if you want a side hustle versus a company.",
	    options: [
		{ label: "Evenings only", value: "evenings_only" },
		{ label: "Weekends only", value: "weekends_only" },
		{ label: "Side hustle", value: "side_hustle" },
		{ label: "Full-time", value: "full_time" },
		{ label: "Build a company", value: "build_company" }
	    ]
	},
	{
	    type: 1,
	    key: "businessExperience",
	    inputType: "radio",
	    title: "Do you have previous business experience?",
	    description: "This helps decide whether BIAB should be recommended early.",
	    options: [
		{ label: "None", value: "none" },
		{ label: "Side hustle", value: "side_hustle" },
		{ label: "One business", value: "one_business" },
		{ label: "Multiple businesses", value: "multiple_businesses" }
	    ]
	},
	{
	    type: 1,
	    key: "customerComfort",
	    inputType: "radio",
	    title: "How comfortable are you with customers?",
	    description: "Locksmith income usually depends on trust, communication, and service.",
	    options: [
		{ label: "Very comfortable", value: "very_comfortable" },
		{ label: "Somewhat", value: "somewhat" },
		{ label: "Not comfortable", value: "not_comfortable" }
	    ]
	},
	{
	    type: 1,
	    key: "toolComfort",
	    inputType: "radio",
	    title: "How comfortable are you with tools?",
	    description: "No experience is required, but comfort level changes the pace.",
	    options: [
		{ label: "Comfortable", value: "comfortable" },
		{ label: "Somewhat", value: "somewhat" },
		{ label: "Willing to learn", value: "willing_to_learn" },
		{ label: "Not comfortable", value: "not_comfortable" }
	    ]
	},
	{
	    type: 1,
	    key: "transportation",
	    inputType: "radio",
	    title: "What is your transportation situation?",
	    description: "Reliable transportation affects the safest starter plan.",
	    options: [
		{ label: "Reliable transportation", value: "reliable" },
		{ label: "Working on it", value: "working_on_it" },
		{ label: "No transportation", value: "none" }
	    ]
	},
	{
	    type: 1,
	    key: "travelRadius",
	    inputType: "radio",
	    title: "How far could you travel for jobs?",
	    description: "Radius changes the example revenue scenario.",
	    options: [
		{ label: "10 miles", value: "10" },
		{ label: "25 miles", value: "25" },
		{ label: "50 miles", value: "50" },
		{ label: "75+ miles", value: "75_plus" }
	    ]
	},
	{
	    type: 1,
	    key: "serviceInterest",
	    inputType: "radio",
	    title: "Which locksmithing area interests you most?",
	    description: "We will recommend starter services around this interest.",
	    options: [
		{ label: "Residential", value: "residential" },
		{ label: "Automotive", value: "automotive" },
		{ label: "Commercial", value: "commercial" },
		{ label: "Business Setup", value: "business_setup" },
		{ label: "All of the Above", value: "all" }
	    ]
	}
    ],
    engine: {
	marketMultipliers: {
	    major_metro: 1.25,
	    large_suburb: 1.15,
	    mid_size_city: 1,
	    small_town: 0.9,
	    rural: 0.8
	},
	radiusMultipliers: {
	    "10": 0.8,
	    "25": 1,
	    "50": 1.15,
	    "75_plus": 1.25
	},
	timelines: {
	    "2_4": "16-24 weeks",
	    "5_8": "10-16 weeks",
	    "9_12": "8-12 weeks",
	    "13_20": "6-8 weeks",
	    "20_plus": "4-6 weeks"
	},
	jobBands: {
	    "3_5": { label: "1-3 jobs/week", low: 1, high: 3 },
	    "6_10": { label: "3-6 jobs/week", low: 3, high: 6 },
	    "11_20": { label: "5-10 jobs/week", low: 5, high: 10 },
	    "21_30": { label: "10-15 jobs/week", low: 10, high: 15 },
	    "full_time": { label: "15-25 jobs/week", low: 15, high: 25 }
	},
	averageTickets: {
	    starter: 100,
	    standard: 125,
	    strong: 150
	},
	services: {
	    residential: ["Residential lockouts", "Rekeys", "Lock replacement"],
	    automotive: ["Automotive lockouts", "Basic access services", "Residential lockouts"],
	    commercial: ["Residential lockouts", "Rekeys", "Commercial basics after training"],
	    business_setup: ["Residential starter jobs", "Customer intake workflow", "Business-In-A-Box launch setup"],
	    all: ["Residential lockouts", "Rekeys", "Automotive basics", "Commercial later-stage services"]
	},
	schedules: {
	    evenings: ["Monday: 60 minutes study", "Wednesday: 90 minutes study", "Saturday: 2-hour practice block"],
	    mornings: ["Tuesday: 60 minutes study", "Thursday: 90 minutes study", "Saturday: 2-hour practice block"],
	    weekends: ["Saturday: 2-hour lesson block", "Sunday: 2-hour practice block", "One weekday: 45-minute review"],
	    flexible: ["Two 60-minute study blocks", "One 90-minute practice block", "One weekend review block"]
	},
	personas: {
	    student_builder: {
		name: "Student Builder",
		path: "Learn Now, Launch Later",
		vision: "Build skills first, then prepare to launch when age, licensing, and transportation are ready.",
		nextStep: "training"
	    },
	    recent_graduate: {
		name: "Recent Graduate",
		path: "Accelerated Launch Path",
		vision: "Use higher availability to build trade competence and move toward early income opportunities.",
		nextStep: "training"
	    },
	    side_hustle_builder: {
		name: "Side Hustle Builder",
		path: "Evening Income Builder",
		vision: "Build a meaningful second income stream around evenings or weekends.",
		nextStep: "training"
	    },
	    family_provider: {
		name: "Family Provider",
		path: "Family-Friendly Side Business",
		vision: "Build reliable supplemental income without overloading family schedule constraints.",
		nextStep: "advisor"
	    },
	    career_transition: {
		name: "Career Transition",
		path: "Career Transition Roadmap",
		vision: "Build toward replacing your current income with a structured trade path.",
		nextStep: "advisor"
	    },
	    entrepreneur: {
		name: "Entrepreneur",
		path: "Business Launch Path",
		vision: "Launch a local service business with training, offer structure, and operating support.",
		nextStep: "biab"
	    },
	    fast_starter: {
		name: "Fast Starter",
		path: "Fast-Track Income Plan",
		vision: "Focus on the shortest practical path to starter services and advisor-supported execution.",
		nextStep: "advisor"
	    },
	    independence_seeker: {
		name: "Independence Seeker",
		path: "Solo Operator Plan",
		vision: "Use locksmithing to build a more independent local service income path.",
		nextStep: "training"
	    },
	    retiree: {
		name: "Retiree",
		path: "Flexible Supplemental Income",
		vision: "Build a flexible service path around lighter hours and practical local demand.",
		nextStep: "training"
	    },
	    scale_builder: {
		name: "Scale Builder",
		path: "Scale Builder Roadmap",
		vision: "Position yourself to hire technicians and expand into a local service company.",
		nextStep: "biab"
	    }
	}
    }
};
