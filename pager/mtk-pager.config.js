var app = app || {};

app.pager = [
    {
        "cache": "true",
        "page": "home",
        "label": "Home",
        "url": "home/index.inc.html"
    },
    {
        "cache": "true",
        "page": "register",
        "label": "Register",
        "url": "register/index.inc.html"
    },
    {
        "cache": "true",
        "page": "login",
        "label": "Login",
        "url": "login/index.inc.html"
    },
    {
        "cache": "false",
        "page": "dashboard",
        "label": "Dashboard",
        "url": "dashboard/index.inc.html"
    },
    {
        "cache": "false",
        "page": "course",
        "label": "Course",
        "url": "hierarchy/index.inc.html"
    },
    {
        "cache": "true",
        "page": "settings",
        "label": "Settings",
        "url": "settings/index.inc.html"
    },
    {
        "cache": "false",
        "page": "quiz",
        "label": "Quiz",
        "url": "quiz/index.inc.html"
    }
];

// OPTIONAL: DEFAULT SECTION TO LOAD ON INITIALIZATION
app.pagerDefaults = {
    initialSection: 'home',  // FIRST PAGE TO SHOW
    loadOnInit: true,        // ALWAYS LOAD THE FIRST PAGE ON INIT
    animationDuration: 10,
    debugMode: false
};
