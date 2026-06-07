<?php
declare(strict_types=1);

$host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
$isProduction = (bool)preg_match('/(^|\.)nalanetwork\.com$/', $host);

if (!$isProduction) {
    header('Location: /', true, 302);
    exit;
}

$fallbackHash = '$2y$12$h4sH5Qn5nO5sVS2GLSdx8ORB.DqrueSnnP7hQwiXNCR37wL/438ku';
$passwordHash = getenv('NALA_CONSTRUCTION_PASSWORD_HASH') ?: $fallbackHash;
$error = '';

header('X-Robots-Tag: noindex, nofollow, noarchive, nosnippet');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = (string)($_POST['password'] ?? '');

    if ($passwordHash && password_verify($password, $passwordHash)) {
        setcookie('nala_preview', '1', [
            'expires' => time() + 60 * 60 * 12,
            'path' => '/',
            'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        $next = (string)($_POST['next'] ?? '/');
        if ($next === '' || $next[0] !== '/' || str_starts_with($next, '//')) {
            $next = '/';
        }

        header('Location: ' . $next, true, 302);
        exit;
    }

    $error = 'That password did not work.';
}

$next = (string)($_GET['next'] ?? ($_SERVER['REQUEST_URI'] ?? '/'));
if ($next === '' || $next[0] !== '/' || str_starts_with($next, '//')) {
    $next = '/';
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow,noarchive,nosnippet">
    <title>NALA Network</title>
    <style>
        :root {
            color-scheme: light;
            --ink: #1f2528;
            --muted: #617078;
            --line: #d8c7a3;
            --gold: #b88924;
            --bg: #f8f5ee;
            --panel: #ffffff;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 32px 18px;
            font-family: Arial, sans-serif;
            color: var(--ink);
            background:
                linear-gradient(120deg, rgba(184, 137, 36, 0.12), transparent 44%),
                var(--bg);
        }

        main {
            width: min(100%, 520px);
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: 8px;
            padding: clamp(28px, 6vw, 48px);
            box-shadow: 0 18px 60px rgba(31, 37, 40, 0.12);
        }

        img {
            display: block;
            width: 120px;
            height: auto;
            margin-bottom: 28px;
        }

        h1 {
            margin: 0 0 12px;
            font-size: clamp(30px, 7vw, 44px);
            line-height: 1.04;
            font-weight: 700;
        }

        p {
            margin: 0 0 28px;
            color: var(--muted);
            font-size: 17px;
            line-height: 1.55;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 700;
        }

        .row {
            display: flex;
            gap: 10px;
        }

        input {
            min-width: 0;
            flex: 1;
            height: 44px;
            border: 1px solid #c9d0d3;
            border-radius: 6px;
            padding: 0 12px;
            font: inherit;
        }

        button {
            height: 44px;
            border: 0;
            border-radius: 6px;
            padding: 0 18px;
            font: inherit;
            font-weight: 700;
            color: #fff;
            background: var(--gold);
            cursor: pointer;
        }

        .error {
            margin-top: 12px;
            color: #9b1c1c;
            font-size: 14px;
        }

        @media (max-width: 520px) {
            .row { flex-direction: column; }
            button { width: 100%; }
        }
    </style>
</head>
<body>
    <main>
        <img src="/img/logo.png" alt="NALA">
        <h1>We are updating NALA Network.</h1>
        <p>The new site is being prepared. Preview access is available for the team.</p>
        <form method="post" action="/construction.php" autocomplete="off">
            <input type="hidden" name="next" value="<?php echo htmlspecialchars($next, ENT_QUOTES, 'UTF-8'); ?>">
            <label for="password">Preview password</label>
            <div class="row">
                <input id="password" name="password" type="password" required autofocus>
                <button type="submit">Enter</button>
            </div>
            <?php if ($error): ?>
                <div class="error"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
            <?php endif; ?>
        </form>
    </main>
</body>
</html>
