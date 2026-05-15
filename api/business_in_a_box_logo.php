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
    return 9;
}

function biab_logo_options_are_stale($generated) {
    if (!is_array($generated)) {
        return false;
    }
    $provider = is_array($generated['provider'] ?? null) ? $generated['provider'] : array();
    $version = (int)($provider['generatorVersion'] ?? 0);
    if ($version < biab_logo_generation_version()) {
        return true;
    }
    $options = is_array($generated['options'] ?? null) ? $generated['options'] : array();
    foreach ($options as $option) {
        if (!is_array($option) || ($option['provider'] ?? '') !== 'nala') {
            return true;
        }
        if ((int)($option['generationVersion'] ?? 0) < biab_logo_generation_version()) {
            return true;
        }
    }
    return false;
}

function biab_logo_saved_logo_is_stale($logo) {
    if (!is_array($logo) || !$logo) {
        return false;
    }
    if (($logo['provider'] ?? '') !== 'nala') {
        return true;
    }
    return (int)($logo['generationVersion'] ?? 0) < biab_logo_generation_version();
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

function biab_logo_zoviz_best_file($record, $preferredLayout = 'horizontal') {
    $files = is_array($record['logo_files'] ?? null) ? $record['logo_files'] : array();
    $fallback = null;
    foreach ($files as $file) {
        if (!is_array($file)) {
            continue;
        }
        if ($fallback === null) {
            $fallback = $file;
        }
        $concepts = is_array($file['layout_concept'] ?? null) ? $file['layout_concept'] : array();
        $name = (string)($file['name'] ?? '');
        $matchesPreferred = $preferredLayout !== '' && (in_array($preferredLayout, $concepts, true) || stripos($name, $preferredLayout) !== false);
        if ($matchesPreferred && empty($file['with_slogan'])) {
            return $file;
        }
    }
    foreach ($files as $file) {
        if (!is_array($file)) {
            continue;
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

function biab_logo_zoviz_normalize_record($record, $index, $preferredLayout = 'horizontal') {
    if (!is_array($record)) {
        return null;
    }
    if (!biab_logo_zoviz_record_allowed($record)) {
        return null;
    }
    $file = biab_logo_zoviz_best_file($record, $preferredLayout);
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

function biab_logo_preview_signature($url) {
    $url = trim((string)$url);
    if ($url === '' || !function_exists('imagecreatefromstring') || !function_exists('imagecreatetruecolor')) {
        return '';
    }

    $curl = curl_init($url);
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_HTTPHEADER => array('Accept: image/*', 'User-Agent: NALA-BIAB/1.0')
    ));
    $body = curl_exec($curl);
    $status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    if (!is_string($body) || $body === '' || $status < 200 || $status >= 300) {
        return '';
    }

    $image = @imagecreatefromstring($body);
    if (!$image) {
        return '';
    }
    $width = imagesx($image);
    $height = imagesy($image);
    if ($width < 8 || $height < 8) {
        imagedestroy($image);
        return '';
    }

    $cropWidth = max(8, (int)round($width * 0.24));
    $crop = imagecreatetruecolor(8, 8);
    imagecopyresampled($crop, $image, 0, 0, 0, 0, 8, 8, $cropWidth, $height);

    $values = array();
    $sum = 0;
    for ($y = 0; $y < 8; $y++) {
        for ($x = 0; $x < 8; $x++) {
            $rgb = imagecolorat($crop, $x, $y);
            $r = ($rgb >> 16) & 255;
            $g = ($rgb >> 8) & 255;
            $b = $rgb & 255;
            $gray = (int)round(($r * 0.299) + ($g * 0.587) + ($b * 0.114));
            $values[] = $gray;
            $sum += $gray;
        }
    }
    imagedestroy($crop);
    imagedestroy($image);

    $bits = '';
    foreach ($values as $value) {
        $bits .= $value < 245 ? '1' : '0';
    }
    return $bits;
}

function biab_logo_signature_distance($a, $b) {
    $a = (string)$a;
    $b = (string)$b;
    if (strlen($a) !== strlen($b) || $a === '' || $b === '') {
        return 64;
    }
    $distance = 0;
    $length = strlen($a);
    for ($index = 0; $index < $length; $index++) {
        if ($a[$index] !== $b[$index]) {
            $distance++;
        }
    }
    return $distance;
}

function biab_logo_option_too_similar($option, $signatures) {
    $signature = biab_logo_preview_signature($option['previewUrl'] ?? ($option['image'] ?? ''));
    if ($signature === '') {
        return array(false, '');
    }
    foreach ($signatures as $existing) {
        if (biab_logo_signature_distance($signature, $existing) < 18) {
            return array(true, $signature);
        }
    }
    return array(false, $signature);
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
            'label' => 'Industrial Badge',
            'keywords' => array('shield', 'keyhole', 'security badge'),
            'layout' => 'horizontal',
            'description' => 'Concept 1 of 6: industrial badge logo. Use a shield, keyhole, or security badge. Typography must be bold condensed sans serif or square trade lettering, not script or thin serif. Do not use a house, ranch gate, van, safe, generic repeated building icon, letter K, initials, or monogram.'
        ),
        array(
            'label' => 'Classic Wordmark',
            'keywords' => array('wordmark', 'key separator', 'locksmith lettering'),
            'layout' => 'text',
            'description' => 'Concept 2 of 6: mostly typography, a professional locksmith wordmark with no large left icon. Use a classic slab serif, strong serif, or engraved workwear lettering. At most use a small keyhole or key separator inside the text. Do not use script, handwriting, a house, shield, van, safe, letter K, initials, or monogram.'
        ),
        array(
            'label' => 'Mobile Service',
            'keywords' => array('service van', 'road', 'key'),
            'layout' => 'horizontal',
            'description' => 'Concept 3 of 6: mobile service logo. Use a service van, road line, map pin, or mobile locksmith cue integrated with a key or lock. Typography must be clean geometric sans serif or technical sans. Do not use a house, shield, script font, thin serif, letter K, initials, or monogram.'
        ),
        array(
            'label' => 'Safe and Commercial',
            'keywords' => array('safe', 'vault', 'commercial lock'),
            'layout' => 'sign',
            'description' => 'Concept 4 of 6: commercial/security sign logo. Use a safe, vault dial, commercial door hardware, or heavy-duty lock. Typography must be slab serif, stencil, or rugged sign lettering. Do not use a house, ranch gate, vehicle, shield, script font, letter K, initials, or monogram.'
        ),
        array(
            'label' => 'Local Name Cue',
            'keywords' => $contextKeywords,
            'layout' => 'horizontal',
            'description' => 'Concept 5 of 6: local cue logo. Use a tasteful local cue from the business name or service area, integrated with a locksmith/security symbol. For harbor names, prefer anchor, wave, dock, rope, compass, lighthouse, or boat cue. Typography must be sturdy sans serif or nautical/workwear serif. Avoid repeating the same house, padlock, keyhole, or script style used in other concepts.'
        ),
        array(
            'label' => 'Modern Minimal',
            'keywords' => array('abstract key', 'geometric keyhole', 'minimal security mark'),
            'layout' => 'text',
            'description' => 'Concept 6 of 6: modern minimal logo. Use a small abstract key, geometric keyhole, or clean security mark with a contemporary geometric sans wordmark. Do not use script, handwriting, house, shield, vehicle, safe, local scenery, or a large repeated padlock icon.'
        )
    );
}

function biab_logo_zoviz_register_payload($businessName, $description, $keywords, $seed = '') {
    $keywordText = implode(', ', array_values(array_unique(array_filter(array_map('strval', $keywords)))));
    $fullDescription = $description . ($keywordText !== '' ? '. Preferred symbol direction: ' . $keywordText : '');
    if ($seed !== '') {
        $fullDescription .= '. Creative variation seed: ' . preg_replace('/[^a-zA-Z0-9 _-]/', '', (string)$seed);
    }
    return array(
        'brand_name' => array($businessName),
        'filters' => array(
            'industries' => array(),
            'symbol_keywords' => array(),
            'color_spectrum' => array(),
            'description' => biab_logo_slice($fullDescription, 900)
        )
    );
}

function biab_logo_svg_escape($value) {
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

function biab_logo_curated_symbol($type, $color, $accent) {
    $color = biab_logo_svg_escape($color);
    $accent = biab_logo_svg_escape($accent);
    if ($type === 'none') {
        return '';
    }
    if ($type === 'badge-round') {
        return '<circle cx="82" cy="88" r="58" fill="' . $color . '"/><circle cx="82" cy="88" r="38" fill="none" stroke="' . $accent . '" stroke-width="9"/><path d="M62 94h40" stroke="#fff" stroke-width="12" stroke-linecap="round"/><circle cx="62" cy="94" r="17" fill="none" stroke="#fff" stroke-width="9"/><path d="M98 94v22h17V94h16" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    if ($type === 'wave') {
        return '<path d="M18 103c22-30 43-44 65-42 20 2 34 15 45 38-21-9-40-8-56 2-15 10-30 17-54 2z" fill="' . $color . '"/><path d="M28 126c29 13 55 12 78-2 18-11 33-14 52-5" fill="none" stroke="' . $accent . '" stroke-width="9" stroke-linecap="round"/><path d="M76 43v34" stroke="' . $accent . '" stroke-width="9" stroke-linecap="round"/><circle cx="76" cy="33" r="11" fill="' . $color . '"/>';
    }
    if ($type === 'boat') {
        return '<path d="M30 106h112l-18 34H48z" fill="' . $color . '"/><path d="M77 39v62" stroke="' . $accent . '" stroke-width="8" stroke-linecap="round"/><path d="M85 50l44 45H85z" fill="' . $accent . '"/><path d="M71 61L42 96h29z" fill="' . $color . '" opacity=".85"/><path d="M25 150c22-10 42-10 61 0 20 10 39 9 60-1" fill="none" stroke="' . $accent . '" stroke-width="7" stroke-linecap="round"/>';
    }
    if ($type === 'building') {
        return '<rect x="38" y="48" width="86" height="96" rx="8" fill="' . $color . '"/><path d="M56 72h14M92 72h14M56 96h14M92 96h14" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M72 144v-25h20v25" fill="' . $accent . '"/><path d="M31 150h105" stroke="' . $accent . '" stroke-width="8" stroke-linecap="round"/>';
    }
    if ($type === 'gate') {
        return '<path d="M32 144V65h100v79" fill="none" stroke="' . $color . '" stroke-width="10" stroke-linecap="round"/><path d="M32 83h100M52 83v61M82 83v61M112 83v61" stroke="' . $accent . '" stroke-width="8" stroke-linecap="round"/><path d="M55 65c8-20 45-20 54 0" fill="none" stroke="' . $color . '" stroke-width="10" stroke-linecap="round"/>';
    }
    if ($type === 'anchor') {
        return '<g fill="none" stroke="' . $color . '" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path d="M78 38v86"/><path d="M50 68h56"/><circle cx="78" cy="25" r="13"/><path d="M38 105c9 26 31 39 40 39s31-13 40-39"/><path d="M38 105l-17 5"/><path d="M118 105l17 5"/></g><path d="M58 91h40v42H58z" fill="' . $accent . '" opacity=".95"/><circle cx="78" cy="112" r="9" fill="#fff"/>';
    }
    if ($type === 'lighthouse') {
        return '<path d="M52 145h72L108 54H68z" fill="' . $color . '"/><path d="M62 48h52l-9-22H71z" fill="' . $accent . '"/><path d="M72 74h32M69 99h38M65 124h46" stroke="#fff" stroke-width="6"/><path d="M28 149c24-12 47-12 70 0 20 9 38 8 54-2" fill="none" stroke="' . $accent . '" stroke-width="7" stroke-linecap="round"/>';
    }
    if ($type === 'van') {
        return '<path d="M27 88h84l24 25v31H27z" fill="' . $color . '"/><path d="M86 96h22l17 18H86z" fill="#fff" opacity=".9"/><circle cx="55" cy="145" r="12" fill="' . $accent . '"/><circle cx="118" cy="145" r="12" fill="' . $accent . '"/><path d="M44 74h44" stroke="' . $accent . '" stroke-width="8" stroke-linecap="round"/><path d="M50 74c0-18 14-31 32-31s32 13 32 31" fill="none" stroke="' . $accent . '" stroke-width="8" stroke-linecap="round"/>';
    }
    if ($type === 'road-key') {
        return '<path d="M26 139c24-46 45-77 63-92 18 15 36 46 55 92" fill="none" stroke="' . $color . '" stroke-width="13" stroke-linecap="round"/><path d="M85 61h34" stroke="' . $accent . '" stroke-width="11" stroke-linecap="round"/><circle cx="72" cy="61" r="19" fill="none" stroke="' . $accent . '" stroke-width="10"/><path d="M104 61v24h17V61" stroke="' . $accent . '" stroke-width="9" stroke-linecap="round"/>';
    }
    if ($type === 'safe') {
        return '<rect x="31" y="42" width="104" height="104" rx="14" fill="' . $color . '"/><rect x="48" y="58" width="70" height="72" rx="8" fill="#fff" opacity=".12"/><circle cx="83" cy="94" r="24" fill="none" stroke="' . $accent . '" stroke-width="8"/><path d="M83 70v19l15 10" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="119" cy="94" r="7" fill="#fff"/>';
    }
    if ($type === 'shield') {
        return '<path d="M82 24l57 22v39c0 37-23 63-57 78-34-15-57-41-57-78V46z" fill="' . $color . '"/><path d="M58 88h48v45H58z" fill="#fff"/><path d="M67 88V72c0-17 12-29 29-29s29 12 29 29v16" fill="none" stroke="' . $accent . '" stroke-width="9" stroke-linecap="round"/><circle cx="82" cy="109" r="8" fill="' . $color . '"/>';
    }
    if ($type === 'door') {
        return '<path d="M45 35h74v120H45z" fill="' . $color . '"/><path d="M64 52h36v103H64z" fill="#fff" opacity=".18"/><circle cx="95" cy="103" r="7" fill="' . $accent . '"/><path d="M26 155h118" stroke="' . $accent . '" stroke-width="8" stroke-linecap="round"/><path d="M119 54l24 14v87h-24z" fill="' . $accent . '"/>';
    }
    return '<path d="M38 95h74" stroke="' . $color . '" stroke-width="18" stroke-linecap="round"/><circle cx="51" cy="95" r="26" fill="none" stroke="' . $accent . '" stroke-width="13"/><path d="M104 95v25h18V95h18v-18h-36z" fill="' . $color . '"/>';
}

function biab_logo_curated_context_symbol($businessName, $serviceArea) {
    $text = strtolower((string)$businessName . ' ' . (string)$serviceArea);
    if (preg_match('/\b(harbo[u]?r|marina|marine|bay|port|dock|coast|coastal|ocean|sea|beach|venice)\b/', $text)) {
        return array('anchor', 'lighthouse', 'wave', 'boat');
    }
    if (preg_match('/\b(ranch|farm|farms|rural|country|pasture|stable|barn|cattle|horse)\b/', $text)) {
        return array('gate', 'door', 'building');
    }
    return array('shield', 'door', 'building');
}

function biab_logo_pick($items, $seed, $salt) {
    if (!is_array($items) || !count($items)) {
        return null;
    }
    $hash = hash('sha256', (string)$seed . '|' . (string)$salt);
    $index = (int)(hexdec(substr($hash, 0, 8)) % count($items));
    return $items[$index];
}

function biab_logo_curated_svg($businessName, $concept, $symbol, $primary, $accent, $font, $weight = '800', $case = 'title', $treatment = 'underline') {
    $name = trim((string)$businessName) !== '' ? trim((string)$businessName) : 'Locksmith Business';
    $display = $case === 'upper' ? strtoupper($name) : $name;
    $safeName = biab_logo_svg_escape($display);
    $safeFont = biab_logo_svg_escape($font);
    $primarySafe = biab_logo_svg_escape($primary);
    $accentSafe = biab_logo_svg_escape($accent);
    $symbolSvg = biab_logo_curated_symbol($symbol, $primary, $accent);
    $nameFit = strlen($display) > 15 ? ' textLength="458" lengthAdjust="spacingAndGlyphs"' : '';
    $symbolMarkup = $symbolSvg !== '' ? '<g transform="translate(34 16) scale(.92)">' . $symbolSvg . '</g>' : '';
    $textX = $symbolSvg !== '' ? 178 : 72;
    $labelX = $symbolSvg !== '' ? 180 : 74;
    $nameFit = strlen($display) > 15 ? ' textLength="' . ($symbolSvg !== '' ? '458' : '560') . '" lengthAdjust="spacingAndGlyphs"' : '';
    $treatmentMarkup = '';
    if ($treatment === 'box') {
        $treatmentMarkup = '<rect x="' . $labelX . '" y="119" width="212" height="26" rx="13" fill="' . $accentSafe . '" opacity=".14"/>';
    } elseif ($treatment === 'top-rule') {
        $treatmentMarkup = '<rect x="' . $labelX . '" y="54" width="220" height="6" rx="3" fill="' . $accentSafe . '"/>';
    } elseif ($treatment === 'underline') {
        $treatmentMarkup = '<rect x="' . $labelX . '" y="124" width="190" height="7" rx="3.5" fill="' . $accentSafe . '"/>';
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 180" role="img" aria-label="' . biab_logo_svg_escape($name . ' logo') . '">'
        . '<rect width="700" height="180" rx="18" fill="#f8fafc"/>'
        . $symbolMarkup
        . $treatmentMarkup
        . '<text x="' . $textX . '" y="106"' . $nameFit . ' fill="' . $primarySafe . '" font-family="' . $safeFont . '" font-size="48" font-weight="' . biab_logo_svg_escape($weight) . '" letter-spacing="0">' . $safeName . '</text>'
        . '<text x="' . $labelX . '" y="150" fill="' . $accentSafe . '" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="2">' . biab_logo_svg_escape(strtoupper($concept)) . '</text>'
        . '</svg>';
}

function biab_logo_generate_curated($payload) {
    $businessName = trim((string)($payload['businessName'] ?? ''));
    if ($businessName === '') {
        $businessName = 'Locksmith Business';
    }
    $serviceArea = trim((string)($payload['serviceArea'] ?? ''));
    $uidSeed = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($payload['nalaUID'] ?? ''));
    $forceSeed = (!empty($payload['force']) || !empty($payload['replaceExisting']) || !empty($payload['regenerate'])) ? (string)microtime(true) : '';
    $seed = hash('sha256', $businessName . '|' . $serviceArea . '|' . $uidSeed . '|' . $forceSeed);
    $contextSymbols = biab_logo_curated_context_symbol($businessName, $serviceArea);
    $palettes = array(
        array('#151a1f', '#a98212'),
        array('#0f4c5c', '#c6952d'),
        array('#1f2937', '#0ea5e9'),
        array('#263238', '#991b1b'),
        array('#0f766e', '#a98212'),
        array('#3f3422', '#b89662'),
        array('#111827', '#64748b')
    );
    $definitions = array(
        array(
            'concept' => 'Industrial Badge',
            'symbols' => array('badge-round', 'shield', 'building'),
            'fonts' => array('Arial Black, Arial, Helvetica, sans-serif', 'Verdana, Arial, sans-serif', 'Tahoma, Geneva, sans-serif'),
            'cases' => array('title', 'upper'),
            'treatments' => array('underline', 'box')
        ),
        array(
            'concept' => 'Classic Wordmark',
            'symbols' => array('none', 'key'),
            'fonts' => array('Georgia, Times New Roman, serif', 'Palatino Linotype, Georgia, serif', 'Cambria, Georgia, serif'),
            'cases' => array('title'),
            'treatments' => array('none', 'top-rule')
        ),
        array(
            'concept' => 'Mobile Service',
            'symbols' => array('van', 'road-key'),
            'fonts' => array('Trebuchet MS, Arial, sans-serif', 'Century Gothic, Arial, Helvetica, sans-serif', 'Gill Sans, Trebuchet MS, sans-serif'),
            'cases' => array('title', 'upper'),
            'treatments' => array('underline', 'top-rule')
        ),
        array(
            'concept' => 'Safe and Commercial',
            'symbols' => array('safe', 'door', 'building'),
            'fonts' => array('Verdana, Arial, sans-serif', 'Arial Black, Arial, Helvetica, sans-serif', 'Georgia, Times New Roman, serif'),
            'cases' => array('title', 'upper'),
            'treatments' => array('underline', 'box')
        ),
        array(
            'concept' => 'Local Name Cue',
            'symbols' => $contextSymbols,
            'fonts' => array('Gill Sans, Trebuchet MS, Arial, sans-serif', 'Trebuchet MS, Arial, sans-serif', 'Georgia, Times New Roman, serif'),
            'cases' => array('title'),
            'treatments' => array('underline', 'box', 'top-rule')
        ),
        array(
            'concept' => 'Modern Minimal',
            'symbols' => array('door', 'wave', 'key', 'none'),
            'fonts' => array('Century Gothic, Arial, Helvetica, sans-serif', 'Arial, Helvetica, sans-serif', 'Trebuchet MS, Arial, sans-serif'),
            'cases' => array('upper', 'title'),
            'treatments' => array('none', 'top-rule')
        )
    );

    $logos = array();
    $usedSymbols = array();
    foreach ($definitions as $index => $definition) {
        $symbol = biab_logo_pick($definition['symbols'], $seed, 'symbol-' . $index);
        if (isset($usedSymbols[$symbol]) && count($definition['symbols']) > 1) {
            foreach ($definition['symbols'] as $candidate) {
                if (!isset($usedSymbols[$candidate])) {
                    $symbol = $candidate;
                    break;
                }
            }
        }
        $usedSymbols[$symbol] = true;
        $palette = biab_logo_pick($palettes, $seed, 'palette-' . $index);
        $font = biab_logo_pick($definition['fonts'], $seed, 'font-' . $index);
        $case = biab_logo_pick($definition['cases'], $seed, 'case-' . $index) ?: 'title';
        $treatment = biab_logo_pick($definition['treatments'], $seed, 'treatment-' . $index) ?: 'underline';
        $weight = strpos($font, 'Georgia') !== false || strpos($font, 'Palatino') !== false || strpos($font, 'Cambria') !== false ? '700' : '800';
        if (strpos($font, 'Arial Black') !== false) {
            $weight = '900';
        }
        $svg = biab_logo_curated_svg($businessName, $definition['concept'], $symbol, $palette[0], $palette[1], $font, $weight, $case, $treatment);
        $logos[] = biab_logo_normalize_logo(array(
            'id' => 'curated-logo-' . substr(sha1($businessName . '|' . $serviceArea . '|' . $definition['concept'] . '|' . $seed), 0, 12) . '-' . ($index + 1),
            'providerLogoId' => 'curated-' . ($index + 1),
            'name' => $businessName . ' #' . ($index + 1),
            'svg' => $svg,
            'previewUrl' => '',
            'image' => '',
            'colors' => array($palette[0], $palette[1], '#f8fafc'),
            'provider' => 'nala',
            'previewOnly' => false,
            'concept' => $definition['concept'],
            'generationVersion' => biab_logo_generation_version()
        ));
    }

    return array(
        'options' => $logos,
        'provider' => biab_logo_provider_status('zoviz', 'Generated 6 logo previews.')
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
    $uidSeed = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($payload['nalaUID'] ?? ''));
    $creativeSeed = substr(hash('sha256', $businessName . '|' . $serviceArea . '|' . $uidSeed . '|' . gmdate('Ymd')), 0, 10);
    $descriptionParts = array_filter(array(
        'Strict: locksmith/security-first logo only. No glasses, eyewear, eyes, lashes, hearts, flowers, beauty, fashion, boutique styling, pink, purple, magenta, pastel, script, cursive, handwritten fonts, playful fonts, or delicate boutique typography',
        'Use strong professional trade-service styling, bold sans serif, slab, or restrained serif type, clean vector marks, and sober colors such as black, charcoal, navy, steel blue, forest green, gold, white, or silver',
        'Every option must use a different main symbol family and a different typography family. Do not return six versions of the same house, lock, keyhole, padlock, font, or wordmark with different colors',
        'Avoid lettermark-only logos and do not use a letter K, initials, or monogram unless the concept specifically asks for a modern abstract key mark',
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
    $visualSignatures = array();
    $similarBackups = array();

    foreach ($concepts as $conceptIndex => $concept) {
        if (count($options) >= 6) {
            break;
        }
        $conceptDescription = $baseDescription . '. ' . (string)$concept['description'];
        $registered = biab_logo_zoviz_request('/album/brand/register', biab_logo_zoviz_register_payload(
            $businessName,
            $conceptDescription,
            $concept['keywords'] ?? array(),
            $creativeSeed . '-' . ($conceptIndex + 1)
        ));
        $albumId = (string)($registered['result']['id'] ?? '');
        if ($albumId === '') {
            continue;
        }

        $pickedConcept = false;
        for ($attempt = 0; $attempt < 3 && !$pickedConcept; $attempt++) {
            $generated = biab_logo_zoviz_request('/album/brand/generate', array('id' => $albumId));
            $records = $generated['result']['records'] ?? array();
            if (!is_array($records)) {
                continue;
            }
            foreach ($records as $record) {
                $option = biab_logo_zoviz_normalize_record($record, count($options), (string)($concept['layout'] ?? 'horizontal'));
                if (!$option || isset($seen[$option['id']])) {
                    continue;
                }
                list($tooSimilar, $signature) = biab_logo_option_too_similar($option, $visualSignatures);
                if ($tooSimilar) {
                    $option['concept'] = (string)($concept['label'] ?? ('Concept ' . ($conceptIndex + 1)));
                    $option['generationVersion'] = biab_logo_generation_version();
                    $similarBackups[] = $option;
                    continue;
                }
                $option['concept'] = (string)($concept['label'] ?? ('Concept ' . ($conceptIndex + 1)));
                $option['generationVersion'] = biab_logo_generation_version();
                $seen[$option['id']] = true;
                if ($signature !== '') {
                    $visualSignatures[] = $signature;
                }
                $options[] = $option;
                $pickedConcept = true;
                break;
            }
        }
    }

    if (count($options) < 6) {
        $registered = biab_logo_zoviz_request('/album/brand/register', biab_logo_zoviz_register_payload(
            $businessName,
            $baseDescription . '. Generate backup concepts only if needed, and avoid reusing icon families already selected.',
            array('key', 'lock', 'shield', 'door', 'van', 'safe', 'security'),
            $creativeSeed . '-backup'
        ));
        $albumId = (string)($registered['result']['id'] ?? '');
        for ($attempt = 0; $albumId !== '' && $attempt < 4 && count($options) < 6; $attempt++) {
            $generated = biab_logo_zoviz_request('/album/brand/generate', array('id' => $albumId));
            $records = $generated['result']['records'] ?? array();
            if (!is_array($records)) {
                continue;
            }
            foreach ($records as $record) {
                $option = biab_logo_zoviz_normalize_record($record, count($options), 'sign');
                if (!$option || isset($seen[$option['id']])) {
                    continue;
                }
                list($tooSimilar, $signature) = biab_logo_option_too_similar($option, $visualSignatures);
                if ($tooSimilar) {
                    $option['concept'] = 'Backup Distinct';
                    $option['generationVersion'] = biab_logo_generation_version();
                    $similarBackups[] = $option;
                    continue;
                }
                $option['concept'] = 'Backup Distinct';
                $option['generationVersion'] = biab_logo_generation_version();
                $seen[$option['id']] = true;
                if ($signature !== '') {
                    $visualSignatures[] = $signature;
                }
                $options[] = $option;
                if (count($options) === 6) {
                    break;
                }
            }
        }
    }

    foreach ($similarBackups as $option) {
        if (count($options) >= 6) {
            break;
        }
        if (!$option || isset($seen[$option['id']])) {
            continue;
        }
        $seen[$option['id']] = true;
        $options[] = $option;
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
    if (biab_logo_saved_logo_is_stale($savedLogo)) {
        biab_logo_delete_logo($uid);
        $savedLogo = null;
    }
    $generated = biab_logo_get_options($uid);
    if ($generated && biab_logo_options_are_stale($generated)) {
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

$generated = biab_logo_generate_curated($data);
$stored = biab_logo_save_options($uid, $generated['options'], $generated['provider']);
biab_logo_json_response(200, array(
    'ok' => true,
    'options' => $stored['options'],
    'provider' => $stored['provider']
));
?>
