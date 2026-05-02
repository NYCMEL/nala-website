(function () {
  const LOGO_ICONS = [
    { id: "precision-key", label: "Precision Key", svg: `<svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="28" cy="48" r="16" fill="currentColor"></circle><circle cx="28" cy="48" r="7" fill="var(--logo-bg, #ffffff)"></circle><rect x="42" y="43" width="34" height="10" rx="5" fill="currentColor"></rect><rect x="68" y="43" width="6" height="18" rx="2" fill="currentColor"></rect><rect x="58" y="43" width="6" height="14" rx="2" fill="currentColor"></rect></svg>` },
    { id: "shield-lock", label: "Shield Lock", svg: `<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M48 12l24 8v18c0 20-10 34-24 42C34 72 24 58 24 38V20l24-8z" fill="currentColor"></path><rect x="37" y="43" width="22" height="19" rx="4" fill="var(--logo-bg, #ffffff)"></rect><path d="M40 43v-5c0-5 3-10 8-10s8 5 8 10v5" fill="none" stroke="var(--logo-bg, #ffffff)" stroke-width="6" stroke-linecap="round"></path></svg>` },
    { id: "modern-keyhole", label: "Modern Keyhole", svg: `<svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="36" r="18" fill="currentColor"></circle><path d="M48 44l10 24H38l10-24z" fill="currentColor"></path><circle cx="48" cy="36" r="7" fill="var(--logo-bg, #ffffff)"></circle></svg>` },
    { id: "entry-lock", label: "Entry Lock", svg: `<svg viewBox="0 0 96 96" aria-hidden="true"><rect x="26" y="38" width="44" height="34" rx="8" fill="currentColor"></rect><path d="M34 38V30c0-8 6-14 14-14s14 6 14 14v8" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"></path><circle cx="48" cy="54" r="5" fill="var(--logo-bg, #ffffff)"></circle><rect x="46" y="54" width="4" height="10" rx="2" fill="var(--logo-bg, #ffffff)"></rect></svg>` },
    { id: "garage-key", label: "Garage Key", svg: `<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M19 55l20-20 11 11 19-19 8 8-19 19 11 11-20 20-30-30z" fill="currentColor"></path><circle cx="33" cy="40" r="6" fill="var(--logo-bg, #ffffff)"></circle></svg>` },
    { id: "monogram", label: "Monogram", svg: "" }
  ];

  const LOGO_FONTS = [
    { id: "outfit-manrope", label: "Outfit + Manrope", headline: "'Outfit', 'Segoe UI', sans-serif", body: "'Manrope', 'Segoe UI', sans-serif", summary: "Modern geometric pairing for web, vans, and social readability." },
    { id: "archivo-manrope", label: "Archivo Black + Manrope", headline: "'Arial Black', 'Arial', sans-serif", body: "'Manrope', 'Segoe UI', sans-serif", summary: "Bold signage-first style for roadside visibility." },
    { id: "space-libre", label: "Space Grotesk + Libre Baskerville", headline: "'Segoe UI', sans-serif", body: "Georgia, serif", summary: "Premium mix for established, trust-forward locksmith brands." }
  ];

  const LOGO_TEMPLATES = [
    { id: "service-wordmark", label: "Service Wordmark", summary: "Horizontal lockup for vehicle wraps, Google profile art, and website headers." },
    { id: "trusted-shield", label: "Trusted Shield", summary: "Security-forward badge direction for rekeys, property managers, and commercial accounts." },
    { id: "modern-stack", label: "Modern Stack", summary: "Clean stacked layout for websites, proposals, and social assets." },
    { id: "monogram-seal", label: "Monogram Seal", summary: "Compact emblem suited to invoices, stationery, and premium service brands." }
  ];

  const LOGO_VARIATIONS = [
    { id: "horizontal", label: "Horizontal", summary: "Primary website and van lockup." },
    { id: "stacked", label: "Stacked", summary: "Square ads and flyers." },
    { id: "badge", label: "Badge", summary: "Uniforms, decals, and favicons." },
    { id: "icon-only", label: "Icon only", summary: "Small social avatar and favicon." }
  ];

  const BIAB_ES = {
    "Back to dashboard": "Volver al panel",
    "Business in a Box Setup": "Configuración de Negocio en una Caja",
    "Your guided setup/editing space. Daily tools live from the main dashboard after setup.": "Tu espacio guiado de configuración y edición. Las herramientas diarias estarán disponibles desde el panel principal después de la configuración.",
    "Help": "Ayuda",
    "Dashboard": "Panel",
    "Setup steps": "Pasos de configuración",
    "complete": "completo",
    "done": "listo",
    "Complete": "Completado",
    "Skipped": "Omitido",
    "Current": "Actual",
    "In progress": "En progreso",
    "Not started": "No iniciado",
    "Intro": "Inicio",
    "Background": "Información",
    "Legal": "Legal",
    "Financial": "Finanzas",
    "Brand": "Marca",
    "Logo": "Logo",
    "Local": "Local",
    "SEO": "SEO",
    "Website": "Sitio web",
    "Invoices": "Facturas",
    "Reviews": "Reseñas",
    "Launch": "Lanzamiento",
    "Start here": "Comienza aquí",
    "Business in a Box setup": "Configuración de Negocio en una Caja",
    "A guided setup for the business profile, legal reminders, finances, brand, actual website, local presence, invoices, reviews, and launch readiness.": "Una configuración guiada para el perfil del negocio, recordatorios legales, finanzas, marca, sitio web real, presencia local, facturas, reseñas y preparación para el lanzamiento.",
    "Business background": "Información del negocio",
    "Legal reminders": "Recordatorios legales",
    "Financial setup": "Configuración financiera",
    "Brand system": "Sistema de marca",
    "Logo creation": "Creación de logo",
    "Actual website": "Sitio web real",
    "Google profile": "Perfil de Google",
    "Launch review": "Revisión de lanzamiento",
    "Video walkthrough": "Video guía",
    "Marked for later: setup walkthrough and Business in a Box services overview.": "Marcado para más adelante: video guía de la configuración y resumen de los servicios de Negocio en una Caja.",
    "Previous": "Anterior",
    "Start setup": "Comenzar configuración",
    "Save & Continue": "Guardar y continuar",
    "Skip for now": "Omitir por ahora",
    "Finish setup": "Finalizar configuración",
    "Readiness summary": "Resumen de preparación",
    "All guided setup areas are marked complete.": "Todas las áreas guiadas están marcadas como completadas.",
    "Guided instructions": "Instrucciones guiadas",
    "Step-by-step instructions": "Instrucciones paso a paso",
    "Official links": "Enlaces oficiales",
    "Close help": "Cerrar ayuda",
    "Business in a Box guides you step by step through creating and configuring your locksmith business tools.": "Negocio en una Caja te guía paso a paso para crear y configurar tus herramientas de negocio de cerrajería.",
    "Your answers are reused across the actual website, invoice generator, review workflow, business plan, brand kit, and marketing setup.": "Tus respuestas se reutilizan en el sitio web real, generador de facturas, flujo de reseñas, plan de negocio, kit de marca y configuración de marketing.",
    "Current step": "Paso actual",
    "General issues": "Problemas generales",
    "Coming later.": "Próximamente.",
    "Business in a Box tools": "Herramientas de Negocio en una Caja",
    "Business in a Box tool": "Herramienta de Negocio en una Caja",
    "Edit setup": "Editar configuración",
    "Invoice Generator": "Generador de facturas",
    "Business Plan": "Plan de negocio",
    "Brand Kit": "Kit de marca",
    "Marketing Setup": "Configuración de marketing",
    "Customer name": "Nombre del cliente",
    "Customer email": "Correo del cliente",
    "Customer phone": "Teléfono del cliente",
    "Service type": "Tipo de servicio",
    "Rekey service": "Servicio de rekey",
    "House lockout": "Apertura residencial",
    "Lock change": "Cambio de cerradura",
    "Deadbolt installation": "Instalación de cerrojo",
    "Commercial service": "Servicio comercial",
    "Job notes": "Notas del trabajo",
    "Line items": "Partidas",
    "Line item": "Partida",
    "Line item label": "Etiqueta de partida",
    "Line item amount": "Importe de partida",
    "Remove line item": "Eliminar partida",
    "Add line": "Agregar línea",
    "Ask for a review after sending this invoice": "Pedir una reseña después de enviar esta factura",
    "Review request email": "Correo para solicitud de reseña",
    "Send Invoice": "Enviar factura",
    "Your Locksmith Business": "Tu negocio de cerrajería",
    "Business phone": "Teléfono del negocio",
    "Business email": "Correo del negocio",
    "Invoice:": "Factura:",
    "Customer:": "Cliente:",
    "Service fee": "Cargo de servicio",
    "Labor": "Mano de obra",
    "Parts": "Piezas",
    "No invoice review requests have been sent yet.": "Aún no se han enviado solicitudes de reseña desde facturas.",
    "review requests sent from invoices": "solicitudes de reseña enviadas desde facturas",
    "review request sent from invoices": "solicitud de reseña enviada desde facturas",
    "Customer": "Cliente",
    "Source:": "Origen:",
    "Invoice": "Factura",
    "Your brand kit uses your selected color scheme across the website, logo, invoices, and marketing materials.": "Tu kit de marca usa el esquema de color seleccionado en el sitio web, logo, facturas y materiales de marketing.",
    "Service area:": "Área de servicio:",
    "Launch services:": "Servicios de lanzamiento:",
    "clear pricing, professional arrival, clean work, ETA updates, detailed invoices, and review follow-up.": "precios claros, llegada profesional, trabajo limpio, actualizaciones de ETA, facturas detalladas y seguimiento de reseñas.",
    "Jane Customer": "Cliente de ejemplo",
    "Select an option": "Selecciona una opción",
    "Upload existing icon/logo": "Subir icono/logo existente",
    "Create logo here": "Crear logo aquí",
    "Create in logo step": "Crear en el paso de logo",
    "Upload existing logo": "Subir logo existente",
    "Finish logo later": "Terminar logo más adelante",
    "Not selected": "No seleccionado",
    "Not decided": "No decidido",
    "Completed": "Completado",
    "Not required / verified": "No requerido / verificado",
    "Quotes requested": "Cotizaciones solicitadas",
    "Policy active": "Póliza activa",
    "Account open": "Cuenta abierta",
    "Using existing account": "Usando cuenta existente",
    "Appointment scheduled": "Cita programada",
    "Property added": "Propiedad agregada",
    "Ownership verified": "Propiedad verificada",
    "Sitemap submitted": "Sitemap enviado",
    "Needs attention": "Requiere atención",
    "Added / claimed": "Agregado / reclamado",
    "Verification in progress": "Verificación en progreso",
    "Verified": "Verificado",
    "Video recording": "Grabación de video",
    "Phone or SMS": "Teléfono o SMS",
    "Email": "Correo",
    "Postcard": "Postal",
    "Instant / Search Console": "Instantáneo / Search Console",
    "Other": "Otro"
  };

  Object.assign(BIAB_ES, {
    "Shared business profile": "Perfil compartido del negocio",
    "Enter the core business information once. These answers feed the website, invoices, business plan, Google setup, reviews, and marketing materials.": "Ingresa la información principal del negocio una sola vez. Estas respuestas alimentan el sitio web, facturas, plan de negocio, configuración de Google, reseñas y materiales de marketing.",
    "Customer-facing business name *": "Nombre comercial visible al cliente *",
    "Legal business name": "Nombre legal del negocio",
    "Owner or responsible party name": "Nombre del dueño o responsable",
    "Business phone *": "Teléfono del negocio *",
    "Business email *": "Correo del negocio *",
    "Business hours": "Horario del negocio",
    "Service area *": "Área de servicio *",
    "Launch services *": "Servicios de lanzamiento *",
    "Basic commercial lock service": "Servicio comercial básico de cerraduras",
    "Additional launch services": "Servicios adicionales de lanzamiento",
    "Short business description *": "Descripción breve del negocio *",
    "Legal operating setup": "Configuración legal operativa",
    "Guided setup, not legal advice": "Configuración guiada, no asesoría legal",
    "Use official resources to register your business, confirm licensing, apply for an EIN, record insurance, and document operating policies.": "Usa recursos oficiales para registrar tu negocio, confirmar licencias, solicitar un EIN, registrar seguro y documentar políticas operativas.",
    "External instructions are based on official IRS and SBA guidance checked before implementation. Locksmith licensing varies by state, county, and city.": "Las instrucciones externas se basan en guías oficiales del IRS y la SBA revisadas antes de la implementación. Las licencias de cerrajería varían por estado, condado y ciudad.",
    "Saved. Complete the required items before this step is marked complete.": "Guardado. Completa los elementos requeridos antes de marcar este paso como completado.",
    "Confirm your business structure before applying for an EIN if you are forming an LLC, corporation, partnership, or other state-created entity.": "Confirma la estructura de tu negocio antes de solicitar un EIN si estás formando una LLC, corporación, sociedad u otra entidad creada por el estado.",
    "Open the IRS EIN tool only when the responsible party is ready to finish in one session.": "Abre la herramienta de EIN del IRS solo cuando la persona responsable esté lista para terminar en una sola sesión.",
    "Use the legal business name and responsible party information from the Business Background step.": "Usa el nombre legal del negocio y la información de la persona responsable del paso Información del negocio.",
    "Save the EIN confirmation letter, then enter the EIN here.": "Guarda la carta de confirmación del EIN y luego ingresa el EIN aquí.",
    "Check state, county, and city locksmith/business licensing rules and record the result in the notes field.": "Revisa las reglas estatales, del condado y de la ciudad sobre licencias de cerrajería/negocio y registra el resultado en el campo de notas.",
    "SBA launch your business": "SBA: lanza tu negocio",
    "Business structure chosen *": "Estructura de negocio elegida *",
    "State registration status *": "Estado del registro estatal *",
    "The IRS says the online EIN application is free, completed in one session, and generally issues the EIN immediately when approved.": "El IRS indica que la solicitud de EIN en línea es gratuita, se completa en una sola sesión y generalmente emite el EIN de inmediato cuando se aprueba.",
    "License and local registration notes *": "Notas de licencia y registro local *",
    "Insurance status *": "Estado del seguro *",
    "Authorization before entry policy *": "Política de autorización antes de abrir/entrar *",
    "Financial operating setup": "Configuración financiera operativa",
    "Cash, payments, and records": "Efectivo, pagos y registros",
    "Set up your money operations: bank account, payment processor, bookkeeping habit, pricing assumptions, and weekly metrics.": "Configura tus operaciones de dinero: cuenta bancaria, procesador de pagos, hábito de contabilidad, supuestos de precios y métricas semanales.",
    "Use the EIN and legal business name from Legal Setup when opening a bank account.": "Usa el EIN y el nombre legal del negocio del paso Legal al abrir una cuenta bancaria.",
    "Choose a payment processor that supports the way you will collect payment in the field.": "Elige un procesador de pagos que soporte la forma en que cobrarás en el campo.",
    "Record the processor reference here after activation.": "Registra aquí la referencia del procesador después de activarlo.",
    "Write down the starting pricing rules before the first paid job.": "Escribe las reglas iniciales de precios antes del primer trabajo pagado.",
    "SBA open a business bank account": "SBA: abre una cuenta bancaria comercial",
    "Business bank account status *": "Estado de la cuenta bancaria comercial *",
    "Payment processor *": "Procesador de pagos *",
    "PayPal Business": "PayPal Business",
    "Bookkeeping setup *": "Configuración de contabilidad *",
    "Brand choices": "Opciones de marca",
    "Choose a brand direction that can carry through the actual website, logo, invoices, review emails, stationery, ads, and other marketing.": "Elige una dirección de marca que funcione en el sitio web real, logo, facturas, correos de reseñas, papelería, anuncios y otros materiales de marketing.",
    "Confident, established, and polished": "Confiable, establecido y pulido",
    "Crisp, clear, and highly credible": "Nítido, claro y muy creíble",
    "Visible, direct, and action-oriented": "Visible, directo y orientado a la acción",
    "Calm, grounded, and dependable": "Calmado, sólido y confiable",
    "Precise, technical, and premium": "Preciso, técnico y premium",
    "Warm, traditional, and memorable": "Cálido, tradicional y memorable",
    "Modern, calm, and approachable": "Moderno, calmado y accesible",
    "Strong, crafted, and refined": "Fuerte, trabajado y refinado",
    "Energetic, friendly, and easy to notice": "Energético, amable y fácil de notar",
    "Stable, respectful, and trustworthy": "Estable, respetuoso y confiable",
    "Bold, simple, and memorable": "Audaz, simple y memorable",
    "Open, clean, and reassuring": "Abierto, limpio y tranquilizador",
    "Color scheme vs. brand tone": "Esquema de color vs. tono de marca",
    "Color scheme controls the visual look across the website, logo, invoices, and marketing. Brand tone controls the wording style: how direct, warm, polished, or reassuring the business sounds.": "El esquema de color controla el aspecto visual del sitio web, logo, facturas y marketing. El tono de marca controla el estilo del texto: qué tan directo, cálido, pulido o tranquilizador suena el negocio.",
    "Brand tone *": "Tono de marca *",
    "Clear and professional": "Claro y profesional",
    "Warm and neighborly": "Cálido y cercano",
    "Direct and practical": "Directo y práctico",
    "Polished and premium": "Pulido y premium",
    "Security-focused and reassuring": "Enfocado en seguridad y confianza",
    "Logo status *": "Estado del logo *",
    "Logo and icon creation": "Creación de logo e icono",
    "Create a clean locksmith logo using an icon, initials, layout, type style, and the selected brand colors, or upload an existing logo instead.": "Crea un logo limpio de cerrajería usando un icono, iniciales, diseño, estilo tipográfico y los colores de marca seleccionados, o sube un logo existente.",
    "Logo guidance follows common branding practice: keep it simple, scalable, readable at small sizes, and usable in full-color, one-color, and reversed versions.": "La guía de logo sigue prácticas comunes de marca: mantenlo simple, escalable, legible en tamaños pequeños y usable en versiones a color, de un color e invertidas.",
    "Choose whether to create a logo direction here or upload an existing icon/logo.": "Elige si quieres crear una dirección de logo aquí o subir un icono/logo existente.",
    "Choose a simple background shape that still works at favicon, invoice, shirt, van, and Google profile sizes.": "Elige una forma de fondo simple que funcione como favicon, en facturas, camisetas, vehículo y perfil de Google.",
    "Use the brand color scheme from the previous step and keep the mark readable in one color.": "Usa el esquema de color de marca del paso anterior y mantén la marca legible en un solo color.",
    "Review the logo previews before applying the logo to the website.": "Revisa las vistas previas del logo antes de aplicarlo al sitio web.",
    "Logo path *": "Ruta del logo *",
    "Icon style *": "Estilo de icono *",
    "Template direction *": "Dirección de plantilla *",
    "Type style *": "Estilo tipográfico *",
    "Primary variation *": "Variación principal *",
    "Service Wordmark": "Marca denominativa de servicio",
    "Horizontal lockup for vehicle wraps, Google profile art, and website headers.": "Composición horizontal para rotulación de vehículo, arte del perfil de Google y encabezados del sitio.",
    "Security-forward badge direction for rekeys, property managers, and commercial accounts.": "Dirección tipo insignia centrada en seguridad para rekeys, administradores de propiedades y cuentas comerciales.",
    "Clean stacked layout for websites, proposals, and social assets.": "Diseño apilado y limpio para sitios web, propuestas y redes sociales.",
    "Compact emblem suited to invoices, stationery, and premium service brands.": "Emblema compacto adecuado para facturas, papelería y marcas de servicio premium.",
    "Modern geometric pairing for web, vans, and social readability.": "Combinación geométrica moderna para web, vehículos y legibilidad social.",
    "Primary website and van lockup.": "Composición principal para sitio web y vehículo.",
    "Square ads and flyers.": "Anuncios cuadrados y volantes.",
    "Uniforms, decals, and favicons.": "Uniformes, calcomanías y favicons.",
    "Small social avatar and favicon.": "Avatar social pequeño y favicon.",
    "Upload an SVG, PNG, JPG, or WebP logo. The preview will use the uploaded artwork.": "Sube un logo SVG, PNG, JPG o WebP. La vista previa usará el arte subido.",
    "Logo quality checklist": "Lista de calidad del logo",
    "Your Locksmith": "Tu cerrajero",
    "Mobile Locksmith Service": "Servicio móvil de cerrajería",
    "Starter logo preview": "Vista previa inicial del logo",
    "Uploaded artwork will appear in the preview cards below.": "El arte subido aparecerá en las tarjetas de vista previa de abajo.",
    "Readable": "Legible",
    "Simple": "Simple",
    "Flexible": "Adaptable",
    "Light background": "Fondo claro",
    "Keep your business name readable at small sizes.": "Mantén el nombre del negocio legible en tamaños pequeños.",
    "Use one strong icon or initials instead of combining several ideas.": "Usa un icono fuerte o iniciales en lugar de combinar muchas ideas.",
    "Check the light, dark, square, and horizontal previews before applying the logo.": "Revisa las vistas clara, oscura, cuadrada y horizontal antes de aplicar el logo.",
    "Logo kit": "Kit de logo",
    "Use these versions across your website, invoices, Google profile, social accounts, shirts, and vehicle graphics.": "Usa estas versiones en tu sitio web, facturas, Perfil de Google, redes sociales, camisetas y gráficos de vehículo.",
    "Download the SVG draft for records or outside design work.": "Descarga el borrador SVG para tus archivos o para trabajo de diseño externo.",
    "Apply the selected logo to the website when the preview looks right.": "Aplica el logo seleccionado al sitio web cuando la vista previa se vea correcta.",
    "Download SVG draft": "Descargar borrador SVG",
    "Apply to website": "Aplicar al sitio web",
    "Google Business Profile setup": "Configuración del Perfil de Empresa de Google",
    "Assisted external setup": "Configuración externa asistida",
    "Create or claim the Google Business Profile, set the right business type/service area, complete core fields, and record profile status.": "Crea o reclama el Perfil de Empresa de Google, configura el tipo de negocio/área de servicio correcta, completa los campos principales y registra el estado del perfil.",
    "Instructions are based on current Google Business Profile help pages checked before implementation.": "Las instrucciones se basan en páginas actuales de ayuda de Perfil de Empresa de Google revisadas antes de la implementación.",
    "Open Google Business Profile with your business Google account.": "Abre Perfil de Empresa de Google con la cuenta de Google de tu negocio.",
    "Add a new business if no profile exists, or claim the existing profile if Google already shows it.": "Agrega un negocio nuevo si no existe un perfil, o reclama el perfil existente si Google ya lo muestra.",
    "Use your business name \"from Business Background\".": "Usa el nombre de tu negocio del paso Información del negocio.",
    "Choose Locksmith as the category when available.": "Elige Cerrajero como categoría cuando esté disponible.",
    "If customers do not visit a staffed storefront, set it up as a service-area business and remove/hide the address when Google asks.": "Si los clientes no visitan un local atendido, configúralo como negocio de área de servicio y elimina/oculta la dirección cuando Google lo solicite.",
    "Enter only practical service areas. Google documents that up to 20 service areas can be selected.": "Ingresa solo áreas de servicio prácticas. Google documenta que se pueden seleccionar hasta 20 áreas de servicio.",
    "Choose the verification option Google offers and return here to record the method and status.": "Elige la opción de verificación que ofrece Google y vuelve aquí para registrar el método y el estado.",
    "Add or claim Business Profile": "Agregar o reclamar Perfil de Empresa",
    "Manage service areas": "Administrar áreas de servicio",
    "Verify your business": "Verificar tu negocio",
    "Google Business Profile status *": "Estado del Perfil de Empresa de Google *",
    "Google profile URL *": "URL del perfil de Google *",
    "Verification method offered by Google *": "Método de verificación ofrecido por Google *",
    "Service-area setup confirmed *": "Configuración de área de servicio confirmada *",
    "SEO and Search Console setup": "Configuración de SEO y Search Console",
    "Actual website visibility": "Visibilidad del sitio web real",
    "Prepare the actual locksmith website for search engines and connect Search Console after the live URL/domain is ready.": "Prepara el sitio web real de cerrajería para los motores de búsqueda y conecta Search Console cuando la URL/dominio esté listo.",
    "Instructions are based on Google Search Console and Search Central documentation checked before implementation.": "Las instrucciones se basan en documentación de Google Search Console y Search Central revisada antes de la implementación.",
    "Open Search Console and add the actual website property.": "Abre Search Console y agrega la propiedad del sitio web real.",
    "Choose an available verification method and follow Google's instructions.": "Elige un método de verificación disponible y sigue las instrucciones de Google.",
    "Record the verified status here after Search Console accepts the property.": "Registra aquí el estado verificado después de que Search Console acepte la propiedad.",
    "Submit the sitemap URL shown here after verification.": "Envía la URL del sitemap que se muestra aquí después de la verificación.",
    "Use honest local service terms and avoid fake city pages.": "Usa términos honestos de servicio local y evita páginas falsas por ciudad.",
    "Google SEO starter guide": "Guía inicial de SEO de Google",
    "BIAB website URL *": "URL del sitio web BIAB *",
    "This is the actual website generated by Business in a Box.": "Este es el sitio web real generado por Negocio en una Caja.",
    "Search Console status *": "Estado de Search Console *",
    "Submit this sitemap URL in Search Console when the site is live.": "Envía esta URL de sitemap en Search Console cuando el sitio esté activo.",
    "Primary local search terms *": "Términos principales de búsqueda local *",
    "locksmith your service area, your service area locksmith, mobile locksmith your service area, locksmith near me": "cerrajero tu área de servicio, cerrajero en tu área de servicio, cerrajero móvil tu área de servicio, cerrajero cerca de mí",
    "Suggested from the launch services and service area entered earlier. Edit before saving if needed.": "Sugerido según los servicios de lanzamiento y el área de servicio ingresados antes. Edita antes de guardar si hace falta.",
    "Suggested terms: locksmith your service area, your service area locksmith, mobile locksmith your service area, locksmith near me": "Términos sugeridos: cerrajero tu área de servicio, cerrajero en tu área de servicio, cerrajero móvil tu área de servicio, cerrajero cerca de mí",
    "Invoice setup": "Configuración de facturas",
    "Field closeout tool": "Herramienta de cierre en campo",
    "Once setup is complete, you can generate invoices from the standalone invoice generator on-site without going through the website flow.": "Cuando la configuración esté completa, puedes generar facturas en sitio desde el generador independiente sin pasar por el flujo del sitio web.",
    "Invoice prefix *": "Prefijo de factura *",
    "Invoice sender email *": "Correo remitente de factura *",
    "Payment terms *": "Términos de pago *",
    "Ask for a review by default after sending an invoice": "Pedir una reseña por defecto después de enviar una factura",
    "Review workflow setup": "Configuración del flujo de reseñas",
    "Close the job with reputation": "Cierra el trabajo construyendo reputación",
    "Set your review request habit. Your invoices can include a checkbox to automatically send a review request to your customer's email.": "Configura tu hábito de solicitud de reseñas. Tus facturas pueden incluir una casilla para enviar automáticamente una solicitud de reseña al correo de tu cliente.",
    "Use review requests for customers who received completed service.": "Usa solicitudes de reseña para clientes que recibieron un servicio completado.",
    "Keep the message short and honest.": "Mantén el mensaje breve y honesto.",
    "Use a real reply-to email and keep business contact information accurate.": "Usa un correo real de respuesta y mantén precisa la información de contacto del negocio.",
    "When sending an invoice, leave 'Ask for a review' checked when your customer's email is correct.": "Al enviar una factura, deja marcada la opción 'Pedir una reseña' cuando el correo del cliente sea correcto.",
    "FTC CAN-SPAM business guide": "Guía comercial CAN-SPAM de la FTC",
    "Review request reply-to email *": "Correo de respuesta para solicitudes de reseña *",
    "Default review request message *": "Mensaje predeterminado de solicitud de reseña *",
    "Public review page URL *": "URL pública de la página de reseñas *",
    "Ready to operate": "Listo para operar",
    "Review the business setup, actual website readiness, invoice workflow, and review workflow before treating the launch as complete.": "Revisa la configuración del negocio, la preparación del sitio web real, el flujo de facturas y el flujo de reseñas antes de considerar completo el lanzamiento.",
    "I reviewed the setup and am ready to use Business in a Box tools *": "Revisé la configuración y estoy listo para usar las herramientas de Negocio en una Caja *"
  });

  class MTKBIABSetup {
    constructor(config) {
      this.cfg = config || {};
      this.el = null;
      this.state = this.loadState();
      this.currentStep = this.getInitialStep();
      this.activeHelp = false;
      this.invoiceDraft = {
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        serviceType: "Rekey service",
        notes: "",
        lineItems: [
          { label: this.tr("Labor"), amount: "125" },
          { label: this.tr("Parts"), amount: "35" },
          { label: this.tr("Service fee"), amount: "25" }
        ],
        askReview: true
      };
      this.notice = "";

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.init(), { once: true });
      } else {
        this.init();
      }
    }

    init() {
      this.el = document.querySelector("mtk-biab-setup");
      if (this.el) {
        this.render();
        this.bind();
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        this.el = document.querySelector("mtk-biab-setup");
        if (!this.el) return;
        obs.disconnect();
        this.render();
        this.bind();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    loadState() {
      const empty = { values: {}, completed: {}, skipped: {}, invoices: [], reviewRequests: [] };
      try {
        const raw = localStorage.getItem(this.cfg.storageKey);
        return raw ? Object.assign(empty, JSON.parse(raw)) : empty;
      } catch (err) {
        return empty;
      }
    }

    saveState() {
      try {
        localStorage.setItem(this.cfg.storageKey, JSON.stringify(this.state));
      } catch (err) {
        console.warn("[mtk-biab-setup] Could not save state", err);
      }
    }

    getInitialStep() {
      const requested = new URLSearchParams(window.location.search).get("step");
      const index = this.cfg.steps.findIndex(step => step.id === requested);
      if (index >= 0) return index;
      const firstOpen = this.cfg.steps.findIndex(step => !this.state.completed[step.id]);
      return firstOpen >= 0 ? firstOpen : 0;
    }

    mode() {
      return new URLSearchParams(window.location.search).get("tool") || "setup";
    }

    bind() {
      this.el.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-biab-action]");
        if (!btn) return;
        const action = btn.dataset.biabAction;

        if (action === "next") this.nextStep();
        if (action === "prev") this.prevStep();
        if (action === "goto") this.gotoStep(btn.dataset.stepId);
        if (action === "complete") this.completeStep();
        if (action === "skip") this.skipStep();
        if (action === "help") this.toggleHelp();
        if (action === "exit-help") this.toggleHelp(false);
        if (action === "tool") this.openTool(btn.dataset.toolId);
        if (action === "invoice-send") this.sendInvoice();
        if (action === "invoice-add-line") this.addInvoiceLine();
        if (action === "invoice-remove-line") this.removeInvoiceLine(Number(btn.dataset.index));
        if (action === "reset-demo") this.resetDemoState();
        if (action === "logo-choice") this.setLogoChoice(btn.dataset.field, btn.dataset.value);
        if (action === "logo-apply") this.applyLogoToWebsite();
        if (action === "logo-download") this.downloadLogoSvg();
      });

      this.el.addEventListener("input", (event) => {
        const field = event.target.dataset.field;
        if (field) this.updateField(event.target);

        const invoiceField = event.target.dataset.invoiceField;
        if (invoiceField) this.updateInvoiceField(event.target);
      });

      this.el.addEventListener("change", (event) => {
        const field = event.target.dataset.field;
        if (field) this.updateField(event.target);

        const invoiceField = event.target.dataset.invoiceField;
        if (invoiceField) this.updateInvoiceField(event.target);
      });
    }

    render() {
      const mode = this.mode();
      if (mode !== "setup") {
        this.renderTool(mode);
        return;
      }

      const step = this.cfg.steps[this.currentStep] || this.cfg.steps[0];
      const pct = this.progressPct();

      this.el.innerHTML = `
        <div class="mtk-biab-setup__shell">
          ${this.renderHeader(pct)}
          ${this.renderStepNav(step)}
          <div class="mtk-biab-setup__body">
            <main class="mtk-biab-setup__main" aria-labelledby="biab-step-title">
              ${this.renderStep(step)}
            </main>
            ${this.activeHelp ? this.renderHelp(step) : ""}
          </div>
        </div>
      `;
      this.applyTranslations();
    }

    lang() {
      return window.i18n && typeof i18n.getLang === "function" ? i18n.getLang() : "en";
    }

    tr(text) {
      if (this.lang() !== "es" || text === null || text === undefined) return String(text || "");
      const raw = String(text);
      const normalized = raw.replace(/\s+/g, " ").trim();
      if (!normalized) return raw;
      const translated = BIAB_ES[normalized];
      if (translated) return raw.replace(normalized, translated);
      return raw
        .replace(/(\d+)% complete/g, "$1% completo")
        .replace(/(\d+)% done/g, "$1% listo")
        .replace(/(\d+) setup areas still need attention\./g, "$1 áreas de configuración aún requieren atención.")
        .replace(/(\d+) setup area still need attention\./g, "$1 área de configuración aún requiere atención.")
        .replace(/review requests sent from invoices/g, "solicitudes de reseña enviadas desde facturas")
        .replace(/review request sent from invoices/g, "solicitud de reseña enviada desde facturas");
    }

    applyTranslations() {
      if (!this.el || this.lang() !== "es") return;
      const walker = document.createTreeWalker(this.el, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
      });
      const nodes = [];
      let node;
      while ((node = walker.nextNode())) nodes.push(node);
      nodes.forEach((textNode) => {
        textNode.nodeValue = this.tr(textNode.nodeValue);
      });
      this.el.querySelectorAll("[aria-label], [placeholder], [title], [alt]").forEach((el) => {
        ["aria-label", "placeholder", "title", "alt"].forEach((attr) => {
          if (el.hasAttribute(attr)) el.setAttribute(attr, this.tr(el.getAttribute(attr)));
        });
      });
    }

    renderHeader(pct) {
      return `
        <header class="mtk-biab-setup__header">
          <div>
            <a class="mtk-biab-setup__brand" href="pages/index.html?page=dashboard" aria-label="Back to dashboard">
              <img src="img/footer-logo.png" alt="NALA" />
              <span>Business in a Box Setup</span>
            </a>
            <p>Your guided setup/editing space. Daily tools live from the main dashboard after setup.</p>
          </div>
          <div class="mtk-biab-setup__header-actions">
            <div class="mtk-biab-setup__progress-summary" aria-label="${pct}% complete">
              <strong>${pct}% done</strong>
              <span class="mtk-biab-setup__bar"><span style="width:${pct}%"></span></span>
            </div>
            <button type="button" class="mtk-biab-setup__icon-btn" data-biab-action="help" aria-expanded="${this.activeHelp ? "true" : "false"}">
              <span class="material-icons" aria-hidden="true">help_outline</span>
              <span>Help</span>
            </button>
            <a class="mtk-biab-setup__icon-btn mtk-biab-setup__dashboard-link" href="pages/index.html?page=dashboard">
              <span class="material-icons" aria-hidden="true">arrow_back</span>
              <span>Dashboard</span>
            </a>
          </div>
        </header>
      `;
    }

    renderStepNav(activeStep) {
      return `
        <nav class="mtk-biab-setup__stepper" aria-label="Setup steps">
          <ol>
            ${this.cfg.steps.map((step, index) => {
              const current = step.id === activeStep.id;
              const complete = !!this.state.completed[step.id];
              const skipped = !!this.state.skipped[step.id];
              const inProgress = !complete && !skipped && this.stepHasProgress(step);
              const status = complete ? "Complete" : skipped ? "Skipped" : current ? "Current" : inProgress ? "In progress" : "Not started";
              const icon = complete ? "check_circle" : skipped ? "remove_circle_outline" : current ? "radio_button_checked" : inProgress ? "pending" : "radio_button_unchecked";
              return `
                <li>
                  <button type="button" class="${current ? "is-current" : ""}" data-biab-action="goto" data-step-id="${step.id}" aria-current="${current ? "step" : "false"}">
                    <span class="material-icons" aria-hidden="true">${icon}</span>
                    <span><strong>${this.escape(step.navLabel)}</strong><small>${status}</small></span>
                  </button>
                </li>
              `;
            }).join("")}
          </ol>
        </nav>
      `;
    }

    renderStep(step) {
      if (step.kind === "intro") return this.renderIntro(step);
      if (step.kind === "launch") return this.renderLaunch(step);

      return `
        <section class="mtk-biab-setup__panel">
          <div class="mtk-biab-setup__panel-head">
            <span class="mtk-biab-setup__eyebrow">${this.escape(step.eyebrow || "")}</span>
            <h1 id="biab-step-title">${this.escape(step.title)}</h1>
            <p>${this.escape(step.summary || "")}</p>
          </div>
          ${step.sourceNote ? `<p class="mtk-biab-setup__source-note">${this.escape(step.sourceNote)}</p>` : ""}
          ${this.notice ? `<div class="mtk-biab-setup__notice" role="status">${this.escape(this.notice)}</div>` : ""}
          ${this.renderInstructions(step)}
          ${this.renderLinks(step)}
          ${this.renderFields(step)}
          ${this.renderFooter(step)}
        </section>
      `;
    }

    renderIntro(step) {
      return `
        <section class="mtk-biab-setup__panel mtk-biab-setup__intro">
          <span class="mtk-biab-setup__eyebrow">${this.escape(step.eyebrow)}</span>
          <h1 id="biab-step-title">${this.escape(step.title)}</h1>
          <p>${this.escape(step.summary)}</p>
          <div class="mtk-biab-setup__intro-grid">
            ${["Business background", "Legal reminders", "Financial setup", "Brand system", "Logo creation", "Actual website", "Google profile", "Invoices", "Reviews", "Launch review"].map(item => `
              <div><span class="material-icons" aria-hidden="true">arrow_forward</span>${item}</div>
            `).join("")}
          </div>
          <div class="mtk-biab-setup__video-placeholder">
            <span class="material-icons" aria-hidden="true">play_circle</span>
            <div><strong>Video walkthrough</strong><p>Marked for later: setup walkthrough and Business in a Box services overview.</p></div>
          </div>
          ${this.renderFooter(step, "Start setup")}
        </section>
      `;
    }

    renderLaunch(step) {
      const missing = this.cfg.steps.filter(item => item.id !== "launch" && item.id !== "intro" && !this.state.completed[item.id]);
      return `
        <section class="mtk-biab-setup__panel">
          <div class="mtk-biab-setup__panel-head">
            <span class="mtk-biab-setup__eyebrow">${this.escape(step.eyebrow)}</span>
            <h1 id="biab-step-title">${this.escape(step.title)}</h1>
            <p>${this.escape(step.summary)}</p>
          </div>
          <div class="mtk-biab-setup__readiness">
            <h2>Readiness summary</h2>
            ${missing.length ? `<p>${missing.length} setup area${missing.length === 1 ? "" : "s"} still need attention.</p>` : "<p>All guided setup areas are marked complete.</p>"}
            <ul>
              ${this.cfg.steps.filter(item => item.id !== "intro").map(item => `
                <li><span class="material-icons" aria-hidden="true">${this.state.completed[item.id] ? "check_circle" : "radio_button_unchecked"}</span>${this.escape(item.title)}</li>
              `).join("")}
            </ul>
          </div>
          ${this.renderFields(step)}
          <div class="mtk-biab-setup__tool-grid">
            ${this.cfg.tools.filter(tool => tool.id !== "setup").map(tool => this.renderToolCard(tool)).join("")}
          </div>
          ${this.renderFooter(step, "Finish setup")}
        </section>
      `;
    }

    renderInstructions(step) {
      if (!Array.isArray(step.instructions) || !step.instructions.length) return "";
      return `
        <section class="mtk-biab-setup__instructions" aria-label="Step-by-step instructions">
          <h2>Guided instructions</h2>
          <ol>${step.instructions.map(item => `<li>${this.escape(this.fill(item))}</li>`).join("")}</ol>
        </section>
      `;
    }

    renderLinks(step) {
      const links = this.getStepLinks(step);
      if (!links.length) return "";
      return `
        <section class="mtk-biab-setup__links" aria-label="Official links">
          <h2>Official links</h2>
          <div>
            ${links.map(link => `<a href="${this.escape(link.href)}" target="_blank" rel="noopener">${this.escape(link.label)} <span aria-hidden="true">↗</span></a>`).join("")}
          </div>
        </section>
      `;
    }

    getStepLinks(step) {
      const links = Array.isArray(step.links) ? [...step.links] : [];
      if (step?.id === "financial") {
        const processorLink = this.processorSetupLink();
        if (processorLink) links.push(processorLink);
        const bookkeepingLink = this.bookkeepingSetupLink();
        if (bookkeepingLink) links.push(bookkeepingLink);
      }
      return links;
    }

    processorSetupLink() {
      const links = {
        Stripe: { label: "Stripe account setup", href: "https://docs.stripe.com/get-started" },
        Square: { label: "Square account setup", href: "https://squareup.com/help/us/en/article/5123-square-get-started-guide" },
        "QuickBooks Payments": { label: "QuickBooks Payments setup", href: "https://quickbooks.intuit.com/sign-in/payments/" },
        "PayPal Business": { label: "PayPal Business account setup", href: "https://www.paypal.com/us/business/open-business-account" },
        "Wave Payments": { label: "Wave online payments setup", href: "https://support.waveapps.com/hc/en-us/articles/214268023-Set-up-online-payments" }
      };
      return links[this.val("paymentProcessor")] || null;
    }

    bookkeepingSetupLink() {
      const links = {
        Spreadsheet: { label: "IRS recordkeeping basics", href: "https://www.irs.gov/businesses/small-businesses-self-employed/recordkeeping" },
        QuickBooks: { label: "QuickBooks bookkeeping setup", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/product-setup/get-started-adjust-settings-sign-quickbooks-online/L3uA1fibV_US_en_US" },
        Wave: { label: "Wave bookkeeping setup", href: "https://support.waveapps.com/hc/en-us/articles/32449161224852-Create-a-Wave-account" },
        Other: { label: "IRS small business recordkeeping", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" }
      };
      return links[this.val("bookkeepingStatus")] || null;
    }

    renderFields(step) {
      if (!Array.isArray(step.fields) || !step.fields.length) return "";
      return `
        <form class="mtk-biab-setup__form" novalidate>
          ${step.fields.map(field => this.renderField(field)).join("")}
        </form>
      `;
    }

    renderField(field) {
      const value = this.state.values[field.id];
      const inputId = `biab-field-${field.id}`;
      const helper = field.helper ? `<small id="${inputId}-help">${this.escape(field.helper)}</small>` : "";
      const isRequired = this.fieldIsRequired(field);
      const required = isRequired ? " required" : "";
      const requiredMark = isRequired ? " *" : "";
      const described = field.helper ? ` aria-describedby="${inputId}-help"` : "";

      if (field.type === "info") {
        return `<section class="mtk-biab-setup__info" aria-label="${this.escape(field.label)}"><strong>${this.escape(field.label)}</strong><p>${this.escape(field.text || "")}</p></section>`;
      }

      if (field.type === "computed-url") {
        const computed = this.computedUrl(field);
        return `<label class="mtk-biab-setup__field mtk-biab-setup__field--full mtk-biab-setup__field--readonly" for="${inputId}"><span>${this.escape(field.label)}${requiredMark}</span><input id="${inputId}" data-field="${field.id}" type="url" value="${this.escape(computed)}" readonly${required}${described}>${helper}</label>`;
      }

      if (field.type === "seo-keywords") {
        const generated = this.generatedSeoKeywords();
        const displayValue = value || generated;
        return `<label class="mtk-biab-setup__field mtk-biab-setup__field--full" for="${inputId}"><span>${this.escape(field.label)}${requiredMark}</span><textarea id="${inputId}" data-field="${field.id}" rows="${Number(field.rows || 5)}" placeholder="${this.escape(field.placeholder || "")}"${required}${described}>${this.escape(displayValue)}</textarea>${helper}${generated ? `<small>Suggested terms: ${this.escape(generated)}</small>` : ""}</label>`;
      }

      if (field.type === "textarea") {
        const fullClass = field.full ? " mtk-biab-setup__field--full" : "";
        return `<label class="mtk-biab-setup__field${fullClass}" for="${inputId}"><span>${this.escape(field.label)}${requiredMark}</span><textarea id="${inputId}" data-field="${field.id}" rows="${Number(field.rows || 4)}" placeholder="${this.escape(field.placeholder || "")}"${required}${described}>${this.escape(value || "")}</textarea>${helper}</label>`;
      }

      if (field.type === "select") {
        return `<label class="mtk-biab-setup__field" for="${inputId}"><span>${this.escape(field.label)}${requiredMark}</span><select id="${inputId}" data-field="${field.id}"${required}>${(field.options || []).map(option => `<option value="${this.escape(option)}" ${value === option ? "selected" : ""}>${this.escape(option)}</option>`).join("")}</select>${helper}</label>`;
      }

      if (field.type === "checkbox") {
        return `<label class="mtk-biab-setup__check"><input id="${inputId}" data-field="${field.id}" type="checkbox" ${value ? "checked" : ""}${required}> <span>${this.escape(field.label)}${requiredMark}</span></label>`;
      }

      if (field.type === "checks") {
        const selected = Array.isArray(value) ? value : [];
        return `<fieldset class="mtk-biab-setup__checks"><legend>${this.escape(field.label)}${requiredMark}</legend><div class="mtk-biab-setup__checks-grid">${(field.options || []).map(option => `<label><input data-field="${field.id}" type="checkbox" value="${this.escape(option)}" ${selected.includes(option) ? "checked" : ""}> <span>${this.escape(option)}</span></label>`).join("")}</div></fieldset>`;
      }

      if (field.type === "palette") {
        const selected = value || this.cfg.palettes[0].id;
        return `<fieldset class="mtk-biab-setup__palettes"><legend>${this.escape(field.label)}${requiredMark}</legend><div class="mtk-biab-setup__palette-grid">${this.cfg.palettes.map(palette => `
          <label class="${selected === palette.id ? "is-selected" : ""}">
            <input data-field="${field.id}" type="radio" name="${field.id}" value="${this.escape(palette.id)}" ${selected === palette.id ? "checked" : ""}>
            <span class="mtk-biab-setup__swatches">${palette.colors.map(color => `<i style="background:${this.escape(color)}"></i>`).join("")}</span>
            <strong>${this.escape(palette.name)}</strong>
            <small>${this.escape(palette.position)}</small>
          </label>
        `).join("")}</div></fieldset>`;
      }

      if (field.type === "file") {
        const fileName = value ? `<small>Selected: ${this.escape(value)}</small>` : helper;
        return `<label class="mtk-biab-setup__field mtk-biab-setup__field--full" for="${inputId}"><span>${this.escape(field.label)}${requiredMark}</span><input id="${inputId}" data-field="${field.id}" type="file" accept=".svg,.png,.jpg,.jpeg,.webp"${required}${described}>${fileName}</label>`;
      }

      if (field.type === "logo-icons") {
        return this.renderLogoChoiceGroup(field, LOGO_ICONS, "logoIcon", "icons");
      }

      if (field.type === "logo-fonts") {
        return this.renderLogoChoiceGroup(field, LOGO_FONTS, "logoTypeStyle", "fonts");
      }

      if (field.type === "logo-templates") {
        return this.renderLogoChoiceGroup(field, LOGO_TEMPLATES, "logoTemplate", "templates");
      }

      if (field.type === "logo-variations") {
        return this.renderLogoChoiceGroup(field, LOGO_VARIATIONS, "logoVariation", "variations");
      }

      if (field.type === "logo-guidance") {
        return this.renderLogoGuidance();
      }

      if (field.type === "logo-preview") {
        return this.renderLogoPreview(field);
      }

      if (field.type === "logo-handoff") {
        return this.renderLogoHandoff();
      }

      return `<label class="mtk-biab-setup__field" for="${inputId}"><span>${this.escape(field.label)}${requiredMark}</span><input id="${inputId}" data-field="${field.id}" type="${this.escape(field.type || "text")}" value="${this.escape(value || "")}" placeholder="${this.escape(field.placeholder || "")}"${required}${described}>${helper}</label>`;
    }

    renderLogoChoiceGroup(field, options, fieldId, modifier) {
      const selected = this.logoValue(fieldId);
      return `
        <fieldset class="mtk-biab-setup__logo-choices mtk-biab-setup__logo-choices--${this.escape(modifier)}">
          <legend>${this.escape(field.label)}${this.fieldIsRequired(field) ? " *" : ""}</legend>
          <div>
            ${options.map(option => {
              const active = selected === option.id;
              const iconMarkup = modifier === "icons"
                ? `<span class="mtk-biab-setup__logo-choice-icon">${option.id === "monogram" ? this.escape(this.logoLetters()) : option.svg}</span>`
                : "";
              const fontStyle = modifier === "fonts" ? ` style="font-family:${this.escape(option.headline)}"` : "";
              return `
                <button type="button" class="${active ? "is-active" : ""}" data-biab-action="logo-choice" data-field="${this.escape(fieldId)}" data-value="${this.escape(option.id)}">
                  ${iconMarkup}
                  <strong${fontStyle}>${this.escape(option.label)}</strong>
                  ${option.summary ? `<small>${this.escape(option.summary)}</small>` : ""}
                </button>
              `;
            }).join("")}
          </div>
        </fieldset>
      `;
    }

    renderLogoPreview(field) {
      const source = this.val("logoSource") || "Create logo here";
      const template = this.logoResource(LOGO_TEMPLATES, "logoTemplate");
      const uploaded = this.val("logoUploadData");
      return `
        <section class="mtk-biab-setup__logo-designer">
          <div class="mtk-biab-setup__logo-summary">
            <span>Starter logo preview</span>
            <h2>${this.escape(template.label)}</h2>
            <p>${this.escape(source === "Upload existing icon/logo" ? "Uploaded artwork will appear in the preview cards below." : template.summary)}</p>
          </div>
          <div class="mtk-biab-setup__logo-preview-grid">
            ${this.renderLogoPreviewCard("Primary concept", "primary-dark")}
            ${this.renderLogoPreviewCard("Light background", "primary-light")}
            ${this.renderLogoPreviewCard("Social / favicon", "icon-only")}
            ${this.renderLogoPreviewCard("Vehicle banner", "horizontal")}
          </div>
        </section>
      `;
    }

    renderLogoGuidance() {
      const tips = [
        { icon: "visibility", title: "Readable", text: "Keep your business name readable at small sizes." },
        { icon: "filter_1", title: "Simple", text: "Use one strong icon or initials instead of combining several ideas." },
        { icon: "contrast", title: "Flexible", text: "Check the light, dark, square, and horizontal previews before applying the logo." }
      ];
      return `
        <section class="mtk-biab-setup__logo-guidance" aria-label="Logo quality checklist">
          <h2>Logo quality checklist</h2>
          <div>
            ${tips.map(tip => `
              <article>
                <span class="material-icons" aria-hidden="true">${this.escape(tip.icon)}</span>
                <strong>${this.escape(tip.title)}</strong>
                <p>${this.escape(tip.text)}</p>
              </article>
            `).join("")}
          </div>
        </section>
      `;
    }

    renderLogoPreviewCard(label, variant) {
      const palette = this.logoPalette();
      const dark = variant === "primary-dark" || variant === "horizontal" || variant === "icon-only";
      const bg = dark ? palette.surface : "#ffffff";
      const color = dark ? palette.textOnDark : palette.textOnLight;
      return `
        <article class="mtk-biab-setup__logo-preview-card">
          <span>${this.escape(label)}</span>
          <div style="background:${this.escape(bg)};color:${this.escape(color)}">
            ${this.buildLogoMarkup(variant)}
          </div>
        </article>
      `;
    }

    renderLogoHandoff() {
      return `
        <section class="mtk-biab-setup__logo-handoff">
          <h2>Logo kit</h2>
          <ul>
            <li>Use these versions across your website, invoices, Google profile, social accounts, shirts, and vehicle graphics.</li>
            <li>Download the SVG draft for records or outside design work.</li>
            <li>Apply the selected logo to the website when the preview looks right.</li>
          </ul>
          <div>
            <button type="button" class="mtk-biab-setup__btn" data-biab-action="logo-download">Download SVG draft</button>
            <button type="button" class="mtk-biab-setup__btn mtk-biab-setup__btn--primary" data-biab-action="logo-apply">Apply to website</button>
          </div>
        </section>
      `;
    }

    buildLogoMarkup(variant = "primary-dark") {
      const palette = this.logoPalette();
      const font = this.logoResource(LOGO_FONTS, "logoTypeStyle");
      const template = this.logoResource(LOGO_TEMPLATES, "logoTemplate");
      const source = this.val("logoSource") || "Create logo here";
      const uploaded = this.val("logoUploadData");
      const resolved = variant === "primary-dark" || variant === "primary-light" ? this.logoValue("logoVariation") : variant;
      const isStacked = resolved === "stacked" || template.id === "modern-stack";
      const isBadge = resolved === "badge" || template.id === "trusted-shield" || template.id === "monogram-seal";
      const isIconOnly = resolved === "icon-only";
      const icon = source === "Upload existing icon/logo" && uploaded
        ? `<span class="mtk-biab-setup__logo-mark mtk-biab-setup__logo-mark--custom"><img src="${this.escape(uploaded)}" alt=""></span>`
        : `<span class="mtk-biab-setup__logo-mark" style="color:${this.escape(palette.primary)};--logo-bg:${this.escape(variant === "primary-light" ? "#ffffff" : palette.surface)};">${this.logoIconMarkup()}</span>`;
      if (isIconOnly) return `<div class="mtk-biab-setup__logo-lockup mtk-biab-setup__logo-lockup--icon-only">${icon}</div>`;
      const cls = isBadge ? "badge" : isStacked ? "stacked" : "horizontal";
      return `
        <div class="mtk-biab-setup__logo-lockup mtk-biab-setup__logo-lockup--${cls}" style="--logo-heading-font:${this.escape(font.headline)};--logo-body-font:${this.escape(font.body)};">
          ${icon}
          <div class="mtk-biab-setup__logo-copy">
            <strong>${this.escape(this.val("businessName") || "Your Locksmith")}</strong>
            <span>${this.escape(this.val("tagline") || "Mobile Locksmith Service")}</span>
          </div>
        </div>
      `;
    }

    renderFooter(step, nextText) {
      const isFirst = this.currentStep === 0;
      const isLast = this.currentStep === this.cfg.steps.length - 1;
      return `
        <footer class="mtk-biab-setup__footer">
          <button type="button" class="mtk-biab-setup__btn" data-biab-action="prev" ${isFirst ? "disabled" : ""}>Previous</button>
          <div>
            ${step.kind !== "intro" && step.kind !== "launch" ? `<button type="button" class="mtk-biab-setup__btn" data-biab-action="skip">Skip for now</button>` : ""}
            <button type="button" class="mtk-biab-setup__btn mtk-biab-setup__btn--primary" data-biab-action="${isLast ? "complete" : "next"}">${nextText || "Save & Continue"}</button>
          </div>
        </footer>
      `;
    }

    renderHelp(step) {
      return `
        <aside class="mtk-biab-setup__help" aria-label="Help">
          <button type="button" class="mtk-biab-setup__help-close" data-biab-action="exit-help" aria-label="Close help"><span class="material-icons" aria-hidden="true">close</span></button>
          <h2>Help</h2>
          <p>Business in a Box guides you step by step through creating and configuring your locksmith business tools.</p>
          <p>Your answers are reused across the actual website, invoice generator, review workflow, business plan, brand kit, and marketing setup.</p>
          <h3>Current step</h3>
          <p><strong>${this.escape(step.title)}</strong></p>
          <p>${this.escape(step.summary || "")}</p>
          <h3>General issues</h3>
          <p>Email <a href="mailto:${this.escape(this.cfg.supportEmail)}">${this.escape(this.cfg.supportEmail)}</a>.</p>
          <h3>Video walkthrough</h3>
          <p>Coming later.</p>
        </aside>
      `;
    }

    renderTool(mode) {
      const titleMap = {
        invoices: "Invoice Generator",
        reviews: "Reviews",
        "business-plan": "Business Plan",
        brand: "Brand Kit",
        marketing: "Marketing Setup"
      };

      this.el.innerHTML = `
        <div class="mtk-biab-setup__shell">
          ${this.renderHeader(this.progressPct())}
          <main class="mtk-biab-setup__tool-page">
            <nav class="mtk-biab-setup__tool-nav" aria-label="Business in a Box tools">
              ${this.cfg.tools.map(tool => `<a class="${mode === tool.id ? "is-active" : ""}" href="${this.escape(tool.href)}"><span class="material-icons" aria-hidden="true">${this.escape(tool.icon)}</span>${this.escape(tool.label)}</a>`).join("")}
            </nav>
            <section class="mtk-biab-setup__panel">
              <div class="mtk-biab-setup__panel-head">
                <span class="mtk-biab-setup__eyebrow">Business in a Box tool</span>
                <h1>${this.escape(titleMap[mode] || "Business in a Box")}</h1>
              </div>
              ${mode === "invoices" ? this.renderInvoiceTool() : this.renderSimpleTool(mode)}
            </section>
          </main>
        </div>
      `;
      this.applyTranslations();
    }

    renderSimpleTool(mode) {
      if (mode === "reviews") {
        const requests = this.state.reviewRequests || [];
        return `
          <div class="mtk-biab-setup__review-summary"><strong>${requests.length}</strong><span>review request${requests.length === 1 ? "" : "s"} sent from invoices</span></div>
          <div class="mtk-biab-setup__list">${requests.length ? requests.map(req => `<article><strong>${this.escape(req.customerName || "Customer")}</strong><p>${this.escape(req.customerEmail || "")}</p><small>Source: ${this.escape(req.source || "Invoice")} · ${this.escape(req.createdAt || "")}</small></article>`).join("") : "<p>No invoice review requests have been sent yet.</p>"}</div>
        `;
      }

      if (mode === "brand") {
        return `<div class="mtk-biab-setup__tool-grid">${this.cfg.palettes.map(palette => `<article class="mtk-biab-setup__tool-card"><span class="mtk-biab-setup__swatches">${palette.colors.map(color => `<i style="background:${this.escape(color)}"></i>`).join("")}</span><h2>${this.escape(palette.name)}</h2><p>${this.escape(palette.position)}</p></article>`).join("")}</div><p class="mtk-biab-setup__source-note">Your brand kit uses your selected color scheme across the website, logo, invoices, and marketing materials.</p>`;
      }

      if (mode === "business-plan") {
        const serviceList = (this.val("services") || []).join(", ");
        const extraServices = this.val("additionalLaunchServices") || "";
        return `<article class="mtk-biab-setup__document-preview"><h2>${this.escape(this.val("businessName") || "Your Locksmith Business")}</h2><p><strong>Service area:</strong> ${this.escape(this.val("serviceArea") || "Not set")}</p><p><strong>Launch services:</strong> ${this.escape(serviceList || "Not set")}</p>${extraServices ? `<p><strong>Additional services:</strong> ${this.escape(extraServices)}</p>` : ""}<p><strong>Differentiator:</strong> clear pricing, professional arrival, clean work, ETA updates, detailed invoices, and review follow-up.</p></article>`;
      }

      return `<p>This area is available after setup. Use <a href="biab/index.html">Edit setup</a> to continue guided configuration.</p>`;
    }

    renderInvoiceTool() {
      const total = this.invoiceDraft.lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const reviewEmail = this.invoiceDraft.customerEmail || this.val("reviewEmailFrom") || this.val("businessEmail") || "";
      return `
        ${this.notice ? `<div class="mtk-biab-setup__notice" role="status">${this.escape(this.notice)}</div>` : ""}
        <div class="mtk-biab-setup__invoice-layout">
          <form class="mtk-biab-setup__form mtk-biab-setup__invoice-form">
            <label class="mtk-biab-setup__field"><span>Customer name</span><input data-invoice-field="customerName" value="${this.escape(this.invoiceDraft.customerName)}" placeholder="Jane Customer"></label>
            <label class="mtk-biab-setup__field"><span>Customer email</span><input data-invoice-field="customerEmail" type="email" value="${this.escape(this.invoiceDraft.customerEmail)}" placeholder="jane@example.com"></label>
            <label class="mtk-biab-setup__field"><span>Customer phone</span><input data-invoice-field="customerPhone" type="tel" value="${this.escape(this.invoiceDraft.customerPhone)}" placeholder="(555) 123-4567"></label>
            <label class="mtk-biab-setup__field"><span>Service type</span><select data-invoice-field="serviceType">${["Rekey service", "House lockout", "Lock change", "Deadbolt installation", "Commercial service"].map(item => `<option value="${this.escape(item)}" ${this.invoiceDraft.serviceType === item ? "selected" : ""}>${this.escape(this.tr(item))}</option>`).join("")}</select></label>
            <label class="mtk-biab-setup__field"><span>Job notes</span><textarea data-invoice-field="notes" rows="3">${this.escape(this.invoiceDraft.notes)}</textarea></label>
            <fieldset class="mtk-biab-setup__line-items"><legend>Line items</legend>
              ${this.invoiceDraft.lineItems.map((item, index) => `<div><input aria-label="Line item ${index + 1} label" data-invoice-field="lineLabel:${index}" value="${this.escape(item.label)}"><input aria-label="Line item ${index + 1} amount" data-invoice-field="lineAmount:${index}" type="number" min="0" step="0.01" value="${this.escape(item.amount)}"><button type="button" data-biab-action="invoice-remove-line" data-index="${index}" aria-label="Remove line item"><span class="material-icons" aria-hidden="true">delete</span></button></div>`).join("")}
              <button type="button" class="mtk-biab-setup__btn" data-biab-action="invoice-add-line">Add line</button>
            </fieldset>
            <label class="mtk-biab-setup__check"><input data-invoice-field="askReview" type="checkbox" ${this.invoiceDraft.askReview ? "checked" : ""}> <span>Ask for a review after sending this invoice</span></label>
            ${this.invoiceDraft.askReview ? `<label class="mtk-biab-setup__field"><span>Review request email</span><input data-invoice-field="reviewEmail" type="email" value="${this.escape(reviewEmail)}"></label>` : ""}
            <button type="button" class="mtk-biab-setup__btn mtk-biab-setup__btn--primary" data-biab-action="invoice-send">Send Invoice</button>
          </form>
          <aside class="mtk-biab-setup__invoice-preview" aria-label="Invoice preview">
            <h2>${this.escape(this.val("businessName") || "Your Locksmith Business")}</h2>
            <p>${this.escape(this.val("businessPhone") || "Business phone")}<br>${this.escape(this.val("businessEmail") || "Business email")}</p>
            <hr>
            <p><strong>Invoice:</strong> ${(this.val("invoicePrefix") || "INV")}-0001</p>
            <p><strong>Customer:</strong> ${this.escape(this.invoiceDraft.customerName || "Customer name")}</p>
            <table><tbody>${this.invoiceDraft.lineItems.map(item => `<tr><td>${this.escape(item.label || "Line item")}</td><td>$${Number(item.amount || 0).toFixed(2)}</td></tr>`).join("")}</tbody><tfoot><tr><th>Total</th><th>$${total.toFixed(2)}</th></tr></tfoot></table>
          </aside>
        </div>
      `;
    }

    renderToolCard(tool) {
      return `<a class="mtk-biab-setup__tool-card" href="${this.escape(tool.href)}"><span class="material-icons" aria-hidden="true">${this.escape(tool.icon)}</span><strong>${this.escape(tool.label)}</strong></a>`;
    }

    updateField(target) {
      const field = target.dataset.field;
      if (target.type === "file") {
        const file = target.files && target.files[0];
        this.state.values[field] = file ? file.name : "";
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.state.values.logoUploadData = event.target.result;
            this.syncCurrentStepCompletion();
            this.saveState();
            this.render();
          };
          reader.readAsDataURL(file);
        } else {
          delete this.state.values.logoUploadData;
        }
      } else if (target.type === "checkbox" && target.value && target.closest("fieldset")) {
        const selected = Array.from(this.el.querySelectorAll(`[data-field="${field}"]:checked`)).map(input => input.value);
        this.state.values[field] = selected;
      } else if (target.type === "checkbox") {
        this.state.values[field] = target.checked;
      } else {
        this.state.values[field] = target.value;
      }
      this.syncCurrentStepCompletion();
      this.saveState();
      if (target.closest(".mtk-biab-setup__palettes") || String(field).indexOf("logo") === 0 || field === "paymentProcessor" || field === "bookkeepingStatus") this.render();
    }

    setLogoChoice(field, value) {
      if (!field) return;
      this.state.values[field] = value;
      this.syncCurrentStepCompletion();
      this.saveState();
      this.render();
    }

    updateInvoiceField(target) {
      const field = target.dataset.invoiceField;
      if (field === "askReview") {
        this.invoiceDraft.askReview = target.checked;
        this.renderTool("invoices");
        return;
      }
      if (field === "reviewEmail") {
        this.invoiceDraft.customerEmail = target.value;
        return;
      }
      if (field.indexOf("lineLabel:") === 0) {
        this.invoiceDraft.lineItems[Number(field.split(":")[1])].label = target.value;
        this.renderTool("invoices");
        return;
      }
      if (field.indexOf("lineAmount:") === 0) {
        this.invoiceDraft.lineItems[Number(field.split(":")[1])].amount = target.value;
        this.renderTool("invoices");
        return;
      }
      this.invoiceDraft[field] = target.value;
      if (["customerName", "customerEmail", "serviceType"].includes(field)) this.renderTool("invoices");
    }

    addInvoiceLine() {
      this.invoiceDraft.lineItems.push({ label: this.tr("Line item"), amount: "0" });
      this.renderTool("invoices");
    }

    removeInvoiceLine(index) {
      if (this.invoiceDraft.lineItems.length <= 1) return;
      this.invoiceDraft.lineItems.splice(index, 1);
      this.renderTool("invoices");
    }

    sendInvoice() {
      const total = this.invoiceDraft.lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const record = {
        id: "INV-" + String((this.state.invoices || []).length + 1).padStart(4, "0"),
        customerName: this.invoiceDraft.customerName,
        customerEmail: this.invoiceDraft.customerEmail,
        serviceType: this.invoiceDraft.serviceType,
        total,
        createdAt: new Date().toLocaleString()
      };
      this.state.invoices = this.state.invoices || [];
      this.state.invoices.unshift(record);
      if (window.wc && typeof wc.publish === "function") {
        wc.publish("mtk-biab:invoice-sent", record);
      }

      if (this.invoiceDraft.askReview && this.invoiceDraft.customerEmail) {
        const request = {
          customerName: this.invoiceDraft.customerName,
          customerEmail: this.invoiceDraft.customerEmail,
          jobType: this.invoiceDraft.serviceType,
          reviewUrl: this.val("reviewPublicUrl") || (window.location.origin + "/repo_deploy/client/review.html"),
          source: record.id,
          createdAt: record.createdAt
        };
        this.state.reviewRequests = this.state.reviewRequests || [];
        this.state.reviewRequests.unshift(request);
        if (window.wc && typeof wc.publish === "function") {
          wc.publish("mtk-biab:review-request", request);
        }
      }

      this.saveState();
      this.notice = this.invoiceDraft.askReview && this.invoiceDraft.customerEmail
        ? `Invoice ${record.id} sent to ${record.customerEmail}. Review request also sent.`
        : `Invoice ${record.id} sent.`;
      this.renderTool("invoices");
    }

    nextStep() {
      this.completeStep(false);
      if (this.currentStep < this.cfg.steps.length - 1) this.currentStep += 1;
      this.render();
    }

    prevStep() {
      if (this.currentStep > 0) this.currentStep -= 1;
      this.render();
    }

    completeStep(render = true) {
      const step = this.cfg.steps[this.currentStep];
      if (this.stepCanComplete(step)) {
        this.state.completed[step.id] = true;
        delete this.state.skipped[step.id];
        this.notice = "";
      } else {
        delete this.state.completed[step.id];
        this.notice = "Saved. Complete the required items before this step is marked complete.";
      }
      this.saveState();
      if (render) this.render();
    }

    skipStep() {
      const step = this.cfg.steps[this.currentStep];
      this.state.skipped[step.id] = true;
      if (this.currentStep < this.cfg.steps.length - 1) this.currentStep += 1;
      this.saveState();
      this.render();
    }

    gotoStep(stepId) {
      const index = this.cfg.steps.findIndex(step => step.id === stepId);
      if (index >= 0) {
        this.currentStep = index;
        this.render();
      }
    }

    openTool(toolId) {
      const tool = this.cfg.tools.find(item => item.id === toolId);
      if (tool) window.location.href = tool.href;
    }

    toggleHelp(force) {
      this.activeHelp = typeof force === "boolean" ? force : !this.activeHelp;
      this.render();
    }

    resetDemoState() {
      localStorage.removeItem(this.cfg.storageKey);
      this.state = this.loadState();
      this.currentStep = 0;
      this.render();
    }

    progressPct() {
      const countable = this.cfg.steps.filter(step => step.id !== "intro");
      const done = countable.filter(step => this.state.completed[step.id]).length;
      return Math.round((done / Math.max(1, countable.length)) * 100);
    }

    syncCurrentStepCompletion() {
      const step = this.cfg.steps[this.currentStep];
      if (!step || !this.state.completed[step.id]) return;
      if (!this.stepCanComplete(step)) delete this.state.completed[step.id];
    }

    stepCanComplete(step) {
      if (!step) return false;
      if (step.kind === "intro") return true;
      const requiredFields = (step.fields || []).filter(field => this.fieldIsRequired(field));
      if (!requiredFields.length) return true;
      return requiredFields.every(field => this.fieldIsComplete(field));
    }

    stepHasProgress(step) {
      return (step.fields || []).some(field => this.fieldHasProgress(field));
    }

    fieldIsComplete(field) {
      const value = this.state.values[field.id];
      if (field.type === "checkbox") return value === true;
      if (field.type === "checks") return Array.isArray(value) && value.length > 0;
      if (field.type === "palette") return !!(value || this.cfg.palettes[0]?.id);
      if (field.type === "computed-url") return !!this.computedUrl(field);
      if (field.type === "seo-keywords") return !!String(value || this.generatedSeoKeywords()).trim();
      if (field.type === "select") return this.selectValueIsComplete(field, value || field.options?.[0]);
      if (field.type === "file") return !!this.state.values.logoUploadData;
      if (String(field.type || "").indexOf("logo-") === 0) return !!this.logoValue(field.id);
      return String(value || "").trim().length > 0;
    }

    fieldIsRequired(field) {
      if (!field.required) return false;
      if (!field.requiredWhen) return true;
      const actual = this.state.values[field.requiredWhen.field];
      if (Object.prototype.hasOwnProperty.call(field.requiredWhen, "equals")) {
        return actual === field.requiredWhen.equals || (!actual && field.requiredWhen.equals === "Create logo here");
      }
      return true;
    }

    fieldHasProgress(field) {
      const value = this.state.values[field.id];
      if (field.type === "checkbox") return value === true;
      if (field.type === "checks") return Array.isArray(value) && value.length > 0;
      if (field.type === "palette") return !!value;
      if (field.type === "computed-url") return false;
      if (field.type === "seo-keywords") return !!String(value || "").trim();
      if (field.type === "select") return this.selectValueIsComplete(field, value || field.options?.[0]);
      return String(value || "").trim().length > 0;
    }

    selectValueIsComplete(field, value) {
      if (!value) return false;
      const incomplete = field.incompleteValues || ["Not started", "Not selected", "Not decided", "Not offered yet", "Needs attention"];
      return !incomplete.includes(value);
    }

    val(key) {
      return this.state.values[key];
    }

    computedUrl(field) {
      const relative = field.source === "sitemap" ? "../client/sitemap.xml" : "../client/index.html";
      try {
        return new URL(relative, window.location.href).href;
      } catch (error) {
        return relative;
      }
    }

    generatedSeoKeywords() {
      const rawServices = Array.isArray(this.val("services")) ? this.val("services") : [];
      const extra = String(this.val("additionalLaunchServices") || "")
        .split(/[\n,]+/)
        .map(item => item.trim())
        .filter(Boolean);
      const services = [...rawServices, ...extra]
        .map(item => item.toLowerCase().replace(/\s*\/\s*/g, " ").trim())
        .filter(Boolean);
      const areas = String(this.val("serviceArea") || "")
        .split(/[\n,;]+/)
        .map(item => item.trim())
        .filter(Boolean);
      const primaryArea = areas[0] || "your service area";
      const terms = [
        `locksmith ${primaryArea}`,
        `${primaryArea} locksmith`,
        `mobile locksmith ${primaryArea}`,
        `locksmith near me`
      ];
      services.slice(0, 8).forEach(service => {
        terms.push(`${service} ${primaryArea}`);
        terms.push(`${service} near me`);
      });
      areas.slice(1, 4).forEach(area => {
        terms.push(`locksmith ${area}`);
        terms.push(`mobile locksmith ${area}`);
      });
      return [...new Set(terms)].join(", ");
    }

    logoValue(key) {
      const defaults = {
        logoIcon: "precision-key",
        logoTemplate: "service-wordmark",
        logoTypeStyle: "outfit-manrope",
        logoVariation: "horizontal"
      };
      return this.state.values[key] || defaults[key] || "";
    }

    logoResource(collection, key) {
      const selected = this.logoValue(key);
      return collection.find(item => item.id === selected) || collection[0];
    }

    logoPalette() {
      const selected = this.cfg.palettes.find(item => item.id === this.val("palette")) || this.cfg.palettes[0] || {};
      return {
        id: selected.id || "midnight-brass",
        surface: selected.colors?.[0] || "#0f172a",
        primary: selected.colors?.[1] || "#c6952d",
        accent: selected.colors?.[2] || "#f8fafc",
        textOnDark: "#ffffff",
        textOnLight: selected.colors?.[0] || "#0f172a",
        muted: selected.colors?.[3] || "#64748b"
      };
    }

    logoLetters() {
      return (this.val("logoLetters") || this.initialsFromName()).slice(0, 4).toUpperCase();
    }

    logoIconMarkup() {
      const icon = this.logoResource(LOGO_ICONS, "logoIcon");
      if (icon.id === "monogram") {
        return `<svg viewBox="0 0 96 96" aria-hidden="true"><rect x="18" y="18" width="60" height="60" rx="18" fill="currentColor"></rect><text x="48" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="800" fill="var(--logo-bg, #ffffff)">${this.escape(this.logoLetters())}</text></svg>`;
      }
      return icon.svg;
    }

    buildLogoSvg() {
      const palette = this.logoPalette();
      const name = this.escape(this.val("businessName") || "Your Locksmith");
      const tagline = this.escape(this.val("tagline") || "Mobile Locksmith Service");
      const initials = this.escape(this.logoLetters());
      return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="240" viewBox="0 0 720 240"><rect width="720" height="240" rx="28" fill="${palette.surface}"/><circle cx="108" cy="120" r="58" fill="${palette.primary}"/><text x="108" y="137" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="${palette.surface}">${initials}</text><text x="194" y="108" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="${palette.textOnDark}">${name}</text><text x="196" y="151" font-family="Arial, sans-serif" font-size="22" fill="${palette.accent}">${tagline}</text></svg>`;
    }

    buildLogoDataUrl() {
      if (this.val("logoSource") === "Upload existing icon/logo" && this.val("logoUploadData")) return this.val("logoUploadData");
      return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(this.buildLogoSvg());
    }

    applyLogoToWebsite() {
      const theme = this.logoPalette();
      const payload = {
        logo: this.buildLogoDataUrl(),
        businessName: this.val("businessName") || "Your Locksmith",
        tagline: this.val("tagline") || "Mobile Locksmith Service",
        logoKind: "artwork",
        theme: theme
      };
      try {
        localStorage.setItem("nalaBiabLogo", JSON.stringify(payload));
        localStorage.setItem("nalaBiabBrand", JSON.stringify({ theme: theme }));
      } catch (err) {
        console.warn("[mtk-biab-setup] Could not save logo", err);
      }
      if (window.wc && typeof wc.publish === "function") wc.publish("mtk-biab:logo-applied", payload);
      this.notice = "Logo draft applied to the website preview.";
      this.render();
    }

    downloadLogoSvg() {
      const blob = new Blob([this.buildLogoSvg()], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "locksmith-logo-draft.svg";
      link.click();
      URL.revokeObjectURL(link.href);
    }

    initialsFromName() {
      return String(this.val("businessName") || "YL")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3)
        .map(part => part.charAt(0))
        .join("") || "YL";
    }

    fill(text) {
      return String(text || "")
        .replace("Business Background", "Business Background")
        .replace("business name from Business Background", `business name "${this.val("businessName") || "from Business Background"}"`);
    }

    escape(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
  }

  window.MTKBIABSetup = MTKBIABSetup;
  window.__mtkBiabSetup = new MTKBIABSetup(window.MTK_BIAB_SETUP_CONFIG || {});
})();
