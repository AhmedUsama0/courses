<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json;charset=utf-8");

require_once __DIR__  . "/../../../vendor/autoload.php";

use Api\Models\User;
use Config\Database;

try {
    if (empty($_POST["email"]) &&  empty($_POST["password"])) {
        throw new InvalidArgumentException(json_encode(
            [
                "emailError" => "invalid email format",
                "passwordError" => "Invalid Password. Password Must Be 8 In Length."
            ]
        ));
    }
    $database = new Database();
    $conn = $database->connect();

    $user = new User($conn);
    $user->setEmail($_POST["email"]);
    $user->setPassword($_POST["password"], false);
    $user->authenticate();
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo $e->getMessage();
}
