(function () {

    function renderStats() {
        const row     = document.getElementById("_stats-row");
        const wrapper = document.getElementById("_stats");

        if (!row || !wrapper) return false;
        if (!window.app || !app.stats) return false;

        wc.log("_stats init:", app.stats);
        row.innerHTML = "";

        function createStat(stat) {
            const col = document.createElement("div");
            col.className = "col-12 col-md-4 _stats-item";
            col.setAttribute("data-stat-id", stat.id);

            col.innerHTML = `
                <div class="_stats-value"
                     data-target="${stat.value}"
                     data-suffix="${stat.suffix || ""}">
                    0
                </div>
                <div class="_stats-label">${stat.label}</div>
            `;
            return col;
        }

        function animateValue(el, target, suffix) {
            const duration = 1500;
            const startTime = performance.now();

            function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const value    = Math.floor(progress * target);
                el.textContent = value + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
        }

        function animateStats() {
            row.querySelectorAll("._stats-value").forEach(el => {
                animateValue(
                    el,
                    parseInt(el.dataset.target, 10),
                    el.dataset.suffix
                );
            });
        }

        app.stats.forEach(stat => row.appendChild(createStat(stat)));

        // Observe when stats wrapper is visible — animate once
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.4 });

        observer.observe(wrapper);

        return true;
    }

    // Initial render
    const wait = setInterval(() => {
        if (renderStats()) clearInterval(wait);
    }, 50);

    // Re-render labels when language changes (no re-animation)
    document.addEventListener('i18n:changed', function () {
        if (!window.app || !app.stats) return;
        const row = document.getElementById("_stats-row");
        if (!row) return;
        app.stats.forEach(function (stat) {
            const col   = row.querySelector('[data-stat-id="' + stat.id + '"]');
            const label = col && col.querySelector('._stats-label');
            if (label) label.textContent = stat.label;
        });
    });

})();
