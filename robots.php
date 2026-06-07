<?php
declare(strict_types=1);

$host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
$isStaging = (bool)preg_match('/(^|\.)nala-test\.com$/', $host);
$isProduction = (bool)preg_match('/(^|\.)nalanetwork\.com$/', $host);

header('Content-Type: text/plain; charset=utf-8');

if ($isStaging) {
    echo "User-agent: *\n";
    echo "Disallow: /\n\n";
    echo "User-agent: GPTBot\nDisallow: /\n\n";
    echo "User-agent: ChatGPT-User\nDisallow: /\n\n";
    echo "User-agent: OAI-SearchBot\nDisallow: /\n\n";
    echo "User-agent: ClaudeBot\nDisallow: /\n\n";
    echo "User-agent: Claude-Web\nDisallow: /\n\n";
    echo "User-agent: PerplexityBot\nDisallow: /\n\n";
    echo "User-agent: Google-Extended\nDisallow: /\n\n";
    echo "User-agent: CCBot\nDisallow: /\n";
    exit;
}

if ($isProduction && !getenv('NALA_PUBLIC_LAUNCHED')) {
    echo "User-agent: *\n";
    echo "Disallow: /\n";
    exit;
}

echo "User-agent: *\n";
echo "Allow: /\n";
