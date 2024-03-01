<?php
namespace Api\Models;
class Interaction
{
    private \PDO $conn;
    private $episode_id;
    private $user_id;


    private $interaction;
    private $interaction_type;

    public function __construct(\PDO $conn)
    {
        $this->conn = $conn;
    }

    public function setEpisodeId($episode_id)
    {
        $this->episode_id = $episode_id;
    }

    public function setUserId($user_id)
    {
        $this->user_id = $user_id;
    }

    public function setInteractionType($interaction_type)
    {
        $this->interaction_type = $interaction_type;
    }


    private function addInteraction(): void
    {
        if ($this->interaction_type === "like") {
            $query = "INSERT INTO interactions (likes,episode_id,user_id) VALUES (1,?,?)";
        } else {
            $query = "INSERT INTO interactions (dislikes,episode_id,user_id) VALUES (1,?,?)";
        }
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $this->episode_id,
                $this->user_id,
            ]);
            echo json_encode(array("message" => "interaction added successfully"));
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(array("serverError" => "internal server error"));
            exit();
        }
    }


    private function updateInteraction(): void
    {
        if ($this->interaction_type === "like") {
            $query = "UPDATE interactions SET likes = 1, dislikes = 0 WHERE episode_id = ? AND user_id = ?";
        } else {
            $query = "UPDATE interactions SET likes = 0, dislikes = 1 WHERE episode_id = ? AND user_id = ?";
        }

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $this->episode_id,
                $this->user_id,
            ]);
            echo json_encode(array("message" => "interaction updated successfully"));
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(array("serverError" => "internal server error"));
            exit();
        }
    }

    private function deleteInteraction(): void
    {
        try {
            $query = "DELETE FROM interactions  WHERE episode_id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $this->episode_id,
                $this->user_id,
            ]);
            echo json_encode(array("message" => "interaction deleted successfully"));
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(array("serverError" => "internal server error"));
            exit();
        }
    }


    public function setInteraction(): void
    {
        if ($this->isUserInteractedWithTheEpisode()) {
            if ($this->interaction_type === "like" && $this->interaction["likes"] === 1) {
                $this->deleteInteraction();
            }
            if ($this->interaction_type === "like" && $this->interaction["dislikes"] === 1) {
                $this->updateInteraction();
            }

            if ($this->interaction_type === "dislike" && $this->interaction["dislikes"] === 1) {
                $this->deleteInteraction();
            }

            if ($this->interaction_type === "dislike" && $this->interaction["likes"] === 1) {
                $this->updateInteraction();
            }
        } else {
            $this->addInteraction();
        }
    }
    private function isUserInteractedWithTheEpisode(): bool
    {
        try {
            $query = "SELECT * FROM interactions WHERE user_id = ? AND episode_id = ?";
            $stmt  = $this->conn->prepare($query);
            $stmt->execute([
                $this->user_id,
                $this->episode_id,
            ]);

            if ($stmt->rowCount() > 0) {
                $this->interaction = $stmt->fetch(\PDO::FETCH_ASSOC);
                return true;
            }

            return false;
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(array("serverError" => "internal server error"));
            exit();
        }
    }
}
