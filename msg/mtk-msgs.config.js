// mtk-msgs configuration
const mtkMsgsConfig = {
    messages: {
	info: {
	    type: 'info',
	    icon: 'info',
	    message: 'This is an informational message',
	    buttons: [
		{ label: 'Learn More', action: 'learnMore' }
	    ],
	    dismissible: true
	},
	warning: {
	    type: 'warning',
	    icon: 'warning',
	    message: 'Warning: Please review your settings',
	    buttons: [
		{ label: 'Review', action: 'review' },
		{ label: 'Dismiss', action: 'dismiss' }
	    ],
	    dismissible: true
	},
	error: {
	    type: 'error',
	    icon: 'error',
	    message: 'Error: Something went wrong',
	    buttons: [
		{ label: 'Retry', action: 'retry' }
	    ],
	    dismissible: true
	},
	success: {
	    type: 'success',
	    icon: 'check_circle',
	    message: 'Success: Operation completed',
	    buttons: [],
	    dismissible: true
	}
    }
};
