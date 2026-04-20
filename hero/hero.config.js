window.app = window.app || {};

window.app.hero = [
    {
	title:       (window.i18n ? window.i18n.t('hero.title')       : 'Master the art of professional locksmithing'),
	description: (window.i18n ? window.i18n.t('hero.description') : 'Join thousands of students learning modern security technology with bilingual courses, hands-on training, and industry-recognized certifications.'),
	cta:         (window.i18n ? window.i18n.t('hero.cta')         : 'Get Started'),
	image: "./img/hero.png",

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
