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

// Re-resolve labels and re-render DOM when language changes
document.addEventListener('i18n:changed', function() {
    var map = { students: 'stats.students', placement: 'stats.placement', experience: 'stats.experience' };
    (window.app.stats || []).forEach(function(s) {
        if (map[s.id]) s.label = i18n.t(map[s.id]);
    });

    // Update the label text in-place (stats.js writes to ._stats-label)
    (window.app.stats || []).forEach(function(s) {
        // stats.js renders the column inside #_stats-row; each stat gets
        // a col with a ._stats-label div
        var row = document.getElementById('_stats-row');
        if (!row) return;
        // Find the column whose value element has data-target matching the stat value
        row.querySelectorAll('._stats-label').forEach(function(labelEl, idx) {
            if (window.app.stats[idx]) {
                labelEl.textContent = window.app.stats[idx].label;
            }
        });
    });
});
