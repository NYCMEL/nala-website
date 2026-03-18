/**
 * mtk-final.config.js — i18n-ready
 */

function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

window.MTK_FINAL_CONFIG = window.MTK_FINAL_CONFIG || {
    user: { currentEmail: 'mel@google.com' },
    strings: {
        successHeading:    _t('final.successHeading',    'Congratulations!'),
        successSubheading: _t('final.successSubheading', 'You have successfully completed the course.'),
        currentEmailLabel: _t('final.currentEmailLabel', 'Your current email address'),
        currentEmail:      'john.doe@example.com',
        optionKeep:        _t('final.optionKeep',        'Send certificate to my current email'),
        optionNew:         _t('final.optionNew',         'Send certificate to a different email'),
        newEmailLabel:     _t('final.newEmailLabel',     'New email address'),
        newEmailHint:      _t('final.newEmailHint',      'Enter a valid email address'),
        confirmEmailLabel: _t('final.confirmEmailLabel', 'Confirm new email address'),
        confirmEmailHint:  _t('final.confirmEmailHint',  'Re-enter your new email address'),
        submitLabel:       _t('final.submitLabel',       'Send My Certificate'),
        successToast:      _t('final.successToast',      'Certificate sent! Check your inbox.'),
        requiredError:     _t('final.requiredError',     'This field is required.'),
        invalidEmailError: _t('final.invalidEmailError', 'Please enter a valid email address.'),
        mismatchError:     _t('final.mismatchError',     'Email addresses do not match.'),
        matchConfirmed:    _t('final.matchConfirmed',    'Emails match!')
    },
    events: {
        ready:  'mtk-final:ready',
        change: 'mtk-final:change',
        submit: 'mtk-final:submit',
        error:  'mtk-final:error'
    }
};

document.addEventListener('i18n:changed', function() {
    var s = window.MTK_FINAL_CONFIG && window.MTK_FINAL_CONFIG.strings;
    if (!s) return;
    s.successHeading    = i18n.t('final.successHeading');
    s.successSubheading = i18n.t('final.successSubheading');
    s.currentEmailLabel = i18n.t('final.currentEmailLabel');
    s.optionKeep        = i18n.t('final.optionKeep');
    s.optionNew         = i18n.t('final.optionNew');
    s.newEmailLabel     = i18n.t('final.newEmailLabel');
    s.newEmailHint      = i18n.t('final.newEmailHint');
    s.confirmEmailLabel = i18n.t('final.confirmEmailLabel');
    s.confirmEmailHint  = i18n.t('final.confirmEmailHint');
    s.submitLabel       = i18n.t('final.submitLabel');
    s.successToast      = i18n.t('final.successToast');
    s.requiredError     = i18n.t('final.requiredError');
    s.invalidEmailError = i18n.t('final.invalidEmailError');
    s.mismatchError     = i18n.t('final.mismatchError');
    s.matchConfirmed    = i18n.t('final.matchConfirmed');
});
