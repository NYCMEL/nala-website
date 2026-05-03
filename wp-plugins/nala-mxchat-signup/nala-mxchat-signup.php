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
    return (string) $instructions . $extra;
}

function nala_mxchat_signup_pre_process($message, $user_id, $session_id)
{
    $message = nala_mxchat_signup_clean_message($message);
    $session_id = sanitize_text_field((string) $session_id);
    $state_key = nala_mxchat_signup_state_key($session_id);
    $state = get_transient($state_key);
    $is_active = is_array($state);

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
        'me llamo', 'mi nombre'
    ];

    foreach ($spanish_terms as $term) {
        if (str_contains($normalized, $term)) {
            return 'es';
        }
    }

    return $fallback === 'es' ? 'es' : 'en';
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

    $page_url = '';
    if (isset($_POST['current_page_url'])) {
        $page_url = esc_url_raw(wp_unslash((string) $_POST['current_page_url']));
    } elseif (isset($_SERVER['HTTP_REFERER'])) {
        $page_url = esc_url_raw(wp_unslash((string) $_SERVER['HTTP_REFERER']));
    }

    $host = $page_url !== '' ? (string) parse_url($page_url, PHP_URL_HOST) : '';
    $scheme = $page_url !== '' ? (string) parse_url($page_url, PHP_URL_SCHEME) : 'https';

    if ($host !== '') {
        $host = strtolower($host);
        if (str_ends_with($host, 'nala-test.com') || str_ends_with($host, 'nalanetwork.com')) {
            return $scheme . '://' . $host . '/api/register.php';
        }
    }

    return 'https://nala-test.com/api/register.php';
}
