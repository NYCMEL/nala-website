// mtk-header configuration
window.app = window.app || {};

window.app.header = {
    logo: {
	src: "img/logo-nala-association.webp",
	alt: "MTK Logo",
	height: "65px",
	link: "/"
    },
    menuItems: [
	{
	    id: "home",
	    label: "<span class='material-icons'>home</span><span>Home</span>",
	    link: "#home",
	    active: true
	},
	{
	    id: "courses",
	    label: "<span class='material-icons'>school</span><span>Courses</span>",
	    link: "#courses",
	    active: false
	},
	{
	    id: "dashboard",
	    label: "<span class='material-icons'>dashboard</span><span>Dashboard</span>",
	    link: "#dashboard",
	    active: false
	},
	{
	    id: "user-menu",
	    label: "<span class='material-icons'>account_circle</span><span>Account</span>",
	    dropdown: true,
	    items: [
		{
		    id: "profile",
		    label: "<span class='material-icons'>person</span><span>Profile</span>",
		    link: "#profile"
		},
		{
		    id: "logout",
		    label: "<span class='material-icons'>logout</span><span>Logout</span>",
		    link: "#logout"
		}
	    ]
	}
    ]
};
