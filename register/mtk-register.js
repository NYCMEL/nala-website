/* mtk-register.js */

class MtkRegister extends HTMLElement {

    constructor() {
        super();
        this.config = window.mtkRegisterConfig;
    }

    connectedCallback() {
        if (!this.config) return;

        this.form = this.querySelector("form");
        this.titleEl = this.querySelector(".mtk-register-title");

        this.titleEl.innerHTML = this.config.title;

        this.populateFields();
        this.bindEvents();
    }

    populateFields() {
        Object.values(this.config.fields).forEach(field => {
            const input = this.querySelector(`#${field.id}`);
            const helper = input.nextElementSibling.nextElementSibling;

            input.value = field.value || "";
            input.placeholder = " ";

            if (field.helper) {
                helper.textContent = field.helper;
            }
        });
    }

    bindEvents() {
        this.form.addEventListener("submit", e => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const payload = {};
        let firstInvalid = null;

        Object.values(this.config.fields).forEach(field => {
            const input = this.querySelector(`#${field.id}`);
            const value = input.value.trim();

            if (field.required && !value && !firstInvalid) {
                firstInvalid = input;
            }

            payload[field.id] = value;
        });

        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

	let msg = ("mtk-register:submit", payload); wc.log(msg);
        wc.publish(msg);
    }
}

customElements.define("mtk-register", MtkRegister);
