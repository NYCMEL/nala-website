<?php
/**
 * Plugin Name: NALA MxChat Signup
 * Description: Adds a guided NALA account signup flow to MxChat without collecting passwords or payment details in chat.
 * Version: 1.0.0
 * Author: NALA
 */

if (!defined('ABSPATH')) {
    exit;
}

const NALA_MXCHAT_SIGNUP_ENDPOINT_OPTION = 'nala_mxchat_signup_endpoint';
const NALA_MXCHAT_SIGNUP_REGISTER_LINK_OPTION = 'nala_mxchat_signup_register_link';
const NALA_MXCHAT_SIGNUP_TTL = 1800;
const NALA_MXCHAT_SIGNUP_PRICING_TTL = 600;
const NALA_MXCHAT_SIGNUP_BUNDLE_DISCOUNT = 200;

add_filter('mxchat_pre_process_message', 'nala_mxchat_signup_pre_process', 10, 3);
add_filter('mxchat_system_instructions', 'nala_mxchat_signup_system_instructions', 10, 3);
add_action('admin_menu', 'nala_mxchat_signup_admin_menu');
add_action('admin_init', 'nala_mxchat_signup_register_settings');

function nala_mxchat_signup_admin_menu(): void
{
    add_options_page(
        'NALA MxChat Signup',
        'NALA MxChat Signup',
        'manage_options',
        'nala-mxchat-signup',
        'nala_mxchat_signup_render_settings_page'
    );
}

function nala_mxchat_signup_register_settings(): void
{
    register_setting('nala_mxchat_signup', NALA_MXCHAT_SIGNUP_ENDPOINT_OPTION, [
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => '',
    ]);

    register_setting('nala_mxchat_signup', NALA_MXCHAT_SIGNUP_REGISTER_LINK_OPTION, [
        'type' => 'string',
        'sanitize_callback' => 'nala_mxchat_signup_sanitize_link',
        'default' => '#register',
    ]);
}

