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
	    wc.subscribe("4-mtk-hierarchy:init", () => {});
	    wc.subscribe("4-mtk-hierarchy:folder:open", () => {});
	    wc.subscribe("4-mtk-hierarchy:folder:close", () => {});
	    wc.subscribe("4-mtk-hierarchy:resource:click", () => {});
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
	    console.log("BBBBBBBB", item)

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
	    children.dataset.open = "false";

	    btn.addEventListener("click", () => {
		if (!item.access) return;

		const isOpen = children.dataset.open === "true";
		children.dataset.open = String(!isOpen);

		btn.setAttribute("aria-expanded", String(!isOpen));
		icon.textContent = !isOpen ? "folder_open" : "folder";

		const eventName = "mtk-hierarchy:folder:" + (isOpen ? "close" : "open");
		wc.log(eventName, item);
		wc.publish(eventName, item);
	    });

	    if (item.modules) {
		item.modules.forEach(mod =>
		    children.appendChild(this.buildNode(mod))
		);
	    }

	    if (item.lessons) {
		item.lessons.forEach(lesson =>
		    children.appendChild(this.buildNode(lesson))
		);
	    }

	    // Resources
	    if (item.resources) {
		item.resources.forEach(res => {
		    const resLi = document.createElement("li");
		    const resBtn = document.createElement("button");

		    const hasAccess = res.access !== false;

		    resBtn.className = "mtk-btn";
		    resBtn.type = "button";
		    resBtn.setAttribute("aria-disabled", hasAccess ? "false" : "true");

		    if (!hasAccess) {
			resBtn.classList.add("is-disabled");
			resBtn.tabIndex = -1;
		    }

		    const resIcon = document.createElement("span");
		    resIcon.className = "material-icons mtk-icon";
		    resIcon.textContent = hasAccess ? "description" : "lock";

		    const resLabel = document.createElement("span");
		    resLabel.textContent = res.description;

		    resBtn.append(resIcon, resLabel);

		    // Processed indicator (fa-eye pushed right)
		    if (res.processed === true) {
			const eye = document.createElement("span");
			eye.className = "fa fa-eye mtk-resource-eye";
			eye.style.marginLeft = "auto";
			eye.setAttribute("aria-hidden", "true");
			resBtn.appendChild(eye);

			console.log(">>>>>>>>", resBtn)
		    }

		    resBtn.addEventListener("click", (e) => {
			if (!hasAccess) {
			    e.preventDefault();
			    e.stopPropagation();
			    return;
			}

			wc.log("mtk-hierarchy:resource:click", res);
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

    const wait = setInterval(() => {
	const el = document.querySelector("mtk-hierarchy");
	if (el) {
	    clearInterval(wait);
	    window[NS].init();
	    wc.log("mtk-hierarchy:init", {});
	    wc.publish("mtk-hierarchy:init", {});
	}
    }, 50);
})();
