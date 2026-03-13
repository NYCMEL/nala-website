function applyHeaderVisualState(activeId) {
    const links = document.querySelectorAll("#header .nav-link");
    links.forEach(link => {
        const isActive = !!activeId && link.id === activeId;
        const color = isActive ? "#d8b45a" : "rgba(255, 255, 255, 0.96)";
        const shadow = isActive
            ? "0 2px 10px rgba(179, 138, 46, 0.24)"
            : "0 1px 0 rgba(0, 0, 0, 0.35)";

        link.style.color = color;
        link.style.opacity = "1";
        link.style.textShadow = shadow;
        link.style.webkitTextFillColor = color;

        link.querySelectorAll("*").forEach(node => {
            node.style.color = color;
            node.style.fill = color;
            node.style.opacity = "1";
            node.style.textShadow = shadow;
            node.style.webkitTextFillColor = color;
        });
    });
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

document.addEventListener("DOMContentLoaded", function() {
    const activeLink = document.querySelector("#header .nav-link.active");
    applyHeaderVisualState(activeLink ? activeLink.id : "");
});

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
		alert("AAAAAA");
                clearInterval(interval);
                doToggle();
            } else if (++attempts >= 30) {
                clearInterval(interval);
                console.warn("toggleNavbar: bootstrap never loaded");
            }
        }, 100);
    }
}
