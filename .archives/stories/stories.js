const track = document.getElementById("carouselTrack");
const dotsContainer = document.getElementById("carouselDots");
const slides = document.querySelectorAll(".carousel-slide");

let index = 0;

/* DOTS */
slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll(".dot").forEach((d, i) =>
	d.classList.toggle("active", i === index)
    );
}

function moveSlide(dir) {
    index = (index + dir + slides.length) % slides.length;
    updateCarousel();
}

function goToSlide(i) {
    index = i;
    updateCarousel();
}

