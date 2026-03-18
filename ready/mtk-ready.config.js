window.app = window.app || {};

function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

window.app.ready = {
    title:       _t('ready.title',       'Ready to Start Your Locksmith Career?'),
    description: _t('ready.description', 'Join NALA today and unlock your potential with industry-leading training and support.'),
    button: {
        label:  _t('ready.cta', 'Get Started Today'),
        action: 'signup'
    }
};

document.addEventListener('i18n:changed', function() {
    var r = window.app.ready;
    if (!r) return;
    r.title           = i18n.t('ready.title');
    r.description     = i18n.t('ready.description');
    r.button.label    = i18n.t('ready.cta');
});
