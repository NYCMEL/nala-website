<?php
function biab_google_seo_json_response($status, $payload) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function biab_google_seo_read_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : array();
}

function biab_google_seo_uid($value) {
    $uid = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$value);
    if ($uid === '') {
        biab_google_seo_json_response(400, array('error' => 'Missing business page ID.'));
    }
    return $uid;
}

function biab_google_seo_dir() {
    $dir = __DIR__ . '/../websites/google_seo';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir;
}

function biab_google_seo_db() {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    if (!class_exists('PDO')) {
        return null;
    }
    try {
        $pdo = new PDO('sqlite:' . biab_google_seo_dir() . '/business_in_a_box_google_seo.sqlite');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec('CREATE TABLE IF NOT EXISTS google_seo_requests (
            nala_uid TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )');
    } catch (Exception $e) {
        return null;
    }
    return $pdo;
}

function biab_google_seo_file($uid) {
    return biab_google_seo_dir() . '/' . $uid . '.json';
}

function biab_google_seo_clean_text($value, $max = 5000) {
    $text = trim((string)$value);
    return substr($text, 0, $max);
}

function biab_google_seo_export_data($payload) {
    $source = is_array($payload['exportData'] ?? null) ? $payload['exportData'] : array();
    $keys = array(
        'businessName',
        'legalBusinessName',
        'ownerName',
        'phone',
        'email',
        'websiteUrl',
        'sitemapUrl',
        'address',
        'serviceArea',
        'hours',
        'services',
        'description'
    );
    $export = array();
    foreach ($keys as $key) {
        $export[$key] = biab_google_seo_clean_text($source[$key] ?? '', $key === 'description' ? 1000 : 300);
    }
    return $export;
}

function biab_google_seo_default_status($uid) {
    return array(
        'nalaUID' => $uid,
        'requestedAt' => '',
        'authorizationRequired' => true,
        'steps' => biab_google_seo_steps(),
        'exportData' => array(
            'businessName' => '',
            'legalBusinessName' => '',
            'ownerName' => '',
            'phone' => '',
            'email' => '',
            'websiteUrl' => '',
            'sitemapUrl' => '',
            'address' => '',
            'serviceArea' => '',
            'hours' => '',
            'services' => '',
            'description' => ''
        )
    );
}

function biab_google_seo_steps() {
    return array(
        array(
            'label' => 'Hosted website SEO',
            'status' => 'Automatic',
            'description' => 'NALA prepares title tags, meta descriptions, local business schema, review schema, sitemap-ready URLs, and internal links from the saved profile.'
        ),
        array(
            'label' => 'Search Console sitemap',
            'status' => 'Needs Google authorization',
            'description' => 'After the client authorizes the correct Google account or adds NALA to the property, NALA can submit the sitemap through the Search Console API.'
        ),
        array(
            'label' => 'Google Business Profile',
            'status' => 'Needs owner verification',
            'description' => 'Google requires the owner to claim or verify the Business Profile. Once access is granted, NALA can prepare and manage eligible location details.'
        ),
        array(
            'label' => 'Local SEO data package',
            'status' => 'Prepared',
            'description' => 'NALA keeps the public name, phone, website, service area, hours, services, and description consistent for Google and citation work.'
        )
    );
}

function biab_google_seo_status_from_payload($uid, $payload) {
    $status = is_array($payload) ? $payload : array();
    $status['nalaUID'] = $uid;
    $status['requestedAt'] = biab_google_seo_clean_text($status['requestedAt'] ?? gmdate('c'), 80);
    $status['authorizationRequired'] = true;
    $status['steps'] = biab_google_seo_steps();
    $status['exportData'] = biab_google_seo_export_data($status);
    return $status;
}

function biab_google_seo_get($uid) {
    $db = biab_google_seo_db();
    if ($db instanceof PDO) {
        $stmt = $db->prepare('SELECT payload FROM google_seo_requests WHERE nala_uid = :uid LIMIT 1');
        $stmt->execute(array(':uid' => $uid));
        $payload = $stmt->fetchColumn();
    } else {
        $file = biab_google_seo_file($uid);
        $payload = is_file($file) ? file_get_contents($file) : '';
    }
    if (!$payload) {
        return biab_google_seo_default_status($uid);
    }
    $data = json_decode($payload, true);
    return is_array($data) ? $data : biab_google_seo_default_status($uid);
}

function biab_google_seo_save($uid, $payload) {
    $now = gmdate('c');
    $status = biab_google_seo_status_from_payload($uid, $payload);
    $existing = biab_google_seo_get($uid);
    $createdAt = !empty($existing['requestedAt']) ? $existing['requestedAt'] : $now;

    $encoded = json_encode($status, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $db = biab_google_seo_db();
    if ($db instanceof PDO) {
        $stmt = $db->prepare('REPLACE INTO google_seo_requests
            (nala_uid, payload, created_at, updated_at)
            VALUES
            (:uid, :payload, :created_at, :updated_at)');
        $stmt->execute(array(
            ':uid' => $uid,
            ':payload' => $encoded,
            ':created_at' => $createdAt,
            ':updated_at' => $now
        ));
    } else {
        file_put_contents(biab_google_seo_file($uid), $encoded);
    }
    return $status;
}

function biab_google_seo_reset($uid) {
    $db = biab_google_seo_db();
    if ($db instanceof PDO) {
        $stmt = $db->prepare('DELETE FROM google_seo_requests WHERE nala_uid = :uid');
        $stmt->execute(array(':uid' => $uid));
    }
    $file = biab_google_seo_file($uid);
    if (is_file($file)) {
        unlink($file);
    }
    return true;
}
?>
