(function() {
    function waitForElement(selector, callback, interval, timeout) {
        interval = interval || 50;
        timeout  = timeout  || 5000;
        wc.log("hero: waitForElement...");

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

    function waitForGlobalVar(varName, callback, interval, timeout) {
        interval = interval || 50;
        timeout  = timeout  || 5000;
        wc.log("hero: waitForGlobalVar...");

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

    function applyHeroData(heroData) {
        const lhsTitle = document.querySelector("#MTK-hero .MTK-hero-title");
        const lhsDesc  = document.querySelector("#MTK-hero .MTK-hero-description");
        const rhsImg   = document.querySelector("#MTK-hero .MTK-hero-img");
        // Match button by both classes to be precise
        const ctaBtn   = document.querySelector("#MTK-hero .btn.btn-primary") ||
                         document.querySelector("#MTK-hero button");

        if (lhsTitle) lhsTitle.textContent = heroData.title;
        if (lhsDesc)  lhsDesc.textContent  = heroData.description;
        if (rhsImg)   rhsImg.src           = heroData.image;
        // Use config.cta (already i18n-resolved at config load time),
        // with i18n.t() as live fallback for language switches
        if (ctaBtn) {
            ctaBtn.textContent = heroData.cta ||
                (window.i18n ? window.i18n.t('hero.cta') : 'Get Started');
        }
    }

    function renderHero(container, heroData) {
        wc.log("hero: renderHero...");

        if (!container.innerHTML.trim()) {
            container.innerHTML = `
<div style="background:#e0e6fa!important;padding:25px;">
    <div class="container">
        <div class="row align-items-center MTK-hero-row">
            <div class="MTK-hero-lhs col-md-${heroData.lhsCol}">
                <div class="MTK-hero-card" style="background:transparent">
                    <h1 class="MTK-hero-title animate-fade-up">${heroData.title}</h1>
                    <p class="MTK-hero-description animate-fade-up">${heroData.description}</p>
                    <button class="btn btn-primary" data-i18n="hero.cta">${heroData.cta || (window.i18n ? window.i18n.t('hero.cta') : 'Get Started')}</button>
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

    function initHero(heroData) {
        wc.log("hero: initHero...");
        applyHeroData(heroData);

        const elements = document.querySelectorAll("#MTK-hero .animate-fade-up");
        setTimeout(() => { elements.forEach(el => el.classList.add("active")); }, 100);
    }

    waitForElement("#MTK-hero", function(container) {
        wc.log("hero: waitForElement...", app.hero);

        waitForGlobalVar("app", function(heroData) {
            renderHero(container, heroData);
            initHero(heroData);
        });
    });

    // Re-apply when language changes
    document.addEventListener('i18n:changed', function () {
        if (window.app && window.app.hero && window.app.hero[0]) {
            applyHeroData(window.app.hero[0]);
        }
    });
})();
