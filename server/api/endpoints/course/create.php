<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json;charset=utf-8");
header('Access-Control-Allow-Headers: Authorization');

require_once __DIR__ . "/../../../vendor/autoload.php";

use Config\Database;
use Api\Models\Course;
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
            echo json_encode(array("authorizedError" => "token is expired. please login again"));
            exit();
        }
        
        $userData = Token::getUserData();
        $role = $userData["role"];

        if ($role !== "teacher") {
            http_response_code(403);
            echo json_encode(array("authorizedError" => "you dont have permission to create a course"));
            exit();
        }
        $database = new Database();
        $conn = $database->connect();

        $course = new Course($conn);
        $course->setCourseName($_POST["course-title"]);
        $course->setCourseImage($_FILES["course-image"]);
        $course->setOwnerId($userData["user_id"]);
        $course->createCourse();
    }
}
