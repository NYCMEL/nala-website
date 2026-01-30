window.headerInited = false;

window.Header = {
    init(root, config, id) {
        if (!root || !config) {
	    wc.error(">>>>>>>>Header:init", id, config);
	    return;
	}

	headerInited = true;

        const headerEl = root.querySelector(`#${id}`);
        if (!headerEl) return;

        const logoLinkEl = headerEl.querySelector("#_header-logo-1");
        const menuEl = headerEl.querySelector("#_header-menu-1");
        const buttonsEl = headerEl.querySelector("#_header-buttons-1");

        // --- Fixed header ---
        if (config.fixed) {
            headerEl.classList.add("position-fixed", "top-0", "w-100", "bg-white", "shadow");
        }

        // --- Logo ---
        if (logoLinkEl) {
            logoLinkEl.href = config.logo?.url || "#";
            logoLinkEl.innerHTML = "";

            let imgSrc = config.logo?.img || "https://via.placeholder.com/150x40?text=Logo";
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = config.logo?.text || "Logo";
            img.style.height = "40px";
            img.style.objectFit = "contain";
            img.style.display = "inline-block";
            logoLinkEl.appendChild(img);

            // Fallback text if image fails
            img.onerror = function () {
                logoLinkEl.innerHTML = config.logo?.text || "Logo";
            };
        }

        // --- Menu items ---
        if (menuEl && Array.isArray(config.menu)) {
            menuEl.innerHTML = "";
            config.menu.forEach(item => {
                const li = document.createElement("li");
                li.className = "nav-item";

                const a = document.createElement("a");
                a.id = `_header-menu-${item.id}`;
                a.className = `nav-link${item.active ? " active" : ""}`;
                a.href = item.href;
                a.textContent = item.label;

                // PubSub on menu click
                a.addEventListener("click", (e) => {
                    e.preventDefault();

                    // --- Switch active menu ---
                    menuEl.querySelectorAll(".nav-link").forEach(link => {
                        link.classList.remove("active");
                    });
                    a.classList.add("active");

                    // --- Publish PubSub message ---
                    const message = "header.menu.click";
                    const data = {cname:"header",  cid:"_header-1", id: item.id, label: item.label, href: item.href };
                    wc.log("header > PubSub publish:", message, data);
                    PubSub.publish(message, data);
                });

                li.appendChild(a);
                menuEl.appendChild(li);
            });
        }

        // --- Buttons ---
        if (buttonsEl && Array.isArray(config.buttons)) {
            buttonsEl.innerHTML = "";
            config.buttons.forEach(btn => {
                const button = document.createElement("button");
                button.id = `_header-btn-${btn.id}`;
                button.type = "button";
                button.className = btn.type === "primary" ? "btn btn-primary" : "btn btn-outline-primary";
                button.textContent = btn.label;
                button.dataset.action = btn.action;

                // PubSub on button click
                button.addEventListener("click", (e) => {
                    const message = "header.button.click";
                    const data = {cname:"header", id: btn.id, label: btn.label, action: btn.action };
                    wc.log("header > PubSub publish:", message, data);
                    PubSub.publish(message, data);
                });

                buttonsEl.appendChild(button);
            });
        }
    }
};
