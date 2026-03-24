(function () {
    "use strict";

    window.wc = window.wc || {};
    wc.febe = wc.febe || {};

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

    function createCheckoutSession(plan) {
        return apiPost("/api/create_checkout_session.php", { plan: plan });
    }

    function handlePurchasePlan(plan) {
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

        createCheckoutSession(plan)
            .then((res) => {
                if (!res.url) {
                    throw new Error("Stripe checkout URL was not returned.");
                }
                window.location.href = res.url;
            })
            .catch((err) => {
                showMsg("error", err.message || "Unable to start checkout.", {
                    icon: "error",
                    timer: 10
                });
            });
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
                            window.location.href = "/repo_deploy/index.html";
                        }
                    })
                    .catch(() => {
                        window.location.href = "/repo_deploy/index.html";
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

    function handleManualLogout() {
        apiPost("/api/logout.php", {})
            .then(() => {
                if (window.wc) {
                    wc.session = null;
                }

                if (wc.pages && typeof wc.pages.show === "function") {
                    wc.pages.show("login");
                } else {
                    window.location.href = "/repo_deploy/index.html";
                }
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
        if (wc.pages && typeof wc.pages.show === "function") {
            wc.pages.show(page);
        }
    }

    function handleRegisterSubmit(payload) {
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
            });
    }

    function handleLoginSubmit(payload) {
        apiPost("/api/login.php", payload)
            .then((json) => {
                if (window.wc) {
                    wc.session = json.session || json;
                }

                showMsg("success", "Logged in successfully.", {
                    icon: "success",
                    timer: 5
                });

                goToPage("dashboard");
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
        });
    }

    function bindEvents() {
        if (!window.wc || typeof wc.subscribe !== "function") return;

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
    }

    wc.febe.apiPost = apiPost;
    wc.febe.handlePurchasePlan = handlePurchasePlan;
    wc.febe.handleManualLogout = handleManualLogout;
    wc.febe.handleRegisterSubmit = handleRegisterSubmit;
    wc.febe.handleLoginSubmit = handleLoginSubmit;
    wc.febe.showCheckoutStatusMessage = showCheckoutStatusMessage;
    wc.febe.syncPurchaseButtons = syncPurchaseButtons;
    wc.febe.goToPage = goToPage;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
