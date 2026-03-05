// mtk-pages.config.js
// Configuration for mtk-pages component
// Data source: window.app.pages

window.app = window.app || {};

// PAGE DEFINITIONS
// cache: "true"  = load once, reuse on revisit
// cache: "false" = reload every time the page is shown
window.app.pages = [
    {
        "cache": "false",
        "page":  "home",
        "label": "Welcome",
        "url":   "<wc-include href='pages/tmp/home.html'></wc-include>"
    },
    {
        "cache": "false",
        "page":  "products",
        "label": "Our Products",
        "url":   "<wc-include href='pages/tmp/products.html'></wc-include>"
    }
];
