window.app = window.app || {};

window.app.header = {
    theme: "dark",

    logo: {
	src: "img/logo-nala-association.webp",
	alt: "Company Logo",
	href: "#"
    },

    menus: [
	{
	    id: "dashboard",
	    label: "Dashboard",
	    href: "#dashboard"
	}, {
	    id: "settings",
	    label: "Settings",
	    href: "#settings"
	}, {
	    id: "user",
	    label: "<i class='fa fa-user'></i>&nbsp;&nbsp;Mel",
	    type: "dropdown",
	    items: [
		{ id: "profile", label: "Profile" },
		{ id: "logout", label: "Logout" }
	    ]
	}
    ]
};
