window.app = window.app || {};

window.app.header = {
    fixed: true,
    
    logo: { text: "MyApp", img: "img/logo-nala-association.webp" },
    
    menu: [
	{ cname:"header", id: "parts", label: "Curriculum", href: "#parts", active: true },
	{ cname:"header", id: "settings", label: "Settings", href: "#settings"},
	{ cname:"header", id: "logout", label: "Mel", href: "#logout"}
    ],

    buttons: []
}
