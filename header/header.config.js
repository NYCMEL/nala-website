window.app = window.app || {};

window.app.header = {
    fixed: true,
    
    logo: { text: "MyApp", img: "./img/logo-nala-association.webp" },
    
    menu: [
	{ cname:"header", id: "home", label: "Home", href: "#home", active: true },
	{ cname:"header", id: "curriculum", label: "Curriculum", href: "#curriculum" },
	{ cname:"header", id: "login", label: "Login", href: "#login" }
    ],

    buttons: []
}

