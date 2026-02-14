/**
 * mtk-settings Component
 * Material Design Settings/Profile Component
 */

class MtkSettings {
  constructor() {
    this.config = null;
    this.elements = {};
    this.state = {
      editMode: false,
      passwordVisible: {
        current: false,
        new: false,
        confirm: false
      }
    };
    
    this.init();
  }
  
  /**
   * Initialize the component
   */
  async init() {
    // Wait for DOM to be ready and element to be available
    await this.waitForElement();
    
    // Load configuration
    this.loadConfig();
    
    // Cache DOM elements
    this.cacheElements();
    
    // Initialize component
    this.setup();
    
    // Subscribe to events
    this.subscribeToEvents();
    
    wc.log('mtk-settings component initialized', { config: this.config });
  }
  
  /**
   * Wait for the mtk-settings element to be available in DOM
   */
  waitForElement() {
    return new Promise((resolve) => {
      const checkElement = () => {
        const element = document.querySelector('mtk-settings.mtk-settings');
        if (element) {
          resolve(element);
        } else {
          requestAnimationFrame(checkElement);
        }
      };
      checkElement();
    });
  }
  
  /**
   * Load configuration from config file
   */
  loadConfig() {
    if (typeof mtkSettingsConfig !== 'undefined') {
      this.config = mtkSettingsConfig;
    } else {
      console.error('mtk-settings: Configuration not found');
      this.config = {
        user: { firstName: '', middleInitial: '', lastName: '', email: '', currentPassword: '' },
        labels: {},
        validation: {}
      };
    }
  }
  
  /**
   * Cache DOM elements
   */
  cacheElements() {
    const root = document.querySelector('mtk-settings.mtk-settings');
    
    this.elements = {
      root: root,
      title: root.querySelector('#mtk-settings-title'),
      fullName: root.querySelector('#mtk-settings-fullname'),
      email: root.querySelector('#mtk-settings-email'),
      currentPassword: root.querySelector('#mtk-settings-current-password'),
      toggleCurrentPassword: root.querySelector('#mtk-settings-toggle-current-password'),
      updateBtn: root.querySelector('#mtk-settings-update-btn'),
      
      newPasswordGroup: root.querySelector('#mtk-settings-new-password-group'),
      newPassword: root.querySelector('#mtk-settings-new-password'),
      toggleNewPassword: root.querySelector('#mtk-settings-toggle-new-password'),
      newPasswordError: root.querySelector('#mtk-settings-new-password-error'),
      newPasswordErrorText: root.querySelector('#mtk-settings-new-password-error-text'),
      
      confirmPasswordGroup: root.querySelector('#mtk-settings-confirm-password-group'),
      confirmPassword: root.querySelector('#mtk-settings-confirm-password'),
      toggleConfirmPassword: root.querySelector('#mtk-settings-toggle-confirm-password'),
      confirmPasswordError: root.querySelector('#mtk-settings-confirm-password-error'),
      confirmPasswordErrorText: root.querySelector('#mtk-settings-confirm-password-error-text'),
      
      passwordStrength: root.querySelector('#mtk-settings-password-strength'),
      passwordStrengthText: root.querySelector('#mtk-settings-password-strength-text'),
      passwordStrengthFill: root.querySelector('#mtk-settings-password-strength-fill'),
      
      saveActions: root.querySelector('#mtk-settings-save-actions'),
      saveBtn: root.querySelector('#mtk-settings-save-btn'),
      cancelBtn: root.querySelector('#mtk-settings-cancel-btn')
    };
  }
  
  /**
   * Setup component with initial data and event listeners
   */
  setup() {
    // Set title
    if (this.config.labels.title) {
      this.elements.title.textContent = this.config.labels.title;
    }
    
    // Set full name
    const fullName = this.formatFullName();
    this.elements.fullName.value = fullName;
    
    // Set email
    if (this.config.user.email) {
      this.elements.email.value = this.config.user.email;
    }
    
    // Set masked current password from config
    if (this.config.user.currentPassword) {
      this.elements.currentPassword.value = this.maskPassword(this.config.user.currentPassword);
    }
    
    // Attach event listeners
    this.attachEventListeners();
  }
  
