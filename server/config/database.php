<?php
namespace Config;
class Database
{
    private $conn;
    private $host = "localhost";
    private $username = "root";
    private $password = "";
    private $charset = "utf8mb4";
    private $dbname = "rich_your_mind";

    public function connect()
    {
        try {
            $this->conn = new \PDO("mysql:host=$this->host;dbname=$this->dbname;charset=$this->charset", $this->username, $this->password);
            $this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(array("serverError" => "internal server error"));
            exit();
        }
    }
}
