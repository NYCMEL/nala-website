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

    function showRegister() {
	const pagesShell = document.getElementById('mtk-pages') || document.querySelector('mtk-pages');
	if (pagesShell && typeof pagesShell.show === 'function') {
	    pagesShell.show('register');
	    return;
	}

	if (window.wc && wc.pages && typeof wc.pages.show === 'function') {
	    wc.pages.show('register');
	    return;
	}

	if (typeof window.nalaShowRegister === 'function') {
	    window.nalaShowRegister();
	    return;
	}

	window.location.hash = 'register';
    }

    function renderHeroImageCarousel(heroData) {
	const rhs = document.querySelector("#MTK-hero .MTK-hero-rhs");
	if (!rhs || !Array.isArray(heroData.images) || !heroData.images.length) return;
	const registerLabel = window.i18n ? i18n.t("hero.registerAria") : "Register for NALA";

	rhs.innerHTML = `
	    <button class="MTK-hero-carousel" type="button" aria-label="${registerLabel}">
		${heroData.images.map(function(image, index) {
		    const position = image.position || "center center";
		    const fit = image.fit || "cover";
		    const background = image.background ? `background-color: ${image.background};` : "";
		    const active = index === 0 ? ' is-active' : '';
		    if (image.frame) {
			return `
			    <span class="MTK-hero-carousel__image MTK-hero-carousel__image--framed${active}" role="img" aria-label="${image.alt || 'NALA training'}" style="${background} --hero-frame-image: url('${image.src}');">
				<span class="MTK-hero-carousel__frame-bg" aria-hidden="true"></span>
				<img class="MTK-hero-carousel__frame-img" src="${image.src}" alt="" aria-hidden="true" style="object-position: ${position}; object-fit: ${fit};">
			    </span>`;
		    }
		    return `<img class="MTK-hero-carousel__image${active}" src="${image.src}" alt="${image.alt || 'NALA training'}" style="object-position: ${position}; object-fit: ${fit}; ${background}">`;
		}).join('')}
	    </button>
	`;

	const carousel = rhs.querySelector(".MTK-hero-carousel");
	const images = Array.from(rhs.querySelectorAll(".MTK-hero-carousel__image"));
	let activeIndex = 0;

	carousel.addEventListener("click", showRegister);

	if (images.length < 2) return;
	window.setInterval(function() {
	    images[activeIndex].classList.remove("is-active");
	    activeIndex = (activeIndex + 1) % images.length;
	    images[activeIndex].classList.add("is-active");
	}, heroData.carouselInterval || 3600);
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
	renderHeroImageCarousel(heroData);

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
