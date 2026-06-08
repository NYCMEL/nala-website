(function () {
    class MTKContact {
        constructor(root) {
            this.root = root;
            this.form = root.querySelector(".mtk-contact__form");
            this.status = root.querySelector(".mtk-contact__status");
            this.submitButton = root.querySelector(".mtk-contact__submit");
            this.editor = root.querySelector("[data-message-editor]");
            this.messageInput = root.querySelector('[name="message"]');
            this.messageHtmlInput = root.querySelector('[name="messageHtml"]');
            this.attachmentsEl = root.querySelector("[data-attachments]");
            this.profileNote = root.querySelector("[data-profile-note]");
            this.images = [];
            this.prefill();
            this.bind();
        }

        profile() {
            const user = (window.wc && wc.session && wc.session.user) ? wc.session.user : {};
            let stored = {};
            try {
                stored = JSON.parse(localStorage.getItem("nala_profile_settings") || "{}") || {};
            } catch (err) {}
            const privacy = stored.privacy || {};
            return {
                name: privacy.fullName || user.name || user.full_name || "",
                email: privacy.emailAddress || user.email || "",
                phone: privacy.contactPhoneNumber || user.phone || user.phone_number || "",
                userId: user.id || user.user_id || user.nalaUID || ""
            };
        }

        prefill() {
            const profile = this.profile();
            const missing = [];
            if (!profile.name) missing.push("name");
            if (!profile.email) missing.push("email");
            if (!profile.phone) missing.push("phone");
            if (!this.profileNote) return;
            if (!missing.length) {
                this.profileNote.hidden = true;
                this.profileNote.innerHTML = "";
                return;
            }
            this.profileNote.hidden = false;
            this.profileNote.innerHTML = 'Your profile is missing ' + missing.join(", ") + '. <button type="button" data-open-profile>Fill in personal info</button>, or include those details in your message.';
        }

        bind() {
            if (!this.form) return;
            this.form.addEventListener("submit", (event) => {
                event.preventDefault();
                this.submit();
            });
            this.form.addEventListener("click", (event) => {
                const formatButton = event.target.closest("[data-format-command]");
                if (formatButton) {
                    event.preventDefault();
                    this.applyFormat(formatButton.getAttribute("data-format-command"));
                }
                if (event.target.closest("[data-open-profile]")) {
                    event.preventDefault();
                    window.__nalaSettingsTargetTab = "privacy";
                    if (window.wc && wc.pages && typeof wc.pages.show === "function") {
                        wc.pages.show("settings");
                    }
                }
            });
            this.form.addEventListener("input", () => this.syncMessage());
            const imageInput = this.root.querySelector("[data-image-input]");
            if (imageInput) {
                imageInput.addEventListener("change", () => this.addImages(imageInput.files || []));
            }

            if (window.wc && typeof wc.subscribe === "function") {
                wc.subscribe("4-mtk-contact:sent", () => this.onSent());
                wc.subscribe("4-mtk-contact:error", () => this.onError());
            }
        }

        applyFormat(command) {
            if (!this.editor) return;
            this.editor.focus();
            if (command === "createLink") {
                const url = window.prompt("Enter the link URL:");
                if (!url) return;
                document.execCommand(command, false, url);
            } else {
                document.execCommand(command, false, null);
            }
            this.syncMessage();
        }

        addImages(files) {
            Array.from(files).slice(0, 5 - this.images.length).forEach((file) => {
                if (!file.type.match(/^image\//)) return;
                const reader = new FileReader();
                reader.onload = () => {
                    const dataUrl = String(reader.result || "");
                    this.images.push({ name: file.name, type: file.type, size: file.size, dataUrl: dataUrl });
                    if (this.editor) {
                        const img = document.createElement("img");
                        img.src = dataUrl;
                        img.alt = file.name;
                        this.editor.appendChild(img);
                    }
                    this.renderAttachments();
                    this.syncMessage();
                };
                reader.readAsDataURL(file);
            });
        }

        renderAttachments() {
            if (!this.attachmentsEl) return;
            this.attachmentsEl.innerHTML = this.images.map((image) => '<span>' + this.escape(image.name) + '</span>').join("");
        }

        escape(value) {
            return String(value || "").replace(/[&<>"']/g, function (char) {
                return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
            });
        }

        syncMessage() {
            if (!this.editor) return;
            if (this.messageInput) this.messageInput.value = this.editor.textContent.trim();
            if (this.messageHtmlInput) this.messageHtmlInput.value = this.editor.innerHTML.trim();
        }

        submit() {
            this.syncMessage();
            if (this.messageInput && !this.messageInput.value.trim()) {
                if (this.status) this.status.textContent = "Please enter a message.";
                if (this.editor) this.editor.focus();
                return;
            }
            if (!this.form.reportValidity()) return;
            const formData = new FormData(this.form);
            const payload = {};
            formData.forEach((value, key) => {
                payload[key] = String(value || "").trim();
            });
            payload.profile = this.profile();
            payload.images = this.images;

            if (this.submitButton) this.submitButton.disabled = true;
            if (this.status) this.status.textContent = "Sending...";
            wc.publish("mtk-contact:submit", payload);
        }

        onSent() {
            if (this.submitButton) this.submitButton.disabled = false;
            if (this.status) this.status.textContent = "Message sent.";
            this.form.reset();
            if (this.editor) this.editor.innerHTML = "";
            this.images = [];
            this.renderAttachments();
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
