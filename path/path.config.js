(function () {
    window.app = window.app || {};

    function getDisplayPrice(key, fallback) {
        var pricing = window.nalaPricing || {};
        var entry = pricing[key] || {};
        return entry.display || fallback;
    }

    function parsePrice(display) {
        var number = Number(String(display || "").replace(/[^0-9.]/g, ""));
        return Number.isFinite(number) ? number : 0;
    }

    function monthlyPrice(totalDisplay) {
        var total = parsePrice(totalDisplay);
        if (!total) return "";
        return "$" + (total / 24).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function _buildPath() {
        var t = window.i18n ? window.i18n.t.bind(window.i18n) : function(k){ return k; };
        var premiumTotal = getDisplayPrice('premium', "$1,999");
        var businessTotal = getDisplayPrice('business_full', "$3,998");
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
