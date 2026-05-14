/////////////////////////////////////////////////////////////////////////////////
//// APP CONFIG
/////////////////////////////////////////////////////////////////////////////////
window.app = window.app || {};

app.baseUrl  = (function () {
    const path = window.location.pathname || "/";
    const basePath = path.replace(/[^/]*$/, "");
    return basePath && basePath.endsWith("/") ? basePath : (basePath || "/") + "/";
})();
app.quizSize = 20; 

// Message storage
app.emsgs = [
    { id: 1000, text: "Unable to sign in with those credentials.", key: "login.error.credentials" },
    { id: 1001, text: "Could not create the account. Please try again.", key: "account.error.create" },
    { id: 1002, text: "No questions found for module" },
    { id: 1003, text: "Registration failed. Please try again.", key: "register.error.server" },
];

app.emsg = function (id) {
    const msg = this.emsgs.find(m => m.id === id);
    if (!msg) {
        return window.i18n && typeof window.i18n.t === "function"
            ? window.i18n.t("error.generic")
            : "Something went wrong. Please try again.";
    }
    if (msg.key && window.i18n && typeof window.i18n.t === "function") {
        const value = window.i18n.t(msg.key);
        if (value && value !== msg.key) return value;
    }
    return msg.text;
};
// let msg = app.emsg(1000);

////////////////////////////////////////////////////////////
// SMOOTH SCROLLING TO TARGET
(function () {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener("click", function (e) {
	const link = e.target.closest('a[href^="#"]');
	if (!link) return;

	const targetId = link.getAttribute("href");
	if (!targetId || targetId === "#") return;

	const targetEl = document.querySelector(targetId);
	if (!targetEl) return;

	e.preventDefault();

	const yOffset = -80; // adjust if you have a fixed header
	const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;

	window.scrollTo({
	    top: y,
	    behavior: prefersReducedMotion ? "auto" : "smooth"
	});
    });
})();

document.addEventListener("click", function (e) {
    const target = e.target.closest(".mtk-ripple");
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.className = "mtk-ripple-wave";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    target.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
	ripple.remove();
    });
});

// ADD RIPPLE EFFECT TO ALL BUTTONS
(function applyRippleToButtons() {
    function addRipple(root = document) {
	root.querySelectorAll("button:not(.mtk-ripple):not(.mtk-biab__tab-btn):not(.mtk-biab__sidebar-item-btn):not(.mtk-biab__sidebar-menu-header)").forEach(btn => {
	    btn.classList.add("mtk-ripple");
	});
    }

    function startObserver() {
	// Guard: document.body must exist before observing
	if (!document.body) return;

	// Initial pass
	addRipple();

	// Watch for future buttons
	const observer = new MutationObserver(mutations => {
	    mutations.forEach(mutation => {
		mutation.addedNodes.forEach(node => {
		    if (node.nodeType !== 1) return;

		    if (node.tagName === "BUTTON") {
			// Skip mtk-biab buttons
			if (!node.closest('.mtk-biab')) {
			    node.classList.add("mtk-ripple");
			}
		    } else {
			addRipple(node);
		    }
		});
	    });
	});

	observer.observe(document.body, {
	    childList: true,
	    subtree: true
	});
    }

    // If body is already available, start immediately
    // Otherwise wait for DOMContentLoaded
    if (document.body) {
	startObserver();
    } else {
	document.addEventListener("DOMContentLoaded", startObserver);
    }
})();

// Phone fields: format US numbers as (123) 245-1234 while keeping foreign numbers usable.
(function setupPhoneFormatting() {
    function clean(value) {
        return String(value || "").replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
    }

    function formatForeign(digits) {
        if (!digits) return "";
        const country = digits.slice(0, Math.min(3, digits.length));
        const rest = digits.slice(country.length);
        const parts = [];
        for (let i = 0; i < rest.length; i += 4) {
            parts.push(rest.slice(i, i + 4));
        }
        return ("+" + country + (parts.length ? " " + parts.join(" ") : "")).trim();
    }

    function formatPhone(value) {
        const raw = clean(value);
        if (!raw) return "";

        const hasPlus = raw.charAt(0) === "+";
        const digits = raw.replace(/\D/g, "");

        if ((!hasPlus && digits.length <= 10) || digits.length === 10) {
            if (digits.length <= 3) return digits;
            if (digits.length <= 6) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
            return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6, 10);
        }

        if ((hasPlus && digits.charAt(0) === "1" && digits.length === 11) || (!hasPlus && digits.charAt(0) === "1" && digits.length === 11)) {
            return "+1 (" + digits.slice(1, 4) + ") " + digits.slice(4, 7) + "-" + digits.slice(7, 11);
        }

        if (hasPlus) {
            return formatForeign(digits);
        }

        const parts = [];
        for (let i = 0; i < digits.length; i += 3) {
            parts.push(digits.slice(i, i + 3));
        }
        return parts.join(" ");
    }

    function isValidPhone(value) {
        const digits = String(value || "").replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15 && /^[+\d().\-\s]+$/.test(String(value || "").trim());
    }

    function shouldFormat(input) {
        if (!input || input.dataset.nalaPhoneFormatted === "true") return false;
        const type = String(input.getAttribute("type") || "").toLowerCase();
        const name = String(input.getAttribute("name") || input.id || input.className || "").toLowerCase();
        return type === "tel" || name.indexOf("phone") !== -1 || input.classList.contains("phone");
    }

    function attach(root) {
        const scope = root && root.querySelectorAll ? root : document;
        Array.prototype.forEach.call(scope.querySelectorAll("input"), function (input) {
            if (!shouldFormat(input)) return;
            input.dataset.nalaPhoneFormatted = "true";
            input.setAttribute("inputmode", "tel");
            if (!input.getAttribute("autocomplete")) input.setAttribute("autocomplete", "tel");
            const sync = function () {
                const next = formatPhone(input.value);
                if (next !== input.value) input.value = next;
            };
            input.addEventListener("input", sync);
            input.addEventListener("blur", sync);
            sync();
        });
    }

    window.nalaPhone = {
        format: formatPhone,
        isValid: isValidPhone,
        attach: attach
    };

    function start() {
        attach(document);
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) attach(node);
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.body) {
        start();
    } else {
        document.addEventListener("DOMContentLoaded", start);
    }
})();

// localhot. CHANGE BROWSER TITLE
if (document.location.protocol == "http:") {
    document.title = "NALA - Local";
}
