<?php

namespace Api\Models;

class Course
{
    private string $course_name;
    private string $course_image;
    private int $owner_id;
    private int $course_id;

    public function __construct(private \PDO $conn)
    {
    }
    public function setCourseName(string $course_name): void
    {
        $this->course_name = filter_var($course_name, FILTER_SANITIZE_STRING);
    }


    public function setCourseImage(array $image): void
    {

        $target_file = __DIR__ . "/../uploads/" . basename($image["name"]);

        $file_extension = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        if ($image["size"] > 0) {
            if ($this->isImageValid($file_extension, $image["size"])) {
                $this->course_image = basename($image["name"]);
                move_uploaded_file($image["tmp_name"], $target_file);
            } else {
                http_response_code(400);
                echo json_encode(array("invalidImage" => "invalid image. image should be jpg,jpeg or png format and its size shouldn't exceed 5MB"));
                exit();
            }
        }
    }
    public function setOwnerId(int $owner_id): void
    {
        $this->owner_id = $owner_id;
    }

    public function setCourseId(int $course_id): void
    {
        $this->course_id = $course_id;
    }

    private function isImageValid(string $file_extension, float $image_size): bool
    {
        $allowed_extensions = array("jpg", "jpeg", "png");
        $max_file_size = 5 * 1024 * 1024;
        if (!in_array($file_extension, $allowed_extensions)) {
            return false;
        }
        if ($image_size > $max_file_size) {
            return false;
        }

        return true;
    }

    public function createCourse(): void
    {
        if (empty($this->course_image) || empty($this->course_name)) {
            http_response_code(400);
            echo json_encode(array("invalidData" => "course name and course image are required"));
            exit();
        }
        try {
            $query = "INSERT INTO courses (course_name,course_image,owner_id,course_date) VALUES (?,?,?,Now())";

            $stmt = $this->conn->prepare($query);

            $stmt->execute([
                $this->course_name,
                $this->course_image,
                $this->owner_id,
            ]);

            echo json_encode(array("success" => "course is created successfully"));
        } catch (\PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(array("serverError" => "internal server error. please try again later"));
            exit();
        }
    }

    private function getNumberOfCourses(): int
    {
        $query = "SELECT COUNT(*) as number_of_courses FROM courses";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $number_of_courses = $stmt->fetch(\PDO::FETCH_ASSOC)['number_of_courses'];
        return $number_of_courses;
    }

    public function readCourses(): void
    {
        try {
            $options = array("options" => array(
                "default" => 1,
                "min_range" => 1
            ));
            $page = filter_input(INPUT_GET, "page", FILTER_VALIDATE_INT, $options) ?? 1;
            $number_of_items_per_page = 4;
            $offset = ($page - 1) * $number_of_items_per_page;

            $query = "SELECT COALESCE(SUM(number_of_likes),0) as course_likes,c.*, COALESCE(number_of_episodes_per_course,0) as 
            number_of_episodes_per_course,COALESCE(course_duration,0) as course_duration
            FROM (SELECT episodes.course_id, SUM(likes) as number_of_likes FROM interactions INNER JOIN episodes ON 
            interactions.episode_id = episodes.id GROUP BY episodes.id) t RIGHT JOIN courses c ON c.id = t.course_id LEFT JOIN 
            (SELECT course_id, COUNT(*) as number_of_episodes_per_course FROM episodes GROUP BY episodes.course_id) ep ON ep.course_id = c.id 
            LEFT JOIN (SELECT course_id,SUM(episode_duration) as course_duration FROM episodes GROUP BY episodes.course_id) ed
            ON ed.course_id = c.id
            GROUP BY c.id LIMIT " . $offset . "," . $number_of_items_per_page;


            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(array("coursesError" => "no courses found"));
                exit();
            }

            $number_of_courses = $this->getNumberOfCourses();
            $number_of_pages = ceil($number_of_courses / $number_of_items_per_page);

            $user_courses = [];
            while ($course = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                array_push($user_courses, $course);
            }

            $courses = [
                "courses" => $user_courses,
                "number_of_pages" => $number_of_pages,
            ];
            echo json_encode($courses);
        } catch (\PDOException $e) {
            http_response_code(500);
            error_log($e->getMessage());
            echo json_encode(array("serverError" => "internal server error"));
            exit();
        }
    }

    public function readOneCourse(): array
    {
        try {
            $query = "SELECT * FROM courses WHERE id=?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $this->course_id
            ]);
            $course = $stmt->fetch(\PDO::FETCH_ASSOC);

            return $course;
        } catch (\PDOException $e) {
            http_response_code(500);
            exit();
        }
    }

    public function readMyCourses(): void
    {
        try {
            $query = "SELECT course_name,course_image,courses.id, COALESCE(number_of_episodes_per_course,0) as number_of_episodes_per_course ,
            COALESCE(SUM(episode_duration),0) as course_duration FROM (SELECT course_id,episode_duration, COUNT(*) 
            as number_of_episodes_per_course FROM episodes GROUP BY episodes.course_id) ep RIGHT JOIN courses ON ep.course_id = courses.id
             WHERE owner_id = ? GROUP BY courses.id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $this->owner_id
            ]);

            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(array("coursesError" => "you don't have courses yet."));
                exit();
            }
            $courses = [];
            while ($course = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                array_push($courses, $course);
            }
            echo json_encode($courses);
        } catch (\PDOException $e) {
            http_response_code(500);
            error_log($e->getMessage());
            echo json_encode(array("serverError" => "internal server error"));
            exit();
        }
    }
    public function readRecommendedCourses(): void
    {
        try {
            $query = "SELECT courses.id,COALESCE(SUM(number_of_likes_per_course),0) as course_likes,course_name,course_date,course_image 
            FROM (SELECT SUM(likes) as number_of_likes_per_course,episode_id,episodes.course_id FROM interactions INNER JOIN 
            episodes ON episodes.id = interactions.episode_id GROUP BY episodes.id) t RIGHT JOIN courses ON courses.id = t.course_id
             GROUP BY courses.id ORDER BY course_likes DESC LIMIT 5";

            $stmt = $this->conn->prepare($query);

            $stmt->execute();

            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(array("coursesError" => "no recommended courses found."));
                exit();
            }

            $courses = [];
            while ($course = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                array_push($courses, $course);
            }

            echo json_encode($courses);
        } catch (\PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(array("serverError" => "internal server error"));
            exit();
        }
    }
}