  /**
   * Format full name from config
   */
  formatFullName() {
    const { firstName, middleInitial, lastName } = this.config.user;
    const parts = [firstName];
    
    if (middleInitial) {
      parts.push(middleInitial + '.');
    }
    
    parts.push(lastName);
    
    return parts.join(' ');
  }
  
  /**
   * Mask password with asterisks
   */
  maskPassword(password) {
    return '*'.repeat(password.length);
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Update button
    this.elements.updateBtn.addEventListener('click', () => this.handleUpdateClick());
    
    // Toggle password visibility buttons
    this.elements.toggleCurrentPassword.addEventListener('click', () => 
      this.togglePasswordVisibility('current')
    );
    this.elements.toggleNewPassword.addEventListener('click', () => 
      this.togglePasswordVisibility('new')
    );
    this.elements.toggleConfirmPassword.addEventListener('click', () => 
      this.togglePasswordVisibility('confirm')
    );
    
    // Password input validation
    this.elements.newPassword.addEventListener('input', () => this.handleNewPasswordInput());
    this.elements.confirmPassword.addEventListener('input', () => this.handleConfirmPasswordInput());
    
    // Action buttons
    this.elements.saveBtn.addEventListener('click', () => this.handleSaveClick());
    this.elements.cancelBtn.addEventListener('click', () => this.handleCancelClick());
    
    // Keyboard accessibility
    this.setupKeyboardAccessibility();
  }
  
  /**
   * Setup keyboard accessibility
   */
  setupKeyboardAccessibility() {
    // Handle Enter key on buttons
    const buttons = [
      this.elements.updateBtn,
      this.elements.saveBtn,
      this.elements.cancelBtn,
      this.elements.toggleCurrentPassword,
      this.elements.toggleNewPassword,
      this.elements.toggleConfirmPassword
    ];
    
    buttons.forEach(button => {
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });
  }
  
  /**
   * Handle Update button click
   */
  handleUpdateClick() {
    this.enterEditMode();
    
    const eventData = {
      action: 'edit_mode_entered',
      timestamp: new Date().toISOString()
    };
    
    wc.log('Publishing 4-mtk-settings event:', eventData);
    wc.publish('4-mtk-settings', eventData);
  }
  
  /**
   * Enter edit mode
   */
  enterEditMode() {
    this.state.editMode = true;
    
    // Enable current password field
    this.elements.currentPassword.disabled = false;
    this.elements.currentPassword.value = '';
    this.elements.currentPassword.placeholder = 'Enter current password';
    this.elements.toggleCurrentPassword.disabled = false;
    
    // Show new password fields
    this.elements.newPasswordGroup.classList.remove('mtk-settings__hidden');
    this.elements.confirmPasswordGroup.classList.remove('mtk-settings__hidden');
    
    // Hide update button, show save/cancel buttons
    this.elements.updateBtn.classList.add('mtk-settings__hidden');
    this.elements.saveActions.classList.remove('mtk-settings__hidden');
    
    // Add edit mode class
    this.elements.root.classList.add('mtk-settings--edit-mode');
    
    // Focus on current password field
    setTimeout(() => this.elements.currentPassword.focus(), 100);
  }
  
