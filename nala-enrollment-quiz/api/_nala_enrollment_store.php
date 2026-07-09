<?php
function nala_enrollment_json_response($status, $payload) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function nala_enrollment_read_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : array();
}

function nala_enrollment_clean($value, $limit = 500) {
    $value = preg_replace('/\s+/', ' ', str_replace(array("\r", "\n"), ' ', (string)$value));
    $value = trim($value);
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $limit, 'UTF-8');
    }
    return substr($value, 0, $limit);
}

function nala_enrollment_config_path() {
    return __DIR__ . '/../locksmith-career-quiz/data/enrollment_config.json';
}

function nala_enrollment_load_config() {
    $path = nala_enrollment_config_path();
    if (!is_file($path)) {
        nala_enrollment_json_response(500, array('ok' => false, 'error' => 'Enrollment config is missing.'));
    }
    $config = json_decode(file_get_contents($path), true);
    if (!is_array($config)) {
        nala_enrollment_json_response(500, array('ok' => false, 'error' => 'Enrollment config is invalid.'));
    }
    return $config;
}

function nala_enrollment_data_dir() {
    $dir = __DIR__ . '/../locksmith-career-quiz/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir;
}

function nala_enrollment_db() {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    if (!class_exists('PDO') || !in_array('sqlite', PDO::getAvailableDrivers(), true)) {
        return null;
    }

    $path = nala_enrollment_data_dir() . '/enrollment.sqlite';
    $pdo = new PDO('sqlite:' . $path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        config_version TEXT NOT NULL,
        name TEXT,
        email TEXT,
        phone TEXT,
        answers_json TEXT NOT NULL,
        scores_json TEXT NOT NULL,
        result_json TEXT NOT NULL,
        user_agent TEXT,
        ip_hash TEXT
    )');
    return $pdo;
}

function nala_enrollment_index_options($config) {
    $index = array();
    foreach (($config['questions'] ?? array()) as $question) {
        $questionId = (string)($question['id'] ?? '');
        foreach (($question['options'] ?? array()) as $option) {
            $optionId = (string)($option['id'] ?? '');
            if ($questionId !== '' && $optionId !== '') {
                $index[$questionId][$optionId] = $option;
            }
        }
    }
    return $index;
}

function nala_enrollment_score_labels($items) {
    $out = array();
    foreach ($items as $item) {
        if (isset($item['key'])) {
            $out[$item['key']] = $item['label'] ?? $item['key'];
        }
    }
    return $out;
}

function nala_enrollment_find_by_name($items, $name) {
    $needle = strtolower(trim((string)$name));
    foreach ($items as $item) {
        $itemName = strtolower(trim((string)($item['name'] ?? '')));
        if ($itemName === $needle) {
            return $item;
        }
    }
    return null;
}

function nala_enrollment_blueprint_item($config, $scoreKey) {
    $labels = nala_enrollment_score_labels($config['scoreKeys']['blueprints'] ?? array());
    $name = $labels[$scoreKey] ?? $scoreKey;
    $item = nala_enrollment_find_by_name($config['blueprints'] ?? array(), $name);
    if (is_array($item)) {
        return $item;
    }
    return array(
        'id' => strtolower($scoreKey),
        'name' => $name,
        'result_title' => $name . ' Blueprint',
        'subtitle' => '',
        'why_this_blueprint' => '',
        'study_pace' => '',
        'timeline' => '',
        'revenue_potential' => '',
        'next_milestone' => '',
        'cta_button' => 'Start Training',
        'cta_helper_text' => ''
    );
}

function nala_enrollment_slug($value) {
    $value = strtolower(trim((string)$value));
    $value = str_replace('&', ' and ', $value);
    $value = preg_replace('/[^a-z0-9]+/', '_', $value);
    return trim($value, '_');
}

