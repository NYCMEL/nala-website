<?php
require_once __DIR__ . '/_biab_invoice_store.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $uid = biab_invoice_uid($_GET['nalaUID'] ?? '');
    biab_invoice_json_response(200, array(
        'ok' => true,
        'invoices' => biab_invoice_list($uid)
    ));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    biab_invoice_json_response(405, array('error' => 'Method not allowed.'));
}

$data = biab_invoice_read_json_body();
$uid = biab_invoice_uid($data['nalaUID'] ?? '');
$invoice = is_array($data['invoice'] ?? null) ? $data['invoice'] : array();

$id = biab_invoice_save($uid, $invoice);
biab_invoice_json_response(200, array(
    'ok' => true,
    'id' => $id,
    'invoices' => biab_invoice_list($uid)
));
?>
