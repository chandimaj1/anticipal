<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitab37c986c2eae208a0b5fcb5a8a7dd15
{
    public static $files = array (
        'c92bf23a32412037ecdc51806b458c36' => __DIR__ . '/..' . '/alledia/edd-sl-plugin-updater/EDD_SL_Plugin_Updater.php',
    );

    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'PublishPress\\EDD_License\\Core\\' => 30,
            'Psr\\Container\\' => 14,
            'PPVersionNotices\\' => 17,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'PublishPress\\EDD_License\\Core\\' => 
        array (
            0 => __DIR__ . '/..' . '/alledia/wordpress-edd-license-integration/src/core',
        ),
        'Psr\\Container\\' => 
        array (
            0 => __DIR__ . '/..' . '/psr/container/src',
        ),
        'PPVersionNotices\\' => 
        array (
            0 => __DIR__ . '/..' . '/publishpress/wordpress-version-notices/src',
        ),
    );

    public static $prefixesPsr0 = array (
        'P' => 
        array (
            'Pimple' => 
            array (
                0 => __DIR__ . '/..' . '/pimple/pimple/src',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitab37c986c2eae208a0b5fcb5a8a7dd15::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitab37c986c2eae208a0b5fcb5a8a7dd15::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInitab37c986c2eae208a0b5fcb5a8a7dd15::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}
