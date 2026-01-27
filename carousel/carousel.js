(function () {
  const config = window.app && window.app.carousel;
  if (!config) return;

  const root = document.getElementById("mtk-carousel-root");
  const track = root.querySelector(".mtk-carousel-track");
  const dots = root.querySelector(".mtk-carousel-dots");

  let index = config.startIndex || 0;
  let timer = null;

  function build() {
    track.innerHTML = "";
    dots.innerHTML = "";

    config.slides.forEach((slide, i) => {
      const slideEl = document.createElement("div");
      slideEl.className = "mtk-carousel-slide";
      slideEl.innerHTML = slide.html;
      track.appendChild(slideEl);

      const dot = document.createElement("button");
      dot.className = "mtk-carousel-dot";
      if (i === index) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      dots.appendChild(dot);
    });

    update();
  }

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    [...dots.children].forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
  }

  function goTo(i) {
    index = (i + config.slides.length) % config.slides.length;
    update();
    resetAutoplay();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function startAutoplay() {
    if (!config.autoPlay) return;
    timer = setInterval(next, config.interval);
  }

  function resetAutoplay() {
    if (!config.autoPlay) return;
    clearInterval(timer);
    startAutoplay();
  }

  root.querySelector(".next").addEventListener("click", next);
  root.querySelector(".prev").addEventListener("click", prev);

  build();
  startAutoplay();
})();
