window.NALA_V4_CONFIG = {
  version: "4.0.0",
  storageKey: "nala_personal_roadmap_v4",
  checkoutUrl: "../#register",
  analyticsNamespace: "nala_v4",
  app: {
    title: "NALA Personal Roadmap",
    chapter: "Career Advisor",
    continueLabel: "Continue",
    insightLabel: "Did you know?"
  },
  screens: [
    {
      id: "01",
      type: "welcome",
      chapter: "Your next chapter",
      title: "Your future may be closer than you think.",
      description: "Answer 18 short questions and discover whether locksmithing could become your next opportunity.",
      supporting: "This experience takes about 3 minutes and is designed to provide a personalized assessment based on your answers.",
      action: "Start My Assessment",
      secondary: "No commitment. Just a few questions."
    },
    {
      id: "02",
      type: "dob",
      chapter: "Getting to know you",
      step: "Question 1 of 18",
      key: "dob_eligibility",
      title: "What is your date of birth?",
      description: "We use this only to confirm eligibility and personalize your assessment.",
      adultMessage: "Age eligibility confirmed.",
      minorMessage: "This program is currently available for adults aged 18 and over.",
      minorAction: "Return Home"
    },
    {
      id: "03",
      type: "guidedChoice",
      chapter: "Your starting point",
      step: "Question 2 of 18",
      key: "employment_status",
      selectionEvent: "employment_selected",
      title: "Which option best describes your current situation?",
      description: "There are no right or wrong answers. We simply want to personalize your experience.",
      insight: "Thousands of people begin learning a new profession every year—not because they have to, but because they want more freedom, flexibility, and options for the future.",
      options: [
        { value: "full_time", label: "I work full-time", flag: "employed_full_time", response: "Great. Many of our students started while working full-time." },
        { value: "part_time", label: "I work part-time", flag: "employed_part_time", response: "That can give you extra flexibility while learning." },
        { value: "self_employed", label: "I'm self-employed", flag: "self_employed", response: "Many business owners choose to add another valuable skill to their toolkit." },
        { value: "retired", label: "I'm retired", flag: "retired", response: "Many people discover that retirement is the perfect time to learn something new and stay active." },
        { value: "between_jobs", label: "I'm currently between jobs", flag: "between_jobs", response: "Sometimes an unexpected change becomes the beginning of a completely new opportunity." },
        { value: "other", label: "Other", flag: "employment_other", response: "Thank you. We'll personalize the rest of your experience accordingly." }
      ]
    },
    {
      id: "04",
      type: "guidedChoice",
      chapter: "What matters most",
      step: "Question 3 of 18",
      key: "primary_motivation",
      selectionEvent: "motivation_selected",
      title: "If you could improve just ONE thing in your life right now... what would it be?",
      description: "Choose the answer that feels most true for you today.",
      insight: "Many people who successfully change careers don't start because they know exactly what they want... they start because they know something has to change.",
      options: [
        { value: "money", label: "Earn more money", flag: "money", response: "Money matters. There is absolutely nothing wrong with wanting to earn more. The real question is how to do it wisely and build something that lasts." },
        { value: "freedom", label: "Have more freedom and control over my time", flag: "freedom", response: "More freedom often starts with having more choices." },
        { value: "security", label: "Build a more secure future", flag: "security", response: "Building a practical skill today can create more confidence about tomorrow." },
        { value: "family", label: "Create a better life for my family", flag: "family", response: "Wanting a better future for your family is one of the strongest motivations anyone can have." },
        { value: "growth", label: "Learn a valuable new skill", flag: "growth", response: "The best investment is often the one you make in yourself." },
        { value: "new_beginning", label: "Start a completely new chapter in my life", flag: "new_beginning", response: "Every great story has a chapter where someone decides to start again." }
      ]
    },
    {
      id: "05",
      type: "guidedChoice",
      chapter: "Fear of change",
      step: "Question 4 of 18",
      key: "change_concern",
      selectionEvent: "concern_selected",
      title: "What's your biggest concern about making a change?",
      description: "Choose the answer that feels most true for you.",
      insight: "The biggest obstacle for most people isn't ability—it's uncertainty.",
      options: [
        { value: "time", label: "I don't have enough time.", flag: "time", response: "Many of our students thought they didn't have time—until they discovered they only needed a realistic plan." },
        { value: "wrong_direction", label: "I'm afraid of investing my time and energy in the wrong direction.", flag: "fear_wrong_decision", response: "That's completely understandable. The important thing isn't avoiding every mistake—it's making informed decisions." },
        { value: "experience", label: "I don't have any experience in this field.", flag: "experience", response: "Everyone starts somewhere. Experience comes after taking the first step—not before." },
        { value: "confidence", label: "I'm not sure I'm capable of succeeding.", flag: "self_confidence", response: "Most people underestimate what they're capable of before they begin." },
        { value: "age", label: "I think I may be too old to start over.", flag: "age", response: "Many successful careers begin much later than people expect." },
        { value: "overwhelming", label: "Making a big life decision feels overwhelming.", flag: "fear_change", response: "Big decisions feel smaller when they're taken one step at a time." }
      ]
    },
    {
      id: "06",
      type: "guidedChoice",
      chapter: "Learning readiness",
      step: "Question 5 of 18",
      key: "learning_readiness",
      selectionEvent: "answer_selected",
      title: "When you decide to learn something important, what usually helps you stay committed?",
      description: "Choose the answer that feels most true for you.",
      insight: "Successful learners rarely study more—they study consistently.",
      options: [
        { value: "structure", label: "Having a clear step-by-step plan.", flag: "structure", weight: 9, response: "A clear plan often makes big goals feel much easier to achieve." },
        { value: "self_paced", label: "Being able to learn at my own pace.", flag: "self_paced", weight: 10, response: "Learning at your own pace allows many people to stay consistent over time." },
        { value: "goal_oriented", label: "Knowing exactly what I'll achieve by the end.", flag: "goal_oriented", weight: 8, response: "Knowing where you're going makes every step more meaningful." },
        { value: "progress", label: "Seeing real progress along the way.", flag: "progress", weight: 8, response: "Small wins create lasting motivation." },
        { value: "support", label: "Knowing that support is available whenever I need it.", flag: "support", weight: 9, response: "Knowing you're not alone often makes all the difference." },
        { value: "flexible", label: "Being able to fit learning into my daily routine.", flag: "flexible", weight: 10, response: "Learning becomes much easier when it fits your lifestyle—not the other way around." }
      ]
    },
    {
      id: "07",
      type: "guidedChoice",
      chapter: "Personal strengths",
      step: "Question 6 of 18",
      key: "personal_strength",
      selectionEvent: "answer_selected",
      title: "Which of these statements describes you best?",
      description: "Choose the statement that feels most like you.",
      insight: "The profession you choose is important—but your mindset is often even more important.",
      options: [
        { value: "persistence", label: "When I decide to do something, I usually don't give up.", flag: "persistence", weight: 10, response: "Persistence is one of the strongest predictors of long-term success." },
        { value: "problem_solver", label: "I always try to find a solution instead of giving up.", flag: "problem_solver", weight: 10, response: "People who focus on solutions often overcome challenges faster than they expect." },
        { value: "commitment", label: "I'm willing to work hard when I know the goal is worth it.", flag: "commitment", weight: 9, response: "Working hard toward a meaningful goal is a powerful advantage." },
        { value: "growth", label: "I enjoy improving myself and learning new things.", flag: "growth", weight: 9, response: "People who enjoy learning often continue growing throughout their lives." },
        { value: "responsibility", label: "People can usually count on me when something is important.", flag: "responsibility", weight: 10, response: "Responsibility and consistency are qualities that open many doors." },
        { value: "future_mindset", label: "I believe the right decision can completely change a person's future.", flag: "future_mindset", weight: 8, response: "Many life-changing journeys begin with one thoughtful decision." }
      ]
    },
    {
      id: "08",
      type: "factsChoice",
      chapter: "Facts first",
      step: "Question 7 of 18",
      key: "market_understanding",
      selectionEvent: "market_understanding_selected",
      title: "Before choosing a new profession, what's the first thing you would want to know?",
      response: "That's exactly the question we believe everyone should ask first.",
      facts: [
        { value: "≈18,000", label: "Locksmiths in the United States", source: "Based on U.S. Bureau of Labor Statistics" },
        { value: "Millions", label: "of locksmith service requests every year" },
        { value: "AAA", label: "alone handles a very large number of vehicle lockout assistance requests every year" }
      ],
      question: "After seeing these numbers... what stands out to you the most?",
      options: [
        { value: "demand", label: "I didn't realize the demand was this high.", flag: "demand", weight: 8 },
        { value: "low_supply", label: "I didn't realize there were so few locksmiths.", flag: "low_supply", weight: 10 },
        { value: "opportunity", label: "I'm beginning to understand why people see this profession as an opportunity.", flag: "opportunity", weight: 10 },
        { value: "local_interest", label: "I'd like to understand what the opportunity looks like in my area.", flag: "local_interest", weight: 10 }
      ],
      dynamicResponse: "That's exactly the right question. Every local market is different, and understanding your area is one of the smartest steps before making any career decision.",
      insight: "Successful professionals don't choose careers based on assumptions. They look at demand first."
    },
    {
      id: "09",
      type: "discovery",
      chapter: "It starts at home",
      step: "Step 8 of 18",
      key: "residential_guess",
      selectionEvent: "market_guess_selected",
      title: "Every profession starts with understanding the market.",
      description: "Let's start with residential homes.",
      question: "If you had to guess... How many housing units are there in the United States?",
      options: [
        { value: "72m", label: "Around 72 million" },
        { value: "96m", label: "Around 96 million" },
        { value: "118m", label: "Around 118 million" }
      ],
      revealValue: "145M+",
      revealLabel: "Housing Units",
      source: "According to U.S. Census Bureau data",
      meaning: "Even the highest estimate was lower than the actual number. Every home has doors. Every door has locks. And every lock will eventually need service, replacement or maintenance.",
      insight: "Big markets aren't built from one customer. They're built from millions of everyday situations.",
      transition: "Homes are only one part of the picture. Let's look at another market."
    },
    {
      id: "10",
      type: "discovery",
      chapter: "Vehicle market",
      step: "Question 9 of 18",
      key: "vehicle_guess",
      selectionEvent: "market_guess_selected",
      question: "If you had to guess... How many registered vehicles are there in the United States?",
      options: [
        { value: "65m", label: "65M" },
        { value: "120m", label: "120M" },
        { value: "180m", label: "180M" }
      ],
      revealValue: "289M+",
      revealLabel: "registered vehicles",
      source: "Source: Federal Highway Administration",
      meaning: "Every vehicle represents multiple access systems."
    },
    {
      id: "11",
      type: "discovery",
      chapter: "Hotels",
      step: "Question 10 of 18",
      key: "hotel_guess",
      selectionEvent: "market_guess_selected",
      question: "If you had to guess... How many hotel rooms are there in the United States?",
      options: [
        { value: "900k", label: "900K" },
        { value: "2_4m", label: "2.4M" },
        { value: "3_8m", label: "3.8M" }
      ],
      revealValue: "5.7M+",
      revealLabel: "hotel rooms",
      source: "Source: American Hotel & Lodging Association",
      meaning: "Hotels constantly manage access."
    },
    {
      id: "12",
      type: "discovery",
      chapter: "Commercial & institutions",
      step: "Question 11 of 18",
      key: "commercial_guess",
      selectionEvent: "market_guess_selected",
      question: "If you had to guess... How many commercial buildings are there in the United States?",
      options: [
        { value: "800k", label: "800K" },
        { value: "2_1m", label: "2.1M" },
        { value: "3_7m", label: "3.7M" }
      ],
      revealValue: "5.9M+",
      revealLabel: "commercial buildings",
      source: "Source: U.S. Energy Information Administration (CBECS)",
      meaning: "Commercial buildings and institutions continually manage secure access."
    },
    {
      id: "13",
      type: "bigPicture",
      chapter: "The big picture",
      title: "YOU SEE A CITY.",
      secondTitle: "WE SEE AN ECONOMY.",
      action: "Continue"
    },
    {
      id: "14",
      type: "confidence",
      chapter: "Confidence building",
      step: "Step 13 of 20",
      key: "starting_challenge",
      selectionEvent: "confidence_answer_selected",
      title: "Every professional starts somewhere.",
      question: "What do you think was the biggest challenge for most locksmiths when they first started?",
      description: "Imagine they were standing exactly where you are today. What do you think challenged them the most?",
      options: [
        { value: "technical_skills", label: "Learning the technical skills." },
        { value: "no_experience", label: "Starting without any previous experience." },
        { value: "time", label: "Finding enough time to learn." },
        { value: "belief", label: "Believing they could actually do it." },
        { value: "fit", label: "Honestly... I think many of them felt it was the right profession for them." }
      ],
      revealIntro: "After helping thousands of students begin this journey... We discovered something surprising.",
      revealTitle: "Most people don't start with experience. They start with one simple tool. A screwdriver.",
      revealSupporting: "Everything else is learned step by step with the right guidance.",
      insight: "Every expert you meet today was once holding a screwdriver for the very first time.",
      closing: "Just... a screwdriver."
    },
    {
      id: "15",
      type: "modernLearning",
      chapter: "Modern learning",
      step: "Step 14 of 20",
      key: "learning_experience",
      selectionEvent: "learning_preference_selected",
      title: "If you had to guess... Which learning experience feels more natural in today's world?",
      description: "Choose the answer that feels most realistic to you.",
      options: [
        { value: "classroom", label: "Learning in a classroom at fixed times." },
        { value: "manuals", label: "Learning mainly from books and printed manuals." },
        { value: "home", label: "Learning from home, at your own pace, whenever it fits your schedule." },
        { value: "replay", label: "Being able to replay lessons until you feel completely confident." },
        { value: "flexibility", label: "Everyone learns differently, but flexibility matters more than ever." }
      ],
      revealTitle: "The world has already changed.",
      changes: ["Movies moved to streaming.", "Banking moved to our phones.", "Even our wallets became digital.", "Professional learning changed too."],
      future: "Welcome to 2028.",
      insight: "Learning no longer has to fit your life. Modern learning fits around your life.",
      caption: "Some things belong in the past."
    },
    {
      id: "16",
      type: "meaning",
      chapter: "Your future",
      step: "Step 15 of 20",
      key: "service_call_feeling",
      selectionEvent: "future_feeling_selected",
      title: "Imagine this...",
      description: "A family you've never met is waiting for someone they can trust. A few minutes later... they're smiling because you showed up.",
      question: "How do you think you would feel after helping a family like this?",
      options: [
        { value: "proud", label: "Proud." },
        { value: "relieved", label: "Relieved." },
        { value: "confident", label: "More confident than ever." },
        { value: "ready", label: "Ready for the next service call." },
        { value: "all", label: "All of the above." }
      ],
      reveal: "The first service call rarely changes your life overnight. But it often changes the way you see yourself.",
      closing: "Not a bad feeling… Helping a family… And getting paid on your way home.",
      insight: "The best careers create value for others... And a better future for you."
    },
    {
      id: "17",
      type: "roadmapSetup",
      chapter: "Your Personal Roadmap",
      step: "Step 16 of 20",
      key: "preferred_work_path",
      selectionEvent: "work_path_selected",
      title: "Earlier, you shared what matters most to you. Now let's build your Personal Roadmap.",
      description: "Your roadmap isn't based on guesses. It's built using your answers together with real industry data.",
      dataCards: [
        { icon: "vehicle", label: "Average Vehicle Unlock", lines: ["≈ 6–9 min", "≈ $280–350"] },
        { icon: "home", label: "Average House Lockout", lines: ["Average industry pricing"] },
        { icon: "chart", label: "Industry Demand", lines: ["AAA", "BLS", "Current market averages"] },
        { icon: "clock", label: "Your Preferred Work Path", lines: ["Choose what fits your life"] }
      ],
      question: "Once you've completed the program... Which work path feels right for you?",
      options: [
        { value: "side", label: "Side Income", detail: "5–10 hours/week", tone: "green" },
        { value: "balanced", label: "Balanced", detail: "10–20 hours/week", tone: "blue" },
        { value: "full", label: "Full Time", detail: "20+ hours/week", tone: "violet" }
      ],
      action: "Build My Personal Roadmap"
    },
    {
      id: "18",
      type: "roadmap",
      chapter: "Your Personal Roadmap",
      title: "Building Your Personal Roadmap...",
      loadingSteps: ["Reviewing your goals...", "Matching your preferred work path...", "Comparing current industry data...", "Creating your roadmap..."],
      revealTitle: "Your Personal Roadmap",
      basis: ["Your goals", "Your preferred work path", "Average industry pricing", "Current market demand"],
      disclaimer: "This roadmap is an estimate based on your selections and current market averages. It is designed to help you plan your journey and is not a guarantee of results.",
      averageNote: "This roadmap represents a realistic average—not a ceiling.",
      beyondNote: "Many professional locksmiths build beyond these numbers through consistency, experience and reputation.",
      closing: "Every big journey begins with a single decision.",
      action: "Continue"
    },
    {
      id: "19",
      type: "brandReveal",
      chapter: "NALA",
      title: "Your future is already waiting.",
      secondTitle: "We're just here to help you unlock it.",
      description: "Thousands of small decisions can change a life. Sometimes, all it takes is making the first one.",
      support: "From your first lesson... To your first real service call... We'll be with you every step of the way.",
      action: "Continue",
      transition: "Ready?"
    },
    {
      id: "20",
      type: "final",
      chapter: "Your decision",
      title: "You've come this far for a reason.",
      description: "Your future won't be decided by what you read today... It will be decided by what you choose to do next.",
      roadmapReady: "Your Personal Roadmap is ready.",
      included: ["Professional Online Training", "Step-by-Step Learning Platform", "Professional Certificate", "Professional Starter Kit", "Lifetime Access to Future Updates", "Community Support"],
      action: "Yes, I'm Ready.",
      closing: "One decision. A lifetime of possibilities.",
      assurances: ["Secure Checkout", "Flexible Payment Options", "Learn at Your Own Pace"]
    }
  ],
  roadmap: {
    averageServiceValue: 280,
    paths: {
      side: {
        label: "Side Income",
        hours: "5–10 hours/week",
        monthlyCalls: [1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9]
      },
      balanced: {
        label: "Balanced",
        hours: "10–20 hours/week",
        monthlyCalls: [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 17, 18]
      },
      full: {
        label: "Full Time",
        hours: "20+ hours/week",
        monthlyCalls: [2, 3, 5, 7, 10, 13, 16, 19, 22, 24, 26, 27]
      }
    }
  }
};
