(function () {
    "use strict";

    function getPagesRef() {
        const pagesRef = window.wc && wc.pages ? wc.pages : document.getElementById("mtk-pages");
        if (pagesRef && typeof pagesRef.show === "function") {
            window.wc.pages = pagesRef;
            return pagesRef;
        }
        return null;
    }

    function syncHeader(loggedIn) {
        if (!window.jQuery) return;

        jQuery(".app-header").hide(function () {
            jQuery(loggedIn ? "#header-private" : "#header-public").show();
        });
    }

    function showRegisterPage() {
        window.__nalaRequestedPublicPage = "register";

        const pagesRef = getPagesRef();
        if (pagesRef) {
            pagesRef.show("register");
        }
    }

    function bootstrapInitialPage() {
        if (!window.wc || typeof wc.getSession !== "function") return;

        wc.getSession(function (loggedIn, session, err) {
            if (err) return;

            const pagesRef = getPagesRef();
            if (!pagesRef) return;

            if (loggedIn) {
                wc.timeout(function () {
                    pagesRef.show("dashboard");
                    syncHeader(true);
                }, 300, 1);
                wc.log("IS LOGGED IN");
                return;
            }

            wc.log("IS NOT LOGGED IN");
            if (window.__nalaRequestedPublicPage === "register") {
                showRegisterPage();
            }
            syncHeader(false);
        });
    }

    window.nalaShowRegister = showRegisterPage;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootstrapInitialPage);
    } else {
        bootstrapInitialPage();
    }
}());
