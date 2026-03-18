(function () {
    window.app = window.app || {};

    function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

    function buildPath() {
        return {
            heading:    _t('path.heading',    'Choose Your Training Package'),
            subheading: _t('path.subheading', 'Pick the option that fits your goals—start free, upgrade anytime, or launch with Business-in-a-Box.'),
            plans: [
                {
                    id: "trial",
                    title:       _t('path.trial.title',       'Trial'),
                    price:       "$0",
                    period:      "",
                    description: _t('path.trial.description', 'Explore the program with a small preview before you commit.'),
                    features: [
                        _t('path.trial.f1', 'Introduction to Locksmithing'),
                        _t('path.trial.f2', '3 free lessons'),
                        _t('path.trial.f3', 'Preview the learning platform'),
                        _t('path.trial.f4', 'Upgrade anytime')
                    ],
                    cta: _t('path.cta', 'Get Started'),
                    popular: false
                },
                {
                    id: "premium",
                    title:       _t('path.premium.title',       'Premium'),
                    price:       "$1,999",
                    period:      _t('path.premium.period', 'One-time payment · financing up to 24 months available via Klarna'),
                    description: _t('path.premium.description', 'Full program access with a certificate of completion.'),
                    features: [
                        _t('path.premium.f1', 'Full program access (all 5 parts)'),
                        _t('path.premium.f2', 'Full access included'),
                        _t('path.premium.f3', 'Certificate of completion'),
                        _t('path.premium.f4', 'Learn at your own pace'),
                        _t('path.premium.f5', 'Free lockout kit gift included')
                    ],
                    cta: _t('path.cta', 'Get Started'),
                    popular: true
                },
                {
                    id: "business",
                    title:       _t('path.business.title',       'Business-in-a-Box'),
                    price:       "$3,999",
                    period:      _t('path.business.period', 'One-time payment · financing up to 24 months available via Klarna'),
                    description: _t('path.business.description', 'Everything in Premium, plus tools to help you launch your locksmith business.'),
                    features: [
                        _t('path.business.f1', 'Everything included in Premium'),
                        _t('path.business.f2', 'Pre-built locksmith website'),
                        _t('path.business.f3', 'Business card and branding templates'),
                        _t('path.business.f4', 'Service pricing starter framework'),
                        _t('path.business.f5', 'Marketing launch checklist')
                    ],
                    cta: _t('path.cta', 'Get Started'),
                    popular: false
                }
            ]
        };
    }

    window.app.path = buildPath();

    document.addEventListener('i18n:changed', function() {
        window.app.path = buildPath();
    });
})();
