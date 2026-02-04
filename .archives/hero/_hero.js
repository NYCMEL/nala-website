if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHero);
} else {
  initHero();
}

function initHero() {
  const heroBtn = document.getElementById("_hero-btn");

  if (!heroBtn) {
    // Try again shortly in case hero is injected later
    setTimeout(initHero, 50);
    return;
  }

  heroBtn.addEventListener("click", function () {
    console.log("_hero CTA clicked");
    alert("Hero CTA triggered");
  });
}
