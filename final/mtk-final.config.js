/**
 * mtk-final.config.js
 * Always overwrite config so stale values do not survive across page loads/navigation.
 */

window.MTK_FINAL_CONFIG = {
    user: {
        currentEmail: ''
    },

    strings: {
        successHeading:     'Congratulations!',
        successSubheading:  'You have successfully completed the course.',
        currentEmailLabel:  'Your current email address',
        currentEmail:       'john.doe@example.com',
        optionKeep:         'Send certificate to my current email',
        optionNew:          'Send certificate to a different email',
        newEmailLabel:      'New email address',
        newEmailHint:       'Enter a valid email address',
        confirmEmailLabel:  'Confirm new email address',
        confirmEmailHint:   'Re-enter your new email address',
        submitLabel:        'Send My Certificate',
        successToast:       'Certificate sent! Check your inbox.',
        requiredError:      'This field is required.',
        invalidEmailError:  'Please enter a valid email address.',
        mismatchError:      'Email addresses do not match.',
        matchConfirmed:     'Emails match!'
    },

    events: {
        ready:  'mtk-final:ready',
        change: 'mtk-final:change',
        submit: 'mtk-final:submit',
        error:  'mtk-final:error'
    }
};
