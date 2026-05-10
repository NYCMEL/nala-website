(function () {
    class MTKContact {
        constructor(root) {
            this.root = root;
            this.form = root.querySelector(".mtk-contact__form");
            this.status = root.querySelector(".mtk-contact__status");
            this.submitButton = root.querySelector(".mtk-contact__submit");
            this.prefill();
            this.bind();
        }

        prefill() {
            const user = (window.wc && wc.session && wc.session.user) ? wc.session.user : {};
            const name = this.form.querySelector('[name="name"]');
            const email = this.form.querySelector('[name="email"]');
            const phone = this.form.querySelector('[name="phone"]');
            if (name && !name.value) name.value = user.name || user.full_name || "";
            if (email && !email.value) email.value = user.email || "";
            if (phone && !phone.value) phone.value = user.phone || "";
        }

        bind() {
            if (!this.form) return;
            this.form.addEventListener("submit", (event) => {
                event.preventDefault();
                this.submit();
            });

            if (window.wc && typeof wc.subscribe === "function") {
                wc.subscribe("4-mtk-contact:sent", () => this.onSent());
                wc.subscribe("4-mtk-contact:error", () => this.onError());
            }
        }

        submit() {
            if (!this.form.reportValidity()) return;
            const formData = new FormData(this.form);
            const payload = {};
            formData.forEach((value, key) => {
                payload[key] = String(value || "").trim();
            });

            if (this.submitButton) this.submitButton.disabled = true;
            if (this.status) this.status.textContent = "Sending...";
            wc.publish("mtk-contact:submit", payload);
        }

        onSent() {
            if (this.submitButton) this.submitButton.disabled = false;
            if (this.status) this.status.textContent = "Message sent.";
            this.form.reset();
            this.prefill();
        }

        onError() {
            if (this.submitButton) this.submitButton.disabled = false;
            if (this.status) this.status.textContent = "Could not send the message. Please try again.";
        }
    }

    function boot() {
        document.querySelectorAll("mtk-contact.mtk-contact").forEach((root) => {
            if (root.dataset.bound === "1") return;
            root.dataset.bound = "1";
            new MTKContact(root);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }

    document.addEventListener("include:loaded", () => {
        setTimeout(boot, 0);
    });
})();
