
<?php
require_once __DIR__ . "/../config/bootstrap.php";

requireMethod("POST");
verifyCsrf();

$data = getInput();

$email = strtolower(trim($data["email"] ?? ""));
$password = $data["password"] ?? "";

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !is_string($password)) {
    respond(false, "Invalid email or password.", [], 422);
}

$stmt = $pdo->prepare(
    "SELECT id, name, password FROM users WHERE email = ?"
);

$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user["password"])) {
    respond(false, "Incorrect email or password.", [], 401);
}

session_regenerate_id(true);

$_SESSION["user_id"] = (int)$user["id"];
$_SESSION["user_name"] = $user["name"];

generateCsrf();

respond(true, "Login successful.", [
    "name" => $user["name"]
]);
