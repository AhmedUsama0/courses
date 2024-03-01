<?php

namespace Api\Models;

use Api\Models\Token;

require_once __DIR__ . "/../../vendor/autoload.php";

class User
{
    private $user_id;
    private $username;
    private $email;
    private $password;
    private $role;
    private $image;

    public function __construct(private \PDO $conn)
    {
    }

    public function setUserId($user_id)
    {
        $this->user_id = $user_id;
    }
    public function setUserName($username)
    {
        if (!preg_match('/^[A-Z][a-z0-9]{3,7}$/', $username)) {
            throw new \InvalidArgumentException(json_encode(
                [
                    "usernameError" => " invalid username. username must start with capital letter followed by letters or numbers and be 3-7 in length."
                ]
            ));
        }
        $this->username = filter_var($username, FILTER_SANITIZE_STRING);
    }
    public function setEmail($email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($email)) {
            throw new \InvalidArgumentException(json_encode(["emailError" => "invalid email format"]));
        }

        $this->email = filter_var($email, FILTER_SANITIZE_EMAIL);
    }
    public function setPassword($password, bool $hash_password)
    {
        if (strlen($password) < 8 || empty($password)) {
            throw new \InvalidArgumentException(json_encode(["passwordError" => " password is invalid. password should contains at least one capital letter, one special character,one digit and 8 in length."]));
        }
        if (!$hash_password) {
            $this->password = $password;
            return;
        }

        $this->password = password_hash($password, PASSWORD_DEFAULT);
    }

    public function setImage($image)
    {
        $check = getimagesize($image["tmp_name"]);
        $dir = __DIR__ . "/../uploads/";
        $image_extension = strtolower(pathinfo($dir . basename($image["name"]), PATHINFO_EXTENSION));
        $allowed_image_extensions = ["jpg", "png", "jpeg"];

        if (!$check) {
            http_response_code(415);
            echo json_encode(["invalidImage" => "file is not an image."]);
            exit();
        }

        if (!in_array($image_extension, $allowed_image_extensions)) {
            http_response_code(415);
            echo json_encode(["invalidImage" => "unsupported file type"]);
            exit();
        }

        if ($image["size"] > 200000) {
            http_response_code(413);
            echo json_encode(["invalidImage" => "image size is too large."]);
            exit();
        }
        $this->image = $image;
    }
    public function setRole($role)
    {
        if (!in_array($role, array("student", "teacher"))) {
            throw new \InvalidArgumentException("invalid role");
        }
        $this->role = filter_var($role, FILTER_SANITIZE_STRING);
    }
    public function createNewUser()
    {
        try {
            $query = "INSERT INTO users (username,email,password,role,image) VALUES(?,?,?,?,?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $this->username,
                $this->email,
                $this->password,
                $this->role,
                $this->image ?? "user.png"
            ]);
            echo json_encode(array("success" => "account is created successfully"));
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(array("serverError" => "internal server error"));
        }
    }

    public function authenticate()
    {
        try {
            $query = "SELECT * FROM users WHERE email =  ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $this->email
            ]);

            if ($stmt->rowCount() === 0) {
                throw new \InvalidArgumentException(json_encode(["emailError" => "email does not exist"]));
            }

            $user = $stmt->fetch(\PDO::FETCH_ASSOC);
            extract($user);

            if (!password_verify($this->password, $password)) {
                throw new \InvalidArgumentException(json_encode(["passwordError" => "password is not correct"]));
            }
            $token = Token::generateToken($id, $role);

            echo json_encode(
                array(
                    "success" => "authenticated successfully",
                    "token" => $token,
                    "username" => $username,
                    "role" => $role,
                    "image" => $image
                )
            );
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(array("serverError" => "internal server error"));
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            echo $e->getMessage();
        }
    }

    public function changeImage()
    {
        try {
            $dir = __DIR__ . "/../../uploads/";
            $imagePath = $dir . basename($this->image["name"]);
            if (move_uploaded_file($this->image["tmp_name"], $imagePath)) {

                $query = "UPDATE users SET image = ? WHERE id= ?";
                $stmt = $this->conn->prepare($query);

                $stmt->execute([
                    basename($this->image["name"]),
                    $this->user_id,
                ]);

                echo json_encode([
                    "success" => "image is changed successfully.",
                    "image" => basename($this->image["name"])
                ]);
            }
        } catch (\PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(["serverError" => "internal server error"]);
            exit();
        }
    }
}
