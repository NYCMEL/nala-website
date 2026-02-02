(function () {
  "use strict";

  function waitFor(conditionFn, callback, timeoutMs) {
    var start = Date.now();
    var timer = setInterval(function () {
      if (conditionFn()) {
        clearInterval(timer);
        callback();
      } else if (Date.now() - start > (timeoutMs || 8000)) {
        clearInterval(timer);
        if (window.wc && wc.warn) {
          wc.warn("mtk-dashboard timeout waiting for dependency");
        }
      }
    }, 50);
  }

  function renderDashboard(root, data) {
    if (!root || !data) return;

    root.innerHTML = "";

    var container = document.createElement("div");
    container.className = "container";

    if (data.title) {
      var title = document.createElement("div");
      title.className = "dashboard-title";
      title.innerHTML = data.title;
      container.appendChild(title);
    }

    if (data.description) {
      var desc = document.createElement("div");
      desc.className = "dashboard-description";
      desc.innerHTML = data.description;
      container.appendChild(desc);
    }

    if (Array.isArray(data.tiles)) {
      var row = document.createElement("div");
      row.className = "row g-4";

      data.tiles.forEach(function (tile) {
        var col = document.createElement("div");
        col.className = "col-12 col-md-4";

        var card = document.createElement("div");
        card.className = "dashboard-card";

        if (tile.title) {
          var ct = document.createElement("div");
          ct.className = "card-title";
          ct.innerHTML = tile.title;
          card.appendChild(ct);
        }

        if (tile.description) {
          var cd = document.createElement("div");
          cd.className = "card-description";
          cd.innerHTML = tile.description;
          card.appendChild(cd);
        }

        if (tile.event) {
          card.addEventListener("click", function () {
            if (window.wc && wc.publish) {
              wc.publish(tile.event, tile);
            }
          });
        }

        col.appendChild(card);
        row.appendChild(col);
      });

      container.appendChild(row);
    }

    root.appendChild(container);
  }

  waitFor(
    function () {
      return document.querySelector("mtk-dashboard");
    },
    function () {
      var root = document.querySelector("mtk-dashboard");

      waitFor(
        function () {
          return window.app && window.app.dashboard;
        },
        function () {
          renderDashboard(root, window.app.dashboard);
        }
      );
    }
  );
})();
