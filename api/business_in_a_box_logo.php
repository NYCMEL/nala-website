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
        __DIR__ . '/../../config.php',
        __DIR__ . '/../../../config.php'
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
        'label' => 'Logo Generator',
        'mode' => $mode,
        'configured' => $configured,
        'generatorVersion' => biab_logo_generation_version(),
        'message' => $message !== '' ? $message : ($configured ? 'Logo generation is configured for preview logos.' : 'Logo generation is not configured yet.')
    );
}

function biab_logo_generation_version() {
    return 2;
}

function biab_logo_options_are_stale($generated) {
    if (!is_array($generated)) {
        return false;
    }
    $provider = is_array($generated['provider'] ?? null) ? $generated['provider'] : array();
    $version = (int)($provider['generatorVersion'] ?? 0);
    return $version < biab_logo_generation_version();
}

function biab_logo_zoviz_request($path, $payload) {
    if (!function_exists('curl_init')) {
        biab_logo_json_response(500, array('error' => 'Logo generation is configured, but this server cannot connect to the generator.'));
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
            'error' => 'The logo generator could not create logos right now.',
            'details' => $details
        ));
    }

    $json = json_decode($body, true);
    if (!is_array($json)) {
        biab_logo_json_response(502, array('error' => 'The logo generator returned an unreadable response.'));
    }

    if (isset($json['ok']) && !$json['ok']) {
        biab_logo_json_response(502, array(
            'error' => 'The logo generator could not create logos right now.',
            'details' => (string)($json['description'] ?? 'The logo generator rejected the request.')
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
    if (!biab_logo_zoviz_record_allowed($record)) {
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
        'colors' => biab_logo_zoviz_record_colors($record),
        'provider' => 'zoviz',
        'previewOnly' => true
    ));
}

function biab_logo_zoviz_record_allowed($record) {
    foreach (biab_logo_zoviz_record_colors($record) as $color) {
        if (biab_logo_color_is_pink_or_purple($color)) {
            return false;
        }
    }
    return true;
}

function biab_logo_zoviz_record_colors($record) {
    $colors = array();
    $stack = array(
        $record['primary_color'] ?? null,
        $record['logo_materials'] ?? null
    );

    while ($stack) {
        $item = array_pop($stack);
        if (!is_array($item)) {
            continue;
        }
        foreach ($item as $key => $value) {
            if ($key === 'color' && is_string($value)) {
                $colors[] = $value;
            } elseif (is_array($value)) {
                $stack[] = $value;
            }
        }
    }

    return array_values(array_unique($colors));
}

function biab_logo_color_is_pink_or_purple($color) {
    $color = trim((string)$color);
    if (!preg_match('/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i', $color, $matches)) {
        return false;
    }

    $hex = $matches[1];
    if (strlen($hex) === 3) {
        $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
    }

    $r = hexdec(substr($hex, 0, 2)) / 255;
    $g = hexdec(substr($hex, 2, 2)) / 255;
    $b = hexdec(substr($hex, 4, 2)) / 255;
    $max = max($r, $g, $b);
    $min = min($r, $g, $b);
    $delta = $max - $min;

    if ($delta <= 0.001) {
        return false;
    }

    if ($max === $r) {
        $hue = 60 * fmod((($g - $b) / $delta), 6);
    } elseif ($max === $g) {
        $hue = 60 * ((($b - $r) / $delta) + 2);
    } else {
        $hue = 60 * ((($r - $g) / $delta) + 4);
    }
    if ($hue < 0) {
        $hue += 360;
    }

    $lightness = ($max + $min) / 2;
    $saturation = $delta / (1 - abs(2 * $lightness - 1));

    return $saturation > 0.35 && (
        ($hue >= 255 && $hue <= 350) ||
        ($hue >= 335 && $lightness > 0.38)
    );
}

function biab_logo_contextual_direction($businessName, $serviceArea) {
    $text = strtolower((string)$businessName . ' ' . (string)$serviceArea);
    $directions = array();

    if (preg_match('/\b(ranch|farm|farms|rural|country|pasture|stable|barn|cattle|horse)\b/', $text)) {
        $directions[] = 'For ranch, farm, rural, or country names, some concepts may tastefully combine a lock/key/security mark with a ranch gate, fence rail, barn silhouette, horizon line, or simple property boundary shape.';
    }
    if (preg_match('/\b(harbo[u]?r|marina|marine|bay|port|dock|coast|coastal|ocean|sea|beach|venice)\b/', $text)) {
        $directions[] = 'For the harbor/coastal name, some concepts may tastefully combine a lock/key/security mark with an anchor, dock, wave, lighthouse, simple boat silhouette, rope knot, or compass.';
    }
    if (preg_match('/\b(mountain|summit|peak|ridge|alpine|rocky)\b/', $text)) {
        $directions[] = 'For mountain-themed names, some concepts may combine a lock/key/security mark with a mountain peak or ridge line.';
    }
    if (preg_match('/\b(river|lake|creek|falls|water)\b/', $text)) {
        $directions[] = 'For water-themed names, some concepts may combine a lock/key/security mark with a river line, lake wave, or simple water shape.';
    }
    if (preg_match('/\b(city|metro|urban|downtown|street)\b/', $text)) {
        $directions[] = 'For city-themed names, some concepts may combine a lock/key/security mark with a skyline, building, street, or door shape.';
    }
    if (preg_match('/\b(desert|valley|canyon|mesa)\b/', $text)) {
        $directions[] = 'For regional desert or valley names, some concepts may combine a lock/key/security mark with a restrained landscape line.';
    }

    if (!$directions) {
        return 'Use the business name and service area for tasteful local relevance, but keep every option clearly locksmith/security related.';
    }

    return implode(' ', $directions) . ' These contextual symbols must stay secondary and must be integrated with locksmith/security imagery.';
}

function biab_logo_contextual_symbol_keywords($businessName, $serviceArea) {
    $text = strtolower((string)$businessName . ' ' . (string)$serviceArea);
    if (preg_match('/\b(ranch|farm|farms|rural|country|pasture|stable|barn|cattle|horse)\b/', $text)) {
        return array('ranch gate', 'fence', 'barn', 'property security');
    }
    if (preg_match('/\b(harbo[u]?r|marina|marine|bay|port|dock|coast|coastal|ocean|sea|beach|venice)\b/', $text)) {
        return array('anchor', 'wave', 'dock', 'compass');
    }
    if (preg_match('/\b(mountain|summit|peak|ridge|alpine|rocky)\b/', $text)) {
        return array('mountain', 'ridge', 'peak', 'security');
    }
    if (preg_match('/\b(river|lake|creek|falls|water)\b/', $text)) {
        return array('river', 'wave', 'water', 'security');
    }
    if (preg_match('/\b(city|metro|urban|downtown|street)\b/', $text)) {
        return array('city', 'building', 'street', 'security');
    }
    if (preg_match('/\b(desert|valley|canyon|mesa)\b/', $text)) {
        return array('valley', 'canyon', 'horizon', 'security');
    }
    return array('local service', 'security', 'trust');
}

function biab_logo_zoviz_concepts($businessName, $serviceArea, $services) {
    $contextKeywords = biab_logo_contextual_symbol_keywords($businessName, $serviceArea);
    return array(
        array(
            'label' => 'Shield Security',
            'keywords' => array('shield', 'keyhole', 'security badge'),
            'description' => 'Concept 1 of 6: use a shield, keyhole, or security badge. Do not use a house, ranch gate, van, safe, or generic repeated building icon.'
        ),
        array(
            'label' => 'Entry Door',
            'keywords' => array('door', 'key', 'entry lock'),
            'description' => 'Concept 2 of 6: use a door, doorway, entry lock, or key-turn shape. Do not use a shield, vehicle, ranch gate, safe, or generic house mark.'
        ),
        array(
            'label' => 'Mobile Service',
            'keywords' => array('service van', 'road', 'key'),
            'description' => 'Concept 3 of 6: use a service van, road line, map pin, or mobile locksmith cue integrated with a key or lock. Do not use a house or shield.'
        ),
        array(
            'label' => 'Safe and Commercial',
            'keywords' => array('safe', 'vault', 'commercial lock'),
            'description' => 'Concept 4 of 6: use a safe, vault dial, commercial door hardware, or heavy-duty lock. Do not use a house, ranch gate, vehicle, or shield.'
        ),
        array(
            'label' => 'Local Name Cue',
            'keywords' => $contextKeywords,
            'description' => 'Concept 5 of 6: use a tasteful local cue from the business name or service area, integrated with a locksmith/security symbol. Avoid repeating the same house/lock icon used in other concepts.'
        ),
        array(
            'label' => 'Modern Key Mark',
            'keywords' => array('abstract key', 'monogram', 'geometric keyhole'),
            'description' => 'Concept 6 of 6: use a minimal geometric key, keyhole, initials, or abstract security mark. Do not use a house, shield, vehicle, safe, or local scenery.'
        )
    );
}

function biab_logo_zoviz_register_payload($businessName, $description, $keywords) {
    return array(
        'brand_name' => array($businessName),
        'filters' => array(
            'industries' => array('Locksmith', 'Security Services'),
            'symbol_keywords' => array_values(array_unique(array_filter(array_map('strval', $keywords)))),
            'color_spectrum' => array('black', 'charcoal', 'navy', 'steel blue', 'forest green', 'gold', 'white', 'silver'),
            'description' => biab_logo_slice($description, 900)
        )
    );
}

function biab_logo_generate_zoviz($payload) {
    $apiKey = biab_logo_zoviz_key();
    if ($apiKey === '') {
        biab_logo_json_response(503, array(
            'error' => 'Logo generation is not configured yet.'
        ));
    }

    $businessName = trim((string)($payload['businessName'] ?? ''));
    if ($businessName === '') {
        $businessName = 'Locksmith Business';
    }
    $serviceArea = trim((string)($payload['serviceArea'] ?? ''));
    $services = trim((string)($payload['services'] ?? ''));
    $descriptionParts = array_filter(array(
        'Strict: locksmith/security-first logo only. No glasses, eyewear, eyes, lashes, hearts, flowers, beauty, fashion, boutique styling, pink, purple, magenta, pastel, script, cursive, or handwritten fonts',
        'Use strong professional trade-service styling, bold sans serif, slab, or restrained serif type, clean vector marks, and sober colors such as black, charcoal, navy, steel blue, forest green, gold, white, or silver',
        'Every option must use a different main symbol family. Do not return six versions of the same house, lock, or key icon with different colors',
        'Allowed core symbols: keys, locks, keyholes, shields, doors, houses, buildings, vans, safes, ranch/local cues, or geometric security marks',
        biab_logo_contextual_direction($businessName, $serviceArea),
        $serviceArea !== '' ? 'Service area: ' . $serviceArea : '',
        $services !== '' ? 'Services: ' . $services : '',
        trim((string)($payload['description'] ?? ''))
    ));
    $baseDescription = implode('. ', $descriptionParts);
    $concepts = biab_logo_zoviz_concepts($businessName, $serviceArea, $services);
    $options = array();
    $seen = array();

    foreach ($concepts as $conceptIndex => $concept) {
        if (count($options) >= 6) {
            break;
        }
        $conceptDescription = $baseDescription . '. ' . (string)$concept['description'];
        $registered = biab_logo_zoviz_request('/album/brand/register', biab_logo_zoviz_register_payload(
            $businessName,
            $conceptDescription,
            $concept['keywords'] ?? array()
        ));
        $albumId = (string)($registered['result']['id'] ?? '');
        if ($albumId === '') {
            continue;
        }

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
            $option['concept'] = (string)($concept['label'] ?? ('Concept ' . ($conceptIndex + 1)));
            $option['generationVersion'] = biab_logo_generation_version();
            $seen[$option['id']] = true;
            $options[] = $option;
            break;
        }
    }

    if (count($options) < 6) {
        $registered = biab_logo_zoviz_request('/album/brand/register', biab_logo_zoviz_register_payload(
            $businessName,
            $baseDescription . '. Generate backup concepts only if needed, and avoid reusing icon families already selected.',
            array('key', 'lock', 'shield', 'door', 'van', 'safe', 'security')
        ));
        $albumId = (string)($registered['result']['id'] ?? '');
        for ($attempt = 0; $albumId !== '' && $attempt < 4 && count($options) < 6; $attempt++) {
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
                $option['concept'] = 'Backup Distinct';
                $option['generationVersion'] = biab_logo_generation_version();
                $seen[$option['id']] = true;
                $options[] = $option;
                if (count($options) === 6) {
                    break;
                }
            }
        }
    }

    if (count($options) !== 6) {
        biab_logo_json_response(502, array('error' => 'The logo generator did not return exactly 6 usable logo options.'));
    }

    return array(
        'options' => $options,
        'provider' => biab_logo_provider_status('zoviz', 'Generated 6 logo previews.')
    );
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $uid = biab_logo_uid($_GET['nalaUID'] ?? '');
    $savedLogo = biab_logo_get($uid);
    $generated = biab_logo_get_options($uid);
    if ($generated && biab_logo_options_are_stale($generated) && !$savedLogo) {
        biab_logo_delete_options($uid);
        $generated = null;
    }
    biab_logo_json_response(200, array(
        'ok' => true,
        'logo' => $savedLogo,
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

$replaceExisting = !empty($data['replaceExisting']) || !empty($data['force']) || !empty($data['regenerate']);
$existing = $replaceExisting ? null : biab_logo_get_options($uid);
if ($existing && biab_logo_options_are_stale($existing)) {
    biab_logo_delete_options($uid);
    $existing = null;
}
if ($existing) {
    biab_logo_json_response(200, array(
        'ok' => true,
        'options' => $existing['options'],
        'provider' => $existing['provider']
    ));
}

if ($replaceExisting) {
    biab_logo_delete_logo($uid);
    biab_logo_delete_options($uid);
}

$generated = biab_logo_generate_zoviz($data);
$stored = biab_logo_save_options($uid, $generated['options'], $generated['provider']);
biab_logo_json_response(200, array(
    'ok' => true,
    'options' => $stored['options'],
    'provider' => $stored['provider']
));
?>
