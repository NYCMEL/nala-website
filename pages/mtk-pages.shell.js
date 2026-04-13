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

    function showRegisterPage() {
        window.__nalaRequestedPublicPage = "register";
        const pagesRef = getPagesRef();
        if (pagesRef) {
            pagesRef.show("register", { replaceHistory: true });
        }
    }

    function syncHeader(loggedIn) {
        if (!window.jQuery) return;

        jQuery(".app-header").hide(function () {
            jQuery(loggedIn ? "#header-private" : "#header-public").show();
        });
    }

    function bootstrapInitialPage() {
        if (!window.wc || typeof wc.getSession !== "function") return;

        wc.getSession(function (loggedIn, session, err) {
            if (err) return;

            if (wc.working && window.MTKMsgs && typeof MTKMsgs.show === "function") {
                wc.timeout(function () {
                    MTKMsgs.show({
                        type: "success",
                        icon: "check_circle",
                        message: "Loading in progress. Please wait...",
                        buttons: [],
                        closable: false,
                        timer: 3,
                        block: true
                    });
                }, 100, 1);
            }

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

    function initFixedFooter() {
        const footer = document.getElementById("page-footer");
        if (!footer) return;

        let rafId = null;

        function adjustFooter() {
            const docHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const footerHeight = footer.offsetHeight || 0;
            document.documentElement.style.setProperty("--page-footer-height", footerHeight + "px");

            if (docHeight <= (viewportHeight + 1)) {
                footer.style.position = "fixed";
                footer.style.bottom = "0";
                footer.style.left = "0";
                footer.style.width = "100%";
                document.body.classList.add("footer-fixed");
                document.body.style.paddingBottom = footerHeight + "px";
                return;
            }

            footer.style.position = "static";
            footer.style.bottom = "";
            footer.style.left = "";
            footer.style.width = "";
            document.body.classList.remove("footer-fixed");
            document.body.style.paddingBottom = "0";
        }

        function scheduleAdjust() {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(function () {
                rafId = null;
                adjustFooter();
            });
        }

        window.addEventListener("load", scheduleAdjust);
        window.addEventListener("resize", scheduleAdjust);
        window.addEventListener("orientationchange", scheduleAdjust);

        const observer = new MutationObserver(scheduleAdjust);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });

        setTimeout(scheduleAdjust, 50);
        setTimeout(scheduleAdjust, 300);
        setTimeout(scheduleAdjust, 800);
    }

    window.nalaShowRegister = showRegisterPage;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            bootstrapInitialPage();
            initFixedFooter();
        });
    } else {
        bootstrapInitialPage();
        initFixedFooter();
    }
}());
