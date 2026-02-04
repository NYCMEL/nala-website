window.app = window.app || {};

window.app.courses = {
    title: "Included in the Program",
    description: "Start your locksmith journey with our most popular certification programs",
    // cta: {
    //     label: "",
    //     event: ""
    // },
    items: [
        {
            level: "Beginner",
            title: "Basic Locksmithing",
            description: "Master fundamental lock mechanisms, key cutting, and basic security systems",
            features: [
                "8 weeks · Self-paced",
                "Hands-on projects",
                "Certificate upon completion"
            ],
            cta: {
                label: "Get Started",
                event: "courses:basic"
            }
        },
        {
            level: "Intermediate",
            title: "Electronic Lock Systems",
            description: "Learn installation and programming of modern electronic access control systems",
            features: [
                "12 weeks · Live sessions",
                "Expert mentorship",
                "Industry certification"
            ],
            cta: {
                label: "Get Started",
                event: "courses:electronic"
            }
        },
        {
            level: "Advanced",
            title: "Master Key Systems",
            description: "Design and implement complex master key systems for commercial applications",
            features: [
                "16 weeks · Intensive",
                "Real-world projects",
                "Professional certification"
            ],
            cta: {
                label: "Get Started",
                event: "courses:masterkey"
            }
        }
    ]
};
