(function () {
    "use strict";

    function initTiles() {
        if (!window.app || !Array.isArray(window.app.tiles)) {
            console.error("_tile config not found in window.app.tiles");
            return;
        }

        window.app.tiles.forEach(buildTile);
    }

    function buildTile(config) {
        if (!config || !config.id) {
            console.warn("Tile config missing id", config);
            return;
        }

        const tile = document.getElementById(config.id);

        if (!tile) {
            console.warn("Tile element not found for id:", config.id);
            return;
        }

        const front = tile.querySelector("._tile-front");
        const back = tile.querySelector("._tile-back");

        if (!front || !back) return;

        // Populate front
        front.querySelector("._tile-title").innerHTML = config.front.title;
        front.querySelector("._tile-body").innerHTML = config.front.body;

	wc.log("FRONT:", front);
	wc.log("BACK:", back);

        if (config.front.bgColor) {
            front.style.backgroundColor = config.front.bgColor;
        }

        if (config.flip && config.back) {
            // POPULATE BACK
            back.querySelector("._tile-title").innerHTML = config.back.title;
            back.querySelector("._tile-body").innerHTML = config.back.body;

            if (config.back.bgColor) {
                back.style.backgroundColor = config.back.bgColor;
            }

            // FLIP BEHAVIOR
            front.addEventListener("mouseenter", () => tile.classList.add("is-flipped"));
            front.addEventListener("click", () => tile.classList.add("is-flipped"));
            tile.addEventListener("mouseleave", () => tile.classList.remove("is-flipped"));
        } else {
            back.style.display = "none";
        }
    }

    if (document.readyState === "complete") {
        initTiles();
    } else {
        window.addEventListener("load", initTiles);
    }
})();
