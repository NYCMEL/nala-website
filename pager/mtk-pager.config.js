var app = app || {};

app.pager = {
    // Section ID to URL mapping
    'home':	'pages/index.inc.html',
    'register': 'register/index.inc.html',
    'login':	'login/index.inc.html',
    'dashboard':'private/dashboard/index.inc.html',
    'course':   'private/hierarchy/index.inc.html',
    'settings': 'private/settings/index.inc.html',
};

// OPTIONAL: DEFAULT SECTION TO LOAD ON INITIALIZATION
app.pagerDefaults = {
    initialSection: 'login',  // FIRST PAGE TO SHOW
    loadOnInit: true,        // ALWAYS LOAD THE FIRST PAGE ON INIT
    animationDuration: 10,
    debugMode: false
};
