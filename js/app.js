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
    { id: 1000, text: "Unable to sign in with those credentials." },
    { id: 1001, text: "Could not create the account. Please try again." },
    { id: 1002, text: "No questions found for module" },
    { id: 1003, text: "Registration failed. Please try again." },
];

app.emsg = function (id) {
    const msg = this.emsgs.find(m => m.id === id);
    if (!msg) return "Something went wrong. Please try again.";
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

// localhot. CHANGE BROWSER TITLE
if (document.location.protocol == "http:") {
    document.title = "NALA - Local";
}