function nala_mxchat_signup_render_settings_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }

    $endpoint = (string) get_option(NALA_MXCHAT_SIGNUP_ENDPOINT_OPTION, '');
    $register_link = (string) get_option(NALA_MXCHAT_SIGNUP_REGISTER_LINK_OPTION, '#register');
    ?>
    <div class="wrap">
        <h1>NALA MxChat Signup</h1>
        <p>Configure the NALA registration endpoint used when a visitor signs up through MxChat.</p>
        <form method="post" action="options.php">
            <?php settings_fields('nala_mxchat_signup'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="nala-mxchat-signup-endpoint">Registration endpoint</label></th>
                    <td>
                        <input id="nala-mxchat-signup-endpoint" class="regular-text" type="url"
                               name="<?php echo esc_attr(NALA_MXCHAT_SIGNUP_ENDPOINT_OPTION); ?>"
                               value="<?php echo esc_attr($endpoint); ?>"
                               placeholder="https://nala-test.com/api/register.php">
                        <p class="description">Leave blank to derive the endpoint from the page where the chat is running.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="nala-mxchat-signup-register-link">Register page link</label></th>
                    <td>
                        <input id="nala-mxchat-signup-register-link" class="regular-text" type="text"
                               name="<?php echo esc_attr(NALA_MXCHAT_SIGNUP_REGISTER_LINK_OPTION); ?>"
                               value="<?php echo esc_attr($register_link); ?>"
                               placeholder="#register">
                        <p class="description">Use a relative link such as #register so it continues to work after launch.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

function nala_mxchat_signup_sanitize_link($value): string
{
    $value = trim((string) $value);
    if ($value === '') {
        return '#register';
    }

    if (str_starts_with($value, '#') || str_starts_with($value, '/') || str_starts_with($value, 'docs/')) {
        return sanitize_text_field($value);
    }

    return esc_url_raw($value);
}

function nala_mxchat_signup_system_instructions($instructions, $bot_id, $session_id): string
{
    $extra = "\n\nNALA direct signup: If a visitor wants to sign up, register, create an account, enroll, join NALA, start free lessons, or get started, you may tell them they can complete signup directly in the chat or use the Register page. Do not ask for passwords, payment details, Social Security numbers, or private financial information in chat. The direct signup flow only collects full name, email, and phone, then NALA emails the next steps. Use generic privacy-safe wording and never reveal whether an email, phone, or personal detail already exists in the system.";

    if (nala_mxchat_signup_message_asks_pricing(nala_mxchat_signup_current_request_message())) {
        $pricing_context = nala_mxchat_signup_pricing_context();
        if ($pricing_context !== '') {
            $extra .= "\n\nCurrent pricing context from NALA checkout pricing:\n" . $pricing_context;
        }
    }

    return (string) $instructions . $extra;
}

function nala_mxchat_signup_pre_process($message, $user_id, $session_id)
{
    $message = nala_mxchat_signup_clean_message($message);
    $session_id = sanitize_text_field((string) $session_id);
    $state_key = nala_mxchat_signup_state_key($session_id);
    $state = get_transient($state_key);
    $is_active = is_array($state);

    if (!$is_active) {
        $fast_answer = nala_mxchat_signup_fast_answer($message);
        if ($fast_answer !== '') {
            return nala_mxchat_signup_response($fast_answer);
        }
    }

    if (!$is_active && !nala_mxchat_signup_is_trigger($message)) {
        return $message;
    }

    if (!$is_active) {
        $state = nala_mxchat_signup_default_state(nala_mxchat_signup_detect_language($message));
    }

    $state['lang'] = nala_mxchat_signup_detect_language($message, $state['lang'] ?? 'en');

    if (nala_mxchat_signup_is_cancel($message)) {
        delete_transient($state_key);
        return nala_mxchat_signup_response(nala_mxchat_signup_text('cancelled', $state));
    }

    $state = nala_mxchat_signup_capture_fields($message, $state);
    $yes = nala_mxchat_signup_is_yes($message);

    if (!empty($state['awaiting_email_confirm'])) {
        $email_from_message = nala_mxchat_signup_extract_email($message);
        if ($email_from_message !== '') {
            $state['email'] = $email_from_message;
            $state['email_confirmed'] = false;
            $state['awaiting_email_confirm'] = true;
            set_transient($state_key, $state, NALA_MXCHAT_SIGNUP_TTL);
            return nala_mxchat_signup_response(nala_mxchat_signup_text('confirm_email', $state));
        }

        if ($yes && !empty($state['email'])) {
            $state['email_confirmed'] = true;
            $state['awaiting_email_confirm'] = false;
        }
    }

    if (!empty($state['awaiting_final_confirm'])) {
        if ($yes) {
            $result = nala_mxchat_signup_submit_registration($state);
            delete_transient($state_key);
            if ($result['ok']) {
                return nala_mxchat_signup_response(nala_mxchat_signup_text('success', $state));
            }

            return nala_mxchat_signup_response(nala_mxchat_signup_text('submit_failed', $state));
        }

        $state['awaiting_final_confirm'] = false;
    }

    $next = nala_mxchat_signup_next_prompt($state);
    set_transient($state_key, $next['state'], NALA_MXCHAT_SIGNUP_TTL);
    return nala_mxchat_signup_response($next['text']);
}

function nala_mxchat_signup_default_state(string $lang): array
{
    return [
        'lang' => $lang,
        'name' => '',
        'email' => '',
        'email_confirmed' => false,
        'phone' => '',
        'awaiting_email_confirm' => false,
        'awaiting_final_confirm' => false,
    ];
}

function nala_mxchat_signup_state_key(string $session_id): string
{
    return 'nala_signup_' . md5($session_id !== '' ? $session_id : wp_generate_uuid4());
}

function nala_mxchat_signup_clean_message($message): string
{
    $message = is_string($message) ? wp_unslash($message) : '';
    return trim(wp_strip_all_tags($message));
}

function nala_mxchat_signup_normalize(string $message): string
{
    $message = remove_accents($message);
    $message = strtolower($message);
    $message = preg_replace('/[^a-z0-9@.+#\\s-]+/', ' ', $message);
    $message = preg_replace('/\\s+/', ' ', (string) $message);
    return trim((string) $message);
}

function nala_mxchat_signup_detect_language(string $message, string $fallback = 'en'): string
{
    $normalized = nala_mxchat_signup_normalize($message);
    $spanish_terms = [
        'registrarme', 'registrar', 'inscribirme', 'inscripcion', 'crear cuenta',
        'cuenta gratis', 'empezar', 'clases gratis', 'correo', 'telefono', 'nombre',
        'me llamo', 'mi nombre', 'que es nala', 'cuanto cuesta', 'precio',
        'certificacion', 'estudiantes', 'anos', 'negocio en una caja',
        'privacidad', 'politica', 'politicas', 'terminos', 'condiciones',
        'reembolso', 'devolucion', 'cuanto dura', 'duracion', 'lecciones',
        'modulos', 'envio', 'entrega', 'ganzuas', 'herramientas'
    ];

    foreach ($spanish_terms as $term) {
        if (str_contains($normalized, $term)) {
            return 'es';
        }
    }

    return $fallback === 'es' ? 'es' : 'en';
}

function nala_mxchat_signup_fast_answer(string $message): string
{
    $normalized = nala_mxchat_signup_normalize($message);
    if ($normalized === '') {
        return '';
    }

    $lang = nala_mxchat_signup_detect_language($message);
    $register_link = nala_mxchat_signup_register_link();
    $support_link = '[support@nalanetwork.com](mailto:support@nalanetwork.com)';

    $has_nala = str_contains($normalized, 'nala') || str_contains($normalized, 'north american locksmith association');
    $asks_course_length = nala_mxchat_signup_contains_any($normalized, [
        'course length', 'program length', 'course duration', 'program duration',
        'completion time', 'how long to complete', 'how long to finish',
        'how many lessons', 'lesson count', 'how many modules', 'module count',
        'cuanto dura', 'duracion', 'cuantas lecciones', 'cuantos modulos',
    ]) || (
        str_contains($normalized, 'how long') &&
        nala_mxchat_signup_contains_any($normalized, ['course', 'program', 'training', 'finish', 'complete'])
    );
    $asks_price = nala_mxchat_signup_message_asks_pricing($message);
    $asks_kit = nala_mxchat_signup_contains_any($normalized, [
        'kit', 'lockout kit', 'lock pick', 'lockpick', 'tools included',
        'shipping', 'ship', 'delivery', 'deliver', 'mail the kit',
        'herramientas', 'envio', 'enviar', 'entrega', 'kit de apertura', 'ganzuas'
    ]);
    $asks_refund = nala_mxchat_signup_contains_any($normalized, [
        'refund', 'refundable', 'cancel after purchase', 'cancellation', 'money back',
        'reembolso', 'devolucion', 'cancelar despues', 'devolver dinero'
    ]);
    $asks_privacy = nala_mxchat_signup_contains_any($normalized, [
        'privacy', 'personal information', 'data', 'cookies', 'payment information',
        'privacidad', 'informacion personal', 'datos', 'cookies'
    ]);
    $asks_terms = nala_mxchat_signup_contains_any($normalized, [
        'terms', 'terms and conditions', 'policy', 'policies', 'legal terms',
        'terminos', 'condiciones', 'politicas'
    ]);
    $asks_origin = $has_nala && nala_mxchat_signup_contains_any($normalized, [
        'where did nala start', 'where did it start', 'where is nala from',
        'origin', 'started', 'founded', 'founding', 'history',
        'origen', 'donde empezo', 'historia', 'fundada'
    ]);
    $asks_placement = nala_mxchat_signup_contains_any($normalized, [
        'job placement', 'placement', 'find me a job', 'will i get a job',
        'employment', 'income', 'make money', 'career outcome',
        'colocacion', 'trabajo', 'empleo', 'ingresos'
    ]);
    $asks_price_objection = nala_mxchat_signup_contains_any($normalized, [
        'too expensive', 'expensive', 'cant afford', 'cannot afford',
        'not affordable', 'costs too much', 'cost too much',
        'muy caro', 'demasiado caro', 'no puedo pagar', 'no me alcanza'
    ]);
    $asks_think_or_family = nala_mxchat_signup_contains_any($normalized, [
        'need to think', 'think about it', 'talk to my wife', 'talk to my husband',
        'talk to my spouse', 'talk to my partner', 'discuss with my family',
        'consult my wife', 'consult my husband', 'consult my spouse',
        'pensarlo', 'pensar', 'hablar con mi esposa', 'hablar con mi esposo',
        'hablar con mi pareja', 'consultar con mi familia'
    ]);
    $asks_success = nala_mxchat_signup_contains_any($normalized, [
        'will i succeed', 'can i succeed', 'will i pass', 'can i pass',
        'is it hard', 'too hard', 'is the course hard',
        'voy a tener exito', 'puedo lograrlo', 'voy a pasar', 'puedo pasar',
        'es dificil', 'muy dificil'
    ]);
    $asks_identity = $has_nala && nala_mxchat_signup_contains_any($normalized, [
        'what is', 'who is', 'tell me about', 'about nala', 'que es', 'quien es', 'hablame de'
    ]);
    $asks_history = $has_nala && nala_mxchat_signup_contains_any($normalized, [
        'how long', 'years', 'around', 'founded', 'founding', 'history',
        'cuanto tiempo', 'anos', 'fundada', 'historia'
    ]);
    $asks_students = $has_nala && nala_mxchat_signup_contains_any($normalized, [
        'students', 'student count', 'how many people', 'how many trained',
        'estudiantes', 'alumnos', 'cuantos'
    ]);

    if ($asks_course_length) {
        if ($lang === 'es') {
            return 'El programa es a tu propio ritmo, asi que puedes avanzar segun tu horario. Planifica aproximadamente 6 a 12 meses. Incluye 6 partes, 12 modulos, 45 lecciones y un paso final de certificacion. Esa estructura te ayuda a repetir lecciones, practicar y ganar confianza real en cerrajeria. Puedes [empezar con las lecciones gratis](' . $register_link . ').';
        }

        return 'The program is self-paced, so you can move through it around your schedule. Plan for about 6-12 months. It includes 6 parts, 12 modules, 45 lessons, and a final certification step. That structure gives you time to replay lessons, practice, and build real locksmith confidence. You can [start with the free lessons](' . $register_link . ').';
    }

    if ($asks_price_objection) {
        if ($lang === 'es') {
            return 'Tiene sentido mirar el valor antes de comprar. Lo bueno de NALA es que puedes empezar gratis y ver el estilo del programa primero. Premium agrega el entrenamiento completo, camino de certificacion y kit de apertura de autos; Business in a Box suma sitio web, logo, facturas, resenas y herramientas para lanzar el negocio. Puedes [empezar con las lecciones gratis](' . $register_link . ') y actualizar cuando estes listo.';
        }

        return 'It makes sense to weigh the value before buying. The good part is that NALA lets you start free and see the training style first. Premium adds full training, the certification path, and a car lockout kit; Business in a Box adds the website, logo, invoice tool, review workflow, and business launch tools. You can [start with the free lessons](' . $register_link . ') and upgrade when you are ready.';
    }

    if ($asks_think_or_family) {
        if ($lang === 'es') {
            return 'Claro. Una buena forma de decidir sin presion es empezar con las lecciones gratis y ver si el estilo de NALA te motiva. El programa esta hecho para avanzar paso a paso, repetir lecciones y construir habilidades reales. Puedes compartir la [pagina de registro](' . $register_link . ') y volver cuando estes listo.';
        }

        return 'Of course. A smart no-pressure next step is to start the free lessons and see whether NALA feels like the right fit. The program is built step by step, with replayable lessons and practical skills you can grow into. You can share the [registration page](' . $register_link . ') and come back when you are ready.';
    }

    if ($asks_success) {
        if ($lang === 'es') {
            return 'Si. NALA esta disenado para principiantes motivados: es a tu propio ritmo, puedes repetir lecciones y avanzas con practica, materiales y quizzes. No se garantizan empleo o ingresos, pero el camino te ayuda a construir habilidades reales y prepararte con mas confianza. Puedes [empezar gratis](' . $register_link . ') y ver el ritmo.';
        }

        return 'Yes. NALA is built for motivated beginners: it is self-paced, lessons are replayable, and you progress through practice, materials, and quizzes. Jobs or income are not guaranteed, but the path is designed to help you build real locksmith skills and confidence. You can [start free](' . $register_link . ') and get a feel for it.';
    }

    if ($asks_price) {
        return nala_mxchat_signup_pricing_answer($lang, $register_link);
    }

    if ($asks_kit) {
        if ($lang === 'es') {
            return 'Premium incluye un kit de apertura de autos con la compra, lo cual ayuda a conectar el entrenamiento con herramientas reales. Business in a Box incluye un set de herramientas de lockpick con la compra. Los contenidos exactos y el tiempo de envio aun se estan finalizando, pero se pueden enviar a cualquier lugar de EE. UU. Puedes [registrarte y empezar gratis](' . $register_link . ') antes de actualizar.';
        }

        return 'Premium includes a car lockout kit with purchase, which helps connect the training to real tools. Business in a Box includes a lock pick tool set with purchase. Exact contents and shipping timing are still being finalized, but kits can be sent anywhere in the U.S. You can [register and start free](' . $register_link . ') before upgrading.';
    }

    if ($asks_refund) {
        if ($lang === 'es') {
            return 'NALA tiene una politica estricta de no reembolsos una vez que se emite el acceso a la cuenta y al contenido del curso. Por eso conviene empezar con las lecciones gratis, revisar los [Terminos y Condiciones](docs/Terms%20and%20Conditions.pdf), y comprar cuando estes listo para comprometerte con el entrenamiento.';
        }

        return 'NALA has a strict no-refunds policy once account access to the course platform is issued. That is why it is smart to start with the free lessons, review the [Terms and Conditions](docs/Terms%20and%20Conditions.pdf), and purchase when you are ready to commit to the training.';
    }

    if ($asks_privacy) {
        if ($lang === 'es') {
            return 'NALA usa datos de cuenta, curso, compra, uso del sitio y cookies para operar y mejorar el programa. Los datos sensibles de tarjeta los manejan procesadores de pago, no el chat. Puedes revisar la [Politica de Privacidad](docs/Privacy%20Policy.pdf) antes de registrarte y luego [empezar las lecciones gratis](' . $register_link . ').';
        }

        return 'NALA uses account, course, purchase, site-use, and cookie data to operate and improve the program. Sensitive card details are handled by payment processors, not by chat. You can review the [Privacy Policy](docs/Privacy%20Policy.pdf) before registering, then [start the free lessons](' . $register_link . ').';
    }

    if ($asks_terms) {
        if ($lang === 'es') {
            return 'Los [Terminos y Condiciones](docs/Terms%20and%20Conditions.pdf) cubren elegibilidad, cuentas, acceso al curso, pagos, no reembolsos, reglas de conducta y limites legales. Tambien debes verificar requisitos de licencia locales. Es una buena lectura antes de comprar; despues puedes [empezar gratis](' . $register_link . ') y ver el programa.';
        }

        return 'The [Terms and Conditions](docs/Terms%20and%20Conditions.pdf) cover eligibility, accounts, course access, payments, no refunds, conduct rules, and legal limits. You should also verify local licensing requirements. It is a smart read before buying; then you can [start free](' . $register_link . ') and preview the program.';
    }

    if ($asks_placement) {
        if ($lang === 'es') {
            return 'NALA destaca un 95% de colocacion laboral. Eso no garantiza empleo, ingresos, licencia o aprobacion, pero muestra el enfoque practico del programa: habilidades reales, camino de certificacion y preparacion para oportunidades. Puedes [empezar con las lecciones gratis](' . $register_link . ') y ver si es el camino para ti.';
        }

        return 'NALA highlights 95% job placement. That is not a guarantee of employment, income, licensing, or approval, but it reflects the practical focus of the program: real skills, a certification path, and preparation for opportunities. You can [start with the free lessons](' . $register_link . ') and see if it fits your goals.';
    }

    if ($asks_origin) {
        if ($lang === 'es') {
            return 'NALA es un programa internacional de capacitacion en cerrajeria que ahora se expande en EE. UU. Tiene mas de 10 anos de experiencia y mas de 20K estudiantes capacitados. Es una base fuerte si quieres aprender una habilidad practica con camino de certificacion. Puedes [empezar gratis](' . $register_link . ').';
        }

        return 'NALA is an international locksmith training program now expanding in the U.S. It has 10+ years of experience and 20K+ students trained. That is a strong foundation if you want practical skills and a certification path. You can [start free](' . $register_link . ').';
    }

    if ($asks_identity || $asks_history || $asks_students) {
        if ($lang === 'es') {
            return 'NALA es la North American Locksmith Association. Ofrece capacitacion online de cerrajeria enfocada en habilidades practicas para trabajo automotriz, residencial, comercial, puertas y cajas fuertes. Es una forma emocionante de aprender una habilidad real desde casa, a tu propio ritmo.' . "\n\n"
                . '- Experiencia: mas de 10 anos' . "\n"
                . '- Estudiantes capacitados: mas de 20K' . "\n\n"
                . 'Puedes [empezar las lecciones gratis](' . $register_link . ').';
        }

        return 'NALA is the North American Locksmith Association. It offers online locksmith training focused on practical skills for automotive, residential, commercial, door, and safe-related work. It is an exciting way to build a real-world trade skill from home, at your own pace.' . "\n\n"
            . '- Experience: 10+ years' . "\n"
            . '- Students trained: 20K+' . "\n\n"
            . 'You can [start free lessons](' . $register_link . ').';
    }

    if (nala_mxchat_signup_contains_any($normalized, ['business in a box', 'bib', 'business-in-a-box', 'negocio en una caja'])) {
        if ($lang === 'es') {
            return 'Business in a Box es el lado de lanzamiento del negocio: te guia paso a paso con sitio web gratis, logo personalizado gratis, generador de facturas gratis, pagos, SEO/local, resenas y materiales de lanzamiento. Tambien incluye un set de herramientas de lockpick con la compra. Si quieres convertir el entrenamiento en un negocio, es el upgrade mas completo.';
        }

        return 'Business in a Box is the business-launch side of NALA: it guides you step by step with a free website, free custom logo, free invoice creator, payment setup, SEO/local setup, reviews, and launch materials. It also includes a lock pick tool set with purchase. If you want to turn training into a business, it is the most complete upgrade.';
    }

    if (nala_mxchat_signup_contains_any($normalized, ['certification', 'certificate', 'certified', 'certificacion', 'certificado'])) {
        if ($lang === 'es') {
            return 'Puedes obtener la certificacion de NALA completando el camino de entrenamiento requerido y el paso final de certificacion en tu panel. Es una meta clara para avanzar con estructura y mostrar que completaste el programa. Puedes [empezar gratis](' . $register_link . ') y ver el camino.';
        }

        return 'You can earn NALA certification by completing the required training path and final certification step in your dashboard. It gives you a clear goal to work toward and a structured way to show you completed the program. You can [start free](' . $register_link . ') and see the path.';
    }

    if (nala_mxchat_signup_contains_any($normalized, ['support', 'contact', 'help with my account', 'login problem', 'cant log in', 'cannot log in', 'soporte', 'contacto', 'problema con mi cuenta', 'no puedo entrar'])) {
        if ($lang === 'es') {
            return 'Para ayuda general o preguntas sobre tu cuenta, contacta ' . $support_link . '. Si ya tienes cuenta, tambien puedes usar el enlace de iniciar sesion en el sitio.';
        }

        return 'For general help or account questions, contact ' . $support_link . '. If you already have an account, you can also use the login link on the site.';
    }

    return '';
}

function nala_mxchat_signup_contains_any(string $haystack, array $needles): bool
{
    foreach ($needles as $needle) {
        if ($needle !== '' && str_contains($haystack, $needle)) {
            return true;
        }
    }

    return false;
}

function nala_mxchat_signup_message_asks_pricing(string $message): bool
{
    $normalized = nala_mxchat_signup_normalize($message);
    return nala_mxchat_signup_contains_any($normalized, [
        'price', 'pricing', 'cost', 'klarna', 'payment plan', 'how much',
        'cuanto cuesta', 'precio', 'costo', 'plan de pago'
    ]);
}

function nala_mxchat_signup_current_request_message(): string
{
    foreach (['message', 'user_message', 'input'] as $key) {
        if (isset($_POST[$key])) {
            return nala_mxchat_signup_clean_message((string) $_POST[$key]);
        }
    }

    return '';
}

function nala_mxchat_signup_pricing_answer(string $lang, string $register_link): string
{
    $prices = nala_mxchat_signup_pricing_data();
    $premium = nala_mxchat_signup_format_plan_price($prices['premium'] ?? []);
    $business = nala_mxchat_signup_format_bundle_price($prices);
    $business_addon = nala_mxchat_signup_format_plan_price($prices['business_addon'] ?? []);

    if (!$premium && !$business) {
        if ($lang === 'es') {
            return 'NALA te deja empezar con lecciones gratis y actualizar cuando estes listo. Cuando Klarna esta disponible, el pago mensual se calcula sobre 24 meses. Premium desbloquea el entrenamiento completo, certificacion y kit; Business in a Box agrega herramientas para lanzar el negocio. Puedes [empezar gratis](' . $register_link . ') y ver las opciones de compra.';
        }

        return 'NALA lets you start with free lessons and upgrade when you are ready. When Klarna is available, monthly pricing is calculated over 24 months. Premium unlocks the full training, certification path, and kit; Business in a Box adds tools to launch the business. You can [start free](' . $register_link . ') and see the purchase options.';
    }

    if ($lang === 'es') {
        $lines = ['NALA te deja empezar gratis y actualizar cuando estes listo. Las opciones son:'];
        if ($premium) {
            $lines[] = '- Premium: ' . $premium['monthly'] . ' por mes durante 24 meses con Klarna. Total: ' . $premium['total'] . '. Incluye entrenamiento completo, certificacion y kit de apertura de autos.';
        }
        if ($business) {
            $lines[] = '- Premium + Business in a Box: ' . $business['monthly'] . ' por mes durante 24 meses con Klarna. Total: ' . $business['total'] . ' despues del descuento de paquete de ' . $business['discount'] . ' (regular ' . $business['regular'] . '). Agrega sitio web, logo, facturas, resenas y herramientas de lanzamiento.';
        }
        if ($business_addon) {
            $lines[] = '- Business in a Box despues de comprar Premium por separado: total ' . $business_addon['total'] . '.';
        }
        $lines[] = 'Puedes [empezar con las lecciones gratis](' . $register_link . ') y actualizar cuando veas que NALA es el camino correcto para ti.';
        return implode("\n", $lines);
    }

    $lines = ['NALA lets you start free and upgrade when you are ready. The options are:'];
    if ($premium) {
        $lines[] = '- Premium: ' . $premium['monthly'] . ' per month for 24 months with Klarna. Total: ' . $premium['total'] . '. Includes full training, certification path, and car lockout kit.';
    }
    if ($business) {
        $lines[] = '- Premium + Business in a Box: ' . $business['monthly'] . ' per month for 24 months with Klarna. Total: ' . $business['total'] . ' after the ' . $business['discount'] . ' bundle discount (regular ' . $business['regular'] . '). Adds website, logo, invoices, reviews, and launch tools.';
    }
    if ($business_addon) {
        $lines[] = '- Business in a Box after buying Premium separately: total ' . $business_addon['total'] . '.';
    }
    $lines[] = 'You can [start with the free lessons](' . $register_link . ') and upgrade once you see NALA is the right path for you.';
    return implode("\n", $lines);
}

function nala_mxchat_signup_pricing_context(): string
{
    $prices = nala_mxchat_signup_pricing_data();
    if (!$prices) {
        return '';
    }

    $plans = [
        'Premium' => nala_mxchat_signup_format_plan_price($prices['premium'] ?? []),
        'Premium + Business in a Box bundle' => nala_mxchat_signup_format_bundle_price($prices),
        'Business in a Box add-on' => nala_mxchat_signup_format_plan_price($prices['business_addon'] ?? []),
    ];

    $lines = [];
    foreach ($plans as $name => $plan) {
        if (!$plan) {
            continue;
        }

        $line = '- ' . $name . ': ' . $plan['monthly'] . ' per month for 24 months with Klarna; total price ' . $plan['total'];
        if (!empty($plan['discount']) && !empty($plan['regular'])) {
            $line .= ' after ' . $plan['discount'] . ' bundle discount; regular total ' . $plan['regular'];
        }
        $lines[] = $line . '.';
    }

    if (!$lines) {
        return '';
    }

    $lines[] = '- Trial/free preview: $0.';
    $lines[] = '- Klarna monthly amount is the total price divided by 24; approval is handled at checkout.';
    return implode("\n", $lines);
}

function nala_mxchat_signup_pricing_data(): array
{
    $endpoint = nala_mxchat_signup_pricing_endpoint();
    if ($endpoint === '') {
        return [];
    }

    $cache_key = 'nala_mxchat_pricing_' . md5($endpoint);
    $cached = get_transient($cache_key);
    if (is_array($cached)) {
        return $cached;
    }

    $response = wp_remote_get($endpoint, [
        'timeout' => 6,
        'redirection' => 2,
        'headers' => [
            'Accept' => 'application/json',
        ],
    ]);

    if (is_wp_error($response)) {
        return [];
    }

    $status = (int) wp_remote_retrieve_response_code($response);
    if ($status < 200 || $status >= 300) {
        return [];
    }

    $body = wp_remote_retrieve_body($response);
    $json = json_decode((string) $body, true);
    if (!is_array($json) || empty($json['prices']) || !is_array($json['prices'])) {
        return [];
    }

    set_transient($cache_key, $json['prices'], NALA_MXCHAT_SIGNUP_PRICING_TTL);
    return $json['prices'];
}

function nala_mxchat_signup_pricing_endpoint(): string
{
    $page_url = nala_mxchat_signup_current_page_url();
    $host = $page_url !== '' ? (string) parse_url($page_url, PHP_URL_HOST) : '';
    $scheme = $page_url !== '' ? (string) parse_url($page_url, PHP_URL_SCHEME) : 'https';

    if ($host !== '') {
        $host = strtolower($host);
        if (nala_mxchat_signup_is_allowed_host($host)) {
            return ($scheme === 'http' ? 'http' : 'https') . '://' . $host . '/api/pricing.php';
        }
    }

    return 'https://nala-test.com/api/pricing.php';
}

function nala_mxchat_signup_format_plan_price($entry): array
{
    if (!is_array($entry) || !$entry) {
        return [];
    }

    $amount = nala_mxchat_signup_plan_amount($entry);

    if ($amount === null || $amount <= 0) {
        return [];
    }

    $total = isset($entry['display']) && trim((string) $entry['display']) !== ''
        ? trim((string) $entry['display'])
        : nala_mxchat_signup_money($amount, 0);

    return [
        'total' => $total,
        'monthly' => nala_mxchat_signup_money($amount / 24, 2),
    ];
}

function nala_mxchat_signup_format_bundle_price(array $prices): array
{
    $premium = nala_mxchat_signup_plan_amount($prices['premium'] ?? []);
    $addon = nala_mxchat_signup_plan_amount($prices['business_addon'] ?? []);
    $full = nala_mxchat_signup_plan_amount($prices['business_full'] ?? []);
    $regular = ($premium && $addon) ? $premium + $addon : $full;

    if (!$regular) {
        return [];
    }

    $discount = NALA_MXCHAT_SIGNUP_BUNDLE_DISCOUNT;
    $total = max($regular - $discount, 0);

    return [
        'total' => nala_mxchat_signup_money($total, nala_mxchat_signup_decimals_for_amount($total)),
        'monthly' => nala_mxchat_signup_money($total / 24, 2),
        'regular' => nala_mxchat_signup_money($regular, nala_mxchat_signup_decimals_for_amount($regular)),
        'discount' => nala_mxchat_signup_money($discount, 0),
    ];
}

function nala_mxchat_signup_plan_amount($entry): ?float
{
    if (!is_array($entry)) {
        return null;
    }

    if (isset($entry['unit_amount']) && is_numeric($entry['unit_amount'])) {
        return ((float) $entry['unit_amount']) / 100;
    }

    if (isset($entry['amount']) && is_numeric($entry['amount'])) {
        $amount = (float) $entry['amount'];
        return $amount > 10000 ? $amount / 100 : $amount;
    }

    if (isset($entry['display'])) {
        return nala_mxchat_signup_display_amount((string) $entry['display']);
    }

    return null;
}

function nala_mxchat_signup_decimals_for_amount(float $amount): int
{
    return abs($amount - round($amount)) < 0.005 ? 0 : 2;
}

function nala_mxchat_signup_display_amount(string $display): ?float
{
    $number = preg_replace('/[^0-9.]+/', '', $display);
    if ($number === '' || !is_numeric($number)) {
        return null;
    }

    return (float) $number;
}

function nala_mxchat_signup_money(float $amount, int $decimals): string
{
    return '$' . number_format($amount, $decimals, '.', ',');
}

function nala_mxchat_signup_is_trigger(string $message): bool
{
    $normalized = nala_mxchat_signup_normalize($message);
    if ($normalized === '') {
        return false;
    }

    $blocked = ['business registration', 'register my business', 'business license', 'ein', 'google business', 'legal setup', 'licensing'];
    foreach ($blocked as $phrase) {
        if (str_contains($normalized, $phrase)) {
            return false;
        }
    }

    $strong_triggers = [
        'sign up', 'signup', 'create account', 'create my account', 'start free lessons',
        'start the free lessons', 'enroll', 'join nala', 'get started with nala',
        'register for nala', 'register for the course', 'register online',
        'i want to register', 'i want to sign up', 'can i sign up', 'can i register',
        'registrarme', 'inscribirme', 'crear cuenta', 'crear mi cuenta',
        'empezar clases gratis', 'unirme a nala', 'quiero registrarme'
    ];

    foreach ($strong_triggers as $phrase) {
        if (str_contains($normalized, $phrase)) {
            return true;
        }
    }

    if (str_contains($normalized, 'register') && preg_match('/\\b(account|course|class|lesson|nala|online|here|me)\\b/', $normalized)) {
        return true;
    }

    return false;
}

function nala_mxchat_signup_is_cancel(string $message): bool
{
    $normalized = nala_mxchat_signup_normalize($message);
    return in_array($normalized, ['cancel', 'stop', 'never mind', 'nevermind', 'no thanks', 'cancelar', 'parar', 'no gracias'], true);
}

function nala_mxchat_signup_is_yes(string $message): bool
{
    $normalized = nala_mxchat_signup_normalize($message);
    return in_array($normalized, ['yes', 'y', 'yeah', 'yep', 'correct', 'confirm', 'submit', 'go ahead', 'ok', 'okay', 'si', 'claro', 'correcto', 'confirmar'], true);
}

function nala_mxchat_signup_capture_fields(string $message, array $state): array
{
    $email = nala_mxchat_signup_extract_email($message);
    if ($email !== '') {
        if ($email !== ($state['email'] ?? '')) {
            $state['email_confirmed'] = false;
        }
        $state['email'] = $email;
    }

    $phone = nala_mxchat_signup_extract_phone($message);
    if ($phone !== '') {
        $state['phone'] = $phone;
    }

    $name = nala_mxchat_signup_extract_name($message, $email);
    if ($name !== '') {
        $state['name'] = $name;
    } elseif (empty($state['name']) && empty($state['email']) && empty($state['phone']) && nala_mxchat_signup_looks_like_name($message)) {
        $state['name'] = nala_mxchat_signup_format_name($message);
    }

    return $state;
}

function nala_mxchat_signup_extract_email(string $message): string
{
    if (preg_match('/[A-Z0-9._%+\\-]+@[A-Z0-9.\\-]+\\.[A-Z]{2,}/i', $message, $matches)) {
        $email = strtolower(trim($matches[0]));
        return is_email($email) ? $email : '';
    }

    return '';
}

function nala_mxchat_signup_extract_phone(string $message): string
{
    if (!preg_match_all('/(?:\\+?1[\\s.\\-]?)?(?:\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}|\\+?\\d[\\d\\s().\\-]{6,}\\d)/', $message, $matches)) {
        return '';
    }

    foreach ($matches[0] as $candidate) {
        $candidate = trim($candidate);
        $digits = preg_replace('/\\D+/', '', $candidate);
        if (strlen((string) $digits) >= 7 && strlen((string) $digits) <= 15) {
            return $candidate;
        }
    }

    return '';
}

function nala_mxchat_signup_extract_name(string $message, string $email = ''): string
{
    $patterns = [
        "/\\b(?:my name is|name is|i am|i'm)\\s+([a-z][a-z .'\\-]{1,80})/i",
        "/\\b(?:me llamo|mi nombre es|soy)\\s+([a-z][a-z .'\\-]{1,80})/i",
        "/\\bname\\s*[:\\-]\\s*([a-z][a-z .'\\-]{1,80})/i",
        "/\\bnombre\\s*[:\\-]\\s*([a-z][a-z .'\\-]{1,80})/i",
    ];

    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $message, $matches)) {
            return nala_mxchat_signup_format_name($matches[1]);
        }
    }

    if ($email !== '') {
        $pos = stripos($message, $email);
        if ($pos !== false && $pos > 0) {
            $before_email = substr($message, 0, $pos);
            $before_email = preg_replace('/\\b(sign me up|signup|sign up|register me|register|create account|enroll|join nala|registrarme|crear cuenta)\\b/i', '', (string) $before_email);
            if (nala_mxchat_signup_looks_like_name($before_email)) {
                return nala_mxchat_signup_format_name($before_email);
            }
        }
    }

    return '';
}

