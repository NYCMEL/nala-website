(function () {
  if (window.MTKHierarchy) return;

  window.MTKHierarchy = {
    init() {
      const waitForElement = () => {
        const root = document.querySelector("mtk-hierarchy.mtk-hierarchy");
        if (!root) {
          requestAnimationFrame(waitForElement);
          return;
        }
        this.root = root;
        this.config = window.app && window.app.hierarchy;
        if (!this.config) {
          wc.publish("mtk-hierarchy:error", { message: "Missing config" });
          return;
        }
        this.bindEvents();
        this.render();
        wc.publish(this.config.events.init, {});
      };

      waitForElement();
    },

    bindEvents() {
      const events = this.config.events;
      Object.values(events).forEach((eventName) => {
        wc.subscribe(eventName, () => {});
      });
    },

    render() {
      this.list = this.root.querySelector("[role='listbox']");
      this.content = this.root.querySelector(".mtk-hierarchy-content");

      this.config.items.forEach((item, index) => {
        const li = document.createElement("li");

        const button = document.createElement("button");
        button.type = "button";
        button.className = "mtk-hierarchy-item";
        button.setAttribute("role", "option");
        button.setAttribute("aria-selected", "false");
        button.tabIndex = 0;

        button.innerHTML = `
          <span class="material-icons" aria-hidden="true">${item.icon}</span>
          <span>${item.label}</span>
        `;

        button.addEventListener("click", () => this.selectItem(index, button));
        button.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.selectItem(index, button);
          }
        });

        li.appendChild(button);
        this.list.appendChild(li);
      });
    },

    selectItem(index, button) {
      const buttons = this.root.querySelectorAll(".mtk-hierarchy-item");
      buttons.forEach((btn) => btn.setAttribute("aria-selected", "false"));
      button.setAttribute("aria-selected", "true");

      const item = this.config.items[index];
      this.content.innerHTML = "";

      if (item.content.video) {
        const video = document.createElement("video");
        video.controls = true;
        video.src = item.content.video;
        this.content.appendChild(video);
      }

      if (Array.isArray(item.content.images)) {
        item.content.images.forEach((src) => {
          const img = document.createElement("img");
          img.src = src;
          img.alt = item.label;
          this.content.appendChild(img);
        });
      }

      wc.publish(this.config.events.select, { index, item });
      wc.publish(this.config.events.contentLoaded, { index });
    }
  };

  window.MTKHierarchy.init();
})();
