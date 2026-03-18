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
        // 1. Rebuild data
        window.app.path = buildPath();

        // 2. Re-render matching path.js structure
        var root = document.getElementById('MTK-path');
        if (!root) return;
        var container = root.querySelector('.container');
        if (!container) return;

        container.innerHTML = '';
        var data = window.app.path;

        // Header
        var header = document.createElement('div');
        header.className = 'text-center';
        var title = document.createElement('h1');
        title.className = 'title';
        title.textContent = data.heading;
        var subtitle = document.createElement('p');
        subtitle.className = 'lead';
        subtitle.textContent = data.subheading;
        header.appendChild(title);
        header.appendChild(subtitle);
        container.appendChild(header);

        // Plans
        var row = document.createElement('div');
        row.className = 'row g-4 justify-content-center';

        data.plans.forEach(function(plan) {
            var col  = document.createElement('div');
            col.className = 'col-12 col-md-6';
            var card = document.createElement('div');
            card.className = 'mtk-card' + (plan.popular ? ' mtk-popular' : '');

            if (plan.popular) {
                var badge = document.createElement('div');
                badge.className = 'mtk-badge';
                badge.textContent = i18n.t('path.popular') || 'Most Popular';
                card.appendChild(badge);
            }

            var h4 = document.createElement('h4');
            h4.textContent = plan.title;
            card.appendChild(h4);

            var priceWrap = document.createElement('div');
            var priceEl   = document.createElement('span');
            priceEl.className = 'price';
            priceEl.textContent = plan.price;
            var periodEl  = document.createElement('span');
            periodEl.className = 'period';
            periodEl.textContent = plan.period || '';
            priceWrap.appendChild(priceEl);
            priceWrap.appendChild(periodEl);
            card.appendChild(priceWrap);

            var desc = document.createElement('p');
            desc.textContent = plan.description;
            card.appendChild(desc);

            var ul = document.createElement('ul');
            (plan.features || []).forEach(function(f) {
                var li    = document.createElement('li');
                var check = document.createElement('span');
                check.className = 'check';
                check.textContent = '✓';
                var text  = document.createElement('span');
                text.textContent = f;
                li.appendChild(check);
                li.appendChild(text);
                ul.appendChild(li);
            });
            card.appendChild(ul);

            var btn = document.createElement('div');
            btn.className = 'btn btn-lg btn-path';
            btn.textContent = plan.cta;
            btn.addEventListener('click', function() { wc.publish('mtk-path:click'); });
            card.appendChild(btn);

            col.appendChild(card);
            row.appendChild(col);
        });

        container.appendChild(row);
    });
})();
