/**
 * ============================================================
 * i18n.js  —  NALA Website Internationalisation Engine
 * https://github.com/NYCMEL/nala-website
 *
 * HOW IT WORKS
 * ─────────────
 * 1. Load this file BEFORE any component scripts.
 * 2. Add  data-i18n="key"           to any element whose textContent to translate.
 *    Add  data-i18n-placeholder="key" to translate placeholder attributes.
 *    Add  data-i18n-aria="key"       to translate aria-label attributes.
 * 3. Call  i18n.setLang('es')  /  i18n.setLang('en')  at any time.
 * 4. Component config objects are patched automatically via  i18n.applyConfig()
 *    — each config key is looked up in the dictionary and overwritten if found.
 *
 * LANGUAGE DETECTION ORDER
 * ─────────────────────────
 *   1. localStorage item  nala_lang
 *   2. ?lang=  query-string parameter
 *   3. Browser navigator.language  (es-* → 'es', else 'en')
 *   4. Default: 'en'
 * ============================================================
 */

(function (global) {
  'use strict';

  // ── Dictionary ─────────────────────────────────────────────────
  var DICT = {

    // ── GLOBAL / LOADING ──────────────────────────────────────────
    'loading.message': {
      en: 'Loading in progress. Please wait...',
      es: 'Cargando, por favor espere...'
    },

    // ── HEADER – PUBLIC ───────────────────────────────────────────
    'nav.home': {
      en: 'Home',
      es: 'Inicio'
    },
    'nav.register': {
      en: 'Register',
      es: 'Registrarse'
    },
    'nav.login': {
      en: 'Login',
      es: 'Iniciar Sesión'
    },
    'nav.toggle': {
      en: 'Toggle navigation',
      es: 'Alternar navegación'
    },

    // ── HEADER – PRIVATE ──────────────────────────────────────────
    'nav.dashboard': {
      en: 'Dashboard',
      es: 'Panel'
    },
    'nav.curriculum': {
      en: 'Curriculum',
      es: 'Currículo'
    },
    'nav.logout': {
      en: 'Logout',
      es: 'Cerrar Sesión'
    },

    // ── HERO ──────────────────────────────────────────────────────
    'hero.title': {
      en: 'Master the art of professional locksmithing',
      es: 'Domina el arte del cerrajero profesional'
    },
    'hero.description': {
      en: 'Join thousands of students learning modern security technology with bilingual courses, hands-on training, and industry-recognized certifications.',
      es: 'Únete a miles de estudiantes que aprenden tecnología de seguridad moderna con cursos bilingües, entrenamiento práctico y certificaciones reconocidas por la industria.'
    },
    'hero.cta': {
      en: 'Get Started',
      es: 'Comenzar'
    },

    // ── STATS ─────────────────────────────────────────────────────
    'stats.students': {
      en: 'Students Trained',
      es: 'Estudiantes Capacitados'
    },
    'stats.placement': {
      en: 'Job Placement',
      es: 'Inserción Laboral'
    },
    'stats.experience': {
      en: 'Years Experience',
      es: 'Años de Experiencia'
    },

    // ── CAROUSEL SECTION ──────────────────────────────────────────
    'carousel.heading': {
      en: 'Paths to Success',
      es: 'Caminos hacia el Éxito'
    },
    'carousel.intro': {
      en: 'Our Locksmith course is built to take you from curiosity to real-world readiness with a clear, practical approach. Whether you are new to the trade or sharpening existing skills, the course focuses on what matters on the job. You learn how locks work, how to diagnose issues quickly, and how to handle common residential, commercial, and automotive services with confidence.',
      es: 'Nuestro curso de Cerrajería está diseñado para llevarte de la curiosidad a la preparación para el mundo real con un enfoque claro y práctico. Ya sea que seas nuevo en el oficio o estés perfeccionando habilidades existentes, el curso se enfoca en lo que importa en el trabajo. Aprenderás cómo funcionan las cerraduras, cómo diagnosticar problemas rápidamente y cómo manejar con confianza los servicios residenciales, comerciales y automotrices más comunes.'
    },
    'carousel.btn.prev': {
      en: 'Previous',
      es: 'Anterior'
    },
    'carousel.btn.next': {
      en: 'Next',
      es: 'Siguiente'
    },

    // Carousel slides
    'carousel.slide1.title': {
      en: 'Career Switcher',
      es: 'Cambio de Carrera'
    },
    'carousel.slide1.body': {
      en: 'Someone leaving an office or retail job uses the program to learn residential and commercial locksmithing fundamentals. By following the structured lessons and practicing alongside the videos, they build confidence handling basic service calls and entry-level jobs.',
      es: 'Alguien que deja un trabajo de oficina o tienda utiliza el programa para aprender los fundamentos de cerrajería residencial y comercial. Siguiendo las lecciones estructuradas y practicando junto a los videos, desarrolla confianza para manejar llamadas de servicio básicas y trabajos de nivel inicial.'
    },
    'carousel.slide2.title': {
      en: 'Handyman Expanding Services',
      es: 'Mantenimiento Expandiendo Servicios'
    },
    'carousel.slide2.body': {
      en: 'A general handyman uses the program to add locksmithing as a paid service. Residential rekeying, deadbolt installation, and keypad locks become add-on services that increase the value of each job.',
      es: 'Un handyman general utiliza el programa para agregar la cerrajería como servicio remunerado. El reclave residencial, la instalación de cerrojos y las cerraduras con teclado se convierten en servicios adicionales que aumentan el valor de cada trabajo.'
    },
    'carousel.slide3.title': {
      en: 'Automotive Focus',
      es: 'Enfoque Automotriz'
    },
    'carousel.slide3.body': {
      en: 'A learner with an interest in cars focuses on the automotive sections of the program to understand vehicle entry methods, key types, and modern locking systems, using the training as a foundation for further hands-on experience.',
      es: 'Un estudiante con interés en los automóviles se enfoca en las secciones automotrices del programa para comprender métodos de acceso a vehículos, tipos de llaves y sistemas de bloqueo modernos, usando el entrenamiento como base para mayor experiencia práctica.'
    },
    'carousel.slide4.title': {
      en: 'Business Builder',
      es: 'Constructor de Negocios'
    },
    'carousel.slide4.body': {
      en: 'Someone with technical skills but no business background follows the business modules to understand pricing, licensing considerations, customer communication, and marketing fundamentals before launching a locksmith service.',
      es: 'Alguien con habilidades técnicas pero sin experiencia empresarial sigue los módulos de negocios para entender precios, consideraciones de licencias, comunicación con clientes y fundamentos de marketing antes de lanzar un servicio de cerrajería.'
    },
    'carousel.slide5.title': {
      en: 'Supplemental Trade Skill',
      es: 'Habilidad Comercial Complementaria'
    },
    'carousel.slide5.body': {
      en: 'An electrician or security technician uses the program to better understand locks, doors, and access control hardware, allowing them to coordinate more effectively on job sites and offer broader solutions.',
      es: 'Un electricista o técnico de seguridad usa el programa para comprender mejor cerraduras, puertas y hardware de control de acceso, permitiéndoles coordinarse de manera más efectiva en obras y ofrecer soluciones más amplias.'
    },

    // ── ABOUT / BENEFITS ──────────────────────────────────────────
    'about.title1': {
      en: 'Locksmith Training',
      es: 'Entrenamiento en Cerrajería'
    },
    'about.body1': {
      en: 'Professional Locksmith Training Online, Structured, Measurable. A step-by-step program covering Residential, Commercial, Safes, and Automotive fundamentals, supported by US-style exams and checkpoints throughout the course.',
      es: 'Entrenamiento profesional en cerrajería en línea: estructurado y medible. Un programa paso a paso que cubre los fundamentos de cerrajería residencial, comercial, cajas fuertes y automotriz, con exámenes al estilo estadounidense y puntos de control a lo largo del curso.'
    },
    'about.cta.start': {
      en: 'Get Started',
      es: 'Comenzar'
    },
    'about.cta.program': {
      en: 'Our Program',
      es: 'Nuestro Programa'
    },
    'about.title2': {
      en: 'Who will benefit',
      es: '¿Quién se beneficia?'
    },
    'about.body2a': {
      en: 'This program is designed for beginners and learners who want a clear, structured path to professional growth. Progress is measured through US-style exams and checkpoints built directly into the course, ensuring real understanding along the way.',
      es: 'Este programa está diseñado para principiantes y personas que desean un camino claro y estructurado hacia el crecimiento profesional. El progreso se mide a través de exámenes al estilo estadounidense y puntos de control integrados directamente en el curso, asegurando una comprensión real en cada etapa.'
    },
    'about.body2b': {
      en: 'The entire program is fully online and self-paced, allowing you to learn at your own speed and replay lessons anytime. Please note that the program does not replace licensing requirements, which vary by state or city, so it is important to verify your local regulations.',
      es: 'Todo el programa es completamente en línea y a tu propio ritmo, lo que te permite aprender a tu velocidad y repetir las lecciones cuando quieras. Ten en cuenta que el programa no reemplaza los requisitos de licencia, los cuales varían según el estado o ciudad, por lo que es importante verificar las regulaciones locales.'
    },

    // ── TILE / WHY CHOOSE ─────────────────────────────────────────
    'tile.heading': {
      en: 'Why Choose Our Program',
      es: 'Por Qué Elegir Nuestro Program'
    },
    'tile.subheading': {
      en: 'Online . Self-Paced . Exams included',
      es: 'En línea · A tu propio ritmo · Exámenes incluidos'
    },
    'tile.1.front': {
      en: 'Training Built for Real Service Calls',
      es: 'Entrenamiento para Servicios Reales'
    },
    'tile.1.back': {
      en: 'Lessons are structured around real locksmith tasks such as rekeying, lock installation, hardware replacement, and troubleshooting, helping learners understand how concepts apply in the field.',
      es: 'Las lecciones están estructuradas en torno a tareas reales de cerrajería como reclave, instalación de cerraduras, reemplazo de hardware y resolución de problemas, ayudando a los estudiantes a entender cómo se aplican los conceptos en el campo.'
    },
    'tile.2.front': {
      en: 'Step-by-Step Video with Clear Instructions',
      es: 'Videos Paso a Paso con Instrucciones Claras'
    },
    'tile.2.back': {
      en: 'Each topic is broken down into focused lessons with visual demonstrations, allowing students to pause, review, and revisit techniques as often as needed.',
      es: 'Cada tema se divide en lecciones enfocadas con demostraciones visuales, permitiendo a los estudiantes pausar, revisar y repasar técnicas tantas veces como sea necesario.'
    },
    'tile.3.front': {
      en: 'Residential, Commercial & Automotive Coverage',
      es: 'Cobertura Residencial, Comercial y Automotriz'
    },
    'tile.3.back': {
      en: 'The program spans multiple locksmithing disciplines, giving learners exposure to the most common job types encountered in residential, commercial, and automotive work.',
      es: 'El programa abarca múltiples disciplinas de cerrajería, brindando a los estudiantes exposición a los tipos de trabajo más comunes en cerrajería residencial, comercial y automotriz.'
    },
    'tile.4.front': {
      en: 'Bilingual Learning Environment',
      es: 'Entorno de Aprendizaje Bilingüe'
    },
    'tile.4.back': {
      en: 'All lessons are available in English and Spanish, supporting individuals and teams who prefer or require bilingual instruction.',
      es: 'Todas las lecciones están disponibles en inglés y español, apoyando a personas y equipos que prefieren o requieren instrucción bilingüe.'
    },
    'tile.5.front': {
      en: 'Self-Paced Structured Curriculum',
      es: 'Currículo Estructurado a Tu Propio Ritmo'
    },
    'tile.5.back': {
      en: 'Students progress through a clearly organized curriculum at their own pace, making it possible to balance learning with work or other commitments.',
      es: 'Los estudiantes avanzan a través de un currículo claramente organizado a su propio ritmo, haciendo posible equilibrar el aprendizaje con el trabajo u otros compromisos.'
    },
    'tile.6.front': {
      en: 'Business & Professional Foundations Included',
      es: 'Fundamentos de Negocios y Profesionalismo Incluidos'
    },
    'tile.6.back': {
      en: 'In addition to technical skills, the program introduces business concepts such as licensing considerations, pricing, customer relations, and service presentation.',
      es: 'Además de las habilidades técnicas, el programa introduce conceptos de negocios como consideraciones de licencias, precios, relaciones con clientes y presentación de servicios.'
    },

    // ── BUSINESS IN A BOX ─────────────────────────────────────────
    'biz.heading': {
      en: 'Your business in a box',
      es: 'Tu negocio en una caja'
    },
    'biz.cta': {
      en: 'Make it your own',
      es: 'Hazlo tuyo'
    },

    // ── COURSES ───────────────────────────────────────────────────
    'courses.title': {
      en: 'Included in the Program',
      es: 'Incluido en el Programa'
    },
    'courses.description': {
      en: 'One complete locksmith training program, organized into five connected parts that build practical skills from the fundamentals through business readiness.',
      es: 'Un programa completo de cerrajería, organizado en cinco partes conectadas que desarrollan habilidades prácticas desde los fundamentos hasta la preparación empresarial.'
    },
    'courses.p1.level': { en: 'Part I',   es: 'Parte I' },
    'courses.p1.title': { en: 'Introduction to Locksmithing', es: 'Introducción a la Cerrajería' },
    'courses.p1.description': {
      en: 'Learn the foundations of locksmithing, including essential tools, common lock types, door hardware basics, and safe professional work practices.',
      es: 'Aprende los fundamentos de la cerrajería, incluyendo herramientas esenciales, tipos comunes de cerraduras, conceptos básicos de herrajes para puertas y prácticas profesionales seguras.'
    },
    'courses.p1.f1': { en: 'Core tools, lock types & terminology', es: 'Herramientas básicas, tipos de cerraduras y terminología' },
    'courses.p1.f2': { en: 'Door hardware and installation basics', es: 'Herrajes para puertas y conceptos de instalación' },
    'courses.p1.f3': { en: 'Preparation for hands-on locksmith work', es: 'Preparación para el trabajo práctico de cerrajería' },
    'courses.p2.level': { en: 'Part II',  es: 'Parte II' },
    'courses.p2.title': { en: 'Residential Locksmithing', es: 'Cerrajería Residencial' },
    'courses.p2.description': {
      en: 'Build practical skills for residential service work, covering cylinders, rekeying fundamentals, deadbolts, and common home lock hardware.',
      es: 'Desarrolla habilidades prácticas para servicios residenciales, incluyendo cilindros, fundamentos de reclave, cerrojos y hardware común para el hogar.'
    },
    'courses.p2.f1': { en: 'Residential cylinders and rekeying concepts', es: 'Cilindros residenciales y conceptos de reclave' },
    'courses.p2.f2': { en: 'Deadbolts, knobs & home hardware',           es: 'Cerrojos, perillas y hardware del hogar' },
    'courses.p2.f3': { en: 'Common residential service scenarios',        es: 'Situaciones comunes de servicio residencial' },
    'courses.p3.level': { en: 'Part III', es: 'Parte III' },
    'courses.p3.title': { en: 'Commercial Locksmithing', es: 'Cerrajería Comercial' },
    'courses.p3.description': {
      en: 'Understand commercial door and lock systems, including door types, keying concepts, and the basics of access control used in commercial environments.',
      es: 'Comprende los sistemas de puertas y cerraduras comerciales, incluyendo tipos de puertas, conceptos de llavería y los fundamentos del control de acceso en entornos comerciales.'
    },
    'courses.p3.f1': { en: 'Commercial doors and hardware',              es: 'Puertas y herrajes comerciales' },
    'courses.p3.f2': { en: 'Key systems and master key concepts',         es: 'Sistemas de llaves y conceptos de llave maestra' },
    'courses.p3.f3': { en: 'Introduction to access control components',   es: 'Introducción a componentes de control de acceso' },
    'courses.p4.level': { en: 'Part IV',  es: 'Parte IV' },
    'courses.p4.title': { en: 'Automotive Locksmithing', es: 'Cerrajería Automotriz' },
    'courses.p4.description': {
      en: 'Learn the fundamentals of automotive locksmithing, including vehicle entry principles, key types, and modern automotive security systems.',
      es: 'Aprende los fundamentos de la cerrajería automotriz, incluyendo principios de acceso a vehículos, tipos de llaves y sistemas modernos de seguridad automotriz.'
    },
    'courses.p4.f1': { en: 'Vehicle entry principles',                   es: 'Principios de acceso a vehículos' },
    'courses.p4.f2': { en: 'Automotive key types and technologies',       es: 'Tipos y tecnologías de llaves automotrices' },
    'courses.p4.f3': { en: 'Modern car locking systems',                  es: 'Sistemas modernos de bloqueo de automóviles' },
    'courses.p5.level': { en: 'Part V',   es: 'Parte V' },
    'courses.p5.title': { en: 'Building a Locksmith Business', es: 'Construyendo un Negocio de Cerrajería' },
    'courses.p5.description': {
      en: 'Learn the essentials of starting and operating a locksmith business, including licensing considerations, pricing fundamentals, customer communication, and marketing basics.',
      es: 'Aprende los fundamentos para iniciar y operar un negocio de cerrajería, incluyendo consideraciones de licencias, precios básicos, comunicación con clientes y marketing básico.'
    },
    'courses.p5.f1': { en: 'Licensing and business setup considerations', es: 'Consideraciones de licencias y configuración del negocio' },
    'courses.p5.f2': { en: 'Pricing and service presentation',            es: 'Precios y presentación de servicios' },
    'courses.p5.f3': { en: 'Customer relations and basic marketing',       es: 'Relaciones con clientes y marketing básico' },
    'courses.cta': { en: 'Get Started', es: 'Comenzar' },

    // ── PATH / PRICING ────────────────────────────────────────────
    'path.heading': {
      en: 'Choose Your Training Package',
      es: 'Elige Tu Paquete de Entrenamiento'
    },
    'path.subheading': {
      en: 'Pick the option that fits your goals—start free, upgrade anytime, or launch with Business-in-a-Box.',
      es: 'Selecciona la opción que mejor se adapte a tus metas — comienza gratis, mejora en cualquier momento, o lanza con Negocio-en-una-Caja.'
    },
    'path.trial.title':       { en: 'Trial',              es: 'Prueba Gratuita' },
    'path.trial.description': {
      en: 'Explore the program with a small preview before you commit.',
      es: 'Explora el programa con una pequeña vista previa antes de comprometerte.'
    },
    'path.trial.f1': { en: 'Introduction to Locksmithing',    es: 'Introducción a la Cerrajería' },
    'path.trial.f2': { en: '3 free lessons',                  es: '3 lecciones gratuitas' },
    'path.trial.f3': { en: 'Preview the learning platform',   es: 'Vista previa de la plataforma de aprendizaje' },
    'path.trial.f4': { en: 'Upgrade anytime',                 es: 'Mejora en cualquier momento' },
    'path.premium.title':       { en: 'Premium', es: 'Premium' },
    'path.premium.period': {
      en: 'One-time payment · financing up to 24 months available via Klarna',
      es: 'Pago único · financiamiento hasta 24 meses disponible a través de Klarna'
    },
    'path.premium.description': {
      en: 'Full program access with a certificate of completion.',
      es: 'Acceso completo al programa con certificado de finalización.'
    },
    'path.premium.f1': { en: 'Full program access (all 5 parts)', es: 'Acceso completo al programa (las 5 partes)' },
    'path.premium.f2': { en: 'Full access included',               es: 'Acceso total incluido' },
    'path.premium.f3': { en: 'Certificate of completion',          es: 'Certificado de finalización' },
    'path.premium.f4': { en: 'Learn at your own pace',             es: 'Aprende a tu propio ritmo' },
    'path.premium.f5': { en: 'Free lockout kit gift included',     es: 'Kit de lockout de regalo incluido' },
    'path.business.title':       { en: 'Business-in-a-Box',       es: 'Negocio en una Caja' },
    'path.business.period': {
      en: 'One-time payment · financing up to 24 months available via Klarna',
      es: 'Pago único · financiamiento hasta 24 meses disponible a través de Klarna'
    },
    'path.business.description': {
      en: 'Everything in Premium, plus tools to help you launch your locksmith business.',
      es: 'Todo lo incluido en Premium, más herramientas para lanzar tu negocio de cerrajería.'
    },
    'path.business.f1': { en: 'Everything included in Premium',       es: 'Todo incluido en Premium' },
    'path.business.f2': { en: 'Pre-built locksmith website',           es: 'Sitio web de cerrajería pre-construido' },
    'path.business.f3': { en: 'Business card and branding templates',  es: 'Plantillas de tarjetas de presentación y marca' },
    'path.business.f4': { en: 'Service pricing starter framework',     es: 'Marco inicial de precios de servicios' },
    'path.business.f5': { en: 'Marketing launch checklist',            es: 'Lista de verificación de lanzamiento de marketing' },
    'path.cta': { en: 'Get Started', es: 'Comenzar' },

    // ── CERTIFICATION ─────────────────────────────────────────────
    'cert.section.title': {
      en: 'NALA Certification',
      es: 'Certificación NALA'
    },
    'cert.about.title': {
      en: 'About Our Certification',
      es: 'Sobre Nuestra Certificación'
    },
    'cert.about.body': {
      en: 'The NALA Certification recognizes successful completion of a structured, skills-focused locksmith training program designed to prepare students for real-world professional work. This certification confirms that the holder has demonstrated competency across core locksmith disciplines, including residential, commercial, and automotive services. Unlike purely theoretical credentials, the NALA Certification emphasizes practical understanding, industry terminology, and correct professional procedures. Graduates complete guided instruction, applied exercises, and assessments that reflect the standards expected in the field. Earning this certification signals commitment to professional development and readiness to operate with confidence, safety, and technical accuracy. It serves as a meaningful milestone for individuals entering the locksmith trade or advancing their existing skills.',
      es: 'La Certificación NALA reconoce la finalización exitosa de un programa de entrenamiento en cerrajería estructurado y orientado a las habilidades, diseñado para preparar a los estudiantes para el trabajo profesional en el mundo real. Esta certificación confirma que el titular ha demostrado competencia en las principales disciplinas de cerrajería, incluyendo servicios residenciales, comerciales y automotrices. A diferencia de las credenciales puramente teóricas, la Certificación NALA enfatiza la comprensión práctica, la terminología de la industria y los procedimientos profesionales correctos. Los graduados completan instrucción guiada, ejercicios aplicados y evaluaciones que reflejan los estándares esperados en el campo. Obtener esta certificación es una señal de compromiso con el desarrollo profesional y de estar preparado para operar con confianza, seguridad y precisión técnica. Sirve como un hito significativo para las personas que ingresan al oficio de cerrajero o que están avanzando en sus habilidades existentes.'
    },
    'cert.cards.title': {
      en: 'Industry-Recognized Certifications',
      es: 'Certificaciones Reconocidas por la Industria'
    },
    'cert.cards.subtitle': {
      en: 'Earn credentials that employers trust and value',
      es: 'Obtén credenciales en las que empleadores confían y valoran'
    },
    'cert.c1.title': { en: 'Certified Locksmith Technician',  es: 'Técnico Cerrajero Certificado' },
    'cert.c1.description': {
      en: 'Entry-level certification covering fundamental locksmithing skills, ethics, and safety protocols.',
      es: 'Certificación de nivel inicial que cubre habilidades fundamentales de cerrajería, ética y protocolos de seguridad.'
    },
    'cert.c1.f1': { en: 'Basic lock mechanisms',    es: 'Mecanismos básicos de cerraduras' },
    'cert.c1.f2': { en: 'Key cutting and duplication', es: 'Corte y duplicación de llaves' },
    'cert.c1.f3': { en: 'Professional standards',   es: 'Estándares profesionales' },
    'cert.c2.title': { en: 'Advanced Security Professional', es: 'Profesional Avanzado en Seguridad' },
    'cert.c2.description': {
      en: 'Comprehensive certification for commercial security systems and access control.',
      es: 'Certificación integral para sistemas de seguridad comercial y control de acceso.'
    },
    'cert.c2.f1': { en: 'Master key systems',          es: 'Sistemas de llave maestra' },
    'cert.c2.f2': { en: 'Electronic access control',   es: 'Control de acceso electrónico' },
    'cert.c2.f3': { en: 'Security consulting',          es: 'Consultoría en seguridad' },
    'cert.c3.title': { en: 'Automotive Locksmith Specialist', es: 'Especialista en Cerrajería Automotriz' },
    'cert.c3.description': {
      en: 'Specialized training in modern vehicle security systems and key programming.',
      es: 'Entrenamiento especializado en sistemas de seguridad modernos para vehículos y programación de llaves.'
    },
    'cert.c3.f1': { en: 'Transponder programming', es: 'Programación de transponder' },
    'cert.c3.f2': { en: 'Ignition repair',          es: 'Reparación de encendido' },
    'cert.c3.f3': { en: 'Smart key systems',        es: 'Sistemas de llave inteligente' },
    'cert.c4.title': { en: 'Safe & Vault Technician', es: 'Técnico de Cajas Fuertes y Bóvedas' },
    'cert.c4.description': {
      en: 'Expert-level certification for working with safes, vaults, and high-security locks.',
      es: 'Certificación de nivel experto para trabajar con cajas fuertes, bóvedas y cerraduras de alta seguridad.'
    },
    'cert.c4.f1': { en: 'Safe opening techniques', es: 'Técnicas de apertura de cajas fuertes' },
    'cert.c4.f2': { en: 'Combination changes',      es: 'Cambios de combinación' },
    'cert.c4.f3': { en: 'High-security systems',    es: 'Sistemas de alta seguridad' },

    // ── READY / CTA SECTION ───────────────────────────────────────
    'ready.title': {
      en: 'Ready to Start Your Locksmith Career?',
      es: '¿Listo para Comenzar tu Carrera como Cerrajero?'
    },
    'ready.description': {
      en: 'Join NALA today and unlock your potential with industry-leading training and support.',
      es: 'Únete a NALA hoy y desbloquea tu potencial con capacitación líder en la industria y apoyo continuo.'
    },
    'ready.cta': {
      en: 'Get Started Today',
      es: 'Empieza Hoy'
    },

    // ── FOOTER ───────────────────────────────────────────────────
    'footer.contact.title': { en: 'Contact Information',  es: 'Información de Contacto' },
    'footer.social.title':  { en: 'Social Media',         es: 'Redes Sociales' },
    'footer.brand.desc': {
      en: 'NALA empowers locksmith professionals through education, certification, and industry leadership. 2026 All Rights Reserved',
      es: 'NALA empodera a los profesionales cerrajeros a través de educación, certificación y liderazgo en la industria. 2026 Todos los derechos reservados'
    },
    'footer.copyright': {
      en: '2026 NALA - North America Locksmith Association',
      es: '2026 NALA - Asociación Norteamericana de Cerrajeros'
    },

    // ── LOGIN ─────────────────────────────────────────────────────
    'login.title':               { en: 'Welcome Back',            es: 'Bienvenido de Nuevo' },
    'login.email.label':         { en: 'Email',                   es: 'Correo Electrónico' },
    'login.email.placeholder':   { en: 'Enter your email',        es: 'Ingresa tu correo' },
    'login.password.label':      { en: 'Password',                es: 'Contraseña' },
    'login.password.placeholder':{ en: 'Enter your password',     es: 'Ingresa tu contraseña' },
    'login.submit':              { en: 'Login',                   es: 'Iniciar Sesión' },
    'login.forgot':              { en: 'Forgot Password?',        es: '¿Olvidaste tu contraseña?' },
    'login.register':            { en: "Don't have an account? Register", es: '¿No tienes cuenta? Regístrate' },
    'login.forgot.title':        { en: 'Reset Your Password',     es: 'Restablecer tu Contraseña' },
    'login.forgot.emailLabel':   { en: 'Please provide email used to login with NALA', es: 'Ingresa el correo con el que te registraste en NALA' },
    'login.forgot.placeholder':  { en: 'Enter your email',        es: 'Ingresa tu correo' },
    'login.forgot.helpText':     { en: 'After submitting your email, we will send you a link to update/reset your password', es: 'Al enviar tu correo, te enviaremos un enlace para actualizar/restablecer tu contraseña' },
    'login.forgot.submit':       { en: 'Submit',                  es: 'Enviar' },
    'login.forgot.cancel':       { en: 'Cancel',                  es: 'Cancelar' },

    // Login validation
    'login.error.email.required': { en: 'Email is required',     es: 'El correo es obligatorio' },
    'login.error.email.invalid':  { en: 'Invalid email format',  es: 'Formato de correo inválido' },
    'login.error.password.required': { en: 'Password is required', es: 'La contraseña es obligatoria' },

    // ── REGISTER ──────────────────────────────────────────────────
    'register.title':          { en: 'NALA Registration Form',         es: 'Formulario de Registro NALA' },
    'register.name.label':     { en: 'Name',                           es: 'Nombre' },
    'register.name.helper':    { en: 'First Name, Middle Initial, Last Name', es: 'Nombre, Inicial del Apellido Paterno, Apellido' },
    'register.email.label':    { en: 'Your Email',                     es: 'Tu Correo' },
    'register.email.helper':   { en: 'example@example.com',            es: 'ejemplo@ejemplo.com' },
    'register.email2.label':   { en: 'Repeat Email',                   es: 'Repetir Correo' },
    'register.email2.helper':  { en: '',                               es: '' },
    'register.phone.label':    { en: 'Contact Phone Number',           es: 'Número de Teléfono de Contacto' },
    'register.phone.helper':   { en: 'Phone Number',                   es: 'Número de Teléfono' },
    'register.submit':         { en: 'Register',                       es: 'Registrarse' },
    'register.required':       { en: '*',                              es: '*' },

    // Register validation errors
    'register.error.name.length': { en: 'Name must be at least 3 characters', es: 'El nombre debe tener al menos 3 caracteres' },
    'register.error.email.invalid': { en: 'Enter a valid email address', es: 'Ingresa una dirección de correo válida' },
    'register.error.email.mismatch': { en: 'Emails do not match',       es: 'Los correos no coinciden' },
    'register.error.phone.invalid': { en: 'Enter a valid US phone number', es: 'Ingresa un número de teléfono de EE.UU. válido' },

    // ── DASHBOARD ─────────────────────────────────────────────────
    'dashboard.continue':        { en: 'Continue with Program',         es: 'Continuar con el Programa' },
    'dashboard.progress.label':  { en: 'Your progress to date:',       es: 'Tu progreso hasta la fecha:' },
    'dashboard.course.title':    { en: 'NALA - Locksmith Course',       es: 'NALA - Curso de Cerrajería' },
    'dashboard.subs.title':      { en: 'You can also subscribe to our premium features:', es: 'También puedes suscribirte a nuestras funciones premium:' },
    'dashboard.sub1.title':      { en: 'Premium Courses',               es: 'Cursos Premium' },
    'dashboard.sub1.description':{ en: 'Access advanced courses and certifications', es: 'Accede a cursos avanzados y certificaciones' },
    'dashboard.sub1.price':      { en: '$29.99/month',                  es: '$29.99/mes' },
    'dashboard.sub2.title':      { en: '1-on-1 Mentorship',             es: 'Mentoría Personalizada' },
    'dashboard.sub2.description':{ en: 'Get personalized guidance from experts', es: 'Obtén orientación personalizada de expertos' },
    'dashboard.sub2.price':      { en: '$99.99/month',                  es: '$99.99/mes' },
    'dashboard.sub3.title':      { en: 'Career Services',               es: 'Servicios de Carrera' },
    'dashboard.sub3.description':{ en: 'Resume review, interview prep, and job matching', es: 'Revisión de currículum, preparación para entrevistas y búsqueda de empleo' },
    'dashboard.sub3.price':      { en: '$49.99/month',                  es: '$49.99/mes' },

    // ── SETTINGS ──────────────────────────────────────────────────
    'settings.title':            { en: 'Profile Settings',              es: 'Configuración de Perfil' },
    'settings.privacyTitle':     { en: 'Privacy Settings',              es: 'Configuración de Privacidad' },
    'settings.userName':         { en: 'Full Name',                     es: 'Nombre Completo' },
    'settings.userEmail':        { en: 'Email Address',                 es: 'Correo Electrónico' },
    'settings.currentPassword':  { en: 'Current Password',              es: 'Contraseña Actual' },
    'settings.newPassword':      { en: 'New Password',                  es: 'Nueva Contraseña' },
    'settings.confirmPassword':  { en: 'Confirm New Password',          es: 'Confirmar Nueva Contraseña' },
    'settings.updateButton':     { en: 'Update',                        es: 'Actualizar' },
    'settings.saveButton':       { en: 'Save Changes',                  es: 'Guardar Cambios' },
    'settings.cancelButton':     { en: 'Cancel',                        es: 'Cancelar' },

    // Settings validation strings (from mtk-settings.js)
    'settings.error.minLength':  { en: 'Minimum {n} characters',        es: 'Mínimo {n} caracteres' },
    'settings.error.uppercase':  { en: 'Must contain uppercase letter', es: 'Debe contener una letra mayúscula' },
    'settings.error.lowercase':  { en: 'Must contain lowercase letter', es: 'Debe contener una letra minúscula' },
    'settings.error.number':     { en: 'Must contain number',           es: 'Debe contener un número' },
    'settings.error.noEmail':    { en: 'No account email found for password reset.', es: 'No se encontró correo de cuenta para restablecer la contraseña.' },
    'settings.success.reset':    { en: 'Password reset email sent. Please check your inbox.', es: 'Correo de restablecimiento enviado. Por favor revisa tu bandeja de entrada.' },
    'settings.error.resetFail':  { en: 'Could not send reset link.',    es: 'No se pudo enviar el enlace de restablecimiento.' },

    // ── FINAL / CERTIFICATE ───────────────────────────────────────
    'final.successHeading':      { en: 'Congratulations!',              es: '¡Felicitaciones!' },
    'final.successSubheading':   { en: 'You have successfully completed the course.', es: 'Has completado el curso exitosamente.' },
    'final.currentEmailLabel':   { en: 'Your current email address',    es: 'Tu dirección de correo actual' },
    'final.optionKeep':          { en: 'Send certificate to my current email', es: 'Enviar certificado a mi correo actual' },
    'final.optionNew':           { en: 'Send certificate to a different email', es: 'Enviar certificado a un correo diferente' },
    'final.newEmailLabel':       { en: 'New email address',             es: 'Nueva dirección de correo' },
    'final.newEmailHint':        { en: 'Enter a valid email address',   es: 'Ingresa una dirección de correo válida' },
    'final.confirmEmailLabel':   { en: 'Confirm new email address',     es: 'Confirmar nueva dirección de correo' },
    'final.confirmEmailHint':    { en: 'Re-enter your new email address', es: 'Vuelve a ingresar tu nueva dirección de correo' },
    'final.submitLabel':         { en: 'Send My Certificate',           es: 'Enviar Mi Certificado' },
    'final.successToast':        { en: 'Certificate sent! Check your inbox.', es: '¡Certificado enviado! Revisa tu bandeja de entrada.' },
    'final.requiredError':       { en: 'This field is required.',       es: 'Este campo es obligatorio.' },
    'final.invalidEmailError':   { en: 'Please enter a valid email address.', es: 'Por favor ingresa una dirección de correo válida.' },
    'final.mismatchError':       { en: 'Email addresses do not match.', es: 'Las direcciones de correo no coinciden.' },
    'final.matchConfirmed':      { en: 'Emails match!',                 es: '¡Los correos coinciden!' },

    // ── QUIZ ──────────────────────────────────────────────────────
    'quiz.title':     { en: 'Quiz',     es: 'Examen' },
    'quiz.module':    { en: 'Module:',  es: 'Módulo:' },
    'quiz.questions': { en: 'Questions', es: 'Preguntas' },
    'quiz.session':   { en: 'Session:', es: 'Sesión:' },
    'quiz.progress':  { en: 'Progress', es: 'Progreso' },
    'quiz.cancel':    { en: 'Cancel',   es: 'Cancelar' },
    'quiz.clearAll':  { en: 'Clear All', es: 'Borrar Todo' },
    'quiz.testFirst': { en: 'Test (Select First)', es: 'Probar (Seleccionar Primero)' },
    'quiz.submit':    { en: 'Submit Quiz', es: 'Enviar Examen' },

    // ── DIALOG ────────────────────────────────────────────────────
    'dialog.title':   { en: 'Confirm Action', es: 'Confirmar Acción' },
    'dialog.message': {
      en: 'Are you sure you want to proceed with this action? This cannot be undone.',
      es: '¿Estás seguro de que deseas continuar con esta acción? Esta operación no se puede deshacer.'
    },
    'dialog.cancel':  { en: 'Cancel',  es: 'Cancelar' },
    'dialog.delete':  { en: 'Delete',  es: 'Eliminar' },
    'dialog.confirm': { en: 'Confirm', es: 'Confirmar' },

    // ── GIFT / LOCKOUT KIT ────────────────────────────────────────
    'gift.title':          { en: 'Your Free Lockout Kit',          es: 'Tu Kit de Lockout Gratuito' },
    'gift.subtitle':       { en: "We'll ship it right to your door — completely free.", es: 'Lo enviamos directo a tu puerta — completamente gratis.' },
    'gift.addressLabel':   { en: 'Where do you want us to send your free Lockout Kit?', es: '¿A dónde quieres que enviemos tu Kit de Lockout gratuito?' },
    'gift.field.fullName': { en: 'Full Name',                      es: 'Nombre Completo' },
    'gift.field.address1': { en: 'Street Address',                 es: 'Dirección' },
    'gift.field.address2': { en: 'Apt, Suite, Unit (optional)',    es: 'Apto, Suite, Unidad (opcional)' },
    'gift.field.city':     { en: 'City',                           es: 'Ciudad' },
    'gift.field.state':    { en: 'State',                          es: 'Estado' },
    'gift.field.zip':      { en: 'ZIP Code',                       es: 'Código Postal' },
    'gift.submit':         { en: 'Send My Kit',                    es: 'Enviar Mi Kit' },
    'gift.cancel':         { en: 'Cancel',                         es: 'Cancelar' },
    'gift.success':        { en: 'Your free Lockout Kit is on the way! 🎁', es: '¡Tu Kit de Lockout gratuito está en camino! 🎁' },
    'gift.error':          { en: 'Please fill in all required fields.', es: 'Por favor completa todos los campos requeridos.' },
    'gift.cancelled':      { en: 'Request cancelled.',             es: 'Solicitud cancelada.' },

    // ── MSGS / SYSTEM MESSAGES ────────────────────────────────────
    'msg.info':      { en: 'This is an informational message',           es: 'Este es un mensaje informativo' },
    'msg.warning':   { en: 'Warning: Please review your settings',       es: 'Advertencia: Por favor revisa tu configuración' },
    'msg.error':     { en: 'Error: Something went wrong',                es: 'Error: Algo salió mal' },
    'msg.success':   { en: 'Success: Operation completed',               es: 'Éxito: Operación completada' },
    'msg.autoInfo':  { en: 'This message will close automatically',      es: 'Este mensaje se cerrará automáticamente' },
    'msg.block':     { en: 'Screen is blocked while this message shows', es: 'La pantalla está bloqueada mientras se muestra este mensaje' },
    'msg.block2':    { en: 'Processing... Screen stays blocked after close', es: 'Procesando... La pantalla permanece bloqueada después de cerrar' },
    'msg.btn.learn': { en: 'Learn More',    es: 'Más Información' },
    'msg.btn.review':{ en: 'Review',        es: 'Revisar' },
    'msg.btn.dismiss':{ en: 'Dismiss',      es: 'Descartar' },
    'msg.btn.retry': { en: 'Retry',         es: 'Reintentar' },
    'msg.btn.close': { en: 'Close Message', es: 'Cerrar Mensaje' },

    // ── CURRICULUM PAGE ───────────────────────────────────────────
    'curriculum.welcome':   { en: 'Welcome to NALA Locksmith Training', es: 'Bienvenido al Entrenamiento de Cerrajería NALA' },
    'curriculum.overview':  {
      en: 'Our comprehensive locksmith program combines online education, hands-on workshops, national certification, and business launch preparation. Designed for beginners and professionals, this program ensures you gain both practical skills and professional knowledge.',
      es: 'Nuestro programa completo de cerrajería combina educación en línea, talleres prácticos, certificación nacional y preparación para el lanzamiento de negocios. Diseñado para principiantes y profesionales, este programa garantiza que adquieras tanto habilidades prácticas como conocimiento profesional.'
    },
    'curriculum.duration':  { en: 'Duration: 6–12 months',                       es: 'Duración: 6 a 12 meses' },
    'curriculum.format':    { en: 'Format: Hybrid (Online + Hands-On)',           es: 'Formato: Híbrido (En línea + Práctico)' },
    'curriculum.languages': { en: 'Languages: English & Spanish',                es: 'Idiomas: Inglés y Español' },
    'curriculum.outcome':   { en: 'Outcome: National Certification + Business Readiness', es: 'Resultado: Certificación Nacional + Preparación Empresarial' },
    'curriculum.modules':   { en: 'Course Modules',                              es: 'Módulos del Curso' },
    'curriculum.contact':   { en: 'Contact Us',                                  es: 'Contáctanos' },
    'curriculum.enroll':    { en: 'Enroll Now',                                  es: 'Inscríbete Ahora' },
    'curriculum.enroll.body': {
      en: 'Ready to start your locksmith career? Fill out our enrollment form or contact us for more information.',
      es: '¿Listo para comenzar tu carrera como cerrajero? Completa nuestro formulario de inscripción o contáctanos para más información.'
    },
    'curriculum.enroll.btn': { en: 'Enroll Today', es: 'Inscríbete Hoy' },

    // ── CURRICULUM MODULE DETAIL ───────────────────────────────────
    'curriculum.m1.title':    { en: 'Module 1: Introduction to Locksmithing',              es: 'Módulo 1: Introducción a la Cerrajería' },
    'curriculum.m1.duration': { en: '2 weeks',                                             es: '2 semanas' },
    'curriculum.m1.f1':       { en: 'History of locksmithing',                             es: 'Historia de la cerrajería' },
    'curriculum.m1.f2':       { en: 'Ethics and legal regulations',                        es: 'Ética y regulaciones legales' },
    'curriculum.m1.f3':       { en: 'Overview of locksmith tools',                         es: 'Descripción general de las herramientas del cerrajero' },
    'curriculum.m1.f4':       { en: 'Safety protocols',                                    es: 'Protocolos de seguridad' },
    'curriculum.m1.f5':       { en: 'Types of locks and terminology',                      es: 'Tipos de cerraduras y terminología' },
    'curriculum.m1.f6':       { en: 'Professionalism and customer service',                es: 'Profesionalismo y servicio al cliente' },

    'curriculum.m2.title':    { en: 'Module 2: Residential Locks & Security',              es: 'Módulo 2: Cerraduras Residenciales y Seguridad' },
    'curriculum.m2.duration': { en: '3 weeks',                                             es: '3 semanas' },
    'curriculum.m2.f1':       { en: 'Pin tumbler locks, wafer locks, deadbolts',           es: 'Cerraduras de pines, cerraduras de paletas y cerrojos' },
    'curriculum.m2.f2':       { en: 'Key duplication and key impressioning',               es: 'Duplicación de llaves e impresión de llaves' },
    'curriculum.m2.f3':       { en: 'Lock repair and maintenance',                         es: 'Reparación y mantenimiento de cerraduras' },
    'curriculum.m2.f4':       { en: 'Installing residential security systems',             es: 'Instalación de sistemas de seguridad residencial' },
    'curriculum.m2.f5':       { en: 'Emergency lockout procedures',                        es: 'Procedimientos de emergencia por cierre de puertas' },

    'curriculum.m3.title':    { en: 'Module 3: Commercial Locks & Advanced Mechanisms',    es: 'Módulo 3: Cerraduras Comerciales y Mecanismos Avanzados' },
    'curriculum.m3.duration': { en: '4 weeks',                                             es: '4 semanas' },
    'curriculum.m3.f1':       { en: 'High-security locks and master key systems',          es: 'Cerraduras de alta seguridad y sistemas de llave maestra' },
    'curriculum.m3.f2':       { en: 'Access control systems and electronic locks',         es: 'Sistemas de control de acceso y cerraduras electrónicas' },
    'curriculum.m3.f3':       { en: 'Safe locks and vaults',                               es: 'Cerraduras para cajas fuertes y bóvedas' },
    'curriculum.m3.f4':       { en: 'Lock picking and bypass techniques (legal)',          es: 'Técnicas de ganzúa y bypass (legales)' },

    'curriculum.m4.title':    { en: 'Module 4: Automotive Locksmithing',                   es: 'Módulo 4: Cerrajería Automotriz' },
    'curriculum.m4.duration': { en: '3 weeks',                                             es: '3 semanas' },
    'curriculum.m4.f1':       { en: 'Car locks and ignition systems',                      es: 'Cerraduras de automóviles y sistemas de encendido' },
    'curriculum.m4.f2':       { en: 'Transponder keys and key programming',                es: 'Llaves con transpondedor y programación de llaves' },
    'curriculum.m4.f3':       { en: 'Emergency car lockout procedures',                    es: 'Procedimientos de emergencia por cierre de automóviles' },
    'curriculum.m4.f4':       { en: 'Advanced diagnostic tools',                           es: 'Herramientas de diagnóstico avanzadas' },

    'curriculum.m5.title':    { en: 'Module 5: Locksmith Business & Certification',        es: 'Módulo 5: Negocio de Cerrajería y Certificación' },
    'curriculum.m5.duration': { en: '2 weeks',                                             es: '2 semanas' },
    'curriculum.m5.f1':       { en: 'Business setup and marketing for locksmiths',        es: 'Configuración del negocio y marketing para cerrajeros' },
    'curriculum.m5.f2':       { en: 'Customer service best practices',                     es: 'Mejores prácticas de servicio al cliente' },
    'curriculum.m5.f3':       { en: 'State licensing and national certification preparation', es: 'Licencias estatales y preparación para certificación nacional' },
    'curriculum.m5.f4':       { en: 'Professional ethics and ongoing education',           es: 'Ética profesional y educación continua' },

    'curriculum.duration.label': { en: 'Duration:', es: 'Duración:' },
    'curriculum.contact.email':  { en: 'Email: info@nala-locksmith.com',                   es: 'Correo: info@nala-locksmith.com' },
    'curriculum.contact.addr':   { en: 'Address: 123 Security Blvd, Suite 100, Anytown, USA', es: 'Dirección: 123 Security Blvd, Suite 100, Anytown, USA' },

    // ── TOP / SCROLL BUTTON ────────────────────────────────────────
    'top.scrollBtn': { en: 'Scroll to top', es: 'Volver al inicio' }

  }; // end DICT


  // ── Engine ─────────────────────────────────────────────────────

  var _lang = 'en';

  /**
   * Detect the preferred language from all sources.
   */
  function detectLang() {
    // 1. localStorage
    try {
      var stored = localStorage.getItem('nala_lang');
      if (stored === 'en' || stored === 'es') return stored;
    } catch (e) {}

    // 2. ?lang= query string
    var match = location.search.match(/[?&]lang=(en|es)/);
    if (match) return match[1];

    // 3. Browser language
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.startsWith('es') ? 'es' : 'en';
  }

  /**
   * Look up a key in the dictionary for the current language.
   * Returns the English string as fallback.
   */
  function t(key) {
    var entry = DICT[key];
    if (!entry) {
      console.warn('[i18n] missing key:', key);
      return key;
    }
    return entry[_lang] || entry['en'] || key;
  }

  /**
   * Apply translations to the DOM.
   * Processes data-i18n, data-i18n-placeholder, data-i18n-aria.
   * Safe to call multiple times (re-applies on lang change).
   */
  function applyDOM(root) {
    var ctx = root || document;

    // textContent
    ctx.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key);
      if (val !== key) el.textContent = val;
    });

    // placeholder attribute
    ctx.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var val = t(key);
      if (val !== key) el.setAttribute('placeholder', val);
    });

    // aria-label attribute
    ctx.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      var val = t(key);
      if (val !== key) el.setAttribute('aria-label', val);
    });

    // title attribute
    ctx.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      var val = t(key);
      if (val !== key) el.setAttribute('title', val);
    });
  }

  /**
   * Patch a config object — deeply walk all string values and replace
   * any that match a dictionary key.  This lets component configs stay
   * in English in source and get translated at runtime.
   *
   * Usage in a config file:
   *   window.app.hero = [{ title: 'hero.title', description: 'hero.description', ... }];
   *   i18n.applyConfig(window.app.hero);
   *
   * Or patch a flat object:
   *   i18n.applyConfig(window.app['mtk-login']);
   */
  function applyConfig(obj) {
    if (!obj) return obj;
    if (Array.isArray(obj)) {
      obj.forEach(function (item) { applyConfig(item); });
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach(function (k) {
        var v = obj[k];
        if (typeof v === 'string' && DICT[v]) {
          obj[k] = t(v);
        } else if (typeof v === 'object' || Array.isArray(v)) {
          applyConfig(v);
        }
      });
    }
    return obj;
  }

  /**
   * Patch ALL known window.app config objects that are already loaded.
   * Call after setLang() to update configs that have already initialised.
   */
  function applyAllConfigs() {
    var app = global.window && window.app;
    if (!app) return;

    // Login
    var login = app['mtk-login'];
    if (login) {
      login.title                          = t('login.title');
      login.email.label                    = t('login.email.label');
      login.email.placeholder              = t('login.email.placeholder');
      login.password.label                 = t('login.password.label');
      login.password.placeholder           = t('login.password.placeholder');
      login.submit.label                   = t('login.submit');
      login.links.forgotPassword           = t('login.forgot');
      login.links.register                 = t('login.register');
      login.forgotPassword.title           = t('login.forgot.title');
      login.forgotPassword.emailLabel      = t('login.forgot.emailLabel');
      login.forgotPassword.emailPlaceholder= t('login.forgot.placeholder');
      login.forgotPassword.helpText        = t('login.forgot.helpText');
      login.forgotPassword.submitLabel     = t('login.forgot.submit');
      login.forgotPassword.cancelLabel     = t('login.forgot.cancel');
    }

    // Footer
    if (app.footer) {
      if (app.footer.contact) app.footer.contact.title = t('footer.contact.title');
      if (app.footer.social)  app.footer.social.title  = t('footer.social.title');
      if (app.footer.copyright) app.footer.copyright.text = t('footer.copyright');
      if (app.footer.brand)   app.footer.brand.description = t('footer.brand.desc');
    }

    // Path / Pricing
    if (app.path && app.path.plans) {
      app.path.heading    = t('path.heading');
      app.path.subheading = t('path.subheading');
      var planKeys = { trial: 'trial', premium: 'premium', business: 'business' };
      app.path.plans.forEach(function (plan) {
        var k = planKeys[plan.id] || plan.id;
        if (t('path.' + k + '.title') !== 'path.' + k + '.title') {
          plan.title       = t('path.' + k + '.title');
          plan.description = t('path.' + k + '.description');
          if (plan.period) plan.period = t('path.' + k + '.period');
          plan.cta         = t('path.cta');
        }
      });
    }

    // Dashboard
    var dash = global.window && window.mtkDashboardConfig;
    if (dash) {
      if (dash.progress)      { dash.progress.label     = t('dashboard.progress.label'); dash.progress.courseTitle = t('dashboard.course.title'); }
      if (dash.subscriptions) { dash.subscriptions.title = t('dashboard.subs.title'); }
    }

    // Settings
    var sett = global.window && window.mtkSettingsConfig;
    if (sett && sett.labels) {
      sett.labels.title           = t('settings.title');
      sett.labels.userName        = t('settings.userName');
      sett.labels.userEmail       = t('settings.userEmail');
      sett.labels.currentPassword = t('settings.currentPassword');
      sett.labels.newPassword     = t('settings.newPassword');
      sett.labels.confirmPassword = t('settings.confirmPassword');
      sett.labels.updateButton    = t('settings.updateButton');
      sett.labels.saveButton      = t('settings.saveButton');
      sett.labels.cancelButton    = t('settings.cancelButton');
    }

    // Final / Certificate
    var fin = global.window && window.MTK_FINAL_CONFIG;
    if (fin && fin.strings) {
      fin.strings.successHeading    = t('final.successHeading');
      fin.strings.successSubheading = t('final.successSubheading');
      fin.strings.currentEmailLabel = t('final.currentEmailLabel');
      fin.strings.optionKeep        = t('final.optionKeep');
      fin.strings.optionNew         = t('final.optionNew');
      fin.strings.newEmailLabel     = t('final.newEmailLabel');
      fin.strings.newEmailHint      = t('final.newEmailHint');
      fin.strings.confirmEmailLabel = t('final.confirmEmailLabel');
      fin.strings.confirmEmailHint  = t('final.confirmEmailHint');
      fin.strings.submitLabel       = t('final.submitLabel');
      fin.strings.successToast      = t('final.successToast');
      fin.strings.requiredError     = t('final.requiredError');
      fin.strings.invalidEmailError = t('final.invalidEmailError');
      fin.strings.mismatchError     = t('final.mismatchError');
      fin.strings.matchConfirmed    = t('final.matchConfirmed');
    }

    // ── Rebuild JS-rendered component data objects ─────────────────
    // carousel, tiles, courses, path, certification each have a
    // _buildXxx() factory that regenerates all translated strings.
    // Calling them here ensures applyAllConfigs() is a one-stop patch.

    // Carousel slides
    if (typeof _buildCarouselSlides === 'function' && app.carousel) {
      app.carousel.slides = _buildCarouselSlides();
    }

    // Tiles
    if (typeof _buildTiles === 'function') {
      app.tiles = _buildTiles();
    }

    // Courses
    if (typeof _buildCourses === 'function') {
      app.courses = _buildCourses();
    }

    // Path / Pricing plans
    if (typeof _buildPath === 'function') {
      app.path = _buildPath();
    }

    // Certification cards
    if (typeof _buildCertification === 'function') {
      app.certification = _buildCertification();
    }

    // Stats labels
    if (app.stats) {
      var statLabelMap = {
        students:   'stats.students',
        placement:  'stats.placement',
        experience: 'stats.experience'
      };
      app.stats.forEach(function (s) {
        if (statLabelMap[s.id]) s.label = t(statLabelMap[s.id]);
      });
    }

    // Hero
    if (app.hero) {
      app.hero.forEach(function (h) {
        h.title       = t('hero.title');
        h.description = t('hero.description');
      });
    }

    // Ready
    if (app.ready) {
      app.ready.title             = t('ready.title');
      app.ready.description       = t('ready.description');
      if (app.ready.button) app.ready.button.label = t('ready.cta');
    }
  }

  /**
   * Set language, persist it, update the DOM, patch all configs.
   */
  function setLang(lang) {
    if (lang !== 'en' && lang !== 'es') {
      console.warn('[i18n] unsupported language:', lang);
      return;
    }
    _lang = lang;
    try { localStorage.setItem('nala_lang', lang); } catch (e) {}

    document.documentElement.setAttribute('lang', lang);

    // 1. Translate the top-level document
    applyDOM();

    // 2. Translate every already-injected <wc-include> fragment.
    document.querySelectorAll('wc-include').forEach(function (el) {
      applyDOM(el);
    });

    // 3. Re-patch all window.app.* config objects
    applyAllConfigs();

    // 4. Fire i18n:changed so config listeners rebuild their data objects
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: lang } }));

    // 5. After config listeners have rebuilt data, fire component rebuild events
    //    so JS-rendered content (slides, tiles, cards, plans) fully redraws.
    setTimeout(function () {
      applyDOM();
      var rebuildEvents = [
        'carousel:rebuild', 'tiles:rebuild', 'courses:rebuild',
        'path:rebuild', 'certification:rebuild', 'gift:rebuild', 'final:rebuild'
      ];
      rebuildEvents.forEach(function (evtName) {
        document.dispatchEvent(new CustomEvent(evtName));
      });
    }, 50);
  }

  /**
   * Return current language code.
   */
  function getLang() { return _lang; }

  // ── Bootstrap ──────────────────────────────────────────────────

  // Auto-detect and apply on DOMContentLoaded
  _lang = detectLang();
  document.documentElement.setAttribute('lang', _lang);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyDOM();
      applyAllConfigs();
    });
  } else {
    applyDOM();
    applyAllConfigs();
  }

  // ── wc-include integration ─────────────────────────────────────
  //
  // <wc-include> fetches HTML asynchronously via AJAX and injects it
  // AFTER the initial applyDOM() has already run.  Every time a
  // fragment lands in the DOM we must re-translate it.
  //
  // The custom element fires  include:loaded  (bubbles: true) on itself
  // immediately after  $(self).html(data).  We listen at document level
  // so we never miss an event regardless of where the element lives.
  //
  document.addEventListener('include:loaded', function (e) {
    // e.target is the <wc-include> element that just received content
    var fragment = e.target;
    if (!fragment) return;

    // --- Pass 1: immediate ---
    // Translate data-i18n nodes already present in the injected HTML.
    applyDOM(fragment);

    // --- Pass 2: deferred (150 ms) ---
    // Component scripts (carousel.js, tile.js, courses.js, path.js, etc.)
    // use polling loops / waitFor that resolve asynchronously AFTER
    // include:loaded fires.  We wait long enough for those renders to
    // finish, then rebuild configs + fire component rebuild events.
    setTimeout(function () {
      // 1. Rebuild all config objects with current language strings
      applyAllConfigs();

      // 2. Re-translate data-i18n nodes (static HTML + any injected by scripts)
      applyDOM(fragment);
      applyDOM(document);

      // 3. Fire per-component rebuild events so JS-rendered content redraws
      var rebuildEvents = [
        'carousel:rebuild', 'tiles:rebuild', 'courses:rebuild',
        'path:rebuild', 'certification:rebuild', 'gift:rebuild', 'final:rebuild'
      ];
      rebuildEvents.forEach(function (evtName) {
        document.dispatchEvent(new CustomEvent(evtName));
      });
    }, 150);

    // --- Pass 3: safety net (600 ms) ---
    // A second sweep catches components whose polling loops (e.g. waitFor 500ms
    // in courses.js) haven't resolved yet at 150 ms.
    setTimeout(function () {
      applyAllConfigs();
      applyDOM(document);
      var rebuildEvents = [
        'carousel:rebuild', 'tiles:rebuild', 'courses:rebuild',
        'path:rebuild', 'certification:rebuild', 'gift:rebuild', 'final:rebuild'
      ];
      rebuildEvents.forEach(function (evtName) {
        document.dispatchEvent(new CustomEvent(evtName));
      });
    }, 600);

    // --- Pass 4: final safety net (1500 ms) ---
    // Handles any components on slow connections or that use long poll intervals.
    setTimeout(function () {
      applyAllConfigs();
      applyDOM(document);
    }, 1500);
  });

  // ── MutationObserver safety net ────────────────────────────────
  // Some wc-include fragments nest further wc-includes or add nodes
  // dynamically (e.g. tiles rendered by tile.js, course cards by
  // courses.js).  We watch for new [data-i18n] nodes being added
  // anywhere and translate them on the fly.
  (function watchDynamicNodes() {
    if (typeof MutationObserver === 'undefined') return;
    var obs = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;          // elements only
          // Translate the node itself and all its descendants
          if (node.hasAttribute && (
              node.hasAttribute('data-i18n') ||
              node.hasAttribute('data-i18n-placeholder') ||
              node.hasAttribute('data-i18n-aria') ||
              node.hasAttribute('data-i18n-title')
          )) {
            applyDOM(node.parentElement || node);
          } else if (node.querySelector) {
            var hasSubs = node.querySelector(
              '[data-i18n],[data-i18n-placeholder],[data-i18n-aria],[data-i18n-title]'
            );
            if (hasSubs) applyDOM(node);
          }
        });
      });
    });
    // Start observing once the body exists
    var startObs = function () {
      if (document.body) {
        obs.observe(document.body, { childList: true, subtree: true });
      } else {
        document.addEventListener('DOMContentLoaded', function () {
          obs.observe(document.body, { childList: true, subtree: true });
        });
      }
    };
    startObs();
  })();

  // ── Public API ─────────────────────────────────────────────────
  global.i18n = {
    t            : t,
    setLang      : setLang,
    getLang      : getLang,
    applyDOM     : applyDOM,
    applyConfig  : applyConfig,
    applyAllConfigs: applyAllConfigs,
    dict         : DICT       // expose for extension / inspection
  };

}(typeof globalThis !== 'undefined' ? globalThis : window));
