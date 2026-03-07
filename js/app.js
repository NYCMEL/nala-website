/////////////////////////////////////////////////////////////////////////////////
//// APP CONFIG
/////////////////////////////////////////////////////////////////////////////////
window.app = window.app || {};

app.baseUrl  = "/repo_deploy/";
app.quizSize = 20; 

////////////////////////////////////////////////////////////
//// SMOOTH SCROLLING TO TARGET
////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////
//// RIPPLE
////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////
//// ADD RIPPLE EFFECT TO ALL BUTTONS
////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////
//// localhot. CHANGE BROWSER TITLE
////////////////////////////////////////////////////////////
if (document.location.protocol == "http:") {
    document.title = "NALA - Local";
}


// INITIAL PAGE
wc.getSession(function (loggedIn, session, err) {
    if (err) return;
    
    if (wc.working) {
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
	try {
	    wc.timeout(function(){
		wc.pages.show('dashboard');

		// SHOW PUBLIC HEADER
		$(".app-header").hide(function() {
		    $("#header-private").show();
		});
	    }, 200, 1);

	    wc.log('IS LOGGED IN');
	} catch(e) {
	    console.error(e.name + ' > ' + e.message);
	}
    } else {
	wc.log('IS NOT LOGGED IN');
	wc.pages.show('home');
	
	// SHOW PUBLIC HEADER
	$(".app-header").hide(function() {
	    $("#header-public").show();
	});
    }
});

function checkFooter() {
    const footer = document.getElementById("page-footer");
    if (!footer) return;

    function adjustFooter() {
	const docHeight = document.documentElement.scrollHeight;
	const viewportHeight = window.innerHeight;

	if (docHeight <= viewportHeight) {
	    footer.style.position = "fixed";
	    footer.style.bottom = "0";
	    footer.style.left = "0";
	    footer.style.width = "100%";
	} else {
	    footer.style.position = "static";
	}
    }

    // Run after layout is truly ready
    window.addEventListener("load", adjustFooter);
    window.addEventListener("resize", adjustFooter);

    // Extra safety: re-run after fonts/images
    setTimeout(adjustFooter, 50);
}
