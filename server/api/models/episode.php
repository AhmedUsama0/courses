<?php
namespace Api\Models;

class Episode
{
    private string $episode;
    private string  $episode_name;
    private int $course_id;
    private float  $episode_duration;

    public function __construct(private \PDO $conn)
    {
    }

    public function setEpisode(array $episode): void
    {
        $target = __DIR__ . "/../uploads/" . basename($episode["name"]);
        $episodeExtension = strtolower(pathinfo($target, PATHINFO_EXTENSION));
        if ($episode["size"] > 0) {
            if ($this->isEpisodeValid($episodeExtension)) {
                $this->episode = basename($episode["name"]);
                move_uploaded_file($episode["tmp_name"], $target);
            } else {
                http_response_code(400);
                echo json_encode(array("invalidEpisode" => "invalid video. please upload video in format mp4 or mkv"));
                exit();
            }
        }
    }

    private function isEpisodeValid(string $episodeExtension): bool
    {
        $allowedExtensions = array("mp4", "mkv");
        if (!in_array($episodeExtension, $allowedExtensions)) {
            return false;
        }

        return true;
    }

    public function setCourseId(int $course_id): void
    {
        $this->course_id = filter_var($course_id, FILTER_SANITIZE_NUMBER_INT);
        $this->course_id = str_replace(array("+", "-"), "", $this->course_id);
    }

    public function setEpisodeName(string $episode_name): void
    {
        $this->episode_name = filter_var($episode_name, FILTER_SANITIZE_STRING);
    }

    public function setEpisodeDuration( float $episode_duration): void
    {
        $this->episode_duration = $episode_duration;
    }

    public function createEpisode(): void
    {
        try {

            if (empty($this->episode) || empty($this->episode_name)) {
                throw new \InvalidArgumentException("episode name and image are required");
            }

            $query = "INSERT INTO episodes (episode,episode_name,episode_duration,course_id) VALUES (?,?,?,?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $this->episode,
                $this->episode_name,
                $this->episode_duration,
                $this->course_id
            ]);
            echo json_encode(array("success" => "episode is created sucessfully"));
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(array("serverError" => "internal server error"));
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(array("invalidData" => $e->getMessage()));
        }
    }


    public function getEpisodesByCourseId()
    {
        try {
            $query = "SELECT episodes.id as episode_id,episode,episode_name,COALESCE(SUM(likes),0) as number_of_likes,
            COALESCE(SUM(dislikes),0) as number_of_dislikes FROM interactions 
            RIGHT JOIN episodes ON interactions.episode_id = episodes.id WHERE episodes.course_id = ? GROUP BY episodes.id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $this->course_id
            ]);

            $episodes = [];
            if ($stmt->rowCount() !== 0) {
                while ($episode = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                    array_push($episodes, $episode);
                }
            }
            return $episodes;
        } catch (\PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(array("serverError" => "internal server error"));
            exit();
        }
    }
}
