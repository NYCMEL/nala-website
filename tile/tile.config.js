window.app = window.app || {};

function _buildTiles() {
    var t = window.i18n ? window.i18n.t.bind(window.i18n) : function(k){ return k; };
    return [
        {
            id: "tile-1", flip: true,
            front: { title: t('tile.1.front'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + t('tile.1.back') + "</p>", bgColor: "#0984e3" }
        },
        {
            id: "tile-2", flip: true,
            front: { title: t('tile.2.front'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + t('tile.2.back') + "</p>", bgColor: "#0984e3" }
        },
        {
            id: "tile-3", flip: true,
            front: { title: t('tile.3.front'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + t('tile.3.back') + "</p>", bgColor: "#0984e3" }
        },
        {
            id: "tile-4", flip: true,
            front: { title: t('tile.4.front'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + t('tile.4.back') + "</p>", bgColor: "#0984e3" }
        },
        {
            id: "tile-5", flip: true,
            front: { title: t('tile.5.front'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + t('tile.5.back') + "</p>", bgColor: "#0984e3" }
        },
        {
            id: "tile-6", flip: true,
            front: { title: t('tile.6.front'), body: "", bgColor: "#74b9ff" },
            back:  { title: "...", body: "<p>" + t('tile.6.back') + "</p>", bgColor: "#0984e3" }
        }
    ];
}

window.app.tiles = _buildTiles();

// Rebuild on language change
document.addEventListener('i18n:changed', function () {
    window.app.tiles = _buildTiles();
    document.dispatchEvent(new CustomEvent('tiles:rebuild'));
});
