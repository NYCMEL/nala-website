// mtk-hierarchy configuration
window.app = window.app || {};

window.app.hierarchy = [
  {
    title: "Introduction to Locksmithing",
    access: true,
    processed: false,
    modules: [
    {
      id: "module-1",
      title: "Foundations of Locksmithing",
      access: true,
      processed: true,
      lessons: [
        {
          id: "lesson-1-1",
          access: true,
          title: "Introduction",
          processed: true,
          resources: [
            {
              id: "resource-1-1-1",
              processed: true,
              access: true,
              type: "video",
              description: "Introduction to your instructor and the course",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },
            {
              id: "resource-1-1-2",
              processed: true,
              access: true,
              type: "photo",
              description: "Course overview diagram",
              url: "https://via.placeholder.com/800x600/1976d2/ffffff?text=Course+Overview"
            },
            {
              id: "resource-1-1-3",
              processed: false,
              access: true,
              type: "photo",
              description: "Locksmithing tools",
              url: "https://via.placeholder.com/800x600/388e3c/ffffff?text=Tools+Overview"
            }
          ]
        },
        {
          id: "lesson-1-2",
          access: true,
          title: "History of Locks",
          processed: true,
          resources: [
            {
              id: "resource-1-2-1",
              processed: true,
              access: true,
              type: "video",
              description: "The evolution of lock mechanisms",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },
            {
              id: "resource-1-2-2",
              processed: true,
              access: true,
              type: "photo",
              description: "Ancient lock mechanisms",
              url: "https://via.placeholder.com/800x600/d32f2f/ffffff?text=Ancient+Locks"
            }
          ]
        },
        {
          id: "lesson-1-3",
          access: true,
          title: "Basic Lock Components",
          processed: false,
          resources: [
            {
              id: "resource-1-3-1",
              processed: false,
              access: true,
              type: "video",
              description: "Understanding pins, springs, and cylinders",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            }
          ]
        }
      ]
    },
    {
      id: "module-2",
      title: "Pin Tumbler Locks",
      access: true,
      processed: false,
      lessons: [
        {
          id: "lesson-2-1",
          access: true,
          title: "How Pin Tumblers Work",
          processed: false,
          resources: [
            {
              id: "resource-2-1-1",
              processed: false,
              access: true,
              type: "video",
              description: "Detailed explanation of pin tumbler mechanisms",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },
            {
              id: "resource-2-1-2",
              processed: false,
              access: true,
              type: "photo",
              description: "Pin tumbler diagram",
              url: "https://via.placeholder.com/800x600/7b1fa2/ffffff?text=Pin+Tumbler+Diagram"
            },
            {
              id: "resource-2-1-3",
              processed: false,
              access: true,
              type: "photo",
              description: "Cross-section view",
              url: "https://via.placeholder.com/800x600/0288d1/ffffff?text=Cross+Section"
            }
          ]
        },
        {
          id: "lesson-2-2",
          access: true,
          title: "Picking Techniques",
          processed: false,
          resources: [
            {
              id: "resource-2-2-1",
              processed: false,
              access: true,
              type: "video",
              description: "Single pin picking demonstration",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            }
          ]
        }
      ]
    },
    {
      id: "module-3",
      title: "Advanced Techniques",
      access: true,
      processed: false,
      lessons: [
        {
          id: "lesson-3-1",
          access: true,
          title: "Bumping and Raking",
          processed: false,
          resources: [
            {
              id: "resource-3-1-1",
              processed: false,
              access: true,
              type: "video",
              description: "Lock bumping techniques",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            }
          ]
        },
        {
          id: "lesson-3-2",
          access: false,
          title: "High Security Locks",
          processed: false,
          resources: [
            {
              id: "resource-3-2-1",
              processed: false,
              access: false,
              type: "video",
              description: "Premium locked content",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            }
          ]
        }
      ]
    },
    {
      id: "module-4",
      title: "Professional Practice",
      access: true,
      processed: false,
      lessons: [
        {
          id: "lesson-4-1",
          access: true,
          title: "Business Setup",
          processed: false,
          resources: [
            {
              id: "resource-4-1-1",
              processed: false,
              access: true,
              type: "video",
              description: "Starting your locksmith business",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },
            {
              id: "resource-4-1-2",
              processed: false,
              access: true,
              type: "photo",
              description: "Business checklist",
              url: "https://via.placeholder.com/800x600/f57c00/ffffff?text=Business+Checklist"
            }
          ]
        }
      ]
    },
    {
      id: "module-5",
      title: "Certification Preparation",
      access: true,
      processed: false,
      lessons: [
        {
          id: "lesson-5-1",
          access: true,
          title: "Exam Overview",
          processed: false,
          resources: [
            {
              id: "resource-5-1-1",
              processed: false,
              access: true,
              type: "video",
              description: "What to expect on certification exam",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },
            {
              id: "resource-5-1-2",
              processed: false,
              access: true,
              type: "photo",
              description: "Study guide cover",
              url: "https://via.placeholder.com/800x600/689f38/ffffff?text=Study+Guide"
            },
            {
              id: "resource-5-1-3",
              processed: false,
              access: true,
              type: "photo",
              description: "Practice questions",
              url: "https://via.placeholder.com/800x600/5e35b1/ffffff?text=Practice+Questions"
            }
          ]
        }
      ]
    }
  ]
}
];