function nala_enrollment_select_highest($scores, $keys, $answerTrace, $tiePriority) {
    $highest = null;
    $tied = array();
    foreach ($keys as $key) {
        $value = (int)($scores[$key] ?? 0);
        if ($highest === null || $value > $highest) {
            $highest = $value;
            $tied = array($key);
        } elseif ($value === $highest) {
            $tied[] = $key;
        }
    }
    if (count($tied) <= 1) {
        return $tied[0] ?? $keys[0];
    }

    for ($i = count($answerTrace) - 1; $i >= 0; $i--) {
        foreach (($answerTrace[$i]['scores'] ?? array()) as $key => $value) {
            if ((int)$value !== 0 && in_array($key, $tied, true)) {
                return $key;
            }
        }
    }

    foreach ($tiePriority as $key) {
        if (in_array($key, $tied, true)) {
            return $key;
        }
    }
    return $tied[0];
}

function nala_enrollment_selected_answers($config, $answers) {
    $options = nala_enrollment_index_options($config);
    $selected = array();
    foreach (($config['questions'] ?? array()) as $question) {
        $questionId = (string)($question['id'] ?? '');
        if ($questionId === '' || !isset($answers[$questionId])) {
            continue;
        }
        $answerValue = $answers[$questionId];
        $answerIds = is_array($answerValue) ? $answerValue : array($answerValue);
        foreach ($answerIds as $answerId) {
            $answerId = (string)$answerId;
            if (isset($options[$questionId][$answerId])) {
                $selected[] = array(
                    'questionId' => $questionId,
                    'questionTitle' => $question['title'] ?? $questionId,
                    'answerId' => $answerId,
                    'answerLabel' => $options[$questionId][$answerId]['label'] ?? $answerId,
                    'scores' => $options[$questionId][$answerId]['scores'] ?? array(),
                    'rationale' => $options[$questionId][$answerId]['rationale'] ?? '',
                    'uiCopyEffect' => $options[$questionId][$answerId]['uiCopyEffect'] ?? ''
                );
            }
        }
    }
    return $selected;
}

function nala_enrollment_score($config, $answers) {
    $scoreKeys = array_merge(
        array_column($config['scoreKeys']['blueprints'] ?? array(), 'key'),
        array_column($config['scoreKeys']['overlays'] ?? array(), 'key'),
        array_column($config['scoreKeys']['themes'] ?? array(), 'key')
    );
    $scores = array_fill_keys($scoreKeys, 0);
    $selected = nala_enrollment_selected_answers($config, $answers);

    foreach ($selected as $selectedAnswer) {
        foreach (($selectedAnswer['scores'] ?? array()) as $key => $value) {
            if (!isset($scores[$key])) {
                $scores[$key] = 0;
            }
            $scores[$key] += (int)$value;
        }
    }

    $blueprintKeys = array_column($config['scoreKeys']['blueprints'] ?? array(), 'key');
    $themeKeys = array_column($config['scoreKeys']['themes'] ?? array(), 'key');
    $primaryKey = nala_enrollment_select_highest($scores, $blueprintKeys, $selected, array('BUSINESS', 'CAREER_CHANGE', 'SIDE_INCOME', 'EMPLOYMENT'));
    $themeKey = nala_enrollment_select_highest($scores, $themeKeys, $selected, array('INCOME', 'OWNERSHIP', 'SECURITY', 'FAMILY', 'FRESH_START', 'MOMENTUM'));

    $overlays = array();
    foreach (($config['scoreKeys']['overlays'] ?? array()) as $overlay) {
        $key = $overlay['key'] ?? '';
        $threshold = $key === 'FAST_TRACK' ? 8 : 8;
        if ($key !== '' && (int)($scores[$key] ?? 0) >= $threshold) {
            $name = $overlay['label'] ?? $key;
            $overlayItem = nala_enrollment_find_by_name($config['overlays'] ?? array(), $name);
            if (is_array($overlayItem)) {
                $overlays[] = $overlayItem + array('scoreKey' => $key, 'score' => (int)$scores[$key], 'threshold' => $threshold);
            }
        }
    }

    $blueprint = nala_enrollment_blueprint_item($config, $primaryKey);
    $themeLabels = nala_enrollment_score_labels($config['scoreKeys']['themes'] ?? array());
    $theme = nala_enrollment_find_by_name($config['themes'] ?? array(), $themeLabels[$themeKey] ?? $themeKey);
    if (!is_array($theme)) {
        $theme = array('id' => nala_enrollment_slug($themeKey), 'name' => $themeLabels[$themeKey] ?? $themeKey);
    }

    $blueprintSlug = nala_enrollment_slug($blueprint['name'] ?? $primaryKey);
    $result = array(
        'primaryBlueprintKey' => $primaryKey,
        'themeKey' => $themeKey,
        'blueprint' => $blueprint,
        'theme' => $theme,
        'overlays' => $overlays,
        'scores' => $scores,
        'selectedAnswers' => $selected,
        'assembly' => array(
            'title' => $blueprint['result_title'] ?? (($blueprint['name'] ?? 'Enrollment') . ' Blueprint'),
            'subtitle' => $blueprint['subtitle'] ?? '',
            'why' => $blueprint['why_this_blueprint'] ?? '',
            'studyPace' => $blueprint['study_pace'] ?? '',
            'timeline' => $blueprint['timeline'] ?? '',
            'revenuePotential' => $blueprint['revenue_potential'] ?? '',
            'nextMilestone' => $blueprint['next_milestone'] ?? '',
            'ctaButton' => $blueprint['cta_button'] ?? 'Start Training',
            'ctaHelperText' => $blueprint['cta_helper_text'] ?? '',
            'themeEffect' => $theme['blueprintEffects'][$blueprintSlug] ?? ($theme['global_effect'] ?? ''),
            'overlayEffects' => array_values(array_filter(array_map(function($overlay) use ($blueprintSlug) {
                return $overlay['blueprintEffects'][$blueprintSlug] ?? ($overlay['module_body'] ?? '');
            }, $overlays))),
        )
    );

    return $result;
}

