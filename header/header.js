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
    var pageLinks = [
        "mtk-header-home",
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
