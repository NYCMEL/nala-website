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
    // 1. Rebuild data from new language
    window.app.tiles = buildTiles();

    // 2. Re-render each tile in the DOM
    window.app.tiles.forEach(function(tile) {
        var mountId = 'MTK-' + tile.id;
        var mount = document.getElementById(mountId);
        if (!mount) return;

        // Clear existing tile
        mount.innerHTML = '';

        // Re-create tile element matching tile.js structure
        var tileEl = document.createElement('div');
        tileEl.className = 'mtk-tile';

        var inner = document.createElement('div');
        inner.className = 'mtk-tile-inner';

        var front = document.createElement('div');
        front.className = 'mtk-tile-face mtk-tile-front';
        front.style.backgroundColor = tile.front.bgColor;
        front.innerHTML = '<div class="mtk-tile-title">' + tile.front.title + '</div>'
                        + '<div class="mtk-tile-body">'  + tile.front.body  + '</div>';
        inner.appendChild(front);

        if (tile.flip && tile.back) {
            var back = document.createElement('div');
            back.className = 'mtk-tile-face mtk-tile-back';
            back.style.backgroundColor = tile.back.bgColor;
            back.innerHTML = '<div class="mtk-tile-title">' + tile.back.title + '</div>'
                           + '<div class="mtk-tile-body">'  + tile.back.body  + '</div>';
            inner.appendChild(back);

            tileEl.addEventListener('mouseenter', function() { tileEl.classList.add('is-flipped'); });
            tileEl.addEventListener('mouseleave', function() { tileEl.classList.remove('is-flipped'); });
            tileEl.addEventListener('click',      function() { tileEl.classList.toggle('is-flipped'); });
        }

        tileEl.appendChild(inner);
        mount.appendChild(tileEl);
    });
});
