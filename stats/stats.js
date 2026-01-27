/* _stats.js */

(function () {

    function initStats() {
        const container = document.getElementById("_stats-row");

        if (!container) return false;
        if (!window.app || !app.stats) return false;

        wc.log("_stats init:", window.app);

        let animated = false;

        function createStat(stat) {
            const col = document.createElement("div");
            col.className = "col-12 col-md-4 _stats-item";

            col.innerHTML = `
                <div class="_stats-value" data-target="${stat.value}">
                    0${stat.suffix || ""}
                </div>
                <div class="_stats-label">
                    ${stat.label}
                </div>
            `;

            return col;
        }

        function animateValue(el, target, suffix) {
            let current = 0;
            const duration = 1500;
            const stepTime = 20;
            const increment = target / (duration / stepTime);

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = Math.floor(current) + suffix;
            }, stepTime);
        }

        function animateStats() {
            if (animated) return;
            animated = true;

            const values = container.querySelectorAll("._stats-value");

            values.forEach(el => {
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.textContent.replace("0", "");
                animateValue(el, target, suffix);
            });
        }

        // Render stats
        app.stats.forEach(stat => {
            container.appendChild(createStat(stat));
        });

        // Observe visibility
        const statsWrapper = document.getElementById("_stats");
        if (!statsWrapper) return true;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.4 });

        observer.observe(statsWrapper);

        return true;
    }

    // Wait until #_stats-row exists
    const waitForStats = setInterval(() => {
        if (initStats()) {
            clearInterval(waitForStats);
        }
    }, 50);

})();
