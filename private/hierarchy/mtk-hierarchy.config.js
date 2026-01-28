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
		    title: "Module A1",
		    access: true,
		    lessons: [
			{
			    title: "Lesson A1-1",
			    access: true,
			    resources: [
				{ description: "Intro Video", url: "https://vimeo.com/827172729" }
			    ]
			},
			{
			    title: "Lesson A1-2",
			    access: false,
			    resources: [
				{ description: "Locked Video", url: "https://vimeo.com/827172729" }
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
		    title: "Module B1",
		    access: true,
		    lessons: [
			{
			    title: "Lesson B1-1",
			    access: true,
			    resources: [
				{ description: "Overview", url: "https://vimeo.com/827172729" }
			    ]
			}
		    ]
		}
	    ]
	},
	{
	    title: "Course Gamma",
	    access: false,
	    modules: [
		{
		    title: "Module G1",
		    access: false,
		    lessons: [
			{
			    title: "Lesson G1-1",
			    access: false,
			    resources: [
				{ description: "Restricted", url: "https://vimeo.com/827172729" }
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
		    title: "Module D1",
		    access: true,
		    lessons: [
			{
			    title: "Lesson D1-1",
			    access: true,
			    resources: [
				{ description: "Demo", url: "https://vimeo.com/827172729" }
			    ]
			},
			{
			    title: "Lesson D1-2",
			    access: true,
			    resources: [
				{ description: "Extra Demo", url: "https://vimeo.com/827172729" }
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
		    title: "Module E1",
		    access: true,
		    lessons: [
			{
			    title: "Lesson E1-1",
			    access: true,
			    resources: [
				{ description: "Tutorial", url: "https://vimeo.com/827172729" }
			    ]
			}
		    ]
		}
	    ]
	}
    ]
};
