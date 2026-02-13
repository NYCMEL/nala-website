var app = app || {};

app.pager = {
    // Section ID to URL mapping
    'home':	'pages/home.html',
    'register': 'register/index.html',
    'login':	'login/index.html',
};

// OPTIONAL: DEFAULT SECTION TO LOAD ON INITIALIZATION
app.pagerDefaults = {
    initialSection: 'home',  // FIRST PAGE TO SHOW
    loadOnInit: true,        // ALWAYS LOAD THE FIRST PAGE ON INIT
    animationDuration: 10,
    debugMode: false
};
