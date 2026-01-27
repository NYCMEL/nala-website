(function () {
  function waitFor(selector, cb) {
    const el = document.querySelector(selector);
    if (el) return cb(el);
    requestAnimationFrame(() => waitFor(selector, cb));
  }

  function init(headerEl) {
    const config = window.app?.header;
    if (!config) return;

    if (config.fixed) {
      headerEl.classList.add("is-fixed");
    }

    const logoEl = headerEl.querySelector("#MTK-header-logo");
    const menuEl = headerEl.querySelector("#MTK-header-menu");
    const buttonsEl = headerEl.querySelector("#MTK-header-buttons");
    const toggleEl = headerEl.querySelector("#MTK-header-toggle");
    const collapseEl = headerEl.querySelector("#MTK-header-collapse");

    // Logo
    logoEl.textContent = config.logo.text;
    logoEl.href = config.logo.url;

    // Menu
    menuEl.innerHTML = "";
    config.menu.forEach(item => {
      const li = document.createElement("li");
      li.className = "nav-item";

      const a = document.createElement("a");
      a.className = "nav-link" + (item.active ? " active" : "");
      a.href = item.href;
      a.textContent = item.label;

      a.addEventListener("click", e => {
        e.preventDefault();
        menuEl.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        a.classList.add("active");
        if (window.PubSub) {
          PubSub.publish("header.menu.click", item);
        }
      });

      li.appendChild(a);
      menuEl.appendChild(li);
    });

    // Buttons
    buttonsEl.innerHTML = "";
    config.buttons.forEach(btn => {
      const b = document.createElement("button");
      b.className = "mtk-btn " + (btn.type || "");
      b.textContent = btn.label;

      b.addEventListener("click", () => {
        if (window.PubSub) {
          PubSub.publish("header.button.click", btn);
        }
      });

      buttonsEl.appendChild(b);
    });

    // Mobile toggle
    toggleEl.addEventListener("click", () => {
      collapseEl.classList.toggle("show");
    });
  }

  waitFor("#MTK-header", init);
})();
