<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$db_file = 'database.json';

// Базові сторінки за замовчуванням
if (!file_exists($db_file)) {
    $initialData = [
        "pages" => [
            ["id" => "index.html", "title" => "Головна", "url" => "index.html"],
            ["id" => "news.html", "title" => "Новини", "url" => "news.html"],
            ["id" => "info.html", "title" => "Інформація про заклад", "url" => "info.html"],
            ["id" => "rules.html", "title" => "Зарахування і навчання", "url" => "rules.html"],
            ["id" => "parents.html", "title" => "Батькам", "url" => "parents.html"],
            ["id" => "students.html", "title" => "Учням", "url" => "students.html"],
            ["id" => "war-time.html", "title" => "Навчання під час воєнного стану", "url" => "war-time.html"],
            ["id" => "safety.html", "title" => "Безпека життєдіяльності", "url" => "safety.html"],
            ["id" => "gallery.html", "title" => "Галерея", "url" => "gallery.html"]
        ],
        "news" => [
            ["id" => 1, "title" => "Виховна година \"Увага! Інтернет!\"", "url" => "#", "imgClass" => "img-news-1"],
            ["id" => 2, "title" => "Профорієнтаційна година \"Світ професій\"", "url" => "#", "imgClass" => "img-news-2"]
        ],
        "contents" => []
    ];
    file_put_contents($db_file, json_encode($initialData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

$action = $_GET['action'] ?? '';

// 1. Віддача даних для всього світу
if ($action === 'get') {
    echo file_get_contents($db_file);
    exit;
}

// 2. Прийом даних від директора (із захистом пароля)
if ($action === 'save') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (($input['password'] ?? '') === 'director2026') {
        file_put_contents($db_file, json_encode($input['data'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        echo json_encode(["status" => "success"]);
    } else {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Невірний пароль"]);
    }
    exit;
}
?>