window.app = window.app || {};

window.app.hero = [
    {
	title:       (window.i18n ? window.i18n.t('hero.title')       : 'Master the art of professional locksmithing'),
	description: (window.i18n ? window.i18n.t('hero.description') : 'Join thousands of students learning modern security technology with bilingual courses, hands-on training, and industry-recognized certifications.'),
	cta:         (window.i18n ? window.i18n.t('hero.cta')         : 'Get Started'),
	image: "./img/hero.png",
	images: [
	    { src: "img/home/hero-i-banner-preview.jpg", alt: "NALA locksmith training banner", position: "right center" },
	    { src: "img/home/hero-a-door-hardware.jpg", alt: "Locksmith working on bright door hardware", position: "center center" },
	    { src: "img/home/hero-b-key-wall-student.jpg", alt: "Locksmith student learning with key blanks", position: "center center" },
	    { src: "img/home/hero-c-service-interior.jpg", alt: "Locksmith service call training indoors", position: "center center" },
	    { src: "img/home/hero-h-bright-lock-closeup.jpg", alt: "Practical locksmith lock training", position: "center center" },
	    { src: "img/home/hero-g-bright-entry.jpg", alt: "Locksmith service training at a doorway", position: "center center" },
	    { src: "img/home/hero-f-automotive-tools.jpg", alt: "Automotive locksmith tool practice", position: "center center" },
	    { src: "img/home/hero-g-training-hands-on.jpg", alt: "Hands-on locksmith training with a door lock", position: "center center" }
	],

	lhsCol: "5", // Bootstrap col-md-5
	rhsCol: "7"  // Bootstrap col-md-7
    }
];

// Re-apply when language changes
document.addEventListener('i18n:changed', function () {
    if (window.app && window.app.hero && window.app.hero[0]) {
	window.app.hero[0].title       = window.i18n.t('hero.title');
	window.app.hero[0].description = window.i18n.t('hero.description');
	window.app.hero[0].cta         = window.i18n.t('hero.cta');
    }
});
