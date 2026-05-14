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

function biab_logo_zoviz_base_url() {
    $baseUrl = trim((string)biab_logo_config_value(array(
        'ZOVIZ_API_BASE_URL',
        'ZOVIZ_BASE_URL',
        'zoviz_api_base_url',
        'zovizBaseUrl'
    )));
    if ($baseUrl !== '') {
        return rtrim($baseUrl, '/');
    }

    $configuredEndpoint = trim((string)biab_logo_config_value(array(
        'ZOVIZ_LOGO_ENDPOINT',
        'ZOVIZ_API_ENDPOINT',
        'zoviz_logo_endpoint',
        'zoviz_api_endpoint',
        'zovizEndpoint',
        'zovizLogoEndpoint'
    )));
    if ($configuredEndpoint !== '') {
        $parts = parse_url($configuredEndpoint);
        if (is_array($parts) && !empty($parts['scheme']) && !empty($parts['host'])) {
            return $parts['scheme'] . '://' . $parts['host'] . (empty($parts['port']) ? '' : ':' . $parts['port']);
        }
    }

    return 'https://api.zoviz.com';
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
        'message' => $message !== '' ? $message : ($configured ? 'Zoviz API access is configured for watermarked previews.' : 'Zoviz API key is missing.')
    );
}

function biab_logo_zoviz_request($path, $payload) {
    if (!function_exists('curl_init')) {
        biab_logo_json_response(500, array('error' => 'Zoviz is configured, but cURL is not available on this server.'));
    }

    $headers = array(
        'Content-Type: application/json',
        'Accept: application/json',
        'User-Agent: NALA-BIAB/1.0'
    );
    $apiKey = biab_logo_zoviz_key();
    if ($apiKey !== '') {
        $headers[] = 'Authorization: Bearer ' . $apiKey;
    }

    $curl = curl_init(biab_logo_zoviz_base_url() . '/' . ltrim($path, '/'));
    curl_setopt_array($curl, array(
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        CURLOPT_TIMEOUT => 45
    ));
    $body = curl_exec($curl);
    $status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $error = curl_error($curl);
    curl_close($curl);

    if ($body === false || $status < 200 || $status >= 300) {
        $details = $error !== '' ? $error : ('HTTP ' . $status);
        $json = is_string($body) ? json_decode($body, true) : null;
        if (is_array($json) && !empty($json['description'])) {
            $details = (string)$json['description'];
        }
        biab_logo_json_response(502, array(
            'error' => 'Zoviz could not generate logos right now.',
            'details' => $details
        ));
    }

    $json = json_decode($body, true);
    if (!is_array($json)) {
        biab_logo_json_response(502, array('error' => 'Zoviz returned an unreadable response.'));
    }

    if (isset($json['ok']) && !$json['ok']) {
        biab_logo_json_response(502, array(
            'error' => 'Zoviz could not generate logos right now.',
            'details' => (string)($json['description'] ?? 'The Zoviz API rejected the request.')
        ));
    }

    return $json;
}

function biab_logo_zoviz_url($url) {
    $url = trim((string)$url);
    if ($url === '') {
        return '';
    }
    if (preg_match('/^https?:\/\//i', $url)) {
        return $url;
    }
    if (strpos($url, '/') === 0) {
        return biab_logo_zoviz_base_url() . $url;
    }
    return '';
}

function biab_logo_zoviz_best_file($record) {
    $files = is_array($record['logo_files'] ?? null) ? $record['logo_files'] : array();
    $fallback = null;
    foreach ($files as $file) {
        if (!is_array($file)) {
            continue;
        }
        if ($fallback === null) {
            $fallback = $file;
        }
        $name = (string)($file['name'] ?? '');
        $concepts = is_array($file['layout_concept'] ?? null) ? $file['layout_concept'] : array();
        $isHorizontal = in_array('horizontal', $concepts, true) || stripos($name, 'horizontal') !== false;
        if ($isHorizontal && empty($file['with_slogan'])) {
            return $file;
        }
    }
    return $fallback ?: array();
}

function biab_logo_zoviz_normalize_record($record, $index) {
    if (!is_array($record)) {
        return null;
    }
    $file = biab_logo_zoviz_best_file($record);
    $previewUrl = biab_logo_zoviz_url($file['preview_url'] ?? ($record['preview_url'] ?? ''));
    $recordId = (string)($record['id'] ?? '');
    $fileId = (string)($file['id'] ?? '');
    $id = $recordId !== '' ? $recordId : ('zoviz-logo-' . ($index + 1));
    if ($fileId !== '') {
        $id .= '-' . $fileId;
    }

    return biab_logo_normalize_logo(array(
        'id' => $id,
        'providerLogoId' => $recordId !== '' ? $recordId : $id,
        'name' => ($record['label'] ?? 'Logo option') . ' #' . ($index + 1),
        'svg' => '',
        'previewUrl' => $previewUrl,
        'image' => $previewUrl,
        'provider' => 'zoviz',
        'previewOnly' => true
    ));
}

function biab_logo_generate_zoviz($payload) {
    $apiKey = biab_logo_zoviz_key();
    if ($apiKey === '') {
        biab_logo_json_response(503, array(
            'error' => 'Zoviz API key is missing. Logo generation must use Zoviz watermarked previews.'
        ));
    }

    $businessName = trim((string)($payload['businessName'] ?? ''));
    if ($businessName === '') {
        $businessName = 'Locksmith Business';
    }
    $descriptionParts = array_filter(array(
        'Industry: locksmith',
        trim((string)($payload['serviceArea'] ?? '')) !== '' ? 'Service area: ' . trim((string)$payload['serviceArea']) : '',
        trim((string)($payload['services'] ?? '')) !== '' ? 'Services: ' . trim((string)$payload['services']) : '',
        trim((string)($payload['description'] ?? ''))
    ));

    $registered = biab_logo_zoviz_request('/album/brand/register', array(
        'brand_name' => array($businessName),
        'filters' => array(
            'industries' => array(),
            'symbol_keywords' => array(),
            'color_spectrum' => array(),
            'description' => biab_logo_slice(implode('. ', $descriptionParts), 700)
        )
    ));
    $albumId = (string)($registered['result']['id'] ?? '');
    if ($albumId === '') {
        biab_logo_json_response(502, array('error' => 'Zoviz did not return a generation ID.'));
    }

    $options = array();
    $seen = array();
    for ($attempt = 0; $attempt < 4 && count($options) < 6; $attempt++) {
        $generated = biab_logo_zoviz_request('/album/brand/generate', array('id' => $albumId));
        $records = $generated['result']['records'] ?? array();
        if (!is_array($records)) {
            continue;
        }
        foreach ($records as $record) {
            $option = biab_logo_zoviz_normalize_record($record, count($options));
            if (!$option || isset($seen[$option['id']])) {
                continue;
            }
            $seen[$option['id']] = true;
            $options[] = $option;
            if (count($options) === 6) {
                break;
            }
        }
    }

    if (count($options) !== 6) {
        biab_logo_json_response(502, array('error' => 'Zoviz did not return exactly 6 usable logo options.'));
    }

    return array(
        'options' => $options,
        'provider' => biab_logo_provider_status('zoviz', 'Zoviz returned 6 watermarked preview logos.')
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
