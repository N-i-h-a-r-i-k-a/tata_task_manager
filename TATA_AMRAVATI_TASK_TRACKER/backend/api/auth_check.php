
<?php
require_once __DIR__ . "/../config/bootstrap.php";

requireLogin();

respond(true, "Authenticated.", [
    "id" => (int)$_SESSION["user_id"],
    "name" => $_SESSION["user_name"]
]);
