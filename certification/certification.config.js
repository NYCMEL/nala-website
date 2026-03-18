window.app = window.app || {};

function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

function buildCertification() {
    return {
        title:    _t('cert.cards.title',    'Industry-Recognized Certifications'),
        subtitle: _t('cert.cards.subtitle', 'Earn credentials that employers trust and value'),
        certifications: [
            {
                icon: "🔰",
                title:       _t('cert.c1.title',       'Certified Locksmith Technician'),
                description: _t('cert.c1.description', 'Entry-level certification covering fundamental locksmithing skills, ethics, and safety protocols.'),
                items: [
                    _t('cert.c1.f1', 'Basic lock mechanisms'),
                    _t('cert.c1.f2', 'Key cutting and duplication'),
                    _t('cert.c1.f3', 'Professional standards')
                ]
            },
            {
                icon: "🔐",
                title:       _t('cert.c2.title',       'Advanced Security Professional'),
                description: _t('cert.c2.description', 'Comprehensive certification for commercial security systems and access control.'),
                items: [
                    _t('cert.c2.f1', 'Master key systems'),
                    _t('cert.c2.f2', 'Electronic access control'),
                    _t('cert.c2.f3', 'Security consulting')
                ]
            },
            {
                icon: "🚗",
                title:       _t('cert.c3.title',       'Automotive Locksmith Specialist'),
                description: _t('cert.c3.description', 'Specialized training in modern vehicle security systems and key programming.'),
                items: [
                    _t('cert.c3.f1', 'Transponder programming'),
                    _t('cert.c3.f2', 'Ignition repair'),
                    _t('cert.c3.f3', 'Smart key systems')
                ]
            },
            {
                icon: "🧊",
                title:       _t('cert.c4.title',       'Safe & Vault Technician'),
                description: _t('cert.c4.description', 'Expert-level certification for working with safes, vaults, and high-security locks.'),
                items: [
                    _t('cert.c4.f1', 'Safe opening techniques'),
                    _t('cert.c4.f2', 'Combination changes'),
                    _t('cert.c4.f3', 'High-security systems')
                ]
            }
        ]
    };
}

window.app.certification = buildCertification();

document.addEventListener('i18n:changed', function() {
    window.app.certification = buildCertification();
});
