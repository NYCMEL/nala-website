(function () {
    window.app = window.app || {};

    function _buildPath() {
        var t = window.i18n ? window.i18n.t.bind(window.i18n) : function(k){ return k; };
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
                    price:       "$1,999",
                    period:      t('path.premium.period'),
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
                    price:       "$3,998",
                    period:      t('path.business.period'),
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
})();
