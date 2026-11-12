
<?php

// Start the session securely
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        "httponly" => true,
        "secure" => !empty($_SERVER["HTTPS"]) &&
                    $_SERVER["HTTPS"] !== "off",
        "samesite" => "Lax",
        "path" => "/"
    ]);

    session_start();
}

// Set JSON response header
header("Content-Type: application/json; charset=utf-8");

// Connect to MySQL database
require_once __DIR__ . "/database.php";


// Send a standard JSON response
function respond($success, $message, $data = [], $status = 200) {
    http_response_code($status);

    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ]);

    exit;
}


// Check HTTP request method
function requireMethod($method) {
    if ($_SERVER["REQUEST_METHOD"] !== strtoupper($method)) {
        respond(false, "Method not allowed.", [], 405);
    }
}


// Read JSON input from frontend
function getInput() {
    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    return is_array($input) ? $input : [];
}


// Check whether the user is logged in
function requireLogin() {
    if (empty($_SESSION["user_id"])) {
        respond(false, "Please log in to continue.", [], 401);
    }
}


// Generate a secure CSRF token
function generateCsrf() {
    $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
}


// Verify the CSRF token sent by frontend
function verifyCsrf() {
    $token = $_SERVER["HTTP_X_CSRF_TOKEN"] ?? "";

    if (
        empty($_SESSION["csrf_token"]) ||
        !is_string($token) ||
        !hash_equals($_SESSION["csrf_token"], $token)
    ) {
        respond(
            false,
            "Security token expired. Refresh the page and try again.",
            [],
            403
        );
    }
}
