(function () {
  const NAMESPACE = "MTKHierarchy";

  window[NAMESPACE] = {
    init() {
      const root = document.querySelector("mtk-hierarchy");
      if (!root || !window.app || !window.app.hierarchy) return;

      this.root = root;
      this.lhs = root.querySelector(".mtk-hierarchy-lhs");
      this.rhs = root.querySelector(".mtk-rhs-content");

      this.renderTree(window.app.hierarchy);
      this.subscribeEvents();
    },

    subscribeEvents() {
      wc.subscribe("mtk-hierarchy:resource:click", (data) => {
        this.rhs.textContent = "Resource selected: " + data.description;
      });

      wc.subscribe("mtk-hierarchy:folder:open", () => {});
      wc.subscribe("mtk-hierarchy:folder:close", () => {});
      wc.subscribe("mtk-hierarchy:init", () => {});
    },

    renderTree(data) {
      const ul = document.createElement("ul");
      ul.className = "mtk-tree";

      data.forEach(course => {
        ul.appendChild(this.buildNode(course, "course"));
      });

      this.lhs.appendChild(ul);
    },

    buildNode(item, type) {
      const li = document.createElement("li");
      li.className = "mtk-node";

      const button = document.createElement("button");
      button.className = "mtk-btn";
      button.type = "button";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-disabled", item.access ? "false" : "true");

      const icon = document.createElement("span");
      icon.className = "material-icons mtk-icon";
      icon.textContent = "folder";

      const label = document.createElement("span");
      label.textContent = item.title;

      button.appendChild(icon);
      button.appendChild(label);
      li.appendChild(button);

      const children = document.createElement("ul");
      children.className = "mtk-children";

      button.addEventListener("click", () => {
        if (!item.access) return;

        const open = children.dataset.open === "true";
        children.dataset.open = open ? "false" : "true";
        button.setAttribute("aria-expanded", String(!open));
        icon.textContent = open ? "folder" : "folder_open";

        wc.publish(`mtk-hierarchy:folder:${open ? "close" : "open"}`, item);
      });

      if (item.modules) {
        item.modules.forEach(m => {
          const wrapper = document.createElement("li");
          const card = document.createElement("div");
          card.className = "mtk-module-card";
          card.appendChild(this.buildNode(m, "module"));
          wrapper.appendChild(card);
          children.appendChild(wrapper);
        });
      }

      if (item.lessons) {
        item.lessons.forEach(lesson => {
          children.appendChild(this.buildNode(lesson, "lesson"));
        });
      }

      if (item.resources) {
        item.resources.forEach(res => {
          const resLi = document.createElement("li");
          const resBtn = document.createElement("button");

          resBtn.className = "mtk-btn";
          resBtn.type = "button";
          resBtn.setAttribute("aria-disabled", "false");

          const resIcon = document.createElement("span");
          resIcon.className = "material-icons mtk-icon";
          resIcon.textContent = "description";

          const resLabel = document.createElement("span");
          resLabel.textContent = res.description;

          resBtn.appendChild(resIcon);
          resBtn.appendChild(resLabel);

          resBtn.addEventListener("click", () => {
            wc.publish("mtk-hierarchy:resource:click", res);
          });

          resLi.appendChild(resBtn);
          children.appendChild(resLi);
        });
      }

      if (children.children.length > 0) {
        li.appendChild(children);
      }

      return li;
    }
  };

  const wait = setInterval(() => {
    if (document.querySelector("mtk-hierarchy")) {
      clearInterval(wait);
      window[NAMESPACE].init();
      wc.publish("mtk-hierarchy:init", {});
    }
  }, 50);
})();
