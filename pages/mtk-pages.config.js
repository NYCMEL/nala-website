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
        "label": "Welcome",
        "url":   "<wc-include href='/Melify/mtk/dev/tk/lib/components/w/html/parts/pager/home.html'></wc-include>"
    },
    {
        "cache": "true",
        "page":  "products",
        "label": "Our Products",
        "url":   "<wc-include href='/Melify/mtk/dev/tk/lib/components/w/html/parts/pager/products.html'></wc-include>"
    },
    {
        "cache": "false",
        "page":  "contact",
        "label": "Contact us",
        "url":   "<wc-include href='/Melify/mtk/dev/tk/lib/components/w/html/parts/pager/contact.html'></wc-include>"
    },
    {
        "cache": "true",
        "page":  "login",
        "label": "Sign-In",
        "url":   "<wc-include href='/Melify/mtk/dev/tk/lib/components/w/html/parts/pager/login.html'></wc-include>"
    },
    {
        "cache": "true",
        "page":  "cart",
        "label": "Shopping Cart",
        "url":   "<wc-include href='/Melify/mtk/dev/tk/lib/components/w/html/parts/pager/cart.html'></wc-include>"
    }
];

// DEFAULT PAGE TO SHOW ON LOAD
window.app.pagesDefaults = {
    initialPage:       "home",
    loadOnInit:        true,
    animationDuration: 10,
    debugMode:         false
};
