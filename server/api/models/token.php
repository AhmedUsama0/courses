<?php
namespace Api\Models;
class Token
{
    private static $SECRET_KEY = "Ahmed";
    private static $userData;
    private static $token;

    public static function getUserData()
    {
        return self::$userData;
    }

    public static function setToken($token)
    {

        self::$token = $token;
    }

    public static function generateToken($user_id, $role)
    {
        $exp = time() + (60 * 60);

        $userData = array(
            "user_id" => $user_id,
            "role" => $role,
            "exp" => $exp
        );

        $jsonData = json_encode($userData);

        $token = base64_encode($jsonData . self::$SECRET_KEY);

        return $token;
    }

    public static function isTokenValid()
    {
        $decodedToken  = base64_decode(self::$token);
        $jsonData           = substr($decodedToken, 0, -strlen(self::$SECRET_KEY));

        if (self::$token === base64_encode($jsonData . self::$SECRET_KEY)) {
            self::$userData = json_decode($jsonData, true);
            return true;
        }

        return false;
    }
    public static function isTokenExpired()
    {
        $exp = self::$userData["exp"];

        if (time() > $exp) {

            return true;
        }

        return false;
    }
}
