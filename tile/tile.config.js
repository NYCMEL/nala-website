window.app = window.app || {};

function _buildTiles() {
    var t = window.i18n ? window.i18n.t.bind(window.i18n) : function(k){ return k; };
    return [
        {
            id: "tile-1", flip: true,
            front: { title: t('tile.1.front'), body: "", bgColor: "#a98211" },
            back:  { title: t('tile.back.title'), body: "<p>" + t('tile.1.back') + "</p>", bgColor: "#212529" }
        },
        {
            id: "tile-2", flip: true,
            front: { title: t('tile.2.front'), body: "", bgColor: "#7a5e0c" },
            back:  { title: t('tile.back.title'), body: "<p>" + t('tile.2.back') + "</p>", bgColor: "#212529" }
        },
        {
            id: "tile-3", flip: true,
            front: { title: t('tile.3.front'), body: "", bgColor: "#3a2f1b" },
            back:  { title: t('tile.back.title'), body: "<p>" + t('tile.3.back') + "</p>", bgColor: "#212529" }
        }
    ];
}

window.app.tiles = _buildTiles();

// Rebuild on language change
document.addEventListener('i18n:changed', function () {
    window.app.tiles = _buildTiles();
    document.dispatchEvent(new CustomEvent('tiles:rebuild'));
});
