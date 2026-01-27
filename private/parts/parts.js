// Helper function: wait until an element exists
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
	const interval = 50;
	let elapsed = 0;

	const check = setInterval(() => {
	    const el = document.querySelector(selector);
	    if (el) {
		clearInterval(check);
		resolve(el);
	    } else if (telapsed >= timeout) {
		clearInterval(check);
		reject(new Error("Element not found: " + selector));
	    }
	    elapsed += interval;
	}, interval);
    });
}

// Wait for #MTK-parts and then render cards
waitForElement("#MTK-parts").then(container => {
    if (!window.app?.parts) return;

    const parts = window.app.parts;

    parts.forEach((part, index) => {
	const col = document.createElement("div");
	col.className = "col-md-3";

	const card = document.createElement("div");
	card.className = `mtk-card ${part.access ? "" : "locked"}`;

	const content = document.createElement("div");
	content.className = "card-content";

	const title = document.createElement("h5");
	title.textContent = part.title;

	content.appendChild(title);
	card.appendChild(content);
	col.appendChild(card);
	container.appendChild(col);

	if (part.access) {
	    card.addEventListener("click", () => {
		wc.log("parts:", index, part)
		PubSub.publish("MTK-parts.click", JSON.stringify({index, part}));
	    });
	}
    });
}).catch(err => console.error(err));