function nala_enrollment_save_submission($config, $profile, $answers, $result) {
    $pdo = nala_enrollment_db();
    $record = array(
        'created_at' => gmdate('c'),
        'config_version' => (string)($config['version'] ?? ''),
        'name' => nala_enrollment_clean($profile['name'] ?? '', 160),
        'email' => nala_enrollment_clean($profile['email'] ?? '', 240),
        'phone' => nala_enrollment_clean($profile['phone'] ?? '', 80),
        'answers' => $answers,
        'scores' => $result['scores'] ?? array(),
        'result' => $result,
        'user_agent' => nala_enrollment_clean($_SERVER['HTTP_USER_AGENT'] ?? '', 500),
        'ip_hash' => ((string)($_SERVER['REMOTE_ADDR'] ?? '')) !== '' ? hash('sha256', (string)$_SERVER['REMOTE_ADDR']) : ''
    );

    if (!$pdo) {
        $file = nala_enrollment_data_dir() . '/enrollment_submissions.jsonl';
        $id = time() . '-' . substr(hash('sha256', json_encode($record)), 0, 10);
        $record['id'] = $id;
        file_put_contents($file, json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
        return $id;
    }

    $stmt = $pdo->prepare('INSERT INTO submissions (
        created_at, config_version, name, email, phone, answers_json, scores_json, result_json, user_agent, ip_hash
    ) VALUES (
        :created_at, :config_version, :name, :email, :phone, :answers_json, :scores_json, :result_json, :user_agent, :ip_hash
    )');
    $stmt->execute(array(
        ':created_at' => $record['created_at'],
        ':config_version' => $record['config_version'],
        ':name' => $record['name'],
        ':email' => $record['email'],
        ':phone' => $record['phone'],
        ':answers_json' => json_encode($record['answers'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ':scores_json' => json_encode($record['scores'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ':result_json' => json_encode($record['result'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ':user_agent' => $record['user_agent'],
        ':ip_hash' => $record['ip_hash']
    ));
    return (int)$pdo->lastInsertId();
}
?>
