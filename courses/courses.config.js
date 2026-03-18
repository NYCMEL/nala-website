window.app = window.app || {};

function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

function buildCourses() {
    return {
        title:       "<h1 class='title'>" + _t('courses.title', 'Included in the Program') + "</h1>",
        description: _t('courses.description', 'One complete locksmith training program, organized into five connected parts that build practical skills from the fundamentals through business readiness.'),
        items: [
            {
                level: _t('courses.p1.level', 'Part I'),
                title: _t('courses.p1.title', 'Introduction to Locksmithing'),
                description: _t('courses.p1.description', 'Learn the foundations of locksmithing, including essential tools, common lock types, door hardware basics, and safe professional work practices.'),
                features: [
                    _t('courses.p1.f1', 'Core tools, lock types & terminology'),
                    _t('courses.p1.f2', 'Door hardware and installation basics'),
                    _t('courses.p1.f3', 'Preparation for hands-on locksmith work')
                ],
                cta: { label: _t('courses.cta', 'Get Started'), event: 'courses:intro' }
            },
            {
                level: _t('courses.p2.level', 'Part II'),
                title: _t('courses.p2.title', 'Residential Locksmithing'),
                description: _t('courses.p2.description', 'Build practical skills for residential service work, covering cylinders, rekeying fundamentals, deadbolts, and common home lock hardware.'),
                features: [
                    _t('courses.p2.f1', 'Residential cylinders and rekeying concepts'),
                    _t('courses.p2.f2', 'Deadbolts, knobs & home hardware'),
                    _t('courses.p2.f3', 'Common residential service scenarios')
                ],
                cta: { label: _t('courses.cta', 'Get Started'), event: 'courses:residential' }
            },
            {
                level: _t('courses.p3.level', 'Part III'),
                title: _t('courses.p3.title', 'Commercial Locksmithing'),
                description: _t('courses.p3.description', 'Understand commercial door and lock systems, including door types, keying concepts, and the basics of access control used in commercial environments.'),
                features: [
                    _t('courses.p3.f1', 'Commercial doors and hardware'),
                    _t('courses.p3.f2', 'Key systems and master key concepts'),
                    _t('courses.p3.f3', 'Introduction to access control components')
                ],
                cta: { label: _t('courses.cta', 'Get Started'), event: 'courses:commercial' }
            },
            {
                level: _t('courses.p4.level', 'Part IV'),
                title: _t('courses.p4.title', 'Automotive Locksmithing'),
                description: _t('courses.p4.description', 'Learn the fundamentals of automotive locksmithing, including vehicle entry principles, key types, and modern automotive security systems.'),
                features: [
                    _t('courses.p4.f1', 'Vehicle entry principles'),
                    _t('courses.p4.f2', 'Automotive key types and technologies'),
                    _t('courses.p4.f3', 'Modern car locking systems')
                ],
                cta: { label: _t('courses.cta', 'Get Started'), event: 'courses:automotive' }
            },
            {
                level: _t('courses.p5.level', 'Part V'),
                title: _t('courses.p5.title', 'Building a Locksmith Business'),
                description: _t('courses.p5.description', 'Learn the essentials of starting and operating a locksmith business, including licensing considerations, pricing fundamentals, customer communication, and marketing basics.'),
                features: [
                    _t('courses.p5.f1', 'Licensing and business setup considerations'),
                    _t('courses.p5.f2', 'Pricing and service presentation'),
                    _t('courses.p5.f3', 'Customer relations and basic marketing')
                ],
                cta: { label: _t('courses.cta', 'Get Started'), event: 'courses:business' }
            }
        ]
    };
}

window.app.courses = buildCourses();

document.addEventListener('i18n:changed', function() {
    window.app.courses = buildCourses();
});
