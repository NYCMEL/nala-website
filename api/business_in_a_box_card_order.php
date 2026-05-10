<?php
require_once __DIR__ . '/_biab_card_order_store.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $uid = biab_card_uid($_GET['nalaUID'] ?? '');
    biab_card_json_response(200, array(
        'ok' => true,
        'order' => biab_card_get_order($uid)
    ));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    biab_card_json_response(405, array('error' => 'Method not allowed.'));
}

$data = biab_card_read_json_body();
$uid = biab_card_uid($data['nalaUID'] ?? '');
$order = is_array($data['order'] ?? null) ? $data['order'] : array();

biab_card_json_response(200, array(
    'ok' => true,
    'order' => biab_card_save_first_order($uid, $order)
));
?>
