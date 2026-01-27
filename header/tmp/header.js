class MTKHeader {
  constructor() {
    this.config = window.app.header;
    this.headerEl = document.getElementById("_mtk-header");
    this.logoEl = document.getElementById("_mtk-logo");
    this.menuEl = document.getElementById("_mtk-menu");
    this.buttonsEl = document.getElementById("_mtk-buttons");

    this.init();
  }

  init() {
    if (!this.headerEl) return;
    this.loadLogo();
    this.loadMenu();
    this.loadButtons();
    this.applyMode();
    this.applyFixed();
    this.setupEvents();
  }

  loadLogo() {
    this.logoEl.src = this.config.logo || "";
  }

  loadMenu() {
    this.menuEl.innerHTML = "";
    this.config.menu.forEach((item, idx) => {
      const li = document.createElement("li");
      li.className = "mtk-menu-item";
      li.dataset.index = idx;

      const a = document.createElement("a");
      a.textContent = item.text;
      a.href = "#";
      li.appendChild(a);

      // Dropdown
      if (item.dropdown) {
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
  }

  loadButtons() {
    this.buttonsEl.innerHTML = "";
    this.config.buttons.forEach(btn => {
      const button = document.createElement("button");
      button.className = `mtk-btn ${btn.type}`;
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
      this.headerEl.style.top = 0;
      this.headerEl.style.left = 0;
    }
  }

  setActive(idx) {
    this.menuEl.querySelectorAll(".mtk-menu-item").forEach(item => item.classList.remove("active"));
    const item = this.menuEl.querySelector(`.mtk-menu-item[data-index="${idx}"]`);
    if (item) item.classList.add("active");
  }

  setupEvents() {
    document.addEventListener("click", e => {
      // Close dropdown if clicked outside
      this.menuEl.querySelectorAll(".mtk-menu-item").forEach(item => {
        if (!item.contains(e.target)) item.classList.remove("show-dropdown");
      });
    });
  }
}

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => new MTKHeader());
