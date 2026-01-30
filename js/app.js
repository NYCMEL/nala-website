// SMOOTH SCROLLING TO TARGET
(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const yOffset = -80; // adjust if you have a fixed header
    const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
})();

// REMOVE HAMBER MENUS ON ITEM SELECTION
wc.timeout(function(){
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
	link.addEventListener('click', () => {
	    const navbarCollapse = document.querySelector('.navbar-collapse');
	    if (navbarCollapse.classList.contains('show')) {
		new bootstrap.Collapse(navbarCollapse).hide();
	    }
	});
    });
}, 500, 1);
