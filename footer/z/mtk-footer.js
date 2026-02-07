(function () {
    "use strict";

    const FOOTER_SELECTOR = ".mtk-footer";

    function renderFooter(footer, config) {
	footer.innerHTML = `
      <div class="container">
        <!-- Row 1: Brand -->
        <div class="row footer-row-1">
          <div class="col-12 footer-brand">
            ${renderBrand(config.brand)}
          </div>
        </div>

        <!-- Row 2: Legal + Social -->
        <div class="row footer-row-2 align-items-center">
          <div class="col-12 col-md-6 footer-legal">
            ${renderLegal(config.legal)}
          </div>
          <div class="col-12 col-md-6 footer-social">
            ${renderSocial(config.social)}
          </div>
        </div>
      </div>
    `;

	bindEvents(footer);
    }

    function renderBrand(brand) {
	if (!brand) return "";

	return `
      <div class="brand-wrap">
        ${brand.logo ? `<img src="${brand.logo}" alt="${brand.name}">` : ""}
        <p>${brand.description || ""}</p>
      </div>
    `;
    }

    function renderLegal(legal) {
	if (!legal) return "";

	return `
      <div class="legal-wrap">
        <span class="legal-text">${legal.text}</span>
        <ul class="legal-links">
          ${(legal.links || [])
            .map(
              (l) => `<li><a href="${l.url}">${l.label}</a></li>`,
            )
            .join("")}
        </ul>
      </div>
    `;
    }

    function renderSocial(social) {
	if (!Array.isArray(social) || !social.length) return "";

	return `
      <div class="social-wrap">
        ${social
          .map(
            (s) => `
            <a href="${s.url}" class="social-link" target="_blank">
            <span class="material-icons">${s.icon}</span>
            </a>
            `,
          )
          .join("")}
      </div>
    `;
    }

    function bindEvents(footer) {
	footer.addEventListener("click", (e) => {
	    const social = e.target.closest(".social-link");
	    if (!social) return;

	    if (window.wc?.publish) {
		wc.publish("mtk-footer.social.click", {
		    url: social.href,
		});
	    }
	});
    }

    /* ============================================================
       WAIT FOR <wc-include> TO FINISH
       ============================================================ */

    document.addEventListener("wc-include:loaded", (e) => {
	const footer = e.target.querySelector(FOOTER_SELECTOR);
	if (!footer) return;

	if (!window.app?.footer) {
	    console.warn("MTK-footer: window.app.footer missing");
	    return;
	}

	renderFooter(footer, window.app.footer);
    });
})();
