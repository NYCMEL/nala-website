/* mtk-footer.js */

(function () {

    function initFooter() {
        const host = document.getElementById("mtk-footer");
        if (!host) return false;
        if (!window.app || !app.footer) return false;

        const data = app.footer;

        host.innerHTML = "";

        const container = document.createElement("div");
        container.className = "container";

        /* TOP ROW */
        const top = document.createElement("div");
        top.className = "row mtk-footer-top";

        // Brand column
        const brandCol = document.createElement("div");
        brandCol.className = "col-12 col-md";

        const brandWrap = document.createElement("div");
        brandWrap.className = "mtk-footer-brand";

        if (data.brand.logo) {
            const img = document.createElement("img");
            img.src = data.brand.logo;
            img.alt = "Brand logo";
            brandWrap.appendChild(img);
        }

        if (data.brand.description) {
            const desc = document.createElement("p");
            desc.textContent = data.brand.description;
            brandWrap.appendChild(desc);
        }

        brandCol.appendChild(brandWrap);
        top.appendChild(brandCol);

        // Navigation groups
        (data.groups || []).forEach(group => {
            const col = document.createElement("div");
            col.className = "col-6 col-md";

            const title = document.createElement("div");
            title.className = "mtk-footer-group-title";
            title.textContent = group.title;

            const ul = document.createElement("ul");

            (group.links || []).forEach(link => {
                const li = document.createElement("li");
                const btn = document.createElement("button");
                btn.textContent = link.label;

                btn.addEventListener("click", () => {
                    wc.publish("mtk-footer:navigate", link);
                });

                li.appendChild(btn);
                ul.appendChild(li);
            });

            col.appendChild(title);
            col.appendChild(ul);
            top.appendChild(col);
        });

        container.appendChild(top);

        /* BOTTOM ROW */
        const bottom = document.createElement("div");
        bottom.className = "row mtk-footer-bottom align-items-center";

        const left = document.createElement("div");
        left.className = "col-12 col-md-6";
        left.textContent = data.bottom.left || "";

        const right = document.createElement("div");
        right.className = "col-12 col-md-6 text-md-end";
        right.textContent = data.bottom.right || "";

        bottom.appendChild(left);
        bottom.appendChild(right);

        container.appendChild(bottom);
        host.appendChild(container);

        return true;
    }

    const wait = setInterval(() => {
        if (initFooter()) {
            clearInterval(wait);
        }
    }, 50);

})();
