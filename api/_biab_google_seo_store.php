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
            'label' => 'Website information',
            'status' => 'Ready',
            'description' => 'NALA uses the saved business information to prepare the website for Google.'
        ),
        array(
            'label' => 'Google approval',
            'status' => 'Needs customer action',
            'description' => 'The customer must approve Google access before NALA can finish the Google steps.'
        ),
        array(
            'label' => 'Business verification',
            'status' => 'Needs customer action',
            'description' => 'Google may ask the customer to verify by email, phone, text, video, or postcard. The email explains what to do.'
        ),
        array(
            'label' => 'Local listing details',
            'status' => 'Ready',
            'description' => 'NALA keeps the business name, phone, website, service area, hours, services, and description ready for listings.'
        )
    );
}

function biab_google_seo_authorization_steps() {
    return array(
        array(
            'label' => 'Website information',
            'status' => 'Ready',
            'description' => 'NALA uses the saved business information to prepare the website for Google.'
        ),
        array(
            'label' => 'Google approval',
            'status' => 'Authorization email sent',
            'description' => 'The customer has been emailed the Google setup steps. Tell them to open the email from NALA and follow each step in order.'
        ),
        array(
            'label' => 'Business verification',
            'status' => 'Needs customer action',
            'description' => 'Google may ask the customer to verify by email, phone, text, video, or postcard. The email explains what to do.'
        ),
        array(
            'label' => 'Local listing details',
            'status' => 'Ready',
            'description' => 'NALA keeps the business name, phone, website, service area, hours, services, and description ready for listings.'
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
        . "NALA is ready to start the Google SEO setup for {$businessName}. Please follow these steps carefully. If a screen looks different, use the closest matching option and contact NALA support if you are unsure.\n\n"
        . "Step 1: Sign in to Google\n"
        . "1. Open https://business.google.com/add in your browser.\n"
        . "2. Sign in with the Google account you want to use for this business.\n"
        . "3. If you do not have a Google account yet, create one first. You can use your business email address: {$clientEmail}.\n\n"
        . "Step 2: Enter the business name\n"
        . "1. When Google asks for the business name, copy and paste this exactly:\n"
        . "   {$businessName}\n"
        . "2. If Google shows an existing matching business, choose it only if it is definitely your business. If it is not yours, choose the option to add a new business.\n\n"
        . "Step 3: Enter the business category and services\n"
        . "1. When Google asks for a business category, choose Locksmith or the closest locksmith-related category Google offers.\n"
        . "2. If Google asks for services, enter the services listed below under Business data prepared for Google.\n\n"
        . "Step 4: Enter the address or service area\n"
        . "1. If you serve customers at a shop or office, enter the business address in Google's address fields.\n"
        . "2. If you travel to customers, choose the service-area option when Google asks and enter your service area.\n"
        . "3. Use the Address and Service area lines below. Do not guess or use a different address unless the information below is wrong.\n\n"
        . "Step 5: Enter contact details\n"
        . "1. When Google asks for a phone number, enter the Phone line below.\n"
        . "2. When Google asks for a website, enter the Website line below.\n"
        . "3. When Google asks for an email address, enter this email in the email field: {$clientEmail}.\n\n"
        . "Step 6: Verify the business\n"
        . "1. Google will show one or more verification options. Google chooses these options; NALA cannot change them.\n"
        . "2. If Google offers email verification, choose it only if you can open that inbox. Then open the email from Google and follow the link or enter the code.\n"
        . "3. If Google offers phone or text verification, make sure you can answer the phone or receive the text. Enter the code Google sends.\n"
        . "4. If Google offers video verification, follow Google's instructions and show proof that you operate the business, such as work tools, business documents, signage, vehicle branding, or access to the work location.\n"
        . "5. If Google offers postcard verification, confirm the mailing address is correct, request the postcard, and enter the code when it arrives.\n"
        . "6. Do not share your Google verification code with anyone except inside your own Google Business Profile screen.\n\n"
        . "Step 7: Add NALA after verification\n"
        . "1. After Google says the Business Profile is verified, open the Business Profile settings.\n"
        . "2. Open the People and access or Managers section.\n"
        . "3. Add support@nalanetwork.com as a Manager.\n"
        . "4. This lets NALA submit the website sitemap and prepare eligible profile updates for you.\n\n"
        . "Business data prepared for Google. Copy and paste from this section when Google asks:\n{$summary}\n\n"
        . "After you complete the authorization and verification steps, NALA can continue with the sitemap submission and eligible Google Business Profile updates.\n\n"
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