function nala_mxchat_signup_looks_like_name(string $value): bool
{
    $value = trim($value);
    if ($value === '' || strlen($value) < 3 || strlen($value) > 80) {
        return false;
    }

    if (str_contains($value, '@') || preg_match('/\\d/', $value)) {
        return false;
    }

    $normalized = nala_mxchat_signup_normalize($value);
    if (nala_mxchat_signup_is_yes($value) || nala_mxchat_signup_is_cancel($value) || nala_mxchat_signup_is_trigger($value)) {
        return false;
    }

    return (bool) preg_match("/^[a-z][a-z .'\\-]+$/i", $normalized);
}

function nala_mxchat_signup_format_name(string $value): string
{
    $value = wp_strip_all_tags($value);
    $value = preg_replace('/\\b(?:email|correo|phone|telefono|number|numero)\\b.*$/i', '', (string) $value);
    $value = preg_replace("/[^a-zA-Z .'\\-]/", ' ', (string) $value);
    $value = preg_replace('/\\s+/', ' ', (string) $value);
    $value = trim((string) $value, " .'-");

    if ($value === '') {
        return '';
    }

    return ucwords(strtolower($value));
}

function nala_mxchat_signup_next_prompt(array $state): array
{
    if (empty($state['name'])) {
        $state['awaiting_email_confirm'] = false;
        $state['awaiting_final_confirm'] = false;
        return ['state' => $state, 'text' => nala_mxchat_signup_text('ask_name', $state)];
    }

    if (empty($state['email'])) {
        $state['awaiting_email_confirm'] = false;
        $state['awaiting_final_confirm'] = false;
        return ['state' => $state, 'text' => nala_mxchat_signup_text('ask_email', $state)];
    }

    if (!is_email($state['email'])) {
        $state['email'] = '';
        $state['email_confirmed'] = false;
        $state['awaiting_email_confirm'] = false;
        $state['awaiting_final_confirm'] = false;
        return ['state' => $state, 'text' => nala_mxchat_signup_text('invalid_email', $state)];
    }

    if (empty($state['email_confirmed'])) {
        $state['awaiting_email_confirm'] = true;
        $state['awaiting_final_confirm'] = false;
        return ['state' => $state, 'text' => nala_mxchat_signup_text('confirm_email', $state)];
    }

    if (empty($state['phone'])) {
        $state['awaiting_email_confirm'] = false;
        $state['awaiting_final_confirm'] = false;
        return ['state' => $state, 'text' => nala_mxchat_signup_text('ask_phone', $state)];
    }

    if (!nala_mxchat_signup_phone_is_valid($state['phone'])) {
        $state['phone'] = '';
        $state['awaiting_final_confirm'] = false;
        return ['state' => $state, 'text' => nala_mxchat_signup_text('invalid_phone', $state)];
    }

    $state['awaiting_email_confirm'] = false;
    $state['awaiting_final_confirm'] = true;
    return ['state' => $state, 'text' => nala_mxchat_signup_text('final_confirm', $state)];
}

