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

// PUBLISH ALL CLICKS
$(".nav-link, .navbar-brand, .btn").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    let eid = this.id;

    headerSelect(eid);

    let msg = eid; wc.log(msg);
    wc.publish(msg);
});

function headerSelect(id) {
    $(".nav-link, .navbar-brand, .btn").removeClass("active");

    // FOLD HAMBURGER MENU
    $(".navbar-collapse.show").removeClass("show");

    $("#" + id).addClass("active");
    applyHeaderVisualState(id);
}

document.addEventListener("DOMContentLoaded", initHeaderVisualState);
initHeaderVisualState();
setTimeout(initHeaderVisualState, 0);
setTimeout(initHeaderVisualState, 120);

// toggleNavbar()
// Safe to call at any time — waits for Bootstrap to be ready before toggling
function toggleNavbar() {
    var collapseEl = document.getElementById("navbarSupportedContent");
    if (!collapseEl) return;

    function doToggle() {
        var bsCollapse = window.bootstrap.Collapse.getInstance(collapseEl);
        if (!bsCollapse) {
            bsCollapse = new window.bootstrap.Collapse(collapseEl, { toggle: false });
        }
        collapseEl.classList.contains("show") ? bsCollapse.hide() : bsCollapse.show();
    }

    if (window.bootstrap) {
        doToggle();
    } else {
        // Poll until Bootstrap is available (max 3s)
        var attempts = 0;
        var interval = setInterval(function () {
            if (window.bootstrap) {
                clearInterval(interval);
                doToggle();
            } else if (++attempts >= 30) {
                clearInterval(interval);
                console.warn("toggleNavbar: bootstrap never loaded");
            }
        }, 100);
    }
}
