// mtk-pager.config.js
// Configuration for mtk-pager component
// Defines content URLs for each section

var app = app || {};

app.pager = {
    // Section ID to URL mapping
    // Format: 'sectionId': 'path/to/content.html'
    
    'home': 'pager/tmp/home.html',
    'about': 'pager/tmp/about.html',
    'contact': 'pager/tmp/contact.html',
    'dashboard': 'pager/tmp/dashboard.html',
    'profile': 'pager/tmp/profile.html',
    'settings': 'pager/tmp/settings.html',
};

// Optional: Default section to load on initialization
app.pagerDefaults = {
    initialSection: 'home',
    loadOnInit: true,
    animationDuration: 300,
    debugMode: true
};
