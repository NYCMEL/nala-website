<?php
function biab_logo_json_response($status, $payload) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function biab_logo_read_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : array();
}

function biab_logo_uid($value) {
    $uid = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$value);
    if ($uid === '') {
        biab_logo_json_response(400, array('error' => 'Missing business page ID.'));
    }
    return $uid;
}

function biab_logo_dir() {
    $dir = __DIR__ . '/../websites/logos';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir;
}

function biab_logo_db() {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    if (!class_exists('PDO')) {
        biab_logo_json_response(500, array('error' => 'Database support is not available on this server.'));
    }
    try {
        $pdo = new PDO('sqlite:' . biab_logo_dir() . '/business_in_a_box_logos.sqlite');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec('CREATE TABLE IF NOT EXISTS logos (
            nala_uid TEXT PRIMARY KEY,
            provider_logo_id TEXT,
            payload TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )');
    } catch (Exception $e) {
        biab_logo_json_response(500, array('error' => 'Could not open logo database.'));
    }
    return $pdo;
}

function biab_logo_get($uid) {
    $stmt = biab_logo_db()->prepare('SELECT * FROM logos WHERE nala_uid = :uid LIMIT 1');
    $stmt->execute(array(':uid' => $uid));
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        return null;
    }
    $payload = json_decode($row['payload'] ?? '{}', true);
    if (!is_array($payload)) {
        return null;
    }
    $payload['providerLogoId'] = $payload['providerLogoId'] ?? ($row['provider_logo_id'] ?? '');
    $payload['updatedAt'] = $payload['updatedAt'] ?? ($row['updated_at'] ?? '');
    return $payload;
}

function biab_logo_reset($uid) {
    $stmt = biab_logo_db()->prepare('DELETE FROM logos WHERE nala_uid = :uid');
    $stmt->execute(array(':uid' => $uid));
    return true;
}

