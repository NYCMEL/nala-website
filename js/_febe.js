(function () {
    "use strict";

    window.wc = window.wc || {};
    wc.febe = wc.febe || {};
    if (wc.febe.__initialized) {
        return;
    }
    wc.febe.__initialized = true;

    let registerRequestInFlight = false;

    function getBaseUrl() {
        if (window.app && typeof app.baseUrl === "string" && app.baseUrl) {
            return app.baseUrl;
        }

        const path = window.location.pathname || "/";
        const basePath = path.replace(/[^/]*$/, "");
        return basePath && basePath.endsWith("/") ? basePath : (basePath || "/") + "/";
    }

    function apiPost(url, data) {
        return fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data || {})
        }).then(async (res) => {
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                const err = new Error(json.error || json.message || "server_error");
                err.payload = json;
                err.status = res.status;
                throw err;
            }
            return json;
        });
    }

    function apiGet(url) {
        return fetch(url, {
            method: "GET",
            credentials: "include"
        }).then(async (res) => {
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                const err = new Error(json.error || json.message || "server_error");
                err.payload = json;
                err.status = res.status;
                throw err;
            }
            return json;
        });
    }

    function showMsg(type, message, options) {
        options = options || {};

        if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
            MTKMsgs.show({
                type: type || "info",
                icon: options.icon || type || "info",
                message: message || "",
                closable: options.closable !== false,
                timer: options.timer,
                persistent: !!options.persistent
            });
            return;
        }

        alert(message);
    }

    function hideMsg() {
        if (window.MTKMsgs && typeof MTKMsgs.hide === "function") {
            MTKMsgs.hide();
        }
        if (window.MTKMsgs && typeof MTKMsgs.unblock === "function") {
            MTKMsgs.unblock();
        }
        document.querySelectorAll(".mtk-msgs").forEach((node) => {
            node.classList.remove("visible", "locked", "mtk-msgs--info", "mtk-msgs--warning", "mtk-msgs--error", "mtk-msgs--success");
        });
        document.querySelectorAll(".mtk-msgs__overlay").forEach((node) => {
            node.classList.remove("visible");
        });
        document.body.style.overflow = "";
    }

    function getUser() {
        return (window.wc && wc.session && wc.session.user) ? wc.session.user : null;
    }

    function isLoggedIn() {
        return !!getUser();
    }

    function hasPremium(user) {
        return !!(user && Number(user.has_premium) === 1);
    }

    function hasBusiness(user) {
        return !!(user && Number(user.has_business_in_a_box) === 1);
    }

    function getAllowedPlans(user) {
        if (!user) return [];

        if (!hasPremium(user) && !hasBusiness(user)) {
            return ["premium", "business"];
        }

        if (hasPremium(user) && !hasBusiness(user)) {
            return ["business"];
        }

        return [];
    }

    function canPurchasePlan(plan) {
        const user = getUser();
        if (!user) return false;
        return getAllowedPlans(user).includes(plan);
    }

    function loadPurchaseModalApi() {
        if (window.WCPurchaseModal && typeof window.WCPurchaseModal.showPremiumShippingModal === "function") {
            return Promise.resolve(window.WCPurchaseModal);
        }

        if (wc.febe.__purchaseModalLoader) {
            return wc.febe.__purchaseModalLoader;
        }

        wc.febe.__purchaseModalLoader = new Promise(function (resolve, reject) {
            const existing = document.querySelector('script[data-wc-purchase-modal="1"]');
            if (existing) {
                existing.addEventListener("load", function () {
                    resolve(window.WCPurchaseModal);
                }, { once: true });
                existing.addEventListener("error", function () {
                    reject(new Error("Failed to load purchase modal module."));
                }, { once: true });
                return;
            }

            const script = document.createElement("script");
            script.src = getBaseUrl() + "buy/wc-purchase-modal.js";
            script.async = true;
            script.setAttribute("data-wc-purchase-modal", "1");
            script.onload = function () {
                resolve(window.WCPurchaseModal);
            };
            script.onerror = function () {
                reject(new Error("Failed to load purchase modal module."));
            };
            document.head.appendChild(script);
        });

        return wc.febe.__purchaseModalLoader;
    }

    function createCheckoutSession(payload) {
        return apiPost("/api/create_checkout_session.php", payload);
    }

    function fetchPricing() {
        return apiGet("/api/pricing.php")
            .then((json) => {
                window.nalaPricing = json && json.prices ? json.prices : {};
                document.dispatchEvent(new CustomEvent("nala-pricing:updated", {
                    detail: window.nalaPricing
                }));
                return window.nalaPricing;
            })
            .catch((err) => {
                console.warn("Failed to load pricing", err);
                return null;
            });
    }

    async function handlePurchasePlan(plan) {
        if (!isLoggedIn()) {
            showMsg("warning", "Please log in before purchasing.", { icon: "warning", timer: 7 });
            if (wc.pages && typeof wc.pages.show === "function") {
                wc.pages.show("login");
            }
            return;
        }

        if (!canPurchasePlan(plan)) {
            showMsg("warning", "That purchase option is not available for your current account.", {
                icon: "warning",
                timer: 8
            });
            return;
        }

        try {
            const user = getUser();
            const payload = plan === "premium"
                ? await (await loadPurchaseModalApi()).showPremiumShippingModal(user)
                : { plan: plan };

            const res = await createCheckoutSession(payload);
            if (!res.url) {
                throw new Error("Stripe checkout URL was not returned.");
            }
            window.location.href = res.url;
        } catch (err) {
            if (err && err.message === "Checkout canceled") {
                return;
            }

            showMsg("error", (err && err.message) || "Unable to start checkout.", {
                icon: "error",
                timer: 10
            });
        }
    }

    function showCheckoutStatusMessage() {
        const params = new URLSearchParams(window.location.search);
        const checkout = params.get("checkout");

        if (checkout === "success") {
            showMsg(
                "success",
                "Payment received. Receipt sent. Login email sent. Gift order created. Tracking will be emailed.",
                {
                    icon: "success",
                    closable: true,
                    persistent: true
                }
            );

            const newUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, newUrl);

            setTimeout(() => {
                apiPost("/api/logout.php", {})
                    .then(() => {
                        if (window.wc) {
                            wc.session = null;
                        }

                        if (wc.pages && typeof wc.pages.show === "function") {
                            wc.pages.show("login");
                        } else {
                            window.location.href = getBaseUrl() + "index.html";
                        }
                    })
                    .catch(() => {
                        window.location.href = getBaseUrl() + "index.html";
                    });
            }, 1500);
        }

        if (checkout === "cancel") {
            showMsg("info", "Checkout was canceled.", {
                icon: "info",
                closable: true,
                timer: 7
            });

            const newUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, newUrl);
        }
    }

    function applyLoggedOutView() {
        hideMsg();

        if (window.wc) {
            wc.session = null;
            wc.user = null;
            wc.currentUser = null;
        }

        if (window.jQuery) {
            jQuery(".app-header").hide();
            jQuery("#header-private").hide();
            jQuery("#header-public").show();
        }

        syncPurchaseButtons();

        if (wc.pages && typeof wc.pages.show === "function") {
            wc.pages.show("login");
        } else {
            window.location.href = getBaseUrl() + "index.html";
        }
    }

    function applyLoggedInView() {
        hideMsg();

        if (window.jQuery) {
            jQuery(".app-header").hide();
            jQuery("#header-public").hide();
            jQuery("#header-private").show();
        }

        syncPurchaseButtons();

        if (wc.pages && typeof wc.pages.show === "function") {
            wc.pages.show("dashboard");
        }
    }

    function handleManualLogout() {
        const logoutAction = (window.wc && typeof wc.logout === "function")
            ? wc.logout({ redirect: false })
            : apiPost("/api/logout.php", {});

        Promise.resolve(logoutAction)
            .then(() => {
                applyLoggedOutView();
            })
            .catch((err) => {
                showMsg("error", err.message || "Logout failed.", {
                    icon: "error",
                    timer: 8
                });
            });
    }

    function syncPurchaseButtons() {
        const user = getUser();
        const premiumButtons = document.querySelectorAll('[data-purchase-plan="premium"]');
        const businessButtons = document.querySelectorAll('[data-purchase-plan="business"]');

        premiumButtons.forEach((btn) => {
            if (!user) {
                btn.disabled = false;
                btn.style.display = "";
                return;
            }

            if (canPurchasePlan("premium")) {
                btn.disabled = false;
                btn.style.display = "";
            } else {
                btn.disabled = true;
                btn.style.display = "none";
            }
        });

        businessButtons.forEach((btn) => {
            if (!user) {
                btn.disabled = false;
                btn.style.display = "";
                return;
            }

            if (canPurchasePlan("business")) {
                btn.disabled = false;
                btn.style.display = "";
            } else {
                btn.disabled = true;
                btn.style.display = "none";
            }
        });
    }

    function goToPage(page) {
        hideMsg();

        if (wc.pages && typeof wc.pages.show === "function") {
            wc.pages.show(page);
        }
    }

    function goToRegisterPage() {
        if (typeof window.nalaShowRegister === "function") {
            window.nalaShowRegister();
            return;
        }

        goToPage("register");
    }

    function handleRegisterSubmit(payload) {
        if (registerRequestInFlight) {
            return;
        }

        registerRequestInFlight = true;

        apiPost("/api/register.php", payload)
            .then((json) => {
                showMsg(
                    "success",
                    (json && (json.message || json.msg)) ? (json.message || json.msg) : "Registration submitted. Check your email to set your password.",
                    {
                        icon: "success",
                        closable: true,
                        timer: 12
                    }
                );
            })
            .catch((err) => {
                showMsg("error", err.message || "server_error", {
                    icon: "error",
                    closable: true,
                    timer: 10
                });
                console.error(err);
            })
            .finally(() => {
                registerRequestInFlight = false;
            });
    }

    function handleLoginSubmit(payload) {
        apiPost("/api/login.php", payload)
            .then((json) => {
                if (window.wc) {
                    wc.session = json.session || json;
                    wc.user = wc.session && wc.session.user ? wc.session.user : null;
                    wc.currentUser = wc.user;
                }

                showMsg("success", "Logged in successfully.", {
                    icon: "success",
                    timer: 5
                });

                applyLoggedInView();
            })
            .catch((err) => {
                showMsg("error", err.message || "Wrong credentials", {
                    icon: "error",
                    closable: true,
                    timer: 10
                });
                console.error(err);
            });
    }

    function bindClicks() {
        document.addEventListener("click", function (e) {
            const getStartedBtn = e.target.closest("button");
            if (
                getStartedBtn &&
                /get started/i.test((getStartedBtn.textContent || "").trim()) &&
                !getStartedBtn.closest("mtk-login, .mtk-login, #header, .mtk-dialog, .mtk-msgs")
            ) {
                e.preventDefault();
                goToRegisterPage();
                return;
            }

            const purchaseBtn = e.target.closest("[data-purchase-plan]");
            if (purchaseBtn) {
                e.preventDefault();
                const plan = purchaseBtn.getAttribute("data-purchase-plan");
                handlePurchasePlan(plan);
                return;
            }

            const homeActionBtn = e.target.closest("[data-home-action]");
            if (homeActionBtn) {
                e.preventDefault();
                const action = homeActionBtn.getAttribute("data-home-action");

                if (action === "business") {
                    handlePurchasePlan("business");
                    return;
                }

                goToPage("register");
                return;
            }

            const logoutBtn = e.target.closest("[data-action='logout'], .btn-logout, #btn-logout");
            if (logoutBtn) {
                e.preventDefault();
                handleManualLogout();
            }
        }, true);

        document.addEventListener("submit", function (e) {
            const loginForm = e.target.closest("mtk-login form, .mtk-login form");
            if (!loginForm) return;

            e.preventDefault();
            e.stopPropagation();

            const emailField = loginForm.querySelector("#mtk-email");
            const passwordField = loginForm.querySelector("#mtk-password");
            const payload = {
                email: emailField ? emailField.value.trim() : "",
                password: passwordField ? passwordField.value.trim() : ""
            };

            if (!payload.email || !payload.password) {
                return;
            }

            handleLoginSubmit(payload);
        }, true);
    }

    function bindEvents() {
        if (!window.wc || typeof wc.subscribe !== "function") return;

	// B-IN-BOX SAVE CHANGES
        wc.subscribe("client:save", function (_msg, data) {
            console.log("=========", data, "==========");
	    alert("Email should be send to this client to procure the request" );
        });

	// B-IN-BOX CLIENT REQUEST
        wc.subscribe("mtk-request:submit", function (_msg, data) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>", data, "<<<<<<<<<<<<<<<<<<<<<<<");
	    alert("Email should be send to this client to procure the request" );
        });

        wc.subscribe("mtk-register-submit", function (_msg, data) {
            handleRegisterSubmit(data || {});
        });

        wc.subscribe("mtk-login-submit", function (_msg, data) {
            handleLoginSubmit(data || {});
        });

        wc.subscribe("mtk-login-success", function (_msg, data) {
            handleLoginSubmit(data || {});
        });

        wc.subscribe("mtk-header-home", function () {
            goToPage("home");
        });

        wc.subscribe("mtk-header-register", function () {
            goToPage("register");
        });

        wc.subscribe("mtk-header-login", function () {
            goToPage("login");
        });

        wc.subscribe("mtk-login-register", function () {
            goToPage("register");
        });

        wc.subscribe("mtk-login-forgot", function () {
            showMsg("info", "Password reset is not available from this screen yet. Please contact support for help resetting your password.", {
                icon: "info",
                closable: true,
                timer: 8
            });
        });

        wc.subscribe("mtk-login-forgot-password", function () {
            showMsg("info", "Password reset is not available from this screen yet. Please contact support for help resetting your password.", {
                icon: "info",
                closable: true,
                timer: 8
            });
        });

        wc.subscribe("mtk-ready:click", function () {
            goToPage("register");
        });

        wc.subscribe("mtk-courses:click", function () {
            goToPage("register");
        });

        wc.subscribe("mtk-path:click", function (_msg, data) {
            const payload = data || {};

            if (payload.plan === "premium" || payload.plan === "business") {
                handlePurchasePlan(payload.plan);
                return;
            }

            goToPage("register");
        });

        wc.subscribe("mtk-header-dashboard", function () {
            goToPage("dashboard");
        });

        wc.subscribe("mtk-header-hierarchy", function () {
            goToPage("hierarchy");
        });

        wc.subscribe("mtk-header-quiz", function () {
            goToPage("quiz");
        });

        wc.subscribe("mtk-header-final", function () {
            goToPage("final");
        });

        wc.subscribe("mtk-header-settings", function () {
            goToPage("settings");
        });

        wc.subscribe("mtk-header-logout", function () {
            handleManualLogout();
        });

        wc.subscribe("mtk-dashboard:subscription-clicked", function (_msg, data) {
            const payload = data || {};
            if (payload.subscriptionId === "premium-course") {
                handlePurchasePlan("premium");
            } else if (payload.subscriptionId === "business-in-a-box") {
                handlePurchasePlan("business");
            }
        });
    }

    function init() {
        bindClicks();
        bindEvents();
        showCheckoutStatusMessage();
        syncPurchaseButtons();
        fetchPricing();
    }

    wc.febe.apiPost = apiPost;
    wc.febe.handlePurchasePlan = handlePurchasePlan;
    wc.febe.handleManualLogout = handleManualLogout;
    wc.febe.handleRegisterSubmit = handleRegisterSubmit;
    wc.febe.handleLoginSubmit = handleLoginSubmit;
    wc.febe.showCheckoutStatusMessage = showCheckoutStatusMessage;
    wc.febe.syncPurchaseButtons = syncPurchaseButtons;
    wc.febe.goToPage = goToPage;
    wc.febe.fetchPricing = fetchPricing;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
