<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit2765cca074871d8c52de7391711badf7
{
    public static $prefixLengthsPsr4 = array (
        'C' => 
        array (
            'Config\\' => 7,
        ),
        'A' => 
        array (
            'Api\\Models\\' => 11,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Config\\' => 
        array (
            0 => __DIR__ . '/../..' . '/config',
        ),
        'Api\\Models\\' => 
        array (
            0 => __DIR__ . '/../..' . '/api/models',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit2765cca074871d8c52de7391711badf7::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit2765cca074871d8c52de7391711badf7::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit2765cca074871d8c52de7391711badf7::$classMap;

        }, null, ClassLoader::class);
    }
}