const MTK_FINAL_CONFIG = {

    /* ── User data ─────────────────────────────────────────────────── */
    user: {
	currentEmail: "mel@google.com",
	courseName:   "Advanced Web Development"
    },

    /* ── UI strings ─────────────────────────────────────────────────── */
    strings: {
	successHeading:    "successfully completed 'Nala Locksmith' course!",
	successSubheading: "Please specify which email to use for your certificate to be mailed to.",
	currentEmailLabel: "Current email on file",
	optionKeep:        "Use my current email on file",
	optionNew:         "Use a different email address",
	newEmailLabel:     "New email address",
	newEmailHint:      "Enter the email you want on your certificate",
	confirmEmailLabel: "Confirm new email address",
	confirmEmailHint:  "Re-enter to confirm",
	submitLabel:       "Submit Your Choice",
	successToast:      "Your certificate email has been saved.",
	mismatchError:     "Email addresses do not match.",
	invalidEmailError: "Please enter a valid email address.",
	requiredError:     "This field is required.",
	matchConfirmed:    "Emails match \u2714"
    },

    /* ── Event names ─────────────────────────────────────────────────── */
    events: {
	ready:  "mtk-final:ready",
	submit: "mtk-final:submit",
	change: "mtk-final:change",
	error:  "mtk-final:error"
    }

};
