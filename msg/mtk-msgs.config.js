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
      closable: true, // show X button
      timer: null // no auto-close
    },
    warning: {
      type: 'warning',
      icon: 'warning',
      message: 'Warning: Please review your settings',
      buttons: [
        { label: 'Review', action: 'review' },
        { label: 'Dismiss', action: 'dismiss' }
      ],
      closable: true, // show X button
      timer: null // no auto-close
    },
    error: {
      type: 'error',
      icon: 'error',
      message: 'Error: Something went wrong',
      buttons: [
        { label: 'Retry', action: 'retry' }
      ],
      closable: true, // show X button
      timer: null // no auto-close
    },
    success: {
      type: 'success',
      icon: 'check_circle',
      message: 'Success: Operation completed',
      buttons: [],
      closable: false, // no X button
      timer: 10 // auto-close after 10 seconds
    },
    autoInfo: {
      type: 'info',
      icon: 'info',
      message: 'This message will close automatically',
      buttons: [],
      closable: false, // no X button
      timer: 5 // auto-close after 5 seconds
    }
  }
};
