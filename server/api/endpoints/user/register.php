<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json;charset=utf-8");


require_once __DIR__  . "/../../../vendor/autoload.php";


use Config\Database;
use Api\Models\User;

try {
    if (empty($_POST["username"]) || empty($_POST["email"]) || empty($_POST["password"]) || empty($_POST["role"])) {
        throw new InvalidArgumentException(json_encode(["invalidData" => "All fields are required"]));
    }
    $database = new Database();
    $conn = $database->connect();

    $user = new User($conn);
    $user->setUserName($_POST["username"]);
    $user->setEmail($_POST["email"]);
    $user->setPassword($_POST["password"], true);
    $user->setRole($_POST["role"]);
    $user->createNewUser();
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo $e->getMessage();
}
