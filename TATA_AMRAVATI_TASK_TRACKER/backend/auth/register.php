
<?php
require_once __DIR__ . "/../config/bootstrap.php";

requireMethod("POST");
verifyCsrf();

$data = getInput();

$name = trim($data["name"] ?? "");
$email = strtolower(trim($data["email"] ?? ""));
$password = $data["password"] ?? "";

if (strlen($name) < 2 || strlen($name) > 100) {
    respond(false, "Name must contain 2 to 100 characters.", [], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 150) {
    respond(false, "Enter a valid email address.", [], 422);
}

if (!is_string($password) || strlen($password) < 8 || strlen($password) > 72) {
    respond(false, "Password must contain 8 to 72 characters.", [], 422);
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->fetch()) {
    respond(false, "This email is already registered.", [], 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
);

$stmt->execute([$name, $email, $hash]);

session_regenerate_id(true);

$_SESSION["user_id"] = (int)$pdo->lastInsertId();
$_SESSION["user_name"] = $name;

generateCsrf();

respond(true, "Account created successfully.", [
    "name" => $name
], 201);
