
<?php
require_once __DIR__ . "/../config/bootstrap.php";

requireMethod("POST");
requireLogin();
verifyCsrf();

$data = getInput();
$id = filter_var($data["id"] ?? null, FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    respond(false, "Invalid task ID.", [], 422);
}

$stmt = $pdo->prepare(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?"
);

$stmt->execute([
    $id,
    $_SESSION["user_id"]
]);

if ($stmt->rowCount() === 0) {
    respond(false, "Task not found or access denied.", [], 404);
}

respond(true, "Task deleted successfully.");
