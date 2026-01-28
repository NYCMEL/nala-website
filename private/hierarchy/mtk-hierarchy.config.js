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

function generateModules() {
  const moduleNames = [
    "Foundations",
    "Color and Typography",
    "Components",
    "Layouts",
    "Navigation",
    "Motion",
    "Theming"
  ];
  return moduleNames.map(name => ({
    title: name,
    access: true,
    lessons: randomLessons()
  }));
}

// Generate 5 courses
window.app.hierarchy = [];
for (let c = 1; c <= 5; c++) {
  window.app.hierarchy.push({
    title: `Course ${c} - Material Design`,
    access: true,
    modules: generateModules()
  });
}
