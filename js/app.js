/////////////////////////////////////////////////////////////////////////////////
//// APP CONFIG
/////////////////////////////////////////////////////////////////////////////////
window.app = window.app || {};

app.baseUrl  = "/repo_deploy/";
app.quizSize = 20; 

// Message storage
app.emsgs = [
    { id: 1000, text: "Wrong 'Email' or 'Password' combination" },
    { id: 1001, text: "Create user failed" },
    { id: 1002, text: "No questions found for module" },
    { id: 1003, text: "Registeration Failed!" },
];

app.emsg = function (id) {
    const msg = this.emsgs.find(m => m.id === id);
    if (!msg) return `Error(${id}): Message not found`;
    return `Error(${id}): ${msg.text}`;
};
// let msg = app.emsg(1000);

// ADD RIPPLE EFFECT TO ALL BUTTONS
(function applyRippleToButtons() {
    function addRipple(root = document) {
	root.querySelectorAll("button:not(.mtk-ripple)").forEach(btn => {
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
