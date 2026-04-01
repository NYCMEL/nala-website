window.app = window.app || {};

function _buildCarouselSlides() {
    var t = window.i18n ? window.i18n.t.bind(window.i18n) : function(k){ return k; };
    return [
        {
            id: "slide-1",
            html: `
<div class="p-4">
    <article class="carousel-card">
        <h2 align="center">${t('carousel.slide1.title')}</h2>
        <p>${t('carousel.slide1.body')}</p>
    </article>
</div>`
        },
        {
            id: "slide-2",
            html: `
<div class="p-4">
    <article class="carousel-card">
        <h2 align="center">${t('carousel.slide2.title')}</h2>
        <p>${t('carousel.slide2.body')}</p>
    </article>
</div>`
        },
        {
            id: "slide-3",
            html: `
<div class="p-4">
    <article class="carousel-card">
        <h2 align="center">${t('carousel.slide3.title')}</h2>
        <p>${t('carousel.slide3.body')}</p>
    </article>
</div>`
        },
        {
            id: "slide-4",
            html: `
<div class="p-4">
    <article class="carousel-card">
        <h2 align="center">${t('carousel.slide4.title')}</h2>
        <p>${t('carousel.slide4.body')}</p>
    </article>
</div>`
        },
        {
            id: "slide-5",
            html: `
<div class="p-4">
    <article class="carousel-card">
        <h2 align="center">${t('carousel.slide5.title')}</h2>
        <p>${t('carousel.slide5.body')}</p>
    </article>
</div>`
        }
    ];
}

window.app.carousel = {
    id:         "mtk-carousel",
    startIndex: 0,
    autoPlay:   false,
    interval:   4000,
    slides:     _buildCarouselSlides()
};

// Rebuild slides and re-render when language changes
document.addEventListener('i18n:changed', function () {
    if (window.app && window.app.carousel) {
        window.app.carousel.slides = _buildCarouselSlides();
        // Signal carousel.js to re-render
        document.dispatchEvent(new CustomEvent('carousel:rebuild'));
    }
});
