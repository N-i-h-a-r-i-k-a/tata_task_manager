
<?php
require_once __DIR__ . "/../config/bootstrap.php";

if (empty($_SESSION["csrf_token"])) {
    generateCsrf();
}

respond(true, "Security token ready.", [
    "csrf_token" => $_SESSION["csrf_token"]
]);
