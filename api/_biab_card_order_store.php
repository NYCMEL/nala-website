<?php
function biab_card_json_response($status, $payload) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

function biab_card_read_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : array();
}

function biab_card_uid($value) {
    $uid = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$value);
    if ($uid === '') {
        biab_card_json_response(400, array('error' => 'Missing business page ID.'));
    }
    return $uid;
}

function biab_card_dir() {
    $dir = __DIR__ . '/../websites/card_orders';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir;
}

function biab_card_db() {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    if (!class_exists('PDO')) {
        biab_card_json_response(500, array('error' => 'Database support is not available on this server.'));
    }
    try {
        $pdo = new PDO('sqlite:' . biab_card_dir() . '/business_in_a_box_card_orders.sqlite');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec('CREATE TABLE IF NOT EXISTS card_orders (
            nala_uid TEXT PRIMARY KEY,
            template_id TEXT NOT NULL,
            payload TEXT NOT NULL,
            created_at TEXT NOT NULL
        )');
        $pdo->exec('CREATE TABLE IF NOT EXISTS card_options (
            nala_uid TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            created_at TEXT NOT NULL
        )');
    } catch (Exception $e) {
        biab_card_json_response(500, array('error' => 'Could not open card order database.'));
    }
    return $pdo;
}

function biab_card_order_from_row($row) {
    if (!$row) {
        return null;
    }
    $payload = json_decode($row['payload'] ?? '{}', true);
    if (!is_array($payload)) {
        $payload = array();
    }
    $payload['templateId'] = $payload['templateId'] ?? $row['template_id'];
    $payload['orderedAt'] = $payload['orderedAt'] ?? $row['created_at'];
    return $payload;
}

function biab_card_get_order($uid) {
    $stmt = biab_card_db()->prepare('SELECT * FROM card_orders WHERE nala_uid = :uid LIMIT 1');
    $stmt->execute(array(':uid' => $uid));
    return biab_card_order_from_row($stmt->fetch(PDO::FETCH_ASSOC));
}

function biab_card_reset_order($uid) {
    $stmt = biab_card_db()->prepare('DELETE FROM card_orders WHERE nala_uid = :uid');
    $stmt->execute(array(':uid' => $uid));
    $stmt = biab_card_db()->prepare('DELETE FROM card_options WHERE nala_uid = :uid');
    $stmt->execute(array(':uid' => $uid));
    return true;
}

function biab_card_get_options($uid) {
    $stmt = biab_card_db()->prepare('SELECT * FROM card_options WHERE nala_uid = :uid LIMIT 1');
    $stmt->execute(array(':uid' => $uid));
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        return null;
    }
    $options = json_decode($row['payload'] ?? '[]', true);
    if (!is_array($options)) {
        return null;
    }
    return array_slice($options, 0, 6);
}

function biab_card_save_options($uid, $options) {
    $cleanOptions = array();
    foreach (array_slice(is_array($options) ? $options : array(), 0, 6) as $option) {
        if (!is_array($option)) {
            continue;
        }
        $id = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($option['id'] ?? ''));
        if ($id === '') {
            continue;
        }
        $option['id'] = $id;
        $option['label'] = trim((string)($option['label'] ?? ('Business Card ' . (count($cleanOptions) + 1))));
        $option['isDefault'] = !empty($option['isDefault']);
        $cleanOptions[] = $option;
    }
    if (count($cleanOptions) !== 6) {
        biab_card_json_response(400, array('error' => 'Exactly 6 business card options are required.'));
    }

    $now = gmdate('c');
    $stmt = biab_card_db()->prepare('INSERT OR IGNORE INTO card_options
        (nala_uid, payload, created_at)
        VALUES
        (:uid, :payload, :created_at)');
    $stmt->execute(array(
        ':uid' => $uid,
        ':payload' => json_encode($cleanOptions, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ':created_at' => $now
    ));

    return biab_card_get_options($uid) ?: $cleanOptions;
}

function biab_card_save_first_order($uid, $order) {
    $existing = biab_card_get_order($uid);
    if ($existing) {
        return $existing;
    }

    if (!is_array($order)) {
        biab_card_json_response(400, array('error' => 'Card order data is required.'));
    }

    $templateId = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($order['templateId'] ?? ''));
    if ($templateId === '') {
        biab_card_json_response(400, array('error' => 'Missing card template.'));
    }

    $now = gmdate('c');
    $order['templateId'] = $templateId;
    $order['orderedAt'] = $order['orderedAt'] ?? $now;

    $stmt = biab_card_db()->prepare('INSERT INTO card_orders
        (nala_uid, template_id, payload, created_at)
        VALUES
        (:uid, :template_id, :payload, :created_at)');
    $stmt->execute(array(
        ':uid' => $uid,
        ':template_id' => $templateId,
        ':payload' => json_encode($order, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ':created_at' => $now
    ));

    return $order;
}
?>
