(function () {
    function ready(selector, callback) {
        var interval = setInterval(function () {
            var el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            }
        }, 50);
    }

    function waitForData(callback) {
        var interval = setInterval(function () {
            if (window.app && window.app.courses) {
                clearInterval(interval);
                callback(window.app.courses);
            }
        }, 50);
    }

    function renderCourses(container, data) {
        try {
            container.innerHTML = "";

            var header = document.createElement("div");
            header.className = "text-center";
            header.innerHTML =
                "<h2>" + data.title + "</h2>" +
                "<p class='mtk-description'>" + data.description + "</p>";
            container.appendChild(header);

            var row = document.createElement("div");
            row.className = "row g-4";

            data.items.forEach(function (item) {
                var col = document.createElement("div");
                col.className = "col-12 col-sm-6 col-lg";

                var features = item.features.map(function (f) {
                    return "<li>" + f + "</li>";
                }).join("");

                col.innerHTML =
                    "<div class='course-card'>" +
                        "<span class='course-level'>" + item.level + "</span>" +
                        "<div class='course-title'>" + item.title + "</div>" +
                        "<div class='course-description'>" + item.description + "</div>" +
                        "<ul class='course-features'>" + features + "</ul>" +
                        "<div class='course-cta'>" +
                            "<button class='btn nala-btn-primary btn-ripple w-100' data-event='" + item.cta.event + "'>" +
                                item.cta.label +
                            "</button>" +
                        "</div>" +
                    "</div>";

                row.appendChild(col);
            });

            container.appendChild(row);
            scheduleCourseAlignment(container);

            var footer = document.createElement("div");
            footer.className = "view-all";
            container.appendChild(footer);

            container.onclick = function (e) {
                var target = e.target.closest("[data-event]");
                if (!target) return;
                e.preventDefault();
                var msg = "mtk-courses:click"; wc.log(msg);
                wc.publish(msg, {
                    event: target.getAttribute("data-event") || ""
                });
            };
        } catch (err) {
            console.error("MTK-courses render error", err);
        }
    }

    function alignCourseCardSections(container) {
        var cards = Array.prototype.slice.call(container.querySelectorAll(".course-card"));
        if (!cards.length) return;

        cards.forEach(function (card) {
            var title = card.querySelector(".course-title");
            var description = card.querySelector(".course-description");
            if (title) title.style.minHeight = "";
            if (description) description.style.minHeight = "";
        });

        var rows = [];
        cards.forEach(function (card) {
            var top = Math.round(card.getBoundingClientRect().top);
            var row = rows.find(function (item) {
                return Math.abs(item.top - top) < 4;
            });

            if (!row) {
                row = { top: top, cards: [] };
                rows.push(row);
            }

            row.cards.push(card);
        });

        rows.forEach(function (row) {
            var maxTitle = 0;
            var maxDescription = 0;

            row.cards.forEach(function (card) {
                var title = card.querySelector(".course-title");
                var description = card.querySelector(".course-description");
                if (title) maxTitle = Math.max(maxTitle, title.getBoundingClientRect().height);
                if (description) maxDescription = Math.max(maxDescription, description.getBoundingClientRect().height);
            });

            row.cards.forEach(function (card) {
                var title = card.querySelector(".course-title");
                var description = card.querySelector(".course-description");
                if (title) title.style.minHeight = Math.ceil(maxTitle) + "px";
                if (description) description.style.minHeight = Math.ceil(maxDescription) + "px";
            });
        });
    }

    function scheduleCourseAlignment(container) {
        window.requestAnimationFrame(function () {
            alignCourseCardSections(container);
        });
    }

    ready("#MTK-courses", function (root) {
        var container = root.querySelector(".container");
        if (!container) return;

        waitForData(function (data) {
            renderCourses(container, data);
            scheduleCourseAlignment(container);
        });

        // Re-render when language changes (courses:rebuild fired by courses.config.js)
        document.addEventListener('courses:rebuild', function () {
            if (window.app && window.app.courses) {
                renderCourses(container, window.app.courses);
                scheduleCourseAlignment(container);
            }
        });

        window.addEventListener("resize", function () {
            scheduleCourseAlignment(container);
        });
    });
})();
