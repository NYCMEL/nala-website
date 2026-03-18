window.app = window.app || {};

window.app.stats = [
    { "id": "students",   "value": 20, "suffix": "K+", "label": "stats.students" },
    { "id": "placement",  "value": 95, "suffix": "%",  "label": "stats.placement" },
    { "id": "experience", "value": 10, "suffix": "+",  "label": "stats.experience" }
];

// Resolve labels immediately if i18n is already loaded
(function resolveStats() {
    if (!window.i18n) return;
    window.app.stats.forEach(function(s) { s.label = i18n.t(s.label); });
})();

// Re-resolve when language changes
document.addEventListener('i18n:changed', function() {
    var map = { students: 'stats.students', placement: 'stats.placement', experience: 'stats.experience' };
    (window.app.stats || []).forEach(function(s) {
        if (map[s.id]) s.label = i18n.t(map[s.id]);
    });
});
