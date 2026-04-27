<?php
require_once __DIR__ . '/_biab_reviews_store.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    biab_reviews_json_response(405, array('error' => 'Method not allowed.'));
}

$data = biab_reviews_read_json_body();
$uid = biab_reviews_uid($data['nalaUID'] ?? '');
$token = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($data['token'] ?? ''));
$name = trim((string)($data['customerName'] ?? ''));
$rating = (int)($data['rating'] ?? 0);
$text = trim((string)($data['text'] ?? ''));

if ($name === '' || $rating < 1 || $rating > 5 || $text === '') {
    biab_reviews_json_response(400, array('error' => 'Name, rating, and review are required.'));
}

$pending = biab_read_pending($uid);
if ($token !== '' && isset($pending[$token])) {
    unset($pending[$token]);
    biab_write_pending($uid, $pending);
}

$reviews = biab_read_reviews($uid);
$reviews[] = array(
    'id' => 'rev-' . gmdate('YmdHis') . '-' . substr(bin2hex(random_bytes(4)), 0, 8),
    'customerName' => $name,
    'rating' => $rating,
    'text' => $text,
    'createdAt' => gmdate('Y-m-d'),
    'published' => true
);

biab_write_reviews($uid, $reviews);
$summary = biab_review_summary($reviews);
biab_reviews_json_response(200, array('ok' => true, 'reviews' => $reviews, 'rating' => $summary['rating'], 'reviewCount' => $summary['reviewCount']));
?>
