window.app = window.app || {};

function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

window.app.carousel = {
    id: "mtk-carousel",
    startIndex: 0,
    autoPlay: false,
    interval: 4000,
    slides: [
        {
            id: "slide-1",
            html: '<div class="p-4"><article class="carousel-card">'
                + '<h2 align="center">' + _t('carousel.slide1.title', 'Career Switcher') + '</h2>'
                + '<p>' + _t('carousel.slide1.body', 'Someone leaving an office or retail job uses the program to learn residential and commercial locksmithing fundamentals. By following the structured lessons and practicing alongside the videos, they build confidence handling basic service calls and entry-level jobs.') + '</p>'
                + '</article></div>'
        },
        {
            id: "slide-2",
            html: '<div class="p-4"><article class="carousel-card">'
                + '<h2 align="center">' + _t('carousel.slide2.title', 'Handyman Expanding Services') + '</h2>'
                + '<p>' + _t('carousel.slide2.body', 'A general handyman uses the program to add locksmithing as a paid service. Residential rekeying, deadbolt installation, and keypad locks become add-on services that increase the value of each job.') + '</p>'
                + '</article></div>'
        },
        {
            id: "slide-3",
            html: '<div class="p-4"><article class="carousel-card">'
                + '<h2 align="center">' + _t('carousel.slide3.title', 'Automotive Focus') + '</h2>'
                + '<p>' + _t('carousel.slide3.body', 'A learner with an interest in cars focuses on the automotive sections of the program to understand vehicle entry methods, key types, and modern locking systems, using the training as a foundation for further hands-on experience.') + '</p>'
                + '</article></div>'
        },
        {
            id: "slide-4",
            html: '<div class="p-4"><article class="carousel-card">'
                + '<h2 align="center">' + _t('carousel.slide4.title', 'Business Builder') + '</h2>'
                + '<p>' + _t('carousel.slide4.body', 'Someone with technical skills but no business background follows the business modules to understand pricing, licensing considerations, customer communication, and marketing fundamentals before launching a locksmith service.') + '</p>'
                + '</article></div>'
        },
        {
            id: "slide-5",
            html: '<div class="p-4"><article class="carousel-card">'
                + '<h2 align="center">' + _t('carousel.slide5.title', 'Supplemental Trade Skill') + '</h2>'
                + '<p>' + _t('carousel.slide5.body', 'An electrician or security technician uses the program to better understand locks, doors, and access control hardware, allowing them to coordinate more effectively on job sites and offer broader solutions.') + '</p>'
                + '</article></div>'
        }
    ]
};

// When language changes, rebuild slides with new language and re-render
document.addEventListener('i18n:changed', function() {
    // Rebuild the slides array in the new language
    window.app.carousel.slides = [
        {
            id: "slide-1",
            html: '<div class="p-4"><article class="carousel-card">'
                + '<h2 align="center">' + _t('carousel.slide1.title', 'Career Switcher') + '</h2>'
                + '<p>' + _t('carousel.slide1.body', '') + '</p>'
                + '</article></div>'
        },
        {
            id: "slide-2",
            html: '<div class="p-4"><article class="carousel-card">'
                + '<h2 align="center">' + _t('carousel.slide2.title', 'Handyman Expanding Services') + '</h2>'
                + '<p>' + _t('carousel.slide2.body', '') + '</p>'
                + '</article></div>'
        },
        {
            id: "slide-3",
            html: '<div class="p-4"><article class="carousel-card">'
                + '<h2 align="center">' + _t('carousel.slide3.title', 'Automotive Focus') + '</h2>'
                + '<p>' + _t('carousel.slide3.body', '') + '</p>'
                + '</article></div>'
        },
        {
            id: "slide-4",
            html: '<div class="p-4"><article class="carousel-card">'
                + '<h2 align="center">' + _t('carousel.slide4.title', 'Business Builder') + '</h2>'
                + '<p>' + _t('carousel.slide4.body', '') + '</p>'
                + '</article></div>'
        },
        {
            id: "slide-5",
            html: '<div class="p-4"><article class="carousel-card">'
                + '<h2 align="center">' + _t('carousel.slide5.title', 'Supplemental Trade Skill') + '</h2>'
                + '<p>' + _t('carousel.slide5.body', '') + '</p>'
                + '</article></div>'
        }
    ];

    // Re-render: rebuild the carousel track with the new slide HTML
    var track = document.querySelector('#mtk-carousel-root .mtk-carousel-track');
    var dots  = document.querySelector('#mtk-carousel-root .mtk-carousel-dots');
    if (!track || !dots) return;

    track.innerHTML = '';
    dots.innerHTML  = '';

    window.app.carousel.slides.forEach(function(slide, i) {
        var slideEl = document.createElement('div');
        slideEl.className = 'mtk-carousel-slide';
        slideEl.innerHTML = slide.html;
        track.appendChild(slideEl);

        var dot = document.createElement('button');
        dot.className = 'mtk-carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', function() {
            track.style.transform = 'translateX(-' + i * 100 + '%)';
            [].forEach.call(dots.children, function(d, j) {
                d.classList.toggle('active', j === i);
            });
        });
        dots.appendChild(dot);
    });

    // Reset to first slide
    track.style.transform = 'translateX(0)';
});
