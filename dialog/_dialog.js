(function () {
  "use strict";

  function initDialog() {
    if (!window.app || !window.app.dialog) {
      console.error("_dialog config not found in window.app.dialog");
      return;
    }

    const dialog = document.getElementById("_dialog");
    if (!dialog) return;

    const titleEl = dialog.querySelector("._dialog-title");
    const bodyEl = dialog.querySelector("._dialog-body");
    const actionsEl = dialog.querySelector("._dialog-actions");
    const overlay = dialog.querySelector("._dialog-overlay");

    const config = window.app.dialog;

    // Populate dialog
    titleEl.innerHTML = config.title;
    bodyEl.innerHTML = config.body;
    actionsEl.innerHTML = "";

    if (Array.isArray(config.actions)) {
      config.actions.forEach(action => {
        const btn = document.createElement("button");
        btn.innerText = action.text;
        btn.type = action.type || "button";
        btn.addEventListener("click", () => {
          // Custom event for actions
          const event = new CustomEvent("dialog:action", { detail: { type: action.type } });
          dialog.dispatchEvent(event);

          // Auto close dialog on click
          if (action.type === "cancel" || action.type === "confirm") {
            hideDialog(dialog);
          }
        });
        actionsEl.appendChild(btn);
      });
    }

    // Overlay click closes dialog
    overlay.addEventListener("click", () => hideDialog(dialog));
  }

  function showDialog(dialog) {
    dialog.removeAttribute("hidden");
  }

  function hideDialog(dialog) {
    dialog.setAttribute("hidden", "");
  }

  // Expose global helpers
  window._dialog = {
    show: () => showDialog(document.getElementById("_dialog")),
    hide: () => hideDialog(document.getElementById("_dialog"))
  };

  // Initialize after load
  if (document.readyState === "complete") {
    initDialog();
  } else {
    window.addEventListener("load", initDialog);
  }
})();
