// Helper function to wait for an element to appear in the DOM
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
	const el = document.querySelector(selector);
	if (el) return resolve(el);

	const observer = new MutationObserver((mutations, obs) => {
	    const element = document.querySelector(selector);
	    if (element) {
		obs.disconnect();
		resolve(element);
	    }
	});

	observer.observe(document.body, { childList: true, subtree: true });

	if (timeout) {
	    setTimeout(() => {
		observer.disconnect();
		reject(new Error(`Element ${selector} not found within ${timeout}ms`));
	    }, timeout);
	}
    });
}

// Wait for #mtk-lessons, then run your code
waitForElement("#mtk-lessons").then(root => {
    const data = window.app.parts;
    if (!data) return;

    wc.log("lessons:", data);

    const createItem = (title, locked = false) => {
	const item = document.createElement("div");
	item.className = "mtk-item";

	const header = document.createElement("div");
	header.className = "mtk-header" + (locked ? " locked" : "");

	const icon = document.createElement("span");
	icon.className = "mtk-icon";
	icon.textContent = "+";

	const text = document.createElement("span");
	text.className = "mtk-title";
	text.textContent = title;
	text.title = title;

	header.append(icon, text);
	item.append(header);

	const children = document.createElement("div");
	children.className = "mtk-children";
	item.append(children);

	if (!locked) {
	    header.addEventListener("click", () => {
		const expanded = item.classList.toggle("expanded");
		icon.textContent = expanded ? "−" : "+";
	    });
	}

	return { item, children };
    };

    window.app.parts.forEach(part => {
	const partNode = createItem(part.title, !part.access);
	root.appendChild(partNode.item);

	if (!part.access) return;

	part.modules.forEach(module => {
	    const moduleNode = createItem(module.title);
	    partNode.children.appendChild(moduleNode.item);

	    module.lessons.forEach(lesson => {
		const lessonNode = createItem(lesson.title);
		moduleNode.children.appendChild(lessonNode.item);

		lesson.resources.forEach(res => {
		    const resNode = createItem(res.description);
		    lessonNode.children.appendChild(resNode.item);
		});
	    });
	});
    });
}).catch(err => console.warn(err.message));

////////////////////////////////////////////////////////////////
//// 
////////////////////////////////////////////////////////////////
function lessonClicked(index, title) {
    wc.log("clicked:", index, title);

    // Select all elements with the class .mtk-table
    const tableItems = document.querySelectorAll('.mtk-title');

    tableItems.forEach(item => {
	// Trim whitespace and compare text content
	if (item.textContent.trim() === title) {
	    // Simulate a click on the matching item
	    item.click();
	}
    });
}
