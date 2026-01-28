window.app = window.app || {};

window.app.hierarchy = {
  events: {
    init: "mtk-hierarchy:init",
    toggle: "mtk-hierarchy:toggle",
    resourceClick: "mtk-hierarchy:resource-click",
    error: "mtk-hierarchy:error"
  },
  courses: [
    {
      title: "Course Alpha",
      access: true,
      modules: [
        {
          title: "Module 1",
          free: true,
          lessons: [
            {
              title: "Lesson 1",
              resources: [
                {
                  description: "Intro Video",
                  url: "https://vimeo.com/827172729"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: "Course Beta",
      access: true,
      modules: [
        {
          title: "Module A",
          free: true,
          lessons: [
            {
              title: "Lesson A1",
              resources: [
                {
                  description: "Overview Video",
                  url: "https://vimeo.com/827172729"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: "Course Gamma",
      access: true,
      modules: [
        {
          title: "Module X",
          free: true,
          lessons: [
            {
              title: "Lesson X1",
              resources: [
                {
                  description: "Walkthrough",
                  url: "https://vimeo.com/827172729"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: "Course Delta",
      access: true,
      modules: [
        {
          title: "Module D",
          free: true,
          lessons: [
            {
              title: "Lesson D1",
              resources: [
                {
                  description: "Demo Video",
                  url: "https://vimeo.com/827172729"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: "Course Epsilon",
      access: true,
      modules: [
        {
          title: "Module E",
          free: true,
          lessons: [
            {
              title: "Lesson E1",
              resources: [
                {
                  description: "Tutorial",
                  url: "https://vimeo.com/827172729"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
