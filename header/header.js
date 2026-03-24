function applyHeaderVisualState(activeId) {
    const links = document.querySelectorAll("#header .nav-link");
    links.forEach(link => {
        const isActive = !!activeId && link.id === activeId;
        const color = "#ffffff";
        const shadow = isActive
            ? "0 2px 10px rgba(0, 0, 0, 0.35)"
            : "0 1px 0 rgba(0, 0, 0, 0.35)";

        link.style.setProperty("color", color, "important");
        link.style.setProperty("opacity", "1", "important");
        link.style.setProperty("text-shadow", shadow, "important");
        link.style.setProperty("-webkit-text-fill-color", color, "important");
        link.style.setProperty("filter", "none", "important");
        link.style.setProperty("background", isActive ? "rgba(184, 149, 59, 0.22)" : "transparent", "important");
        link.style.setProperty("border-radius", "999px", "important");
        link.style.setProperty("padding", isActive ? "8px 12px" : "", "important");

        link.querySelectorAll("*").forEach(node => {
            node.style.setProperty("color", color, "important");
            node.style.setProperty("fill", color, "important");
            node.style.setProperty("stroke", color, "important");
            node.style.setProperty("opacity", "1", "important");
            node.style.setProperty("text-shadow", shadow, "important");
            node.style.setProperty("-webkit-text-fill-color", color, "important");
            node.style.setProperty("filter", "none", "important");
        });
    });
}

function initHeaderVisualState() {
    const activeLink = document.querySelector("#header .nav-link.active");
    applyHeaderVisualState(activeLink ? activeLink.id : "");
}

function closeHeaderMenu() {
    const collapseEl = document.getElementById("navbarSupportedContent");
    if (!collapseEl) return;

    collapseEl.classList.remove("show");

    if (window.bootstrap && window.bootstrap.Collapse) {
        const instance = window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
        instance.hide();
    }
}

function headerSelect(id) {
    document.querySelectorAll("#header .nav-link, #header .navbar-brand").forEach(el => {
        el.classList.remove("active");
    });

    closeHeaderMenu();

    const activeEl = document.getElementById(id);
    if (activeEl) activeEl.classList.add("active");
    applyHeaderVisualState(id);
}

function bindHeaderEvents(root = document) {
    root.querySelectorAll("#header .nav-link, #header .navbar-brand").forEach(el => {
        if (el.dataset.headerBound === "1") return;
        el.dataset.headerBound = "1";

        el.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();

            const eid = this.id;
            if (!eid) return;

            headerSelect(eid);
            wc.log(eid);
            wc.publish(eid);
        });
    });

    root.querySelectorAll("#header .navbar-toggler").forEach(btn => {
        if (btn.dataset.headerBound === "1") return;
        btn.dataset.headerBound = "1";

        btn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleNavbar();
        });
    });
}

function toggleNavbar() {
    const collapseEl = document.getElementById("navbarSupportedContent");
    if (!collapseEl) return;

    function doToggle() {
        const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
        if (collapseEl.classList.contains("show")) bsCollapse.hide();
        else bsCollapse.show();
    }

    if (window.bootstrap && window.bootstrap.Collapse) {
        doToggle();
        return;
    }

    let attempts = 0;
    const interval = setInterval(function () {
        if (window.bootstrap && window.bootstrap.Collapse) {
            clearInterval(interval);
            doToggle();
        } else if (++attempts >= 30) {
            clearInterval(interval);
            console.warn("toggleNavbar: bootstrap never loaded");
        }
    }, 100);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
        bindHeaderEvents(document);
        initHeaderVisualState();
    });
} else {
    bindHeaderEvents(document);
    initHeaderVisualState();
}

setTimeout(function() {
    bindHeaderEvents(document);
    initHeaderVisualState();
}, 0);
setTimeout(function() {
    bindHeaderEvents(document);
    initHeaderVisualState();
}, 150);