(function () {
    "use strict";

    window.wc = window.wc || {};
    wc.febe = wc.febe || {};

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

    const US_STATES = [
        "", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
        "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
        "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
        "WV", "WI", "WY", "DC", "AS", "GU", "MP", "PR", "UM", "VI"
    ];

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

    function ensureShippingModalStyles() {
        if (document.getElementById("wc-purchase-modal-styles")) return;

        const style = document.createElement("style");
        style.id = "wc-purchase-modal-styles";
        style.textContent = `
            .wc-purchase-modal {
                position: fixed;
                inset: 0;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                background: rgba(9, 18, 32, 0.6);
            }
            .wc-purchase-modal__panel {
                width: min(100%, 720px);
                max-height: 90vh;
                overflow: auto;
                background: #fff;
                border-radius: 18px;
                box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
                padding: 28px;
            }
            .wc-purchase-modal__title {
                margin: 0 0 8px;
                font-size: 28px;
                line-height: 1.2;
                color: #0d47a1;
            }
            .wc-purchase-modal__intro {
                margin: 0 0 20px;
                color: #455a64;
                font-size: 15px;
            }
            .wc-purchase-modal__grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 16px;
            }
            .wc-purchase-modal__full {
                grid-column: 1 / -1;
            }
            .wc-purchase-modal__field label {
                display: block;
                margin-bottom: 6px;
                font-weight: 700;
                color: #263238;
            }
            .wc-purchase-modal__field input,
            .wc-purchase-modal__field select {
                width: 100%;
                box-sizing: border-box;
                padding: 12px 14px;
                border: 1px solid #cfd8dc;
                border-radius: 10px;
                font-size: 15px;
                background: #fff;
            }
            .wc-purchase-modal__field input:focus,
            .wc-purchase-modal__field select:focus {
                outline: none;
                border-color: #1976d2;
                box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.14);
            }
            .wc-purchase-modal__error {
                min-height: 22px;
                margin: 14px 0 0;
                color: #c62828;
                font-size: 14px;
                font-weight: 600;
            }
            .wc-purchase-modal__actions {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                margin-top: 20px;
            }
            .wc-purchase-modal__btn {
                border: 0;
                border-radius: 999px;
                padding: 12px 20px;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
            }
            .wc-purchase-modal__btn--secondary {
                background: #eceff1;
                color: #37474f;
            }
            .wc-purchase-modal__btn--primary {
                background: #1565c0;
                color: #fff;
            }
            @media (max-width: 720px) {
                .wc-purchase-modal__panel {
                    padding: 22px;
                }
                .wc-purchase-modal__grid {
                    grid-template-columns: 1fr;
                }
                .wc-purchase-modal__actions {
                    flex-direction: column-reverse;
                }
                .wc-purchase-modal__btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function buildStateOptions(selectedValue) {
        return US_STATES.map(function (state) {
            const label = state || "Select state";
            const selected = state === selectedValue ? " selected" : "";
            const disabled = state === "" ? " disabled" : "";
            return '<option value="' + state + '"' + selected + disabled + '>' + label + "</option>";
        }).join("");
    }

    function getShippingPrefill(user) {
        const fullName = String(
            (user && (user.full_name || user.name || user.customer_name)) || ""
        ).trim();

        return {
            shipping_name: fullName,
            shipping_address1: String((user && user.shipping_address1) || "").trim(),
            shipping_address2: String((user && user.shipping_address2) || "").trim(),
            shipping_city: String((user && user.shipping_city) || "").trim(),
            shipping_state: String((user && user.shipping_state) || "").trim().toUpperCase(),
            shipping_postal_code: String((user && user.shipping_postal_code) || "").trim(),
            shipping_country: "US",
            customer_name: fullName,
            customer_email: String((user && user.email) || "").trim(),
            customer_phone: String((user && user.phone) || "").trim()
        };
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function showPremiumShippingModal(user) {
        ensureShippingModalStyles();

        return new Promise(function (resolve, reject) {
            const prefill = getShippingPrefill(user);
            const modal = document.createElement("div");
            modal.className = "wc-purchase-modal";
            modal.innerHTML = `
                <div class="wc-purchase-modal__panel" role="dialog" aria-modal="true" aria-labelledby="wc-purchase-modal-title">
                    <h2 class="wc-purchase-modal__title" id="wc-purchase-modal-title">Premium Shipping Details</h2>
                    <p class="wc-purchase-modal__intro">Premium includes the lockout kit, so we need the shipping address before opening Stripe Checkout.</p>
                    <form class="wc-purchase-modal__form">
                        <div class="wc-purchase-modal__grid">
                            <div class="wc-purchase-modal__field wc-purchase-modal__full">
                                <label for="wc-shipping-name">Recipient Name</label>
                                <input id="wc-shipping-name" name="shipping_name" type="text" value="${escapeHtml(prefill.shipping_name)}" />
                            </div>
                            <div class="wc-purchase-modal__field wc-purchase-modal__full">
                                <label for="wc-shipping-address1">Address Line 1</label>
                                <input id="wc-shipping-address1" name="shipping_address1" type="text" value="${escapeHtml(prefill.shipping_address1)}" />
                            </div>
                            <div class="wc-purchase-modal__field wc-purchase-modal__full">
                                <label for="wc-shipping-address2">Address Line 2</label>
                                <input id="wc-shipping-address2" name="shipping_address2" type="text" value="${escapeHtml(prefill.shipping_address2)}" />
                            </div>
                            <div class="wc-purchase-modal__field">
                                <label for="wc-shipping-city">City</label>
                                <input id="wc-shipping-city" name="shipping_city" type="text" value="${escapeHtml(prefill.shipping_city)}" />
                            </div>
                            <div class="wc-purchase-modal__field">
                                <label for="wc-shipping-state">State</label>
                                <select id="wc-shipping-state" name="shipping_state">${buildStateOptions(prefill.shipping_state)}</select>
                            </div>
                            <div class="wc-purchase-modal__field">
                                <label for="wc-shipping-postal-code">ZIP / Postal Code</label>
                                <input id="wc-shipping-postal-code" name="shipping_postal_code" type="text" value="${escapeHtml(prefill.shipping_postal_code)}" />
                            </div>
                            <div class="wc-purchase-modal__field">
                                <label for="wc-shipping-country">Country</label>
                                <input id="wc-shipping-country" name="shipping_country" type="text" value="US" readonly />
                            </div>
                        </div>
                        <div class="wc-purchase-modal__error" data-error></div>
                        <div class="wc-purchase-modal__actions">
                            <button type="button" class="wc-purchase-modal__btn wc-purchase-modal__btn--secondary" data-action="cancel">Cancel</button>
                            <button type="submit" class="wc-purchase-modal__btn wc-purchase-modal__btn--primary">Continue to Checkout</button>
                        </div>
                    </form>
                </div>
            `;

            function cleanup() {
                modal.remove();
                document.body.style.overflow = "";
            }

            function cancel() {
                cleanup();
                reject(new Error("Checkout canceled"));
            }

            modal.addEventListener("click", function (event) {
                if (event.target === modal) {
                    cancel();
                }
            });

            const form = modal.querySelector("form");
            const errorEl = modal.querySelector("[data-error]");
            const cancelBtn = modal.querySelector('[data-action="cancel"]');

            cancelBtn.addEventListener("click", cancel);

            form.addEventListener("submit", function (event) {
                event.preventDefault();

                const formData = new FormData(form);
                const payload = {
                    plan: "premium",
                    customer_name: prefill.customer_name,
                    customer_email: prefill.customer_email,
                    customer_phone: prefill.customer_phone,
                    shipping_country: "US"
                };

                ["shipping_name", "shipping_address1", "shipping_address2", "shipping_city", "shipping_state", "shipping_postal_code"].forEach(function (key) {
                    payload[key] = String(formData.get(key) || "").trim();
                });

                const missingLabels = [];
                if (!payload.shipping_name) missingLabels.push("recipient name");
                if (!payload.shipping_address1) missingLabels.push("address line 1");
                if (!payload.shipping_city) missingLabels.push("city");
                if (!payload.shipping_state) missingLabels.push("state");
                if (!payload.shipping_postal_code) missingLabels.push("ZIP / postal code");

                if (missingLabels.length) {
                    errorEl.textContent = "Please complete: " + missingLabels.join(", ") + ".";
                    return;
                }

                cleanup();
                resolve(payload);
            });

            document.body.appendChild(modal);
            document.body.style.overflow = "hidden";

            const firstInput = modal.querySelector("#wc-shipping-name");
            if (firstInput) {
                firstInput.focus();
                firstInput.select();
            }
        });
    }

    function createCheckoutSession(payload) {
        return apiPost("/api/create_checkout_session.php", payload);
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
                ? await showPremiumShippingModal(user)
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
