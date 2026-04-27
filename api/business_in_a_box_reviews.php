<?php
require_once __DIR__ . '/_biab_reviews_store.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $uid = biab_reviews_uid($_GET['nalaUID'] ?? '');
    $reviews = biab_read_reviews($uid);
    $summary = biab_review_summary($reviews);
    biab_reviews_json_response(200, array('ok' => true, 'reviews' => $reviews, 'rating' => $summary['rating'], 'reviewCount' => $summary['reviewCount']));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    biab_reviews_json_response(405, array('error' => 'Method not allowed.'));
}

$data = biab_reviews_read_json_body();
$uid = biab_reviews_uid($data['nalaUID'] ?? '');
$requested = is_array($data['reviews'] ?? null) ? $data['reviews'] : array();
$saved = biab_read_reviews($uid);
$publishedById = array();

foreach ($requested as $review) {
    if (!isset($review['id'])) {
        continue;
    }
    $publishedById[(string)$review['id']] = !empty($review['published']);
}

foreach ($saved as &$review) {
    $id = isset($review['id']) ? (string)$review['id'] : '';
    if ($id !== '' && array_key_exists($id, $publishedById)) {
        $review['published'] = $publishedById[$id];
    }
}
unset($review);

biab_write_reviews($uid, $saved);
$summary = biab_review_summary($saved);
biab_reviews_json_response(200, array('ok' => true, 'reviews' => $saved, 'rating' => $summary['rating'], 'reviewCount' => $summary['reviewCount']));
?>
