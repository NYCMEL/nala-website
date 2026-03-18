window.app = window.app || {};

// Helper — works whether i18n has loaded yet or not
function _t(key, fallback) {
    return (window.i18n ? i18n.t(key) : null) || fallback;
}

window.app['mtk-login'] = {
    title: _t('login.title', 'Welcome Back'),
    email: {
	label:       _t('login.email.label',       'Email'),
	placeholder: _t('login.email.placeholder', 'Enter your email'),
	required: true
    },
    password: {
	label:       _t('login.password.label',       'Password'),
	placeholder: _t('login.password.placeholder', 'Enter your password'),
	required: true
    },
    submit: {
	label: _t('login.submit', 'Login')
    },
    links: {
	forgotPassword: _t('login.forgot',   'Forgot Password?'),
	register:       _t('login.register', "Don't have an account? Register")
    },
    forgotPassword: {
	title:            _t('login.forgot.title',     'Reset Your Password'),
	emailLabel:       _t('login.forgot.emailLabel','Please provide email used to login with NALA'),
	emailPlaceholder: _t('login.forgot.placeholder','Enter your email'),
	helpText:         _t('login.forgot.helpText',  'After submitting your email, we will send you a link to update/reset your password'),
	submitLabel:      _t('login.forgot.submit',    'Submit'),
	cancelLabel:      _t('login.forgot.cancel',    'Cancel')
    },
    events: {
	submit:              'mtk-login-submit',
	forgotPassword:      'mtk-login-forgot',
	forgotPasswordSubmit:'mtk-login-forgot-submit',
	register:            'mtk-login-register',
	focusChange:         'mtk-login-focus'
    }
};

// Re-apply if language changes after this script ran
document.addEventListener('i18n:changed', function() {
    var cfg = window.app['mtk-login'];
    if (!cfg) return;

    // 1. Update config object
    cfg.title                           = i18n.t('login.title');
    cfg.email.label                     = i18n.t('login.email.label');
    cfg.email.placeholder               = i18n.t('login.email.placeholder');
    cfg.password.label                  = i18n.t('login.password.label');
    cfg.password.placeholder            = i18n.t('login.password.placeholder');
    cfg.submit.label                    = i18n.t('login.submit');
    cfg.links.forgotPassword            = i18n.t('login.forgot');
    cfg.links.register                  = i18n.t('login.register');
    cfg.forgotPassword.title            = i18n.t('login.forgot.title');
    cfg.forgotPassword.emailLabel       = i18n.t('login.forgot.emailLabel');
    cfg.forgotPassword.emailPlaceholder = i18n.t('login.forgot.placeholder');
    cfg.forgotPassword.helpText         = i18n.t('login.forgot.helpText');
    cfg.forgotPassword.submitLabel      = i18n.t('login.forgot.submit');
    cfg.forgotPassword.cancelLabel      = i18n.t('login.forgot.cancel');

    // 2. Re-render DOM — mirrors MTKLogin.render() in mtk-login.js
    var loginEl = document.querySelector('mtk-login');
    if (!loginEl) return;
    var titleEl    = loginEl.querySelector('.mtk-login-title');
    var emailEl    = loginEl.querySelector('#mtk-email');
    var passwordEl = loginEl.querySelector('#mtk-password');
    var submitBtn  = loginEl.querySelector('button[type="submit"]');
    var forgotLink = loginEl.querySelector('.forgot-password');
    var regLink    = loginEl.querySelector('.register');
    if (titleEl)    titleEl.textContent                        = cfg.title;
    if (emailEl) {
        emailEl.placeholder                                    = cfg.email.placeholder;
        if (emailEl.previousElementSibling) emailEl.previousElementSibling.textContent = cfg.email.label;
    }
    if (passwordEl) {
        passwordEl.placeholder                                 = cfg.password.placeholder;
        if (passwordEl.previousElementSibling) passwordEl.previousElementSibling.textContent = cfg.password.label;
    }
    if (submitBtn)  submitBtn.textContent                      = cfg.submit.label;
    if (forgotLink) forgotLink.textContent                     = cfg.links.forgotPassword;
    if (regLink)    regLink.textContent                        = cfg.links.register;
});
