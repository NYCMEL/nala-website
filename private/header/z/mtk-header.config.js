/**
 * MTK-Header Configuration
 * JSON-driven configuration for the header component
 */
window.app = window.app || {};
window.app.header = {
    logo: {
	src: "img/logo-nala-association.webp",
	alt: "MTK Logo",
	height: "65px",
	link: "#home"
    },
    menuItems: [
	{
	    id: "menu-dashboard",
	    label: '<span class="material-icons">dashboard</span><span>Dashboard</span>',
	    link: "#dashboard",
	    active: false
	},
	{
	    id: "menu-projects",
	    label: '<span class="material-icons">folder</span><span>Projects</span>',
	    link: "#projects",
	    active: true
	},
	{
	    id: "menu-notifications",
	    label: '<span class="material-icons">notifications</span><span>Alerts</span>',
	    link: "#notifications",
	    active: false
	},
	{
	    id: "menu-user",
	    label: '<span class="material-icons">account_circle</span><span>Account</span>',
	    link: "#",
	    active: false,
	    dropdown: [
		{
		    id: "menu-profile",
		    label: '<span class="material-icons">person</span><span>Profile</span>',
		    link: "#profile"
		},
		{
		    id: "menu-logout",
		    label: '<span class="material-icons">logout</span><span>Logout</span>',
		    link: "#logout"
		}
	    ]
	}
    ]
};
