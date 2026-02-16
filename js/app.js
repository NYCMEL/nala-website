/////////////////////////////////////////////////////////////////////////////////
//// APP CONFIG
/////////////////////////////////////////////////////////////////////////////////
window.app = window.app || {};

/************************************************************
 * CONFIG INACTIVITY TIMER
 ************************************************************/
wc.inactivity = {
    idleTime: 2 * 60 * 1000, /* one minute */
    countdown: 40 /* 30 seconds countdown */
};

wc.working       = false;
app.baseUrl      = "/repo_deploy/";
wc.isLocal       = true; /* = true SHOULD USE ALL LOCAL CONFIG FILES */
wc.productionURL = "https://nala-test.com" || "https://nalanetwork.com";
wc.apiURL        = wc.productionURL;

// START TRACKING. COMMENT TO BYPASS
wc.startInactivityTracking();

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
	root.querySelectorAll("button:not(.mtk-ripple)").forEach(btn => {
	    btn.classList.add("mtk-ripple");
	});
    }

    // Initial pass
    addRipple();

    // Watch for future buttons
    const observer = new MutationObserver(mutations => {
	mutations.forEach(mutation => {
	    mutation.addedNodes.forEach(node => {
		if (node.nodeType !== 1) return;

		if (node.tagName === "BUTTON") {
		    node.classList.add("mtk-ripple");
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
})();

// localhot. CHANGE BROWSER TITLE
if (document.location.protocol == "http:") {
    document.title = "NALA - Local";
}
