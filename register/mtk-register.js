/* mtk-register.js */

class MTKRegister extends HTMLElement {

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

        const email = this.querySelector("#email");
        const email2 = this.querySelector("#email2");

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

        if (email.value.trim() !== email2.value.trim()) {
            email2.focus();
            email2.value = "";
            wc.publish("mtk-register:error", {
                error: "Emails do not match"
            });
            return;
        }

	let data = payload;
	let msg = "mtk-register:submit";
	wc.log(msg, data);
        wc.publish(msg, data);
    }
}

customElements.define("mtk-register", MTKRegister);
