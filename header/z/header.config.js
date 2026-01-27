window.app = window.app || {};

window.app.header = {
    fixed: true,

    logo: { text: "NALA", url: "/Melify/tools/webcomponents/img/logo.png" },

    menu: [
	{ id: "home", label: "Home", href: "#home", active: true },
	{ id: "curriculum", label: "Curriculum", href: "#curriculum" },
	{ id: "contact", label: "Contact Us", href: "#contact" }
    ],
    buttons: [
	{ id: "login", label: "Login", type: "primary", action: "login" }
    ]
};
