<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Headers: Authorization");

require_once __DIR__ . "/../../../vendor/autoload.php";

use Config\Database;
use Api\Models\Course;
use Api\Models\Episode;
use Api\Models\Token;

// get request headers
$headers = apache_request_headers();

// check if the authorization header exist
if (isset($headers["Authorization"])) {

    // check the type of authorization to be bearer
    if (substr($headers["Authorization"], 0, 7) === "Bearer ") {

        // extract the token
        $token = substr($headers["Authorization"], 7);

        Token::setToken($token);

        if (!Token::isTokenValid()) {
            http_response_code(401);
            echo json_encode(array("authorizationError" => "Unauthorized. please login again"));
            exit();
        }

        if (Token::isTokenExpired()) {
            http_response_code(401);
            echo json_encode(array("authorizationError" => "token is expired. please login again"));
            exit();
        }

        // retreive the user id from the token
        $user_id = Token::getUserData()["user_id"];

        // connect to database
        $database = new Database();
        $conn = $database->connect();


        // get episodes with course id
        $episode = new Episode($conn);
        $episode->setCourseId($_GET["course_id"]);
        $episodes = $episode->getEpisodesByCourseId();


        // get the owner id of the course
        $course = new Course($conn);
        $course->setCourseId($_GET["course_id"]);
        $owner_id = $course->readOneCourse()["owner_id"];

        $response = array(
            "user_id" => $user_id,
            "owner_id" => $owner_id
        );

        // response if there are epsiodes
        if (count($episodes) > 0) {
            $response["data"] = $episodes;
        }
        // response if there are no episodes
        else {
            http_response_code(404);
            $response["episodesError"] = "no episodes found";
        }

        echo json_encode($response);
    }
}
