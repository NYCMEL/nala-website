<?php
require_once __DIR__ . '/_nala_enrollment_store.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    nala_enrollment_json_response(405, array('ok' => false, 'error' => 'Method not allowed.'));
}

$config = nala_enrollment_load_config();

// Keep implementation notes available in the source file, but send only the
// runtime fields the browser needs to render and score the enrollment flow.
nala_enrollment_json_response(200, array(
    'ok' => true,
    'version' => $config['version'] ?? '',
    'generatedAt' => $config['generatedAt'] ?? '',
    'app' => $config['app'] ?? array(),
    'scoreKeys' => $config['scoreKeys'] ?? array(),
    'questions' => $config['questions'] ?? array(),
    'blueprints' => $config['blueprints'] ?? array(),
    'overlays' => $config['overlays'] ?? array(),
    'themes' => $config['themes'] ?? array()
));
?>
