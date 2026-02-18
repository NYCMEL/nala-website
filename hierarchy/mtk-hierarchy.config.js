// mtk-hierarchy configuration
window.app = window.app || {};

window.app = {
    "hierarchy": [
	{
	    "title": "Introduction to Locksmithing",
	    "access": true,
	    "modules": [
		{
		    "id": "module-1",
		    "title": "Foundations of Locksmithing",
		    "access": true,
		    "lessons": [
			{
			    "id": "lesson-1-1",
			    "access": true,
			    "title": "Introduction",
			    "resources": [
				{
				    "id": "resource-1-1-1",
				    "access": false,
				    "type": "video",
				    "description": "Introduction to your instructor and the course",
				    "url": "https://vimeo.com/827172729"
				}
			    ]
			},
			{
			    "id": "lesson-1-2",
			    "access": false,
			    "title": "The tools needed in your toolbag",
			    "resources": [
				{
				    "id": "resource-1-2-1",
				    "access": false,
				    "type": "video",
				    "description": "Tools Overview Video",
				    "url": "https://vimeo.com/827172768"
				}
			    ]
			},
			{
			    "id": "lesson-1-3",
			    "access": false,
			    "title": "Understanding the deadbolt and how to install",
			    "resources": [
				{
				    "id": "resource-1-3-1",
				    "access": false,
				    "type": "video",
				    "description": "Deadbolt Installation Video",
				    "url": "https://vimeo.com/827172807"
				},
				{
				    "id": "resource-1-3-2",
				    "access": false,
				    "type": "photo",
				    "description": "Deadbolt Photo 1",
				    "url": "https://via.placeholder.com/800x600/1976d2/ffffff?text=Deadbolt-1"
				}
			    ]
			},
			{
			    "id": "lesson-1-4",
			    "access": false,
			    "title": "Different residential and commercial doors",
			    "resources": [
				{
				    "id": "resource-1-4-1",
				    "access": false,
				    "type": "video",
				    "description": "Residential and Commercial Doors Overview",
				    "url": "https://vimeo.com/827172835"
				},
				{
				    "id": "resource-1-4-2",
				    "access": false,
				    "type": "photo",
				    "description": "Commercial Glass Door",
				    "url": "https://via.placeholder.com/800x600/d32f2f/ffffff?text=Glass-Door-1"
				},
				{
				    "id": "resource-1-4-3",
				    "access": false,
				    "type": "photo",
				    "description": "Aluminum Door Type 1",
				    "url": "https://via.placeholder.com/800x600/7b1fa2/ffffff?text=Aluminum-Door-1"
				},
				{
				    "id": "resource-1-4-4",
				    "access": false,
				    "type": "photo",
				    "description": "Aluminum Door Type 2",
				    "url": "https://via.placeholder.com/800x600/0288d1/ffffff?text=Aluminum-Door-2"
				},
				{
				    "id": "resource-1-4-5",
				    "access": false,
				    "type": "photo",
				    "description": "Commercial Entry System",
				    "url": "https://via.placeholder.com/800x600/f57c00/ffffff?text=Entry-System"
				}
			    ]
			}
		    ],
		    "quiz": {
			"id": "quiz-module-1",
			"title": "Module Quiz: Foundations of Locksmithing",
			"description": "Test your knowledge on the fundamentals of locksmithing.",
			"url": "https://example.com/quiz/foundations",
			"access": false
		    }
		}
	    ]
	},
	{
	    "title": "Residential Locksmithing",
	    "access": false,
	    "modules": [
		{
		    "id": "module-2-1",
		    "title": "Residential Lock Cylinders",
		    "access": false,
		    "lessons": [
			{
			    "id": "lesson-2-1-1",
			    "access": false,
			    "title": "Understanding pin tumbler cylinders",
			    "resources": [
				{
				    "id": "resource-2-1-1-1",
				    "access": false,
				    "type": "video",
				    "description": "Pin Tumbler Mechanism Explained",
				    "url": "https://vimeo.com/827172850"
				},
				{
				    "id": "resource-2-1-1-2",
				    "access": false,
				    "type": "photo",
				    "description": "Pin Tumbler Diagram 1",
				    "url": "https://via.placeholder.com/800x600/1976d2/ffffff?text=Pin-Diagram-1"
				},
				{
				    "id": "resource-2-1-1-3",
				    "access": false,
				    "type": "photo",
				    "description": "Pin Tumbler Diagram 2",
				    "url": "https://via.placeholder.com/800x600/388e3c/ffffff?text=Pin-Diagram-2"
				},
				{
				    "id": "resource-2-1-1-4",
				    "access": false,
				    "type": "photo",
				    "description": "Cross Section View",
				    "url": "https://via.placeholder.com/800x600/d32f2f/ffffff?text=Cross-Section"
				}
			    ]
			}
		    ],
		    "quiz": {
			"id": "quiz-module-2-1",
			"title": "Module Quiz: Residential Lock Cylinders",
			"description": "Test your understanding of pin tumbler cylinders.",
			"url": "https://example.com/quiz/cylinders",
			"access": false
		    }
		},
		{
		    "id": "module-2-2",
		    "title": "Advanced Locksmithing (Premium - Locked)",
		    "access": false,
		    "lessons": [
			{
			    "id": "lesson-2-2-1",
			    "access": false,
			    "title": "Advanced Lock Picking",
			    "resources": [
				{
				    "id": "resource-2-2-1-1",
				    "access": false,
				    "type": "video",
				    "description": "Advanced Techniques",
				    "url": "https://vimeo.com/827172850"
				}
			    ]
			}
		    ]
		}
	    ]
	}
    ]
};
