// mtk-msgs.js - Material Design message panel component
class MTKMsgs {
  constructor(element) {
    this.element = element;
    this.config = null;
    this.currentMessage = null;
    this.isVisible = false;
    this.autoCloseTimer = null;
    this.keepBlocking = false;
    
    this.init();
  }

  init() {
    // Get elements
    this.container = this.element.querySelector('.mtk-msgs__container');
    this.iconElement = this.element.querySelector('.mtk-msgs__icon');
    this.messageElement = this.element.querySelector('.mtk-msgs__message');
    this.buttonsContainer = this.element.querySelector('.mtk-msgs__buttons');
    this.closeButton = this.element.querySelector('.mtk-msgs__close');
    
    // Get or create overlay element
    this.overlay = document.querySelector('.mtk-msgs__overlay');
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'mtk-msgs__overlay';
      this.overlay.setAttribute('role', 'presentation');
      document.body.insertBefore(this.overlay, document.body.firstChild);
    }

    // Load configuration
    if (typeof mtkMsgsConfig !== 'undefined') {
      this.config = mtkMsgsConfig;
    }

    // Bind events
    this.bindEvents();

    // Subscribe to messages
    this.subscribeToMessages();

    // Log initialization
    if (typeof wc !== 'undefined' && wc.log) {
      wc.log('mtk-msgs', 'Component initialized');
    }
  }

  bindEvents() {
    // Close button click
    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.hide();
        this.publishEvent('mtk-msgs:closed', {
          message: this.currentMessage
        });
      });

      // Keyboard support for close button
      this.closeButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.closeButton.click();
        }
      });
    }
  }

  subscribeToMessages() {
    if (typeof wc !== 'undefined' && wc.subscribe) {
      // Subscribe to show message event
      wc.subscribe('mtk-msgs:show', this.onMessage.bind(this));
      
      // Subscribe to hide message event
      wc.subscribe('mtk-msgs:hide', this.onMessage.bind(this));
      
      // Subscribe to update message event
      wc.subscribe('mtk-msgs:update', this.onMessage.bind(this));
      
      // Subscribe to toggle message event
      wc.subscribe('mtk-msgs:toggle', this.onMessage.bind(this));
      
      // Subscribe to unblock event
      wc.subscribe('mtk-msgs:unblock', this.onMessage.bind(this));
    }
  }

  onMessage(event, data) {
    switch (event) {
      case 'mtk-msgs:show':
        this.show(data);
        break;
      case 'mtk-msgs:hide':
        this.hide();
        break;
      case 'mtk-msgs:update':
        this.update(data);
        break;
      case 'mtk-msgs:toggle':
        this.toggle(data);
        break;
      case 'mtk-msgs:unblock':
        this.unblock();
        break;
    }
  }

  clearAutoCloseTimer() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  show(messageData) {
    if (!messageData) return;

    // Clear any existing timer
    this.clearAutoCloseTimer();

    // If messageData is a string, look it up in config
    let msgConfig = messageData;
    if (typeof messageData === 'string' && this.config && this.config.messages) {
      msgConfig = this.config.messages[messageData];
    }

    if (!msgConfig) return;

    this.currentMessage = msgConfig;

    // Remove previous type classes
    this.element.classList.remove('mtk-msgs--info', 'mtk-msgs--warning', 'mtk-msgs--error', 'mtk-msgs--success');

    // Add type class
    if (msgConfig.type) {
      this.element.classList.add(`mtk-msgs--${msgConfig.type}`);
    }

    // Set icon
    if (this.iconElement && msgConfig.icon) {
      this.iconElement.textContent = msgConfig.icon;
    }

    // Set message
    if (this.messageElement && msgConfig.message) {
      this.messageElement.textContent = msgConfig.message;
    }

    // Clear and set buttons
    if (this.buttonsContainer) {
      this.buttonsContainer.innerHTML = '';
      
      if (msgConfig.buttons && msgConfig.buttons.length > 0) {
        msgConfig.buttons.forEach((button) => {
          const btnElement = document.createElement('button');
          btnElement.className = 'mtk-msgs__button';
          btnElement.textContent = button.label;
          btnElement.type = 'button';
          
          btnElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.publishEvent('mtk-msgs:button-click', {
              action: button.action,
              button: button,
              message: msgConfig
            });
          });

          // Keyboard support
          btnElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              btnElement.click();
            }
          });

          this.buttonsContainer.appendChild(btnElement);
        });
      }
    }

    // Handle close button visibility
    // Use closable flag to determine if X button should be shown
      if (this.closeButton) {
      if (msgConfig.closable === false) {
        this.closeButton.style.display = 'none';
      } else {
        this.closeButton.style.display = 'flex';
      }
    }

    // Show the message panel
    this.element.classList.add('visible');
    this.isVisible = true;

    // Handle blocking flags - block2 overrides block
    if (msgConfig.block2 === true) {
      // block2 = true: always lock screen and keep locked after hide
      this.lockScreen();
      this.keepBlocking = true;
    } else if (msgConfig.block === true) {
      // block = true, block2 = false: lock screen but unlock on hide
      this.lockScreen();
      this.keepBlocking = false;
    } else {
      // block = false: no screen locking
      this.unlockScreen();
      this.keepBlocking = false;
    }

    // Set up auto-close timer if specified
    if (msgConfig.timer && msgConfig.timer > 0) {
      this.autoCloseTimer = setTimeout(() => {
        this.hide();
        this.publishEvent('mtk-msgs:auto-closed', {
          message: msgConfig,
          timer: msgConfig.timer
        });
      }, msgConfig.timer * 1000);

      if (typeof wc !== 'undefined' && wc.log) {
        wc.log('mtk-msgs', `Auto-close timer set for ${msgConfig.timer} seconds`);
      }
    }

    // Publish show event
    this.publishEvent('mtk-msgs:shown', {
      message: msgConfig
    });
  }

  lockScreen() {
    if (this.overlay) {
      this.overlay.classList.add('visible');
      this.element.classList.add('locked');
      document.body.style.overflow = 'hidden';
    }
  }

  unlockScreen() {
    if (this.overlay) {
      this.overlay.classList.remove('visible');
      this.element.classList.remove('locked');
      document.body.style.overflow = '';
    }
  }

  hide() {
    // Clear any existing timer
    this.clearAutoCloseTimer();

    // Only unlock screen if block2 is not active
    if (!this.keepBlocking) {
      this.unlockScreen();
    }

    this.element.classList.remove('visible');
    this.isVisible = false;

    // Publish hide event
    this.publishEvent('mtk-msgs:hidden', {
      message: this.currentMessage
    });
  }

  unblock() {
    this.unlockScreen();
    this.keepBlocking = false;

    // Publish unblock event
    this.publishEvent('mtk-msgs:unblocked', {
      message: this.currentMessage
    });
  }

  update(messageData) {
    if (this.isVisible) {
      this.show(messageData);
    }
  }

  toggle(messageData) {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(messageData);
    }
  }

  publishEvent(eventName, data) {
    if (typeof wc !== 'undefined' && wc.log && wc.publish) {
      wc.log('mtk-msgs', `Publishing event: ${eventName}`, data);
      wc.publish(eventName, data);
    }
  }

  // Public API
  static show(messageData) {
    const element = document.querySelector('.mtk-msgs');
    if (element && element._mtkMsgsInstance) {
      element._mtkMsgsInstance.show(messageData);
    }
  }

  static hide() {
    const element = document.querySelector('.mtk-msgs');
    if (element && element._mtkMsgsInstance) {
      element._mtkMsgsInstance.hide();
    }
  }

  static toggle(messageData) {
    const element = document.querySelector('.mtk-msgs');
    if (element && element._mtkMsgsInstance) {
      element._mtkMsgsInstance.toggle(messageData);
    }
  }

  static unblock() {
    const element = document.querySelector('.mtk-msgs');
    if (element && element._mtkMsgsInstance) {
      element._mtkMsgsInstance.unblock();
    }
  }
}

// Wait for DOM and initialize
function initMtkMsgs() {
  const element = document.querySelector('.mtk-msgs');
  if (element && !element._mtkMsgsInstance) {
    element._mtkMsgsInstance = new MTKMsgs(element);
  }
}

// Try to initialize immediately if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMtkMsgs);
} else {
  initMtkMsgs();
}

// Also observe for dynamically added elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        if (node.classList && node.classList.contains('mtk-msgs')) {
          if (!node._mtkMsgsInstance) {
            node._mtkMsgsInstance = new MTKMsgs(node);
          }
        } else {
          const element = node.querySelector && node.querySelector('.mtk-msgs');
          if (element && !element._mtkMsgsInstance) {
            element._mtkMsgsInstance = new MTKMsgs(element);
          }
        }
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
