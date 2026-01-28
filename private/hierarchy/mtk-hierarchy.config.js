window.app = window.app || {};

window.app.hierarchy = [
    {
	title: "Course Alpha",
	access: true,
	modules: [
	    {
		title: "Module 1",
		access: true,
		lessons: [
		    {
			title: "Lesson 1",
			access: true,
			resources: [
			    { description: "Intro Video", url: "https://vimeo.com/827172729" }
			]
		    },
		    {
			title: "Lesson 2",
			access: false,
			resources: [
			    { description: "Slides", url: "https://example.com/slides" }
			]
		    }
		]
	    },
	    {
		title: "Module 2",
		access: true,
		lessons: [
		    {
			title: "Lesson A",
			access: true,
			resources: [
			    { description: "Video", url: "https://vimeo.com/827172729" }
			]
		    },
		    {
			title: "Lesson B",
			access: true,
			resources: [
			    { description: "Reference PDF", url: "https://example.com/pdf" }
			]
		    },
		    {
			title: "Lesson C",
			access: false,
			resources: []
		    }
		]
	    }
	]
    },
];
