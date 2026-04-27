<?php
function biab_reviews_json_response($status, $payload) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

function biab_reviews_read_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : array();
}

function biab_reviews_uid($value) {
    $uid = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$value);
    if ($uid === '') {
        biab_reviews_json_response(400, array('error' => 'Missing business page ID.'));
    }
    return $uid;
}

function biab_reviews_dir() {
    $dir = __DIR__ . '/../websites/reviews';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir;
}

function biab_reviews_file($uid) {
    return biab_reviews_dir() . '/' . $uid . '.json';
}

function biab_pending_file($uid) {
    return biab_reviews_dir() . '/' . $uid . '.pending.json';
}

function biab_read_reviews($uid) {
    $file = biab_reviews_file($uid);
    if (!is_file($file)) {
        return array();
    }
    $data = json_decode(file_get_contents($file), true);
    return is_array($data) ? $data : array();
}

function biab_write_reviews($uid, $reviews) {
    file_put_contents(biab_reviews_file($uid), json_encode(array_values($reviews), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
}

function biab_read_pending($uid) {
    $file = biab_pending_file($uid);
    if (!is_file($file)) {
        return array();
    }
    $data = json_decode(file_get_contents($file), true);
    return is_array($data) ? $data : array();
}

function biab_write_pending($uid, $pending) {
    file_put_contents(biab_pending_file($uid), json_encode($pending, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
}

function biab_review_summary($reviews) {
    $count = count($reviews);
    $total = 0;
    foreach ($reviews as $review) {
        $total += isset($review['rating']) ? (float)$review['rating'] : 0;
    }
    return array(
        'rating' => $count ? round($total / $count, 1) : 0,
        'reviewCount' => $count
    );
}
?>
