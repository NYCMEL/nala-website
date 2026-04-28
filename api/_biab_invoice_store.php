<?php
function biab_invoice_json_response($status, $payload) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

function biab_invoice_read_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : array();
}

function biab_invoice_uid($value) {
    $uid = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$value);
    if ($uid === '') {
        biab_invoice_json_response(400, array('error' => 'Missing business page ID.'));
    }
    return $uid;
}

function biab_invoice_dir() {
    $dir = __DIR__ . '/../websites/invoices';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir;
}

function biab_invoice_db() {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    if (!class_exists('PDO')) {
        biab_invoice_json_response(500, array('error' => 'Database support is not available on this server.'));
    }
    try {
        $pdo = new PDO('sqlite:' . biab_invoice_dir() . '/business_in_a_box_invoices.sqlite');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec('CREATE TABLE IF NOT EXISTS invoices (
            id TEXT PRIMARY KEY,
            nala_uid TEXT NOT NULL,
            invoice_number TEXT NOT NULL,
            invoice_date TEXT,
            customer_name TEXT,
            customer_email TEXT,
            total REAL NOT NULL DEFAULT 0,
            payment_status TEXT,
            payload TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_biab_invoices_uid_updated ON invoices (nala_uid, updated_at)');
    } catch (Exception $e) {
        biab_invoice_json_response(500, array('error' => 'Could not open invoice database.'));
    }
    return $pdo;
}

function biab_invoice_number($value) {
    $number = trim((string)$value);
    return $number === '' ? 'INV-' . gmdate('Ymd-His') : substr($number, 0, 80);
}

function biab_invoice_text($invoice, $key, $max = 5000) {
    $value = trim((string)($invoice[$key] ?? ''));
    return substr($value, 0, $max);
}

function biab_invoice_amount($invoice, $key) {
    $value = preg_replace('/[^0-9.\-]/', '', (string)($invoice[$key] ?? '0'));
    return is_numeric($value) ? (float)$value : 0.0;
}

function biab_invoice_total($invoice) {
    return biab_invoice_amount($invoice, 'serviceFeeAmount')
        + biab_invoice_amount($invoice, 'laborAmount')
        + biab_invoice_amount($invoice, 'partsAmount')
        + biab_invoice_amount($invoice, 'taxAmount');
}

function biab_invoice_record_from_row($row) {
    $payload = json_decode($row['payload'] ?? '{}', true);
    if (!is_array($payload)) {
        $payload = array();
    }
    return array(
        'id' => $row['id'],
        'invoiceNumber' => $row['invoice_number'],
        'invoiceDate' => $row['invoice_date'],
        'customerName' => $row['customer_name'],
        'customerEmail' => $row['customer_email'],
        'total' => (float)$row['total'],
        'paymentStatus' => $row['payment_status'],
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at'],
        'invoice' => $payload
    );
}

function biab_invoice_list($uid) {
    $stmt = biab_invoice_db()->prepare('SELECT * FROM invoices WHERE nala_uid = :uid ORDER BY updated_at DESC, created_at DESC LIMIT 100');
    $stmt->execute(array(':uid' => $uid));
    $records = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $records[] = biab_invoice_record_from_row($row);
    }
    return $records;
}

function biab_invoice_save($uid, $invoice) {
    if (!is_array($invoice)) {
        biab_invoice_json_response(400, array('error' => 'Invoice data is required.'));
    }
    $id = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($invoice['id'] ?? ''));
    if ($id === '') {
        $id = 'invoice-' . gmdate('YmdHis') . '-' . bin2hex(random_bytes(4));
    }
    $now = gmdate('c');
    $pdo = biab_invoice_db();
    $existing = $pdo->prepare('SELECT created_at FROM invoices WHERE id = :id AND nala_uid = :uid');
    $existing->execute(array(':id' => $id, ':uid' => $uid));
    $createdAt = $existing->fetchColumn();
    if (!$createdAt) {
        $createdAt = $now;
    }

    $invoice['id'] = $id;
    $stmt = $pdo->prepare('REPLACE INTO invoices
        (id, nala_uid, invoice_number, invoice_date, customer_name, customer_email, total, payment_status, payload, created_at, updated_at)
        VALUES
        (:id, :uid, :invoice_number, :invoice_date, :customer_name, :customer_email, :total, :payment_status, :payload, :created_at, :updated_at)');
    $stmt->execute(array(
        ':id' => $id,
        ':uid' => $uid,
        ':invoice_number' => biab_invoice_number($invoice['invoiceNumber'] ?? ''),
        ':invoice_date' => biab_invoice_text($invoice, 'invoiceDate', 40),
        ':customer_name' => biab_invoice_text($invoice, 'customerName', 160),
        ':customer_email' => biab_invoice_text($invoice, 'customerEmail', 160),
        ':total' => biab_invoice_total($invoice),
        ':payment_status' => biab_invoice_text($invoice, 'paymentStatus', 80),
        ':payload' => json_encode($invoice, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ':created_at' => $createdAt,
        ':updated_at' => $now
    ));

    return $id;
}
?>
