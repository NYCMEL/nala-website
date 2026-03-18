// mtk-dashboard configuration
function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

window.mtkDashboardConfig = {
    user: {
        fullName: "-------------------"
    },
    progress: {
        label:       _t('dashboard.progress.label', 'Your progress to date:'),
        percentage:  0,
        courseTitle: _t('dashboard.course.title',   'NALA - Locksmith Course')
    },
    subscriptions: {
        title: _t('dashboard.subs.title', 'You can also subscribe to our premium features:'),
        options: [
            {
                id:          "premium-course",
                icon:        "school",
                title:       _t('dashboard.sub1.title',       'Premium Courses'),
                description: _t('dashboard.sub1.description', 'Access advanced courses and certifications'),
                price:       _t('dashboard.sub1.price',       '$29.99/month')
            },
            {
                id:          "mentorship",
                icon:        "people",
                title:       _t('dashboard.sub2.title',       '1-on-1 Mentorship'),
                description: _t('dashboard.sub2.description', 'Get personalized guidance from experts'),
                price:       _t('dashboard.sub2.price',       '$99.99/month')
            },
            {
                id:          "career-services",
                icon:        "work",
                title:       _t('dashboard.sub3.title',       'Career Services'),
                description: _t('dashboard.sub3.description', 'Resume review, interview prep, and job matching'),
                price:       _t('dashboard.sub3.price',       '$49.99/month')
            }
        ]
    }
};

document.addEventListener('i18n:changed', function() {
    var cfg = window.mtkDashboardConfig;
    if (!cfg) return;

    // 1. Update config
    cfg.progress.label                       = i18n.t('dashboard.progress.label');
    cfg.progress.courseTitle                 = i18n.t('dashboard.course.title');
    cfg.subscriptions.title                  = i18n.t('dashboard.subs.title');
    cfg.subscriptions.options[0].title       = i18n.t('dashboard.sub1.title');
    cfg.subscriptions.options[0].description = i18n.t('dashboard.sub1.description');
    cfg.subscriptions.options[0].price       = i18n.t('dashboard.sub1.price');
    cfg.subscriptions.options[1].title       = i18n.t('dashboard.sub2.title');
    cfg.subscriptions.options[1].description = i18n.t('dashboard.sub2.description');
    cfg.subscriptions.options[1].price       = i18n.t('dashboard.sub2.price');
    cfg.subscriptions.options[2].title       = i18n.t('dashboard.sub3.title');
    cfg.subscriptions.options[2].description = i18n.t('dashboard.sub3.description');
    cfg.subscriptions.options[2].price       = i18n.t('dashboard.sub3.price');

    // 2. Re-render DOM — mirrors MTKDashboard render methods in mtk-dashboard.js
    var progressLabel = document.getElementById('progressLabel');
    var courseTitleEl = document.getElementById('courseTitle');
    var subsTitle     = document.getElementById('subscriptionsTitle');
    if (progressLabel) progressLabel.textContent = cfg.progress.label;
    if (courseTitleEl) courseTitleEl.textContent = cfg.progress.courseTitle;
    if (subsTitle)     subsTitle.textContent      = cfg.subscriptions.title;

    // Update subscription cards already in the DOM
    var cards = document.querySelectorAll('.mtk-dashboard__subscription-card');
    cfg.subscriptions.options.forEach(function(opt, i) {
        var card = cards[i];
        if (!card) return;
        var titleEl = card.querySelector('.mtk-dashboard__card-title');
        var descEl  = card.querySelector('.mtk-dashboard__card-description');
        var priceEl = card.querySelector('.mtk-dashboard__card-price');
        if (titleEl) titleEl.textContent = opt.title;
        if (descEl)  descEl.textContent  = opt.description;
        if (priceEl) priceEl.textContent = opt.price;
    });
});
