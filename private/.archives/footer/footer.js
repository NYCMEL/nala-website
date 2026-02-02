(function () {
  function init() {
    if (!window.app || !window.app.footer) {
      console.warn("MTK-footer: window.app.footer not found");
      return true;
    }

    const logo = document.getElementById("mtk-footer-logo");
    const description = document.getElementById("mtk-footer-description");
    const copyright = document.getElementById("mtk-footer-copyright");
    const slogan = document.getElementById("mtk-footer-slogan");

    if (!logo || !description || !copyright || !slogan) {
      return false;
    }

    const data = window.app.footer;

    logo.src = data.logo.src;
    logo.alt = data.logo.alt || "";
    description.textContent = data.description || "";
    copyright.textContent = data.copyright || "";
    slogan.textContent = data.slogan || "";

    return true;
  }

  // Try immediately (covers static HTML)
  if (init()) return;

  // Wait for async HTML injection (wc-include)
  const observer = new MutationObserver(() => {
    if (init()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
