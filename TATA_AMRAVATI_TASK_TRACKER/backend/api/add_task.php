
<?php
require_once __DIR__ . "/../config/bootstrap.php";

requireMethod("POST");
requireLogin();
verifyCsrf();

$data = getInput();

$title = trim($data["title"] ?? "");
$description = trim($data["description"] ?? "");
$status = $data["status"] ?? "Pending";

$allowed = ["Pending", "In Progress", "Completed"];

if ($title === "" || strlen($title) > 150) {
    respond(false, "Title is required and must be at most 150 characters.", [], 422);
}

if (!is_string($description) || strlen($description) > 10000) {
    respond(false, "Description is too long.", [], 422);
}

if (!in_array($status, $allowed, true)) {
    respond(false, "Invalid task status.", [], 422);
}

$stmt = $pdo->prepare(
    "INSERT INTO tasks (user_id, title, description, status)
     VALUES (?, ?, ?, ?)"
);

$stmt->execute([
    $_SESSION["user_id"],
    $title,
    $description,
    $status
]);

respond(true, "Task added successfully.", [
    "id" => (int)$pdo->lastInsertId()
], 201);
