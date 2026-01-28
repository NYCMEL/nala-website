(function () {
    const NS = "MTKHierarchy";

    window[NS] = {
	init() {
	    const host = document.querySelector("mtk-hierarchy");
	    if (!host || !window.app || !window.app.hierarchy) return;

	    this.host = host;
	    this.lhs = host.querySelector(".mtk-hierarchy-lhs");
	    this.rhs = host.querySelector(".mtk-hierarchy-rhs");

	    this.render(window.app.hierarchy);
	    this.subscribe();
	},

	subscribe() {
	    // subscribe to all four hierarchy events
	    wc.subscribe("mtk-hierarchy:init", () => {});
	    wc.subscribe("mtk-hierarchy:folder:open", (data) => {});
	    wc.subscribe("mtk-hierarchy:folder:close", (data) => {});
	    wc.subscribe("mtk-hierarchy:resource:click", (data) => {
		wc.log("Resource clicked subscriber:", data);
	    });
	},

	render(data) {
	    const ul = document.createElement("ul");
	    ul.className = "mtk-tree";

	    data.forEach(course => {
		const card = document.createElement("div");
		card.className = "mtk-course-card";
		card.appendChild(this.buildNode(course, true));
		ul.appendChild(card);
	    });

	    this.lhs.appendChild(ul);
	},

	buildNode(item, isCourse = false) {
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

		wc.log(`Publishing folder ${open ? "close" : "open"} event:`, item);
		wc.publish("mtk-hierarchy:folder:" + (open ? "close" : "open"), item);
	    });

	    // Add modules
	    if (item.modules) {
		item.modules.forEach(mod => children.appendChild(this.buildNode(mod)));
	    }

	    // Add lessons
	    if (item.lessons) {
		item.lessons.forEach(lesson => children.appendChild(this.buildNode(lesson)));
	    }

	    // Add resources
	    if (item.resources) {
		item.resources.forEach(res => {
		    const resLi = document.createElement("li");
		    const resBtn = document.createElement("button");
		    resBtn.className = "mtk-btn";
		    resBtn.type = "button";

		    const resIcon = document.createElement("span");
		    resIcon.className = "material-icons mtk-icon";
		    resIcon.textContent = "description";

		    const resLabel = document.createElement("span");
		    resLabel.textContent = res.description;

		    resBtn.append(resIcon, resLabel);

		    resBtn.addEventListener("click", () => {
			wc.log("Publishing resource click event:", res);
			wc.publish("mtk-hierarchy:resource:click", res);
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

    // Wait for mtk-hierarchy element to exist
    const wait = setInterval(() => {
	const el = document.querySelector("mtk-hierarchy");
	if (el) {
	    clearInterval(wait);
	    window[NS].init();
	    wc.log("Publishing init event:", {});
	    wc.publish("mtk-hierarchy:init", {});
	}
    }, 50);
})();
