// mtk-pager.config.js
// Configuration for mtk-pager component
// Defines content URLs for each section

var app = app || {};

app.pager = {
    // Section ID to URL mapping
    // Format: 'sectionId': 'path/to/content.html'
    
    'home': 'pages/home.html',
    'about': 'pages/about.html',
    'contact': 'pages/contact.html',
    'dashboard': 'pages/dashboard.html',
    'profile': 'pages/profile.html',
    'settings': 'pages/settings.html',
    
    // You can add more sections as needed
    // 'custom-section': 'pages/custom.html'
};

// Optional: Default section to load on initialization
app.pagerDefaults = {
    initialSection: 'home',
    loadOnInit: true,
    animationDuration: 300,
    debugMode: true
};
