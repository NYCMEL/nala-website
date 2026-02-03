// mtk-hierarchy configuration with unique IDs at all 3 levels
window.app = window.app || {};

window.app = {
    "hierarchy": [
	{
	    "title": "Introduction to Locksmithing",
	    "access": true,
	    "processed": false,
	    "modules": [
		{
		    "id": "module-1",
		    "title": "Foundations of Locksmithing",
		    "access": true,
		    "processed": true,
		    "lessons": [
			{
			    "id": "lesson-1-1",
			    "access": true,
			    "title": "Introduction",
			    "processed": true,
			    "resources": [
				{
				    "id": "resource-1-1-1",
				    "processed": true,
				    "access": false,
				    "type": "video",
				    "description": "Introduction to your instructor and the course",
				    "url": "https://vimeo.com/827172729"
				}
			    ]
			},
			{
			    "id": "lesson-1-2",
			    "access": true,
			    "title": "The tools needed in your toolbag",
			    "processed": true,
			    "resources": [
				{
				    "id": "resource-1-2-1",
				    "processed": true,
				    "access": true,
				    "type": "video",
				    "description": "Lesson 1 - The tools needed in your toolbag",
				    "url": "https://vimeo.com/827172768"
				}
			    ]
			}
		    ]
		}
	    ]
	}
    ]
};
