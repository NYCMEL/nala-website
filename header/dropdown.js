(function () {

    const DROPDOWN_CLASS = "js-standalone-dropdown";
    const OPEN_CLASS = "open";
    const CLOSE_DELAY = 200;

    injectStyles();

    window.createDropdown = function (labelEl, items) {
        if (!labelEl || !Array.isArray(items) || items.length !== 2) {
            throw new Error("createDropdown requires a label element and exactly 2 items");
        }

        labelEl.style.cursor = "pointer";

        const dropdown = document.createElement("div");
        dropdown.className = DROPDOWN_CLASS;

        items.forEach(item => {
            const link = document.createElement("a");
            link.href = "javascript:void(0)";
            link.textContent = item.label;
            link.dataset.id = item.id;

            link.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeAll();

                labelEl.dispatchEvent(
                    new CustomEvent("dropdown:select", {
                        detail: item
                    })
                );
            });

            dropdown.appendChild(link);
        });

        document.body.appendChild(dropdown);

        let closeTimer = null;
        let hovering = false;

        function open() {
            clearTimeout(closeTimer);
            hovering = true;

            closeAll();

            const rect = labelEl.getBoundingClientRect();
            dropdown.style.top = rect.bottom + window.scrollY + "px";
            dropdown.style.left = rect.left + window.scrollX + "px";
            dropdown.classList.add(OPEN_CLASS);
        }

        function scheduleClose() {
            hovering = false;
            clearTimeout(closeTimer);

            closeTimer = setTimeout(() => {
                if (!hovering) {
                    dropdown.classList.remove(OPEN_CLASS);
                }
            }, CLOSE_DELAY);
        }

        /* treat label + menu as one hover zone */
        labelEl.addEventListener("mouseenter", open);
        labelEl.addEventListener("mouseleave", scheduleClose);

        dropdown.addEventListener("mouseenter", () => {
            hovering = true;
            clearTimeout(closeTimer);
        });

        dropdown.addEventListener("mouseleave", scheduleClose);
    };

    function closeAll() {
        document
            .querySelectorAll("." + DROPDOWN_CLASS + "." + OPEN_CLASS)
            .forEach(d => d.classList.remove(OPEN_CLASS));
    }

    function injectStyles() {
        if (document.getElementById("standalone-dropdown-styles")) return;

        const style = document.createElement("style");
        style.id = "standalone-dropdown-styles";
        style.textContent = `
            .${DROPDOWN_CLASS} {
                position: absolute;
                min-width: 160px;
                background: #fff;
                border-radius: 4px;
                box-shadow: 0 6px 18px rgba(0,0,0,.15);
                padding: 6px 0;
                display: none;
                z-index: 9999;
                font-family: system-ui, sans-serif;
            }

            .${DROPDOWN_CLASS}.${OPEN_CLASS} {
                display: block;
            }

            .${DROPDOWN_CLASS} a {
                display: block;
                padding: 8px 14px;
                color: #222;
                text-decoration: none;
                font-size: 14px;
                cursor: pointer;
                white-space: nowrap;
            }

            .${DROPDOWN_CLASS} a:hover {
                background: #f1f3f5;
            }
        `;
        document.head.appendChild(style);
    }

})();
