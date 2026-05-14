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
        $pdo->exec('CREATE TABLE IF NOT EXISTS logo_options (
            nala_uid TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            provider TEXT NOT NULL,
            created_at TEXT NOT NULL
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
    $payload = biab_logo_normalize_logo($payload);
    if (!$payload) {
        biab_logo_delete_logo($uid);
        return null;
    }
    $payload['providerLogoId'] = $payload['providerLogoId'] ?? ($row['provider_logo_id'] ?? '');
    $payload['updatedAt'] = $payload['updatedAt'] ?? ($row['updated_at'] ?? '');
    return $payload;
}

function biab_logo_delete_logo($uid) {
    $stmt = biab_logo_db()->prepare('DELETE FROM logos WHERE nala_uid = :uid');
    $stmt->execute(array(':uid' => $uid));
    return true;
}

function biab_logo_delete_options($uid) {
    $stmt = biab_logo_db()->prepare('DELETE FROM logo_options WHERE nala_uid = :uid');
    $stmt->execute(array(':uid' => $uid));
    return true;
}

function biab_logo_reset($uid) {
    biab_logo_delete_logo($uid);
    biab_logo_delete_options($uid);
    return true;
}

function biab_logo_get_options($uid) {
    $stmt = biab_logo_db()->prepare('SELECT * FROM logo_options WHERE nala_uid = :uid LIMIT 1');
    $stmt->execute(array(':uid' => $uid));
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        return null;
    }
    $options = json_decode($row['payload'] ?? '[]', true);
    if (!is_array($options)) {
        return null;
    }
    $cleanOptions = array();
    foreach (array_slice($options, 0, 6) as $option) {
        $normalized = biab_logo_normalize_logo(is_array($option) ? $option : array());
        if ($normalized) {
            $cleanOptions[] = $normalized;
        }
    }
    if (count($cleanOptions) !== 6) {
        biab_logo_delete_options($uid);
        return null;
    }
    return array(
        'options' => $cleanOptions,
        'provider' => json_decode($row['provider'] ?? '{}', true) ?: array(),
        'createdAt' => $row['created_at'] ?? ''
    );
}

function biab_logo_save_options($uid, $options, $provider) {
    $cleanOptions = array();
    foreach (array_slice(is_array($options) ? $options : array(), 0, 6) as $option) {
        $normalized = biab_logo_normalize_logo(is_array($option) ? $option : array());
        if ($normalized) {
            $cleanOptions[] = $normalized;
        }
    }
    if (count($cleanOptions) !== 6) {
        biab_logo_json_response(502, array('error' => 'Exactly 6 logo options are required.'));
    }
    $now = gmdate('c');
    $stmt = biab_logo_db()->prepare('INSERT OR REPLACE INTO logo_options
        (nala_uid, payload, provider, created_at)
        VALUES
        (:uid, :payload, :provider, :created_at)');
    $stmt->execute(array(
        ':uid' => $uid,
        ':payload' => json_encode($cleanOptions, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ':provider' => json_encode(is_array($provider) ? $provider : array(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ':created_at' => $now
    ));
    return array(
        'options' => $cleanOptions,
        'provider' => is_array($provider) ? $provider : array(),
        'createdAt' => $now
    );
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

    if (biab_logo_is_preview_test_logo($id, $name, $svg, $previewUrl, $image)) {
        return null;
    }

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

function biab_logo_is_preview_test_logo($id, $name, $svg, $previewUrl, $image) {
    $haystack = strtolower($id . ' ' . $name . ' ' . $svg . ' ' . $previewUrl . ' ' . $image);
    if (strpos($haystack, 'zoviz preview test') !== false) {
        return true;
    }
    if (strpos($haystack, 'preview-logo-') !== false) {
        return true;
    }
    return false;
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

?>
