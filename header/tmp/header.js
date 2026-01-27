class MTKHeader {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => this.init());
  }

  init() {
    this.config = window.app.header || {};

    this.headerEl = document.getElementById("_mtk-header");
    this.logoEl = document.getElementById("_mtk-logo");
    this.menuEl = document.getElementById("_mtk-menu");
    this.buttonsEl = document.getElementById("_mtk-buttons");

    if (!this.headerEl || !this.logoEl || !this.menuEl || !this.buttonsEl) {
      console.error("MTK-header elements not found in DOM.");
      return;
    }

    this.loadLogo();
    this.loadMenu();
    this.loadButtons();
    this.applyMode();
    this.applyFixed();
  }

  loadLogo() {
    this.logoEl.src = this.config.logo || "";
  }

  loadMenu() {
    this.menuEl.innerHTML = "";

    (this.config.menu || []).forEach((item, idx) => {
      const li = document.createElement("li");
      li.className = "mtk-menu-item";
      li.dataset.index = idx;
      li.style.position = "relative";

      const a = document.createElement("a");
      a.href = "#";
      a.textContent = item.text;
      li.appendChild(a);

      if (item.dropdown && Array.isArray(item.dropdown)) {
        const dropdown = document.createElement("ul");
        dropdown.className = "dropdown-menu";

        item.dropdown.forEach(opt => {
          const dropItem = document.createElement("li");
          dropItem.className = "dropdown-item";
          dropItem.textContent = opt;
          dropItem.addEventListener("click", e => {
            e.stopPropagation();
            window._pubsub?.publish("mtk-header-dropdown-click", { menu: item.text, option: opt });
          });
          dropdown.appendChild(dropItem);
        });

        li.appendChild(dropdown);

        a.addEventListener("click", e => {
          e.preventDefault();
          li.classList.toggle("show-dropdown");
        });
      }

      a.addEventListener("click", e => {
        e.preventDefault();
        this.setActive(idx);
        window._pubsub?.publish("mtk-header-menu-click", { menu: item.text });
      });

      this.menuEl.appendChild(li);
    });

    document.addEventListener("click", e => {
      this.menuEl.querySelectorAll(".mtk-menu-item").forEach(item => {
        if (!item.contains(e.target)) item.classList.remove("show-dropdown");
      });
    });
  }

  loadButtons() {
    this.buttonsEl.innerHTML = "";
    (this.config.buttons || []).forEach(btn => {
      const button = document.createElement("button");
      button.className = `mtk-btn ${btn.type || ""}`;
      button.textContent = btn.text;
      button.addEventListener("click", () => {
        window._pubsub?.publish("mtk-header-button-click", { button: btn.text });
      });
      this.buttonsEl.appendChild(button);
    });
  }

  applyMode() {
    this.headerEl.classList.remove("light", "dark");
    this.headerEl.classList.add(this.config.mode || "light");
  }

  applyFixed() {
    if (this.config.fixed) {
      this.headerEl.style.position = "fixed";
      this.headerEl.style.top = "0";
      this.headerEl.style.left = "0";
      this.headerEl.style.width = "100%";
    } else {
      this.headerEl.style.position = "relative";
    }
  }

  setActive(idx) {
    this.menuEl.querySelectorAll(".mtk-menu-item").forEach(item => item.classList.remove("active"));
    const item = this.menuEl.querySelector(`.mtk-menu-item[data-index="${idx}"]`);
    if (item) item.classList.add("active");
  }
}

new MTKHeader();
