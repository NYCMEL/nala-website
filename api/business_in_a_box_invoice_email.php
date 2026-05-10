<?php
require_once __DIR__ . '/_biab_invoice_store.php';
require_once __DIR__ . '/_biab_reviews_store.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    biab_invoice_json_response(405, array('error' => 'Method not allowed.'));
}

$data = biab_invoice_read_json_body();
$uid = biab_invoice_uid($data['nalaUID'] ?? '');
$record = biab_invoice_get($uid, $data['invoiceId'] ?? '');

if (!$record) {
    biab_invoice_json_response(404, array('error' => 'Invoice not found.'));
}

$invoice = is_array($record['invoice'] ?? null) ? $record['invoice'] : array();
$customerName = trim((string)($invoice['customerName'] ?? $record['customerName'] ?? 'Customer'));
$customerEmail = trim((string)($invoice['customerEmail'] ?? $record['customerEmail'] ?? ''));

if (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
    biab_invoice_json_response(400, array('error' => 'Invoice customer email is required.'));
}

$token = 'review-' . preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$record['id']);
$origin = 'https://' . ($_SERVER['HTTP_HOST'] ?? 'nala-test.com');
$reviewUrl = $origin . '/repo_deploy/client/review.html?nalaUID=' . rawurlencode($uid) . '&token=' . rawurlencode($token);

$pending = biab_read_pending($uid);
$pending[$token] = array(
    'customerName' => $customerName,
    'customerEmail' => $customerEmail,
    'jobType' => trim((string)($invoice['serviceType'] ?? $invoice['notes'] ?? 'Locksmith service')),
    'createdAt' => gmdate('c')
);
biab_write_pending($uid, $pending);

$businessName = trim((string)($invoice['businessName'] ?? 'Your locksmith'));
$invoiceNumber = trim((string)($invoice['invoiceNumber'] ?? $record['invoiceNumber'] ?? $record['id']));
$total = isset($invoice['total']) ? (float)$invoice['total'] : (float)($record['total'] ?? 0);

$subject = 'Invoice ' . $invoiceNumber . ' from ' . $businessName;
$body = "Hi {$customerName},\n\n";
$body .= "Thank you for choosing {$businessName}. Your invoice {$invoiceNumber}";
if ($total > 0) {
    $body .= ' total is $' . number_format($total, 2);
}
$body .= ".\n\n";
$body .= "Please leave a quick rating and review here:\n{$reviewUrl}\n\n";
$body .= "Thank you.";
$headers = 'From: NALA Business in a Box <no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'nala-test.com') . ">\r\n";

$sent = @mail($customerEmail, $subject, $body, $headers);
biab_invoice_json_response(200, array(
    'ok' => true,
    'emailSent' => $sent,
    'invoiceId' => $record['id'],
    'reviewUrl' => $reviewUrl
));
?>
