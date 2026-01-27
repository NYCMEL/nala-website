(function () {

    function waitForFooter(callback, interval = 50, timeout = 5000) {
	const start = Date.now();
	const timer = setInterval(() => {
	    if (document.getElementById("MTK-footer") && window.app?.footer) {
		clearInterval(timer);
		callback();
	    } else if (Date.now() - start > timeout) {
		clearInterval(timer);
		console.warn("MTK-footer: container or config not found");
	    }
	}, interval);
    }

    function ensureStructure() {
	const footer = document.getElementById("MTK-footer");

	if (!footer.querySelector(".MTK-footer-top")) {
	    footer.innerHTML = `
        <div class="container">
          <div class="row MTK-footer-top"></div>
          <div class="row MTK-footer-bottom"></div>
        </div>
      `;
	}
    }

    function renderFooter() {
	const config = window.app.footer;

	const topRow = document.querySelector("#MTK-footer .MTK-footer-top");
	const bottomRow = document.querySelector("#MTK-footer .MTK-footer-bottom");

	if (!topRow || !bottomRow) {
	    console.warn("MTK-footer: rows missing");
	    return;
	}

	wc.log("MTK-footer:renderFooter", window.app.footer);

	/* Row 1, Column 1: Brand */
	topRow.innerHTML = `
      <div class="col-md-4 MTK-footer-brand">
        <img src="${config.brand.logo}" alt="Footer Logo">
        <p>${config.brand.description}</p>
      </div>
    `;

	/* Row 1, Columns 2–5 */
	config.columns.forEach(col => {
	    let html = `
        <div class="col-md-2">
          <div class="MTK-footer-title">${col.title}</div>
          <ul class="MTK-footer-links">
      `;

	    if (col.links) {
		col.links.forEach(link => {
		    html += `<li><a data-event="${link.event}">${link.label}</a></li>`;
		});
	    }

	    if (col.social) {
		html += `<div class="MTK-footer-social">`;
		col.social.forEach(item => {
		    html += `
            <a data-event="${item.event}">
              <i class="bi bi-${item.icon}"></i>
            </a>
          `;
		});
		html += `</div>`;
	    }

	    html += `</ul></div>`;
	    topRow.innerHTML += html;
	});

	/* Row 2 */
	bottomRow.innerHTML = `
      <div class="col-md-6">${config.bottom.left}</div>
      <div class="col-md-6 MTK-footer-bottom-right">${config.bottom.right}</div>
    `;

	/* PubSub wiring */
	document.querySelectorAll("#MTK-footer [data-event]").forEach(el => {
	    el.addEventListener("click", () => {
		window._pubsub?.publish(el.dataset.event);
	    });
	});
    }

    waitForFooter(() => {
	ensureStructure();
	renderFooter();
    });

})();
