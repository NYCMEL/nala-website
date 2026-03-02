class MtkDialog {

    constructor() {
        this.root = null;
        this.config = null;
        this.focusableElements = [];
        this.firstFocusable = null;
        this.lastFocusable = null;

        this.waitForElement();
    }

    waitForElement() {
        const check = setInterval(() => {
            const el = document.querySelector("mtk-dialog.mtk-dialog");
            if (el && window.app && window.app.dialog) {
                clearInterval(check);
                this.root = el;
                this.config = window.app.dialog;
                this.init();
            }
        }, 50);
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.root.setAttribute("aria-label", this.config.ariaLabel);

        this.root.querySelector(".dialog-title").textContent = this.config.title;
        this.root.querySelector(".dialog-message").textContent = this.config.message;

        const buttonContainer = this.root.querySelector(".dialog-buttons");
        buttonContainer.innerHTML = "";

        this.config.buttons.forEach(btn => {
            const button = document.createElement("button");
            button.type = "button";
            button.classList.add("btn");

            if (btn.label === "Cancel") {
                button.className = "btn btn-link";
            } else {
                button.classList.add(btn.class);
            }

            button.textContent = btn.label;
            button.dataset.event = btn.event;

            buttonContainer.appendChild(button);
        });
    }

    bindEvents() {

        this.root.addEventListener("click", (e) => {
            const target = e.target.closest(".btn");
            if (!target) return;

            const eventName = target.dataset.event;

            wc.log("Publishing event:", eventName);
            wc.publish(eventName, { source: "mtk-dialog" });

            this.close();
        });

        this.root.querySelector(".dialog-backdrop")
            .addEventListener("click", () => this.close());

        document.addEventListener("keydown", (e) => {
            if (!this.root.classList.contains("open")) return;

            if (e.key === "Escape") {
                this.close();
            }

            if (e.key === "Tab") {
                this.trapFocus(e);
            }
        });
    }

    open() {
        this.root.classList.add("open");
        this.setFocusTrap();
    }

    close() {
        this.root.classList.remove("open");
    }

    setFocusTrap() {
        this.focusableElements = this.root.querySelectorAll("button");
        this.firstFocusable = this.focusableElements[0];
        this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

        if (this.firstFocusable) {
            this.firstFocusable.focus();
        }
    }

    trapFocus(e) {
        if (!this.firstFocusable || !this.lastFocusable) return;

        if (e.shiftKey) {
            if (document.activeElement === this.firstFocusable) {
                e.preventDefault();
                this.lastFocusable.focus();
            }
        } else {
            if (document.activeElement === this.lastFocusable) {
                e.preventDefault();
                this.firstFocusable.focus();
            }
        }
    }

    onMessage(message, data) {
        if (message === "dialog.open") {
            this.open();
        }

        if (message === "dialog.close") {
            this.close();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.dialog = new MtkDialog();
    wc.subscribe(dialog.onMessage.bind(dialog));
});
