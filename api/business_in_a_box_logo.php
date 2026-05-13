<?php
require_once __DIR__ . '/_biab_logo_store.php';

function biab_logo_load_config() {
    static $values = null;
    if (is_array($values)) {
        return $values;
    }
    $values = array();
    $documentRoot = rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? ''), '/\\');
    foreach (array(
        $documentRoot !== '' ? $documentRoot . '/config.php' : '',
        __DIR__ . '/../config.php',
        __DIR__ . '/../../config.php'
    ) as $path) {
        if (is_file($path)) {
            require_once $path;
            foreach (get_defined_vars() as $key => $value) {
                if (is_scalar($value) || $value === null) {
                    $values[$key] = $value;
                }
                if (is_array($value) && ($key === 'config' || $key === 'CONFIG')) {
                    foreach ($value as $configKey => $configValue) {
                        if (is_scalar($configValue) || $configValue === null) {
                            $values[(string)$configKey] = $configValue;
                        }
                    }
                }
            }
            return $values;
        }
    }
    return $values;
}

function biab_logo_config_value($names) {
    $config = biab_logo_load_config();
    foreach ($names as $name) {
        if (defined($name)) {
            return constant($name);
        }
        if (array_key_exists($name, $config)) {
            return $config[$name];
        }
        if (array_key_exists(strtolower($name), $config)) {
            return $config[strtolower($name)];
        }
        if (isset($GLOBALS[$name])) {
            return $GLOBALS[$name];
        }
        $env = getenv($name);
        if ($env !== false) {
            return $env;
        }
    }
    return '';
}

function biab_logo_zoviz_key() {
    return trim((string)biab_logo_config_value(array(
        'ZOVIZ_API_KEY',
        'ZOVIZ_API_TOKEN',
        'ZOVIZ_KEY',
        'ZOVIZ_TOKEN',
        'zoviz_api_key',
        'zoviz_api_token',
        'zovizKey',
        'zovizApiKey'
    )));
}

function biab_logo_zoviz_endpoint() {
    $endpoint = trim((string)biab_logo_config_value(array(
        'ZOVIZ_LOGO_ENDPOINT',
        'ZOVIZ_API_ENDPOINT',
        'zoviz_logo_endpoint',
        'zoviz_api_endpoint',
        'zovizEndpoint',
        'zovizLogoEndpoint'
    )));
    return $endpoint !== '' ? $endpoint : 'https://api.zoviz.com/api/v1/logo-generate';
}

function biab_logo_provider_status($mode = null, $message = '') {
    $configured = biab_logo_zoviz_key() !== '';
    if ($mode === null) {
        $mode = $configured ? 'zoviz' : 'preview';
    }
    return array(
        'id' => 'zoviz',
        'label' => 'Zoviz Logo Engine API',
        'mode' => $mode,
        'configured' => $configured,
        'message' => $message !== '' ? $message : ($configured ? 'Zoviz API access is configured.' : 'Zoviz API key is missing.')
    );
}

