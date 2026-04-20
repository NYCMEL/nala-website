(function () {

    if (!window.app || !Array.isArray(window.app.tiles)) return;

    function renderTile(tile) {
        const mountId = "MTK-" + tile.id;
        const mount = document.getElementById(mountId);

        if (!mount) return false;

        const tileEl = document.createElement("div");
        tileEl.className = "mtk-tile";

        const inner = document.createElement("div");
        inner.className = "mtk-tile-inner";

        const front = document.createElement("div");
        front.className = "mtk-tile-face mtk-tile-front";
        front.style.backgroundColor = tile.front.bgColor;
        front.innerHTML = `
            <div class="mtk-tile-title">${tile.front.title}</div>
            <div class="mtk-tile-body">${tile.front.body}</div>
        `;

        inner.appendChild(front);

        if (tile.flip && tile.back) {
            const back = document.createElement("div");
            back.className = "mtk-tile-face mtk-tile-back";
            back.style.backgroundColor = tile.back.bgColor;
            back.innerHTML = `
                <div class="mtk-tile-title">${tile.back.title}</div>
                <div class="mtk-tile-body">${tile.back.body}</div>
            `;
            inner.appendChild(back);

            tileEl.addEventListener("mouseenter", () => {
                tileEl.classList.add("is-flipped");
            });

            tileEl.addEventListener("mouseleave", () => {
                tileEl.classList.remove("is-flipped");
            });

            tileEl.addEventListener("click", () => {
                tileEl.classList.toggle("is-flipped");
            });
        }

        tileEl.appendChild(inner);
        mount.appendChild(tileEl);

        return true;
    }

    // Wait for each MTK-{id} independently
    window.app.tiles.forEach(tile => {
        const waitForMount = setInterval(() => {
            if (renderTile(tile)) {
                clearInterval(waitForMount);
            }
        }, 50);
    });

})();
