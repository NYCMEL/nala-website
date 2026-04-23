// PUBLISH ALL CLICKS
// Use delegated handler so exclusions work even after wc-include injects the HTML
$(document).on("click", ".nav-link, .navbar-brand, .btn", function(e) {
    // Skip dropdown toggle — let Bootstrap handle it
    if (this.id === "mtk-header-settings" || $(this).hasClass("nala-user-menu") || $(this).hasClass("dropdown-item")) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    let eid = this.id;

    headerSelect(eid);

    let msg = eid; wc.log(msg);
    wc.publish(msg);
});

// Manual user dropdown toggle (avoids Popper dependency)
$(document).on("click", "#mtk-header-settings, .nala-user-menu", function(e) {
    e.preventDefault();
    e.stopPropagation();
    var dd = $("#nala-user-dd");
    dd.toggle();
});

// Close dropdown when clicking outside
$(document).on("click", function(e) {
    if (!$(e.target).closest("#mtk-header-settings, #nala-user-dd, .nala-user-menu").length) {
        $("#nala-user-dd").hide();
    }
});

// Dropdown item actions — always close dropdown after selection
$(document).on("click", "#header-dd-profile", function(e) {
    e.preventDefault();
    $("#nala-user-dd").hide();
    wc.log("mtk-header-settings");
    wc.publish("mtk-header-settings");
});

$(document).on("click", "#header-dd-client", function(e) {
    e.preventDefault();
    $("#nala-user-dd").hide();
    var user = (window.wc && wc.session && wc.session.user) ? wc.session.user : {};
    if (Number(user.has_business_in_a_box || 0) !== 1) {
        var message = (window.i18n && typeof window.i18n.t === "function")
            ? window.i18n.t("nav.businessAccessOnly")
            : "Business in a Box is only available for users with Business access.";
        if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
            MTKMsgs.show({
                type: "warning",
                icon: "warning",
                message: message,
                closable: true,
                timer: 8
            });
        }
        return;
    }
    wc.log("mtk-header-client → /repo_deploy/biab");
    window.location.replace("/repo_deploy/biab");
});

$(document).on("click", "#header-dd-logout", function(e) {
    e.preventDefault();
    $("#nala-user-dd").hide();
    wc.log("mtk-header-logout");
    wc.publish("mtk-header-logout");
});

// MAP PAGE NAME → HEADER LINK ID
var pageToHeaderId = {
    "home":      "mtk-header-home",
    "news":      "mtk-header-news",
    "register":  "mtk-header-register",
    "login":     "mtk-header-login",
    "dashboard": "mtk-header-dashboard",
    "hierarchy": "mtk-header-hierarchy",
    "settings":  "mtk-header-settings"
};

// RESTORE ACTIVE HEADER LINK whenever a page is shown (including reload)
PubSub.subscribe("mtk-pages", function (msg, data) {
    if (data && data.action === "show" && data.page) {
        var headerId = pageToHeaderId[data.page];
        if (headerId) headerSelect(headerId);
    }
});


function headerSelect(id) {
    var pageLinks = [
        "mtk-header-home",
        "mtk-header-news",
        "mtk-header-register",
        "mtk-header-login",
        "mtk-header-dashboard",
        "mtk-header-hierarchy",
        "mtk-header-settings"
    ];

    $(".nav-link, .navbar-brand, .btn").removeClass("active");
    
    // FOLD HAMBURGER MENU
    $(".navbar-collapse.show").removeClass("show");

    if (pageLinks.indexOf(id) !== -1) {
        $("#" + id).addClass("active");
    }
}

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

(function initLangToggle() {
    function setActive(lang) {
        document.querySelectorAll('.nala-lang-toggle').forEach(function (btn) {
            var enOpt = btn.querySelector('[data-lang="en"]');
            var esOpt = btn.querySelector('[data-lang="es"]');
            var slider = btn.querySelector('.nala-lang-slider');

            if (lang === 'es') {
                btn.classList.add('nala-lang-es');
                if (enOpt) enOpt.classList.remove('nala-lang-active');
                if (esOpt) esOpt.classList.add('nala-lang-active');
                if (slider) slider.style.transform = 'translateX(100%)';
            } else {
                btn.classList.remove('nala-lang-es');
                if (enOpt) enOpt.classList.add('nala-lang-active');
                if (esOpt) esOpt.classList.remove('nala-lang-active');
                if (slider) slider.style.transform = 'translateX(0)';
            }
        });
    }

    function bindToggles() {
        document.querySelectorAll('.nala-lang-toggle').forEach(function (btn) {
            if (btn.dataset.langBound === '1') return;
            btn.dataset.langBound = '1';

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var current = window.i18n ? window.i18n.getLang() : 'en';
                var next = current === 'en' ? 'es' : 'en';
                if (window.i18n) window.i18n.setLang(next);
                setActive(next);
            });
        });
    }

    function initState() {
        var lang = window.i18n ? window.i18n.getLang() : 'en';
        setActive(lang);
        bindToggles();
    }

    document.addEventListener('include:loaded', function () {
        setTimeout(initState, 50);
    });

    document.addEventListener('i18n:changed', function (e) {
        setActive(e.detail && e.detail.lang ? e.detail.lang : 'en');
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initState);
    } else {
        initState();
    }
})();

(function initBusinessInABoxAccess() {
    function syncBusinessMenu() {
        var user = (window.wc && wc.session && wc.session.user) ? wc.session.user : {};
        var hasBusiness = Number(user.has_business_in_a_box || 0) === 1;
        var menuItem = document.getElementById("header-dd-client");
        if (!menuItem) return;

        var listItem = menuItem.closest("li");
        if (!listItem) return;

        listItem.style.display = hasBusiness ? "" : "none";
    }

    document.addEventListener("DOMContentLoaded", syncBusinessMenu);
    document.addEventListener("include:loaded", function () {
        setTimeout(syncBusinessMenu, 50);
    });
    setTimeout(syncBusinessMenu, 250);
})();

// RESTORE ACTIVE HEADER LINK ON RELOAD
// Reads history.state.mtkPage (set by mtk-pages) and maps it to a header link id
(function restoreActiveHeaderLink() {
    var pageToHeaderId = {
        'home':      'mtk-header-home',
        'news':      'mtk-header-news',
        'register':  'mtk-header-register',
        'login':     'mtk-header-login',
        'dashboard': 'mtk-header-dashboard',
        'hierarchy': 'mtk-header-hierarchy',
        'settings':  'mtk-header-settings'
    };

    function restore() {
        var page = (history.state && history.state.mtkPage) || 'home';
        var id   = pageToHeaderId[page];
        if (id) headerSelect(id);
    }

    // Run after header is injected via wc-include
    document.addEventListener('include:loaded', function () {
        setTimeout(restore, 50);
    });

    // Also run on popstate (back/forward navigation)
    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.mtkPage) {
            var id = pageToHeaderId[e.state.mtkPage];
            if (id) headerSelect(id);
        }
    });

    // Fallback: run after short delay in case include already fired
    setTimeout(restore, 300);
})();
