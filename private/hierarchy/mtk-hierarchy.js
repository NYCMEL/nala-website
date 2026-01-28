(function () {
  if (window.MTKHierarchy) return;

  window.MTKHierarchy = {
    init() {
      const waitForDom = () => {
        this.root = document.querySelector("mtk-hierarchy.mtk-hierarchy");
        if (!this.root) {
          requestAnimationFrame(waitForDom);
          return;
        }

        this.config = window.app && window.app.hierarchy;
        if (!this.config) {
          wc.publish("mtk-hierarchy:error", { message: "Missing config" });
          return;
        }

        this.tree = this.root.querySelector(".mtk-tree");
        this.viewer = this.root.querySelector(".mtk-hierarchy-rhs");

        this.subscribe();
        this.render();

        wc.publish(this.config.events.init, {});
      };

      waitForDom();
    },

    subscribe() {
      Object.values(this.config.events).forEach((eventName) => {
        wc.subscribe(eventName, () => {});
      });
    },

    render() {
      this.config.courses.forEach((course) => {
        this.tree.appendChild(this.buildNode(course, "course"));
      });
    },

    buildNode(item, type) {
      const li = document.createElement("li");
      li.className = "mtk-node";
      li.setAttribute("role", "treeitem");
      li.setAttribute("aria-expanded", "false");

      const btn = document.createElement("button");
      btn.className = "mtk-toggle";
      btn.innerHTML = `<span class="material-icons" aria-hidden="true">chevron_right</span>${item.title}`;
      btn.setAttribute("aria-disabled", String(!item.access));

      btn.addEventListener("click", () => {
        if (!item.access) return;
        const expanded = li.getAttribute("aria-expanded") === "true";
        li.setAttribute("aria-expanded", String(!expanded));
        wc.publish(this.config.events.toggle, { title: item.title, expanded: !expanded });
      });

      li.appendChild(btn);

      const children = item.modules || item.lessons || item.resources;
      if (children) {
        const ul = document.createElement("ul");
        ul.className = "mtk-children";
        ul.setAttribute("role", "group");

        children.forEach((child) => {
          if (child.url) {
            ul.appendChild(this.buildResource(child));
          } else {
            ul.appendChild(this.buildNode(child));
          }
        });

        li.appendChild(ul);
      }

      return li;
    },

    buildResource(resource) {
      const li = document.createElement("li");
      li.className = "mtk-node";

      const link = document.createElement("a");
      link.className = "mtk-resource";
      link.textContent = resource.description;
      link.href = resource.url;
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-disabled", String(!resource.access));

      link.addEventListener("click", () => {
        if (!resource.access) return;
        wc.publish(this.config.events.resourceClick, resource);
      });

      li.appendChild(link);
      return li;
    }
  };

  window.MTKHierarchy.init();
})();
