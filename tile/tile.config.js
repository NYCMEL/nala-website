window.app = window.app || {};

function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

function buildTiles() {
    return [
        {
            id: "tile-1", flip: true,
            front: { title: _t('tile.1.front', 'Training<BR>Built for Real Service Calls'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + _t('tile.1.back', 'Lessons are structured around real locksmith tasks such as rekeying, lock installation, hardware replacement, and troubleshooting, helping learners understand how concepts apply in the field.') + "</p>", bgColor: "#0984e3" }
        },
        {
            id: "tile-2", flip: true,
            front: { title: _t('tile.2.front', 'Step-by-Step<BR>Video with Clear Instructions'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + _t('tile.2.back', 'Each topic is broken down into focused lessons with visual demonstrations, allowing students to pause, review, and revisit techniques as often as needed.') + "</p>", bgColor: "#0984e3" }
        },
        {
            id: "tile-3", flip: true,
            front: { title: _t('tile.3.front', 'Residential, Commercial & Automotive Coverage'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + _t('tile.3.back', 'The program spans multiple locksmithing disciplines, giving learners exposure to the most common job types encountered in residential, commercial, and automotive work.') + "</p>", bgColor: "#0984e3" }
        },
        {
            id: "tile-4", flip: true,
            front: { title: _t('tile.4.front', 'Bilingual<BR>Learning Environment'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + _t('tile.4.back', 'All lessons are available in English and Spanish, supporting individuals and teams who prefer or require bilingual instruction.') + "</p>", bgColor: "#0984e3" }
        },
        {
            id: "tile-5", flip: true,
            front: { title: _t('tile.5.front', 'Self-Paced<BR>Structured Curriculum'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + _t('tile.5.back', 'Students progress through a clearly organized curriculum at their own pace, making it possible to balance learning with work or other commitments.') + "</p>", bgColor: "#0984e3" }
        },
        {
            id: "tile-6", flip: true,
            front: { title: _t('tile.6.front', 'Business & Professional Foundations Included'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + _t('tile.6.back', 'In addition to technical skills, the program introduces business concepts such as licensing considerations, pricing, customer relations, and service presentation.') + "</p>", bgColor: "#0984e3" }
        }
    ];
}

window.app.tiles = buildTiles();

// Rebuild on language change so re-renders pick up the new language
document.addEventListener('i18n:changed', function() {
    window.app.tiles = buildTiles();
});
