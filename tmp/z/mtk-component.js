window.MTKComponent = (function () {
  const COMPONENT = "mtk-component";
  const EVENTS = [
    "mtk-component.click.btnPrimary",
    "mtk-component.click.btnWarning",
    "mtk-component.click.btnDanger",
    "mtk-component.click.*"
  ];

  // Wait until element exists in DOM
  function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) return callback(el);

    const observer = new MutationObserver((mutations, obs) => {
      const found = document.querySelector(selector);
      if (found) {
        obs.disconnect();
        callback(found);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Initialize component once element and inner HTML exist
  function init(root) {
    waitForElement("[data-mtk-buttons]", () => initButtons(root));
  }

  function initButtons(root) {
    const config = window.app && window.app.component;
    if (!config || !Array.isArray(config.buttons)) {
      wc.warn(`${COMPONENT}: missing config`);
      return;
    }

    const container = root.querySelector("[data-mtk-buttons]");
    if (!container) {
      wc.warn(`${COMPONENT}: inner elements missing`);
      return;
    }

    config.buttons.forEach((btn, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.id = btn.id;
      button.classList.add(btn.type);
      button.setAttribute("aria-label", btn.label);
      button.innerHTML = `
        <span class="material-icons" aria-hidden="true">${btn.icon}</span>
        <span>${btn.label}</span>
      `;

      // Publish click events
      button.addEventListener("click", () => {
        wc.publish(`${COMPONENT}.click.${btn.id}`, {
          id: btn.id,
          label: btn.label,
          index
        });
      });

      container.appendChild(button);
    });

    // Subscribe to all events
    EVENTS.forEach(evt => {
      wc.subscribe(evt, (msg, data) => {
        wc.log(`${COMPONENT} event:`, msg, data);
      });
    });
  }

  // Start waiting for the component
  waitForElement("mtk-component.mtk-component", init);

  return { init };
})();
