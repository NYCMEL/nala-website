(function () {
    "use strict";

    window.__nalaSessionBootComplete = false;

    const PRIVATE_PAGES = ["dashboard", "final", "hierarchy", "settings", "biab", "quiz", "alerts"];

    function getPagesRef() {
        const pagesRef = window.wc && wc.pages ? wc.pages : document.getElementById("mtk-pages");
        if (pagesRef && typeof pagesRef.show === "function") {
            window.wc.pages = pagesRef;
            return pagesRef;
        }
        return null;
    }

    function withPagesRef(callback, attempts) {
        const pagesRef = getPagesRef();
        if (pagesRef) {
            callback(pagesRef);
            return;
        }

        if ((attempts || 0) >= 40) return;

        window.setTimeout(function () {
            withPagesRef(callback, (attempts || 0) + 1);
        }, 100);
    }

    function syncHeader(loggedIn) {
        if (!window.jQuery) return;

        jQuery(".app-header").hide(function () {
            jQuery(loggedIn ? "#header-private" : "#header-public").show();
        });
    }

    function showRegisterPage() {
        window.__nalaRequestedPublicPage = "register";

        withPagesRef(function (pagesRef) {
            pagesRef.show("register", { replaceHistory: true });
        });
    }

    function getRequestedPage() {
        const params = new URLSearchParams(window.location.search);
        const queryPage = params.get("page") || "";
        const hashPage = (window.location.hash || "").replace(/^#\/?/, "");
        return queryPage || hashPage || "";
    }

    function maybeScrollToBuySection() {
        const params = new URLSearchParams(window.location.search);
        const storedTarget = window.sessionStorage ? window.sessionStorage.getItem("nalaScrollTarget") : "";
        if (params.get("scroll") !== "buy" && storedTarget !== "buy") return;
        if (window.sessionStorage) window.sessionStorage.removeItem("nalaScrollTarget");

        let attempts = 0;
        const scrollWhenReady = function () {
            const buySection = document.getElementById("MTK-path");
            if (buySection && typeof buySection.scrollIntoView === "function") {
                buySection.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }
            attempts += 1;
            if (attempts < 20) window.setTimeout(scrollWhenReady, 300);
        };
        window.setTimeout(scrollWhenReady, 300);
    }

    function bootstrapInitialPage() {
        const shell = document.querySelector("mtk-pages");
        if (shell) shell.style.visibility = "hidden";

        if (!window.wc || typeof wc.getSession !== "function") {
            window.__nalaSessionBootComplete = true;
            if (shell) shell.style.visibility = "visible";
            return;
        }

        wc.getSession(function (loggedIn, session, err) {
            if (err) {
                window.__nalaSessionBootComplete = true;
                if (shell) shell.style.visibility = "visible";
                return;
            }

            withPagesRef(function (pagesRef) {
                const requestedPage = getRequestedPage();
                const reveal = function () {
                    window.__nalaSessionBootComplete = true;
                    pagesRef.style.visibility = "visible";
                };

                if (loggedIn) {
                    const targetPage = PRIVATE_PAGES.includes(requestedPage) ? requestedPage : "dashboard";

                    wc.timeout(function () {
                        pagesRef.show(targetPage, { replaceHistory: true });
                        syncHeader(true);
                        maybeScrollToBuySection();
                        reveal();
                    }, 100, 1);
                    wc.log("IS LOGGED IN");
                    return;
                }

                wc.log("IS NOT LOGGED IN");
                if (window.__nalaRequestedPublicPage === "register") {
                    showRegisterPage();
                } else if (PRIVATE_PAGES.includes(requestedPage)) {
                    pagesRef.show("login", { replaceHistory: true });
                }
                syncHeader(false);
                maybeScrollToBuySection();
                reveal();
            });
        });
    }

    window.nalaShowRegister = showRegisterPage;

    const initialShell = document.querySelector("mtk-pages");
    if (initialShell) initialShell.style.visibility = "hidden";

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootstrapInitialPage);
    } else {
        bootstrapInitialPage();
    }
}());