function nala_mxchat_signup_phone_is_valid(string $phone): bool
{
    $digits = preg_replace('/\\D+/', '', $phone);
    return strlen((string) $digits) >= 7 && strlen((string) $digits) <= 15;
}

function nala_mxchat_signup_text(string $key, array $state): string
{
    $lang = ($state['lang'] ?? 'en') === 'es' ? 'es' : 'en';
    $register_link = nala_mxchat_signup_register_link();
    $privacy_link = 'docs/Privacy%20Policy.pdf';
    $terms_link = 'docs/Terms%20and%20Conditions.pdf';

    $name = $state['name'] ?? '';
    $email = $state['email'] ?? '';
    $phone = $state['phone'] ?? '';

    $strings = [
        'en' => [
            'ask_name' => 'I can help you create your free NALA account here. Please send your full name.',
            'ask_email' => 'Thanks. What email should we use for your account?',
            'confirm_email' => 'Please confirm this email: ' . $email . '. Reply yes to continue, or send the correct email.',
            'invalid_email' => 'That email does not look valid. Please send the email you want to use for your account.',
            'ask_phone' => 'What phone number should we use for your account?',
            'invalid_phone' => 'That phone number does not look valid. Please send a phone number with at least 7 digits.',
            'final_confirm' => 'Ready to create your free NALA account with ' . $name . ', ' . $email . ', and ' . $phone . '? By replying yes, you agree to the [Privacy Policy](' . $privacy_link . ') and [Terms and Conditions](' . $terms_link . '). Reply yes to submit, or send a correction.',
            'success' => 'If registration can be completed, we will email the next steps so you can set your password and start the free lessons. You can also open the [Register page](' . $register_link . ').',
            'submit_failed' => 'I could not complete signup from chat right now. Please use the [Register page](' . $register_link . '), or contact [support@nalanetwork.com](mailto:support@nalanetwork.com).',
            'cancelled' => 'No problem. I stopped the chat signup. You can still use the [Register page](' . $register_link . ') whenever you are ready.',
        ],
        'es' => [
            'ask_name' => 'Puedo ayudarte a crear tu cuenta gratis de NALA aqui. Envia tu nombre completo.',
            'ask_email' => 'Gracias. Que correo electronico debemos usar para tu cuenta?',
            'confirm_email' => 'Confirma este correo: ' . $email . '. Responde si para continuar, o envia el correo correcto.',
            'invalid_email' => 'Ese correo no parece valido. Envia el correo que quieres usar para tu cuenta.',
            'ask_phone' => 'Que numero de telefono debemos usar para tu cuenta?',
            'invalid_phone' => 'Ese numero de telefono no parece valido. Envia un numero con al menos 7 digitos.',
            'final_confirm' => 'Listo para crear tu cuenta gratis de NALA con ' . $name . ', ' . $email . ' y ' . $phone . '? Al responder si, aceptas la [Politica de Privacidad](' . $privacy_link . ') y los [Terminos y Condiciones](' . $terms_link . '). Responde si para enviar, o envia una correccion.',
            'success' => 'Si el registro se puede completar, enviaremos los siguientes pasos por correo para que configures tu contrasena y empieces las lecciones gratis. Tambien puedes abrir la [pagina de registro](' . $register_link . ').',
            'submit_failed' => 'No pude completar el registro desde el chat ahora mismo. Usa la [pagina de registro](' . $register_link . ') o contacta [support@nalanetwork.com](mailto:support@nalanetwork.com).',
            'cancelled' => 'Sin problema. Detuve el registro por chat. Puedes usar la [pagina de registro](' . $register_link . ') cuando estes listo.',
        ],
    ];

    return $strings[$lang][$key] ?? $strings['en'][$key] ?? '';
}

