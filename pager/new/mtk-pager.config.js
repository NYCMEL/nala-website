var app = app || {};

app.pager = {
    // Section ID to URL mapping
    // Format: 'sectionId': 'path/to/content.html'
    
    'home': 'pages/home.html',
    'about': 'pager/tmp/page-about.html',
    'contact': 'pager/tmp/page-contact.html',
    'dashboard': 'pager/tmp/page-dashboard.html',
    'profile': 'pager/tmp/page-profile.html',
    'settings': 'pager/tmp/page-settings.html'
};

// OPTIONAL: DEFAULT SECTION TO LOAD ON INITIALIZATION
app.pagerDefaults = {
    initialSection: 'home',  // FIRST PAGE TO SHOW
    loadOnInit: true,        // ALWAYS LOAD THE FIRST PAGE ON INIT
    animationDuration: 300,
    debugMode: false
};
