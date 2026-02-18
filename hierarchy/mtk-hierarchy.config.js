// mtk-hierarchy configuration
window.app = window.app || {};

window.app = {
    "hierarchy": [
<<<<<<< HEAD
        {
            "title": "Introduction to Locksmithing",
            "access": true,
            "modules": [
		{
		    "module_id": "M1",
=======
	{
	    "title": "Introduction to Locksmithing",
	    "access": true,
	    "modules": [
		{
		    "id": "module-1",
>>>>>>> 02.16.2026
		    "title": "Foundations of Locksmithing",
		    "access": true,
		    "processed": 1,
		    "lessons": [
			{
			    "id": "lesson-1-1",
			    "access": true,
			    "title": "Introduction",
<<<<<<< HEAD
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Introduction",
				    "url": "https://vimeo.com/827172729",
				    "type": "video"
=======
			    "resources": [
				{
				    "id": "resource-1-1-1",
				    "access": false,
				    "type": "video",
				    "description": "Introduction to your instructor and the course",
				    "url": "https://vimeo.com/827172729"
>>>>>>> 02.16.2026
				}
			    ]
			},
			{
<<<<<<< HEAD
			    "lesson_no": 1,
			    "title": "The Tools Needed in Your Toolbag",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 1 - The Tools Needed in Your Toolbag",
				    "url": "https://vimeo.com/827172768",
				    "type": "video"
				}
			    ]
			},
			{
			    "lesson_no": 2,
			    "title": "Lock Grades: How Locks Are Classified",
=======
			    "id": "lesson-1-2",
>>>>>>> 02.16.2026
			    "access": false,
			    "title": "The tools needed in your toolbag",
			    "resources": [
				{
<<<<<<< HEAD
				    "description": "Lesson 2 - Lock Grades: How Locks Are Classified",
				    "url": "https://vimeo.com/827172783",
				    "type": "video"
=======
				    "id": "resource-1-2-1",
				    "access": false,
				    "type": "video",
				    "description": "Tools Overview Video",
				    "url": "https://vimeo.com/827172768"
>>>>>>> 02.16.2026
				}
			    ]
			},
			{
			    "id": "lesson-1-3",
			    "access": false,
			    "title": "Understanding the deadbolt and how to install",
			    "resources": [
				{
<<<<<<< HEAD
				    "description": "Lesson 3 - Deadbolts: What They Are and How to Install Them",
				    "url": "https://vimeo.com/827172807",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L3-Deadbolt1.jpg",
				    "type": "photo"
=======
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
>>>>>>> 02.16.2026
				}
			    ]
			},
			{
			    "id": "lesson-1-4",
			    "access": false,
			    "title": "Different residential and commercial doors",
			    "resources": [
				{
<<<<<<< HEAD
				    "description": "Lesson 4 - Doorknobs: What They Are and How to Install Them",
				    "url": "https://vimeo.com/827172821",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L4-Doorknob1.gif",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 5,
			    "title": "Common Residential and Commercial Doors: A Quick Survey",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 5 - Common Residential and Commercial Doors: A Quick Survey",
				    "url": "https://vimeo.com/827172835",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L5-CommercialGlassaluminumdoor1.jpeg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L5-CommercialGlassaluminumdoor2.jpeg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L5-CommercialGlassaluminumdoor3.jpeg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L5-Commercialaluminumdoor1.jpeg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L5-Commercialaluminumdoor2.jpeg",
				    "type": "photo"
				}
			    ]
=======
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
>>>>>>> 02.16.2026
			}
		    ],
		    "quiz": {
			"id": "quiz-module-1",
			"title": "Module Quiz: Foundations of Locksmithing",
<<<<<<< HEAD
			"module_id": "M1",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Module Quiz: Foundations of Locksmithing"
=======
			"description": "Test your knowledge on the fundamentals of locksmithing.",
			"url": "https://example.com/quiz/foundations",
			"access": false
>>>>>>> 02.16.2026
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
		    "processed": 1,
		    "access": false,
		    "lessons": [
			{
			    "id": "lesson-2-1-1",
			    "access": false,
			    "title": "Understanding pin tumbler cylinders",
			    "resources": [
				{
<<<<<<< HEAD
				    "description": "Lesson 7 - Pin Tumbler Cylinders: How They Work",
				    "url": "https://vimeo.com/827172850",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L6-Pin-tumbler-cylinder1.jpg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L6-Pin-tumbler-cylinder2.jpg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L6-Pin-tumbler-cylinder3.jpg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L6-Pin-tumbler-cylinder4.jpg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L6-Pin-tumbler-cylinder5.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 8,
			    "title": "KIK Cylinders: An Introduction",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 8 - KIK Cylinders: An Introduction",
				    "url": "https://vimeo.com/827172867",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L7-Kik-Cylinder1.jpg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L7-Kik-Cylinder2.jpg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L7-Kik-Cylinder3.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 9,
			    "title": "Rim Cylinders: An Introduction",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 9 - Rim Cylinders: An Introduction",
				    "url": "https://vimeo.com/827172884",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L8-Rim-Cylinder1.jpg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L8-Rim-Cylinder2.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 10,
			    "title": "Mortise Cylinders: Key Differences and Use Cases",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 10 - Mortise Cylinders: Key Differences and Use Cases",
				    "url": "https://vimeo.com/827172899",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L9-Mortise-cylinder1.jpg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L9-Mortise-cylinder2.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 11,
			    "title": "Profile Cylinders: An Introduction",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 11 - Profile Cylinders: An Introduction",
				    "url": "https://vimeo.com/827172916",
				    "type": "video"
				}
			    ]
=======
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
>>>>>>> 02.16.2026
			}
		    ],
		    "quiz": {
			"id": "quiz-module-2-1",
			"title": "Module Quiz: Residential Lock Cylinders",
<<<<<<< HEAD
			"module_id": "M2",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Module Quiz: Residential Lock Cylinders"
		    }
		},
		{
		    "module_id": "M3",
		    "title": "Keys and Key Machines",
		    "processed": 1,
		    "access": false,
		    "lessons": [
			{
			    "lesson_no": 13,
			    "title": "Mailbox Locks: An Introduction",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 13 - Mailbox Locks: An Introduction",
				    "url": "https://vimeo.com/827172933",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L11-Mailbox-Lock1.jpg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L11-Mailbox-Lock2.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 14,
			    "title": "Keypad Deadbolts: How to Install One",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 14 - Keypad Deadbolts: How to Install One",
				    "url": "https://vimeo.com/827172950",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L12-Key-Machines1.jpg",
				    "type": "photo"
				},
				{
				    "description": "Photo",
				    "url": "L12-Key-Machines2.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 15,
			    "title": "Kwikset SmartKey Technology: An Introduction",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 15 - Kwikset SmartKey Technology: An Introduction",
				    "url": "https://vimeo.com/827172966",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L13-Key-Machines1.jpg",
				    "type": "photo"
				}
			    ]
			}
		    ],
		    "quiz": {
			"lesson_no": 16,
			"title": "Module Quiz: Keys and Key Machines",
			"module_id": "M3",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Module Quiz: Keys and Key Machines"
		    }
		},
		{
		    "module_id": "M4",
		    "title": "Lock Picking Techniques",
		    "processed": 1,
		    "access": false,
		    "lessons": [
			{
			    "lesson_no": 17,
			    "title": "Common Everyday Keys",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 17 - Common Everyday Keys",
				    "url": "https://vimeo.com/827172984",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L14-Lock-picking1.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 18,
			    "title": "How to Duplicate a Key",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 18 - How to Duplicate a Key",
				    "url": "https://vimeo.com/827173000",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L15-Raking1.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 19,
			    "title": "How to Duplicate a Key (Continued)",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 19 - How to Duplicate a Key (Continued)",
				    "url": "https://vimeo.com/827173017",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L16-SPP1.jpg",
				    "type": "photo"
				}
			    ]
			}
		    ],
		    "quiz": {
			"lesson_no": 20,
			"title": "Module Quiz: Lock Picking Techniques",
			"module_id": "M4",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Module Quiz: Lock Picking Techniques"
		    }
=======
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
>>>>>>> 02.16.2026
		}
            ]
        },
        {
            "title": "Rekeying & Master Keys",
            "access": false,
            "modules": [
		{
		    "module_id": "M5",
		    "title": "Rekeying Fundamentals",
		    "processed": 1,
		    "access": false,
		    "lessons": [
			{
			    "lesson_no": 21,
			    "title": "Pinning Kits: What They Are and How to Use Them",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 21 - Pinning Kits: What They Are and How to Use Them",
				    "url": "https://vimeo.com/827173034",
				    "type": "video"
				}
			    ]
			},
			{
			    "lesson_no": 22,
			    "title": "Pinning Kits: Pin Types and Basics",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 22 - Pinning Kits: Pin Types and Basics",
				    "url": "https://vimeo.com/827173050",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L18-Rekeying-Tools1.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 23,
			    "title": "Doorknobs: How to Disassemble and Rekey",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 23 - Doorknobs: How to Disassemble and Rekey",
				    "url": "https://vimeo.com/827173068",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L19-Rekey-cylinder1.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 24,
			    "title": "Deadbolts: How to Disassemble and Rekey",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 24 - Deadbolts: How to Disassemble and Rekey",
				    "url": "https://vimeo.com/827173084",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L20-Rekey-KIK1.jpg",
				    "type": "photo"
				}
			    ]
			}
		    ],
		    "quiz": {
			"lesson_no": 25,
			"title": "Module Quiz: Rekeying Fundamentals",
			"module_id": "M5",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Module Quiz: Rekeying Fundamentals"
		    }
		},
		{
		    "module_id": "M6",
		    "title": "Advanced Rekeying",
		    "access": false,
		    "processed": 1,
		    "lessons": [
			{
			    "lesson_no": 26,
			    "title": "Deadbolts: Install and Rekey",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 26 - Deadbolts: Install and Rekey",
				    "url": "https://vimeo.com/827173101",
				    "type": "video"
				}
			    ]
			},
			{
			    "lesson_no": 27,
			    "title": "Mortise Cylinders: Disassemble and Rekey",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 27 - Mortise Cylinders: Disassemble and Rekey",
				    "url": "https://vimeo.com/827173118",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L22-Rekey-Mortise1.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 28,
			    "title": "Padlocks: Disassemble and Rekey",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 28 - Padlocks: Disassemble and Rekey",
				    "url": "https://vimeo.com/827173135",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L23-Rekey-Padlock1.jpg",
				    "type": "photo"
				}
			    ]
			}
		    ],
		    "quiz": {
			"lesson_no": 29,
			"title": "Module Quiz: Advanced Rekeying",
			"module_id": "M6",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Module Quiz: Advanced Rekeying"
		    }
		},
		{
		    "module_id": "M7",
		    "title": "Master Key Systems",
		    "processed": 1,
		    "access": false,
		    "lessons": [
			{
			    "lesson_no": 30,
			    "title": "Master Keys: What They Are",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 30 - Master Keys: What They Are",
				    "url": "https://vimeo.com/827173152",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L24-Master-keying1.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 31,
			    "title": "Master Keys: Calculating Master Pins",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 31 - Master Keys: Calculating Master Pins",
				    "url": "https://vimeo.com/827173168",
				    "type": "video"
				}
			    ]
			},
			{
			    "lesson_no": 32,
			    "title": "Master Keys: Building a Master Key System",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 32 - Master Keys: Building a Master Key System",
				    "url": "https://vimeo.com/827173185",
				    "type": "video"
				}
			    ]
			}
		    ],
		    "quiz": {
			"lesson_no": 33,
			"title": "Module Quiz: Master Key Systems",
			"module_id": "M7",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Module Quiz: Master Key Systems"
		    }
		}
            ]
        },
        {
            "title": "Automotive Locksmithing",
            "access": false,
            "modules": [
		{
		    "module_id": "M8",
		    "title": "Automotive Locks and Entry",
		    "processed": 1,
		    "access": false,
		    "lessons": [
			{
			    "lesson_no": 34,
			    "title": "Automotive Keys and Locks: An Introduction",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 34 - Automotive Keys and Locks: An Introduction",
				    "url": "https://vimeo.com/827173201",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L27-Auto-Locks-Overview1.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 35,
			    "title": "How to Open a Car Door",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 35 - How to Open a Car Door",
				    "url": "https://vimeo.com/827173219",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L28-Car-door-opening1.jpg",
				    "type": "photo"
				}
			    ]
			},
			{
			    "lesson_no": 36,
			    "title": "Automotive Key Types",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 36 - Automotive Key Types",
				    "url": "https://vimeo.com/827173236",
				    "type": "video"
				},
				{
				    "description": "Photo",
				    "url": "L29-Auto-key-types1.jpg",
				    "type": "photo"
				}
			    ]
			}
		    ],
		    "quiz": {
			"lesson_no": 37,
			"title": "Module Quiz: Automotive Locks and Entry",
			"module_id": "M8",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Module Quiz: Automotive Locks and Entry"
		    }
		},
		{
		    "module_id": "M9",
		    "title": "Automotive Electronics",
		    "processed": 1,
		    "access": false,
		    "lessons": [
			{
			    "lesson_no": 38,
			    "title": "Transponder Keys: An Introduction",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 38 - Transponder Keys: An Introduction",
				    "url": "https://vimeo.com/827173253",
				    "type": "video"
				}
			    ]
			}
		    ],
		    "quiz": {
			"lesson_no": 39,
			"title": "Module Quiz: Automotive Electronics",
			"module_id": "M9",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Module Quiz: Automotive Electronics"
		    }
		}
            ]
        },
        {
            "title": "Commercial Locksmithing",
            "access": false,
            "modules": [
		{
		    "module_id": "M10",
		    "title": "Commercial Door Hardware",
		    "processed": 1,
		    "access": false,
		    "lessons": [
			{
			    "lesson_no": 40,
			    "title": "Commercial Doors: An Introduction",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 40 - Commercial Doors: An Introduction",
				    "url": "https://vimeo.com/827173270",
				    "type": "video"
				}
			    ]
			},
			{
			    "lesson_no": 41,
			    "title": "Commercial Lock Hardware: Overview",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 41 - Commercial Lock Hardware: Overview",
				    "url": "https://vimeo.com/827173287",
				    "type": "video"
				}
			    ]
			},
			{
			    "lesson_no": 42,
			    "title": "Exit Devices and Panic Bars: Basics",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 42 - Exit Devices and Panic Bars: Basics",
				    "url": "https://vimeo.com/827173305",
				    "type": "video"
				}
			    ]
			},
			{
			    "lesson_no": 43,
			    "title": "Door Closers: Basics",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 43 - Door Closers: Basics",
				    "url": "https://vimeo.com/827173322",
				    "type": "video"
				}
			    ]
			}
		    ],
		    "quiz": {
			"lesson_no": 44,
			"title": "Module Quiz: Commercial Door Hardware",
			"module_id": "M10",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Module Quiz: Commercial Door Hardware"
		    }
		}
            ]
        },
        {
            "title": "The Business of Locksmithing and Certification",
            "access": false,
            "modules": [
		{
		    "module_id": "M11",
		    "title": "The Business of Locksmithing",
		    "processed": 1,
		    "access": false,
		    "lessons": [
			{
			    "lesson_no": 45,
			    "title": "Locksmith Licensing",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 45 - Locksmith Licensing",
				    "url": "https://vimeo.com/827173408",
				    "type": "video"
				}
			    ]
			},
			{
			    "lesson_no": 46,
			    "title": "Insurance and Liability",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 46 - Insurance and Liability",
				    "url": "https://vimeo.com/827173425",
				    "type": "video"
				}
			    ]
			},
			{
			    "lesson_no": 47,
			    "title": "Pricing and Estimates",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 47 - Pricing and Estimates",
				    "url": "https://vimeo.com/827173442",
				    "type": "video"
				}
			    ]
			},
			{
			    "lesson_no": 48,
			    "title": "Customer Relations",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 48 - Customer Relations",
				    "url": "https://vimeo.com/827173460",
				    "type": "video"
				}
			    ]
			},
			{
			    "lesson_no": 49,
			    "title": "How to Begin Advertising as a Locksmith",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 49 - How to Begin Advertising as a Locksmith",
				    "url": "https://vimeo.com/827173770",
				    "type": "video"
				}
			    ]
			}
		    ],
		    "quiz": {
			"lesson_no": 50,
			"title": "Module Quiz: The Business of Locksmithing",
			"module_id": "M11",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Module Quiz: The Business of Locksmithing"
		    }
		},
		{
		    "module_id": "M12",
		    "title": "Certification and Course Completion",
		    "processed": 1,
		    "access": false,
		    "lessons": [
			{
			    "lesson_no": 51,
			    "title": "Course Completion and Certification",
			    "access": false,
			    "badge": {
				"text": "Unlocked",
				"color": "green"
			    },
			    "resources": [
				{
				    "description": "Lesson 51 - Course Completion and Certification",
				    "url": "https://vimeo.com/827173787",
				    "type": "video"
				}
			    ]
			}
		    ],
		    "quiz": {
			"lesson_no": 52,
			"title": "Final Quiz: Certification and Course Completion",
			"module_id": "M12",
			"access": false,
			"badge": {
			    "text": "Quiz Open",
			    "color": "orange"
			},
			"rules": {
			    "questions": 20,
			    "choices": 4,
			    "pass_percent": 80
			},
			"type": "quiz",
			"description": "Final Quiz: Certification and Course Completion"
		    }
		}
            ]
        }
    ]
}

