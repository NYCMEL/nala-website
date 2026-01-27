(function () {
    function initMTKComponent() {
	if (!window.app || !window.app.ready) return;

	const root = document.getElementById("mtk-root");
	if (!root) return;

	fetch("./ready/ready.html")
	    .then(res => res.text())
	    .then(html => {
		root.innerHTML = html;

		const data = window.app.ready;
		const component = root.querySelector(".mtk-cta");

		component.querySelector(".mtk-title").textContent = data.headline;
		component.querySelector(".mtk-subtitle").textContent = data.subheadline;
		const btn = component.querySelector(".mtk-btn");
		btn.textContent = data.ctaText;
		btn.href = data.ctaLink;

		requestAnimationFrame(() => {
		    component.classList.add("is-visible");
		});
	    });
    }

    if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initMTKComponent);
    } else {
	initMTKComponent();
    }
})();
