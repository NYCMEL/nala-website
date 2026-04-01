window.app = window.app || {};

function _buildCourses() {
    var t = window.i18n ? window.i18n.t.bind(window.i18n) : function(k){ return k; };
    return {
        title:       "<h1 class='title'>" + t('courses.title') + "</h1>",
        description: t('courses.description'),
        items: [
            {
                level:       t('courses.p1.level'),
                title:       t('courses.p1.title'),
                description: t('courses.p1.description'),
                features:    [ t('courses.p1.f1'), t('courses.p1.f2'), t('courses.p1.f3') ],
                cta: { label: t('courses.cta'), event: "courses:intro" }
            },
            {
                level:       t('courses.p2.level'),
                title:       t('courses.p2.title'),
                description: t('courses.p2.description'),
                features:    [ t('courses.p2.f1'), t('courses.p2.f2'), t('courses.p2.f3') ],
                cta: { label: t('courses.cta'), event: "courses:residential" }
            },
            {
                level:       t('courses.p3.level'),
                title:       t('courses.p3.title'),
                description: t('courses.p3.description'),
                features:    [ t('courses.p3.f1'), t('courses.p3.f2'), t('courses.p3.f3') ],
                cta: { label: t('courses.cta'), event: "courses:commercial" }
            },
            {
                level:       t('courses.p4.level'),
                title:       t('courses.p4.title'),
                description: t('courses.p4.description'),
                features:    [ t('courses.p4.f1'), t('courses.p4.f2'), t('courses.p4.f3') ],
                cta: { label: t('courses.cta'), event: "courses:automotive" }
            },
            {
                level:       t('courses.p5.level'),
                title:       t('courses.p5.title'),
                description: t('courses.p5.description'),
                features:    [ t('courses.p5.f1'), t('courses.p5.f2'), t('courses.p5.f3') ],
                cta: { label: t('courses.cta'), event: "courses:business" }
            }
        ]
    };
}

window.app.courses = _buildCourses();

// Rebuild on language change
document.addEventListener('i18n:changed', function () {
    window.app.courses = _buildCourses();
    document.dispatchEvent(new CustomEvent('courses:rebuild'));
});
