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
      timer: null, // no auto-close
      block: false, // don't block screen
      block2: false // don't keep blocking after hide
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
      timer: null, // no auto-close
      block: false, // don't block screen
      block2: false // don't keep blocking after hide
    },
    error: {
      type: 'error',
      icon: 'error',
      message: 'Error: Something went wrong',
      buttons: [
        { label: 'Retry', action: 'retry' }
      ],
      closable: true, // show X button
      timer: null, // no auto-close
      block: true, // block screen (default for errors)
      block2: false // unlock when message hides
    },
    success: {
      type: 'success',
      icon: 'check_circle',
      message: 'Success: Operation completed',
      buttons: [],
      closable: false, // no X button
      timer: 10, // auto-close after 10 seconds
      block: false, // don't block screen
      block2: false // don't keep blocking after hide
    },
    autoInfo: {
      type: 'info',
      icon: 'info',
      message: 'This message will close automatically',
      buttons: [],
      closable: false, // no X button
      timer: 5, // auto-close after 5 seconds
      block: false, // don't block screen
      block2: false // don't keep blocking after hide
    },
    blockExample: {
      type: 'warning',
      icon: 'warning',
      message: 'Screen is blocked while this message shows',
      buttons: [
        { label: 'Dismiss', action: 'dismiss' }
      ],
      closable: true,
      timer: null,
      block: true, // block screen
      block2: false // unlock when dismissed
    },
    block2Example: {
      type: 'error',
      icon: 'error',
      message: 'Processing... Screen stays blocked after close',
      buttons: [
        { label: 'Close Message', action: 'close' }
      ],
      closable: true,
      timer: null,
      block: true, // block screen
      block2: true // keep blocking after message hides
    }
  }
};
