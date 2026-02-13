// mtk-pager.config.js
// Configuration for mtk-pager component
// Defines content URLs for each section

var app = app || {};

app.pager = {
    // Section ID to URL mapping
    // Format: 'sectionId': 'path/to/content.html'
    
    'home': 'pager/tmp/page-home.html',
    'about': 'pager/tmp/page-about.html',
    'contact': 'pager/tmp/page-contact.html',
    'dashboard': 'pager/tmp/page-dashboard.html',
    'profile': 'pager/tmp/page-profile.html',
    'settings': 'pager/tmp/page-settings.html',
};

// Optional: Default section to load on initialization
app.pagerDefaults = {
    initialSection: 'home',
    loadOnInit: true,
    animationDuration: 300,
    debugMode: true
};
