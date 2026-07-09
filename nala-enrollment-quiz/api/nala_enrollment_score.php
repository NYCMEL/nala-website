<?php
require_once __DIR__ . '/_nala_enrollment_store.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    nala_enrollment_json_response(405, array('ok' => false, 'error' => 'Method not allowed.'));
}

$body = nala_enrollment_read_json_body();
$answers = is_array($body['answers'] ?? null) ? $body['answers'] : array();
$config = nala_enrollment_load_config();
$result = nala_enrollment_score($config, $answers);

nala_enrollment_json_response(200, array(
    'ok' => true,
    'version' => $config['version'] ?? '',
    'result' => $result
));
?>
