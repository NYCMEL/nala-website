(function () {
    function ready(selector, callback) {
        var interval = setInterval(function () {
            var el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            }
        }, 500);
    }

    function waitForData(callback) {
        var interval = setInterval(function () {
            if (window.app && window.app.courses) {
                clearInterval(interval);
                callback(window.app.courses);
            }
        }, 50);
    }

    ready("#MTK-courses", function (root) {
        waitForData(function (data) {
            try {
                var container = root.querySelector(".container");
                if (!container) return;

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
                    col.className = "col-12 col-md-4";

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
                                "<button class='btn btn-primary w-100' data-event='" + item.cta.event + "'>" +
                                    item.cta.label +
                                "</button>" +
                            "</div>" +
                        "</div>";

                    row.appendChild(col);
                });

                container.appendChild(row);

                var footer = document.createElement("div");
                footer.className = "view-all";

                // footer.innerHTML = "<button class='btn btn-outline-primary' data-event='" + data.cta.event + "'>" + data.cta.label + "</button>";

                container.appendChild(footer);

                container.addEventListener("click", function (e) {
                    var target = e.target.closest("[data-event]");
                    if (!target) return;

                    e.preventDefault();

		    let msg = "mtk-courses:click"; wc.log(msg);
		    wc.publish(msg);
                });
            } catch (err) {
                console.error("MTK-courses render error", err);
            }
        });
    });
})();
