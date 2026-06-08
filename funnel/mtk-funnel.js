(function () {
    function getValue(form, name) {
        var checked = form.querySelector('input[name="' + name + '"]:checked');
        return checked ? checked.value : "";
    }

    function recommendation(form) {
        var goal = getValue(form, "goal");
        var pace = getValue(form, "pace");
        if (goal === "business" || pace === "launch") {
            return {
                title: "Premium + Business in a Box",
                body: "Get full training plus the guided setup tools for your website, logo, invoices, reviews, Google setup, and launch materials.",
                page: "register"
            };
        }
        if (goal === "certify" || pace === "full") {
            return {
                title: "Premium training",
                body: "Move into the full course path for certification, hands-on training, and the locksmith kit included with Premium.",
                page: "register"
            };
        }
        return {
            title: "Free lessons",
            body: "Start with the free course preview, then upgrade when you are ready for certification and tools.",
            page: "register"
        };
    }

    function bind(root) {
        var form = root.querySelector(".mtk-funnel__form");
        var result = root.querySelector("[data-funnel-result]");
        var action = root.querySelector("[data-funnel-action]");
        if (!form || !result || root.dataset.bound === "1") return;
        root.dataset.bound = "1";

        function render() {
            var rec = recommendation(form);
            result.querySelector("h2").textContent = rec.title;
            result.querySelector("p").textContent = rec.body;
            if (action) action.dataset.page = rec.page;
        }

        form.addEventListener("change", render);
        if (action) {
            action.addEventListener("click", function () {
                if (window.wc && wc.pages && typeof wc.pages.show === "function") {
                    wc.pages.show(action.dataset.page || "register");
                    return;
                }
                window.location.hash = action.dataset.page || "register";
            });
        }
        render();
    }

    function boot() {
        document.querySelectorAll(".mtk-funnel").forEach(bind);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
    document.addEventListener("include:loaded", function () { setTimeout(boot, 0); });
})();