function biab_logo_save($uid, $logo) {
    if (!is_array($logo)) {
        biab_logo_json_response(400, array('error' => 'Logo data is required.'));
    }

    $saved = biab_logo_normalize_logo($logo);
    if (!$saved) {
        biab_logo_json_response(400, array('error' => 'Choose a valid logo first.'));
    }

    $now = gmdate('c');
    $saved['updatedAt'] = $now;
    $providerLogoId = preg_replace('/[^a-zA-Z0-9_.:-]/', '', (string)($saved['providerLogoId'] ?? $saved['id'] ?? ''));

    $stmt = biab_logo_db()->prepare('INSERT OR REPLACE INTO logos
        (nala_uid, provider_logo_id, payload, updated_at)
        VALUES
        (:uid, :provider_logo_id, :payload, :updated_at)');
    $stmt->execute(array(
        ':uid' => $uid,
        ':provider_logo_id' => $providerLogoId,
        ':payload' => json_encode($saved, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ':updated_at' => $now
    ));

    return $saved;
}

function biab_logo_normalize_logo($logo) {
    $id = preg_replace('/[^a-zA-Z0-9_.:-]/', '', (string)($logo['id'] ?? $logo['providerLogoId'] ?? ''));
    $name = trim((string)($logo['name'] ?? $logo['label'] ?? 'Logo'));
    $svg = biab_logo_sanitize_svg($logo['svg'] ?? '');
    $previewUrl = biab_logo_clean_url($logo['previewUrl'] ?? '');
    $image = biab_logo_clean_url($logo['image'] ?? '');

    if ($id === '' || ($svg === '' && $previewUrl === '' && $image === '')) {
        return null;
    }

    return array(
        'id' => $id,
        'providerLogoId' => (string)($logo['providerLogoId'] ?? $id),
        'name' => $name !== '' ? biab_logo_slice($name, 120) : 'Logo',
        'svg' => $svg,
        'previewUrl' => $previewUrl,
        'image' => $image,
        'provider' => preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($logo['provider'] ?? 'zoviz')),
        'previewOnly' => !empty($logo['previewOnly']),
        'selectedAt' => (string)($logo['selectedAt'] ?? gmdate('c'))
    );
}

function biab_logo_sanitize_svg($svg) {
    $svg = trim((string)$svg);
    if ($svg === '' || stripos($svg, '<svg') !== 0) {
        return '';
    }
    $svg = preg_replace('/<script\b[^>]*>.*?<\/script>/is', '', $svg);
    $svg = preg_replace('/\son[a-z]+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $svg);
    $svg = preg_replace('/javascript\s*:/i', '', $svg);
    return biab_logo_slice($svg, 120000);
}

function biab_logo_clean_url($url) {
    $url = trim((string)$url);
    if ($url === '') {
        return '';
    }
    if (!preg_match('/^https?:\/\//i', $url)) {
        return '';
    }
    return biab_logo_slice($url, 1000);
}

function biab_logo_escape($value) {
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

function biab_logo_slice($value, $length) {
    $value = (string)$value;
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $length);
    }
    return substr($value, 0, $length);
}

function biab_logo_preview_options($payload) {
    $businessName = trim((string)($payload['businessName'] ?? 'Locksmith'));
    if ($businessName === '') {
        $businessName = 'Locksmith';
    }
    $area = trim((string)($payload['serviceArea'] ?? 'Local service'));
    $safeName = biab_logo_escape($businessName);
    $safeArea = biab_logo_escape($area !== '' ? $area : 'Local service');
    $initials = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $businessName), 0, 2));
    if ($initials === '') {
        $initials = 'L';
    }

    $themes = array(
        array('Trust Mark', '#111827', '#a98212', 'M 130 74 h 58 a 30 30 0 0 1 30 30 v 8 h 13 a 13 13 0 0 1 13 13 v 50 a 13 13 0 0 1 -13 13 h -142 a 13 13 0 0 1 -13 -13 v -50 a 13 13 0 0 1 13 -13 h 13 v -8 a 30 30 0 0 1 30 -30 z M 124 112 h 72 v -8 a 36 36 0 0 0 -72 0 z'),
        array('Keyline', '#0f172a', '#2563eb', 'M 108 142 a 34 34 0 1 1 19 31 l -21 21 h -21 v 21 h -21 v 21 h -34 v -34 l 67 -67 a 34 34 0 0 1 11 7 z M 137 111 a 10 10 0 1 0 0 -20 a 10 10 0 0 0 0 20 z'),
        array('Shield', '#172554', '#16a34a', 'M 160 58 l 84 30 v 58 c 0 56 -35 92 -84 112 c -49 -20 -84 -56 -84 -112 v -58 z M 128 154 l 22 22 l 46 -58'),
        array('Precision', '#18181b', '#dc2626', 'M 160 54 l 26 52 l 58 8 l -42 41 l 10 58 l -52 -27 l -52 27 l 10 -58 l -42 -41 l 58 -8 z'),
        array('Modern Lock', '#052e16', '#f59e0b', 'M 100 126 h 120 a 18 18 0 0 1 18 18 v 70 a 18 18 0 0 1 -18 18 h -120 a 18 18 0 0 1 -18 -18 v -70 a 18 18 0 0 1 18 -18 z M 118 126 v -28 a 42 42 0 0 1 84 0 v 28'),
        array('Street Sign', '#0f172a', '#0891b2', 'M 62 93 h 196 l 34 45 l -34 45 h -196 l -34 -45 z M 78 138 h 164')
    );

    $options = array();
    foreach ($themes as $index => $theme) {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240" role="img" aria-label="' . $safeName . ' logo">'
            . '<rect width="360" height="240" rx="18" fill="#ffffff"/>'
            . '<rect x="16" y="16" width="328" height="208" rx="16" fill="' . $theme[1] . '" opacity=".05"/>'
            . '<path d="' . $theme[3] . '" fill="none" stroke="' . $theme[2] . '" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>'
            . '<text x="176" y="83" fill="' . $theme[1] . '" font-family="Arial, sans-serif" font-size="30" font-weight="800">' . $safeName . '</text>'
            . '<text x="178" y="119" fill="' . $theme[2] . '" font-family="Arial, sans-serif" font-size="19" font-weight="700">' . $safeArea . '</text>'
            . '<text x="177" y="174" fill="' . $theme[1] . '" font-family="Arial, sans-serif" font-size="42" font-weight="900">' . biab_logo_escape($initials) . '</text>'
            . '<text x="178" y="213" fill="' . $theme[1] . '" opacity=".45" font-family="Arial, sans-serif" font-size="12" font-weight="700">ZOVIZ PREVIEW TEST</text>'
            . '</svg>';
        $options[] = array(
            'id' => 'preview-logo-' . ($index + 1),
            'providerLogoId' => 'preview-logo-' . ($index + 1),
            'provider' => 'zoviz',
            'name' => $theme[0],
            'svg' => $svg,
            'previewUrl' => '',
            'image' => '',
            'previewOnly' => true
        );
    }
    return $options;
}
?>
