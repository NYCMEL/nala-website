/**
 * mtk-settings Component
 * Material Design Settings/Profile Component
 */

class MtkSettings {
    constructor(config = null) {
        this.externalConfig = config;
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

    async init() {
        await this.waitForElement();
        this.loadConfig();
        this.cacheElements();
        this.setup();
        this.subscribeToEvents();

        wc.log('mtk-settings component initialized', { config: this.config });
    }

    waitForElement() {
        return new Promise((resolve) => {
            const check = () => {
                const el = document.querySelector('mtk-settings.mtk-settings');
                if (el) resolve(el);
                else requestAnimationFrame(check);
            };
            check();
        });
    }

    /**
     * CONFIG LOADING LOGIC
     */
    loadConfig() {

        if (wc.isLocal) {
            // LOCAL → use global config
            if (typeof window.mtkSettingsConfig !== 'undefined') {
                this.config = window.mtkSettingsConfig;
            } else {
                console.error('mtk-settings: window.mtkSettingsConfig not found (local mode)');
            }
        } else {
            // PRODUCTION → use passed config
            if (this.externalConfig) {
                this.config = this.externalConfig;
            } else {
                console.error('mtk-settings: No config passed in production mode');
            }
        }

        // Safety fallback
        if (!this.config) {
            this.config = {
                user: {
                    firstName: '',
                    middleInitial: '',
                    lastName: '',
                    email: '',
                    currentPassword: ''
                },
                labels: {
                    title: 'Profile Settings'
                },
                validation: {
                    passwordMinLength: 8,
                    passwordRequireUppercase: false,
                    passwordRequireLowercase: false,
                    passwordRequireNumber: false
                }
            };
        }
    }

    cacheElements() {
        const root = document.querySelector('mtk-settings.mtk-settings');

        this.elements = {
            root,
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

    setup() {
        if (this.config.labels?.title) {
            this.elements.title.textContent = this.config.labels.title;
        }

        this.elements.fullName.value = this.formatFullName();
        this.elements.email.value = this.config.user.email || '';

        if (this.config.user.currentPassword) {
            this.elements.currentPassword.value =
                this.maskPassword(this.config.user.currentPassword);
        }

        this.attachEventListeners();
    }

    formatFullName() {
        const { firstName, middleInitial, lastName } = this.config.user;
        const parts = [firstName];
        if (middleInitial) parts.push(middleInitial + '.');
        parts.push(lastName);
        return parts.filter(Boolean).join(' ');
    }

    maskPassword(password) {
        return '*'.repeat(password.length);
    }

    attachEventListeners() {
        this.elements.updateBtn.addEventListener('click', () => this.enterEditMode());
        this.elements.saveBtn.addEventListener('click', () => this.handleSaveClick());
        this.elements.cancelBtn.addEventListener('click', () => this.exitEditMode());
    }

    enterEditMode() {
        this.state.editMode = true;
        this.elements.currentPassword.disabled = false;
        this.elements.currentPassword.value = '';
        this.elements.newPasswordGroup.classList.remove('mtk-settings__hidden');
        this.elements.confirmPasswordGroup.classList.remove('mtk-settings__hidden');
        this.elements.updateBtn.classList.add('mtk-settings__hidden');
        this.elements.saveActions.classList.remove('mtk-settings__hidden');
    }

    exitEditMode() {
        this.state.editMode = false;
        this.elements.currentPassword.disabled = true;
        this.elements.currentPassword.value =
            this.maskPassword(this.config.user.currentPassword);
        this.elements.newPasswordGroup.classList.add('mtk-settings__hidden');
        this.elements.confirmPasswordGroup.classList.add('mtk-settings__hidden');
        this.elements.newPassword.value = '';
        this.elements.confirmPassword.value = '';
        this.elements.updateBtn.classList.remove('mtk-settings__hidden');
        this.elements.saveActions.classList.add('mtk-settings__hidden');
    }

    validatePassword(password) {
        const v = this.config.validation;

        if (password.length < v.passwordMinLength)
            return { valid: false, message: `Minimum ${v.passwordMinLength} characters` };

        if (v.passwordRequireUppercase && !/[A-Z]/.test(password))
            return { valid: false, message: 'Must contain uppercase letter' };

        if (v.passwordRequireLowercase && !/[a-z]/.test(password))
            return { valid: false, message: 'Must contain lowercase letter' };

        if (v.passwordRequireNumber && !/[0-9]/.test(password))
            return { valid: false, message: 'Must contain number' };

        return { valid: true };
    }

    handleSaveClick() {
        const current = this.elements.currentPassword.value;
        const newPass = this.elements.newPassword.value;
        const confirm = this.elements.confirmPassword.value;

        if (current !== this.config.user.currentPassword) {
            alert('Current password incorrect');
            return;
        }

        const validation = this.validatePassword(newPass);
        if (!validation.valid) {
            alert(validation.message);
            return;
        }

        if (newPass !== confirm) {
            alert('Passwords do not match');
            return;
        }

        this.config.user.currentPassword = newPass;

        wc.publish('4-mtk-settings', {
            action: 'password_updated',
            success: true,
            timestamp: new Date().toISOString()
        });

        this.exitEditMode();
    }

    subscribeToEvents() {
        wc.subscribe('4-mtk-settings', (data) => {
            wc.log('mtk-settings received message:', data);
        });
    }
}

/**
 * CLEAN INITIALIZATION
 */
function initMtkSettings() {
    if (wc.isLocal) {
        new MtkSettings(); // uses window.mtkSettingsConfig
    } else {
        // must provide config in production
        new MtkSettings(wc.mtkSettingsConfig);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMtkSettings);
} else {
    if (wc.isLocal) {
        new MtkSettings(); // uses window.mtkSettingsConfig
    } else {
	mtkSettingsConfig.user.firstName = wc.session.user.name;
	mtkSettingsConfig.user.email = wc.session.user.email;
	
        // must provide config in production
        new MtkSettings(mtkSettingsConfig);
    }
}
