/**
 * mtk-settings Component
 * Material Design Settings/Profile Component
 */

if (typeof MtkSettings === 'undefined') {
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
            if (wc.testing) {
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
            if (this.config.labels && this.config.labels.title) {
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
            this.elements.updateBtn.addEventListener('click', () => this.sendResetLink());
            this.elements.saveBtn.addEventListener('click', () => this.sendResetLink());
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
            this.sendResetLink();
	}

        showMessage(type, message) {
            if (typeof MTKMsgs !== 'undefined' && MTKMsgs.show) {
                MTKMsgs.show({
                    type: type,
                    icon: type === 'success' ? 'success' : 'error',
                    message: message,
                    closable: true,
                    timer: 10
                });
                return;
            }
            if (type === 'error') {
                alert(message);
            } else {
                console.log(message);
            }
        }

        sendResetLink() {
            const emailEl = this.elements && this.elements.email ? this.elements.email : null;
            const email = String(emailEl ? emailEl.value : '').trim().toLowerCase();
            if (!email) {
                this.showMessage('error', 'No account email found for password reset.');
                return;
            }

            fetch(wc.apiURL + '/api/forgot_password.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            }).then((res) => {
                return res.json().catch(() => ({})).then((json) => {
                    if (!res.ok) {
                        throw new Error((json && (json.error || json.message)) || 'Could not send reset link.');
                    }
                    return json;
                });
            }).then(() => {
                this.showMessage('success', 'Password reset email sent. Please check your inbox.');
                wc.publish('4-mtk-settings', {
                    action: 'password_reset_link_sent',
                    success: true,
                    email: email,
                    timestamp: new Date().toISOString()
                });
                this.exitEditMode();
            }).catch((err) => {
                this.showMessage('error', err.message || 'Could not send reset link.');
                wc.publish('4-mtk-settings', {
                    action: 'password_reset_link_sent',
                    success: false,
                    email: email,
                    timestamp: new Date().toISOString()
                });
            });
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
	if (wc.testing) {
            new MtkSettings(); // uses window.mtkSettingsConfig
	} else {
            // must provide config in production
            new MtkSettings(wc.mtkSettingsConfig);
	}
    }

    if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initMtkSettings);
    } else {
	if (wc.testing) {
            new MtkSettings(); // uses window.mtkSettingsConfig
	} else {
	    mtkSettingsConfig.user.firstName = wc.session.user.name;
	    mtkSettingsConfig.user.email = wc.session.user.email;
	    
            // must provide config in production
            new MtkSettings(mtkSettingsConfig);
	}
    }
}
