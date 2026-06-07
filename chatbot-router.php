<?php
declare(strict_types=1);

$path = (string)($_GET['wp_json_path'] ?? '');
if ($path === '' || !preg_match('/^mxchat/i', $path)) {
    http_response_code(404);
    exit('Not found');
}

$wpIndex = dirname(__DIR__) . '/chatbot_wp/index.php';
if (!is_file($wpIndex)) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    exit('Chatbot service is not available.');
}

$_SERVER['REQUEST_URI'] = '/wp-json/' . $path;
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';

require $wpIndex;
