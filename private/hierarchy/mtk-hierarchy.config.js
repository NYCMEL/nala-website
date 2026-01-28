window.app = window.app || {};

function randomBool() {
  return Math.random() < 0.7; // ~70% chance access true
}

function randomLessons(min = 2, max = 5) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const lessons = [];
  for (let i = 1; i <= count; i++) {
    lessons.push({
      title: `Lesson ${i}`,
      access: randomBool(),
      resources: [
        {
          description: `Resource ${i}`,
          url: `https://example.com/resource-${i}`
        }
      ]
    });
  }
  return lessons;
}

window.app.hierarchy = [
  {
    title: "Material Design Fundamentals",
    access: true,
    modules: [
      {
        title: "Foundations",
        access: true,
        lessons: randomLessons()
      },
      {
        title: "Color and Typography",
        access: true,
        lessons: randomLessons()
      },
      {
        title: "Components",
        access: true,
        lessons: randomLessons()
      },
      {
        title: "Layouts",
        access: true,
        lessons: randomLessons()
      },
      {
        title: "Navigation",
        access: true,
        lessons: randomLessons()
      },
      {
        title: "Motion",
        access: true,
        lessons: randomLessons()
      },
      {
        title: "Theming",
        access: true,
        lessons: randomLessons()
      }
    ]
  }
];
