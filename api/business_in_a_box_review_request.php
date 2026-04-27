<?php
require_once __DIR__ . '/_biab_reviews_store.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    biab_reviews_json_response(405, array('error' => 'Method not allowed.'));
}

$data = biab_reviews_read_json_body();
$uid = biab_reviews_uid($data['nalaUID'] ?? '');
$name = trim((string)($data['customerName'] ?? ''));
$email = trim((string)($data['customerEmail'] ?? ''));
$job = trim((string)($data['jobType'] ?? ''));
$token = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($data['token'] ?? ''));
$reviewUrl = trim((string)($data['reviewUrl'] ?? ''));

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $token === '' || $reviewUrl === '') {
    biab_reviews_json_response(400, array('error' => 'Customer name, customer email, and review link are required.'));
}

$pending = biab_read_pending($uid);
$pending[$token] = array(
    'customerName' => $name,
    'customerEmail' => $email,
    'jobType' => $job,
    'createdAt' => gmdate('c')
);
biab_write_pending($uid, $pending);

$subject = 'How did we do?';
$body = "Hi {$name},\n\nThank you for choosing us. Please leave a quick rating and review here:\n{$reviewUrl}\n\n";
if ($job !== '') {
    $body .= "Service note: {$job}\n\n";
}
$body .= "Thank you.";
$headers = 'From: NALA Business in a Box <no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'nala-test.com') . ">\r\n";

$sent = @mail($email, $subject, $body, $headers);
biab_reviews_json_response(200, array('ok' => true, 'emailSent' => $sent, 'reviewUrl' => $reviewUrl));
?>
