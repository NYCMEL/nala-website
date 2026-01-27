class MTKPanel extends HTMLElement {
  connectedCallback() {
    const init = () => {
      const template = document.getElementById("mtk-panel-template");
      if (!template) return;

      const fragment = template.content.cloneNode(true);
      const root = fragment.querySelector(".mtk-panel");
      const row = fragment.querySelector(".mtk-panel-row");

      // Panel metadata
      const id = this.getAttribute("id");
      const panelMeta = (window.app.panels || []).find(p => p.id === id);

      // Panel height
      const height = this.getAttribute("data-height") || (panelMeta && panelMeta.height);
      if (height) root.style.height = height + "px";

      // Panel background
      const bg = this.getAttribute("data-background") || (panelMeta && panelMeta.background);
      if (bg) root.style.background = bg;

      // Children / columns
      const children = Array.from(this.children);

      children.forEach((child, index) => {
        const colDiv = document.createElement("div");

        // Column width from JSON, fallback to col-md-6
        const colClass = (panelMeta?.columns && panelMeta.columns[index]?.col) || "col-md-6";
        colDiv.className = colClass;

        // Column background from data attribute if exists
        const colBg = child.getAttribute("data-background");
        if (colBg) colDiv.style.background = colBg;

        colDiv.innerHTML = child.innerHTML;

        // Independent scroll
        if (height) colDiv.style.maxHeight = height + "px";
        colDiv.style.overflowY = "auto";

        row.appendChild(colDiv);
      });

      this.innerHTML = "";
      this.appendChild(fragment);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
}

customElements.define("mtk-panel", MTKPanel);
