<?php
return [
    'settings' => [
        'determineRouteBeforeAppMiddleware' => true, # https://github.com/slimphp/Slim/issues/1505
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        // debug
        'debug' => true,
        'mode' => 'development',

        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        // Renderer settings
        'twig' => [
            'template_path' => __DIR__ . '/../templates',
            'twig' => [
                'cache' => false, //__DIR__ . '/../cache/twig',
                'debug' => true,
                'auto_reload' => true
            ]
        ],

        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => __DIR__ . '/../logs/app_' . date('Y-m', time()) . '.log',
            'level' => \Monolog\Logger::DEBUG,
        ],

        // Eloquent
        'db' => [
            'driver' => 'mysql',
            'host' => '',
            'database' => '',
            'username' => '',
            'password' => '',
            'charset'   => 'utf8',
            'collation' => 'utf8_general_ci',
            'prefix'    => '',
        ],

        // store
        'store' => [
            'local' => [
                'path' => __DIR__ . '/../local_store'
            ]
        ],


        // public path
        'public_path' => __DIR__ . '/../public/',

        // callback header
        'callback' => [
            'header' => 'X-Inner-Call',
            'value' => 'kzdamp-file-process-callback'
        ],

        // secret key
        'secret' => 'secret string for kz-damp',

        'wechat'=>[
            'app_id'  => '',         // AppID
            'secret'  => '',     // AppSecret
            'token'   => '',          // Token
            'aes_key' => '',                    // EncodingAESKey，安全模式下请一定要填写！！
            'oauth' => [
                'scopes'   => ['snsapi_userinfo'],
                'callback' => '/oauth_callback',
            ],
            'payment' => [
                'merchant_id'        => 'your-mch-id',
                'key'                => 'key-for-signature',
                'cert_path'          => 'path/to/your/cert.pem', // XXX: 绝对路径！！！！
                'key_path'           => 'path/to/your/key',      // XXX: 绝对路径！！！！
            ],

        ]
    ],
];