  /**
   * Exit edit mode
   */
  exitEditMode() {
    this.state.editMode = false;
    
    // Disable and reset current password field
    this.elements.currentPassword.disabled = true;
    this.elements.currentPassword.value = this.maskPassword(this.config.user.currentPassword);
    this.elements.currentPassword.type = 'password';
    this.elements.toggleCurrentPassword.disabled = true;
    this.state.passwordVisible.current = false;
    this.updatePasswordToggleIcon('current');
    
    // Hide and reset new password fields
    this.elements.newPasswordGroup.classList.add('mtk-settings__hidden');
    this.elements.confirmPasswordGroup.classList.add('mtk-settings__hidden');
    this.elements.newPassword.value = '';
    this.elements.confirmPassword.value = '';
    this.elements.newPassword.type = 'password';
    this.elements.confirmPassword.type = 'password';
    this.state.passwordVisible.new = false;
    this.state.passwordVisible.confirm = false;
    this.updatePasswordToggleIcon('new');
    this.updatePasswordToggleIcon('confirm');
    
    // Hide errors
    this.hideError('new');
    this.hideError('confirm');
    
    // Reset password strength
    this.updatePasswordStrength('');
    
    // Show update button, hide save/cancel buttons
    this.elements.updateBtn.classList.remove('mtk-settings__hidden');
    this.elements.saveActions.classList.add('mtk-settings__hidden');
    
    // Remove edit mode class
    this.elements.root.classList.remove('mtk-settings--edit-mode');
  }
  
  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(field) {
    this.state.passwordVisible[field] = !this.state.passwordVisible[field];
    
    let inputElement;
    if (field === 'current') {
      inputElement = this.elements.currentPassword;
    } else if (field === 'new') {
      inputElement = this.elements.newPassword;
    } else if (field === 'confirm') {
      inputElement = this.elements.confirmPassword;
    }
    
    if (inputElement) {
      inputElement.type = this.state.passwordVisible[field] ? 'text' : 'password';
      this.updatePasswordToggleIcon(field);
    }
  }
  
  /**
   * Update password toggle icon
   */
  updatePasswordToggleIcon(field) {
    let toggleButton;
    if (field === 'current') {
      toggleButton = this.elements.toggleCurrentPassword;
    } else if (field === 'new') {
      toggleButton = this.elements.toggleNewPassword;
    } else if (field === 'confirm') {
      toggleButton = this.elements.toggleConfirmPassword;
    }
    
    if (toggleButton) {
      const icon = toggleButton.querySelector('.material-icons');
      icon.textContent = this.state.passwordVisible[field] ? 'visibility_off' : 'visibility';
      toggleButton.setAttribute('aria-label', 
        this.state.passwordVisible[field] ? 'Hide password' : 'Show password'
      );
    }
  }
  
  /**
   * Handle new password input
   */
  handleNewPasswordInput() {
    const password = this.elements.newPassword.value;
    
    // Update password strength
    this.updatePasswordStrength(password);
    
    // Validate password
    if (password.length > 0) {
      const validationResult = this.validatePassword(password);
      if (!validationResult.valid) {
        this.showError('new', validationResult.message);
      } else {
        this.hideError('new');
      }
    } else {
      this.hideError('new');
    }
    
    // Validate confirm password if it has a value
    if (this.elements.confirmPassword.value.length > 0) {
      this.handleConfirmPasswordInput();
    }
  }
  
  /**
   * Handle confirm password input
   */
  handleConfirmPasswordInput() {
    const newPassword = this.elements.newPassword.value;
    const confirmPassword = this.elements.confirmPassword.value;
    
    if (confirmPassword.length > 0) {
      if (newPassword !== confirmPassword) {
        this.showError('confirm', 'Passwords do not match');
      } else {
        this.hideError('confirm');
      }
    } else {
      this.hideError('confirm');
    }
  }
  
  /**
   * Validate password against rules
   */
  validatePassword(password) {
    const validation = this.config.validation;
    
    if (password.length < validation.passwordMinLength) {
      return {
        valid: false,
        message: `Password must be at least ${validation.passwordMinLength} characters`
      };
    }
    
    if (validation.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one uppercase letter'
      };
    }
    
