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

function nala_contact_html($value) {
    return nl2br(htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'));
}

$profile = is_array($data['profile'] ?? null) ? $data['profile'] : array();
$name = nala_contact_clean($profile['name'] ?? ($data['name'] ?? ''));
$email = filter_var(trim((string) ($profile['email'] ?? ($data['email'] ?? ''))), FILTER_VALIDATE_EMAIL);
$phone = nala_contact_clean($profile['phone'] ?? ($data['phone'] ?? ''));
$userId = nala_contact_clean($profile['userId'] ?? '');
$subject = nala_contact_clean($data['subject'] ?? '');
$message = trim((string) ($data['message'] ?? ''));
$messageHtml = trim((string) ($data['messageHtml'] ?? ''));
$images = is_array($data['images'] ?? null) ? array_slice($data['images'], 0, 5) : array();

if ($subject === '' || $message === '') {
    http_response_code(400);
    echo json_encode(array('error' => 'Subject and message are required.'));
    exit;
}

$body = "New NALA contact form message\n\n"
    . "Subject: {$subject}\n"
    . "Name: " . ($name ?: 'Not provided') . "\n"
    . "Email: " . ($email ?: 'Not provided') . "\n"
    . "Phone: {$phone}\n"
    . "User ID: {$userId}\n"
    . "Images: " . count($images) . "\n\n"
    . "Message:\n{$message}\n";

$imageNames = array();
foreach ($images as $image) {
    if (is_array($image) && !empty($image['name'])) {
        $imageNames[] = nala_contact_clean($image['name']);
    }
}
$allowedHtml = '<p><br><strong><b><em><i><ul><ol><li><a><blockquote><div><span>';
$richMessage = $messageHtml !== '' ? strip_tags($messageHtml, $allowedHtml) : nala_contact_html($message);
$htmlBody = '<h2>New NALA contact form message</h2>'
    . '<p><strong>Subject:</strong> ' . nala_contact_html($subject) . '</p>'
    . '<p><strong>Name:</strong> ' . nala_contact_html($name ?: 'Not provided') . '<br>'
    . '<strong>Email:</strong> ' . nala_contact_html($email ?: 'Not provided') . '<br>'
    . '<strong>Phone:</strong> ' . nala_contact_html($phone ?: 'Not provided') . '<br>'
    . '<strong>User ID:</strong> ' . nala_contact_html($userId ?: 'Not provided') . '</p>'
    . '<p><strong>Images:</strong> ' . nala_contact_html($imageNames ? implode(', ', $imageNames) : 'None') . '</p>'
    . '<hr>'
    . '<div>' . $richMessage . '</div>';

$host = strtolower(preg_replace('/[^a-z0-9.-]/', '', (string)($_SERVER['HTTP_HOST'] ?? 'nala-test.com')));
$host = $host !== '' ? $host : 'nala-test.com';

$headers = array(
    'From: NALA Website <no-reply@' . $host . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8'
);
if ($email) {
    $headers[] = 'Reply-To: ' . ($name ? $name . ' ' : '') . '<' . $email . '>';
}

$sent = @mail('support@nalanetwork.com', 'NALA contact form: ' . $subject, $htmlBody, implode("\r\n", $headers));

echo json_encode(array('ok' => true, 'emailSent' => (bool) $sent, 'imagesReceived' => count($images), 'richTextReceived' => $messageHtml !== ''));
