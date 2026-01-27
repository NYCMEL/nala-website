console.log("SSSSSSSSSSSSS");

// Utility to wait for an element to exist in the DOM
function waitForElement(selector, timeout = 5000) {
    console.log("CCCCCCCCCCC");

    return new Promise((resolve, reject) => {
        const interval = 50; // check every 50ms
        let elapsed = 0;

        const check = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(check);
                resolve(el);
            } else {
                elapsed += interval;
                if (elapsed >= timeout) {
                    clearInterval(check);
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                }
            }
        }, interval);
    });
}

// Wait for DOMContentLoaded first
document.addEventListener("DOMContentLoaded", async () => {
    try {
	wc.log("PPPPPPPPPPPPPPP");

        // Wait for the root element to exist
        const root = await waitForElement("#mtk-certification-root");

        console.log("Found root:", root);

        // Fetch and inject HTML
        const res = await fetch("./certification/certification.html");
        const html = await res.text();
        root.innerHTML = html;

	wc.log(">>>>>>>", res.text())

        renderMTKCertification();
    } catch (err) {
        console.error("MTK load error:", err);
    }

    function renderMTKCertification() {
        document.querySelector(".mtk-title").textContent =
            window.app.certification.title;

        document.querySelector(".mtk-subtitle").textContent =
            window.app.certification.subtitle;

        const grid = document.querySelector(".mtk-grid");

        window.app.certification.certifications.forEach(cert => {
            const col = document.createElement("div");
            col.className = "col-12 col-md-6";

            col.innerHTML = `
            <div class="mtk-card h-100">
              <div class="mtk-icon">${cert.icon}</div>
              <h5 class="mtk-card-title">${cert.title}</h5>
              <p class="mtk-card-desc">${cert.description}</p>
              <ul class="mtk-list">
                ${cert.items.map(i => `<li>${i}</li>`).join("")}
              </ul>
            </div>
          `;

            grid.appendChild(col);
        });
    }
});
