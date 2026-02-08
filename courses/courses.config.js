window.app = window.app || {};

window.app.courses = {
  title: "<h1>Included in the Program</h1>",
  description:
    "One complete locksmith training program, organized into five connected parts<BR>that build practical skills from the fundamentals through business readiness.",
  // cta: {
  //     label: "",
  //     event: ""
  // },
  items: [
    {
      level: "Part I",
      title: "Introduction to Locksmithing",
      description:
        "Learn the foundations of locksmithing, including essential tools, common lock types, door hardware basics, and safe professional work practices.",
      features: [
        "Core tools, lock types & terminology",
        "Door hardware and installation basics",
        "Preparation for hands-on locksmith work"
      ],
      cta: {
        label: "Get Started",
        event: "courses:intro"
      }
    },
    {
      level: "Part II",
      title: "Residential Locksmithing",
      description:
        "Build practical skills for residential service work, covering cylinders, rekeying fundamentals, deadbolts, and common home lock hardware.",
      features: [
        "Residential cylinders and rekeying concepts",
        "Deadbolts, knobs & home hardware",
        "Common residential service scenarios"
      ],
      cta: {
        label: "Get Started",
        event: "courses:residential"
      }
    },
    {
      level: "Part III",
      title: "Commercial Locksmithing",
      description:
        "Understand commercial door and lock systems, including door types, keying concepts, and the basics of access control used in commercial environments.",
      features: [
        "Commercial doors and hardware",
        "Key systems and master key concepts",
        "Introduction to access control components"
      ],
      cta: {
        label: "Get Started",
        event: "courses:commercial"
      }
    },
    {
      level: "Part IV",
      title: "Automotive Locksmithing",
      description:
        "Learn the fundamentals of automotive locksmithing, including vehicle entry principles, key types, and modern automotive security systems.",
      features: [
        "Vehicle entry principles",
        "Automotive key types and technologies",
        "Modern car locking systems"
      ],
      cta: {
        label: "Get Started",
        event: "courses:automotive"
      }
    },
    {
      level: "Part V",
      title: "Building a Locksmith Business",
      description:
        "Learn the essentials of starting and operating a locksmith business, including licensing considerations, pricing fundamentals, customer communication, and marketing basics.",
      features: [
        "Licensing and business setup considerations",
        "Pricing and service presentation",
        "Customer relations and basic marketing"
      ],
      cta: {
        label: "Get Started",
        event: "courses:business"
      }
    }
  ]
};
