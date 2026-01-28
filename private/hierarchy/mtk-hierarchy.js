(function () {
    const NS = "MTKHierarchy";

    window[NS] = {
	init() {
	    const host = document.querySelector("mtk-hierarchy");
	    if (!host || !window.app || !window.app.hierarchy) return;

	    this.host = host;
	    this.lhs = host.querySelector(".mtk-hierarchy-lhs");
	    this.rhs = host.querySelector(".mtk-rhs-content");

	    this.render(window.app.hierarchy);
	    this.subscribe();
	},

	subscribe() {
	    wc.subscribe("mtk-hierarchy:init", () => {});
	    wc.subscribe("mtk-hierarchy:folder:open", () => {});
	    wc.subscribe("mtk-hierarchy:folder:close", () => {});
	    wc.subscribe("mtk-hierarchy:resource:click", (data) => {
		this.rhs.textContent = "Selected resource: " + data.description;
	    });
	},

	render(data) {
	    const ul = document.createElement("ul");
	    ul.className = "mtk-tree";

	    data.forEach(course => {
		const card = document.createElement("div");
		card.className = "mtk-course-card";
		card.appendChild(this.buildNode(course));
		ul.appendChild(card);
	    });

	    this.lhs.appendChild(ul);
	},

	buildNode(item) {
	    const li = document.createElement("li");
	    li.className = "mtk-node";

	    const btn = document.createElement("button");
	    btn.className = "mtk-btn";
	    btn.type = "button";
	    btn.setAttribute("aria-expanded", "false");
	    btn.setAttribute("aria-disabled", item.access ? "false" : "true");

	    const icon = document.createElement("span");
	    icon.className = "material-icons mtk-icon";
	    icon.textContent = "folder";

	    const label = document.createElement("span");
	    label.textContent = item.title;

	    btn.append(icon, label);
	    li.appendChild(btn);

	    const children = document.createElement("ul");
	    children.className = "mtk-children";

	    btn.addEventListener("click", () => {
		if (!item.access) return;

		const open = children.dataset.open === "true";
		children.dataset.open = open ? "false" : "true";
		btn.setAttribute("aria-expanded", String(!open));
		icon.textContent = open ? "folder" : "folder_open";

		wc.log("mtk-hierarchy:folder:" + (open ? "close" : "open"), item);
		wc.publish("mtk-hierarchy:folder:" + (open ? "close" : "open"), item);
	    });

	    if (item.modules) {
		item.modules.forEach(m => children.appendChild(this.buildNode(m)));
	    }

	    if (item.lessons) {
		item.lessons.forEach(l => children.appendChild(this.buildNode(l)));
	    }

	    if (item.resources) {
		item.resources.forEach(r => {
		    const resLi = document.createElement("li");
		    const resBtn = document.createElement("button");

		    resBtn.className = "mtk-btn";
		    resBtn.type = "button";

		    const resIcon = document.createElement("span");
		    resIcon.className = "material-icons mtk-icon";
		    resIcon.textContent = "description";

		    const resLabel = document.createElement("span");
		    resLabel.textContent = r.description;

		    resBtn.append(resIcon, resLabel);

		    resBtn.addEventListener("click", () => {
			wc.log("mtk-hierarchy:resource:click", r)
			wc.publish("mtk-hierarchy:resource:click", r);
		    });

		    resLi.appendChild(resBtn);
		    children.appendChild(resLi);
		});
	    }

	    if (children.children.length) {
		li.appendChild(children);
	    }

	    return li;
	}
    };

    const wait = setInterval(() => {
	if (document.querySelector("mtk-hierarchy")) {
	    clearInterval(wait);
	    window[NS].init();

	    wc.log("mtk-hierarchy:init", {})
	    wc.publish("mtk-hierarchy:init", {});
	}
    }, 50);
})();
