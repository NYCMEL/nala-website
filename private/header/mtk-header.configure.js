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
	    href: "#dashboard",
	    active: true
	}, {
	    id: "user",
	    label: "<i class='fa fa-user'></i>&nbsp;&nbsp;Mel",
	    type: "dropdown",
	    items: [
		{ id: "profile", label: "Profile", active:true },
		{ id: "logout", label: "Logout" }
	    ]
	}
    ]
};
