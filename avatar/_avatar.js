(function () {
    "use strict";

    function initAvatar(avatarElement, config) {
	if (!avatarElement) return;

	const front = avatarElement.querySelector("._avatar-front");
	const back = avatarElement.querySelector("._avatar-back");

	// Populate front
	front.querySelector("._avatar-title").innerHTML = config.front.title;
	front.querySelector("._avatar-body").innerHTML = config.front.body;
	if (config.front.bgColor) front.style.backgroundColor = config.front.bgColor;
	if (config.front.textColor) front.style.color = config.front.textColor;
	if (config.front.image) front.querySelector("._avatar-img").src = config.front.image;

	if (config.flip && config.back) {
	    // Populate back
	    back.querySelector("._avatar-title").innerHTML = config.back.title;
	    back.querySelector("._avatar-body").innerHTML = config.back.body;
	    if (config.back.bgColor) back.style.backgroundColor = config.back.bgColor;
	    if (config.back.textColor) back.style.color = config.back.textColor;
	    if (config.back.image) back.querySelector("._avatar-img").src = config.back.image;

	    // Flip events
	    front.addEventListener("mouseenter", () => avatarElement.classList.add("is-flipped"));
	    front.addEventListener("click", () => avatarElement.classList.add("is-flipped"));
	    avatarElement.addEventListener("mouseleave", () => avatarElement.classList.remove("is-flipped"));
	} else {
	    back.style.display = "none";
	}
    }

    function observeAvatars(config) {
	const observer = new MutationObserver((mutations) => {
	    mutations.forEach((mutation) => {
		mutation.addedNodes.forEach((node) => {
		    if (node.nodeType === 1 && node.id && node.id.startsWith("_avatar")) {
			initAvatar(node, config);
		    } else if (node.nodeType === 1) {
			// check descendants
			const avatars = node.querySelectorAll("._avatar");
			avatars.forEach((av) => initAvatar(av, config));
		    }
		});
	    });
	});

	observer.observe(document.body, {
	    childList: true,
	    subtree: true
	});

	// Also initialize any avatars already in DOM
	const existingAvatars = document.querySelectorAll("._avatar");
	existingAvatars.forEach((av) => initAvatar(av, config));
    }

    function start() {
	if (!window.app || !window.app.avatar) {
	    console.error("_avatar config not found in window.app.avatar");
	    return;
	}
	observeAvatars(window.app.avatar);
    }

    if (document.readyState === "complete") {
	start();
    } else {
	window.addEventListener("load", start);
    }
})();
