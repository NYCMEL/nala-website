(function () {
    "use strict";

    if (window.WCPurchaseModal) {
        return;
    }

    const US_STATES = [
        "", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
        "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
        "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
        "WV", "WI", "WY", "DC", "AS", "GU", "MP", "PR", "UM", "VI"
    ];

    function getBaseUrl() {
        if (window.app && typeof app.baseUrl === "string" && app.baseUrl) {
            return app.baseUrl;
        }

        const path = window.location.pathname || "/";
        const basePath = path.replace(/[^/]*$/, "");
        return basePath && basePath.endsWith("/") ? basePath : (basePath || "/") + "/";
    }

    function ensureShippingModalStyles() {
        if (document.getElementById("wc-purchase-modal-styles")) return;

        const link = document.createElement("link");
        link.id = "wc-purchase-modal-styles";
        link.rel = "stylesheet";
        link.href = getBaseUrl() + "buy/wc-purchase-modal.css";
        document.head.appendChild(link);
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

    function showPremiumShippingModal(user, options) {
        options = options || {};
        ensureShippingModalStyles();

        return new Promise(function (resolve, reject) {
            const prefill = getShippingPrefill(user);
            const title = options.title || "Premium Shipping Details";
            const intro = options.intro || "Premium includes the lockout kit, so we need the shipping address before opening Stripe Checkout.";
            const plan = options.plan || "premium";
            const modal = document.createElement("div");
            modal.className = "wc-purchase-modal";
            modal.innerHTML = `
                <div class="wc-purchase-modal__panel" role="dialog" aria-modal="true" aria-labelledby="wc-purchase-modal-title">
                    <h2 class="wc-purchase-modal__title" id="wc-purchase-modal-title">${escapeHtml(title)}</h2>
                    <p class="wc-purchase-modal__intro">${escapeHtml(intro)}</p>
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
                    plan: plan,
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

    window.WCPurchaseModal = {
        showPremiumShippingModal: showPremiumShippingModal
    };
}());
