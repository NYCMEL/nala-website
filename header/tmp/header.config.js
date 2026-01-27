window.app = window.app || {};

window.app.header = {
    logo: "../../img/logo-nala-association.webp",

    mode: "dark", // light or dark

    fixed: true,   // fixed to top

    menu: [
	{ text: "Pricing" },
	{ text: "About" },
	{ text: "Contact" },
	{
	    text: "XXX Features",
	    dropdown: ["Option 1", "Option 2"]
	}
    ],
    buttons: []
};
