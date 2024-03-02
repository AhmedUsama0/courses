<?php

use Api\Models\Episode;
use Api\Models\Token;
use Config\Database;

header("Access-Control-Allow-Origin: *");
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Headers: Authorization");

require_once __DIR__ . "/../../../vendor/autoload.php";

$headers = apache_request_headers();

if(isset($headers["Authorization"])) {
    if(substr($headers["Authorization"],0,7) === "Bearer ") {
        $token = substr($headers["Authorization"],7);
        Token::setToken($token);

        if (!Token::isTokenValid()) {
            http_response_code(401);
            echo json_encode(array("authorizedError" => "Unauthorized. please login again"));
            exit();
        }

        if (Token::isTokenExpired()) {
            http_response_code(401);
            echo json_encode(array("authorizedError" => "token is epxired. please login again"));
            exit();
        }

        $database = new Database();
        $conn = $database->connect();

        $episode = new Episode($conn);
        $episode->setEpisodeId($_POST["episode_id"]);
        $episode->deleteEpisode();
    }
}