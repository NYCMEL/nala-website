function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

const MTKDialogConfig = {
    dialog: {
        id:              "mtk-dialog-main",
        title:           _t('dialog.title',   'Confirm Action'),
        message:         _t('dialog.message', 'Are you sure you want to proceed with this action? This cannot be undone.'),
        icon:            "warning",
        iconColor:       "#F59E0B",
        closeOnBackdrop: true,
        closeOnEscape:   true,
        maxWidth:        "480px",
        buttons: [
            { label: _t('dialog.cancel',  'Cancel'),  action: "cancel",  classes: "btn btn-link"    },
            { label: _t('dialog.delete',  'Delete'),  action: "delete",  classes: "btn btn-danger"  },
            { label: _t('dialog.confirm', 'Confirm'), action: "confirm", classes: "btn btn-primary" }
        ]
    }
};

if (wc.testing) {
    window.mtkRegisterConfig = { name: "Mel M. Heravi", email: "mel@google.com", email2: "mel@google.com", phone: "+1 (646) 303-1234" };
} else {
    window.mtkRegisterConfig = { name: "", email: "", email2: "", phone: "" };
}

document.addEventListener('i18n:changed', function() {
    var d = MTKDialogConfig.dialog;
    d.title   = i18n.t('dialog.title');
    d.message = i18n.t('dialog.message');
    d.buttons[0].label = i18n.t('dialog.cancel');
    d.buttons[1].label = i18n.t('dialog.delete');
    d.buttons[2].label = i18n.t('dialog.confirm');
});
