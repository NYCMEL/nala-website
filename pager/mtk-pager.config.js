var app = app || {};

app.pager = {
    // Section ID to URL mapping
    'home':	'pages/index.inc.html',
    'register': 'register/index.html',
    'login':	'login/index.inc.html',
    'dashboard':'private/dashboard/index.html',
    'course':   'private/hierarchy/index.html',
    'settings': 'private/settings/index.html',
};

// OPTIONAL: DEFAULT SECTION TO LOAD ON INITIALIZATION
app.pagerDefaults = {
    initialSection: 'login',  // FIRST PAGE TO SHOW
    loadOnInit: true,        // ALWAYS LOAD THE FIRST PAGE ON INIT
    animationDuration: 10,
    debugMode: false
};