function biab_logo_generate_zoviz($payload) {
    $endpoint = biab_logo_zoviz_endpoint();
    $apiKey = biab_logo_zoviz_key();
    if ($apiKey === '') {
        return array(
            'options' => biab_logo_preview_options($payload),
            'provider' => biab_logo_provider_status('preview')
        );
    }

    if (!function_exists('curl_init')) {
        biab_logo_json_response(500, array('error' => 'Zoviz is configured, but cURL is not available on this server.'));
    }

    $request = array(
        'brand_name' => (string)($payload['businessName'] ?? ''),
        'businessName' => (string)($payload['businessName'] ?? ''),
        'industry' => 'locksmith',
        'service_area' => (string)($payload['serviceArea'] ?? ''),
        'serviceArea' => (string)($payload['serviceArea'] ?? ''),
        'services' => (string)($payload['services'] ?? ''),
        'style' => (string)($payload['style'] ?? 'professional vector logo'),
        'colors' => is_array($payload['colors'] ?? null) ? $payload['colors'] : array('#111827', '#a98212', '#ffffff'),
        'count' => 6,
        'format' => 'svg'
    );

    $curl = curl_init($endpoint);
    curl_setopt_array($curl, array(
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
            'Accept: application/json'
        ),
        CURLOPT_POSTFIELDS => json_encode($request, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        CURLOPT_TIMEOUT => 45
    ));
    $body = curl_exec($curl);
    $status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $error = curl_error($curl);
    curl_close($curl);

    if ($body === false || $status < 200 || $status >= 300) {
        biab_logo_json_response(502, array(
            'error' => 'Zoviz could not generate logos right now.',
            'details' => $error !== '' ? $error : ('HTTP ' . $status)
        ));
    }

    $json = json_decode($body, true);
    if (!is_array($json)) {
        biab_logo_json_response(502, array('error' => 'Zoviz returned an unreadable response.'));
    }

    $rawOptions = array();
    foreach (array('options', 'logos', 'results', 'data') as $key) {
        if (isset($json[$key]) && is_array($json[$key])) {
            $rawOptions = $json[$key];
            break;
        }
    }

    $options = array();
    foreach ($rawOptions as $index => $item) {
        if (!is_array($item)) {
            continue;
        }
        $normalized = biab_logo_normalize_logo(array(
            'id' => $item['id'] ?? $item['logoId'] ?? $item['providerLogoId'] ?? ('zoviz-logo-' . ($index + 1)),
            'providerLogoId' => $item['logoId'] ?? $item['providerLogoId'] ?? $item['id'] ?? '',
            'name' => $item['name'] ?? $item['title'] ?? ('Logo option ' . ($index + 1)),
            'svg' => $item['svg'] ?? $item['svgContent'] ?? '',
            'previewUrl' => $item['previewUrl'] ?? $item['preview_url'] ?? $item['thumbnail'] ?? '',
            'image' => $item['image'] ?? $item['imageUrl'] ?? $item['downloadUrl'] ?? '',
            'provider' => 'zoviz',
            'previewOnly' => false
        ));
        if ($normalized) {
            $options[] = $normalized;
        }
    }

    if (!$options) {
        biab_logo_json_response(502, array('error' => 'Zoviz did not return usable logo options.'));
    }

    return array(
        'options' => array_slice($options, 0, 6),
        'provider' => biab_logo_provider_status('zoviz')
    );
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $uid = biab_logo_uid($_GET['nalaUID'] ?? '');
    $generated = biab_logo_get_options($uid);
    biab_logo_json_response(200, array(
        'ok' => true,
        'logo' => biab_logo_get($uid),
        'options' => $generated ? $generated['options'] : array(),
        'provider' => biab_logo_provider_status()
    ));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    biab_logo_json_response(405, array('error' => 'Method not allowed.'));
}

$data = biab_logo_read_json_body();
$uid = biab_logo_uid($data['nalaUID'] ?? '');
$action = $data['action'] ?? 'generate';

if ($action === 'reset') {
    biab_logo_reset($uid);
    biab_logo_json_response(200, array(
        'ok' => true,
        'logo' => null,
        'provider' => biab_logo_provider_status()
    ));
}

if ($action === 'save') {
    biab_logo_json_response(200, array(
        'ok' => true,
        'logo' => biab_logo_save($uid, is_array($data['logo'] ?? null) ? $data['logo'] : array()),
        'provider' => biab_logo_provider_status()
    ));
}

if ($action !== 'generate') {
    biab_logo_json_response(400, array('error' => 'Unknown logo action.'));
}

$existing = biab_logo_get_options($uid);
if ($existing) {
    biab_logo_json_response(200, array(
        'ok' => true,
        'options' => $existing['options'],
        'provider' => $existing['provider']
    ));
}

$generated = biab_logo_generate_zoviz($data);
$stored = biab_logo_save_options($uid, $generated['options'], $generated['provider']);
biab_logo_json_response(200, array(
    'ok' => true,
    'options' => $stored['options'],
    'provider' => $stored['provider']
));
?>
