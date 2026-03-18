function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

const mtkMsgsConfig = {
    messages: {
        info: {
            type: 'info', icon: 'info',
            message: _t('msg.info', 'This is an informational message'),
            buttons: [{ label: _t('msg.btn.learn', 'Learn More'), action: 'learnMore' }],
            closable: true, timer: null, block: false, block2: false
        },
        warning: {
            type: 'warning', icon: 'warning',
            message: _t('msg.warning', 'Warning: Please review your settings'),
            buttons: [
                { label: _t('msg.btn.review',  'Review'),  action: 'review'  },
                { label: _t('msg.btn.dismiss', 'Dismiss'), action: 'dismiss' }
            ],
            closable: true, timer: null, block: false, block2: false
        },
        error: {
            type: 'error', icon: 'error',
            message: _t('msg.error', 'Error: Something went wrong'),
            buttons: [{ label: _t('msg.btn.retry', 'Retry'), action: 'retry' }],
            closable: true, timer: null, block: true, block2: false
        },
        success: {
            type: 'success', icon: 'check_circle',
            message: _t('msg.success', 'Success: Operation completed'),
            buttons: [], closable: false, timer: 10, block: false, block2: false
        },
        autoInfo: {
            type: 'info', icon: 'info',
            message: _t('msg.autoInfo', 'This message will close automatically'),
            buttons: [], closable: false, timer: 5, block: false, block2: false
        },
        blockExample: {
            type: 'warning', icon: 'warning',
            message: _t('msg.block', 'Screen is blocked while this message shows'),
            buttons: [{ label: _t('msg.btn.dismiss', 'Dismiss'), action: 'dismiss' }],
            closable: true, timer: null, block: true, block2: false
        },
        block2Example: {
            type: 'error', icon: 'error',
            message: _t('msg.block2', 'Processing... Screen stays blocked after close'),
            buttons: [{ label: _t('msg.btn.close', 'Close Message'), action: 'close' }],
            closable: true, timer: null, block: false, block2: true
        }
    }
};
