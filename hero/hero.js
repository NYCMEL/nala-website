(function() {
    // Utility: wait for an element to exist in the DOM
    function waitForElement(selector, callback, interval = 50, timeout = 5000) {
	wc.log("hero: waitForElement...")

	const startTime = Date.now();
	const timer = setInterval(() => {
	    const element = document.querySelector(selector);
	    if (element) {
		clearInterval(timer);
		callback(element);
	    } else if (Date.now() - startTime > timeout) {
		clearInterval(timer);
		console.warn(`MTK-hero: "${selector}" not found within ${timeout}ms`);
	    }
	}, interval);
    }

    // Utility: wait for a global variable to exist
    function waitForGlobalVar(varName, callback, interval = 50, timeout = 5000) {
	wc.log("hero: waitForGlobalVar...")

	const startTime = Date.now();
	const timer = setInterval(() => {
	    if (window[varName] && window[varName].hero?.length) {
		clearInterval(timer);
		callback(window[varName].hero[0]);
	    } else if (Date.now() - startTime > timeout) {
		clearInterval(timer);
		console.warn(`MTK-hero: "${varName}.hero" not found within ${timeout}ms`);
	    }
	}, interval);
    }

    // Inject hero HTML into container
    function renderHero(container, heroData) {
	wc.log("hero: renderHero...")

	// Only inject if container is empty
	if (!container.innerHTML.trim()) {
	    container.innerHTML = `
<div style="background:#e0e6fa!important;padding:25px;">
    <div class="container">
	<div class="row align-items-center MTK-hero-row">
            <div class="MTK-hero-lhs col-md-${heroData.lhsCol}">
		<div class="MTK-hero-card" style="background:transparent">
		    <h1 class="MTK-hero-title animate-fade-up">${heroData.title}</h1>
		    <p class="MTK-hero-description animate-fade-up">${heroData.description}</p>

		    <button class="btn btn-primary">Start Learning Today</button>
		    <button class="btn btn-outline-primary">Explore Courses</button>
		</div>
            </div>

            <div class="MTK-hero-rhs col-md-${heroData.rhsCol} text-center">
		<img class="MTK-hero-img img-fluid animate-fade-up" src="${heroData.image}" alt="Hero Image">
            </div>

	</div>
    </div>
</div>`;
	}
    }

    // Populate hero content and trigger animation
    function initHero(heroData) {
	wc.log("hero: initHero...")

	const lhsTitle = document.querySelector("#MTK-hero .MTK-hero-title");
	const lhsDesc = document.querySelector("#MTK-hero .MTK-hero-description");
	const rhsImg = document.querySelector("#MTK-hero .MTK-hero-img");

	if (lhsTitle) lhsTitle.textContent = heroData.title;
	if (lhsDesc) lhsDesc.textContent = heroData.description;
	if (rhsImg) rhsImg.src = heroData.image;

	// Animate after elements exist
	const elements = document.querySelectorAll("#MTK-hero .animate-fade-up");
	setTimeout(() => {
	    elements.forEach(el => el.classList.add("active"));
	}, 100);
    }

    // Wait for container and hero data before rendering
    waitForElement("#MTK-hero", function(container) {
	wc.log("hero: waitForElement...", app.hero)
	
	waitForGlobalVar("app", function(heroData) {
	    renderHero(container, heroData);
	    initHero(heroData);
	});
    });
})();
