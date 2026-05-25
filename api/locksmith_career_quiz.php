<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('ok' => false, 'error' => 'Method not allowed.'));
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(array('ok' => false, 'error' => 'Invalid JSON body.'));
    exit;
}

function nala_lcq_clean($value, $limit = 240) {
    $clean = trim(preg_replace('/\s+/', ' ', str_replace(array("\r", "\n"), ' ', (string) $value)));
    return strlen($clean) > $limit ? substr($clean, 0, $limit) : $clean;
}

function nala_lcq_money($value) {
    return '$' . number_format((float) $value, 0);
}

function nala_lcq_answer($answers, $key, $fallback = '') {
    return nala_lcq_clean($answers[$key]['label'] ?? $answers[$key] ?? $fallback);
}

function nala_lcq_header_value($value, $limit = 160) {
    return nala_lcq_clean(preg_replace('/[^\P{C}\t ]/u', '', (string) $value), $limit);
}

function nala_lcq_mail_attempt($to, $subject, $body, $replyTo, $fromEmail, $useEnvelopeSender) {
    $fromName = 'NALA';
    try {
        $messageToken = bin2hex(random_bytes(8));
    } catch (Exception $exception) {
        $messageToken = substr(sha1(uniqid('', true)), 0, 16);
    }
    $headers = array(
        'From: ' . $fromName . ' <' . $fromEmail . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion(),
        'Message-ID: <nala-' . $messageToken . '@nalanetwork.com>'
    );
    if ($replyTo !== '') {
        $headers[] = 'Reply-To: ' . nala_lcq_header_value($replyTo);
    } else {
        $headers[] = 'Reply-To: NALA <' . $fromEmail . '>';
    }

    $args = array($to, nala_lcq_header_value($subject, 180), $body, implode("\r\n", $headers));
    if ($useEnvelopeSender) {
        $args[] = '-f' . $fromEmail;
    }
    return call_user_func_array('mail', $args);
}

function nala_lcq_send_mail($to, $subject, $body, $replyTo = '') {
    $host = strtolower(preg_replace('/[^a-z0-9.-]/', '', (string)($_SERVER['HTTP_HOST'] ?? 'nala-test.com')));
    $host = $host !== '' ? $host : 'nala-test.com';
    $hostSender = 'no-reply@' . $host;
    $attempts = array(
        array('support@nalanetwork.com', true),
        array($hostSender, true),
        array($hostSender, false)
    );

    foreach ($attempts as $attempt) {
        if (@nala_lcq_mail_attempt($to, $subject, $body, $replyTo, $attempt[0], $attempt[1])) {
            return true;
        }
    }
    return false;
}

function nala_lcq_hours($answers) {
    $value = nala_lcq_clean($answers['time']['value'] ?? '');
    return in_array($value, array('4', '8', '12', '20', '30'), true) ? (int) $value : 8;
}

function nala_lcq_direction($answers) {
    $interest = strtolower(nala_lcq_answer($answers, 'interest'));
    $goal = strtolower(nala_lcq_answer($answers, 'goal'));

    if (strpos($interest, 'automotive') !== false || strpos($interest, 'car') !== false) {
        return array('title' => 'Automotive lockout and key support', 'reason' => 'Automotive calls can fit evenings, weekends, and mobile service because customers often need help where the vehicle is.');
    }
    if (strpos($interest, 'commercial') !== false || strpos($goal, 'business') !== false) {
        return array('title' => 'Commercial and property service', 'reason' => 'Commercial work can build repeat relationships with property managers, offices, stores, and local operators once your fundamentals are solid.');
    }
    if (strpos($interest, 'safe') !== false) {
        return array('title' => 'Safe and specialty locksmith services', 'reason' => 'Safe work rewards patience and technical focus, and can become a higher-skill specialty after the basics.');
    }
    return array('title' => 'Residential rekeys, lockouts, and lock changes', 'reason' => 'Residential work is usually the clearest first path because the services are easy for customers to understand and request.');
}