function nala_mxchat_signup_register_link(): string
{
    $link = (string) get_option(NALA_MXCHAT_SIGNUP_REGISTER_LINK_OPTION, '#register');
    return $link !== '' ? $link : '#register';
}

function nala_mxchat_signup_response(string $text): array
{
    return [
        'text' => $text,
        'html' => '',
    ];
}

function nala_mxchat_signup_submit_registration(array $state): array
{
    $endpoint = nala_mxchat_signup_endpoint();
    if ($endpoint === '') {
        return ['ok' => false, 'reason' => 'missing_endpoint'];
    }

    $payload = [
        'name' => (string) ($state['name'] ?? ''),
        'email' => (string) ($state['email'] ?? ''),
        'email2' => (string) ($state['email'] ?? ''),
        'phone' => (string) ($state['phone'] ?? ''),
    ];

    $response = wp_remote_post($endpoint, [
        'timeout' => 15,
        'redirection' => 2,
        'headers' => [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ],
        'body' => wp_json_encode($payload),
    ]);

    if (is_wp_error($response)) {
        error_log('NALA MxChat signup request failed: ' . $response->get_error_message());
        return ['ok' => false, 'reason' => 'request_failed'];
    }

    $status = (int) wp_remote_retrieve_response_code($response);
    if ($status >= 200 && $status < 300) {
        return ['ok' => true];
    }

    error_log('NALA MxChat signup endpoint returned HTTP ' . $status);
    return ['ok' => false, 'reason' => 'bad_status'];
}

