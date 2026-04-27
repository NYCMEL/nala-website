// news.config.js
// Localized article content for the About page carousel and article detail view.

(function () {
    'use strict';

    var lang = (window.i18n && typeof window.i18n.getLang === 'function') ? window.i18n.getLang() : 'en';

    var content = {
        en: {
            page: {
                title: 'News & Articles',
                subtitle: 'Stay up to date with the latest from NALA'
            },
            articles: [
                {
                    id: 'nala-certification-expansion',
                    icon: 'article',
                    category: 'Industry News',
                    date: 'April 15, 2026',
                    title: 'NALA Expands Certification Access Nationwide',
                    excerpt: 'NALA is broadening access to structured locksmith training so more learners can prepare for professional work from anywhere.',
                    body: [
                        'NALA is expanding online access to its locksmith training program, giving students a clearer path into residential, commercial, safe, and automotive fundamentals.',
                        'The program is designed for learners who need flexible study time without losing structure. Video lessons, checkpoints, and exams help students measure progress as they move through the course.',
                        'Because licensing rules vary by state and city, students should still confirm local requirements before offering services professionally.'
                    ]
                },
                {
                    id: 'home-security-upgrades-2026',
                    icon: 'security',
                    category: 'Security Tips',
                    date: 'April 10, 2026',
                    title: 'Home Security Upgrades Worth Reviewing in 2026',
                    excerpt: 'A practical look at locks, doors, lighting, and access-control habits that can improve everyday home security.',
                    body: [
                        'Strong security starts with the basics: properly installed deadbolts, reinforced strike plates, reliable door hardware, and keys that are carefully controlled.',
                        'Smart locks and keypads can add convenience, but they work best when paired with good physical hardware and clear household access rules.',
                        'Homeowners should review doors, windows, lighting, and emergency access plans regularly, especially after moving into a new property or changing tenants.'
                    ]
                },
                {
                    id: 'locksmith-business-digital-age',
                    icon: 'business_center',
                    category: 'Business',
                    date: 'April 5, 2026',
                    title: 'Growing a Locksmith Business in a Digital Age',
                    excerpt: 'Digital booking, clear service pages, reviews, and customer communication all help modern locksmith businesses earn trust.',
                    body: [
                        'A professional locksmith business needs more than technical skill. Customers also look for clear pricing, fast communication, credible reviews, and an easy way to request service.',
                        'A focused online presence can explain available services, coverage areas, emergency response options, and licensing information before the customer calls.',
                        'The most effective operators combine strong field work with organized scheduling, consistent follow-up, and a professional presentation at every touchpoint.'
                    ]
                },
                {
                    id: 'new-online-training-courses',
                    icon: 'school',
                    category: 'Training',
                    date: 'March 28, 2026',
                    title: 'Online Locksmith Training Built for Real Practice',
                    excerpt: 'The course combines video instruction with checkpoints so learners can review techniques and build confidence step by step.',
                    body: [
                        'Online training works best when each lesson connects directly to a real task. NALA lessons are organized around practical concepts learners are likely to see in the field.',
                        'Students can pause, replay, and revisit lessons while building a stronger understanding of lock mechanisms, tools, service workflow, and safety practices.',
                        'Structured exams and course checkpoints help students confirm what they understand before moving forward.'
                    ]
                },
                {
                    id: 'licensing-requirements-update',
                    icon: 'gavel',
                    category: 'Legislation',
                    date: 'March 20, 2026',
                    title: 'Locksmith Licensing: What Students Should Check',
                    excerpt: 'Licensing requirements can change by location, so students should verify local rules before offering locksmith services.',
                    body: [
                        'Locksmith licensing rules are not the same everywhere. Some states or cities require registration, background checks, insurance, exams, or business permits.',
                        'Training can help prepare students with practical knowledge, but it does not replace legal requirements in the area where they plan to work.',
                        'Before advertising services, learners should check state, county, and city rules and keep records of any licenses or approvals they receive.'
                    ]
                },
                {
                    id: 'annual-conference-2026',
                    icon: 'emoji_events',
                    category: 'Events',
                    date: 'March 12, 2026',
                    title: 'NALA Annual Conference 2026: Save the Date',
                    excerpt: 'The annual conference brings together training, professional networking, and industry updates for locksmith learners and professionals.',
                    body: [
                        'The NALA Annual Conference is planned as a professional gathering for locksmith learners, instructors, and working technicians.',
                        'Attendees can expect training sessions, product conversations, business discussions, and opportunities to meet others in the industry.',
                        'More details will be shared as event planning continues.'
                    ]
                }
            ]
        },
        es: {
            page: {
                title: 'Noticias y Artículos',
                subtitle: 'Mantente al día con las novedades de NALA'
            },
            articles: [
                {
                    id: 'nala-certification-expansion',
                    icon: 'article',
                    category: 'Noticias de la Industria',
                    date: '15 de abril de 2026',
                    title: 'NALA amplía el acceso a la certificación en todo el país',
                    excerpt: 'NALA amplía el acceso a una formación estructurada en cerrajería para que más estudiantes puedan prepararse desde cualquier lugar.',
                    body: [
                        'NALA está ampliando el acceso en línea a su programa de cerrajería, ofreciendo a los estudiantes un camino más claro hacia los fundamentos residenciales, comerciales, automotrices y de cajas fuertes.',
                        'El programa está diseñado para quienes necesitan estudiar con flexibilidad sin perder estructura. Las lecciones en video, los puntos de control y los exámenes ayudan a medir el progreso durante el curso.',
                        'Como las reglas de licencia varían según el estado y la ciudad, los estudiantes deben confirmar los requisitos locales antes de ofrecer servicios profesionalmente.'
                    ]
                },
                {
                    id: 'home-security-upgrades-2026',
                    icon: 'security',
                    category: 'Consejos de Seguridad',
                    date: '10 de abril de 2026',
                    title: 'Mejoras de seguridad para el hogar que vale la pena revisar en 2026',
                    excerpt: 'Una mirada práctica a cerraduras, puertas, iluminación y hábitos de control de acceso que pueden mejorar la seguridad diaria del hogar.',
                    body: [
                        'La seguridad sólida comienza con lo básico: cerrojos bien instalados, placas de cierre reforzadas, herrajes confiables y llaves cuidadosamente controladas.',
                        'Las cerraduras inteligentes y los teclados pueden aportar comodidad, pero funcionan mejor cuando se combinan con buen hardware físico y reglas claras de acceso en el hogar.',
                        'Los propietarios deben revisar puertas, ventanas, iluminación y planes de acceso de emergencia con regularidad, especialmente después de mudarse o cambiar de inquilinos.'
                    ]
                },
                {
                    id: 'locksmith-business-digital-age',
                    icon: 'business_center',
                    category: 'Negocios',
                    date: '5 de abril de 2026',
                    title: 'Cómo hacer crecer un negocio de cerrajería en la era digital',
                    excerpt: 'Las reservas digitales, las páginas de servicio claras, las reseñas y la comunicación con clientes ayudan a ganar confianza.',
                    body: [
                        'Un negocio profesional de cerrajería necesita más que habilidad técnica. Los clientes también buscan precios claros, comunicación rápida, reseñas confiables y una forma sencilla de solicitar servicio.',
                        'Una presencia en línea enfocada puede explicar servicios disponibles, áreas de cobertura, opciones de emergencia e información de licencia antes de que el cliente llame.',
                        'Los operadores más efectivos combinan buen trabajo en campo con programación organizada, seguimiento constante y una presentación profesional en cada contacto.'
                    ]
                },
                {
                    id: 'new-online-training-courses',
                    icon: 'school',
                    category: 'Capacitación',
                    date: '28 de marzo de 2026',
                    title: 'Capacitación en cerrajería en línea diseñada para la práctica real',
                    excerpt: 'El curso combina instrucción en video con puntos de control para que los estudiantes repasen técnicas y desarrollen confianza paso a paso.',
                    body: [
                        'La capacitación en línea funciona mejor cuando cada lección se conecta directamente con una tarea real. Las lecciones de NALA están organizadas alrededor de conceptos prácticos que los estudiantes probablemente verán en el campo.',
                        'Los estudiantes pueden pausar, repetir y revisar las lecciones mientras fortalecen su comprensión de mecanismos de cerraduras, herramientas, flujo de servicio y prácticas de seguridad.',
                        'Los exámenes estructurados y los puntos de control del curso ayudan a confirmar lo aprendido antes de avanzar.'
                    ]
                },
                {
                    id: 'licensing-requirements-update',
                    icon: 'gavel',
                    category: 'Legislación',
                    date: '20 de marzo de 2026',
                    title: 'Licencias de cerrajería: lo que los estudiantes deben verificar',
                    excerpt: 'Los requisitos de licencia pueden cambiar según la ubicación, por lo que conviene verificar las reglas locales antes de ofrecer servicios.',
                    body: [
                        'Las reglas de licencia para cerrajeros no son iguales en todas partes. Algunos estados o ciudades exigen registro, verificación de antecedentes, seguro, exámenes o permisos comerciales.',
                        'La capacitación puede preparar a los estudiantes con conocimientos prácticos, pero no reemplaza los requisitos legales del lugar donde planean trabajar.',
                        'Antes de anunciar servicios, los estudiantes deben revisar las reglas estatales, del condado y de la ciudad, y guardar registros de cualquier licencia o aprobación recibida.'
                    ]
                },
                {
                    id: 'annual-conference-2026',
                    icon: 'emoji_events',
                    category: 'Eventos',
                    date: '12 de marzo de 2026',
                    title: 'Conferencia Anual NALA 2026: reserva la fecha',
                    excerpt: 'La conferencia anual reúne capacitación, contactos profesionales y novedades de la industria para estudiantes y profesionales de la cerrajería.',
                    body: [
                        'La Conferencia Anual de NALA está planificada como un encuentro profesional para estudiantes, instructores y técnicos de cerrajería.',
                        'Los asistentes podrán esperar sesiones de capacitación, conversaciones sobre productos, discusiones de negocios y oportunidades para conocer a otras personas de la industria.',
                        'Se compartirán más detalles a medida que avance la planificación del evento.'
                    ]
                }
            ]
        }
    };

    var selected = content[lang] || content.en;

    window.NEWS_CONFIG = {
        page: selected.page,
        articles: selected.articles.map(function (article) {
            return Object.assign({}, article, {
                body: article.body.map(function (paragraph) {
                    return '<p>' + paragraph + '</p>';
                }).join('')
            });
        })
    };
})();
