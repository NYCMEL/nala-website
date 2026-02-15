var app = app || {};

app.pager = {
    // Section ID to URL mapping
    'home':	 'pages/index.inc.html',
    'register':  'register/index.inc.html',
    'login':	 'login/index.inc.html',
    'dashboard': 'dashboard/index.inc.html',
    'course':    'hierarchy/index.inc.html',
    'settings':  'settings/index.inc.html',
};

// OPTIONAL: DEFAULT SECTION TO LOAD ON INITIALIZATION
app.pagerDefaults = {
    initialSection: 'home',  // FIRST PAGE TO SHOW
    loadOnInit: true,        // ALWAYS LOAD THE FIRST PAGE ON INIT
    animationDuration: 10,
    debugMode: false
};
