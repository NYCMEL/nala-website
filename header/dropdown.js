(function () {

    const DROPDOWN_CLASS = "js-standalone-dropdown";

    /* inject required CSS once */
    injectStyles();

    /**
     * Public API
     * Usage:
     * createDropdown(labelElement, [
     *   { id: "profile", label: "Profile" },
     *   { id: "logout", label: "Logout" }
     * ])
     */
    window.createDropdown = function (labelEl, items) {
        if (!labelEl || !Array.isArray(items) || items.length !== 2) {
            throw new Error("createDropdown requires a label element and exactly 2 items");
        }

        labelEl.style.cursor = "pointer";
        labelEl.classList.add("js-dropdown-trigger");

        const dropdown = document.createElement("div");
        dropdown.className = DROPDOWN_CLASS;

        items.forEach(item => {
            const link = document.createElement("a");
            link.href = "#";
            link.textContent = item.label;
            link.dataset.id = item.id;

            link.addEventListener("click", e => {
                e.preventDefault();
                closeAll();
                labelEl.dispatchEvent(new CustomEvent("dropdown:select", {
                    detail: {
                        id: item.id,
                        label: item.label
                    }
                }));
            });

            dropdown.appendChild(link);
        });

        document.body.appendChild(dropdown);

        labelEl.addEventListener("click", e => {
            e.stopPropagation();
            toggle(labelEl, dropdown);
        });
    };

    /* positioning + toggle */
    function toggle(trigger, dropdown) {
        const isOpen = dropdown.classList.contains("open");
        closeAll();

        if (!isOpen) {
            const rect = trigger.getBoundingClientRect();
            dropdown.style.top = rect.bottom + window.scrollY + "px";
            dropdown.style.left = rect.left + window.scrollX + "px";
            dropdown.classList.add("open");
        }
    }

    function closeAll() {
        document.querySelectorAll("." + DROPDOWN_CLASS + ".open")
            .forEach(d => d.classList.remove("open"));
    }

    document.addEventListener("click", closeAll);

    /* style injection */
    function injectStyles() {
        if (document.getElementById("standalone-dropdown-styles")) return;

        const style = document.createElement("style");
        style.id = "standalone-dropdown-styles";
        style.textContent = `
            .${DROPDOWN_CLASS} {
                position: absolute;
                min-width: 160px;
                background: #fff;
                border-radius: 6px;
                box-shadow: 0 6px 18px rgba(0,0,0,.15);
                padding: 6px 0;
                display: none;
                z-index: 9999;
                font-family: system-ui, sans-serif;
            }

            .${DROPDOWN_CLASS}.open {
                display: block;
            }

            .${DROPDOWN_CLASS} a {
                display: block;
                padding: 8px 14px;
                color: #222;
                text-decoration: none;
                font-size: 14px;
            }

            .${DROPDOWN_CLASS} a:hover {
                background: #f1f3f5;
            }
        `;
        document.head.appendChild(style);
    }

})();
