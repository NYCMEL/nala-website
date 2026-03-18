window.app = window.app || {};

function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

window.app.footer = {
    brand: {
        logo:        "img/footer-logo.png",
        logoAlt:     "NALA Association Logo",
        description: _t('footer.brand.desc', 'NALA empowers locksmith professionals through education, certification, and industry leadership. 2026 All Rights Reserved')
    },
    contact: {
        title:   _t('footer.contact.title', 'Contact Information'),
        phone:   "+1 (646) 303-1234",
        email:   "info@nala-association.org",
        address: "1510 Park Ave, New York, NY 10010"
    },
    social: {
        title: _t('footer.social.title', 'Social Media'),
        links: [
            { platform: "facebook",  url: "https://facebook.com/nala-association",  icon: "fab fa-facebook-f",  label: "Facebook"  },
            { platform: "instagram", url: "https://instagram.com/nala-association",  icon: "fab fa-instagram",   label: "Instagram" },
            { platform: "linkedin",  url: "https://linkedin.com/company/nala-association", icon: "fab fa-linkedin-in", label: "LinkedIn"  },
            { platform: "youtube",   url: "https://youtube.com/nala-association",    icon: "fab fa-youtube",     label: "YouTube"   }
        ]
    },
    copyright: {
        text: _t('footer.copyright', '2026 NALA - North America Locksmith Association')
    }
};

document.addEventListener('i18n:changed', function() {
    var f = window.app.footer;
    if (!f) return;
    f.brand.description   = i18n.t('footer.brand.desc');
    f.contact.title       = i18n.t('footer.contact.title');
    f.social.title        = i18n.t('footer.social.title');
    f.copyright.text      = i18n.t('footer.copyright');
});
