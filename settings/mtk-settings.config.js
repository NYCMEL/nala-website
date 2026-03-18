// mtk-settings Configuration
if (typeof mtkSettingsConfig === 'undefined') {

function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

var mtkSettingsConfig = {
    user: {
        firstName:       "John",
        middleInitial:   "",
        lastName:        "",
        email:           "john.doe@example.com",
        currentPassword: "password123"
    },
    labels: {
        title:           _t('settings.title',           'Profile Settings'),
        userName:        _t('settings.userName',        'Full Name'),
        userEmail:       _t('settings.userEmail',       'Email Address'),
        currentPassword: _t('settings.currentPassword', 'Current Password'),
        newPassword:     _t('settings.newPassword',     'New Password'),
        confirmPassword: _t('settings.confirmPassword', 'Confirm New Password'),
        updateButton:    _t('settings.updateButton',    'Update'),
        saveButton:      _t('settings.saveButton',      'Save Changes'),
        cancelButton:    _t('settings.cancelButton',    'Cancel')
    },
    validation: {
        passwordMinLength:       8,
        passwordRequireUppercase: true,
        passwordRequireLowercase: true,
        passwordRequireNumber:    true
    }
};

document.addEventListener('i18n:changed', function() {
    var l = mtkSettingsConfig.labels;

    // 1. Update config
    l.title           = i18n.t('settings.title');
    l.userName        = i18n.t('settings.userName');
    l.userEmail       = i18n.t('settings.userEmail');
    l.currentPassword = i18n.t('settings.currentPassword');
    l.newPassword     = i18n.t('settings.newPassword');
    l.confirmPassword = i18n.t('settings.confirmPassword');
    l.updateButton    = i18n.t('settings.updateButton');
    l.saveButton      = i18n.t('settings.saveButton');
    l.cancelButton    = i18n.t('settings.cancelButton');

    // 2. Re-render DOM — mirrors MtkSettings.setup() in mtk-settings.js
    var titleEl   = document.getElementById('mtk-settings-title');
    var saveBtn   = document.getElementById('mtk-settings-save-btn');
    var cancelBtn = document.getElementById('mtk-settings-cancel-btn');
    var updateBtn = document.getElementById('mtk-settings-update-btn');
    if (titleEl)   titleEl.textContent   = l.title;
    if (saveBtn)   saveBtn.textContent   = l.saveButton;
    if (cancelBtn) cancelBtn.textContent = l.cancelButton;
    if (updateBtn) updateBtn.textContent = l.updateButton;

    // Labels inside the settings form (mtk-settings.html uses <label> elements)
    var root = document.querySelector('mtk-settings.mtk-settings');
    if (!root) return;
    var labelMap = {
        '#mtk-settings-fullname':         l.userName,
        '#mtk-settings-email':            l.userEmail,
        '#mtk-settings-current-password': l.currentPassword,
        '#mtk-settings-new-password':     l.newPassword,
        '#mtk-settings-confirm-password': l.confirmPassword
    };
    Object.keys(labelMap).forEach(function(sel) {
        var inp = root.querySelector(sel);
        if (!inp) return;
        var label = root.querySelector('label[for="' + inp.id + '"]');
        if (label) label.textContent = labelMap[sel];
    });
});

} // end duplicate load guard
