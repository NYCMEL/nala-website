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
                            "<button class='btn btn-primary btn-ripple w-100' data-event='" + item.cta.event + "'>" +
                                item.cta.label +
                            "</button>" +
                        "</div>" +
                    "</div>";

                row.appendChild(col);
            });

            container.appendChild(row);

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

    ready("#MTK-courses", function (root) {
        var container = root.querySelector(".container");
        if (!container) return;

        waitForData(function (data) {
            renderCourses(container, data);
        });

        // Re-render when language changes (courses:rebuild fired by courses.config.js)
        document.addEventListener('courses:rebuild', function () {
            if (window.app && window.app.courses) {
                renderCourses(container, window.app.courses);
            }
        });
    });
})();