function nala_mxchat_signup_endpoint(): string
{
    $configured = trim((string) get_option(NALA_MXCHAT_SIGNUP_ENDPOINT_OPTION, ''));
    if ($configured !== '') {
        return esc_url_raw($configured);
    }

    $page_url = nala_mxchat_signup_current_page_url();
    $host = $page_url !== '' ? (string) parse_url($page_url, PHP_URL_HOST) : '';
    $scheme = $page_url !== '' ? (string) parse_url($page_url, PHP_URL_SCHEME) : 'https';

    if ($host !== '') {
        $host = strtolower($host);
        if (nala_mxchat_signup_is_allowed_host($host)) {
            return ($scheme === 'http' ? 'http' : 'https') . '://' . $host . '/api/register.php';
        }
    }

    return 'https://nala-test.com/api/register.php';
}

function nala_mxchat_signup_current_page_url(): string
{
    foreach (['current_page_url', 'page_url'] as $key) {
        if (isset($_POST[$key])) {
            $url = esc_url_raw(wp_unslash((string) $_POST[$key]));
            if ($url !== '') {
                return $url;
            }
        }
    }

    if (isset($_SERVER['HTTP_REFERER'])) {
        return esc_url_raw(wp_unslash((string) $_SERVER['HTTP_REFERER']));
    }

    return '';
}

function nala_mxchat_signup_is_allowed_host(string $host): bool
{
    $host = strtolower($host);
    return $host === 'nala-test.com'
        || str_ends_with($host, '.nala-test.com')
        || $host === 'nalanetwork.com'
        || str_ends_with($host, '.nalanetwork.com');
}
