
<?php

require_once __DIR__ . "/../config/bootstrap.php";

// Only allow POST requests
requireMethod("POST");

// Verify logged-in user
requireLogin();

// Verify CSRF token
verifyCsrf();

// Read frontend JSON data
$input = getInput();

$id = filter_var($input["id"] ?? null, FILTER_VALIDATE_INT);
$title = trim($input["title"] ?? "");
$description = trim($input["description"] ?? "");
$status = trim($input["status"] ?? "");

// Validate task ID
if (!$id || $id <= 0) {
    respond(false, "Invalid task ID.", [], 400);
}

// Validate title
if ($title === "") {
    respond(false, "Task title is required.", [], 422);
}

if (strlen($title) > 150) {
    respond(false, "Task title must not exceed 150 characters.", [], 422);
}

// Validate description
if (strlen($description) > 10000) {
    respond(false, "Description is too long.", [], 422);
}

// Validate status
$allowedStatuses = ["Pending", "In Progress", "Completed"];

if (!in_array($status, $allowedStatuses, true)) {
    respond(false, "Please select a valid task status.", [], 422);
}

try {

    // Update only the logged-in user's task
    $sql = "UPDATE tasks
            SET title = ?,
                description = ?,
                status = ?
            WHERE id = ?
            AND user_id = ?";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $title,
        $description,
        $status,
        $id,
        $_SESSION["user_id"]
    ]);

    // Check whether the task belongs to the user
    if ($stmt->rowCount() === 0) {

        $check = $pdo->prepare(
            "SELECT id FROM tasks WHERE id = ? AND user_id = ?"
        );

        $check->execute([
            $id,
            $_SESSION["user_id"]
        ]);

        if (!$check->fetch()) {
            respond(false, "Task not found.", [], 404);
        }
    }

    respond(true, "Task updated successfully.", [
        "task_id" => $id
    ]);

} catch (PDOException $e) {

    error_log("Update task error: " . $e->getMessage());

    respond(false, "Unable to update task. Please try again.", [], 500);
}
