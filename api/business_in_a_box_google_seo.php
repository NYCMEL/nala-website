<?php
require_once __DIR__ . '/_biab_google_seo_store.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $uid = biab_google_seo_uid($_GET['nalaUID'] ?? '');
    biab_google_seo_json_response(200, array(
        'ok' => true,
        'status' => biab_google_seo_get($uid)
    ));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    biab_google_seo_json_response(405, array('error' => 'Method not allowed.'));
}

$data = biab_google_seo_read_json_body();
$uid = biab_google_seo_uid($data['nalaUID'] ?? '');
$action = $data['action'] ?? 'prepare';

if ($action === 'reset') {
    biab_google_seo_reset($uid);
    biab_google_seo_json_response(200, array(
        'ok' => true,
        'status' => biab_google_seo_default_status($uid)
    ));
}

if ($action !== 'prepare') {
    biab_google_seo_json_response(400, array('error' => 'Unknown Google SEO action.'));
}

biab_google_seo_json_response(200, array(
    'ok' => true,
    'status' => biab_google_seo_save($uid, $data)
));
?>
