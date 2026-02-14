/////////////////////////////////////////////////////////////////////////////////
//// Config
/////////////////////////////////////////////////////////////////////////////////
wc.apiURL = 'https://nala-test.com';

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

// INITIAL PAGE
wc.getSession(function (loggedIn, session, err) {
    if (err) return;
    
    if (0) {
	wc.timeout(function(){
	    MTKMsgs.show({
		type: 'success',
		icon: 'check_circle',
		message: 'Loading in progress. Please wait...',
		buttons: [],
		closable: false, // No X button
		timer: 3, // Auto-close after 5 seconds
		block: true
	    });
	}, 100, 1);
    }

    if (loggedIn) {
	wc.timeout(function(){
	    wc.log('IS LOGGED IN');
	    mtk_pager.show('dashboard');
	    
	    // SHOW PUBLIC HEADER
	    $(".app-header").hide(function() {
		$("#header-private").show();
	    });

	    alert("IN")
	}, 500, 1);
    } else {
	wc.timeout(function(){
	    wc.log('IS NOT LOGGED IN');
	    mtk_pager.show('home');
	    
	    // SHOW PUBLIC HEADER
	    $(".app-header").hide(function() {
		$("#header-public").show();
	    });

	    alert("OUT")
	}, 200, 1);
    }
});
