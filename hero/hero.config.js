window.app = window.app || {};

window.app.hero = [
    {
	title:       'hero.title',       // i18n key
	description: 'hero.description', // i18n key
	image: "./img/hero.png",
	lhsCol: "5",
	rhsCol: "7"
    }
];

// Apply translations if i18n is already loaded
if (window.i18n) {
    window.app.hero.forEach(function(h) {
        h.title       = i18n.t('hero.title');
        h.description = i18n.t('hero.description');
    });
}