$answers = is_array($data['answers'] ?? null) ? $data['answers'] : array();
$name = nala_lcq_clean($data['name'] ?? '', 120);
$email = filter_var(trim((string) ($data['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$city = nala_lcq_clean($data['city'] ?? nala_lcq_answer($answers, 'location'), 160);

if ($name === '' || !$email) {
    http_response_code(400);
    echo json_encode(array('ok' => false, 'error' => 'Name and a valid email are required.'));
    exit;
}

$hours = nala_lcq_hours($answers);
$visitsLow = max(1, (int) floor($hours / 2.25));
$visitsTarget = max(1, (int) floor($hours / 1.5));
$weeklyLow = $visitsLow * 125;
$weeklyTarget = $visitsTarget * 185;
$monthlyLow = round($weeklyLow * 4.33);
$monthlyTarget = round($weeklyTarget * 4.33);
$direction = nala_lcq_direction($answers);
$host = $_SERVER['HTTP_HOST'] ?? 'nala-test.com';
$buyUrl = 'https://' . $host . '/repo_deploy/?scroll=buy#home';

$body = "Hi {$name},\n\n"
    . "Based on your quiz answers, locksmithing looks like a practical career path to explore.\n\n"
    . "Recommended starting direction: {$direction['title']}\n"
    . "{$direction['reason']}\n\n"
    . "Your time estimate:\n"
    . "- Time available: about {$hours} hours per week\n"
    . "- Conservative pace: about {$visitsLow} paid visits per week\n"
    . "- Strong pace after practice: about {$visitsTarget} paid visits per week\n\n"
    . "Possible gross service revenue before expenses:\n"
    . "- Conservative: about " . nala_lcq_money($weeklyLow) . "/week, or " . nala_lcq_money($monthlyLow) . "/month\n"
    . "- Stronger target: about " . nala_lcq_money($weeklyTarget) . "/week, or " . nala_lcq_money($monthlyTarget) . "/month\n\n"
    . "These are planning examples, not guarantees. Actual results depend on your market, skill, speed, legal requirements, tools, advertising, schedule, and how consistently you take calls.\n\n"
    . "What your answers suggest:\n"
    . "- Goal: " . nala_lcq_answer($answers, 'goal', 'Start earning with a practical trade') . "\n"
    . "- Income target: " . nala_lcq_answer($answers, 'incomeGoal', 'Build useful extra income') . "\n"
    . "- Current income: " . nala_lcq_answer($answers, 'currentIncome', 'Not provided') . "\n"
    . "- Urgency: " . nala_lcq_answer($answers, 'urgency', 'Not provided') . "\n"
    . "- Location: " . ($city ?: 'Not provided') . "\n"
    . "- Lifestyle driver: " . nala_lcq_answer($answers, 'driver', 'More control and a real skill') . "\n"
    . "- Service interest: " . nala_lcq_answer($answers, 'interest', 'All-around locksmith work') . "\n\n"
    . "Suggested next step:\n"
    . "Start with NALA training so you can learn the fundamentals, understand the business side, and move toward paid locksmith services with a structured path.\n\n"
    . "Start here: {$buyUrl}\n\n"
    . "NALA\n";

$supportBody = "New locksmith career quiz lead\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Location: {$city}\n"
    . "Recommended direction: {$direction['title']}\n"
    . "Hours/week: {$hours}\n"
    . "Projected monthly gross range: " . nala_lcq_money($monthlyLow) . " - " . nala_lcq_money($monthlyTarget) . "\n\nAnswers:\n";
foreach ($answers as $key => $answer) {
    $supportBody .= "- " . nala_lcq_clean($key, 80) . ': ' . nala_lcq_answer($answers, $key) . "\n";
}

$sentToLead = nala_lcq_send_mail($email, 'Your NALA locksmith career fit plan', $body, 'NALA <support@nalanetwork.com>');
$sentToSupport = nala_lcq_send_mail('support@nalanetwork.com', 'NALA locksmith quiz lead: ' . $name, $supportBody, $name . ' <' . $email . '>');

if (!$sentToLead) {
    http_response_code(500);
    echo json_encode(array('ok' => false, 'error' => 'Could not send the email right now.'));
    exit;
}

echo json_encode(array(
    'ok' => true,
    'emailSent' => true,
    'supportEmailSent' => (bool) $sentToSupport,
    'recommendation' => $direction,
    'estimate' => array(
        'hoursPerWeek' => $hours,
        'visitsLow' => $visitsLow,
        'visitsTarget' => $visitsTarget,
        'weeklyLow' => $weeklyLow,
        'weeklyTarget' => $weeklyTarget,
        'monthlyLow' => $monthlyLow,
        'monthlyTarget' => $monthlyTarget
    ),
    'redirectUrl' => $buyUrl
));
