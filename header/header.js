function applyHeaderVisualState(activeId) {
    const links = document.querySelectorAll("#header .nav-link");
    links.forEach(link => {
        const isActive = !!activeId && link.id === activeId;
        const color = "#ffffff";
        const shadow = isActive
            ? "0 2px 10px rgba(0, 0, 0, 0.35)"
            : "0 1px 0 rgba(0, 0, 0, 0.35)";
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

// ── Language Toggle ────────────────────────────────────────────
(function initLangToggle() {

    function setActive(lang) {
        document.querySelectorAll('.nala-lang-toggle').forEach(function (btn) {
            var enOpt = btn.querySelector('[data-lang="en"]');
            var esOpt = btn.querySelector('[data-lang="es"]');
            var slider = btn.querySelector('.nala-lang-slider');

            if (lang === 'es') {
                btn.classList.add('nala-lang-es');
                if (enOpt)  enOpt.classList.remove('nala-lang-active');
                if (esOpt)  esOpt.classList.add('nala-lang-active');
                if (slider) slider.style.transform = 'translateX(100%)';
            } else {
                btn.classList.remove('nala-lang-es');
                if (enOpt)  enOpt.classList.add('nala-lang-active');
                if (esOpt)  esOpt.classList.remove('nala-lang-active');
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
                var current = (window.i18n ? window.i18n.getLang() : 'en');
                var next    = current === 'en' ? 'es' : 'en';
                if (window.i18n) window.i18n.setLang(next);
                setActive(next);
            });
        });
    }

    // Set initial state from current language
    function initState() {
        var lang = window.i18n ? window.i18n.getLang() : 'en';
        setActive(lang);
        bindToggles();
    }

    // Re-bind whenever new header fragments are injected
    document.addEventListener('include:loaded', function () {
        setTimeout(function () { initState(); }, 50);
    });

    // Also init immediately if DOM already has the buttons
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initState);
    } else {
        initState();
    }

    // Keep toggle in sync if language is changed externally (e.g. from URL ?lang=es)
    document.addEventListener('i18n:changed', function (e) {
        setActive(e.detail && e.detail.lang ? e.detail.lang : 'en');
    });

})();
