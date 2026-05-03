(function () {
    window.app = window.app || {};

    function getDisplayPrice(key, fallback) {
        var pricing = window.nalaPricing || {};
        var entry = pricing[key] || {};
        return entry.display || fallback;
    }

    function getPriceAmount(key) {
        var pricing = window.nalaPricing || {};
        var entry = pricing[key] || {};
        if (entry && typeof entry.unit_amount !== "undefined" && !isNaN(Number(entry.unit_amount))) {
            return Number(entry.unit_amount) / 100;
        }
        return parsePrice(entry.display);
    }

    function parsePrice(display) {
        var number = Number(String(display || "").replace(/[^0-9.]/g, ""));
        return Number.isFinite(number) ? number : 0;
    }

    function money(amount, decimals) {
        return "$" + Number(amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function displayTotal(amount) {
        return money(amount, Math.round(amount) === amount ? 0 : 2);
    }

    function monthlyPrice(totalDisplay) {
        var total = parsePrice(totalDisplay);
        if (!total) return "";
        return money(total / 24, 2);
    }

    function businessBundlePricing() {
        var discount = 200;
        var premium = getPriceAmount("premium");
        var addOn = getPriceAmount("business_addon");
        var full = getPriceAmount("business_full");
        var regular = premium && addOn ? premium + addOn : full;

        if (!regular) {
            regular = parsePrice("$3,998");
        }

        var discounted = Math.max(regular - discount, 0);
        return {
            discount: displayTotal(discount),
            regular: displayTotal(regular),
            total: displayTotal(discounted)
        };
    }

    function _buildPath() {
        var t = window.i18n ? window.i18n.t.bind(window.i18n) : function(k){ return k; };
        var premiumTotal = getDisplayPrice('premium', "$1,999");
        var businessBundle = businessBundlePricing();
        var businessTotal = businessBundle.total;
        return {
            heading:    t('path.heading'),
            subheading: t('path.subheading'),
            plans: [
                {
                    id:          "trial",
                    title:       t('path.trial.title'),
                    price:       "$0",
                    period:      "",
                    description: t('path.trial.description'),
                    features: [
                        t('path.trial.f1'),
                        t('path.trial.f2'),
                        t('path.trial.f3'),
                        t('path.trial.f4')
                    ],
                    cta:     t('path.cta'),
                    popular: false
                },
                {
                    id:          "premium",
                    title:       t('path.premium.title'),
                    price:       monthlyPrice(premiumTotal),
                    period:      t('path.premium.period'),
                    totalPrice:  t('path.totalPrice').replace('{price}', premiumTotal),
                    bonusLabel:  t('path.bonusLabel'),
                    bonusText:   t('path.premium.bonus'),
                    description: t('path.premium.description'),
                    features: [
                        t('path.premium.f1'),
                        t('path.premium.f2'),
                        t('path.premium.f3'),
                        t('path.premium.f4'),
                        t('path.premium.f5')
                    ],
                    cta:     t('path.cta'),
                    popular: true
                },
                {
                    id:          "business",
                    title:       t('path.business.title'),
                    price:       monthlyPrice(businessTotal),
                    period:      t('path.business.period'),
                    totalPrice:  t('path.totalPrice').replace('{price}', businessTotal),
                    discountNote: t('path.business.discountNote')
                        .replace('{discount}', businessBundle.discount)
                        .replace('{regular}', businessBundle.regular),
                    bonusLabel:  t('path.bonusLabel'),
                    bonusText:   t('path.business.bonus'),
                    description: t('path.business.description'),
                    features: [
                        t('path.business.f1'),
                        t('path.business.f2'),
                        t('path.business.f3'),
                        t('path.business.f4'),
                        t('path.business.f5')
                    ],
                    cta:     t('path.cta'),
                    popular: false
                }
            ]
        };
    }

    window.app.path = _buildPath();

    // Rebuild on language change
    document.addEventListener('i18n:changed', function () {
        window.app.path = _buildPath();
        document.dispatchEvent(new CustomEvent('path:rebuild'));
    });

    document.addEventListener('nala-pricing:updated', function () {
        window.app.path = _buildPath();
        document.dispatchEvent(new CustomEvent('path:rebuild'));
    });
})();
