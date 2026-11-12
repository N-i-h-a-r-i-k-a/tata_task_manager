
<?php
require_once __DIR__ . "/../config/bootstrap.php";

requireMethod("GET");
requireLogin();

$userId = $_SESSION["user_id"];

$search = trim($_GET["search"] ?? "");
$status = $_GET["status"] ?? "All";

$sql = "SELECT id, title, description, status, created_at
        FROM tasks WHERE user_id = ?";

$params = [$userId];

if ($search !== "") {
    $sql .= " AND title LIKE ?";
    $params[] = "%" . $search . "%";
}

$allowed = ["Pending", "In Progress", "Completed"];

if (in_array($status, $allowed, true)) {
    $sql .= " AND status = ?";
    $params[] = $status;
}

$sql .= " ORDER BY created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$tasks = $stmt->fetchAll();

$countStmt = $pdo->prepare(
    "SELECT
        COUNT(*) AS total,
        COALESCE(SUM(status = 'Pending'), 0) AS pending,
        COALESCE(SUM(status = 'In Progress'), 0) AS in_progress,
        COALESCE(SUM(status = 'Completed'), 0) AS completed
     FROM tasks
     WHERE user_id = ?"
);

$countStmt->execute([$userId]);
$counts = $countStmt->fetch();

respond(true, "Tasks loaded successfully.", [
    "tasks" => $tasks,
    "counts" => $counts,
    "user" => [
        "name" => $_SESSION["user_name"]
    ]
]);
