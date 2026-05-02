(function () {
    "use strict";

    window.wc = window.wc || {};
    wc.buy = wc.buy || {};

    if (wc.buy.__initialized) {
        return;
    }
    wc.buy.__initialized = true;

    function t(key, fallback) {
        if (!window.i18n || typeof window.i18n.t !== "function") {
            return fallback;
        }
        const value = window.i18n.t(key);
        return value === key ? fallback : value;
    }

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

    function customerMessage(err, fallback) {
        if (window.wc && typeof wc.customerMessage === "function") {
            return wc.customerMessage(err, fallback);
        }
        return fallback || t("purchase.checkoutFailed", "Unable to start checkout.");
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

        if (wc.buy.__purchaseModalLoader) {
            return wc.buy.__purchaseModalLoader;
        }

        wc.buy.__purchaseModalLoader = new Promise(function (resolve, reject) {
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

        return wc.buy.__purchaseModalLoader;
    }

    function createCheckoutSession(payload) {
        return apiPost("/api/create_checkout_session.php", payload);
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

    async function handlePurchasePlan(plan) {
        if (!isLoggedIn()) {
            showMsg("warning", t("purchase.loginRequired", "Please log in before purchasing."), { icon: "warning", timer: 7 });
            if (window.wc && wc.pages && typeof wc.pages.show === "function") {
                wc.pages.show("login");
            }
            return;
        }

        if (!canPurchasePlan(plan)) {
            showMsg("warning", t("purchase.notAvailable", "That purchase option is not available for your current account."), {
                icon: "warning",
                timer: 8
            });
            return;
        }

        try {
            const user = getUser();
            const needsPremiumShipping = (plan === "premium") || (plan === "business" && !hasPremium(user));
            const payload = needsPremiumShipping
                ? await (await loadPurchaseModalApi()).showPremiumShippingModal(user, {
                    plan: plan,
                    title: plan === "business" ? t("purchase.shippingTitle", "Lockout Kit Shipping Details") : undefined,
                    intro: plan === "business"
                        ? t("purchase.shippingIntroBusiness", "Business in a Box includes Premium, the car lockout kit, and the lock pick tool set, so we need the shipping address before opening Stripe Checkout.")
                        : undefined
                })
                : { plan: plan };

            const res = await createCheckoutSession(payload);
            if (!res.url) {
                throw new Error(t("purchase.checkoutMissing", "Stripe checkout URL was not returned."));
            }
            window.location.href = res.url;
        } catch (err) {
            if (err && err.message === "Checkout canceled") {
                return;
            }

            showMsg("error", customerMessage(err, t("purchase.checkoutFailed", "Unable to start checkout.")), {
                icon: "error",
                timer: 10
            });
        }
    }

    wc.buy.getAllowedPlans = getAllowedPlans;
    wc.buy.canPurchasePlan = canPurchasePlan;
    wc.buy.handlePurchasePlan = handlePurchasePlan;
    wc.buy.syncPurchaseButtons = syncPurchaseButtons;
    wc.buy.loadPurchaseModalApi = loadPurchaseModalApi;
}());
