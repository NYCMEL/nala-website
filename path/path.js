(function () {
  "use strict";

  function waitFor(conditionFn, callback, timeout) {
    var start = Date.now();
    var max = timeout || 5000;

    (function check() {
      if (conditionFn()) {
        callback();
        return;
      }

      if (Date.now() - start > max) {
        return;
      }

      requestAnimationFrame(check);
    })();
  }

  waitFor(
    function () {
      return (
        document.getElementById("MTK-path") &&
        window.app &&
        window.app.path
      );
    },
    init
  );

  function init() {
    var root = document.getElementById("MTK-path");
    if (!root) return;

    var data = window.app.path;
    if (!data || !Array.isArray(data.plans)) return;

    var container = root.querySelector(".container");
    if (!container) {
      container = document.createElement("div");
      container.className = "container";
      root.appendChild(container);
    }

    container.innerHTML = "";

    buildHeader(container, data);
    buildPlans(container, data.plans);
  }

  function buildHeader(container, data) {
    var header = document.createElement("div");
    header.className = "text-center";

    var title = document.createElement("h2");
    title.textContent = data.heading || "";
    header.appendChild(title);

    var subtitle = document.createElement("p");
    subtitle.className = "lead";
    subtitle.textContent = data.subheading || "";
    header.appendChild(subtitle);

    container.appendChild(header);
  }

  function buildPlans(container, plans) {
    var row = document.createElement("div");
    row.className = "row g-4 justify-content-center";

    plans.forEach(function (plan) {
      row.appendChild(buildPlanCard(plan));
    });

    container.appendChild(row);
  }

  function buildPlanCard(plan) {
    var col = document.createElement("div");
    col.className = "col-12 col-md-6";

    var card = document.createElement("div");
    card.className = "mtk-card";
    if (plan.popular) {
      card.className += " mtk-popular";
    }

    if (plan.popular) {
      var badge = document.createElement("div");
      badge.className = "mtk-badge";
      badge.textContent = "Most Popular";
      card.appendChild(badge);
    }

    var title = document.createElement("h4");
    title.textContent = plan.title || "";
    card.appendChild(title);

    var priceWrap = document.createElement("div");

    var price = document.createElement("span");
    price.className = "price";
    price.textContent = plan.price || "";
    priceWrap.appendChild(price);

    var period = document.createElement("span");
    period.className = "period";
    period.textContent = plan.period || "";
    priceWrap.appendChild(period);

    card.appendChild(priceWrap);

    var desc = document.createElement("p");
    desc.textContent = plan.description || "";
    card.appendChild(desc);

    card.appendChild(buildFeatureList(plan.features));
    card.appendChild(buildCTA(plan));

    col.appendChild(card);
    return col;
  }

  function buildFeatureList(features) {
    var ul = document.createElement("ul");

    if (!Array.isArray(features)) return ul;

    features.forEach(function (feature) {
      var li = document.createElement("li");

      var check = document.createElement("span");
      check.className = "check";
      check.textContent = "✓";

      var text = document.createElement("span");
      text.textContent = feature;

      li.appendChild(check);
      li.appendChild(text);
      ul.appendChild(li);
    });

    return ul;
  }

  function buildCTA(plan) {
    var btn = document.createElement("div");
    btn.className = "btn-path";
    btn.textContent = plan.cta || "";

    btn.addEventListener("click", function () {
      if (
        window._pubsub &&
        typeof window._pubsub.publish === "function"
      ) {
        window._pubsub.publish("MTK-path.select", {
          planId: plan.id || null
        });
      }
    });

    return btn;
  }
})();
