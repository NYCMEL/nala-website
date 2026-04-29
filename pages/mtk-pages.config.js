// mtk-pages.config.js
// Configuration for mtk-pages component
// Data source: window.app.pages

window.app = window.app || {};

// PAGE DEFINITIONS
// cache: "true"  = load once, reuse on revisit
// cache: "false" = reload every time the page is shown
window.app.pages = [
    {
        "cache": "true",
        "page":  "home",
        "label": "Home",
        "url":   "<wc-include href='home/index.inc.html' />"
    },
    {
        "cache": "true",
        "page":  "register",
        "label": "Register",
        "url":   "<wc-include href='register/index.inc.html' />"
    },
    {
        "cache": "true",
        "page":  "news",
        "label": "About",
        "url":   "<wc-include href='news/index.inc.html' />"
    },
    {
        "cache": "false",
        "page":  "dashboard",
        "label": "Dashboard",
        "url":   "<wc-include href='dashboard/index.inc.html' />"
    },
    {
        "cache": "false",
        "page":  "final",
        "label": "Final",
        "url":   "<wc-include href='final/index.inc.html' />"
    },
    {
        "cache": "false",
        "page":  "hierarchy",
        "label": "Hierarchy",
        "url":   "<wc-include href='hierarchy/index.inc.html' />"
    },
    {
        "cache": "true",
        "page":  "final",
        "label": "Final",
        "url":   "<wc-include href='final/index.inc.html' />"
    },
    {
        "cache": "false",
        "page":  "settings",
        "label": "Settings",
        "url":   "<wc-include href='settings/index.inc.html' />"
    },
    {
        "cache": "false",
        "page":  "quiz",
        "label": "Quiz",
        "url":   "<wc-include href='quiz/index.inc.html' />"
    },
    {
        "cache": "true",
        "page":  "login",
        "label": "Login",
        "url":   "<wc-include href='login/index.inc.html' />"
    },
    {
        "cache": "true",
        "page":  "alerts",
        "label": "Alerts",
        "url":   "<wc-include href='alerts/index.inc.html' />"
    },
];
