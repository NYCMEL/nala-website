window.app = window.app || {};

function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

window.app.ready = {
    title:       _t('ready.title',       'Ready to start your locksmith career?'),
    description: _t('ready.description', 'Join NALA today and unlock your potential with industry-leading training and support.'),
    button: {
        label:  _t('ready.cta', 'Get Started Today'),
        action: 'signup'
    }
};

document.addEventListener('i18n:changed', function() {
    var r = window.app.ready;
    if (!r) return;

    // 1. Update config
    r.title        = i18n.t('ready.title');
    r.description  = i18n.t('ready.description');
    r.button.label = i18n.t('ready.cta');

    // 2. Re-render DOM — matches mtk-ready.js render() method
    var titleEl    = document.querySelector('.mtk-ready-title');
    var descEl     = document.querySelector('.mtk-ready-desc');
    var btnLabelEl = document.querySelector('.mtk-ready-btn-label');
    if (titleEl)    titleEl.innerHTML    = r.title;
    if (descEl)     descEl.innerHTML     = r.description;
    if (btnLabelEl) btnLabelEl.innerHTML = r.button.label;
});
