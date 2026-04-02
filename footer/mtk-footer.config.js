// mtk-footer configuration
window.app = window.app || {};
var _footerT = (window.i18n && typeof window.i18n.t === 'function')
    ? function (key, fallback) {
        var value = window.i18n.t(key);
        return value === key ? fallback : value;
      }
    : function (_key, fallback) {
        return fallback;
      };

window.app.footer = {
    brand: {
	logo: "img/footer-logo.png",
	logoAlt: "NALA Association Logo",
	description: _footerT('footer.brand.desc', '<i>NALA empowers locksmith professionals through education, certification, and industry leadership.</i> 2026 All rights reserved.')
    },
    contact: {
	title: _footerT('footer.contact.title', 'Contact Information'),
	phone: "+1 (646) 303-1234",
	email: "info@nala-association.org",
	address: "1510 Park Ave, New York, NY 10010"
    },
    social: {
	title: _footerT('footer.social.title', 'Social Media'),
	links: [
	    {
		platform: "facebook",
		url: "https://facebook.com/nala-association",
		icon: "fab fa-facebook-f",
		label: "Facebook"
	    },
	    {
		platform: "instagram",
		url: "https://instagram.com/nala-association",
		icon: "fab fa-instagram",
		label: "Instagram"
	    },
	    {
		platform: "linkedin",
		url: "https://linkedin.com/company/nala-association",
		icon: "fab fa-linkedin-in",
		label: "LinkedIn"
	    },
	    {
		platform: "youtube",
		url: "https://youtube.com/nala-association",
		icon: "fab fa-youtube",
		label: "YouTube"
	    }
	]
    },
    copyright: {
	text: _footerT('footer.copyright', '2026 NALA - North America Locksmith Association')
    }
};
