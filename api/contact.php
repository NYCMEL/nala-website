<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('error' => 'Method not allowed.'));
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = array();
}

function nala_contact_clean($value) {
    return trim(str_replace(array("\r", "\n"), ' ', (string) $value));
}

$name = nala_contact_clean($data['name'] ?? '');
$email = filter_var(trim((string) ($data['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$phone = nala_contact_clean($data['phone'] ?? '');
$issue = nala_contact_clean($data['issue'] ?? '');
$message = trim((string) ($data['message'] ?? ''));

if ($name === '' || !$email || $issue === '' || $message === '') {
    http_response_code(400);
    echo json_encode(array('error' => 'Name, email, issue, and message are required.'));
    exit;
}

$labels = array(
    'account_login' => 'Account login',
    'payment_issue' => 'Payment issue',
    'course_access' => 'Course access',
    'business_in_a_box' => 'Business in a Box',
    'website_seo' => 'Website or SEO',
    'shipping_kit' => 'Shipping or kit',
    'technical_problem' => 'Technical problem',
    'other' => 'Other'
);

$issueLabel = $labels[$issue] ?? $issue;
$body = "New NALA contact form message\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Issue: {$issueLabel}\n\n"
    . "Message:\n{$message}\n";

$host = strtolower(preg_replace('/[^a-z0-9.-]/', '', (string)($_SERVER['HTTP_HOST'] ?? 'nala-test.com')));
$host = $host !== '' ? $host : 'nala-test.com';

$headers = array(
    'From: NALA Website <no-reply@' . $host . '>',
    'Reply-To: ' . $name . ' <' . $email . '>'
);

$sent = @mail('support@nalanetwork.com', 'NALA contact form: ' . $issueLabel, $body, implode("\r\n", $headers));

echo json_encode(array('ok' => true, 'emailSent' => (bool) $sent));
