(function () {
  if (window.MTKHierarchy) return;

  window.MTKHierarchy = {
    init() {
      const wait = () => {
        this.root = document.querySelector("mtk-hierarchy.mtk-hierarchy");
        if (!this.root) {
          requestAnimationFrame(wait);
          return;
        }

        this.config = window.app && window.app.hierarchy;
        if (!this.config) {
          wc.publish("mtk-hierarchy:error", { message: "Missing hierarchy config" });
          return;
        }

        this.tree = this.root.querySelector(".mtk-tree");
        this.viewer = this.root.querySelector(".mtk-hierarchy-rhs");

        this.subscribe();
        this.render();

        wc.publish(this.config.events.init, {});
      };

      wait();
    },

    subscribe() {
      Object.values(this.config.events).forEach((event) => {
        wc.subscribe(event, () => {});
      });
    },

    render() {
      this.config.courses.forEach((course) => {
        this.tree.appendChild(this.buildCourse(course));
      });
    },

    buildCourse(course) {
      return this.buildNode(course.title, course.modules, "course");
    },

    buildNode(title, children, type) {
      const li = document.createElement("li");
      li.className = "mtk-node";
      li.setAttribute("role", "treeitem");
      li.setAttribute("aria-expanded", "false");

      const btn = document.createElement("button");
      btn.className = "mtk-toggle";
      btn.innerHTML = `<span class="material-icons" aria-hidden="true">chevron_right</span>${title}`;

      btn.addEventListener("click", () => {
        const expanded = li.getAttribute("aria-expanded") === "true";
        li.setAttribute("aria-expanded", String(!expanded));
        wc.publish(this.config.events.toggle, { title, expanded: !expanded });
      });

      li.appendChild(btn);

      if (children) {
        const ul = document.createElement("ul");
        ul.className = "mtk-children";
        ul.setAttribute("role", "group");

        children.forEach((child) => {
          if (child.lessons) {
            ul.appendChild(this.buildNode(child.title, child.lessons, "module"));
          } else if (child.resources) {
            ul.appendChild(this.buildNode(child.title, child.resources, "lesson"));
          } else if (child.url) {
            ul.appendChild(this.buildResource(child));
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
      link.href = resource.url;
      link.className = "mtk-resource";
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = resource.description;

      link.addEventListener("click", () => {
        wc.publish(this.config.events.resourceClick, resource);
      });

      li.appendChild(link);
      return li;
    }
  };

  window.MTKHierarchy.init();
})();
