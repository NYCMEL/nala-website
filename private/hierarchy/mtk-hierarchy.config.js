window.app = window.app || {};

window.app.hierarchy = [
  {
    title: "Material Design Fundamentals",
    access: true,
    modules: [
      {
        title: "Foundations",
        access: true,
        lessons: [
          {
            title: "Introduction",
            access: true,
            resources: [
              {
                description: "Intro Video",
                url: "https://vimeo.com/827172729"
              }
            ]
          },
          {
            title: "Design Principles",
            access: false,
            resources: [
              {
                description: "Principles PDF",
                url: "https://example.com/principles"
              }
            ]
          }
        ]
      },
      {
        title: "Color and Typography",
        access: true,
        lessons: [
          {
            title: "Color System",
            access: true,
            resources: [
              {
                description: "Color Demo",
                url: "https://example.com/colors"
              }
            ]
          },
          {
            title: "Typography Scale",
            access: true,
            resources: [
              {
                description: "Typography Guide",
                url: "https://example.com/type"
              }
            ]
          },
          {
            title: "Accessibility",
            access: false,
            resources: []
          }
        ]
      }
    ]
  }
];
