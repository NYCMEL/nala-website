<?php
require_once __DIR__ . '/_nala_enrollment_store.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    nala_enrollment_json_response(405, array('ok' => false, 'error' => 'Method not allowed.'));
}

$body = nala_enrollment_read_json_body();
$answers = is_array($body['answers'] ?? null) ? $body['answers'] : array();
$profile = is_array($body['profile'] ?? null) ? $body['profile'] : array();
$email = trim((string)($profile['email'] ?? ''));

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    nala_enrollment_json_response(400, array('ok' => false, 'error' => 'Please enter a valid email address.'));
}

$config = nala_enrollment_load_config();
$result = nala_enrollment_score($config, $answers);

try {
    $submissionId = nala_enrollment_save_submission($config, $profile, $answers, $result);
} catch (Exception $exception) {
    nala_enrollment_json_response(500, array('ok' => false, 'error' => 'Could not save the enrollment result.'));
}

nala_enrollment_json_response(200, array(
    'ok' => true,
    'submissionId' => $submissionId,
    'version' => $config['version'] ?? '',
    'result' => $result
));
?>
