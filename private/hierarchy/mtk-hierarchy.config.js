window.app = window.app || {};

function randomBool() {
    return Math.random() > 0.4;
}

function randomLessons(min, max) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    return Array.from({ length: count }).map((_, i) => ({
	title: `Lesson ${i + 1}`,
	access: randomBool(),
	resources: [
	    {
		description: "Video (Vimeo)",
		url: "https://vimeo.com/827172729"
	    }
	]
    }));
}

window.app.hierarchy = {
    events: {
	init: "mtk-hierarchy:init",
	toggle: "mtk-hierarchy:toggle",
	resourceClick: "mtk-hierarchy:resource-click",
	error: "mtk-hierarchy:error"
    },
    courses: Array.from({ length: 5 }).map((_, i) => ({
	title: `Course ${i + 1}`,
	access: true,
	modules: [
	    {
		title: `Module ${i + 1}.1`,
		access: true,
		lessons: randomLessons(2, 6)
	    }
	]
    }))
};
