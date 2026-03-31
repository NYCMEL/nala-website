/**
 * mtk-final.js
 * Certificate email selection component.
 * Manual send only.
 */

(function () {
'use strict';

const CONFIG = {
    apiEndpoint: '/api/issueCertificate.php?v=2'
};

const DEFAULT_FINAL_CONFIG = {
    strings: {
        successHeading: 'Congratulations!',
        successSubheading: 'You have successfully completed the course.',
        currentEmailLabel: 'Your current email address',
        currentEmail: '',
        optionKeep: 'Send certificate to my current email',
        optionNew: 'Send certificate to a different email',
        newEmailLabel: 'New email address',
        newEmailHint: 'Enter a valid email address',
        confirmEmailLabel: 'Confirm new email address',
        confirmEmailHint: 'Re-enter your new email address',
        submitLabel: 'Send My Certificate',
        successToast: 'Certificate sent! Check your inbox.',
        requiredError: 'This field is required.',
        invalidEmailError: 'Please enter a valid email address.',
        mismatchError: 'Email addresses do not match.',
        matchConfirmed: 'Emails match!'
    }
};

class MtkFinal {

    constructor(root){
        this.root = root;
        this.choice = 'keep';
        this.noticeEl = null;
        this.config = {
            ...DEFAULT_FINAL_CONFIG,
            ...(window.MTK_FINAL_CONFIG || {}),
            strings: {
                ...DEFAULT_FINAL_CONFIG.strings,
                ...((window.MTK_FINAL_CONFIG && window.MTK_FINAL_CONFIG.strings) || {})
            }
        };
        this.init();
    }

    init(){
        this.populateStrings();
        this.setCurrentEmail();
        this.bindEvents();
    }

    populateStrings(){
        const strings = this.config && this.config.strings ? this.config.strings : {};
        if (!strings) return;

        this.root.querySelectorAll('[data-mtk]').forEach((el) => {
            const key = el.getAttribute('data-mtk');
            if (!key || typeof strings[key] === 'undefined') return;
            el.textContent = strings[key];
        });
    }

    setCurrentEmail(){
        const sessionEmail = (
            window.wc &&
            wc.session &&
            wc.session.user &&
            wc.session.user.email
        ) ? wc.session.user.email : '';

        if (!sessionEmail) return;

        this.root.querySelectorAll('[data-mtk-desc="currentEmail"], [data-mtk="currentEmail"]').forEach((el) => {
            el.textContent = sessionEmail;
        });

        if (
            window.wc &&
            wc.session &&
            wc.session.user &&
            wc.session.user.email
        ) {
            this.config.user = this.config.user || {};
            this.config.user.currentEmail = sessionEmail;
        }
    }

    bindEvents(){
        const radios = this.root.querySelectorAll('.mtk-final__radio');
        radios.forEach(radio => {
            radio.addEventListener('change', e => this.onRadioChange(e));
        });

        const form = this.root.querySelector('.mtk-final__form');
        if (form) {
            form.addEventListener('submit', e => this.onSubmit(e));
        }
    }

    onRadioChange(e){
        const value = e.target.value;
        this.choice = value;

        const panel = this.root.querySelector('#mtk-new-email-panel');
        if (!panel) return;

        if (value === 'new') {
            panel.classList.add('mtk-final__new-email-panel--open');
        } else {
            panel.classList.remove('mtk-final__new-email-panel--open');
        }
    }

    async onSubmit(e){
        e.preventDefault();
        try {
            await this.issueCertificateFromSelection();
        } catch (err) {
            // issueCertificateFromSelection already shows the user-facing error
            if (window.console && typeof console.warn === 'function') {
                console.warn('Certificate send failed', err);
            }
        }
    }

    getEmail(){
        if (this.choice === 'keep') {
            if (
                window.wc &&
                wc.session &&
                wc.session.user &&
                wc.session.user.email
            ) {
                return wc.session.user.email;
            }
            return '';
        }

        const emailInput = this.root.querySelector('#mtk-input-email1');
        return emailInput ? emailInput.value.trim() : '';
    }

    getUserName(){
        if (window.wc && wc.session && wc.session.user) {
            if (wc.session.user.name) {
                return wc.session.user.name;
            }
            if (wc.session.user.full_name) {
                return wc.session.user.full_name;
            }
        }
        return '';
    }

    extractErrorMessage(data){
        if (!data || typeof data !== 'object') {
            return 'Certificate request failed';
        }

        const details = data.details;
        if (typeof details === 'string' && details.trim()) {
            return details;
        }

        if (details && typeof details === 'object') {
            const certifierResponse = details.certifier_response || {};
            const certifierErrors = Array.isArray(certifierResponse.errors) ? certifierResponse.errors : [];
            const firstCertifierError = certifierErrors.length ? certifierErrors[0] : null;
            const nestedMessage =
                certifierResponse.message ||
                certifierResponse.error ||
                (firstCertifierError && (
                    firstCertifierError.message ||
                    firstCertifierError.error ||
                    firstCertifierError.detail ||
                    firstCertifierError.title
                )) ||
                details.error ||
                details.message ||
                details.raw_body;

            if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
                return nestedMessage;
            }

            if (firstCertifierError && typeof firstCertifierError === 'object') {
                const summarized = Object.values(firstCertifierError).find((value) => typeof value === 'string' && value.trim());
                if (summarized) {
                    return summarized;
                }
            }

            if (Array.isArray(certifierResponse.details) && certifierResponse.details.length) {
                const firstDetail = certifierResponse.details[0];
                if (typeof firstDetail === 'string' && firstDetail.trim()) {
                    return firstDetail;
                }
                if (firstDetail && typeof firstDetail === 'object') {
                    const summarized = Object.values(firstDetail).find((value) => typeof value === 'string' && value.trim());
                    if (summarized) {
                        return summarized;
                    }
                }
            }

            if (typeof details.http_code === 'number') {
                return `Certificate request failed (HTTP ${details.http_code})`;
            }
        }

        const topLevelMessage = data.error || data.message;
        if (typeof topLevelMessage === 'string' && topLevelMessage.trim()) {
            return topLevelMessage;
        }

        return 'Certificate request failed';
    }

    async issueCertificate(email, name){
        const res = await fetch(CONFIG.apiEndpoint, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                name: name
            })
        });

        const raw = await res.text();

        let data = {};
        try {
            data = raw ? JSON.parse(raw) : {};
        } catch (err) {
            throw new Error('Backend did not return valid JSON. Response was: ' + raw);
        }

        if (!res.ok || data.error) {
            throw new Error(this.extractErrorMessage(data));
        }

        return data;
    }

    async issueCertificateFromSelection(){
        const btn = this.root.querySelector('.mtk-final__submit');
        if (btn) btn.classList.add('mtk-final__submit--loading');

        try {
            const email = this.getEmail();
            const name = this.getUserName();

            if (!email) {
                throw new Error('Missing certificate email');
            }

            const result = await this.issueCertificate(email, name);

            if (result.alreadyIssued) {
                this.showPersistentNotice(
                    `A certificate has already been sent to ${email}. Please check your inbox and spam folder.`
                );
            } else {
                this.showPersistentNotice(
                    `Your certificate was sent to ${email}. If you do not receive it within a few minutes, please check your spam folder.`
                );
            }

            return result;
        } catch (err) {
            alert(err.message || 'Could not send certificate');
            return null;
        } finally {
            if (btn) btn.classList.remove('mtk-final__submit--loading');
        }
    }

    showPersistentNotice(message){
        if (!this.noticeEl) {
            const box = document.createElement('div');
            box.className = 'mtk-final__persistent-notice';
            box.style.marginTop = '16px';
            box.style.padding = '14px 16px';
            box.style.background = '#e8f4ff';
            box.style.border = '1px solid #9ac7f7';
            box.style.borderRadius = '10px';
            box.style.color = '#123';
            box.style.position = 'relative';
            box.style.lineHeight = '1.5';
            box.style.fontSize = '14px';

            const text = document.createElement('div');
            text.className = 'mtk-final__persistent-notice-text';
            text.style.paddingRight = '32px';

            const close = document.createElement('button');
            close.type = 'button';
            close.setAttribute('aria-label', 'Close message');
            close.innerHTML = '&times;';
            close.style.position = 'absolute';
            close.style.top = '8px';
            close.style.right = '10px';
            close.style.border = '0';
            close.style.background = 'transparent';
            close.style.fontSize = '24px';
            close.style.lineHeight = '1';
            close.style.cursor = 'pointer';
            close.style.color = '#345';

            close.addEventListener('click', () => {
                box.remove();
                this.noticeEl = null;
            });

            box.appendChild(text);
            box.appendChild(close);

            const anchor =
                this.root.querySelector('.mtk-final__form') ||
                this.root.querySelector('#mtk-toast')?.parentNode ||
                this.root;

            anchor.appendChild(box);
            this.noticeEl = box;
        }

        const textEl = this.noticeEl.querySelector('.mtk-final__persistent-notice-text');
        if (textEl) {
            textEl.textContent = message;
        }
    }

}

function init(){
    const el = document.querySelector('mtk-final.mtk-final');
    if (!el) return;
    if (el._mtkFinalInstance) return;
    el._mtkFinalInstance = new MtkFinal(el);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();
