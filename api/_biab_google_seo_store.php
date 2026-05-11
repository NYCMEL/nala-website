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

function biab_google_seo_clean_header($value, $max = 300) {
    return biab_google_seo_clean_text(str_replace(array("\r", "\n"), ' ', (string)$value), $max);
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

function biab_google_seo_authorization_steps() {
    return array(
        array(
            'label' => 'Hosted website SEO',
            'status' => 'Prepared',
            'description' => 'NALA has prepared title tags, meta descriptions, local business schema, review schema, sitemap-ready URLs, and internal links from the saved profile.'
        ),
        array(
            'label' => 'Search Console sitemap',
            'status' => 'Authorization email sent',
            'description' => 'The client has been emailed the Google authorization steps. After authorization, NALA can submit the hosted sitemap through Search Console.'
        ),
        array(
            'label' => 'Google Business Profile',
            'status' => 'Client verification requested',
            'description' => 'The client has been asked to claim or verify the Business Profile and add NALA as a manager so eligible location details can be managed.'
        ),
        array(
            'label' => 'Local SEO data package',
            'status' => 'Prepared',
            'description' => 'NALA keeps the public name, phone, website, service area, hours, services, and description consistent for Google and local citation work.'
        )
    );
}

function biab_google_seo_status_from_payload($uid, $payload) {
    $status = is_array($payload) ? $payload : array();
    $status['nalaUID'] = $uid;
    $status['requestedAt'] = biab_google_seo_clean_text($status['requestedAt'] ?? gmdate('c'), 80);
    $status['authorizationRequired'] = true;
    $status['steps'] = ($status['authorizationEmailSentAt'] ?? '') !== '' ? biab_google_seo_authorization_steps() : biab_google_seo_steps();
    $status['exportData'] = biab_google_seo_export_data($status);
    return $status;
}

function biab_google_seo_business_summary($export) {
    $lines = array();
    $labels = array(
        'businessName' => 'Business name',
        'legalBusinessName' => 'Legal business name',
        'ownerName' => 'Owner/responsible party',
        'phone' => 'Phone',
        'email' => 'Email',
        'websiteUrl' => 'Website',
        'sitemapUrl' => 'Sitemap',
        'address' => 'Address',
        'serviceArea' => 'Service area',
        'hours' => 'Hours',
        'services' => 'Services',
        'description' => 'Description'
    );
    foreach ($labels as $key => $label) {
        $value = trim((string)($export[$key] ?? ''));
        $lines[] = $label . ': ' . ($value !== '' ? $value : 'Not provided');
    }
    return implode("\n", $lines);
}

function biab_google_seo_send_authorization_email($uid, $status) {
    $export = is_array($status['exportData'] ?? null) ? $status['exportData'] : array();
    $businessName = biab_google_seo_clean_header($export['businessName'] ?? 'your locksmith business', 120);
    $clientEmail = filter_var(trim((string)($export['email'] ?? '')), FILTER_VALIDATE_EMAIL);

    if (!$clientEmail) {
        biab_google_seo_json_response(400, array('error' => 'A valid business email is required before sending Google authorization.'));
    }

    $host = $_SERVER['HTTP_HOST'] ?? 'nala-test.com';
    $headers = 'From: NALA Business in a Box <no-reply@' . biab_google_seo_clean_header($host, 120) . ">\r\n";
    $headers .= "Reply-To: support@nalanetwork.com\r\n";
    $summary = biab_google_seo_business_summary($export);

    $clientSubject = 'Authorize Google SEO setup for ' . $businessName;
    $clientBody = "Hi,\n\n"
        . "NALA is ready to start the Google SEO setup for {$businessName}.\n\n"
        . "Please complete these authorization steps:\n"
        . "1. Sign in to the Google account that owns or will own the Business Profile.\n"
        . "2. Claim or verify the Google Business Profile when Google asks. Google chooses the available verification method, such as email, phone, SMS, postcard, video, or automatic verification when available.\n"
        . "3. Add support@nalanetwork.com as a manager on the Business Profile after the profile is claimed or verified.\n"
        . "4. Make sure the hosted website is connected to the same Google account for Search Console access.\n\n"
        . "Business data prepared for Google:\n{$summary}\n\n"
        . "After authorization, NALA can submit the sitemap and prepare eligible Google Business Profile updates.\n\n"
        . "Thank you,\nNALA Business in a Box\n";

    $supportSubject = 'Google SEO authorization requested: ' . $businessName . ' [' . $uid . ']';
    $supportBody = "Google SEO authorization was requested from Business in a Box.\n\n"
        . "NALA UID: {$uid}\n"
        . "Client authorization email: {$clientEmail}\n"
        . "Requested at: " . ($status['authorizationEmailSentAt'] ?? gmdate('c')) . "\n\n"
        . "Prepared Google/local SEO data:\n{$summary}\n\n"
        . "Next steps after client authorization:\n"
        . "- Confirm Search Console access and submit the hosted sitemap.\n"
        . "- Confirm Google Business Profile ownership/manager access.\n"
        . "- Start or guide the owner through the Google verification method shown in their account.\n";

    $clientSent = @mail($clientEmail, $clientSubject, $clientBody, $headers);
    $supportSent = @mail('support@nalanetwork.com', $supportSubject, $supportBody, $headers);

    if (!$clientSent) {
        biab_google_seo_json_response(500, array('error' => 'Could not send the Google authorization email. Please try again.'));
    }

    return array(
        'clientEmail' => $clientEmail,
        'clientEmailSent' => (bool)$clientSent,
        'supportEmailSent' => (bool)$supportSent
    );
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

function biab_google_seo_start_authorization($uid, $payload) {
    $payload = is_array($payload) ? $payload : array();
    $payload['authorizationEmailSentAt'] = gmdate('c');
    $payload['verificationRequestedAt'] = $payload['authorizationEmailSentAt'];
    $payload['authorizationRequired'] = true;
    $payload['steps'] = biab_google_seo_authorization_steps();

    $status = biab_google_seo_status_from_payload($uid, $payload);
    $emailResult = biab_google_seo_send_authorization_email($uid, $status);
    $status['authorizationEmail'] = $emailResult['clientEmail'];
    $status['authorizationEmailSent'] = $emailResult['clientEmailSent'];
    $status['supportEmailSent'] = $emailResult['supportEmailSent'];
    $status['steps'] = biab_google_seo_authorization_steps();

    return biab_google_seo_save($uid, $status);
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