    if (validation.passwordRequireLowercase && !/[a-z]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one lowercase letter'
      };
    }
    
    if (validation.passwordRequireNumber && !/[0-9]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one number'
      };
    }
    
    return { valid: true, message: '' };
  }
  
  /**
   * Update password strength indicator
   */
  updatePasswordStrength(password) {
    if (password.length === 0) {
      this.elements.passwordStrengthText.textContent = 'Password strength: ';
      this.elements.passwordStrengthFill.style.width = '0%';
      this.elements.passwordStrengthFill.className = 'mtk-settings__password-strength-bar-fill';
      return;
    }
    
    let strength = 0;
    let strengthText = '';
    let strengthClass = '';
    
    // Calculate strength
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    
    // Determine strength level
    if (strength < 40) {
      strengthText = 'Weak';
      strengthClass = 'mtk-settings__password-strength-bar-fill--weak';
    } else if (strength < 70) {
      strengthText = 'Medium';
      strengthClass = 'mtk-settings__password-strength-bar-fill--medium';
    } else {
      strengthText = 'Strong';
      strengthClass = 'mtk-settings__password-strength-bar-fill--strong';
    }
    
    this.elements.passwordStrengthText.textContent = `Password strength: ${strengthText}`;
    this.elements.passwordStrengthFill.style.width = `${strength}%`;
    this.elements.passwordStrengthFill.className = `mtk-settings__password-strength-bar-fill ${strengthClass}`;
  }
  
  /**
   * Show error message
   */
  showError(field, message) {
    if (field === 'new') {
      this.elements.newPasswordErrorText.textContent = message;
      this.elements.newPasswordError.classList.remove('mtk-settings__hidden');
    } else if (field === 'confirm') {
      this.elements.confirmPasswordErrorText.textContent = message;
      this.elements.confirmPasswordError.classList.remove('mtk-settings__hidden');
    }
  }
  
  /**
   * Hide error message
   */
  hideError(field) {
    if (field === 'new') {
      this.elements.newPasswordError.classList.add('mtk-settings__hidden');
    } else if (field === 'confirm') {
      this.elements.confirmPasswordError.classList.add('mtk-settings__hidden');
    }
  }
  
  /**
   * Handle Save button click
   */
  handleSaveClick() {
    // Validate all fields
    const currentPassword = this.elements.currentPassword.value;
    const newPassword = this.elements.newPassword.value;
    const confirmPassword = this.elements.confirmPassword.value;
    
    // Clear all errors first
    this.hideError('new');
    this.hideError('confirm');
    
    // Check if current password is correct
    if (currentPassword !== this.config.user.currentPassword) {
      this.showError('new', 'Current password is incorrect');
      this.elements.currentPassword.focus();
      return;
    }
    
    // Validate new password
    const validationResult = this.validatePassword(newPassword);
    if (!validationResult.valid) {
      this.showError('new', validationResult.message);
      this.elements.newPassword.focus();
      return;
    }
    
    // Check if passwords match - show error on NEW password field
    if (newPassword !== confirmPassword) {
      this.showError('new', 'Passwords do not match');
      this.elements.newPassword.focus();
      this.elements.newPassword.select();
      return;
    }
    
    // Update password in config (in production, this would be an API call)
    this.config.user.currentPassword = newPassword;
    
    const eventData = {
      action: 'password_updated',
      timestamp: new Date().toISOString(),
      success: true
    };
    
    wc.log('Publishing 4-mtk-settings event:', eventData);
    wc.publish('4-mtk-settings', eventData);
    
    // Exit edit mode
    this.exitEditMode();
    
    // Show success message (you could implement a toast notification here)
    console.log('Password updated successfully');
  }
  
  /**
   * Handle Cancel button click
   */
  handleCancelClick() {
    const eventData = {
      action: 'edit_cancelled',
      timestamp: new Date().toISOString()
    };
    
    wc.log('Publishing 4-mtk-settings event:', eventData);
    wc.publish('4-mtk-settings', eventData);
    
    this.exitEditMode();
  }
  
  /**
   * Subscribe to custom events
   */
  subscribeToEvents() {
    // Subscribe to 4-mtk-settings events
    wc.subscribe('4-mtk-settings', this.onMessage.bind(this));
  }
  
  /**
   * Handle incoming messages from wc.subscribe
   */
  onMessage(data) {
    wc.log('mtk-settings received message:', data);
    
    if (!data || !data.action) {
      return;
    }
    
    switch (data.action) {
      case 'reset':
        this.exitEditMode();
        break;
      
      case 'update_user':
        if (data.user) {
          this.config.user = { ...this.config.user, ...data.user };
          this.elements.fullName.value = this.formatFullName();
          if (data.user.email) {
            this.elements.email.value = data.user.email;
          }
          if (data.user.currentPassword) {
            this.elements.currentPassword.value = this.maskPassword(data.user.currentPassword);
          }
        }
        break;
      
      default:
        wc.log('Unknown action:', data.action);
    }
  }
}

// Initialize the component when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MtkSettings();
  });
} else {
  new MtkSettings();
}
