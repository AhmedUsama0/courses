<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Headers:Authorization");

require_once __DIR__ . "/../../../vendor/autoload.php";

use Config\Database;
use Api\Models\Course;
use Api\Models\Episode;
use Api\Models\Token;

$headers = apache_request_headers();

if (isset($headers["Authorization"])) {

    if (substr($headers["Authorization"], 0, 7) === "Bearer ") {

        $token = substr($headers["Authorization"], 7);

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

        $course = new Course($conn);
        $course->setCourseId($_POST["course_id"]);
        $owner_id = $course->readOneCourse()["owner_id"];

        $user_id = Token::getUserData()["user_id"];
        
        // check if the user is the owner of the course
        if ($user_id !== $owner_id) {
            http_response_code(403);
            echo json_encode(array("authorizedError" => "you are not the owner of the course"));
            exit();
        }

        $episode = new Episode($conn);
        $episode->setEpisode($_FILES["uploadedEpisode"]);
        $episode->setEpisodeName($_POST["episodeName"]);
        $episode->setEpisodeDuration($_POST["episodeDuration"]);
        $episode->setCourseId($_POST["course_id"]);
        $episode->createEpisode();
    }
}
