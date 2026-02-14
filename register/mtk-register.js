// mtk-register Component JavaScript
// Material Design Registration Form with Validation

class MTKRegister {
    constructor(formId, config) {
        this.form = document.getElementById(formId);
        this.config = config || {};
        this.fields = {
            firstName: document.getElementById('firstName'),
            email: document.getElementById('email'),
            email2: document.getElementById('email2'),
            phone: document.getElementById('phone')
        };
        
        this.init();
    }

    init() {
        // Load initial values from config
        this.loadInitialValues();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize floating labels
        this.initializeFloatingLabels();
    }

    loadInitialValues() {
        // Load values from config if they exist
        if (this.config.firstName) {
            this.fields.firstName.value = this.config.firstName;
        }
        if (this.config.email) {
            this.fields.email.value = this.config.email;
        }
        if (this.config.email2) {
            this.fields.email2.value = this.config.email2;
        }
        if (this.config.phone) {
            this.fields.phone.value = this.config.phone;
        }

        // Update floating label states for pre-filled values
        Object.values(this.fields).forEach(field => {
            if (field.value) {
                field.classList.add('mtk-has-value');
            }
        });
    }

    setupEventListeners() {
        // Form submit event
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Cancel button event
        const cancelButton = this.form.querySelector('.mtk-button-secondary');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.handleCancel();
            });
        }

        // Input events for floating labels
        Object.values(this.fields).forEach(field => {
            field.addEventListener('input', () => {
                this.updateFloatingLabel(field);
                this.clearError(field);
            });

            field.addEventListener('blur', () => {
                this.validateField(field);
            });

            field.addEventListener('focus', () => {
                this.clearError(field);
            });
        });

        // Ripple effect for buttons
        const buttons = this.form.querySelectorAll('.mtk-button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }

    initializeFloatingLabels() {
        Object.values(this.fields).forEach(field => {
            this.updateFloatingLabel(field);
        });
    }

    updateFloatingLabel(field) {
        if (field.value.trim() !== '') {
            field.classList.add('mtk-has-value');
        } else {
            field.classList.remove('mtk-has-value');
        }
    }

    validateField(field) {
        const fieldId = field.id;
        let isValid = true;
        let errorMessage = '';

        // Check if field is required and empty
        if (field.hasAttribute('required') && field.value.trim() === '') {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (fieldId === 'email' || fieldId === 'email2') {
            if (field.value.trim() !== '') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }
        }

        // Email confirmation validation
        if (fieldId === 'email2' && field.value.trim() !== '') {
            if (field.value !== this.fields.email.value) {
                isValid = false;
                errorMessage = 'Emails do not match';
            }
        }

        // Phone validation
        if (fieldId === 'phone' && field.value.trim() !== '') {
            const phonePattern = /^[\d\s\-\+\(\)]+$/;
            if (!phonePattern.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.clearError(field);
        }

        return isValid;
    }

    showError(field, message) {
        field.classList.add('mtk-error');
        const wrapper = field.closest('.mtk-input-wrapper');
        const helperText = wrapper.querySelector('.mtk-helper-text');
        if (helperText) {
            helperText.setAttribute('data-original-text', helperText.textContent);
            helperText.textContent = message;
        }
    }

    clearError(field) {
        field.classList.remove('mtk-error');
        const wrapper = field.closest('.mtk-input-wrapper');
        const helperText = wrapper.querySelector('.mtk-helper-text');
        if (helperText && helperText.hasAttribute('data-original-text')) {
            helperText.textContent = helperText.getAttribute('data-original-text');
            helperText.removeAttribute('data-original-text');
        }
    }

    handleSubmit() {
        let isFormValid = true;
        let firstInvalidField = null;

        // Validate all fields
        Object.entries(this.fields).forEach(([key, field]) => {
            const isValid = this.validateField(field);
            if (!isValid && isFormValid) {
                isFormValid = false;
                firstInvalidField = field;
            }
        });

        // If form is not valid, focus on first invalid field
        if (!isFormValid) {
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
            return;
        }

        // Collect form data
        const formData = {
            firstName: this.fields.firstName.value.trim(),
            email: this.fields.email.value.trim(),
            email2: this.fields.email2.value.trim(),
            phone: this.fields.phone.value.trim()
        };

        // Publish JSON data
        this.publishData(formData);
    }

    handleCancel() {
        // Clear all fields
        Object.values(this.fields).forEach(field => {
            field.value = '';
            field.classList.remove('mtk-has-value');
            this.clearError(field);
        });

        // Reset form
        this.form.reset();

        // Dispatch cancel event
        const event = new CustomEvent('mtk-register-cancel', {
            bubbles: true
        });
        this.form.dispatchEvent(event);

        // Call wc.publish if available
        if (typeof wc !== 'undefined' && typeof wc.publish === 'function') {
            wc.publish('mtk-register-cancel', {});
        }

        console.log('Form cancelled and reset');
    }

    publishData(data) {
        // Create JSON blob
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mtk-register-data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Log to console
        console.log('Form Data Published:', data);

        // Show success message (you can customize this)
        this.showSuccessMessage();

        // Call wc.publish if available (Web Components)
        if (typeof wc !== 'undefined' && typeof wc.publish === 'function') {
            wc.publish('mtk-register-submit', data);
        }

        // Dispatch custom event
        const event = new CustomEvent('mtk-register-submit', {
            detail: data,
            bubbles: true
        });
        this.form.dispatchEvent(event);
    }

    showSuccessMessage() {
        // Simple alert for now - you can customize this
        const originalButtonText = this.form.querySelector('.mtk-button-text').textContent;
        this.form.querySelector('.mtk-button-text').textContent = 'SUBMITTED ✓';
        
        setTimeout(() => {
            this.form.querySelector('.mtk-button-text').textContent = originalButtonText;
        }, 2000);
    }

    createRipple(event, button) {
        const ripple = button.querySelector('.mtk-ripple');
        if (!ripple) return;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
    }
}

// Initialize the form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for config to be loaded
    const config = window.MTK_REGISTER_CONFIG || {};
    const mtkRegister = new MTKRegister('mtk-register-form', config);
    
    // Make instance globally accessible if needed
    window.mtkRegister = mtkRegister;
});
